import { homeSectionAnchor } from "@/lib/homeNav";
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
        { text: "Download on the App Store", url: "https://apps.apple.com/us/app/pinporium/id6773060260?itscg=30200&itsct=apps_box_badge&mttnsubad=6773060260" },
        { text: "Android beta", url: "#" },
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
