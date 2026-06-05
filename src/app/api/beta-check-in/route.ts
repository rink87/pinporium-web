import { NextResponse } from "next/server";

import {
  formatBetaActiveFeedbackSlackMessage,
  parseBetaActiveFeedbackBody,
  type BetaActiveFeedbackPayload,
} from "@/lib/betaActiveFeedback";
import {
  formatBetaCheckInSlackMessage,
  parseBetaCheckInBody,
  type BetaCheckInPayload,
} from "@/lib/betaCheckIn";
import { turnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const webhookUrl = process.env.SLACK_BETA_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("SLACK_BETA_WEBHOOK_URL is not configured");
    return NextResponse.json(
      { error: "Check-in is temporarily unavailable. Email help@pinporium.app instead." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawAudience =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).audience
      : undefined;

  const isActive = typeof rawAudience === "string" && rawAudience.trim() === "active";

  const parsed = isActive ? parseBetaActiveFeedbackBody(body) : parseBetaCheckInBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { turnstileToken } = parsed.data;

  if (turnstileRequired()) {
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Please complete the security check and try again." },
        { status: 400 },
      );
    }

    const valid = await verifyTurnstileToken(turnstileToken);
    if (!valid) {
      return NextResponse.json(
        { error: "Security check failed. Please try again." },
        { status: 400 },
      );
    }
  }

  const text = isActive
    ? formatBetaActiveFeedbackSlackMessage(parsed.data as BetaActiveFeedbackPayload)
    : formatBetaCheckInSlackMessage(parsed.data as BetaCheckInPayload);

  try {
    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!slackRes.ok) {
      console.error("Slack webhook failed", slackRes.status, await slackRes.text());
      return NextResponse.json(
        { error: "Could not submit your response. Please try again or email help@pinporium.app." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Slack webhook error", err);
    return NextResponse.json(
      { error: "Could not submit your response. Please try again or email help@pinporium.app." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
