import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
  betaThanksEmailHtml,
  betaThanksEmailSubject,
} from "@/lib/email/templates/betaThanks";
import { getEmailAssetsOrigin } from "@/lib/email/theme";
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
  const liveWordmarkUrl = `${getEmailAssetsOrigin()}/images/logo-wordmark.png`;

  const samples = [
    { platform: "ios" as const, name: "Chris" },
    { platform: "android" as const, name: "Chris" },
  ];

  return (
    <div className="min-h-screen bg-[#f1e5d8] p-8 font-body">
      <h1 className="font-display text-2xl text-navy mb-2">Email preview</h1>
      <p className="text-foreground-accent text-sm mb-8 max-w-xl">
        Preview inlines the wordmark; Discord button and other images load from this
        dev server. Production emails use{" "}
        <a href={liveWordmarkUrl} className="text-secondary underline">
          {liveWordmarkUrl}
        </a>{" "}
        (hosted on Vercel with the site — no separate CDN).
      </p>
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
              className="w-full min-h-[720px] rounded-lg border border-gold-deco/30 bg-white shadow-lg"
            />
          </section>
        ))}
      </div>
    </div>
  );
}
