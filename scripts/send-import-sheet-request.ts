/**
 * Preview or send the bulk-import tracking-sheet request email (Resend).
 *
 * Preview HTML (no send):
 *   npx tsx scripts/send-import-sheet-request.ts --preview
 *
 * List all beta testers who would receive (no send):
 *   npx tsx --env-file=.env.local scripts/send-import-sheet-request.ts --all --dry-run
 *
 * Send to all beta testers:
 *   npx tsx --env-file=.env.local scripts/send-import-sheet-request.ts --all
 *
 * Send test to yourself:
 *   npx tsx --env-file=.env.local scripts/send-import-sheet-request.ts rink87@gmail.com
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { BetaPlatform } from "../src/lib/betaTester";
import { normalizeBetaEmail } from "../src/lib/betaTester";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";
import { sendBetaImportSheetRequestEmail } from "../src/lib/email/sendBetaEmails";
import {
  betaImportSheetRequestEmailHtml,
  betaImportSheetRequestEmailSubject,
} from "../src/lib/email/templates/betaImportSheetRequest";

type BetaRecipient = {
  name: string;
  email: string;
  platform: BetaPlatform;
  importSheetRequestSentAt: string | null;
};

function parseArgs(args: string[]) {
  const preview = args.includes("--preview");
  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");
  const platformFlagIndex = args.indexOf("--platform");
  const platformRaw = platformFlagIndex >= 0 ? args[platformFlagIndex + 1] : undefined;
  const platform: BetaPlatform | undefined =
    platformRaw === "android" ? "android" : platformRaw === "ios" ? "ios" : undefined;

  const consumed = new Set<number>();
  if (platformFlagIndex >= 0) {
    consumed.add(platformFlagIndex);
    consumed.add(platformFlagIndex + 1);
  }

  const to = args.find((arg, index) => !arg.startsWith("--") && !consumed.has(index));

  return { preview, all, dryRun, platform, to };
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
    .select("name, email, platform, import_sheet_request_sent_at")
    .order("email");

  if (platform) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load beta_applications: ${error.message}`);
  }

  return (data ?? []).map(row => ({
    name: String(row.name ?? "").trim() || "there",
    email: normalizeBetaEmail(String(row.email ?? "")),
    platform: row.platform === "android" ? "android" : "ios",
    importSheetRequestSentAt:
      typeof row.import_sheet_request_sent_at === "string"
        ? row.import_sheet_request_sent_at
        : null,
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const { preview, all, dryRun, platform, to } = parseArgs(args);

  const assetsBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://pinporium.app";

  const subject = betaImportSheetRequestEmailSubject();
  const sampleHtml = betaImportSheetRequestEmailHtml({
    name: "Alex",
    platform: "ios",
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

    const pending = recipients.filter(r => !r.importSheetRequestSentAt);
    const alreadySent = recipients.filter(r => r.importSheetRequestSentAt);

    console.log(
      JSON.stringify(
        {
          mode: dryRun ? "dry_run" : "broadcast",
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
      const result = await sendBetaImportSheetRequestEmail({
        name: recipient.name,
        email: recipient.email,
        platform: recipient.platform,
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
    const outPath = join(outDir, "import-sheet-request.html");
    writeFileSync(outPath, sampleHtml, "utf8");
    console.log(
      JSON.stringify(
        {
          mode: "preview",
          subject,
          writtenTo: outPath,
        },
        null,
        2,
      ),
    );
    if (!to) {
      process.exit(0);
    }
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error("Missing Supabase admin credentials.");
  }

  const normalized = normalizeBetaEmail(to!);
  const { data: row } = await admin
    .from("beta_applications")
    .select("name, platform")
    .eq("email", normalized)
    .maybeSingle();

  const result = await sendBetaImportSheetRequestEmail({
    name: String(row?.name ?? "").trim() || "there",
    email: normalized,
    platform: row?.platform === "android" ? "android" : "ios",
  });
  console.log(JSON.stringify({ to: normalized, subject, ...result }, null, 2));
  process.exit(result.sent ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
