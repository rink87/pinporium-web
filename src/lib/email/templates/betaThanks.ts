import type { BetaPlatform } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

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

  if (platform === "android") {
    return `
      <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
      <p style="margin:0 0 16px;color:${t.foreground};">Thanks for your interest in the Pinporium beta.</p>
      <p style="margin:0 0 16px;color:${t.foreground};">Android testing is <strong>coming soon</strong>. We'll email you at this address when it's available for testing — no action needed right now.</p>
      <p style="margin:0;color:${t.foregroundAccent};font-size:15px;">Questions? Reply to this email or write to <a href="mailto:${siteDetails.supportEmail}" style="color:${t.secondary};font-weight:600;">${siteDetails.supportEmail}</a>.</p>
    `;
  }

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Thanks for expressing interest in being a Pinporium beta tester.</p>
    <p style="margin:0 0 16px;color:${t.foreground};">We'll send a <strong>TestFlight</strong> download link to the email you provided in the next few days.</p>
    <p style="margin:0;color:${t.foregroundAccent};font-size:15px;">Questions? Reply to this email or write to <a href="mailto:${siteDetails.supportEmail}" style="color:${t.secondary};font-weight:600;">${siteDetails.supportEmail}</a>.</p>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function betaThanksEmailHtml({
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
  const isIos = platform === "ios";
  const previewText = isIos
    ? "Thanks for applying — your TestFlight invite is on the way."
    : "Thanks for applying — we'll email you when Android testing opens.";

  const title = isIos ? "You're on the Pinporium beta list" : "Thanks — Android beta coming soon";

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title,
    bodyHtml: bodyCopy(platform, name),
    footerHtml,
    assetsBaseUrl,
    wordmarkSrc,
  });
}

export function betaThanksEmailSubject(platform: BetaPlatform) {
  return platform === "ios"
    ? "Thanks for applying to the Pinporium beta"
    : "Thanks for your interest in Pinporium (Android)";
}
