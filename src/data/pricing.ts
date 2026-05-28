import { IPricing } from "@/types";

/** Roadmap cards — what’s live, what’s next, what’s later */
export const tiers: IPricing[] = [
    {
        name: "In the app now",
        price: "Beta",
        summary: "Available to beta testers today.",
        features: [
            "Your vault, pin boards, and collection stats",
            "Discover and search the pin catalog",
            "The Hunt: ISOs, DISOs, grails, and series tracking",
            "Trade matching, proposals, and trade history",
            "Add pins with photos and a 3D viewer",
            "Achievements and collector score",
        ],
    },
    {
        name: "Coming next",
        price: "Soon",
        summary: "On deck after the core beta.",
        features: [
            "Drop reminders when artists release new pins",
            "Shareable collection cards",
            "Activity from collectors you follow",
            "Convention mode for pin shows",
        ],
    },
    {
        name: "Further out",
        price: "Later",
        summary: "When buying and selling need more trust built in.",
        features: [
            "Buy and sell with seller reputation",
            "Price history from real sales",
            "More tools for artists and pin shops",
        ],
    },
];
