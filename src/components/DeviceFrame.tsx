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
  const frame = (
    <div className="iphone-frame">
      <div className="iphone-screen">
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
      </div>
    </div>
  );

  if (cropTopPercent) {
    const clampedCrop = Math.min(Math.max(cropTopPercent, 10), 100);

    return (
      <div
        className={`overflow-hidden ${className}`}
        style={{ aspectRatio: `${width} / ${(height * clampedCrop) / 100}` }}
      >
        {frame}
      </div>
    );
  }

  return (
    <div className={className}>{frame}</div>
  );
};

export default DeviceFrame;
