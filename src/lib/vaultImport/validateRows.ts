import { VAULT_IMPORT_ROW_CAP } from './constants';
import { applyColumnMapping } from './columnMapping';
import { importRowDedupeKey, normalizeMappedImportRow } from './normalizeRow';
import type {
  VaultImportColumnMapping,
  VaultImportNormalizedRow,
  VaultImportRawRow,
} from './types';

export type PrepareVaultImportRowsResult =
  | {
      ok: true;
      rows: VaultImportNormalizedRow[];
      skippedDuplicateRows: number;
      invalidRowCount: number;
    }
  | { ok: false; reason: 'row_cap' | 'empty'; message: string };

export function prepareVaultImportRows(
  rawRows: VaultImportRawRow[],
  mapping: VaultImportColumnMapping,
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

  for (const raw of rawRows) {
    const mapped = applyColumnMapping(raw, mapping);
    const normalized = normalizeMappedImportRow(mapped);
    if (!normalized) {
      invalidRowCount += 1;
      continue;
    }
    const key = importRowDedupeKey(normalized);
    if (seen.has(key)) {
      skippedDuplicateRows += 1;
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
