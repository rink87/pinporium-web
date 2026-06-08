import { NextResponse } from "next/server";

import type { BetaPlatform } from "@/lib/betaTester";
import { normalizeBetaEmail } from "@/lib/betaTester";
import {
  fetchBetaApplicationByEmail,
  fetchBetaApplicationById,
} from "@/lib/betaApplicationDb";
import {
  sendBetaActiveNoPinsCheckInEmail,
  sendBetaActiveUserCheckInEmail,
  sendBetaNotYetStartedEmail,
  sendBetaSignupReceivedEmail,
  sendBetaWelcomeEmail,
} from "@/lib/email/sendBetaEmails";

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

/** Server-to-server: pinporium-admin sends beta lifecycle emails via Resend. */
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
  if (!emailType) {
    return NextResponse.json({ error: "Invalid emailType." }, { status: 400 });
  }

  let name = typeof raw.name === "string" ? raw.name.trim() : "";
  let email = typeof raw.email === "string" ? normalizeBetaEmail(raw.email) : "";
  let platform = parsePlatform(raw.platform);

  const applicationId =
    typeof raw.applicationId === "string" ? raw.applicationId.trim() : "";
  if (applicationId) {
    const row = await fetchBetaApplicationById(applicationId);
    if (row) {
      name = row.name;
      email = row.email;
      platform = row.platform as BetaPlatform;
    }
  } else if (email) {
    const row = await fetchBetaApplicationByEmail(email);
    if (row) {
      name = row.name;
      email = row.email;
      platform = row.platform as BetaPlatform;
    }
  }

  if (!email || !name || !platform) {
    return NextResponse.json(
      { error: "applicationId or name + email + platform are required." },
      { status: 400 },
    );
  }

  const senders = {
    signup_received: () => sendBetaSignupReceivedEmail({ name, email, platform }),
    welcome: () => sendBetaWelcomeEmail({ name, email, platform }),
    check_in: () => sendBetaNotYetStartedEmail({ name, email, platform }),
    check_in_active: () => sendBetaActiveUserCheckInEmail({ name, email, platform }),
    check_in_active_no_pins: () => sendBetaActiveNoPinsCheckInEmail({ name, email, platform }),
  } as const;

  const result = await senders[emailType]();

  if (result.skipped) {
    return NextResponse.json(
      { error: "Resend is not configured (RESEND_API_KEY / RESEND_FROM)." },
      { status: 503 },
    );
  }

  if (!result.sent) {
    return NextResponse.json(
      { error: result.error ?? "Email send failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, emailType });
}
