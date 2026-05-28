"use client";

import clsx from "clsx";

import { useBetaApply } from "./BetaApplyProvider";

interface BetaApplyButtonProps {
  dark?: boolean;
  className?: string;
  label?: string;
  /** Smaller padding for nav bar */
  compact?: boolean;
}

const BetaApplyButton: React.FC<BetaApplyButtonProps> = ({
  dark,
  className,
  label = "Apply to be a beta tester",
  compact,
}) => {
  const { openBetaApply } = useBetaApply();

  return (
    <button
      type="button"
      onClick={openBetaApply}
      className={className}
    >
      <span
        className={clsx(
          "inline-flex items-center justify-center rounded-full w-full sm:w-fit text-sm uppercase tracking-deco font-body transition-colors border cursor-pointer",
          compact ? "min-w-0 px-7 py-2.5 h-auto" : "min-w-[220px] px-8 h-14",
          dark
            ? "text-cream bg-navy hover:bg-deco-dark border-gold-deco/30"
            : "text-cream bg-primary hover:bg-primary-accent border-transparent",
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default BetaApplyButton;
