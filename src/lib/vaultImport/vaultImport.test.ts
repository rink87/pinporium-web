import { describe, expect, it } from 'vitest';
import { parseCsvText } from './csvParse';
import { suggestVaultImportColumnMapping } from './columnMapping';
import { sampleValueForColumn } from './columnSamples';
import { prepareVaultImportRows } from './validateRows';

describe('columnSamples', () => {
  it('returns first non-empty value in column', () => {
    const rows = [
      { Name: '', Artist: 'A' },
      { Name: 'Mickey', Artist: 'B' },
    ];
    expect(sampleValueForColumn(rows, 'Name')).toBe('Mickey');
    expect(sampleValueForColumn(rows, 'Artist')).toBe('A');
    expect(sampleValueForColumn(rows, 'Missing')).toBeNull();
  });
});

describe('vaultImport csvParse', () => {
  it('parses quoted commas', () => {
    const parsed = parseCsvText('pin_name,artist\n"Hello, World",Studio A');
    expect(parsed.headers).toEqual(['pin_name', 'artist']);
    expect(parsed.rows[0].pin_name).toBe('Hello, World');
  });
});

describe('vaultImport mapping', () => {
  it('suggests headers from aliases', () => {
    const mapping = suggestVaultImportColumnMapping(['Pin Name', 'Maker', 'Front URL']);
    expect(mapping.pin_name).toBe('Pin Name');
    expect(mapping.artist).toBe('Maker');
    expect(mapping.front_image_url).toBe('Front URL');
  });
});

describe('prepareVaultImportRows', () => {
  it('rejects over row cap', () => {
    const rows = Array.from({ length: 5001 }, (_, i) => ({
      pin_name: `Pin ${i}`,
      artist: 'Artist',
    }));
    const result = prepareVaultImportRows(rows, { pin_name: 'pin_name', artist: 'artist' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('row_cap');
  });

  it('skips in-file duplicates', () => {
    const result = prepareVaultImportRows(
      [
        { name: 'X-Wing', maker: 'Laserbrain', front: 'https://a/1.jpg' },
        { name: 'X-Wing', maker: 'Laserbrain', front: 'https://a/1.jpg' },
      ],
      { pin_name: 'name', artist: 'maker', front_image_url: 'front' },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rows).toHaveLength(1);
      expect(result.skippedDuplicateRows).toBe(1);
    }
  });
});
