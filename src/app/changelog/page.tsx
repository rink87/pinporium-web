import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/Container";
import WhatsNewCard from "@/components/WhatsNewCard";
import { RELEASE_NOTES } from "@/content/release-notes";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
  title: `Changelog — ${siteDetails.siteName}`,
  description: `Release notes and updates for the ${siteDetails.siteName} enamel pin collection app.`,
  alternates: {
    canonical: `${siteDetails.siteUrl}/changelog`,
  },
  openGraph: {
    title: `Changelog — ${siteDetails.siteName}`,
    description: `What's new in ${siteDetails.siteName} — vault, catalog, hunt, trades, and more.`,
    url: `${siteDetails.siteUrl}/changelog`,
  },
};

export default function ChangelogPage() {
  return (
    <div className="relative overflow-hidden">
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
              Updates
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight">
              Changelog
            </h1>
            <p className="mt-4 text-foreground-accent font-body leading-relaxed text-lg">
              New features and improvements in each release of Pinporium.
            </p>
          </div>

          <div className="mt-12 md:mt-16 flex flex-col items-center gap-10 md:gap-14">
            {RELEASE_NOTES.length === 0 ? (
              <p className="text-foreground-accent font-body text-center">
                No release notes yet — check back after the next build.
              </p>
            ) : (
              RELEASE_NOTES.map((entry, index) => (
                <WhatsNewCard
                  key={entry.version}
                  entry={entry}
                  isLatest={index === 0}
                />
              ))
            )}
          </div>

          <p className="mt-14 text-center font-body text-foreground-accent">
            <Link
              href="/"
              className="text-secondary font-semibold hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        </Container>
      </article>
    </div>
  );
}
