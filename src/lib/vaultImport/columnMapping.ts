import { VAULT_IMPORT_HEADER_ALIASES, VAULT_IMPORT_TEMPLATE_HEADERS } from './constants';
import type { VaultImportColumnMapping, VaultImportFieldKey, VaultImportRawRow } from './types';

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, '_');
}

/** Stable key for matching saved import mapping presets (column order independent). */
export function buildImportHeaderFingerprint(headers: string[]): string {
  return headers.map(normalizeHeader).sort().join('\t');
}

export function isCanonicalTemplateHeaders(headers: string[]): boolean {
  const expected = VAULT_IMPORT_TEMPLATE_HEADERS.map(normalizeHeader);
  const actual = headers.map(normalizeHeader);
  if (expected.length !== actual.length) return false;
  return expected.every((h, i) => h === actual[i]);
}

export function canonicalTemplateColumnMapping(headers: string[]): VaultImportColumnMapping {
  const mapping: VaultImportColumnMapping = {};
  VAULT_IMPORT_TEMPLATE_HEADERS.forEach((field, index) => {
    if (headers[index]) mapping[field] = headers[index];
  });
  return mapping;
}

export function suggestVaultImportColumnMapping(headers: string[]): VaultImportColumnMapping {
  const mapping: VaultImportColumnMapping = {};
  const used = new Set<string>();

  for (const field of Object.keys(VAULT_IMPORT_HEADER_ALIASES) as VaultImportFieldKey[]) {
    const aliases = VAULT_IMPORT_HEADER_ALIASES[field];
    const match = headers.find(h => {
      const norm = normalizeHeader(h);
      return aliases.includes(norm.replace(/_/g, ' ')) || aliases.includes(norm) || norm === field;
    });
    if (match && !used.has(match)) {
      mapping[field] = match;
      used.add(match);
    }
  }

  return mapping;
}

export function applyColumnMapping(
  row: VaultImportRawRow,
  mapping: VaultImportColumnMapping,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [field, header] of Object.entries(mapping) as [VaultImportFieldKey, string][]) {
    if (!header) continue;
    out[field] = row[header]?.trim() ?? '';
  }
  return out;
}
