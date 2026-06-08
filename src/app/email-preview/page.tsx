import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getWordmarkDataUri } from "@/lib/email/wordmarkDataUri";

import { EmailPreviewTabs } from "./EmailPreviewTabs";

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

  return (
    <div className="min-h-screen bg-[#f1e5d8] p-8 font-body">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy mb-2">Email preview</h1>
          <p className="text-sm text-foreground-accent max-w-2xl">
            Beta onboarding and catalog submission decision emails. Use the tabs to switch
            templates.
          </p>
        </div>
        <Link href="/" className="text-secondary-ink underline text-sm">
          Open site
        </Link>
      </div>

      <EmailPreviewTabs
        name={name}
        wordmarkSrc={wordmarkSrc}
        assetsBaseUrl={assetsBaseUrl}
      />
    </div>
  );
}
