import type { IconType } from "react-icons";
import { FiStar, FiTool, FiTrendingUp } from "react-icons/fi";

import type { ChangelogKind } from "@/content/release-notes";

export const CHANGELOG_KIND_META: Record<
  ChangelogKind,
  { label: string; definition: string; Icon: IconType }
> = {
  feature: {
    label: "New feature",
    definition: "Something new you can do in the app.",
    Icon: FiStar,
  },
  fix: {
    label: "Bug fix",
    definition: "Fixes something that wasn't working right.",
    Icon: FiTool,
  },
  improvement: {
    label: "Improvement",
    definition: "Makes something you already use clearer, faster, or more flexible.",
    Icon: FiTrendingUp,
  },
};

type IconProps = {
  kind: ChangelogKind;
  className?: string;
};

export function ChangelogKindIcon({ kind, className }: IconProps) {
  const { Icon, label } = CHANGELOG_KIND_META[kind];
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-deco/25 bg-white/90 ${className ?? ""}`}
      title={label}
      aria-label={label}
    >
      <Icon className="text-secondary-ink" size={15} strokeWidth={2.25} />
    </span>
  );
}
