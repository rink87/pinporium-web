import clsx from "clsx";

import {
  GOOGLE_PLAY_BADGE_HEIGHT,
  GOOGLE_PLAY_BADGE_SRC,
  GOOGLE_PLAY_BADGE_WIDTH,
  GOOGLE_PLAY_URL,
} from "@/data/storeLinks";

interface GooglePlayBadgeProps {
  className?: string;
  /** Display width in CSS pixels (height scales with aspect). Default 160. */
  width?: number;
}

const GooglePlayBadge: React.FC<GooglePlayBadgeProps> = ({
  className,
  width = 160,
}) => {
  const height = Math.round(
    (width * GOOGLE_PLAY_BADGE_HEIGHT) / GOOGLE_PLAY_BADGE_WIDTH,
  );

  return (
    <a
      href={GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("inline-block shrink-0", className)}
      aria-label="Get it on Google Play"
    >
      {/* SVG badge — plain img so we don’t need Next SVG config */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={GOOGLE_PLAY_BADGE_SRC}
        alt="Get it on Google Play"
        width={width}
        height={height}
        className="block h-auto w-full object-contain"
        style={{ width, height }}
      />
    </a>
  );
};

export default GooglePlayBadge;
