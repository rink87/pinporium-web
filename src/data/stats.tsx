import { FiLayers, FiShield, FiUsers } from "react-icons/fi";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "Whole vault",
        icon: <FiLayers size={34} className="text-secondary-ink" />,
        description:
            "Artist drops, licensed pins, limited editions, and chases — your full collection in one place.",
    },
    {
        title: "Trustworthy catalog",
        icon: <FiShield size={34} className="text-navy" />,
        description:
            "Reviewed entries so pin names and variants stay clear when you search, trade, or compare.",
    },
    {
        title: "Built for collectors",
        icon: <FiUsers size={34} className="text-primary-ink" />,
        description:
            "Track what you own, what you’d trade, and what you’re hunting — with ISO, DISO, and Grail tiers built in.",
    },
];
