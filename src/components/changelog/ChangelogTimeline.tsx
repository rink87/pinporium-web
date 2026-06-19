import type { ReleaseNotesEntry } from "@/content/release-notes";
import { ChangelogKindIcon, CHANGELOG_KIND_META } from "@/lib/releaseNotes/changelogKinds";
import type { ChangelogKind } from "@/content/release-notes";
import { formatReleaseNoteDate, renderBoldMarkdown } from "@/lib/releaseNotes/renderBold";

type Props = {
  entries: ReleaseNotesEntry[];
};

export function ChangelogTimeline({ entries }: Props) {
  return (
    <div>
      <ul
        className="mb-10 grid gap-3 sm:grid-cols-3 list-none m-0 p-0 max-w-3xl mx-auto"
        aria-label="Change categories"
      >
        {(Object.keys(CHANGELOG_KIND_META) as ChangelogKind[]).map(kind => {
          const { label, definition, Icon } = CHANGELOG_KIND_META[kind];
          return (
            <li
              key={kind}
              className="rounded-deco border border-gold-deco/25 bg-cream/70 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold-deco/20 bg-white/90 shrink-0">
                  <Icon className="text-secondary-ink" size={13} strokeWidth={2.25} aria-hidden />
                </span>
                <span className="font-body text-sm font-semibold text-navy">{label}</span>
              </div>
              <p className="mt-2 text-sm font-body text-foreground/80 leading-relaxed">
                {definition}
              </p>
            </li>
          );
        })}
      </ul>

      <ol className="relative list-none m-0 p-0">
        <div
          className="absolute left-[0.65rem] top-4 bottom-4 w-px bg-gradient-to-b from-secondary/50 via-gold-deco/40 to-transparent md:left-[5.75rem]"
          aria-hidden
        />

        {entries.map((entry, index) => {
          const items = entry.changelog ?? [];
          const isLatest = index === 0;

          return (
            <li
              key={entry.version}
              id={`v${entry.version.replace(/\./g, "-")}`}
              className="relative scroll-mt-32 pb-12 last:pb-0"
            >
              <div className="grid gap-6 md:grid-cols-[5.5rem_1fr] md:gap-8">
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
                      <p className="mt-1 text-sm font-body text-foreground/80">
                        {formatReleaseNoteDate(entry.date)}
                      </p>
                      {isLatest ? (
                        <span className="mt-2 hidden md:inline-block rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] uppercase tracking-deco-wide font-body font-semibold text-secondary-ink">
                          Latest
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  {entry.summary ? (
                    <p className="mb-4 text-[15px] font-body text-foreground/90 leading-relaxed border-b border-gold-deco/20 pb-4">
                      {entry.summary}
                    </p>
                  ) : null}

                  {isLatest ? (
                    <span className="mb-4 inline-block md:hidden rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] uppercase tracking-deco-wide font-body font-semibold text-secondary-ink">
                      Latest
                    </span>
                  ) : null}

                  {items.length === 0 ? (
                    <p className="text-sm font-body text-foreground/80 italic">
                      Highlights only for this release — open the app for the full What&apos;s new summary.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-3 list-none m-0 p-0">
                      {items.map((item, itemIndex) => (
                        <li
                          key={`${entry.version}-${itemIndex}`}
                          className="flex gap-3 rounded-deco border border-gold-deco/20 bg-cream/60 px-4 py-3 shadow-[0_4px_16px_-10px_rgba(44,51,69,0.15)]"
                        >
                          <ChangelogKindIcon kind={item.kind} className="mt-0.5" />
                          <p className="min-w-0 text-[15px] font-body text-foreground leading-relaxed pt-1">
                            {renderBoldMarkdown(item.text)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
