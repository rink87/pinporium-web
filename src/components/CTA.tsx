import { ctaDetails } from "@/data/cta";

import BetaApplyButton from "./BetaApplyButton";

const CTA: React.FC = () => {
  return (
    <section id="beta" className="mt-10 mb-5 lg:my-20 scroll-mt-28">
      <div className="relative h-full w-full z-10 mx-auto py-12 sm:py-20 px-4">
        <div className="h-full w-full">
          <div className="rounded-deco opacity-[0.98] absolute inset-0 -z-10 h-full w-full bg-deco-dark overflow-hidden border border-gold-deco/25">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 20%, rgba(240, 185, 97, 0.9) 0%, transparent 45%),
                  radial-gradient(circle at 80% 80%, rgba(45, 139, 117, 0.6) 0%, transparent 40%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 32px,
                  rgba(240, 185, 97, 0.8) 32px,
                  rgba(240, 185, 97, 0.8) 33px
                )`,
              }}
            />
          </div>

          <div className="h-full flex flex-col items-center justify-center text-cream text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-deco-wide text-gold/90 mb-3 font-body">
              {ctaDetails.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl md:leading-tight font-display font-semibold mb-4 text-balance">
              {ctaDetails.heading}
            </h2>

            <p className="mx-auto max-w-lg text-cream/80 font-body leading-relaxed">
              {ctaDetails.subheading}
            </p>

            <p className="mt-4 text-sm text-cream/70 font-body">{ctaDetails.storeNote}</p>

            <div className="mt-8">
              <BetaApplyButton label="Apply to be a beta tester" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
