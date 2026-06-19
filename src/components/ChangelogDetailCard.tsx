import type { ReleaseNotesEntry } from "@/content/release-notes";
import WhatsNewCard from "@/components/WhatsNewCard";
import { ChangelogKindIcon } from "@/lib/releaseNotes/changelogKinds";
import { renderBoldMarkdown } from "@/lib/releaseNotes/renderBold";

type Props = {
  entry: ReleaseNotesEntry;
  isLatest?: boolean;
};

const ChangelogDetailCard: React.FC<Props> = ({ entry, isLatest }) => {
  const items = entry.changelog ?? [];

  return (
    <div className="w-full max-w-[640px] mx-auto flex flex-col gap-6">
      <WhatsNewCard entry={entry} isLatest={isLatest} />

      {items.length > 0 ? (
        <div className="rounded-deco border border-gold-deco/25 bg-cream/80 px-6 py-5 shadow-[0_8px_28px_-12px_rgba(44,51,69,0.12)]">
          <h3 className="font-display text-lg font-bold text-navy mb-4">Full changelog</h3>
          <ul className="flex flex-col gap-3 list-none m-0 p-0">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-3">
                <ChangelogKindIcon kind={item.kind} className="mt-0.5" />
                <p className="min-w-0 text-[15px] font-body text-navy leading-relaxed pt-1">
                  {renderBoldMarkdown(item.text)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ChangelogDetailCard;
