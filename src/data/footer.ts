import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    legalLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading:
        'The collector-first home for enamel pins — vault, discover, the hunt, trades, achievements, and a catalog we grow together.',
    quickLinks: [
        { text: "Features", url: "/#features" },
        { text: "Roadmap", url: "/#roadmap" },
        { text: "Apply for beta", url: "/#beta" },
        { text: "FAQ", url: "/#faq" },
    ],
    legalLinks: [
        { text: "Privacy Policy", url: "/privacy" },
        { text: "Terms of Service", url: "/terms" },
    ],
    email: "help@pinporium.app",
    telephone: "",
    socials: {
        // instagram: 'https://www.instagram.com/pinporium',
        // x: 'https://twitter.com/pinporium',
    },
};
