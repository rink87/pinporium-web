import { NextResponse } from "next/server";
import { Resend } from "resend";

import { PARTNERS_EMAIL } from "@/lib/partners/constants";
import {
  parsePartnerToolsSurveyBody,
  partnerToolsSurveyHtml,
  partnerToolsSurveyPlainText,
  partnerToolsSurveySubject,
} from "@/lib/partners/toolsSurvey";
import { turnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    console.error("RESEND_API_KEY / RESEND_FROM is not configured");
    return NextResponse.json(
      { error: `Survey is temporarily unavailable. Email ${PARTNERS_EMAIL} instead.` },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parsePartnerToolsSurveyBody(body);
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

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: PARTNERS_EMAIL,
      replyTo: parsed.data.email,
      subject: partnerToolsSurveySubject(parsed.data),
      html: partnerToolsSurveyHtml(parsed.data),
      text: partnerToolsSurveyPlainText(parsed.data),
    });

    if (error) {
      console.error("Partner tools survey email failed", error);
      return NextResponse.json(
        { error: `Could not submit. Please try again or email ${PARTNERS_EMAIL}.` },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Partner tools survey email error", err);
    return NextResponse.json(
      { error: `Could not submit. Please try again or email ${PARTNERS_EMAIL}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
