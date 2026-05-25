import type { ReactNode } from "react";
import Image from "next/image";

interface DeviceFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  cropTopPercent?: number;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({
  src,
  alt,
  width,
  height,
  priority,
  sizes,
  className = "",
  cropTopPercent,
}) => {
  const screenshot = (
    <Image
      src={src}
      width={width}
      height={height}
      quality={100}
      sizes={sizes}
      priority={priority}
      alt={alt}
      className="block h-auto w-full"
    />
  );

  const withCrop = (content: ReactNode) => {
    if (!cropTopPercent) {
      return content;
    }

    const clampedCrop = Math.min(Math.max(cropTopPercent, 10), 100);

    return (
      <div
        className="overflow-hidden"
        style={{ aspectRatio: `${width} / ${(height * clampedCrop) / 100}` }}
      >
        {content}
      </div>
    );
  };

  const framedDevice = (
    <div className="iphone-frame">
      <div className="iphone-screen">{screenshot}</div>
    </div>
  );

  const bareDevice = (
    <div className="device-shot-mobile overflow-hidden rounded-2xl shadow-[0_18px_44px_-22px_rgba(26,26,46,0.45)] ring-1 ring-navy/8">
      {screenshot}
    </div>
  );

  return (
    <div className={className}>
      {/* Phone + tablet: screenshot only (avoids thick CSS bezel on narrow viewports) */}
      <div className="lg:hidden">{withCrop(bareDevice)}</div>
      <div className="hidden lg:block">{withCrop(framedDevice)}</div>
    </div>
  );
};

export default DeviceFrame;
