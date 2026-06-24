import { isLikelyImportImageUrl } from "./mappingUi";

const DEFAULT_SAMPLE_MAX_LEN = 56;

const SPREADSHEET_ERROR = /^#(REF!|VALUE!|N\/A|NUM!|ERROR!|NAME\?|NULL!|DIV\/0!)$/i;

/** Values that are not useful mapping previews (empty cells, sheet errors). */
export function isIgnoredImportSampleValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (SPREADSHEET_ERROR.test(trimmed)) return true;
  return false;
}

/** First useful cell in a column — skips blanks and #REF!-style errors. */
export function sampleValueForColumn(
  rows: Record<string, string>[],
  header: string,
  maxLength = DEFAULT_SAMPLE_MAX_LEN,
): string | null {
  for (const row of rows) {
    const value = row[header]?.trim();
    if (isIgnoredImportSampleValue(value ?? "")) continue;
    if (isLikelyImportImageUrl(value)) return value!;
    if (value!.length <= maxLength) return value!;
    return `${value!.slice(0, maxLength - 1)}…`;
  }
  return null;
}

/** Prefer a preview row that looks like real pin data (name + artist populated). */
export function pickRepresentativeImportRow(
  rows: Record<string, string>[],
  mapping: Record<string, string | undefined>,
): Record<string, string> | null {
  for (const row of rows) {
    const nameCol = mapping.pin_name;
    const artistCol = mapping.artist;
    const name = nameCol ? row[nameCol]?.trim() : "";
    const artist = artistCol ? row[artistCol]?.trim() : "";
    if (name && artist && !isIgnoredImportSampleValue(name) && !isIgnoredImportSampleValue(artist)) {
      return row;
    }
  }
  return rows[0] ?? null;
}
