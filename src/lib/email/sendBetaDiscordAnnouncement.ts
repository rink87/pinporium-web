import { Resend } from "resend";

import { siteDetails } from "@/data/siteDetails";

import {
  betaDiscordAnnouncementEmailHtml,
  betaDiscordAnnouncementEmailSubject,
} from "./templates/betaDiscordAnnouncement";

type SendResult = { sent: boolean; skipped?: boolean; error?: string };

export function buildBetaDiscordAnnouncementEmail(options?: {
  name?: string;
  assetsBaseUrl?: string;
}) {
  return {
    subject: betaDiscordAnnouncementEmailSubject(),
    html: betaDiscordAnnouncementEmailHtml(options),
  };
}

export async function sendBetaDiscordAnnouncementEmail({
  to,
  name,
  assetsBaseUrl,
}: {
  to: string;
  name?: string;
  assetsBaseUrl?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  const { subject, html } = buildBetaDiscordAnnouncementEmail({
    name,
    assetsBaseUrl,
  });

  if (!apiKey || !from) {
    console.warn(
      "Beta Discord announcement skipped: set RESEND_API_KEY and RESEND_FROM (e.g. Pinporium <beta@pinporium.app>).",
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
    tags: [{ name: "category", value: "beta_discord_announcement" }],
  });

  if (error) {
    console.error("Beta Discord announcement email failed", error);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
