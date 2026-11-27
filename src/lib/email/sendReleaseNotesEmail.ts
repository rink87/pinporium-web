import { Resend } from "resend";

import { getLatestReleaseNotes } from "@/content/release-notes";
import { siteDetails } from "@/data/siteDetails";
import { recordBetaReleaseNotesSent } from "@/lib/betaApplicationDb";

import {
  releaseNotesEmailHtml,
  releaseNotesEmailSubject,
  RELEASE_NOTES,
} from "./templates/releaseNotes";

type SendResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  version?: string;
  versions?: string[];
};

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
  versions,
  subject: subjectOverride,
  html: htmlOverride,
  recordToBetaApplication = false,
}: {
  to: string;
  assetsBaseUrl?: string;
  /** Single release-notes version (builds HTML from content unless html override). */
  version?: string;
  /** Versions to stamp on beta_applications.release_notes_sent after a successful send. */
  versions?: string[];
  subject?: string;
  html?: string;
  recordToBetaApplication?: boolean;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  const recordVersions: string[] = (
    versions?.length
      ? versions
      : version
        ? [version]
        : []
  )
    .map(v => v.trim())
    .filter(Boolean);

  let subject: string;
  let html: string;
  let primaryVersion: string | undefined;

  if (htmlOverride && subjectOverride) {
    subject = subjectOverride;
    html = htmlOverride;
    primaryVersion = recordVersions[0];
  } else {
    const built = version
      ? buildReleaseNotesEmailHtml(version, { assetsBaseUrl })
      : buildLatestReleaseNotesEmailHtml({ assetsBaseUrl });
    subject = subjectOverride ?? built.subject;
    html = htmlOverride ?? built.html;
    primaryVersion = built.entry.version;
    if (recordVersions.length === 0) {
      recordVersions.push(built.entry.version);
    }
  }

  if (!apiKey || !from) {
    console.warn(
      "Release notes email skipped: set RESEND_API_KEY and RESEND_FROM (e.g. Pinporium <beta@pinporium.app>).",
    );
    return {
      sent: false,
      skipped: true,
      version: primaryVersion,
      versions: recordVersions,
    };
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
    return {
      sent: false,
      error: error.message,
      version: primaryVersion,
      versions: recordVersions,
    };
  }

  if (recordToBetaApplication && recordVersions.length > 0) {
    await recordBetaReleaseNotesSent(to, recordVersions);
  }

  return {
    sent: true,
    version: primaryVersion,
    versions: recordVersions,
  };
}
