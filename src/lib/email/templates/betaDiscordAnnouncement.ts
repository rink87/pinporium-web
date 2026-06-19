import { siteDetails } from "@/data/siteDetails";

import { emailImageLink, emailSectionHeading, escapeHtml } from "../blocks";
import { BETA_DISCORD_URL } from "../constants";
import { emailLayout } from "../layout";
import {
  EMAIL_DISCORD_BUTTON_HEIGHT,
  EMAIL_DISCORD_BUTTON_WIDTH,
  emailTheme,
  getEmailAssetUrls,
} from "../theme";

function greeting(name?: string) {
  const trimmed = name?.trim();
  if (!trimmed) {
    return "Hi everyone,";
  }
  const first = trimmed.split(/\s+/)[0] ?? trimmed;
  return `Hi ${escapeHtml(first)},`;
}

export const BETA_DISCORD_ANNOUNCEMENT_SUBJECT =
  "New Pinporium beta Discord — join us here";

export function betaDiscordAnnouncementEmailSubject() {
  return BETA_DISCORD_ANNOUNCEMENT_SUBJECT;
}

export function betaDiscordAnnouncementEmailHtml(options?: {
  name?: string;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}) {
  const t = emailTheme;
  const support = siteDetails.supportEmail;
  const assets = getEmailAssetUrls(options?.assetsBaseUrl, {
    wordmarkSrc: options?.wordmarkSrc,
  });

  const bodyHtml = `
    <p style="margin:0 0 8px;font-family:${t.fontDisplay};font-size:22px;color:${t.foreground};">Beta Discord moved</p>
    <p style="margin:0 0 20px;color:${t.foregroundAccent};font-size:15px;line-height:1.5;">Quick heads-up for all beta testers.</p>
    <p style="margin:0 0 16px;color:${t.foreground};font-size:15px;line-height:1.6;">${greeting(options?.name)}</p>
    <p style="margin:0 0 16px;color:${t.foreground};font-size:15px;line-height:1.6;">We&apos;ve moved our <strong>beta feedback Discord</strong> to a new server. This is the best place to share bugs, screenshots, feature ideas, and anything that felt confusing or surprisingly great while you&apos;re testing.</p>
    <p style="margin:0 0 8px;color:${t.foreground};font-size:15px;line-height:1.6;">Join the new server here:</p>
    ${emailImageLink({
      href: BETA_DISCORD_URL,
      imageUrl: assets.discordJoinButtonUrl,
      alt: "Join us on Discord",
      width: EMAIL_DISCORD_BUTTON_WIDTH,
      height: EMAIL_DISCORD_BUTTON_HEIGHT,
    })}
    <p style="margin:0 0 8px;color:${t.foregroundAccent};font-size:14px;line-height:1.5;text-align:center;">
      <a href="${escapeHtml(BETA_DISCORD_URL)}" style="color:${t.secondary};font-weight:600;text-decoration:none;">${escapeHtml(BETA_DISCORD_URL)}</a>
    </p>
    ${emailSectionHeading("What to share")}
    <ul style="margin:0 0 16px;padding-left:20px;color:${t.foreground};font-size:15px;line-height:1.6;">
      <li style="margin-bottom:8px;"><strong>Bugs</strong> — crashes, broken flows, wrong data</li>
      <li style="margin-bottom:8px;"><strong>Features</strong> — what you wish the app did</li>
      <li style="margin-bottom:8px;"><strong>Confusing</strong> — what was hard to find or understand</li>
      <li style="margin-bottom:8px;"><strong>Delightful</strong> — what felt easy, fast, or fun</li>
    </ul>
    <p style="margin:0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">No wrong answers — rough notes are totally fine. You can also use in-app feedback (shake on iOS) or email <a href="mailto:${support}" style="color:${t.secondary};font-weight:600;">${support}</a>.</p>
  `;

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};">
      Thanks again for helping us build Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText: "Our beta Discord moved — new invite link inside.",
    title: "Beta Discord",
    bodyHtml,
    footerHtml,
    assetsBaseUrl: options?.assetsBaseUrl,
    wordmarkSrc: options?.wordmarkSrc,
  });
}
