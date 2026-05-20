import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading:
        'The collector-first home for enamel pins — vault, discover, badges, trades on the way, and a catalog we grow together.',
    quickLinks: [
        { text: "Features", url: "#features" },
        { text: "Roadmap", url: "#roadmap" },
        { text: "FAQ", url: "#faq" },
    ],
    email: "",
    telephone: "",
    socials: {
        // instagram: 'https://www.instagram.com/pinporium',
        // x: 'https://twitter.com/pinporium',
    },
};
