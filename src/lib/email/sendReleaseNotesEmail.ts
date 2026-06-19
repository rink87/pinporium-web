import { Resend } from "resend";

import { getLatestReleaseNotes } from "@/content/release-notes";
import { siteDetails } from "@/data/siteDetails";
import { recordBetaReleaseNotesSent } from "@/lib/betaApplicationDb";

import {
  releaseNotesEmailHtml,
  releaseNotesEmailSubject,
  RELEASE_NOTES,
} from "./templates/releaseNotes";

type SendResult = { sent: boolean; skipped?: boolean; error?: string; version?: string };

export function buildReleaseNotesEmailHtml(
  version: string,
  options?: { assetsBaseUrl?: string },
) {
  const entry = RELEASE_NOTES.find(note => note.version === version) ?? getLatestReleaseNotes();
  if (!entry) {
    throw new Error(`No release notes for version ${version}`);
  }
  return {
    entry,
    subject: releaseNotesEmailSubject(entry),
    html: releaseNotesEmailHtml(entry, options),
  };
}

export function buildLatestReleaseNotesEmailHtml(options?: {
  assetsBaseUrl?: string;
}) {
  const entry = getLatestReleaseNotes();
  if (!entry) {
    throw new Error("No release notes defined in src/content/release-notes.ts");
  }
  return buildReleaseNotesEmailHtml(entry.version, options);
}

export async function sendReleaseNotesEmail({
  to,
  assetsBaseUrl,
  version,
  recordToBetaApplication = false,
}: {
  to: string;
  assetsBaseUrl?: string;
  version?: string;
  recordToBetaApplication?: boolean;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  const { entry, subject, html } = version
    ? buildReleaseNotesEmailHtml(version, { assetsBaseUrl })
    : buildLatestReleaseNotesEmailHtml({ assetsBaseUrl });

  if (!apiKey || !from) {
    console.warn(
      "Release notes email skipped: set RESEND_API_KEY and RESEND_FROM (e.g. Pinporium <beta@pinporium.app>).",
    );
    return { sent: false, skipped: true, version: entry.version };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: siteDetails.supportEmail,
    subject,
    html,
    tags: [{ name: "category", value: "release_notes" }],
  });

  if (error) {
    console.error("Release notes email failed", error);
    return { sent: false, error: error.message, version: entry.version };
  }

  if (recordToBetaApplication) {
    await recordBetaReleaseNotesSent(to, entry.version);
  }

  return { sent: true, version: entry.version };
}
