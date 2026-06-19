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
                icon: <FiBookOpen size={26} className="text-primary-ink" />,
            },
            {
                title: "Collection stats",
                description:
                    "Pin count, collector score, and momentum — watch the vault grow over time.",
                icon: <FiLayers size={26} className="text-primary-ink" />,
            },
            {
                title: "Every kind of pin",
                description:
                    "Artist drops, licensed pins, LEs, and chases together — no splitting your collection across apps.",
                icon: <FiSearch size={26} className="text-primary-ink" />,
            },
        ],
        imageSrc: "/images/feature-vault.png",
    },
    {
        title: "Discover listings & the catalog",
        description:
            "Browse for-trade and for-sale listings, search the catalog, find collectors, and see what’s popular — find your next grail without digging through old screenshots.",
        bullets: [
            {
                title: "Collector listings",
                description:
                    "For trade and for sale on Discover — preview a listing before you message or send an offer.",
                icon: <FiSearch size={26} className="text-primary-ink" />,
            },
            {
                title: "Browse & search",
                description:
                    "Trending pins, themes, and the full catalog — filter and explore from one place.",
                icon: <FiBookOpen size={26} className="text-primary-ink" />,
            },
            {
                title: "Collector profiles",
                description:
                    "Search collectors by username, visit public profiles, and see trade and sale listings in one place.",
                icon: <FiLayers size={26} className="text-primary-ink" />,
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
                icon: <FiLayers size={26} className="text-primary-ink" />,
            },
            {
                title: "Contributor credit",
                description:
                    "Earn collector score and badges when your submissions are approved.",
                icon: <FiBookOpen size={26} className="text-primary-ink" />,
            },
            {
                title: "Clear pin details",
                description:
                    "Edition, grade, enamel, and metal — the details that matter when you trade or compare.",
                icon: <FiSearch size={26} className="text-primary-ink" />,
            },
        ],
        imageSrc: "/images/feature-pin-detail.png",
    },
    {
        title: "The Hunt — wants, offers & series",
        description:
            "Your wishlist, deal inbox, and set progress live in one tab on The Hunt — Wants for ISOs and grails, Offers for trades and sales, Series for completion rings.",
        bullets: [
            {
                title: "Wants",
                description:
                    "ISO, DISO, and Grail tiers — mark how badly you want each pin.",
                icon: <FiTarget size={26} className="text-primary-ink" />,
            },
            {
                title: "Offers",
                description:
                    "Trades and sale offers in one inbox — Needs action, Waiting, and History.",
                icon: <FiRepeat size={26} className="text-primary-ink" />,
            },
            {
                title: "Series",
                description:
                    "Track variant sets and series completion from pin detail.",
                icon: <FiLayers size={26} className="text-primary-ink" />,
            },
        ],
        imageSrc: "/images/feature-hunt.png",
        imageSrcs: [
            "/images/feature-hunt.png",
            "/images/feature-offer-sent.png",
            "/images/feature-sale-complete.png",
        ],
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
                icon: <FiAward size={26} className="text-primary-ink" />,
            },
            {
                title: "Collector score",
                description:
                    "One score that grows with pins added, submissions approved, and more.",
                icon: <FiLayers size={26} className="text-primary-ink" />,
            },
            {
                title: "Hunt & trade awards",
                description:
                    "Goals for ISOs, grails, DISOs, and completed trades.",
                icon: <FiTarget size={26} className="text-primary-ink" />,
            },
        ],
        imageSrc: "/images/feature-achievements.png",
    },
    {
        title: "Add a pin — photos, 3D viewer, catalog credit",
        description:
            "Photograph front and back, line them up, and save a 3D model you can spin in your vault. Retake photos anytime, suggest new catalog entries, and earn score when they’re approved.",
        bullets: [
            {
                title: "Guided capture",
                description:
                    "Step-by-step photos with crop, tilt, and duplicate checks before you save.",
                icon: <FiBookOpen size={26} className="text-primary-ink" />,
            },
            {
                title: "3D pin viewer",
                description:
                    "Interactive model from your photos — rotate and admire the enamel.",
                icon: <FiRotateCw size={26} className="text-primary-ink" />,
            },
            {
                title: "Retake & suggest",
                description:
                    "Replace vault photos from pin detail, then optionally submit new pins to the catalog.",
                icon: <FiAward size={26} className="text-primary-ink" />,
            },
        ],
        imageSrc: "/images/feature-pin-added.png",
        videoSrc: "/images/pin-3d-viewer.mp4",
        videoPosterSrc: "/images/feature-pin-added.png",
    },
];
