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
  version: "1.0.4",
  label: "Next release",
  summary: "Faster vault onboarding and timely offer updates.",
  features: [
    {
      id: "bulk-upload",
      title: "Bulk upload",
      description:
        "Import many pins at once — spreadsheet mapping and batch photo flows so mail-day hauls and backlogs land in your vault without one-by-one entry.",
    },
    {
      id: "push-notifications",
      title: "Push notifications",
      description:
        "Alerts on The Hunt → Offers — trade and for-sale events like new proposals, counters, accept/decline, expiry, shipping updates, and pending sales.",
    },
  ] satisfies RoadmapFeature[],
};

export const ROADMAP_FUTURE_FEATURES = [
  {
    id: "drop-zone",
    title: "Drop Zone & reminders",
    description:
      "Artist drop pages with countdowns and remind-me — so collectors show up when limited releases go live.",
  },
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
    title: "Convention mode",
    description:
      "Offline-friendly flows for pin shows — fast vault lookup, trade handoffs, and booth-day capture when Wi‑Fi is spotty.",
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
  {
    id: "artist-tools",
    title: "Artist & shop tools",
    description:
      "Verified catalogs, drop analytics, and fan-facing pages for studios and small shops partnering with Pinporium.",
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
