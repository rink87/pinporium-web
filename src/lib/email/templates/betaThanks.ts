import type { BetaPlatform } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

import {
  emailAppleTestFlightButton,
  emailChecklist,
  emailImageLink,
  emailGooglePlayBadgeButton,
  emailSectionHeading,
  escapeHtml,
} from "../blocks";
import {
  BETA_DISCORD_URL,
  BETA_PLAY_INTERNAL_URL,
  BETA_TESTFLIGHT_URL,
} from "../constants";
import { emailLayout } from "../layout";
import {
  EMAIL_DISCORD_BUTTON_HEIGHT,
  EMAIL_DISCORD_BUTTON_WIDTH,
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

const CORE_BETA_CHECKLIST = [
  "Add a pin to your <strong>vault</strong> with photos, then link it to an existing catalog entry.",
  "If you can’t find a match, <strong>suggest the pin for catalog</strong> (the catalog is community-built, so coverage starts smaller and grows fast).",
  "Use <strong>Browse / Discover</strong> to find pins and add a few to <strong>ISO, DISO, or Grail</strong> in The Hunt.",
  "Explore <strong>trade functionality</strong>: mark a pin for trade and walk through matches/proposals.",
  "Visit your <strong>profile</strong>, then check <strong>achievements</strong> and your <strong>collector score</strong>.",
  "Create a <strong>pin board</strong> and organize a few pins into it.",
  "Open a pin and tap <strong>Share</strong> to test sharing flow and output.",
  "Request a feature or report any bugs (Discord or email).",
];

function feedbackSection(assetsBaseUrl: string | undefined, inAppHint: string) {
  const t = emailTheme;
  const support = siteDetails.supportEmail;
  const assets = getEmailAssetUrls(assetsBaseUrl);

  return `
    ${emailSectionHeading("Share any feedback")}
    <p style="margin:0 0 12px;color:${t.foreground};font-size:15px;line-height:1.6;">We want the real stuff — there are no wrong answers:</p>
    <ul style="margin:0 0 16px;padding-left:20px;color:${t.foreground};font-size:15px;line-height:1.6;">
      <li style="margin-bottom:8px;"><strong>Bugs</strong> — crashes, broken flows, wrong data</li>
      <li style="margin-bottom:8px;"><strong>Features</strong> — what you wish the app did</li>
      <li style="margin-bottom:8px;"><strong>Confusing</strong> — what was hard to find or understand</li>
      <li style="margin-bottom:8px;"><strong>Delightful</strong> — what felt easy, fast, or fun</li>
    </ul>
    <p style="margin:0 0 8px;color:${t.foreground};font-size:15px;">Our beta Discord is the best place to post screenshots and thoughts:</p>
    ${emailImageLink({
      href: BETA_DISCORD_URL,
      imageUrl: assets.discordJoinButtonUrl,
      alt: "Join us on Discord",
      width: EMAIL_DISCORD_BUTTON_WIDTH,
      height: EMAIL_DISCORD_BUTTON_HEIGHT,
    })}
    <p style="margin:0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">${inAppHint} You can also reply to this email or write to <a href="mailto:${support}" style="color:${t.secondary};font-weight:600;">${support}</a>.</p>
  `;
}

function iosBetaWelcomeBody(name: string, assetsBaseUrl?: string) {
  const greeting = `Hi ${escapeHtml(firstName(name))},`;
  const t = emailTheme;

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Welcome to the <strong>Pinporium beta</strong> — thank you for helping us build the pin collection app collectors actually want to use.</p>
    <p style="margin:0 0 12px;color:${t.foreground};">Install the beta on your iPhone via <strong>TestFlight</strong> (get the TestFlight app from the App Store first if you don’t have it). Open this link on your phone:</p>
    ${emailAppleTestFlightButton(BETA_TESTFLIGHT_URL)}
    <p style="margin:0 0 20px;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">No rush — skip anything that doesn’t fit your collection. Partial walkthroughs are still useful.</p>

    ${emailSectionHeading("Core checklist to try")}
    ${emailChecklist(CORE_BETA_CHECKLIST)}

    <p style="margin:4px 0 0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">Note: the catalog is community-built, so there won’t be a lot of pins to start — your contributions to the catalog help us grow!</p>

    ${feedbackSection(assetsBaseUrl, "In the app: <strong>shake your iPhone</strong> to send feedback.")}
  `;
}

function androidBetaWelcomeBody(name: string, assetsBaseUrl?: string) {
  const greeting = `Hi ${escapeHtml(firstName(name))},`;
  const t = emailTheme;
  const assets = getEmailAssetUrls(assetsBaseUrl);

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Welcome to the <strong>Pinporium beta</strong> on Android — thank you for helping us build the pin collection app collectors actually want to use.</p>
    <p style="margin:0 0 12px;color:${t.foreground};">Install the beta from <strong>Google Play</strong> (internal testing). On your Android phone, open this link, sign in with the <strong>same Google account</strong> as this email if you can, accept the invite, then install <strong>Pinporium</strong> from the Play Store:</p>
    ${emailGooglePlayBadgeButton(
      BETA_PLAY_INTERNAL_URL,
      assets.googlePlayBadgeUrl,
      EMAIL_GOOGLE_PLAY_BADGE_WIDTH,
      EMAIL_GOOGLE_PLAY_BADGE_HEIGHT,
    )}
    <p style="margin:0 0 20px;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">No rush — skip anything that doesn’t fit your collection. Partial walkthroughs are still useful.</p>

    ${emailSectionHeading("Core checklist to try")}
    ${emailChecklist(CORE_BETA_CHECKLIST)}

    <p style="margin:4px 0 0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">Note: the catalog is community-built, so there won’t be a lot of pins to start — your contributions to the catalog help us grow!</p>

    ${feedbackSection(assetsBaseUrl, "Post screenshots and notes in Discord — that’s the fastest way to reach us.")}
  `;
}

function bodyCopy(
  platform: BetaPlatform,
  name: string,
  assetsBaseUrl?: string,
) {
  if (platform === "android") {
    return androidBetaWelcomeBody(name, assetsBaseUrl);
  }
  return iosBetaWelcomeBody(name, assetsBaseUrl);
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
    ? "Welcome to the Pinporium beta — TestFlight link, core checklist, and Discord feedback."
    : "Welcome to the Pinporium beta — Google Play install link, checklist, and Discord feedback.";

  const title = "Welcome to the Pinporium beta";

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title,
    bodyHtml: bodyCopy(platform, name, assetsBaseUrl),
    footerHtml,
    assetsBaseUrl,
    wordmarkSrc,
  });
}

export function betaThanksEmailSubject(platform: BetaPlatform) {
  return platform === "ios"
    ? "Welcome to the Pinporium beta"
    : "Welcome to the Pinporium beta (Android)";
}
