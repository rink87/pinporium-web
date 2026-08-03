"use client";

import clsx from "clsx";
import { HiXMark } from "react-icons/hi2";

import { isIgnoredImportSampleValue } from "@/lib/vaultImport/columnSamples";
import { applyColumnMapping } from "@/lib/vaultImport/columnMapping";
import { importImagePreviewSrc } from "@/lib/vaultImport/importImagePreview";
import { isLikelyImportImageUrl } from "@/lib/vaultImport/mappingUi";
import type { DuplicateRowPolicy, InFileDuplicateGroup } from "@/lib/vaultImport/validateRows";
import type { VaultImportColumnMapping, VaultImportFieldKey, VaultImportRawRow } from "@/lib/vaultImport/types";

type ImportDuplicatesModalProps = {
  open: boolean;
  groups: InFileDuplicateGroup[];
  rawRows: VaultImportRawRow[];
  mapping: VaultImportColumnMapping;
  fieldLabels: Record<VaultImportFieldKey, string>;
  policyByRowIndex: Record<number, DuplicateRowPolicy>;
  onPolicyChange: (rowIndex: number, policy: DuplicateRowPolicy) => void;
  onClose: () => void;
};

const COMPARE_FIELDS: VaultImportFieldKey[] = [
  "grade",
  "variant",
  "edition",
  "metal_finish",
  "enamel_type",
  "price_paid",
  "personal_value",
  "currency",
  "source",
  "notes",
];

const POLICY_OPTIONS: { value: DuplicateRowPolicy; label: string; hint: string }[] = [
  { value: "skip", label: "Skip", hint: "Do not import this row" },
  { value: "unique", label: "Different pin", hint: "Import as its own vault pin" },
  { value: "cluster", label: "Extra copy", hint: "Same pin — another physical copy in your vault" },
];

function formatFieldValue(field: VaultImportFieldKey, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "—";

  if (isLikelyImportImageUrl(trimmed)) return "Photo URL mapped";

  if (field === "source" || /^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).hostname.replace(/^www\./, "");
    } catch {
      return trimmed.length > 72 ? `${trimmed.slice(0, 71)}…` : trimmed;
    }
  }

  return trimmed.length > 120 ? `${trimmed.slice(0, 119)}…` : trimmed;
}

function mappedRowAt(
  rawRows: VaultImportRawRow[],
  mapping: VaultImportColumnMapping,
  rowIndex: number,
): Record<string, string> {
  return applyColumnMapping(rawRows[rowIndex] ?? {}, mapping);
}

function DuplicateRowCard({
  rowIndex,
  mapped,
  fieldLabels,
  baseline,
  isPrimary,
  policy,
  onPolicyChange,
}: {
  rowIndex: number;
  mapped: Record<string, string>;
  fieldLabels: Record<VaultImportFieldKey, string>;
  baseline: Record<string, string> | null;
  isPrimary: boolean;
  policy?: DuplicateRowPolicy;
  onPolicyChange?: (policy: DuplicateRowPolicy) => void;
}) {
  const pinName = mapped.pin_name?.trim() || "—";
  const artist = mapped.artist?.trim() || "—";
  const displayPinName = isIgnoredImportSampleValue(pinName) ? "—" : pinName;
  const displayArtist = isIgnoredImportSampleValue(artist) ? "—" : artist;
  const frontUrl = mapped.front_image_url?.trim() ?? "";
  const backUrl = mapped.back_image_url?.trim() ?? "";
  const hasFront = isLikelyImportImageUrl(frontUrl);
  const hasBack = isLikelyImportImageUrl(backUrl);

  const details = COMPARE_FIELDS.map(field => {
    const raw = mapped[field]?.trim() ?? "";
    if (isIgnoredImportSampleValue(raw)) return null;
    const display = formatFieldValue(field, raw);
    const baselineRaw = baseline?.[field]?.trim() ?? "";
    const differs =
      baseline != null && raw !== baselineRaw && (raw.length > 0 || baselineRaw.length > 0);
    return { field, label: fieldLabels[field], display, differs };
  }).filter(Boolean) as {
    field: VaultImportFieldKey;
    label: string;
    display: string;
    differs: boolean;
  }[];

  return (
    <div
      className={clsx(
        "rounded-xl border p-4",
        isPrimary ? "border-secondary/30 bg-secondary/5" : "border-navy/12 bg-white",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-deco-wide text-foreground-accent font-body">
            Row {rowIndex + 1}
            {isPrimary ? (
              <span className="ml-2 rounded-full bg-secondary/20 px-2 py-0.5 text-secondary-ink normal-case tracking-normal">
                Imports first
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-sm font-bold text-navy font-body">{displayPinName}</p>
          <p className="text-xs text-foreground-accent font-body">{displayArtist}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex shrink-0 gap-2">
          {hasFront ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={importImagePreviewSrc(frontUrl)}
                alt=""
                loading="lazy"
                className="h-20 w-20 rounded-lg border border-navy/10 bg-white object-cover"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-white">
                Front
              </span>
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-navy/15 bg-navy/[0.03] px-1 text-center">
              <span className="text-[10px] text-foreground-accent font-body">No front photo</span>
            </div>
          )}
          {hasBack ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={importImagePreviewSrc(backUrl)}
                alt=""
                loading="lazy"
                className="h-20 w-20 rounded-lg border border-navy/10 bg-white object-cover"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-white">
                Back
              </span>
            </div>
          ) : null}
        </div>

        {details.length > 0 ? (
          <dl className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm font-body">
            {details.map(item => (
              <div key={item.field} className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-deco-wide text-foreground-accent">
                  {item.label}
                  {item.differs ? (
                    <span className="ml-1.5 normal-case tracking-normal text-amber-800">· differs</span>
                  ) : null}
                </dt>
                <dd
                  className={clsx(
                    "mt-0.5 text-navy break-words",
                    item.differs && "font-semibold text-amber-950",
                  )}
                >
                  {item.display}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-xs text-foreground-accent font-body self-center">
            No other mapped fields — compare photos and row numbers above.
          </p>
        )}
      </div>

      {!isPrimary && onPolicyChange ? (
        <div className="mt-4 pt-4 border-t border-navy/8">
          <p className="text-xs font-bold text-navy font-body mb-2">How should this row import?</p>
          <div className="flex flex-col gap-2">
            {POLICY_OPTIONS.map(option => {
              const selected = (policy ?? "skip") === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPolicyChange(option.value)}
                  className={clsx(
                    "rounded-lg border px-3 py-2.5 text-left transition-colors",
                    selected
                      ? "border-secondary bg-secondary/10"
                      : "border-navy/10 bg-white hover:border-navy/20",
                  )}
                >
                  <span
                    className={clsx(
                      "text-sm font-bold font-body",
                      selected ? "text-secondary-ink" : "text-navy",
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-foreground-accent font-body">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ImportDuplicatesModal({
  open,
  groups,
  rawRows,
  mapping,
  fieldLabels,
  policyByRowIndex,
  onPolicyChange,
  onClose,
}: ImportDuplicatesModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-navy/80"
        aria-hidden
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-duplicates-title"
        className="relative z-10 flex w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-navy/15 bg-white shadow-2xl"
      >
        <div className="shrink-0 border-b border-navy/10 bg-white px-5 pt-5 pb-4 pr-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-navy/60 hover:bg-navy/5 hover:text-navy"
            aria-label="Close"
          >
            <HiXMark className="h-5 w-5" />
          </button>
          <h2 id="import-duplicates-title" className="text-lg font-display font-bold text-navy">
            In-file duplicates
          </h2>
          <p className="mt-1.5 text-sm text-foreground-accent font-body leading-relaxed">
            These rows matched on <strong className="font-semibold text-navy">pin name, artist, and front image URL</strong>.
            The first row in each group imports automatically. For each extra row, compare the details below and choose
            what to do.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto bg-navy/[0.03] px-5 py-4 space-y-6">
          {groups.map(group => {
            const [firstIndex, ...duplicateIndices] = group.rowIndices;
            const baseline = mappedRowAt(rawRows, mapping, firstIndex);

            return (
              <section key={group.dedupeKey} className="space-y-3">
                <div className="px-1">
                  <h3 className="text-base font-bold text-navy font-display">{group.sample.pin_name}</h3>
                  <p className="text-sm text-foreground-accent font-body">{group.sample.artist}</p>
                  <p className="mt-1 text-xs text-foreground-accent font-body">
                    {group.rowIndices.length} rows in this group
                  </p>
                </div>

                <DuplicateRowCard
                  rowIndex={firstIndex}
                  mapped={baseline}
                  fieldLabels={fieldLabels}
                  baseline={null}
                  isPrimary
                />

                {duplicateIndices.map(rowIndex => (
                  <DuplicateRowCard
                    key={rowIndex}
                    rowIndex={rowIndex}
                    mapped={mappedRowAt(rawRows, mapping, rowIndex)}
                    fieldLabels={fieldLabels}
                    baseline={baseline}
                    isPrimary={false}
                    policy={policyByRowIndex[rowIndex]}
                    onPolicyChange={policy => onPolicyChange(rowIndex, policy)}
                  />
                ))}
              </section>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-navy/10 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white font-body hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
