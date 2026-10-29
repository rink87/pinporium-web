import { NextResponse } from "next/server";

import { siteDetails } from "@/data/siteDetails";
import {
  AUTHENTICITY_APPEAL_KIND,
  authenticityAppealPinReferenceId,
  resolveAuthenticityAppealSecret,
  verifyAuthenticityAppealToken,
} from "@/lib/authenticityAppealToken";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { turnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

const UNAVAILABLE_ERROR = `Form is temporarily unavailable. Email ${siteDetails.supportEmail} instead.`;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(request: Request) {
  const secret = resolveAuthenticityAppealSecret();
  if (!secret) {
    return NextResponse.json({ error: UNAVAILABLE_ERROR }, { status: 503 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: UNAVAILABLE_ERROR }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const token = typeof record.token === "string" ? record.token.trim() : "";
  const rawMessage = typeof record.message === "string" ? record.message.trim() : "";
  const message = rawMessage.slice(0, MAX_MESSAGE_LENGTH);
  const turnstileToken =
    typeof record.turnstileToken === "string" ? record.turnstileToken.trim() : "";

  if (!token) {
    return NextResponse.json({ error: "Missing appeal link. Open the link from your email." }, { status: 400 });
  }
  if (message.length < 3) {
    return NextResponse.json(
      { error: "Add a few words about the backstamp, packaging, or where you bought it." },
      { status: 400 },
    );
  }

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

  const payload = verifyAuthenticityAppealToken(token, secret);
  if (!payload) {
    return NextResponse.json(
      {
        error:
          "This link is invalid or has expired. Use I think mine is authentic in the app instead.",
      },
      { status: 400 },
    );
  }

  let username: string | null = null;
  try {
    const { data: profile } = await admin
      .from("profiles")
      .select("username")
      .eq("id", payload.u)
      .maybeSingle();
    username = typeof profile?.username === "string" ? profile.username.trim() || null : null;
  } catch (err) {
    console.warn("authenticity-appeal profile lookup failed", err);
  }

  const metadata = {
    appVersion: "web-appeal",
    buildNumber: null,
    platform: "web",
    osVersion: null,
    deviceModel: null,
    route: "/authenticity-appeal",
    crashRoute: null,
    errorComponent: null,
    username,
    isDemoMode: false,
    pinReferenceId: authenticityAppealPinReferenceId(payload.v ?? payload.o),
    variantReferenceId: payload.v ?? payload.o,
    pinContext: "vault",
    issueCategory: "authenticity",
    collectionItemId: payload.c,
    catalogVariantId: payload.v,
    designName: payload.d || null,
    variantName: null,
    artistName: payload.a || null,
    thumbnailUrl: null,
    appealKind: AUTHENTICITY_APPEAL_KIND,
    appealSource: "email",
    submissionId: payload.s,
    originalVariantId: payload.o,
  };

  const { data, error } = await admin
    .from("app_feedback")
    .insert({
      user_id: payload.u,
      feedback_type: "pin_issue",
      message,
      metadata,
    })
    .select("id")
    .single();

  if (error) {
    console.error("authenticity-appeal insert failed", error.message);
    return NextResponse.json(
      {
        error: `Could not submit your request. Please try again or email ${siteDetails.supportEmail}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
