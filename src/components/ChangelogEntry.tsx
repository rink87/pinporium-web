import type { ReleaseNotesEntry } from "@/content/release-notes";
import {
  formatReleaseNoteDate,
  renderBoldMarkdown,
} from "@/lib/releaseNotes/renderBold";

type Props = {
  entry: ReleaseNotesEntry;
  isLatest?: boolean;
};

const ChangelogEntry: React.FC<Props> = ({ entry, isLatest }) => {
  const headline = entry.headline ?? "What's new";

  return (
    <article
      className="border-t border-gold-deco/20 pt-10 first:border-t-0 first:pt-0"
      id={`v${entry.version.replace(/\./g, "-")}`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-2xl md:text-3xl text-navy">
          {headline}
        </h2>
        {isLatest ? (
          <span className="text-xs uppercase tracking-deco-wide font-body text-secondary font-semibold">
            Latest
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-foreground-accent font-body">
        Version {entry.version} · {formatReleaseNoteDate(entry.date)}
      </p>
      {entry.summary ? (
        <p className="mt-4 text-foreground-accent font-body leading-relaxed text-lg">
          {entry.summary}
        </p>
      ) : null}
      <ul className="mt-6 space-y-5 list-none">
        {entry.highlights.map((item) => (
          <li key={item.title}>
            <h3 className="font-display text-lg text-navy">{item.title}</h3>
            <p className="mt-1.5 text-foreground-accent font-body leading-relaxed">
              {renderBoldMarkdown(item.body)}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ChangelogEntry;
