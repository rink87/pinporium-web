import clsx from "clsx";

import {
  APP_STORE_BADGE_HEIGHT,
  APP_STORE_BADGE_SRC,
  APP_STORE_BADGE_WIDTH,
  APP_STORE_URL,
} from "@/data/storeLinks";

interface AppStoreBadgeProps {
  className?: string;
  /**
   * Display height in CSS pixels (width scales with aspect).
   * Prefer height over width when pairing with Google Play — badges must match height.
   */
  height?: number;
}

const AppStoreBadge: React.FC<AppStoreBadgeProps> = ({
  className,
  height = 40,
}) => {
  const width = Math.round(
    (height * APP_STORE_BADGE_WIDTH) / APP_STORE_BADGE_HEIGHT,
  );

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("inline-block shrink-0 leading-none", className)}
      aria-label="Download on the App Store"
    >
      {/* SVG badge — plain img so we don’t need Next SVG config */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={APP_STORE_BADGE_SRC}
        alt="Download on the App Store"
        width={width}
        height={height}
        className="block object-contain"
        style={{ width, height }}
      />
    </a>
  );
};

export default AppStoreBadge;
