import { NextResponse } from "next/server";

import {
  formatBetaTesterSlackMessage,
  parseBetaTesterBody,
} from "@/lib/betaTester";

export async function POST(request: Request) {
  const webhookUrl = process.env.SLACK_BETA_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("SLACK_BETA_WEBHOOK_URL is not configured");
    return NextResponse.json(
      { error: "Beta sign-up is temporarily unavailable. Email help@pinporium.app instead." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseBetaTesterBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const text = formatBetaTesterSlackMessage(parsed.data);

  try {
    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!slackRes.ok) {
      console.error("Slack webhook failed", slackRes.status, await slackRes.text());
      return NextResponse.json(
        { error: "Could not submit your request. Please try again or email help@pinporium.app." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Slack webhook error", err);
    return NextResponse.json(
      { error: "Could not submit your request. Please try again or email help@pinporium.app." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
