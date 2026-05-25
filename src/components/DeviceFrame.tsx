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
  const imageProps = {
    src,
    width,
    height,
    quality: 100 as const,
    sizes,
    priority,
    alt,
    className: "block h-auto w-full",
  };

  const mobileFrame = (
    <div className="iphone-frame-mobile">
      <div className="iphone-screen-mobile">
        <Image {...imageProps} />
      </div>
    </div>
  );

  const desktopFrame = (
    <div className="iphone-frame">
      <div className="iphone-screen">
        <Image {...imageProps} />
      </div>
    </div>
  );

  const wrapCrop = (content: ReactNode) => {
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

  const frames = (
    <>
      <div className="lg:hidden">{wrapCrop(mobileFrame)}</div>
      <div className="hidden lg:block">{wrapCrop(desktopFrame)}</div>
    </>
  );

  return <div className={className}>{frames}</div>;
};

export default DeviceFrame;
