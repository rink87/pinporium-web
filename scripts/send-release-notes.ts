/**
 * Preview or send release-notes emails (Resend).
 *
 * Preview HTML (no send):
 *   npx tsx scripts/send-release-notes.ts --preview
 *
 * List Android beta testers who would receive v1.0.3 (no send):
 *   npx tsx --env-file=.env.local scripts/send-release-notes.ts --all --platform android --dry-run
 *
 * Send v1.0.3 to all Android beta testers:
 *   npx tsx --env-file=.env.local scripts/send-release-notes.ts --all --platform android
 *
 * Send test to yourself:
 *   npx tsx --env-file=.env.local scripts/send-release-notes.ts rink87@gmail.com
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getLatestReleaseNotes } from "../src/content/release-notes";
import {
  parseReleaseNotesSent,
} from "../src/lib/betaApplicationDb";
import type { BetaPlatform } from "../src/lib/betaTester";
import { normalizeBetaEmail } from "../src/lib/betaTester";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";
import { buildReleaseNotesEmailHtml } from "../src/lib/email/sendReleaseNotesEmail";
import { sendReleaseNotesEmail } from "../src/lib/email/sendReleaseNotesEmail";

type BetaRecipient = {
  email: string;
  platform: BetaPlatform;
  releaseNotesSent: Record<string, string>;
};

function parseArgs(args: string[]) {
  const preview = args.includes("--preview");
  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");
  const platformFlagIndex = args.indexOf("--platform");
  const platformRaw = platformFlagIndex >= 0 ? args[platformFlagIndex + 1] : undefined;
  const platform: BetaPlatform | undefined =
    platformRaw === "android" ? "android" : platformRaw === "ios" ? "ios" : undefined;
  const versionFlagIndex = args.indexOf("--version");
  const version = versionFlagIndex >= 0 ? args[versionFlagIndex + 1] : undefined;

  const consumed = new Set<number>();
  for (const index of [platformFlagIndex, versionFlagIndex]) {
    if (index >= 0) {
      consumed.add(index);
      consumed.add(index + 1);
    }
  }

  const to = args.find((arg, index) => !arg.startsWith("--") && !consumed.has(index));

  return { preview, all, dryRun, platform, version, to };
}

async function listBetaRecipients(platform?: BetaPlatform): Promise<BetaRecipient[]> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  let query = admin
    .from("beta_applications")
    .select("email, platform, release_notes_sent")
    .order("email");

  if (platform) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load beta_applications: ${error.message}`);
  }

  return (data ?? []).map(row => ({
    email: normalizeBetaEmail(String(row.email ?? "")),
    platform: row.platform === "android" ? "android" : "ios",
    releaseNotesSent: parseReleaseNotesSent(row.release_notes_sent),
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const { preview, all, dryRun, platform, version: versionArg, to } = parseArgs(args);

  const assetsBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://pinporium.app";

  const version = versionArg ?? getLatestReleaseNotes()?.version;
  if (!version) {
    throw new Error("No release notes version found.");
  }

  const { entry, subject, html } = buildReleaseNotesEmailHtml(version, {
    assetsBaseUrl,
  });

  if (all) {
    const recipients = await listBetaRecipients(platform);
    if (recipients.length === 0) {
      throw new Error(
        platform
          ? `No ${platform} beta testers found in beta_applications.`
          : "No beta testers found in beta_applications.",
      );
    }

    const pending = recipients.filter(r => !r.releaseNotesSent[version]);
    const alreadySent = recipients.filter(r => r.releaseNotesSent[version]);

    console.log(
      JSON.stringify(
        {
          mode: dryRun ? "dry_run" : "broadcast",
          version,
          platform: platform ?? "all",
          total: recipients.length,
          pending: pending.length,
          alreadySent: alreadySent.length,
          recipients: pending.map(r => r.email),
        },
        null,
        2,
      ),
    );

    if (dryRun) {
      process.exit(0);
    }

    const results: {
      email: string;
      sent: boolean;
      skipped?: boolean;
      error?: string;
    }[] = [];

    for (const recipient of pending) {
      const result = await sendReleaseNotesEmail({
        to: recipient.email,
        version,
        assetsBaseUrl,
        recordToBetaApplication: true,
      });
      results.push({ email: recipient.email, ...result });
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const sent = results.filter(r => r.sent).length;
    const failed = results.filter(r => !r.sent && !r.skipped);
    console.log(
      JSON.stringify(
        {
          mode: "broadcast_complete",
          version,
          platform: platform ?? "all",
          total: pending.length,
          sent,
          skipped: results.filter(r => r.skipped).length,
          failed: failed.length,
          results,
        },
        null,
        2,
      ),
    );
    process.exit(failed.length > 0 ? 1 : 0);
  }

  if (preview || !to) {
    const outDir = join(import.meta.dirname, "out");
    mkdirSync(outDir, { recursive: true });
    const filename = `release-notes-v${entry.version}.html`;
    const outPath = join(outDir, filename);
    writeFileSync(outPath, html, "utf8");
    console.log(
      JSON.stringify(
        {
          mode: "preview",
          version: entry.version,
          subject,
          writtenTo: outPath,
          plaintextSummary: entry.summary,
        },
        null,
        2,
      ),
    );
    if (!to) {
      process.exit(0);
    }
  }

  if (!to) {
    process.exit(0);
  }

  const result = await sendReleaseNotesEmail({
    to,
    version,
    assetsBaseUrl,
    recordToBetaApplication: true,
  });
  console.log(JSON.stringify({ to, subject, ...result }, null, 2));
  process.exit(result.sent ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
