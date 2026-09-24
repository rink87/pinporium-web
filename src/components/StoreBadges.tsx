import clsx from "clsx";

import AppStoreBadge from "./AppStoreBadge";
import GooglePlayBadge from "./GooglePlayBadge";

interface StoreBadgesProps {
  className?: string;
  /**
   * Shared display height for both badges (Google requires equal height when paired).
   * Default 48.
   */
  height?: number;
}

/** App Store + Google Play badges in a responsive row — same height. */
const StoreBadges: React.FC<StoreBadgesProps> = ({
  className,
  height = 48,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:items-center sm:gap-5",
        className,
      )}
    >
      <AppStoreBadge height={height} />
      <GooglePlayBadge height={height} />
    </div>
  );
};

export default StoreBadges;
