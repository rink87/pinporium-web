import type { ReleaseNotesEntry } from "@/content/release-notes";
import { ReleaseNoteHighlightIcon } from "@/lib/releaseNotes/icons";
import {
  formatReleaseNoteDate,
  renderBoldMarkdown,
} from "@/lib/releaseNotes/renderBold";

type Props = {
  entries: ReleaseNotesEntry[];
};

export function RoadmapShippedTimeline({ entries }: Props) {
  return (
    <ol className="relative list-none m-0 p-0">
      <div
        className="absolute left-[0.65rem] top-3 bottom-3 w-px bg-gradient-to-b from-secondary/50 via-gold-deco/40 to-transparent md:left-[5.75rem]"
        aria-hidden
      />

      {entries.map((entry, index) => {
        const isLatest = index === 0;
        const headline = entry.headline ?? "What's new";

        return (
          <li
            key={entry.version}
            id={`v${entry.version.replace(/\./g, "-")}`}
            className="relative scroll-mt-32 pb-10 last:pb-0"
          >
            <article className="grid gap-4 md:grid-cols-[5.5rem_1fr] md:gap-8">
              <div className="flex md:flex-col md:items-end md:pt-1 md:text-right">
                <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
                  <span
                    className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-cream bg-secondary shadow-[0_0_0_3px_rgba(45,139,117,0.2)] md:mt-0"
                    aria-hidden
                  />
                  <div>
                    <p className="font-display text-lg font-bold text-navy leading-none">
                      v{entry.version}
                    </p>
                    <p className="mt-1 text-xs font-body text-foreground-accent">
                      {formatReleaseNoteDate(entry.date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 rounded-deco border border-gold-deco/25 bg-cream/70 overflow-hidden shadow-card">
                <div className="border-b border-gold-deco/15 bg-white/70 px-5 py-4 md:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-bold text-navy">
                        {headline}
                      </h3>
                      {entry.summary ? (
                        <p className="mt-2 text-[15px] font-body text-foreground-accent leading-relaxed">
                          {entry.summary}
                        </p>
                      ) : null}
                    </div>
                    {isLatest ? (
                      <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] uppercase tracking-deco-wide font-body font-semibold text-secondary-ink">
                        Latest
                      </span>
                    ) : null}
                  </div>
                </div>

                <details className="group">
                  <summary className="cursor-pointer list-none px-5 py-3 md:px-6 font-body text-sm font-semibold text-secondary-ink hover:bg-white/50 transition-colors [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="text-foreground-accent group-open:rotate-90 transition-transform"
                        aria-hidden
                      >
                        ▸
                      </span>
                      {entry.highlights.length} release highlights
                    </span>
                  </summary>
                  <ul className="border-t border-gold-deco/15 px-5 py-4 md:px-6 flex flex-col gap-4 list-none">
                    {entry.highlights.map(item => (
                      <li key={item.title} className="flex gap-3">
                        <ReleaseNoteHighlightIcon icon={item.icon} />
                        <div className="min-w-0">
                          <h4 className="font-display text-base font-bold text-navy mb-1">
                            {item.title}
                          </h4>
                          <p className="text-[15px] font-body text-navy leading-relaxed">
                            {renderBoldMarkdown(item.body)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
