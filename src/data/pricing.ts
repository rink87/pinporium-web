import { IPricing } from "@/types";

/** Homepage roadmap teaser — full detail on /roadmap */
export const tiers: IPricing[] = [
    {
        name: "In the app now",
        price: "Beta",
        summary: "Available to beta testers today.",
        features: [
            "Vault, pin boards, and collector score",
            "Bulk import — spreadsheets on web and in the app",
            "Discover, catalog search, and ISOs / grails",
            "The Hunt — Wants, Offers (trades & sales), and Series",
            "Public profiles, collector search, and listings",
            "Achievements, 3D pin viewer, and catalog submissions",
        ],
        exploreHref: "/roadmap#shipped",
        exploreLabel: "See what's shipped",
    },
    {
        name: "Next — v1.0.5",
        price: "Soon",
        summary: "Push alerts when offers need your attention.",
        features: [
            "Push notifications for trade and sale offer events",
        ],
        exploreHref: "/roadmap#next",
        exploreLabel: "Preview v1.0.5",
    },
    {
        name: "Further out",
        price: "Later",
        summary: "Community pulse, trust, and marketplace depth.",
        features: [
            "Drop Zone reminders when artists release pins",
            "Shareable collection cards and activity feed",
            "Convention mode for pin shows",
            "In-app marketplace, price history, and Pro tier",
        ],
        exploreHref: "/roadmap#future",
        exploreLabel: "Upvote future ideas",
    },
];
