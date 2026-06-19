import clsx from "clsx";

import type { RoadmapFeature } from "@/content/roadmap";

import { RoadmapUpvoteButton } from "./RoadmapUpvoteButton";

type Props = {
  feature: RoadmapFeature;
  voteCount: number;
  voted: boolean;
  rank?: number;
  variant?: "next" | "future";
};

export function RoadmapFeatureCard({
  feature,
  voteCount,
  voted,
  rank,
  variant = "future",
}: Props) {
  const isNext = variant === "next";

  return (
    <article
      className={clsx(
        "flex h-full flex-col rounded-deco border overflow-hidden",
        isNext
          ? "border-secondary/25 bg-white shadow-card"
          : "border-gold-deco/25 bg-cream/60",
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display text-lg font-bold text-navy">{feature.title}</h3>
          {rank != null && rank > 0 ? (
            <span className="shrink-0 rounded-full bg-gold-deco/15 px-2 py-0.5 text-[10px] font-body font-semibold uppercase tracking-wide text-foreground-accent">
              #{rank}
            </span>
          ) : null}
        </div>
        <p className="text-[15px] font-body text-foreground-accent leading-relaxed flex-1">
          {feature.description}
        </p>
      </div>
      <div
        className={clsx(
          "border-t px-4 py-3 flex items-center justify-between gap-3",
          isNext ? "border-secondary/15 bg-secondary/[0.04]" : "border-gold-deco/20 bg-white/40",
        )}
      >
        <p className="text-xs font-body text-foreground-accent">
          {voted ? "You upvoted this" : "Upvote to prioritize"}
        </p>
        <RoadmapUpvoteButton
          featureId={feature.id}
          initialCount={voteCount}
          initialVoted={voted}
          compact
        />
      </div>
    </article>
  );
}
