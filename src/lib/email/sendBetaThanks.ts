import { Resend } from "resend";

import type { BetaPlatform } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

import {
  betaThanksEmailHtml,
  betaThanksEmailSubject,
} from "./templates/betaThanks";

export async function sendBetaThanksEmail({
  name,
  email,
  platform,
}: {
  name: string;
  email: string;
  platform: BetaPlatform;
}): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    console.warn(
      "Beta thanks email skipped: set RESEND_API_KEY and RESEND_FROM (e.g. Pinporium <beta@pinporium.app>).",
    );
    return { sent: false, skipped: true };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: siteDetails.supportEmail,
    subject: betaThanksEmailSubject(platform),
    html: betaThanksEmailHtml({ name, platform }),
  });

  if (error) {
    console.error("Resend beta thanks email failed", error);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
