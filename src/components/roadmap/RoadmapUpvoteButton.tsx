"use client";

import clsx from "clsx";
import { useState } from "react";
import { HiOutlineArrowUp } from "react-icons/hi2";

type Props = {
  featureId: string;
  initialCount: number;
  initialVoted: boolean;
  compact?: boolean;
};

export function RoadmapUpvoteButton({
  featureId,
  initialCount,
  initialVoted,
  compact = false,
}: Props) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleVote() {
    if (pending) return;
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/roadmap/votes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId }),
      });
      const payload = (await res.json()) as {
        error?: string;
        voted?: boolean;
        count?: number;
      };

      if (!res.ok) {
        setError(payload.error ?? "Could not save your vote.");
        return;
      }

      if (typeof payload.voted === "boolean") setVoted(payload.voted);
      if (typeof payload.count === "number") setCount(payload.count);
    } catch {
      setError("Could not save your vote.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={clsx("flex flex-col gap-1", compact ? "items-end" : "items-end shrink-0")}>
      <button
        type="button"
        onClick={() => void toggleVote()}
        disabled={pending}
        aria-pressed={voted}
        aria-label={voted ? "Remove upvote" : "Upvote this feature"}
        className={clsx(
          compact
            ? "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-body font-semibold transition-colors"
            : "inline-flex flex-col items-center justify-center min-w-[3.25rem] rounded-deco border px-2.5 py-2 transition-colors",
          voted
            ? "border-secondary bg-secondary/10 text-secondary-ink"
            : "border-gold-deco/35 bg-white/70 text-foreground-accent hover:border-secondary/40 hover:text-secondary-ink",
          pending && "opacity-60 cursor-wait",
        )}
      >
        <HiOutlineArrowUp className={clsx(compact ? "h-4 w-4" : "h-5 w-5", voted && "text-secondary-ink")} />
        <span className={clsx("tabular-nums", compact ? "" : "text-sm font-semibold font-body")}>
          {count}
        </span>
      </button>
      {error ? (
        <span className="text-[11px] text-primary font-body max-w-[7rem] text-right leading-tight">
          {error}
        </span>
      ) : null}
    </div>
  );
}
