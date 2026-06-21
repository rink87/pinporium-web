const DEFAULT_SAMPLE_MAX_LEN = 56;

/** First non-empty cell in a column — for mapping UI context. */
export function sampleValueForColumn(
  rows: Record<string, string>[],
  header: string,
  maxLength = DEFAULT_SAMPLE_MAX_LEN,
): string | null {
  for (const row of rows) {
    const value = row[header]?.trim();
    if (!value) continue;
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength - 1)}…`;
  }
  return null;
}
