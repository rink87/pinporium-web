"use client";

import clsx from "clsx";

import { useBetaApply } from "./BetaApplyProvider";

interface BetaApplyLinkProps {
  className?: string;
  children: React.ReactNode;
}

/** Footer / nav text link that opens the beta apply modal */
const BetaApplyLink: React.FC<BetaApplyLinkProps> = ({ className, children }) => {
  const { openBetaApply } = useBetaApply();

  return (
    <button
      type="button"
      onClick={openBetaApply}
      className={clsx("text-left bg-transparent border-0 p-0 cursor-pointer", className)}
    >
      {children}
    </button>
  );
};

export default BetaApplyLink;
