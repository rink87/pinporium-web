import type { BetaPlatform } from "@/lib/betaTester";
import { betaCheckInPageUrl } from "@/lib/betaCheckIn";
import { BETA_ACTIVE_FEATURES_USED } from "@/lib/betaActiveFeedback";
import { siteDetails } from "@/data/siteDetails";

import { emailButton, emailSectionHeading, escapeHtml } from "../blocks";
import { BETA_DISCORD_URL } from "../constants";
import { emailLayout } from "../layout";
import { emailTheme } from "../theme";

function firstName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function bodyCopy(platform: BetaPlatform, name: string, email?: string) {
  const greeting = `Hi ${escapeHtml(firstName(name))},`;
  const t = emailTheme;
  const support = siteDetails.supportEmail;
  const formUrl = betaCheckInPageUrl({ audience: "active", platform, email, name });
  const featurePreview = BETA_ACTIVE_FEATURES_USED.slice(0, 4)
    .map((f) => f.label.toLowerCase())
    .join(", ");

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Thanks for signing into the <strong>Pinporium beta</strong> — we&apos;re building the app with collectors like you, and your experience matters.</p>
    <p style="margin:0 0 16px;color:${t.foreground};">We put together a short <strong>web feedback form</strong> (~3 minutes): which features you&apos;ve tried, how adding pins and catalog submissions felt, and a few open questions. It works best on your phone or computer — not inside the email app.</p>

    ${emailButton(formUrl, "Open beta feedback form")}

    <p style="margin:0 0 16px;color:${t.foregroundAccent};font-size:14px;line-height:1.5;text-align:center;">On the form you&apos;ll check off features you&apos;ve used (e.g. ${escapeHtml(featurePreview)}…) and share what clicked vs. what didn&apos;t.</p>

    ${emailSectionHeading("Other ways to reach us")}
    <p style="margin:0 0 12px;color:${t.foreground};font-size:15px;line-height:1.6;">On iPhone you can still <strong>shake your phone</strong> in the app for quick feedback. Join collectors on <a href="${escapeHtml(BETA_DISCORD_URL)}" style="color:${t.secondary};font-weight:600;">Discord</a>, or email <a href="mailto:${support}" style="color:${t.secondary};font-weight:600;">${support}</a>.</p>
    <p style="margin:0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">Thank you for helping shape Pinporium for the whole pin community.</p>
  `;
}

export function betaActiveUserCheckInEmailHtml({
  name,
  platform,
  assetsBaseUrl,
  wordmarkSrc,
  email,
}: {
  name: string;
  platform: BetaPlatform;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
  email?: string;
}) {
  const previewText =
    "Share quick beta feedback (~3 min): which features you've used and how key flows felt.";

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title: "Share your beta feedback",
    bodyHtml: bodyCopy(platform, name, email),
    footerHtml,
    assetsBaseUrl,
    wordmarkSrc,
  });
}

export function betaActiveUserCheckInEmailSubject() {
  return "Quick beta feedback (~3 min) — which features have you tried?";
}
