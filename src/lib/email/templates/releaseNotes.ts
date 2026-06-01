import {
  formatReleaseNotesEmailBodyHtml,
  getLatestReleaseNotes,
  type ReleaseNotesEntry,
} from "../../../../../pinporium/content/release-notes";

import { emailLayout } from "../layout";
import { emailTheme } from "../theme";

export type { ReleaseNotesEntry };

export {
  formatReleaseNotesDiscord,
  formatReleaseNotesPlaintext,
  getLatestReleaseNotes,
  RELEASE_NOTES,
} from "../../../../../pinporium/content/release-notes";

export function releaseNotesEmailHtml(entry: ReleaseNotesEntry, options?: { assetsBaseUrl?: string }) {
  const headline = entry.headline ?? "What's new";
  const previewText = entry.summary ?? `What's new in Pinporium v${entry.version}`;

  const bodyHtml = formatReleaseNotesEmailBodyHtml(entry, emailTheme);

  const footerHtml = `
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

/** Convenience for beta / release announcement emails. */
export function latestReleaseNotesEmailHtml(options?: { assetsBaseUrl?: string }) {
  const entry = getLatestReleaseNotes();
  if (!entry) {
    throw new Error("No release notes defined in pinporium/content/release-notes.ts");
  }
  return releaseNotesEmailHtml(entry, options);
}
