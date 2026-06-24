import type { VaultImportColumnMapping, VaultImportFieldKey } from "./types";

/** Listbox-only value for the explicit “Don’t import” choice. */
export const IMPORT_LISTBOX_SKIP = "__import_skip__";

export function validImportHeaders(headers: string[]): string[] {
  return headers.filter(header => header.trim().length > 0);
}

/** Every non-empty CSV header — shown in all field dropdowns. */
export function selectableImportHeaders(headers: string[]): string[] {
  return validImportHeaders(headers);
}

/** Which Pinporium field already uses this CSV column (if any). */
export function headerMappedToField(
  mapping: VaultImportColumnMapping,
  header: string,
  excludeField: VaultImportFieldKey,
): VaultImportFieldKey | undefined {
  for (const [field, column] of Object.entries(mapping) as [VaultImportFieldKey, string | undefined][]) {
    if (field === excludeField || !column?.trim()) continue;
    if (column === header) return field;
  }
  return undefined;
}

/** True when a sample cell value looks like a fetchable image URL. */
export function isLikelyImportImageUrl(value: string | null | undefined): boolean {
  const sample = value?.trim();
  if (!sample || !/^https?:\/\//i.test(sample)) return false;
  if (/\.(jpe?g|png|gif|webp|bmp)(\?|#|$)/i.test(sample)) return true;
  return (
    sample.includes("sheets-images-rt") ||
    sample.includes("files.baserow") ||
    sample.includes("amazonaws.com/thumbnails") ||
    sample.includes("amazonaws.com/user_files")
  );
}

/**
 * Mapping cell state:
 * - `undefined` → not chosen yet (“Select a field”)
 * - `''` → explicitly skipped (“Don’t import”)
 * - non-empty string → CSV column header
 */
export function setUniqueColumnMapping(
  mapping: VaultImportColumnMapping,
  field: VaultImportFieldKey,
  header: string | undefined,
): VaultImportColumnMapping {
  const next: VaultImportColumnMapping = { ...mapping };

  if (header === undefined) {
    next[field] = undefined;
    return next;
  }

  if (header === "") {
    next[field] = "";
    return next;
  }

  const trimmed = header.trim();
  if (!trimmed) {
    next[field] = "";
    return next;
  }

  for (const key of Object.keys(next) as VaultImportFieldKey[]) {
    if (key !== field && next[key] === trimmed) {
      next[key] = undefined;
    }
  }
  next[field] = trimmed;
  return next;
}

/** Drop duplicate column assignments when loading a preset or auto-map. */
export function normalizeUniqueColumnMapping(
  mapping: VaultImportColumnMapping,
  headers: string[],
): VaultImportColumnMapping {
  const headerSet = new Set(validImportHeaders(headers));
  const used = new Set<string>();
  const next: VaultImportColumnMapping = {};

  for (const field of Object.keys(mapping) as VaultImportFieldKey[]) {
    const column = mapping[field];
    if (column === undefined) continue;
    if (column === "") {
      next[field] = "";
      continue;
    }
    const trimmed = column.trim();
    if (!trimmed || !headerSet.has(trimmed) || used.has(trimmed)) continue;
    next[field] = trimmed;
    used.add(trimmed);
  }

  return next;
}

export function listboxValueFromMapping(column: string | undefined): string | null {
  if (column === undefined) return null;
  if (column === "") return IMPORT_LISTBOX_SKIP;
  return column;
}

export function mappingValueFromListbox(value: string | null): string | undefined {
  if (value === null) return undefined;
  if (value === IMPORT_LISTBOX_SKIP) return "";
  return value;
}

export function formatColumnExampleValue(sample: string | null): string {
  if (!sample) return "Example value: (empty in file)";
  if (isLikelyImportImageUrl(sample)) return "Example value: image from file";
  if (sample.length > 72) return `Example value: ${sample.slice(0, 71)}…`;
  return `Example value: ${sample}`;
}

export function isMappingColumnSelected(column: string | undefined): column is string {
  return typeof column === "string" && column.length > 0;
}
