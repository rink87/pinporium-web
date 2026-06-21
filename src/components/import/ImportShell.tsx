"use client";

import type { ReactNode } from "react";

import Container from "@/components/Container";

export type ImportStepKey = "auth" | "pick" | "map" | "preview" | "progress";

const STEPS: { key: ImportStepKey; label: string }[] = [
  { key: "auth", label: "Sign in" },
  { key: "pick", label: "Upload" },
  { key: "map", label: "Map columns" },
  { key: "preview", label: "Review" },
  { key: "progress", label: "Import" },
];

function stepIndex(step: ImportStepKey): number {
  return STEPS.findIndex(s => s.key === step);
}

export function ImportStepNav({ step }: { step: ImportStepKey }) {
  const current = stepIndex(step);

  return (
    <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
      {STEPS.map((item, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={item.key} className="flex items-center gap-2 sm:gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-deco-wide font-body transition-colors ${
                active
                  ? "bg-navy text-cream shadow-sm"
                  : done
                    ? "bg-secondary/15 text-secondary-ink"
                    : "bg-white/60 text-foreground-accent border border-navy/8"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  active ? "bg-cream/20" : done ? "bg-secondary text-white" : "bg-navy/8 text-navy/60"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </span>
            {index < STEPS.length - 1 ? (
              <span className="hidden sm:block h-px w-4 bg-gold-deco/35" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function ImportCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-deco border border-gold-deco/30 bg-white/95 backdrop-blur-sm shadow-frame p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function ImportShell({
  step,
  title,
  subtitle,
  children,
}: {
  step: ImportStepKey;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-24">
      <div className="absolute inset-0 -z-10 deco-sunburst" aria-hidden />
      <div className="absolute inset-0 -z-10 deco-grid opacity-80" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" aria-hidden />

      <Container className="pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
            Vault bulk import
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-bold text-navy text-balance leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground-accent font-body leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <ImportStepNav step={step} />

        <div className="mx-auto max-w-3xl">{children}</div>
      </Container>
    </section>
  );
}
