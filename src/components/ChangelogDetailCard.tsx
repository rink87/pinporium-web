import type { ReleaseNotesEntry } from "@/content/release-notes";
import WhatsNewCard from "@/components/WhatsNewCard";
import { renderBoldMarkdown } from "@/lib/releaseNotes/renderBold";

type Props = {
  entry: ReleaseNotesEntry;
  isLatest?: boolean;
};

const ChangelogDetailCard: React.FC<Props> = ({ entry, isLatest }) => {
  const sections = entry.changelog ?? [];

  return (
    <div className="w-full max-w-[640px] mx-auto flex flex-col gap-6">
      <WhatsNewCard entry={entry} isLatest={isLatest} />

      {sections.length > 0 ? (
        <div className="rounded-deco border border-gold-deco/25 bg-cream/80 px-6 py-5 shadow-[0_8px_28px_-12px_rgba(44,51,69,0.12)]">
          <h3 className="font-display text-lg font-bold text-navy mb-4">
            Full changelog
          </h3>
          <div className="flex flex-col gap-5">
            {sections.map((section) => (
              <section key={section.title}>
                <h4 className="font-display text-base font-bold text-navy mb-2">
                  {section.title}
                </h4>
                <ul className="list-disc pl-5 flex flex-col gap-1.5">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={`${section.title}-${itemIndex}`}
                      className="text-[15px] font-body text-navy leading-relaxed"
                    >
                      {renderBoldMarkdown(item)}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChangelogDetailCard;
