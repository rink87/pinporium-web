"use client";

import clsx from "clsx";

import { importImagePreviewSrc } from "@/lib/vaultImport/importImagePreview";
import { isLikelyImportImageUrl } from "@/lib/vaultImport/mappingUi";
import type { VaultImportFieldKey } from "@/lib/vaultImport/types";

const DETAIL_FIELDS: VaultImportFieldKey[] = [
  "collaborating_artists",
  "grade",
  "price_paid",
  "personal_value",
  "currency",
  "source",
  "edition",
  "variant",
  "metal_finish",
  "num_posts",
  "notes",
];

function ImportPreviewImage({ url, label }: { url: string; label: string }) {
  return (
    <div className="relative shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- proxied import preview thumbnail */}
      <img
        src={importImagePreviewSrc(url)}
        alt=""
        loading="lazy"
        className="h-28 w-28 rounded-deco border border-navy/10 bg-white object-cover shadow-sm sm:h-32 sm:w-32"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function formatReviewValue(field: VaultImportFieldKey, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (isLikelyImportImageUrl(trimmed)) {
    return "Photo attached";
  }

  if (field === "source" || /^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return trimmed.length > 64 ? `${trimmed.slice(0, 63)}…` : trimmed;
    }
  }

  if (trimmed.length > 120) {
    return `${trimmed.slice(0, 119)}…`;
  }

  return trimmed;
}

type ImportReviewPreviewProps = {
  fieldLabels: Record<VaultImportFieldKey, string>;
  mapped: Record<string, string>;
  sampleIndex: number | null;
  totalRows: number;
};

export function ImportReviewPreview({
  fieldLabels,
  mapped,
  sampleIndex,
  totalRows,
}: ImportReviewPreviewProps) {
  const pinName = mapped.pin_name?.trim() ?? "";
  const artist = mapped.artist?.trim() ?? "";
  const frontUrl = mapped.front_image_url?.trim() ?? "";
  const backUrl = mapped.back_image_url?.trim() ?? "";
  const hasFrontImage = isLikelyImportImageUrl(frontUrl);
  const hasBackImage = isLikelyImportImageUrl(backUrl);

  const details = DETAIL_FIELDS.map(field => {
    const raw = mapped[field]?.trim();
    if (!raw || isLikelyImportImageUrl(raw)) return null;
    const display = formatReviewValue(field, raw);
    if (!display || display === "Photo attached") return null;
    return { field, label: fieldLabels[field], display, href: /^https?:\/\//i.test(raw) ? raw : null };
  }).filter(Boolean) as {
    field: VaultImportFieldKey;
    label: string;
    display: string;
    href: string | null;
  }[];

  return (
    <div className="rounded-deco border border-navy/10 bg-cream-warm/40 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
        {(hasFrontImage || hasBackImage) ? (
          <div className="flex shrink-0 items-start gap-3">
            {hasFrontImage ? <ImportPreviewImage url={frontUrl} label="Front photo preview" /> : null}
            {hasBackImage ? <ImportPreviewImage url={backUrl} label="Back photo preview" /> : null}
          </div>
        ) : (
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-deco border border-dashed border-navy/15 bg-white/80 text-center px-2 sm:h-32 sm:w-32"
            aria-hidden
          >
            <span className="text-xs text-foreground-accent font-body">No photo mapped</span>
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-1">
              Sample pin
              {sampleIndex != null && totalRows > 0
                ? ` · row ${sampleIndex + 1} of ${totalRows.toLocaleString()}`
                : ""}
            </p>
            <h2 className="text-xl font-bold text-navy font-display leading-snug text-balance">
              {pinName || "—"}
            </h2>
            {artist ? (
              <p className="mt-1 text-base text-foreground-accent font-body">{artist}</p>
            ) : null}
          </div>

          {(hasFrontImage || hasBackImage) && (
            <p className="text-xs text-foreground-accent font-body">
              {hasFrontImage && hasBackImage
                ? "Front and back photos will import with this pin."
                : hasFrontImage
                  ? "Front photo will import with each row that has an image URL."
                  : "Back photo will import where provided."}
            </p>
          )}
        </div>
      </div>

      {details.length > 0 ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 border-t border-navy/8 bg-white/60 px-5 py-4 sm:px-6 text-sm font-body">
          {details.map(item => (
            <div key={item.field} className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-deco-wide text-foreground-accent">
                {item.label}
              </dt>
              <dd className="mt-0.5 text-navy truncate">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={clsx("hover:text-secondary-ink hover:underline")}
                  >
                    {item.display}
                  </a>
                ) : (
                  item.display
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
