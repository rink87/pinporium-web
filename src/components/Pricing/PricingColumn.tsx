import clsx from "clsx";
import Link from "next/link";
import { BsFillCheckCircleFill } from "react-icons/bs";

import { IPricing } from "@/types";

interface Props {
  tier: IPricing;
  highlight?: boolean;
}

const PricingColumn: React.FC<Props> = ({ tier, highlight }: Props) => {
  const { name, price, features, summary, exploreHref, exploreLabel } = tier;
  const isNumericPrice = typeof price === "number";

  return (
    <div
      className={clsx(
        "w-full max-w-sm mx-auto bg-cream rounded-deco border border-gold-deco/25 lg:max-w-full overflow-hidden shadow-card",
        { "shadow-frame ring-1 ring-gold-deco/35": highlight },
      )}
    >
      <div className="p-6 border-b border-gold-deco/20 rounded-t-deco bg-white/60">
        <h3 className="text-xl font-display font-semibold text-navy mb-3">
          {name}
        </h3>
        <p className="text-3xl md:text-4xl font-display font-semibold text-navy">
          <span className={clsx({ "text-secondary-ink": highlight })}>
            {isNumericPrice ? `$${price}` : price}
          </span>
          {isNumericPrice && (
            <span className="text-lg font-normal text-foreground-accent font-body">
              /mo
            </span>
          )}
        </p>
      </div>
      <div className="p-6 mt-1 bg-cream/80">
        {summary ? (
          <p className="text-foreground-accent mb-5 text-sm font-body leading-relaxed">
            {summary}
          </p>
        ) : null}
        <ul className="space-y-4 mb-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <BsFillCheckCircleFill className="h-5 w-5 text-secondary-ink shrink-0 mt-0.5" />
              <span className="text-foreground-accent font-body leading-snug">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        {exploreHref ? (
          <p className="mt-6 pt-4 border-t border-gold-deco/20">
            <Link
              href={exploreHref}
              className="text-sm font-body font-semibold text-secondary-ink hover:underline"
            >
              {exploreLabel ?? "Explore on roadmap"} →
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PricingColumn;
