import { NextResponse } from "next/server";

import type { BetaPlatform } from "@/lib/betaTester";
import {
  betaActiveNoPinsCheckInEmailHtml,
  betaActiveNoPinsCheckInEmailSubject,
} from "@/lib/email/templates/betaActiveNoPinsCheckIn";
import {
  betaActiveUserCheckInEmailHtml,
  betaActiveUserCheckInEmailSubject,
} from "@/lib/email/templates/betaActiveUserCheckIn";
import {
  betaNotYetStartedEmailHtml,
  betaNotYetStartedEmailSubject,
} from "@/lib/email/templates/betaNotYetStarted";
import {
  betaSignupReceivedEmailHtml,
  betaSignupReceivedEmailSubject,
} from "@/lib/email/templates/betaSignupReceived";
import {
  betaThanksEmailHtml,
  betaThanksEmailSubject,
} from "@/lib/email/templates/betaThanks";
import { getWordmarkDataUri } from "@/lib/email/wordmarkDataUri";
import { siteDetails } from "@/data/siteDetails";

type EmailType =
  | "signup_received"
  | "welcome"
  | "check_in"
  | "check_in_active"
  | "check_in_active_no_pins";

function adminSecret(): string | undefined {
  return process.env.ADMIN_BETA_EMAIL_SECRET?.trim();
}

function parsePlatform(value: unknown): BetaPlatform | null {
  return value === "ios" || value === "android" ? value : null;
}

function parseEmailType(value: unknown): EmailType | null {
  if (
    value === "signup_received" ||
    value === "welcome" ||
    value === "check_in" ||
    value === "check_in_active" ||
    value === "check_in_active_no_pins"
  ) {
    return value;
  }
  return null;
}

/** Server-to-server HTML preview for pinporium-admin send confirmation. */
export async function POST(request: Request) {
  const secret = adminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_BETA_EMAIL_SECRET is not configured on pinporium-web." },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-pinporium-admin-secret")?.trim();
  if (!provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const emailType = parseEmailType(raw.emailType);
  const platform = parsePlatform(raw.platform);
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";

  if (!emailType || !platform || !name || !email) {
    return NextResponse.json(
      { error: "name, email, platform, and emailType are required." },
      { status: 400 },
    );
  }

  const assetsBaseUrl = siteDetails.siteUrl.replace(/\/$/, "");
  const wordmarkSrc = getWordmarkDataUri();
  const common = { name, platform, email, assetsBaseUrl, wordmarkSrc };

  const previews = {
    signup_received: {
      subject: betaSignupReceivedEmailSubject(),
      html: betaSignupReceivedEmailHtml(common),
    },
    welcome: {
      subject: betaThanksEmailSubject(platform),
      html: betaThanksEmailHtml(common),
    },
    check_in: {
      subject: betaNotYetStartedEmailSubject(),
      html: betaNotYetStartedEmailHtml(common),
    },
    check_in_active: {
      subject: betaActiveUserCheckInEmailSubject(),
      html: betaActiveUserCheckInEmailHtml(common),
    },
    check_in_active_no_pins: {
      subject: betaActiveNoPinsCheckInEmailSubject(),
      html: betaActiveNoPinsCheckInEmailHtml(common),
    },
  } as const;

  const preview = previews[emailType];
  return NextResponse.json({ subject: preview.subject, html: preview.html });
}
