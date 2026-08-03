"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IMPORT_NAV_ITEMS = [
  { href: "/import", label: "New import", match: (path: string) => path === "/import" },
  {
    href: "/import/history",
    label: "Import history",
    match: (path: string) => path.startsWith("/import/history"),
  },
] as const;

export function ImportToolNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Import"
      className={clsx(
        "flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8",
        className,
      )}
    >
      {IMPORT_NAV_ITEMS.map(item => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "inline-flex items-center rounded-full px-4 py-2 text-sm font-bold uppercase tracking-deco-wide font-body transition-colors",
              active
                ? "bg-navy text-cream shadow-sm"
                : "border border-navy/10 bg-white/80 text-navy hover:bg-cream-warm",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
