import type { BetaPlatform } from "@/lib/betaTester";
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

function firstName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function betaImportSheetRequestEmailSubject() {
  return "Do you track your pins in a spreadsheet?";
}

export function betaImportSheetRequestEmailHtml({
  name,
  assetsBaseUrl,
  wordmarkSrc,
}: {
  name: string;
  platform: BetaPlatform;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}) {
  const t = emailTheme;
  const assets = getEmailAssetUrls(assetsBaseUrl, { wordmarkSrc });
  const greeting = `Hi ${escapeHtml(firstName(name))},`;
  const previewText =
    "We're building bulk vault import — would you share your collection tracking sheet to help us test it?";

  const bodyHtml = `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};font-size:15px;line-height:1.6;">We&apos;re building <strong>bulk vault import</strong> so you can bring an existing pin list into Pinporium in one go. It isn&apos;t in the beta app yet — we&apos;ll cover it in release notes when it ships — but we&apos;re stress-testing it now against real collection spreadsheets.</p>
    <p style="margin:0 0 16px;color:${t.foreground};font-size:15px;line-height:1.6;">If you keep a <strong>collection tracking sheet</strong> — Google Sheets, Excel, Notion export, Airtable, or anything similar — would you be willing to share it with us? Every different format helps us test column mapping, edge cases, and import quality with real-world examples before we release it.</p>
    <p style="margin:0 0 20px;color:${t.foregroundAccent};font-size:14px;line-height:1.55;">We only use it to improve import tooling. We won&apos;t publish your data or share it outside the Pinporium team.</p>

    ${emailSectionHeading("How to share")}
    <ul style="margin:0 0 16px;padding-left:20px;color:${t.foreground};font-size:15px;line-height:1.6;">
      <li style="margin-bottom:10px;"><strong>Reply to this email</strong> with a view link (for Google Sheets, &ldquo;anyone with the link&rdquo; is fine).</li>
      <li style="margin-bottom:10px;"><strong>Post in our beta Discord</strong> — paste the link in the server (join below).</li>
      <li style="margin-bottom:10px;"><strong>DM on Discord</strong> — message <strong>@rink87</strong> or <strong>@pinporium</strong> directly.</li>
    </ul>

    <p style="margin:0 0 8px;color:${t.foreground};font-size:15px;line-height:1.6;">Join the beta Discord:</p>
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

    <p style="margin:20px 0 0;color:${t.foregroundAccent};font-size:14px;line-height:1.55;">No sheet? No problem. If you do track pins somewhere, even a rough export helps a ton. Thank you for shaping this with us.</p>
  `;

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};">
      Questions? Reply here or email <a href="mailto:${siteDetails.supportEmail}" style="color:${t.secondary};font-weight:600;">${siteDetails.supportEmail}</a>.
    </p>
    <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:${t.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title: "Share your tracking sheet?",
    bodyHtml,
    footerHtml,
    assetsBaseUrl,
    wordmarkSrc,
  });
}
