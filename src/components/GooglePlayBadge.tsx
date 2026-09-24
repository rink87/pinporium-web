import clsx from "clsx";

import {
  GOOGLE_PLAY_BADGE_HEIGHT,
  GOOGLE_PLAY_BADGE_SRC,
  GOOGLE_PLAY_BADGE_WIDTH,
  GOOGLE_PLAY_URL,
} from "@/data/storeLinks";

interface GooglePlayBadgeProps {
  className?: string;
  /**
   * Display height in CSS pixels (width scales with aspect).
   * Prefer height over width when pairing with App Store — badges must match height.
   */
  height?: number;
}

const GooglePlayBadge: React.FC<GooglePlayBadgeProps> = ({
  className,
  height = 40,
}) => {
  const width = Math.round(
    (height * GOOGLE_PLAY_BADGE_WIDTH) / GOOGLE_PLAY_BADGE_HEIGHT,
  );

  return (
    <a
      href={GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("inline-block shrink-0 leading-none", className)}
      aria-label="Get it on Google Play"
    >
      {/* SVG badge — plain img so we don’t need Next SVG config */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={GOOGLE_PLAY_BADGE_SRC}
        alt="Get it on Google Play"
        width={width}
        height={height}
        className="block object-contain"
        style={{ width, height }}
      />
    </a>
  );
};

export default GooglePlayBadge;
