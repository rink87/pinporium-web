import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import Container from "@/components/Container";
import { RoadmapFeatureCard } from "@/components/roadmap/RoadmapFeatureCard";
import { RoadmapJumpNav } from "@/components/roadmap/RoadmapJumpNav";
import { RoadmapSectionHeader } from "@/components/roadmap/RoadmapSectionHeader";
import { RoadmapShippedTimeline } from "@/components/roadmap/RoadmapShippedTimeline";
import {
  ROADMAP_FUTURE_FEATURES,
  ROADMAP_NEXT_RELEASE,
  type RoadmapFeature,
} from "@/content/roadmap";
import { RELEASE_NOTES } from "@/content/release-notes";
import { siteDetails } from "@/data/siteDetails";
import { fetchRoadmapVotes } from "@/lib/roadmap/votes";
import { isValidRoadmapVoterKey, ROADMAP_VOTER_COOKIE } from "@/lib/roadmap/voterCookie";

export const metadata: Metadata = {
  title: `Roadmap — ${siteDetails.siteName}`,
  description:
    "What shipped in Pinporium, what's next in v1.0.4, and future features you can upvote.",
  alternates: {
    canonical: `${siteDetails.siteUrl}/roadmap`,
  },
  openGraph: {
    title: `Roadmap — ${siteDetails.siteName}`,
    description:
      "Shipped releases, upcoming bulk upload and push notifications, and a community-voted future backlog.",
    url: `${siteDetails.siteUrl}/roadmap`,
  },
};

function voteCountFor(counts: Record<string, number>, featureId: string): number {
  return counts[featureId] ?? 0;
}

function sortByVotes(
  features: RoadmapFeature[],
  counts: Record<string, number>,
): RoadmapFeature[] {
  return [...features].sort((a, b) => {
    const diff = voteCountFor(counts, b.id) - voteCountFor(counts, a.id);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });
}

export default async function RoadmapPage() {
  const jar = cookies();
  const voterKey = jar.get(ROADMAP_VOTER_COOKIE)?.value;
  const { counts, votedFeatureIds } = await fetchRoadmapVotes(
    isValidRoadmapVoterKey(voterKey) ? voterKey : null,
  );
  const voted = new Set(votedFeatureIds);
  const shipped = RELEASE_NOTES.slice(0, 3);
  const futureSorted = sortByVotes(ROADMAP_FUTURE_FEATURES, counts);

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
        <Container className="max-w-4xl">
          <header className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
              Product
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight">
              Roadmap
            </h1>
            <p className="mt-4 text-foreground-accent font-body leading-relaxed text-lg">
              Where Pinporium is headed — vote on what we build next, then browse
              what already shipped.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto text-center">
              <div className="rounded-deco border border-gold-deco/25 bg-cream/70 px-3 py-3">
                <dt className="text-[10px] uppercase tracking-deco-wide text-foreground-accent font-body">
                  Next
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-secondary-ink">
                  v{ROADMAP_NEXT_RELEASE.version}
                </dd>
              </div>
              <div className="rounded-deco border border-gold-deco/25 bg-cream/70 px-3 py-3">
                <dt className="text-[10px] uppercase tracking-deco-wide text-foreground-accent font-body">
                  Ideas
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-navy">
                  {ROADMAP_FUTURE_FEATURES.length}
                </dd>
              </div>
              <div className="rounded-deco border border-gold-deco/25 bg-cream/70 px-3 py-3">
                <dt className="text-[10px] uppercase tracking-deco-wide text-foreground-accent font-body">
                  Shipped
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-navy">
                  {shipped.length}
                </dd>
              </div>
            </dl>
          </header>

          <RoadmapJumpNav
            items={[
              { href: "#next", label: `v${ROADMAP_NEXT_RELEASE.version}`, emphasis: true },
              { href: "#future", label: "Future" },
              { href: "#shipped", label: "Shipped" },
            ]}
          />

          <section aria-labelledby="roadmap-next-heading" className="mb-16 md:mb-20">
            <RoadmapSectionHeader
              id="next"
              eyebrow="On deck"
              title={`${ROADMAP_NEXT_RELEASE.label} · v${ROADMAP_NEXT_RELEASE.version}`}
              description={ROADMAP_NEXT_RELEASE.summary}
            />

            <div className="overflow-hidden rounded-deco border border-secondary/20 bg-white/80 shadow-frame">
              <div className="flex h-1" aria-hidden>
                <span className="flex-1 bg-secondary" />
                <span className="flex-1 bg-gold-deco" />
                <span className="flex-1 bg-primary" />
              </div>
              <div className="p-5 md:p-6">
                <p id="roadmap-next-heading" className="sr-only">
                  Next release features
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {ROADMAP_NEXT_RELEASE.features.map(feature => (
                    <RoadmapFeatureCard
                      key={feature.id}
                      feature={feature}
                      voteCount={voteCountFor(counts, feature.id)}
                      voted={voted.has(feature.id)}
                      variant="next"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="roadmap-future-heading" className="mb-16 md:mb-20">
            <RoadmapSectionHeader
              id="future"
              eyebrow="Community backlog"
              title="Future consideration"
              description="Not scheduled yet — sorted by upvotes. One vote per item per browser."
            />
            <p id="roadmap-future-heading" className="sr-only">
              Future roadmap features
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {futureSorted.map((feature, index) => (
                <RoadmapFeatureCard
                  key={feature.id}
                  feature={feature}
                  voteCount={voteCountFor(counts, feature.id)}
                  voted={voted.has(feature.id)}
                  rank={voteCountFor(counts, feature.id) > 0 ? index + 1 : undefined}
                  variant="future"
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="roadmap-shipped-heading">
            <RoadmapSectionHeader
              id="shipped"
              eyebrow="Release history"
              title="Shipped"
              description="The last three builds at a glance — highlights only."
              align="center"
            />
            <p id="roadmap-shipped-heading" className="sr-only">
              Shipped releases
            </p>
            <RoadmapShippedTimeline entries={shipped} />
            <p className="mt-8 text-center font-body text-sm text-foreground-accent">
              <Link href="/changelog" className="text-secondary-ink font-semibold hover:underline">
                View full changelog →
              </Link>
            </p>
          </section>

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
