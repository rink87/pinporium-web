import { IMenuItem } from "@/types";
import { homeSectionAnchor } from "@/lib/homeNav";

export const menuItems: IMenuItem[] = [
    {
        text: "Features",
        url: homeSectionAnchor("features"),
    },
    {
        text: "For artists",
        url: "/for-artists",
    },
    {
        text: "Roadmap",
        url: "/roadmap",
    },
    // TODO: re-enable when real testimonials section ships
    // {
    //     text: "Stories",
    //     url: "#testimonials",
    // },
];
