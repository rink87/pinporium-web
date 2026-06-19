import {
  formatReleaseNotesEmailBodyHtml,
  formatReleaseNotesDiscord,
  formatReleaseNotesPlaintext,
  getLatestReleaseNotes,
  RELEASE_NOTES,
  type ReleaseNotesEntry,
} from "@/content/release-notes";

import { emailLayout } from "../layout";
import { emailTheme } from "../theme";
import { betaMoreFeedbackSection } from "./betaMoreFeedbackSection";

export type { ReleaseNotesEntry };

export {
  formatReleaseNotesDiscord,
  formatReleaseNotesPlaintext,
  getLatestReleaseNotes,
  RELEASE_NOTES,
};

export function releaseNotesEmailHtml(
  entry: ReleaseNotesEntry,
  options?: { assetsBaseUrl?: string },
) {
  const headline = entry.headline ?? "What's new";
  const previewText = entry.summary ?? `What's new in Pinporium v${entry.version}`;

  const bodyHtml = formatReleaseNotesEmailBodyHtml(entry, emailTheme);

  const footerHtml = `
    <p style="margin:20px 0 0;font-size:14px;line-height:1.55;color:${emailTheme.foregroundAccent};">
      You can now read all release notes on our
      <a href="https://www.pinporium.app/changelog#v${entry.version.replace(/\./g, "-")}" style="color:${emailTheme.secondary};font-weight:600;text-decoration:none;">changelog</a>,
      and see upcoming releases plus vote on what we build next at
      <a href="https://www.pinporium.app/roadmap" style="color:${emailTheme.secondary};font-weight:600;text-decoration:none;">www.pinporium.app/roadmap</a>.
    </p>
    ${betaMoreFeedbackSection(options?.assetsBaseUrl)}
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${emailTheme.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return emailLayout({
    previewText,
    title: `${headline} — v${entry.version}`,
    bodyHtml,
    footerHtml,
    assetsBaseUrl: options?.assetsBaseUrl,
  });
}

export function releaseNotesEmailSubject(entry: ReleaseNotesEntry): string {
  const headline = entry.headline ?? "What's new";
  return `${headline} in Pinporium v${entry.version}`;
}

export function latestReleaseNotesEmailHtml(options?: { assetsBaseUrl?: string }) {
  const entry = getLatestReleaseNotes();
  if (!entry) {
    throw new Error("No release notes defined in src/content/release-notes.ts");
  }
  return releaseNotesEmailHtml(entry, options);
}
