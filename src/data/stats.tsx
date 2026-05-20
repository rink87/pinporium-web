import { FiLayers, FiShield, FiUsers } from "react-icons/fi";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "Whole vault",
        icon: <FiLayers size={34} className="text-secondary" />,
        description:
            "Studios, licensed pins, LEs, chases — one showcase instead of a pile of apps.",
    },
    {
        title: "Trustworthy catalog",
        icon: <FiShield size={34} className="text-gold" />,
        description:
            "Reviewed entries so names and variants stay sharp for you and everyone you trade with.",
    },
    {
        title: "Collector energy",
        icon: <FiUsers size={34} className="text-primary" />,
        description:
            "Vault, traders, ISOs, grails, DISOs — same slang as Reddit, IG, and the con floor.",
    },
];
