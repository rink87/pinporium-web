import type { BetaPlatform } from "@/lib/betaTester";
import {
  BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS,
  betaCheckInPageUrl,
} from "@/lib/betaCheckIn";
import { siteDetails } from "@/data/siteDetails";

import { emailSectionHeading, escapeHtml } from "../blocks";
import { emailLayout } from "../layout";
import { emailTheme } from "../theme";

import { betaMoreFeedbackSection } from "./betaMoreFeedbackSection";

function firstName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "there";
  }
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function reasonLinksHtml(
  platform: BetaPlatform,
  name: string,
  email?: string,
  siteUrl?: string,
) {
  const t = emailTheme;
  const rows = BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS.map((reason) => {
    const href = betaCheckInPageUrl({
      audience: "active_no_pins",
      reason: reason.value,
      platform,
      email,
      name,
      siteUrl,
    });
    return `<li style="margin-bottom:10px;"><a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" style="color:${t.secondary};font-weight:600;font-size:15px;text-decoration:underline;">${escapeHtml(reason.shortLabel)}</a></li>`;
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
  const checkInUrl = betaCheckInPageUrl({
    audience: "active_no_pins",
    platform,
    email,
    name,
    siteUrl: assetsBaseUrl,
  });

  return `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">${greeting}</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Thanks for signing into the <strong>Pinporium beta</strong> — we&apos;re glad you&apos;re in.</p>
    <p style="margin:0 0 16px;color:${t.foreground};">We noticed you haven&apos;t added a pin to your vault yet. That&apos;s okay — we&apos;d love to know what&apos;s in the way so we can make the first pin easier.</p>

    ${emailSectionHeading("What's blocking your first pin?")}
    <p style="margin:0 0 12px;color:${t.foreground};font-size:15px;line-height:1.6;">Tap the option that fits best (opens a short form with that choice already selected):</p>
    ${reasonLinksHtml(platform, name, email, assetsBaseUrl)}
    <p style="margin:16px 0 0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">Prefer one page? <a href="${escapeHtml(checkInUrl)}" target="_blank" rel="noopener noreferrer" style="color:${t.secondary};font-weight:600;">Open the check-in form</a> and pick from the list.</p>

    ${emailSectionHeading("Try adding one pin")}
    <p style="margin:0 0 12px;color:${t.foreground};font-size:15px;line-height:1.6;">When you&apos;re ready: open the app, add a pin with front and back photos, and link it to the catalog if you can find a match. That unlocks your vault and 3D preview.</p>

    ${betaMoreFeedbackSection(assetsBaseUrl)}
    <p style="margin:0;color:${t.foregroundAccent};font-size:14px;line-height:1.5;">Questions? Reply to this email or write to <a href="mailto:${support}" style="color:${t.secondary};font-weight:600;">${support}</a>.</p>
  `;
}

export function betaActiveNoPinsCheckInEmailHtml({
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
    "Quick check-in: haven't added a pin yet? One tap helps us improve onboarding.";

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title: "Quick check-in — haven't added a pin yet",
    bodyHtml: bodyCopy(platform, name, assetsBaseUrl, email),
    footerHtml,
    assetsBaseUrl,
    wordmarkSrc,
  });
}

export function betaActiveNoPinsCheckInEmailSubject() {
  return "Quick check-in — haven't added a pin yet";
}
