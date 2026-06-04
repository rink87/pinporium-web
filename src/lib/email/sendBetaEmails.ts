import { Resend } from "resend";

import type { BetaPlatform } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";
import {
  recordBetaApplicationEmailSent,
  type BetaEmailKind,
} from "@/lib/betaApplicationDb";

import {
  betaSignupReceivedEmailHtml,
  betaSignupReceivedEmailSubject,
} from "./templates/betaSignupReceived";
import {
  betaNotYetStartedEmailHtml,
  betaNotYetStartedEmailSubject,
} from "./templates/betaNotYetStarted";
import {
  betaThanksEmailHtml,
  betaThanksEmailSubject,
} from "./templates/betaThanks";

type SendResult = { sent: boolean; skipped?: boolean; error?: string };

async function sendResendEmail({
  to,
  subject,
  html,
  logLabel,
}: {
  to: string;
  subject: string;
  html: string;
  logLabel: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    console.warn(
      `${logLabel} skipped: set RESEND_API_KEY and RESEND_FROM (e.g. Pinporium <beta@pinporium.app>).`,
    );
    return { sent: false, skipped: true };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: siteDetails.supportEmail,
    subject,
    html,
  });

  if (error) {
    console.error(`${logLabel} failed`, error);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}

async function sendResendEmailWithBetaRecord({
  to,
  subject,
  html,
  logLabel,
  recordKind,
}: {
  to: string;
  subject: string;
  html: string;
  logLabel: string;
  recordKind?: BetaEmailKind;
}): Promise<SendResult> {
  const result = await sendResendEmail({ to, subject, html, logLabel });
  if (result.sent && recordKind) {
    await recordBetaApplicationEmailSent(to, recordKind);
  }
  return result;
}

/** Sent immediately when someone submits the beta form on the site. */
export async function sendBetaSignupReceivedEmail({
  name,
  email,
  platform,
}: {
  name: string;
  email: string;
  platform: BetaPlatform;
}): Promise<SendResult> {
  return sendResendEmailWithBetaRecord({
    to: email,
    subject: betaSignupReceivedEmailSubject(),
    html: betaSignupReceivedEmailHtml({ name, platform }),
    logLabel: "Beta signup received email",
    recordKind: "signup_received",
  });
}

/** Sent when you react :incoming_envelope: on the Slack signup message (install link + checklist). */
export async function sendBetaWelcomeEmail({
  name,
  email,
  platform,
}: {
  name: string;
  email: string;
  platform: BetaPlatform;
}): Promise<SendResult> {
  return sendResendEmailWithBetaRecord({
    to: email,
    subject: betaThanksEmailSubject(platform),
    html: betaThanksEmailHtml({ name, platform }),
    logLabel: "Beta welcome email",
    recordKind: "welcome",
  });
}

/** @deprecated Use sendBetaWelcomeEmail */
export const sendBetaThanksEmail = sendBetaWelcomeEmail;

/** Follow-up for approved beta testers who have not created an app account yet. */
export async function sendBetaNotYetStartedEmail({
  name,
  email,
  platform,
}: {
  name: string;
  email: string;
  platform: BetaPlatform;
}): Promise<SendResult> {
  return sendResendEmailWithBetaRecord({
    to: email,
    subject: betaNotYetStartedEmailSubject(),
    html: betaNotYetStartedEmailHtml({ name, platform, email }),
    logLabel: "Beta not-yet-started check-in email",
    recordKind: "check_in",
  });
}
