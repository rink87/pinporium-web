import React from "react";
import clsx from "clsx";

import BetaApplyButton from "./BetaApplyButton";
import DeviceFrame from "./DeviceFrame";
import { DEVICE_MOCKUP_IMAGE_SIZES, DEVICE_MOCKUP_WIDTH_CLASS } from "@/lib/deviceFrame";

import { heroDetails } from "@/data/hero";

const Hero: React.FC = () => {
  const w = heroDetails.centerImageWidth ?? 472;
  const h = heroDetails.centerImageHeight ?? 1024;

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center pb-0 pt-28 md:pt-36 px-5 deco-sunburst"
    >
      <div className="absolute left-0 top-0 bottom-0 -z-10 w-full overflow-hidden">
        <div className="absolute inset-0 h-full w-full deco-grid opacity-90" />
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />

      <div className="text-center relative z-10 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-deco-wide text-foreground-accent mb-4 font-body">
          Vault · discover · flex · trade
        </p>
        <h1 className="text-4xl md:text-5xl md:leading-tight font-display text-navy max-w-lg md:max-w-3xl mx-auto text-balance">
          {heroDetails.heading}
        </h1>
        <p className="mt-5 text-foreground-accent max-w-xl mx-auto font-body leading-relaxed">
          {heroDetails.subheading}
        </p>
        <div className="mt-8 flex justify-center w-fit mx-auto">
          <BetaApplyButton dark />
        </div>
        <p className="mt-4 text-sm text-foreground-accent font-body">
          App Store &amp; Google Play — coming soon
        </p>

        <div className={clsx("mt-14 md:mt-20 mx-auto", DEVICE_MOCKUP_WIDTH_CLASS)}>
          <DeviceFrame
            src={heroDetails.centerImageSrc}
            width={w}
            height={h}
            sizes={DEVICE_MOCKUP_IMAGE_SIZES}
            priority={true}
            cropTopPercent={60}
            alt="Pinporium: My Collection home screen with pins, value, and collection stats"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
