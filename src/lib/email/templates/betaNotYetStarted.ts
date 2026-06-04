import type { BetaPlatform } from "@/lib/betaTester";
import {
  BETA_CHECK_IN_REASONS,
  betaCheckInPageUrl,
} from "@/lib/betaCheckIn";
import { siteDetails } from "@/data/siteDetails";

import {
  emailAppleTestFlightButton,
  emailGooglePlayBadgeButton,
  emailSectionHeading,
  escapeHtml,
} from "../blocks";
import {
  BETA_PLAY_INTERNAL_URL,
  BETA_TESTFLIGHT_URL,
} from "../constants";
import { emailLayout } from "../layout";
import {
  EMAIL_GOOGLE_PLAY_BADGE_HEIGHT,
  EMAIL_GOOGLE_PLAY_BADGE_WIDTH,
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

function reasonLinksHtml(platform: BetaPlatform, email?: string) {
  const t = emailTheme;
  const rows = BETA_CHECK_IN_REASONS.map((reason) => {
    const href = betaCheckInPageUrl({
      reason: reason.value,
      platform,
      email,
    });
    return `<li style="margin-bottom:10px;"><a href="${escapeHtml(href)}" style="color:${t.secondary};font-weight:600;font-size:15px;text-decoration:underline;">${escapeHtml(reason.shortLabel)}</a></li>`;
  }).join("");

  return `<ul style="margin:0;padding-left:20px;color:${t.foreground};font-size:15px;line-height:1.5;">${rows}</ul>`;
}

function bodyCopy(
  platform: BetaPlatform,
  name: string,
  assetsBaseUrl?: string,
  email?: string,
) {
  const greeting = `Hi ${escapeHtml(firstName(name))},`;
  const t = emailTheme;
  const support = siteDetails.supportEmail;
  const assets = getEmailAssetUrls(assetsBaseUrl);
  const checkInUrl = betaCheckInPageUrl({ platform, email });

  const installBlock =
    platform === "ios"
      ? `
    <p style="margin:0 0 12px;color:${t.foreground};">If you&apos;re ready to try Pinporium, install the beta on your iPhone via <strong>TestFlight</strong> (install the TestFlight app from the App Store first if needed):</p>
    ${emailAppleTestFlightButton(BETA_TESTFLIGHT_URL)}
  `
      : `
    <p style="margin:0 0 12px;color:${t.foreground};">If you&apos;re ready to try Pinporium, open this link on your Android phone and install from <strong>Google Play</strong> internal testing (use the same Google account as this email if you can):</p>
    ${emailGooglePlayBadgeButton(
      BETA_PLAY_INTERNAL_URL,
      assets.googlePlayBadgeUrl,
      EMAIL_GOOGLE_PLAY_BADGE_WIDTH,
      EMAIL_GOOGLE_PLAY_BADGE_HEIGHT,
    )}
  `;

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">You applied for the <strong>Pinporium beta</strong> and we sent your install instructions — thank you again for raising your hand.</p>
    <p style="margin:0 0 16px;color:${t.foreground};">We noticed you haven&apos;t created an account in the app yet. That&apos;s completely fine — we&apos;d love to know what&apos;s in the way so we can improve the beta for collectors like you.</p>

    ${emailSectionHeading("What's holding you back?")}
    <p style="margin:0 0 12px;color:${t.foreground};font-size:15px;line-height:1.6;">Tap the option that fits best (opens a short form with that choice already selected):</p>
    ${reasonLinksHtml(platform, email)}
    <p style="margin:16px 0 0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">Prefer one page? <a href="${escapeHtml(checkInUrl)}" style="color:${t.secondary};font-weight:600;">Open the check-in form</a> and pick from the list.</p>

    ${emailSectionHeading("Ready to jump in?")}
    ${installBlock}
    <p style="margin:0 0 20px;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">After install, create an account, then try adding one pin with front and back photos — that unlocks your vault and 3D preview.</p>

    <p style="margin:0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">You can also reply to this email or write to <a href="mailto:${support}" style="color:${t.secondary};font-weight:600;">${support}</a>.</p>
  `;
}

export function betaNotYetStartedEmailHtml({
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
  /** Pre-fills check-in form links when sending via Resend per recipient */
  email?: string;
}) {
  const previewText =
    "Quick check-in: what's keeping you from trying the Pinporium beta? One tap helps us improve.";

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title: "Quick check-in on your Pinporium beta",
    bodyHtml: bodyCopy(platform, name, assetsBaseUrl, email),
    footerHtml,
    assetsBaseUrl,
    wordmarkSrc,
  });
}

export function betaNotYetStartedEmailSubject() {
  return "Quick check-in — Pinporium beta";
}
