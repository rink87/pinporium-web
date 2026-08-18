import { IPricing } from "@/types";

/** Homepage roadmap teaser — full detail on /roadmap */
export const tiers: IPricing[] = [
    {
        name: "In the app now",
        price: "Live",
        summary: "On the App Store and Google Play.",
        features: [
            "Vault, pin boards, and collector score",
            "Bulk import — spreadsheets on web and in the app",
            "Discover, catalog search, and ISOs / grails",
            "The Hunt — Wants, Offers (trades & sales), and Series",
            "Push notifications for Offers and catalog decisions",
            "Public profiles, collector search, and listings",
            "Achievements, 3D pin viewer, and catalog submissions",
        ],
        exploreHref: "/roadmap#shipped",
        exploreLabel: "See what's shipped",
    },
    {
        name: "Next — v1.0.6",
        price: "Soon",
        summary: "Partner studios and drop-day alerts.",
        features: [
            "Partner artist tools for verified catalogs",
            "Drop alerts when limited releases go live",
        ],
        exploreHref: "/roadmap#next",
        exploreLabel: "Preview v1.0.6",
    },
    {
        name: "Further out",
        price: "Later",
        summary: "Community pulse, trust, and marketplace depth.",
        features: [
            "Shareable collection cards and activity feed",
            "Convention card for pin shows",
            "In-app marketplace, price history, and Pro tier",
        ],
        exploreHref: "/roadmap#future",
        exploreLabel: "Upvote future ideas",
    },
];
