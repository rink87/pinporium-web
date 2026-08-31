import clsx from "clsx";

import {
  APP_STORE_BADGE_HEIGHT,
  APP_STORE_BADGE_SRC,
  APP_STORE_BADGE_WIDTH,
  APP_STORE_URL,
} from "@/data/storeLinks";

interface AppStoreBadgeProps {
  className?: string;
  /** Display width in CSS pixels (height scales with aspect). Default 160. */
  width?: number;
}

const AppStoreBadge: React.FC<AppStoreBadgeProps> = ({
  className,
  width = 160,
}) => {
  const height = Math.round(
    (width * APP_STORE_BADGE_HEIGHT) / APP_STORE_BADGE_WIDTH,
  );

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("inline-block shrink-0", className)}
      aria-label="Download on the App Store"
    >
      {/* SVG badge — plain img so we don’t need Next SVG config */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={APP_STORE_BADGE_SRC}
        alt="Download on the App Store"
        width={width}
        height={height}
        className="block h-auto w-full object-contain"
        style={{ width, height }}
      />
    </a>
  );
};

export default AppStoreBadge;
