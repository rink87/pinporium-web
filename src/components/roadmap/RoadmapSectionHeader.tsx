type Props = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function RoadmapSectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  const centered = align === "center";

  return (
    <header
      id={id}
      className={`scroll-mt-32 mb-8 md:mb-10 ${centered ? "text-center max-w-2xl mx-auto" : ""}`}
    >
      <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-2">
        {eyebrow}
      </p>
      <h2 className="font-display text-2xl md:text-3xl text-navy tracking-tight">
        {title}
      </h2>
      <p className="mt-3 text-foreground-accent font-body leading-relaxed">
        {description}
      </p>
    </header>
  );
}
