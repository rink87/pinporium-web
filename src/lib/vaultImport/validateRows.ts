import { VAULT_IMPORT_ROW_CAP } from './constants';
import { applyColumnMapping } from './columnMapping';
import { importRowDedupeKey, normalizeMappedImportRow } from './normalizeRow';
import type {
  VaultImportColumnMapping,
  VaultImportNormalizedRow,
  VaultImportRawRow,
} from './types';

export type DuplicateRowPolicy = 'skip' | 'unique' | 'cluster';

export type InFileDuplicateGroup = {
  dedupeKey: string;
  rowIndices: number[];
  sample: VaultImportNormalizedRow;
};

export type PrepareVaultImportRowsResult =
  | {
      ok: true;
      rows: VaultImportNormalizedRow[];
      skippedDuplicateRows: number;
      invalidRowCount: number;
    }
  | { ok: false; reason: 'row_cap' | 'empty'; message: string };

export type PrepareVaultImportOptions = {
  duplicatePolicyByRowIndex?: Record<number, DuplicateRowPolicy>;
};

/** Groups of valid rows that share the same in-file dedupe key (2+ rows each). */
export function findInFileDuplicateGroups(
  rawRows: VaultImportRawRow[],
  mapping: VaultImportColumnMapping,
): InFileDuplicateGroup[] {
  const groups = new Map<string, { indices: number[]; sample: VaultImportNormalizedRow }>();

  for (let rowIndex = 0; rowIndex < rawRows.length; rowIndex++) {
    const mapped = applyColumnMapping(rawRows[rowIndex], mapping);
    const normalized = normalizeMappedImportRow(mapped);
    if (!normalized) continue;

    const key = importRowDedupeKey(normalized);
    const existing = groups.get(key);
    if (existing) {
      existing.indices.push(rowIndex);
    } else {
      groups.set(key, { indices: [rowIndex], sample: normalized });
    }
  }

  return Array.from(groups.entries())
    .filter(([, group]) => group.indices.length > 1)
    .map(([dedupeKey, group]) => ({
      dedupeKey,
      rowIndices: group.indices,
      sample: group.sample,
    }));
}

export function prepareVaultImportRows(
  rawRows: VaultImportRawRow[],
  mapping: VaultImportColumnMapping,
  options?: PrepareVaultImportOptions,
): PrepareVaultImportRowsResult {
  if (rawRows.length === 0) {
    return { ok: false, reason: 'empty', message: 'The file has no data rows.' };
  }
  if (rawRows.length > VAULT_IMPORT_ROW_CAP) {
    return {
      ok: false,
      reason: 'row_cap',
      message: `This file has ${rawRows.length.toLocaleString()} rows. The import limit is ${VAULT_IMPORT_ROW_CAP.toLocaleString()} — split the file and try again.`,
    };
  }

  const rows: VaultImportNormalizedRow[] = [];
  const seen = new Set<string>();
  let skippedDuplicateRows = 0;
  let invalidRowCount = 0;
  const policies = options?.duplicatePolicyByRowIndex ?? {};

  for (let rowIndex = 0; rowIndex < rawRows.length; rowIndex++) {
    const raw = rawRows[rowIndex];
    const mapped = applyColumnMapping(raw, mapping);
    const normalized = normalizeMappedImportRow(mapped);
    if (!normalized) {
      invalidRowCount += 1;
      continue;
    }
    const key = importRowDedupeKey(normalized);
    if (seen.has(key)) {
      const policy = policies[rowIndex] ?? 'skip';
      if (policy === 'skip') {
        skippedDuplicateRows += 1;
        continue;
      }
      if (policy === 'cluster') {
        rows.push({ ...normalized, import_cluster_key: key });
        continue;
      }
      rows.push({ ...normalized });
      continue;
    }
    seen.add(key);
    rows.push(normalized);
  }

  if (rows.length === 0) {
    return {
      ok: false,
      reason: 'empty',
      message: 'No valid rows found. Each row needs pin name and artist mapped.',
    };
  }

  return { ok: true, rows, skippedDuplicateRows, invalidRowCount };
}
