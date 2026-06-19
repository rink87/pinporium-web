"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

import DeviceFrame from "../DeviceFrame";
import { DEVICE_MOCKUP_IMAGE_SIZES, DEVICE_MOCKUP_WIDTH_CLASS } from "@/lib/deviceFrame";

const ROTATE_MS = 5000;

type Props = {
  images: string[];
  alt: string;
  className?: string;
};

export function BenefitImageCarousel({ images, alt, className }: Props) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || images.length <= 1) return;
    const id = window.setInterval(
      () => setIndex(current => (current + 1) % images.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [images.length, reduceMotion]);

  const frameProps = {
    alt,
    width: 472,
    height: 1024,
    sizes: DEVICE_MOCKUP_IMAGE_SIZES,
    className: clsx("lg:ml-0", DEVICE_MOCKUP_WIDTH_CLASS),
  };

  if (images.length <= 1) {
    return (
      <DeviceFrame src={images[0] ?? ""} {...frameProps} className={clsx(frameProps.className, className)} />
    );
  }

  return (
    <div className={clsx("relative", className)}>
      {images.map((src, i) => (
        <div
          key={src}
          className={clsx(
            "transition-opacity duration-700 ease-in-out",
            i === index
              ? "relative z-10 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <DeviceFrame
            src={src}
            alt={i === index ? alt : ""}
            width={frameProps.width}
            height={frameProps.height}
            sizes={frameProps.sizes}
            className={frameProps.className}
            priority={i === 0}
          />
        </div>
      ))}
      <p className="sr-only" aria-live="polite">
        Screenshot {index + 1} of {images.length}
      </p>
    </div>
  );
}
