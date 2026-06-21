/** Beta-only helpers for capped test imports and reverting a job's vault rows. */

export function parseBetaImportRowLimit(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export function sliceRowsForBetaLimit<T>(rows: T[], limit: number | null | undefined): T[] {
  if (limit == null || limit >= rows.length) return rows;
  return rows.slice(0, limit);
}

export function formatBetaImportRowCount(total: number, limit: number | null | undefined): string {
  if (limit == null || limit >= total) {
    return total.toLocaleString();
  }
  return `${limit.toLocaleString()} of ${total.toLocaleString()}`;
}
