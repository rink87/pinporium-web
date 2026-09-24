import { homeSectionAnchor } from "@/lib/homeNav";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/data/storeLinks";
import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    exploreLinks: IMenuItem[];
    legalLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading:
        'The collector-first home for enamel pins — vault, Discover, The Hunt (wants, offers, series), achievements, and a catalog we grow together.',
    quickLinks: [
        { text: "Features", url: homeSectionAnchor("features") },
        { text: "Roadmap", url: "/roadmap" },
        { text: "Changelog", url: "/changelog" },
        { text: "Import your vault", url: "/import" },
        { text: "Download on the App Store", url: APP_STORE_URL },
        { text: "Get it on Google Play", url: GOOGLE_PLAY_URL },
        { text: "FAQ", url: homeSectionAnchor("faq") },
    ],
    exploreLinks: [
        { text: "For collectors", url: "/for-collectors" },
        { text: "For artists & shops", url: "/for-artists" },
        { text: "Pin collection app", url: "/enamel-pin-collection" },
        { text: "Pin trading", url: "/pin-trading" },
        { text: "Pin wishlist", url: "/pin-wishlist" },
    ],
    legalLinks: [
        { text: "Privacy Policy", url: "/privacy" },
        { text: "Terms of Service", url: "/terms" },
        { text: "Copyright Policy", url: "/copyright" },
        { text: "Delete account", url: "/delete-account" },
    ],
    email: "help@pinporium.app",
    telephone: "",
    socials: {
        // instagram: 'https://www.instagram.com/pinporium',
        // x: 'https://twitter.com/pinporium',
    },
};
