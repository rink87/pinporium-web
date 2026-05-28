import {
    FiAward,
    FiBookOpen,
    FiLayers,
    FiRepeat,
    FiRotateCw,
    FiSearch,
    FiTarget,
} from "react-icons/fi";

import { IBenefit } from "@/types";

export const benefits: IBenefit[] = [
    {
        title: "Your vault — every pin, one gorgeous home",
        description:
            "Organize with pin boards, search your collection, and see collector score and stats at a glance — the shelf you’re proud of, in your pocket.",
        bullets: [
            {
                title: "Pin boards",
                description:
                    "Group pins by artist, series, fandom, or that one unforgettable con haul.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "Collection stats",
                description:
                    "Pin count, collector score, and momentum — watch the vault grow over time.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Every kind of pin",
                description:
                    "Artist drops, licensed pins, LEs, and chases together — no splitting your collection across apps.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-vault.png",
    },
    {
        title: "Discover the next pin to obsess over",
        description:
            "Browse categories, search the catalog, and see what’s popular — find your next grail without digging through old screenshots.",
        bullets: [
            {
                title: "Browse & search",
                description:
                    "Trending pins, themes, and the full catalog — filter and explore from one place.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
            {
                title: "Shared catalog",
                description:
                    "Every listing is reviewed so names and variants stay easy to find.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "All your fandoms",
                description:
                    "Star Wars, parks, artist studios, and more — one Discover for how you actually collect.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-discover.png",
    },
    {
        title: "A catalog worth contributing to",
        description:
            "Link your pins to reviewed catalog entries, track variants and grades, and earn credit when you help fill gaps everyone searches for.",
        bullets: [
            {
                title: "Reviewed entries",
                description:
                    "Human review keeps pin names and variants consistent.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Contributor credit",
                description:
                    "Earn collector score and badges when your submissions are approved.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "Clear pin details",
                description:
                    "Edition, grade, enamel, and metal — the details that matter when you trade or compare.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-pin-detail.png",
    },
    {
        title: "The Hunt — ISOs, grails, and the chase",
        description:
            "Keep a real wishlist — not a forgotten note. Mark ISOs, DISOs, and Grails, track series, and see everything you’re still chasing in one place.",
        bullets: [
            {
                title: "Hunt tiers",
                description:
                    "ISO, DISO, and Grail — mark how badly you want each pin.",
                icon: <FiTarget size={26} className="text-primary" />,
            },
            {
                title: "Series tracking",
                description:
                    "Follow a set from pin detail and watch your completion add up.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "One hunt tab",
                description:
                    "Wants, trades, and series — still chasing, all in The Hunt.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-hunt.png",
    },
    {
        title: "Trades — matches, proposals, and follow-through",
        description:
            "Mark pins for trade, get matched when someone wants what you have, and follow swaps from proposal to shipment — in the app, not lost in messages.",
        bullets: [
            {
                title: "Mutual matches",
                description:
                    "See when your ISO lines up with another collector’s for-trade pin on the same catalog entry.",
                icon: <FiRepeat size={26} className="text-primary" />,
            },
            {
                title: "Active trades",
                description:
                    "Waiting, in progress, and history — always know where a swap stands.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Same catalog entry",
                description:
                    "Both sides linked to the same variant — fewer mix-ups on which pin is which.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-trades.png",
    },
    {
        title: "Achievements & collector score",
        description:
            "Earn awards as you add pins, build boards, contribute to the catalog, and complete trades — with a collector score that reflects how deep you are in the hobby.",
        bullets: [
            {
                title: "Milestone awards",
                description:
                    "Unlock levels for your vault, boards, variants, and catalog help.",
                icon: <FiAward size={26} className="text-primary" />,
            },
            {
                title: "Collector score",
                description:
                    "One score that grows with pins added, submissions approved, and more.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Hunt & trade awards",
                description:
                    "Goals for ISOs, grails, DISOs, and completed trades.",
                icon: <FiTarget size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-achievements.png",
    },
    {
        title: "Add a pin — photos, 3D viewer, catalog credit",
        description:
            "Photograph front and back, line them up, and save a 3D model you can spin in your vault. Suggest new catalog entries and earn score when they’re approved.",
        bullets: [
            {
                title: "Guided capture",
                description:
                    "Step-by-step photos with crop, tilt, and duplicate checks before you save.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "3D pin viewer",
                description:
                    "Interactive model from your photos — rotate and admire the enamel.",
                icon: <FiRotateCw size={26} className="text-primary" />,
            },
            {
                title: "Suggest for catalog",
                description:
                    "Optional submission after you add a pin — help others find it too.",
                icon: <FiAward size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-pin-added.png",
        videoSrc: "/images/pin-3d-viewer.mp4",
        videoPosterSrc: "/images/feature-pin-added.png",
    },
];
