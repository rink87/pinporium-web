import { IPricing } from "@/types";

/** Product phases — repurposes the Finwise pricing grid as a roadmap. */
export const tiers: IPricing[] = [
    {
        name: "Now — Foundation",
        price: "MVP",
        featuresBlurb: "What we’re shipping first",
        features: [
            "Community catalog with moderated submissions",
            "Vault: owns, traders, ISOs, grails, DISOs",
            "Pin boards & set-style tracking",
            "Discover: search, browse, partner studios",
        ],
        cta: "See features",
    },
    {
        name: "Next — Community pulse",
        price: "Soon",
        featuresBlurb: "Where the hobby gets networked",
        features: [
            "Trade matching & trade board",
            "Drop zone & release reminders",
            "Achievements, collector score, shareable cards",
            "Convention mode for the floor",
        ],
        cta: "Join the waitlist",
    },
    {
        name: "Later — Marketplace",
        price: "Roadmap",
        featuresBlurb: "When the rails are ready",
        features: [
            "Buy/sell with trusted seller reputation",
            "Market pricing from real transactions",
            "Deeper search & tools for artists and shops",
        ],
        cta: "Get notified",
    },
];
