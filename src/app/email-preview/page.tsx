import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  betaSignupReceivedEmailHtml,
  betaSignupReceivedEmailSubject,
} from "@/lib/email/templates/betaSignupReceived";
import {
  betaThanksEmailHtml,
  betaThanksEmailSubject,
} from "@/lib/email/templates/betaThanks";
import { getWordmarkDataUri } from "@/lib/email/wordmarkDataUri";

/**
 * Local preview only — open http://localhost:3001/email-preview (dev runs on 3001)
 * Production returns 404.
 */
export default function EmailPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const wordmarkSrc = getWordmarkDataUri();
  const host = headers().get("host");
  const assetsBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    (host ? `http://${host}` : "http://localhost:3001");

  const name = "Chris";
  const platforms = ["ios", "android"] as const;

  return (
    <div className="min-h-screen bg-[#f1e5d8] p-8 font-body">
      <h1 className="font-display text-2xl text-navy mb-2">Beta email preview</h1>

      <div className="mb-10 max-w-2xl space-y-3 rounded-lg border border-gold-deco/40 bg-cream/80 p-4 text-sm text-foreground-accent">
        <p className="text-navy font-medium">Two emails</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>On form submit</strong> — short &ldquo;thanks, you&apos;re on the
            list&rdquo; (below, first row).
          </li>
          <li>
            <strong>After you react :incoming_envelope: on Slack</strong> — full welcome
            with install link, checklist, and Discord (second row).
          </li>
        </ol>
        <p>
          <Link href="/" className="text-secondary underline">
            Open site
          </Link>{" "}
          to try the form.
        </p>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-accent mb-4">
        1 — Immediately after signup · {betaSignupReceivedEmailSubject()}
      </h2>
      <div className="grid gap-10 lg:grid-cols-2 mb-12">
        {platforms.map((platform) => (
          <section key={`received-${platform}`} className="space-y-3">
            <h3 className="text-sm font-medium text-navy">
              {platform === "ios" ? "iPhone" : "Android"}
            </h3>
            <iframe
              title={`Signup received — ${platform}`}
              srcDoc={betaSignupReceivedEmailHtml({
                name,
                platform,
                wordmarkSrc,
                assetsBaseUrl,
              })}
              className="w-full min-h-[420px] rounded-lg border border-gold-deco/30 bg-white shadow-lg"
            />
          </section>
        ))}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-accent mb-4">
        2 — After Slack :incoming_envelope: approval
      </h2>
      <div className="grid gap-10 lg:grid-cols-2">
        {platforms.map((platform) => (
          <section key={`welcome-${platform}`} className="space-y-3">
            <h3 className="text-sm font-medium text-navy">
              {platform === "ios" ? "iPhone" : "Android"} — {betaThanksEmailSubject(platform)}
            </h3>
            <iframe
              title={`Beta welcome — ${platform}`}
              srcDoc={betaThanksEmailHtml({
                name,
                platform,
                wordmarkSrc,
                assetsBaseUrl,
              })}
              className="w-full min-h-[780px] rounded-lg border border-gold-deco/30 bg-white shadow-lg"
            />
          </section>
        ))}
      </div>
    </div>
  );
}
