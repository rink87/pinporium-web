"use client";

import { useEffect, useRef, useState } from "react";

interface DeviceVideoFrameProps {
  src: string;
  poster?: string;
  className?: string;
}

const DeviceVideoFrame: React.FC<DeviceVideoFrameProps> = ({
  src,
  poster,
  className = "",
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          for (const video of [mobileVideoRef.current, desktopVideoRef.current]) {
            if (video) void video.play().catch(() => {});
          }
        } else {
          for (const video of [mobileVideoRef.current, desktopVideoRef.current]) {
            video?.pause();
          }
        }
      },
      { rootMargin: "120px", threshold: 0.12 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const videoSrc = shouldLoad ? src : undefined;

  const videoProps = {
    src: videoSrc,
    poster,
    loop: true,
    muted: true,
    playsInline: true,
    preload: shouldLoad ? ("metadata" as const) : ("none" as const),
    className: "block h-auto w-full",
    "aria-label": "Pinporium 3D pin viewer demo",
  };

  return (
    <div ref={rootRef} className={className}>
      <div className="lg:hidden w-full overflow-hidden rounded-2xl shadow-[0_18px_44px_-22px_rgba(26,26,46,0.45)] ring-1 ring-navy/8 bg-navy">
        <video ref={mobileVideoRef} {...videoProps} />
      </div>
      <div className="hidden lg:block w-[320px] max-w-full iphone-frame">
        <div className="iphone-screen">
          <video ref={desktopVideoRef} {...videoProps} />
        </div>
      </div>
    </div>
  );
};

export default DeviceVideoFrame;
