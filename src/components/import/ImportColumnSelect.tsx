"use client";

import clsx from "clsx";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";

import { importImagePreviewSrc } from "@/lib/vaultImport/importImagePreview";
import {
  formatColumnExampleValue,
  headerMappedToField,
  IMPORT_LISTBOX_SKIP,
  isLikelyImportImageUrl,
  isMappingColumnSelected,
  listboxValueFromMapping,
  mappingValueFromListbox,
  selectableImportHeaders,
} from "@/lib/vaultImport/mappingUi";
import type { VaultImportColumnMapping, VaultImportFieldKey } from "@/lib/vaultImport/types";

function ImportImagePreview({ url }: { url: string }) {
  const previewSrc = importImagePreviewSrc(url);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- proxied collector thumbnails in mapping UI
    <img
      src={previewSrc}
      alt=""
      loading="lazy"
      className="h-9 w-9 shrink-0 rounded border border-navy/10 bg-cream-warm object-cover"
      onError={event => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function ColumnOptionLabel({
  header,
  sample,
  mappedToLabel,
  showImagePreview,
}: {
  header: string;
  sample: string | null;
  mappedToLabel?: string;
  showImagePreview?: boolean;
}) {
  const imageUrl = showImagePreview && isLikelyImportImageUrl(sample) ? sample!.trim() : null;

  return (
    <span className="flex min-w-0 items-start gap-2.5">
      {imageUrl ? <ImportImagePreview url={imageUrl} /> : null}
      <span className="block min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-navy font-body">{header}</span>
        {mappedToLabel ? (
          <span className="mt-0.5 block truncate text-xs font-semibold text-amber-800 font-body">
            Mapped to {mappedToLabel}
          </span>
        ) : null}
        <span className="mt-0.5 block truncate text-xs text-foreground-accent font-body">
          {formatColumnExampleValue(sample)}
        </span>
      </span>
    </span>
  );
}

function SelectButtonLabel({
  selection,
  sample,
  showImagePreview,
}: {
  selection: string | undefined;
  sample: string | null;
  showImagePreview?: boolean;
}) {
  if (selection === undefined) {
    return (
      <span className="text-sm font-body text-foreground-accent italic">Select a field</span>
    );
  }

  if (selection === "") {
    return <span className="text-sm font-body text-foreground-accent">Don&apos;t import</span>;
  }

  return (
    <ColumnOptionLabel header={selection} sample={sample} showImagePreview={showImagePreview} />
  );
}

type ImportColumnSelectProps = {
  field: VaultImportFieldKey;
  mapping: VaultImportColumnMapping;
  headers: string[];
  columnSamples: Record<string, string | null>;
  fieldLabels: Record<VaultImportFieldKey, string>;
  onChange: (field: VaultImportFieldKey, header: string | undefined) => void;
  disabled?: boolean;
  showImagePreview?: boolean;
};

export function ImportColumnSelect({
  field,
  mapping,
  headers,
  columnSamples,
  fieldLabels,
  onChange,
  disabled,
  showImagePreview,
}: ImportColumnSelectProps) {
  const selected = mapping[field];
  const allHeaders = selectableImportHeaders(headers);
  const listValue = listboxValueFromMapping(selected);
  const selectedSample = isMappingColumnSelected(selected) ? columnSamples[selected] ?? null : null;

  const options: {
    value: string;
    header: string;
    sample: string | null;
    mappedToLabel?: string;
  }[] = [
    { value: IMPORT_LISTBOX_SKIP, header: "", sample: null },
    ...allHeaders.map(header => {
      const owner = headerMappedToField(mapping, header, field);
      return {
        value: header,
        header,
        sample: columnSamples[header] ?? null,
        mappedToLabel: owner ? fieldLabels[owner] : undefined,
      };
    }),
  ];

  return (
    <Listbox
      value={listValue}
      disabled={disabled}
      onChange={value => onChange(field, mappingValueFromListbox(value))}
    >
      <div className="relative">
        <ListboxButton
          className={clsx(
            "relative w-full rounded-lg border bg-white pl-3 pr-10 py-2.5 text-left shadow-sm",
            "border-navy/10 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <SelectButtonLabel
            selection={selected}
            sample={selectedSample}
            showImagePreview={showImagePreview}
          />
          <HiChevronUpDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/40"
            aria-hidden
          />
        </ListboxButton>

        <ListboxOptions
          portal
          anchor="bottom start"
          className={clsx(
            "z-[200] mt-1 max-h-72 min-w-[var(--button-width)] overflow-y-auto overscroll-contain rounded-lg border border-navy/10",
            "bg-white py-1 shadow-frame focus:outline-none",
          )}
          onWheel={event => event.stopPropagation()}
        >
          {options.map(option =>
            option.value === IMPORT_LISTBOX_SKIP ? (
              <ListboxOption
                key={IMPORT_LISTBOX_SKIP}
                value={IMPORT_LISTBOX_SKIP}
                className="cursor-pointer px-3 py-2 text-sm font-body text-foreground-accent data-[focus]:bg-cream-warm data-[selected]:bg-secondary/10"
              >
                Don&apos;t import
              </ListboxOption>
            ) : (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="cursor-pointer px-3 py-2 data-[focus]:bg-cream-warm data-[selected]:bg-secondary/10"
              >
                <ColumnOptionLabel
                  header={option.header}
                  sample={option.sample}
                  mappedToLabel={option.mappedToLabel}
                  showImagePreview={showImagePreview}
                />
              </ListboxOption>
            ),
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
