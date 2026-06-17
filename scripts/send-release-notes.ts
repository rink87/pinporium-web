/**
 * Preview or send the latest release-notes email (Resend).
 *
 * Preview HTML (no send):
 *   npx tsx scripts/send-release-notes.ts --preview
 *
 * Send test to yourself:
 *   npx tsx --env-file=.env.local scripts/send-release-notes.ts rink87@gmail.com
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildLatestReleaseNotesEmailHtml } from "../src/lib/email/sendReleaseNotesEmail";
import { sendReleaseNotesEmail } from "../src/lib/email/sendReleaseNotesEmail";

async function main() {
  const args = process.argv.slice(2);
  const preview = args.includes("--preview");
  const to = args.find(arg => !arg.startsWith("--"));

  const assetsBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://pinporium.app";

  const { entry, subject, html } = buildLatestReleaseNotesEmailHtml({
    assetsBaseUrl,
  });

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

  const result = await sendReleaseNotesEmail({ to, assetsBaseUrl });
  console.log(JSON.stringify({ to, subject, ...result }, null, 2));
  process.exit(result.sent ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
