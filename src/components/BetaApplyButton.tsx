import clsx from "clsx";
import Link from "next/link";

interface BetaApplyButtonProps {
  dark?: boolean;
  className?: string;
}

const BetaApplyButton: React.FC<BetaApplyButtonProps> = ({ dark, className }) => {
  return (
    <Link href="#beta" className={className}>
      <span
        className={clsx(
          "inline-flex items-center justify-center min-w-[220px] px-8 h-14 rounded-full w-full sm:w-fit text-sm uppercase tracking-deco font-body transition-colors border",
          dark
            ? "text-cream bg-navy hover:bg-deco-dark border-gold-deco/30"
            : "text-cream bg-primary hover:bg-primary-accent border-transparent",
        )}
      >
        Apply to be a beta tester
      </span>
    </Link>
  );
};

export default BetaApplyButton;
