import { IPricing } from "@/types";

/** Product phases — repurposes the Finwise pricing grid as a roadmap. */
export const tiers: IPricing[] = [
    {
        name: "Now — Beta",
        price: "Live",
        featuresBlurb: "In the app today",
        features: [
            "Vault, pin boards, collector score & achievements",
            "Discover, catalog search, moderated submissions",
            "The Hunt: ISOs, DISOs, grails & series tracking",
            "Trade matching, proposals & trade history",
            "Add-pin flow with 3D viewer from your photos",
        ],
        cta: "Apply for beta",
    },
    {
        name: "Next — Community pulse",
        price: "Soon",
        featuresBlurb: "Where the hobby gets louder",
        features: [
            "Drop zone & release reminders",
            "Shareable cards & activity feeds",
            "Convention mode for the floor",
            "Verified artist & studio partnerships",
        ],
        cta: "Apply for beta",
    },
    {
        name: "Later — Marketplace",
        price: "Roadmap",
        featuresBlurb: "When the rails are ready",
        features: [
            "Buy/sell with trusted seller reputation",
            "Market pricing from real transactions",
            "Deeper tools for artists and shops",
        ],
        cta: "Apply for beta",
    },
];
