import clsx from "clsx";

type NavItem = {
  href: string;
  label: string;
  emphasis?: boolean;
};

type Props = {
  items: NavItem[];
};

export function RoadmapJumpNav({ items }: Props) {
  return (
    <nav
      aria-label="Roadmap sections"
      className="sticky top-[4.5rem] z-20 -mx-4 px-4 py-3 md:top-20 md:-mx-0 md:px-0"
    >
      <div className="mx-auto flex max-w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-gold-deco/30 bg-cream/95 px-2 py-2 shadow-[0_8px_24px_-12px_rgba(44,51,69,0.2)] backdrop-blur-sm">
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-body font-semibold transition-colors",
              item.emphasis
                ? "bg-secondary text-white"
                : "text-navy hover:bg-white/80",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
