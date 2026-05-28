"use client";

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
  return (
    <div className={className}>
      <div className="lg:hidden overflow-hidden rounded-2xl shadow-[0_18px_44px_-22px_rgba(26,26,46,0.45)] ring-1 ring-navy/8 bg-navy">
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="block h-auto w-full"
          aria-label="Pinporium 3D pin viewer demo"
        />
      </div>
      <div className="hidden lg:block iphone-frame">
        <div className="iphone-screen">
          <video
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="block h-auto w-full"
            aria-label="Pinporium 3D pin viewer demo"
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceVideoFrame;
