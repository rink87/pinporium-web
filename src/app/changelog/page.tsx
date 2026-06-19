import type { Metadata } from "next";
import Link from "next/link";

import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline";
import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";
import { RELEASE_NOTES } from "@/content/release-notes";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
  title: `Changelog — ${siteDetails.siteName}`,
  description:
    "Every Pinporium release — new features, improvements, and bug fixes across each version.",
  alternates: {
    canonical: `${siteDetails.siteUrl}/changelog`,
  },
  openGraph: {
    title: `Changelog — ${siteDetails.siteName}`,
    description:
      "Granular release history for Pinporium — features, improvements, and fixes by version.",
    url: `${siteDetails.siteUrl}/changelog`,
    type: "website",
  },
};

export default function ChangelogPage() {
  const url = `${siteDetails.siteUrl}/changelog`;

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

      <JsonLd
        data={[
          {
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: `Changelog — ${siteDetails.siteName}`,
            description:
              "Release history for Pinporium with new features, improvements, and bug fixes by version.",
            isPartOf: { "@id": `${siteDetails.siteUrl}/#website` },
            inLanguage: siteDetails.locale,
          },
        ]}
      />

      <article className="pt-28 md:pt-32 pb-20 md:pb-24">
        <Container className="max-w-3xl">
          <header className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-deco-wide text-foreground font-body mb-3">
              Release history
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight text-balance">
              Changelog
            </h1>
            <p className="mt-4 text-foreground font-body leading-relaxed text-lg">
              Every Pinporium release, version by version — what&apos;s new, what&apos;s
              improved, and what we fixed. For what&apos;s coming next, see the{" "}
              <Link href="/roadmap" className="text-secondary-ink font-semibold hover:underline">
                roadmap
              </Link>
              .
            </p>
          </header>

          <div className="mt-12 md:mt-16">
            {RELEASE_NOTES.length === 0 ? (
              <p className="text-foreground-accent font-body text-center">
                No release notes yet.
              </p>
            ) : (
              <ChangelogTimeline entries={RELEASE_NOTES} />
            )}
          </div>

          <p className="mt-14 text-center font-body text-foreground/80 text-sm">
            <Link href="/" className="text-secondary-ink font-semibold hover:underline">
              ← Back to home
            </Link>
          </p>
        </Container>
      </article>
    </div>
  );
}
