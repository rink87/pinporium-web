import type { Metadata } from "next";
import Link from "next/link";

import ChangelogDetailCard from "@/components/ChangelogDetailCard";
import Container from "@/components/Container";
import { RELEASE_NOTES } from "@/content/release-notes";
import { siteDetails } from "@/data/siteDetails";

/** Linked from the app — not indexed for search or scrapers. */
export const metadata: Metadata = {
  title: `Release changelog — ${siteDetails.siteName}`,
  description: "Detailed Pinporium release notes for beta testers.",
  robots: { index: false, follow: false },
};

export default function BetaChangelogPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 -z-10 deco-grid opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 deco-sunburst opacity-80"
        aria-hidden
      />

      <article className="pt-28 md:pt-32 pb-20 md:pb-24">
        <Container className="max-w-3xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
              Beta
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight">
              Release changelog
            </h1>
            <p className="mt-4 text-foreground-accent font-body leading-relaxed text-lg">
              Summary themes plus full detail for each Pinporium build. Opened
              from the app — not listed in search.
            </p>
          </div>

          <div className="mt-12 md:mt-16 flex flex-col items-stretch gap-14 md:gap-16">
            {RELEASE_NOTES.length === 0 ? (
              <p className="text-foreground-accent font-body text-center">
                No release notes yet.
              </p>
            ) : (
              RELEASE_NOTES.map((entry, index) => (
                <div
                  key={entry.version}
                  id={`v${entry.version.replace(/\./g, "-")}`}
                  className="scroll-mt-28"
                >
                  <ChangelogDetailCard entry={entry} isLatest={index === 0} />
                </div>
              ))
            )}
          </div>

          <p className="mt-14 text-center font-body text-foreground-accent text-sm">
            <Link
              href="/"
              className="text-secondary-ink font-semibold hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        </Container>
      </article>
    </div>
  );
}
