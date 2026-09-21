import type { IconType } from "react-icons";
import {
  FiAward,
  FiHome,
  FiLayers,
  FiMapPin,
  FiMoon,
  FiPackage,
  FiRepeat,
  FiSearch,
  FiShield,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { LuPaintbrush } from "react-icons/lu";

import type { ReleaseNoteIcon } from "@/content/release-notes";

const RELEASE_NOTE_ICONS: Record<ReleaseNoteIcon, IconType> = {
  layers: FiLayers,
  truck: FiPackage,
  "arrow-left-right": FiRepeat,
  shield: FiShield,
  sparkles: FiStar,
  "map-pin": FiMapPin,
  medal: FiAward,
  "circle-user": FiUser,
  house: FiHome,
  paintbrush: LuPaintbrush,
  moon: FiMoon,
  "scan-search": FiSearch,
};

type Props = {
  icon?: ReleaseNoteIcon;
  className?: string;
};

export function ReleaseNoteHighlightIcon({ icon, className }: Props) {
  const Icon = icon ? RELEASE_NOTE_ICONS[icon] : FiStar;
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-deco/30 bg-secondary/10 ${className ?? ""}`}
      aria-hidden
    >
      <Icon className="text-secondary-ink" size={18} strokeWidth={2.25} />
    </span>
  );
}
