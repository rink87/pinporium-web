/**
 * Public roadmap — upcoming features and stable IDs for community upvotes.
 * Shipped releases reuse RELEASE_NOTES (newest three on /roadmap).
 */

export type RoadmapFeature = {
  id: string;
  title: string;
  description: string;
};

export const ROADMAP_NEXT_RELEASE = {
  version: "1.0.6",
  label: "Next release",
  summary: "Tools for partner artists and alerts when drops go live.",
  features: [
    {
      id: "artist-tools",
      title: "Partner artist tools",
      description:
        "Verified catalogs, shop links, and ways for partner studios to seed and manage their official listings.",
    },
    {
      id: "drop-zone",
      title: "Drop alerts",
      description:
        "Remind-me and push when an artist drop goes live — so collectors show up for limited releases.",
    },
  ] satisfies RoadmapFeature[],
};

export const ROADMAP_FUTURE_FEATURES = [
  {
    id: "shareable-cards",
    title: "Shareable collection cards",
    description:
      "Exportable cards for grails, completed sets, and showcase boards — built for flexing and social posts.",
  },
  {
    id: "following-activity",
    title: "Following & activity feed",
    description:
      "Follow collectors you trade with and see vault wins, new ISOs, and catalog contributions in one pulse.",
  },
  {
    id: "convention-mode",
    title: "Convention card",
    description:
      "Trade-show showcase you can share by link or QR — a fast public page with the pins you pick for trade (and optional for-sale), plus a Get Pinporium CTA for anyone who scans. Digital first; optional NFC cards for in-person taps at pin meets.",
  },
  {
    id: "marketplace",
    title: "In-app marketplace",
    description:
      "Buy and sell with seller reputation, trusted-trader signals, and checkout — beyond today’s coordinate-offline sales.",
  },
  {
    id: "price-history",
    title: "Price history & market price",
    description:
      "Charts and estimates from real completed sales and market data — know what pins actually trade for.",
  },
  {
    id: "visual-search",
    title: "Visual pin search",
    description:
      "Snap or upload a photo to find catalog matches — perceptual search for duplicates, grails, and mystery pins.",
  },
  {
    id: "collection-value",
    title: "Collection value tracking",
    description:
      "Portfolio-style estimates across your vault using sold-listing signals — optional Pro depth over time.",
  },
  {
    id: "pro-subscription",
    title: "Pinporium Pro",
    description:
      "Unlimited vault depth, richer analytics, and reduced marketplace fees when paid tiers launch.",
  },
] satisfies RoadmapFeature[];

/** All feature IDs that accept public upvotes. */
export const ROADMAP_VOTABLE_FEATURE_IDS = new Set<string>([
  ...ROADMAP_NEXT_RELEASE.features.map(f => f.id),
  ...ROADMAP_FUTURE_FEATURES.map(f => f.id),
]);

export function isRoadmapFeatureId(value: string): boolean {
  return ROADMAP_VOTABLE_FEATURE_IDS.has(value);
}
