import type { Metadata } from "next";
import Link from "next/link";

import ChangelogEntry from "@/components/ChangelogEntry";
import Container from "@/components/Container";
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
    <article className="pt-28 md:pt-32 pb-20 md:pb-24">
      <Container className="max-w-3xl">
        <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
          Updates
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight">
          Changelog
        </h1>
        <p className="mt-4 text-foreground-accent font-body leading-relaxed text-lg max-w-2xl">
          New features and fixes as we ship beta builds. Same notes we send to
          beta testers by email.
        </p>

        <div className="mt-12 space-y-0">
          {RELEASE_NOTES.length === 0 ? (
            <p className="text-foreground-accent font-body">
              No release notes yet — check back after the next build.
            </p>
          ) : (
            RELEASE_NOTES.map((entry, index) => (
              <ChangelogEntry
                key={entry.version}
                entry={entry}
                isLatest={index === 0}
              />
            ))
          )}
        </div>

        <p className="mt-14 text-center font-body text-foreground-accent">
          <Link href="/" className="text-secondary font-semibold hover:underline">
            ← Back to home
          </Link>
        </p>
      </Container>
    </article>
  );
}
