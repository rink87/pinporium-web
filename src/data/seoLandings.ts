import { siteDetails } from "./siteDetails";

export type LandingSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoLandingPage = {
  slug: string;
  path: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  metaTitle: string;
  metaDescription: string;
  sections: LandingSection[];
  relatedSlugs: string[];
  ctaHeading?: string;
  ctaSubheading?: string;
};

const support = siteDetails.supportEmail;

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: "for-artists",
    path: "/for-artists",
    eyebrow: "Artists & shops",
    heading: "Put your pins where collectors already catalog and trade",
    subheading:
      "Pinporium is building a reviewed enamel pin catalog with verified artist and shop listings — so collectors find the right variant, and you stay connected to the people who collect your work.",
    metaTitle: `For pin artists & shops — ${siteDetails.siteName}`,
    metaDescription:
      "Partner with Pinporium: verified catalog listings, consistent pin names and variants, and a collector community that hunts, trades, and grows your releases in one app.",
    sections: [
      {
        id: "why",
        title: "Why artists work with Pinporium",
        paragraphs: [
          "Collectors already organize vaults, ISO lists, and trades in Pinporium. When your releases live in the same catalog they search every day, discovery doesn’t depend on scattered social posts or screenshots.",
          "We review submissions so pin names, editions, and variants stay consistent — fewer mix-ups when someone wants to trade or complete a series.",
        ],
        bullets: [
          "Verified listings tied to your studio or shop",
          "Collectors link vault pins to the same catalog entry you care about",
          "Series and drop awareness through Discover and The Hunt",
          "Early partner input on how listings and attribution work",
        ],
      },
      {
        id: "catalog",
        title: "A catalog collectors contribute to — with you in mind",
        paragraphs: [
          "The shared catalog grows from collector photos and details, approved by our team. Artists and shops can claim and maintain authoritative entries so your releases aren’t duplicated or mislabeled.",
          "Limited editions, chases, and variant grades (PV, LE, etc.) are first-class — the way serious collectors actually talk about pins.",
        ],
      },
      {
        id: "partner",
        title: "Partner early in the beta",
        paragraphs: [
          `We’re inviting a small group of artists and shops before public App Store and Google Play launch. Tell us about your releases, claim strategy, and how you want collectors to find you.`,
          `Email ${support} with your shop name, typical drop cadence, and links to your store or socials. We’ll follow up with next steps for verified listings.`,
        ],
      },
    ],
    relatedSlugs: [
      "for-collectors",
      "enamel-pin-collection",
      "pin-trading",
    ],
    ctaHeading: "Collectors are already building vaults",
    ctaSubheading:
      "Join as a catalog partner while the beta is growing — help shape how artists show up in Pinporium.",
  },
  {
    slug: "for-collectors",
    path: "/for-collectors",
    eyebrow: "Collectors",
    heading: "One app for your whole enamel pin collection",
    subheading:
      "Artist drops, licensed pins, con hauls, limited editions, and chases — catalog what you own, hunt what you need, and trade or sell on The Hunt without losing threads in DMs.",
    metaTitle: `For enamel pin collectors — ${siteDetails.siteName}`,
    metaDescription:
      "Pinporium is the collector-first pin app: vault, boards, Discover listings, The Hunt (Wants, Offers, Series), achievements, and a shared catalog you can contribute to.",
    sections: [
      {
        id: "vault",
        title: "Your vault — every pin, one home",
        paragraphs: [
          "Photograph pins, spin a 3D viewer from your shots, and organize boards by artist, series, or con haul. Collection stats and collector score show momentum over time.",
        ],
        bullets: [
          "Search your vault instantly",
          "Pin boards for how you actually collect",
          "Every fandom in one place — not split across apps",
        ],
      },
      {
        id: "hunt",
        title: "The Hunt — wants, offers & series",
        paragraphs: [
          "Wants holds your ISO, DISO, and Grail lists. Offers is the subtab for trade proposals, sale offers, and mutual matches. Series tracks set completion — all in one Hunt tab.",
        ],
        bullets: [
          "Wants — tier what you’re still chasing",
          "Offers — trades and for-sale deals with Needs action, Waiting, and History",
          "Series — completion rings from pin detail",
        ],
      },
      {
        id: "beta",
        title: "Join the beta",
        paragraphs: [
          "Apply on pinporium.app. After we review your request, you’ll get email instructions for TestFlight (iOS) or Google Play internal testing (Android).",
        ],
      },
    ],
    relatedSlugs: [
      "enamel-pin-collection",
      "pin-wishlist",
      "pin-trading",
    ],
  },
  {
    slug: "enamel-pin-collection",
    path: "/enamel-pin-collection",
    eyebrow: "Collection app",
    heading: "Track your enamel pin collection in one vault",
    subheading:
      "Pinporium replaces spreadsheets and camera rolls with a searchable vault, shared catalog entries, and stats that reflect how deep you are in the hobby.",
    metaTitle: `Enamel pin collection app — ${siteDetails.siteName}`,
    metaDescription:
      "Track enamel pins with photos, boards, catalog links, collection value context, and collector score. Built for artist pins, licensed releases, LEs, and chases.",
    sections: [
      {
        id: "organize",
        title: "Organize every pin you own",
        paragraphs: [
          "Add pins with guided front-and-back photos, optional 3D models, and links to reviewed catalog entries. Group by board, filter by artist or series, and see counts at a glance.",
        ],
        bullets: [
          "Artist studio drops and shop releases",
          "Licensed and pop-culture pins",
          "Limited editions, chases, and convention pickups",
        ],
      },
      {
        id: "discover",
        title: "Discover listings & what to collect next",
        paragraphs: [
          "Browse for-trade and for-sale collector listings, search the catalog from Discover, and open a listing preview before you message someone.",
        ],
      },
      {
        id: "grow",
        title: "Grow the catalog as you collect",
        paragraphs: [
          "Suggest new entries when you add a pin. Approved submissions earn contributor credit and help everyone find the same release later.",
        ],
      },
    ],
    relatedSlugs: ["for-collectors", "pin-wishlist", "for-artists"],
  },
  {
    slug: "pin-trading",
    path: "/pin-trading",
    eyebrow: "Trading",
    heading: "Trade enamel pins in the app — not in a messy thread",
    subheading:
      "Mark pins for trade or for sale, find mutual matches on the same catalog entry, and follow swaps and sale offers on The Hunt → Offers from proposal to shipment.",
    metaTitle: `Enamel pin trading app — ${siteDetails.siteName}`,
    metaDescription:
      "Trade and sell enamel pins on The Hunt Offers tab — matched collectors, unified inbox, and catalog-linked variants.",
    sections: [
      {
        id: "matches",
        title: "Mutual matches that make sense",
        paragraphs: [
          "When your ISO lines up with someone else’s for-trade pin on the same catalog variant, Pinporium surfaces the match — so you’re negotiating the right pin, not a lookalike.",
        ],
      },
      {
        id: "workflow",
        title: "Offers on The Hunt",
        paragraphs: [
          "The Offers subtab on The Hunt shows trade proposals, sale offers, and completed deals in one place. Trade profiles support shipping for the US and Canada with formatted addresses.",
        ],
        bullets: [
          "Proposals, counters, and sale offers in-app",
          "History when you need to reference an old swap or sale",
          "Same catalog entry on both sides of every deal",
        ],
      },
      {
        id: "start",
        title: "Start trading in the beta",
        paragraphs: [
          "Set trade policy and shipping during onboarding so you’re ready when a match hits. Apply for beta access on the homepage.",
        ],
      },
    ],
    relatedSlugs: ["for-collectors", "pin-wishlist", "enamel-pin-collection"],
  },
  {
    slug: "pin-wishlist",
    path: "/pin-wishlist",
    eyebrow: "Wishlist & hunt",
    heading: "Pin wishlist app for ISOs, DISOs, and grails",
    subheading:
      "The Hunt Wants subtab is Pinporium’s wishlist for enamel collectors — tier ISO, DISO, and Grail, track series, and keep chasing without losing lists in screenshots or Notes.",
    metaTitle: `Pin wishlist & ISO tracker — ${siteDetails.siteName}`,
    metaDescription:
      "Track pin ISOs, DISOs, and grails in one hunt list. Series completion, catalog-linked wants, and trade matches when someone has your pin for swap.",
    sections: [
      {
        id: "tiers",
        title: "ISO, DISO, and Grail tiers",
        paragraphs: [
          "Not every want is equal. Mark how badly you need each pin so your hunt list reflects real priority — from casual ISO to grail you’d trade anything for.",
        ],
      },
      {
        id: "series",
        title: "Series and set completion",
        paragraphs: [
          "Follow a series from pin detail and watch completion add up. Great for artist drops, park-adjacent sets, and licensed lines you’re building over months.",
        ],
      },
      {
        id: "connect",
        title: "Connected to vault and trades",
        paragraphs: [
          "The Hunt sits beside your vault. Wants lists what you need; Offers on The Hunt is where trades and matches happen — both sides on the same catalog entry.",
        ],
      },
    ],
    relatedSlugs: ["for-collectors", "pin-trading", "enamel-pin-collection"],
  },
];

export function getSeoLanding(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES.find((p) => p.slug === slug);
}

export function getSeoLandingPaths(): string[] {
  return SEO_LANDING_PAGES.map((p) => p.path);
}
