import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const samples = [
    { platform: "ios" as const, name: "Chris" },
    { platform: "android" as const, name: "Chris" },
  ];

  return (
    <div className="min-h-screen bg-[#f1e5d8] p-8 font-body">
      <h1 className="font-display text-2xl text-navy mb-2">Beta welcome email preview</h1>

      <div className="mb-8 max-w-2xl space-y-3 rounded-lg border border-gold-deco/40 bg-cream/80 p-4 text-sm text-foreground-accent">
        <p className="text-navy font-medium">When does the tester get this email?</p>
        <p>
          <strong>Not</strong> automatically when they submit the form on the site. After
          signup, they only see the on-site success message. You send this welcome email by
          reacting with <strong>:incoming_envelope:</strong> on their Slack signup post.
        </p>
        <p>
          Right after the form they see: &ldquo;You&apos;re on the list. We&apos;ll review
          your request and email you the TestFlight / Google Play link.&rdquo;
        </p>
        <p>
          <Link href="/" className="text-secondary underline">
            Open site
          </Link>{" "}
          to try the form · images load from this dev server in preview only.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {samples.map((sample) => (
          <section key={sample.platform} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-accent">
              {sample.platform === "ios" ? "iPhone" : "Android"} —{" "}
              {betaThanksEmailSubject(sample.platform)}
            </h2>
            <iframe
              title={`Beta thanks — ${sample.platform}`}
              srcDoc={betaThanksEmailHtml({
                name: sample.name,
                platform: sample.platform,
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
