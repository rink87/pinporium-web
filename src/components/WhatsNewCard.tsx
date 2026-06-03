import type { ReleaseNotesEntry } from "@/content/release-notes";
import { ReleaseNoteHighlightIcon } from "@/lib/releaseNotes/icons";
import {
  formatReleaseNoteDate,
  renderBoldMarkdown,
} from "@/lib/releaseNotes/renderBold";

function BrandStripe() {
  return (
    <div className="flex h-1 overflow-hidden" aria-hidden>
      <span className="flex-1 bg-secondary" />
      <span className="flex-1 bg-gold-deco" />
      <span className="flex-1 bg-primary" />
    </div>
  );
}

type Props = {
  entry: ReleaseNotesEntry;
  isLatest?: boolean;
};

const WhatsNewCard: React.FC<Props> = ({ entry, isLatest }) => {
  const headline = entry.headline ?? "What's new";

  return (
    <article
      id={`v${entry.version.replace(/\./g, "-")}`}
      className="w-full max-w-[440px] md:max-w-none mx-auto overflow-hidden rounded-deco border border-gold-deco/30 bg-cream shadow-[0_12px_40px_-8px_rgba(44,51,69,0.18)]"
    >
      <BrandStripe />

      <header className="relative px-6 md:px-10 pt-5 pb-4 text-center bg-hero-background">
        {isLatest ? (
          <span className="absolute top-3 right-4 text-[10px] uppercase tracking-deco-wide font-body font-semibold text-secondary">
            Latest
          </span>
        ) : null}
        <h2 className="font-display text-2xl font-extrabold text-navy tracking-tight">
          {headline}
        </h2>
        <p className="mt-1 text-xs font-body text-foreground-accent">
          Version {entry.version}
          <span className="mx-1.5 text-gold-deco/60" aria-hidden>
            ·
          </span>
          {formatReleaseNoteDate(entry.date)}
        </p>
      </header>

      <div className="px-6 md:px-10 pt-4 pb-5 md:pt-5 md:pb-6">
        {entry.summary ? (
          <p className="mb-4 text-[15px] font-body text-foreground-accent leading-relaxed">
            {entry.summary}
          </p>
        ) : null}

        <ul className="flex flex-col gap-4 list-none">
          {entry.highlights.map((item) => (
            <li key={item.title} className="flex gap-3">
              <ReleaseNoteHighlightIcon icon={item.icon} />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-bold text-navy mb-1">
                  {item.title}
                </h3>
                <p className="text-[15px] font-body text-navy leading-relaxed">
                  {renderBoldMarkdown(item.body)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer className="border-t border-gold-deco/20 px-6 md:px-10 py-4">
        <p className="text-center text-xs font-body text-foreground-accent leading-snug">
          One vault for your whole pin collection.
        </p>
      </footer>
    </article>
  );
};

export default WhatsNewCard;
