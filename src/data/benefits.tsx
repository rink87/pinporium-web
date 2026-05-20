import { FiBookOpen, FiLayers, FiSearch } from "react-icons/fi";

import { IBenefit } from "@/types";

export const benefits: IBenefit[] = [
    {
        title: "Your vault — every pin, one gorgeous home",
        description:
            "Boards, filters, value, and collector shorthand (ISO, grail, DISO) so your shelf reads as clearly online as it does on cork. Finally an excuse to open the app just to admire what you’ve pulled.",
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
                    "Pins, value, momentum — see the collection grow like it deserves.",
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
            "Browse categories, spot partner artists, search the catalog, and keep ISOs and grails where you’ll actually see them — the hunt stays fun instead of scattered across screenshots.",
        bullets: [
            {
                title: "Browse & search",
                description:
                    "Trending, new drops, themes — scroll like it’s the aisle at your favorite show.",
                icon: <FiSearch size={26} className="text-primary" />,
            },
            {
                title: "ISOs & grails",
                description:
                    "Tier the chase so alerts match how badly you want it.",
                icon: <FiLayers size={26} className="text-primary" />,
            },
            {
                title: "Trades on the roadmap",
                description:
                    "Match traders with reputation in mind — not lost DMs.",
                icon: <FiBookOpen size={26} className="text-primary" />,
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
                    "Score and badges for collectors who level up the canon.",
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
];
