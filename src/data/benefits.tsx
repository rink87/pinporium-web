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
            "Boards, filters, and collector shorthand (ISO, grail, DISO) so your shelf reads as clearly online as it does on cork. Collector score and stats that make opening the app feel like flexing the board.",
        bullets: [
            {
                title: "Pin boards",
                description:
                    "Curate by artist, series, fandom, or that one chaotic con weekend — your rules.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "Stats that flex",
                description:
                    "Pins, collector score, momentum — see the collection grow like it deserves.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Built for mixed vaults",
                description:
                    "Studios, licensed drops, LEs, chases — same vault, no pretending you only collect one lane.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-vault.png",
    },
    {
        title: "Discover the next pin to obsess over",
        description:
            "Browse categories, search the growing catalog, and explore what collectors are hunting — the aisle at your favorite show, without leaving the couch.",
        bullets: [
            {
                title: "Browse & search",
                description:
                    "Trending, themes, full catalog grid — find the pin you didn’t know you needed.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
            {
                title: "Community catalog",
                description:
                    "Every entry is moderated so names and variants stay searchable.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "Mixed collections welcome",
                description:
                    "Star Wars, parks, artist drops, LEs — one Discover for how you actually collect.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-discover.png",
    },
    {
        title: "A catalog worth contributing to",
        description:
            "Verified matches, clear variants and grades, contributor credit — help the database everyone trades against stay sharp. Pin people helping pin people.",
        bullets: [
            {
                title: "Reviewed entries",
                description:
                    "Human moderation keeps names and variants searchable.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Recognition",
                description:
                    "Score and badges when your submissions are approved.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "Shared language",
                description:
                    "Grading and detail fields that make trades and comps clearer.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-pin-detail.png",
    },
    {
        title: "The Hunt — ISOs, grails, and the chase",
        description:
            "Your wishlist isn’t a spreadsheet row. Tier wants as ISO, DISO, or Grail, track series, and keep the hunt where you’ll actually see it.",
        bullets: [
            {
                title: "Collector tiers",
                description:
                    "ISO, DISO, Grail — the same slang you use in groups and at shows.",
                icon: <FiTarget size={26} className="text-primary" />,
            },
            {
                title: "Series tracking",
                description:
                    "Follow variant sets from pin detail and watch completion grow.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "One hunt board",
                description:
                    "Wants, trades, and series — everything you’re still chasing in one tab.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-hunt.png",
    },
    {
        title: "Trades — matches, proposals, and follow-through",
        description:
            "Mark pins for trade, find mutual ISO ↔ trader matches on the same catalog variant, and negotiate swaps in-app — not buried in DMs.",
        bullets: [
            {
                title: "Mutual matches",
                description:
                    "See when your ISO lines up with someone else’s for-trade pin on the same variant.",
                icon: <FiRepeat size={26} className="text-primary" />,
            },
            {
                title: "Active trades",
                description:
                    "Waiting, in progress, and history — know where every swap stands.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Catalog-linked",
                description:
                    "Both sides on verified variants — fewer “which glitter LE?” mix-ups.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-trades.png",
    },
    {
        title: "Achievements & collector score",
        description:
            "Vault milestones, catalog contributions, trades, and hunt wins feed a collector score and award cards that actually reflect how deep you are in the hobby.",
        bullets: [
            {
                title: "Milestone awards",
                description:
                    "Vault, boards, variants, submissions — level up as you collect.",
                icon: <FiAward size={26} className="text-primary" />,
            },
            {
                title: "Collector score",
                description:
                    "One number that grows with pins, catalog help, and community participation.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Hunt & trade goals",
                description:
                    "ISO, DISO, grail, and trusted trader awards for the chase and the swap.",
                icon: <FiTarget size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-achievements.png",
    },
    {
        title: "Add a pin — photos, 3D viewer, catalog credit",
        description:
            "Snap front and back, fine-tune alignment, and get a pinchable 3D model in your vault. Suggest new entries for the community catalog and earn score when they’re approved.",
        bullets: [
            {
                title: "Guided capture",
                description:
                    "Front/back photos with crop, tilt, and duplicate detection before you save.",
                icon: <FiBookOpen size={26} className="text-primary" />,
            },
            {
                title: "3D pin viewer",
                description:
                    "Interactive model from your photos — auto-rotate or drag to admire the enamel.",
                icon: <FiRotateCw size={26} className="text-primary" />,
            },
            {
                title: "Suggest for catalog",
                description:
                    "Optional submission after add — help the community and earn collector score.",
                icon: <FiAward size={26} className="text-primary" />,
            },
        ],
        imageSrc: "/images/feature-pin-added.png",
        videoSrc: "/images/pin-3d-viewer.mp4",
        videoPosterSrc: "/images/feature-pin-added.png",
    },
];
