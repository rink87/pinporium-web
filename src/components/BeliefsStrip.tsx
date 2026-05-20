const pillars = [
  "Pin studios & small shops",
  "Licensed & pop-culture pins",
  "Limited editions & chases",
  "ISOs, grails & the hunt",
];

const BeliefsStrip: React.FC = () => {
  return (
    <section
      id="beliefs"
      className="relative px-5 py-12 md:py-14 bg-background border-y border-gold-deco/20"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-deco/50 to-transparent"
        aria-hidden
      />
      <p className="text-center text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-6">
        Track it · show it off · trade smarter · grow the hobby
      </p>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 text-navy font-display text-lg md:text-xl">
        {pillars.map((p) => (
          <span key={p} className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rotate-45 bg-gold-deco shrink-0"
              aria-hidden
            />
            {p}
          </span>
        ))}
      </div>
    </section>
  );
};

export default BeliefsStrip;
