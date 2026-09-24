import clsx from "clsx";

import AppStoreBadge from "./AppStoreBadge";
import GooglePlayBadge from "./GooglePlayBadge";

interface StoreBadgesProps {
  className?: string;
  /** Display width for each badge in CSS pixels. Default 168. */
  width?: number;
}

/** App Store + Google Play badges in a responsive row. */
const StoreBadges: React.FC<StoreBadgesProps> = ({
  className,
  width = 168,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5",
        className,
      )}
    >
      <AppStoreBadge width={width} />
      <GooglePlayBadge width={width} />
    </div>
  );
};

export default StoreBadges;
