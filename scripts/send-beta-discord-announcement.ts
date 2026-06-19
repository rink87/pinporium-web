/**
 * Preview or send the beta Discord move announcement (Resend).
 *
 * Preview HTML (no send):
 *   npx tsx scripts/send-beta-discord-announcement.ts --preview
 *
 * List all beta testers (no send):
 *   npx tsx --env-file=.env.local scripts/send-beta-discord-announcement.ts --all --dry-run
 *
 * Send to all beta testers in admin:
 *   npx tsx --env-file=.env.local scripts/send-beta-discord-announcement.ts --all
 *
 * Send test to yourself:
 *   npx tsx --env-file=.env.local scripts/send-beta-discord-announcement.ts rink87@gmail.com
 *
 * Personalized test:
 *   npx tsx --env-file=.env.local scripts/send-beta-discord-announcement.ts --name "Alex" alex@example.com
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";
import {
  buildBetaDiscordAnnouncementEmail,
  sendBetaDiscordAnnouncementEmail,
} from "../src/lib/email/sendBetaDiscordAnnouncement";

type BetaRecipient = { name: string; email: string };

function parseArgs(args: string[]) {
  const preview = args.includes("--preview");
  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");
  const nameFlagIndex = args.indexOf("--name");
  const name =
    nameFlagIndex >= 0 ? args[nameFlagIndex + 1] : undefined;
  const to = args.find(
    arg => !arg.startsWith("--") && arg !== name,
  );

  return { preview, all, dryRun, name, to };
}

async function listBetaRecipients(): Promise<BetaRecipient[]> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  const { data, error } = await admin
    .from("beta_applications")
    .select("name, email")
    .order("email");

  if (error) {
    throw new Error(`Failed to load beta_applications: ${error.message}`);
  }

  return (data ?? []).map(row => ({
    name: String(row.name ?? "").trim() || "there",
    email: String(row.email ?? "").trim().toLowerCase(),
  }));
}

async function main() {
  const { preview, all, dryRun, name, to } = parseArgs(process.argv.slice(2));

  const assetsBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://pinporium.app";

  if (all) {
    const recipients = await listBetaRecipients();
    if (recipients.length === 0) {
      throw new Error("No beta testers found in beta_applications.");
    }

    console.log(
      JSON.stringify(
        {
          mode: dryRun ? "dry_run" : "broadcast",
          count: recipients.length,
          recipients,
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

    for (const recipient of recipients) {
      const result = await sendBetaDiscordAnnouncementEmail({
        to: recipient.email,
        name: recipient.name,
        assetsBaseUrl,
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
          total: recipients.length,
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

  const { subject, html } = buildBetaDiscordAnnouncementEmail({
    name,
    assetsBaseUrl,
  });

  if (preview || !to) {
    const outDir = join(import.meta.dirname, "out");
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, "beta-discord-announcement.html");
    writeFileSync(outPath, html, "utf8");
    console.log(
      JSON.stringify(
        {
          mode: "preview",
          subject,
          writtenTo: outPath,
          personalizedName: name ?? null,
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

  const result = await sendBetaDiscordAnnouncementEmail({
    to,
    name,
    assetsBaseUrl,
  });
  console.log(JSON.stringify({ to, subject, ...result }, null, 2));
  process.exit(result.sent ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
