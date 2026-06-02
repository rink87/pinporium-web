import type { BetaPlatform } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

import { escapeHtml } from "../blocks";
import { emailLayout } from "../layout";
import { emailTheme } from "../theme";

function firstName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function bodyCopy(platform: BetaPlatform, name: string) {
  const greeting = `Hi ${escapeHtml(firstName(name))},`;
  const t = emailTheme;
  const support = siteDetails.supportEmail;

  const installLine =
    platform === "ios"
      ? "We&apos;ll email you a <strong>TestFlight</strong> download link at this address after we review your request — usually within a few days."
      : "We&apos;ll email you a <strong>Google Play</strong> internal testing link at this address after we review your request — usually within a few days.";

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Thanks for expressing interest in being a Pinporium beta tester.</p>
    <p style="margin:0 0 16px;color:${t.foreground};">${installLine}</p>
    <p style="margin:0;color:${t.foregroundAccent};font-size:15px;">Questions? Reply to this email or write to <a href="mailto:${support}" style="color:${t.secondary};font-weight:600;">${support}</a>.</p>
  `;
}

export function betaSignupReceivedEmailHtml({
  name,
  platform,
  assetsBaseUrl,
  wordmarkSrc,
}: {
  name: string;
  platform: BetaPlatform;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}) {
  const previewText =
    platform === "ios"
      ? "Thanks for applying — we'll email your TestFlight link after we review your request."
      : "Thanks for applying — we'll email your Google Play link after we review your request.";

  return emailLayout({
    previewText,
    title: "Thanks for applying to the Pinporium beta",
    bodyHtml: bodyCopy(platform, name),
    footerHtml: `
      <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
        Pinporium — one vault for your whole pin collection.
      </p>
    `,
    assetsBaseUrl,
    wordmarkSrc,
  });
}

export function betaSignupReceivedEmailSubject() {
  return "Thanks for applying to the Pinporium beta";
}
