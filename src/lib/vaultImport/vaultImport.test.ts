import { describe, expect, it } from 'vitest';
import { isAllowedImportImagePreviewUrl, importImagePreviewSrc } from './importImagePreview';
import { parseCsvText } from './csvParse';
import { suggestVaultImportColumnMapping } from './columnMapping';
import { sampleValueForColumn, isIgnoredImportSampleValue } from './columnSamples';
import { normalizeUniqueColumnMapping, setUniqueColumnMapping, selectableImportHeaders, headerMappedToField, isLikelyImportImageUrl } from './mappingUi';
import { prepareVaultImportRows } from './validateRows';

describe('mappingUi', () => {
  it('clears duplicate column from other fields when reassigning', () => {
    const next = setUniqueColumnMapping(
      { pin_name: 'Name', artist: 'Name' },
      'artist',
      'Artist/Brand',
    );
    expect(next.pin_name).toBeUndefined();
    expect(next.artist).toBe('Artist/Brand');
  });

  it('supports explicit skip vs unset', () => {
    expect(setUniqueColumnMapping({}, 'artist', '')).toEqual({ artist: '' });
    expect(setUniqueColumnMapping({}, 'artist', undefined)).toEqual({});
  });

  it('lists every non-empty header in each dropdown', () => {
    expect(selectableImportHeaders(['', 'Name', 'Artist/Brand'])).toEqual(['Name', 'Artist/Brand']);
  });

  it('finds which field owns a mapped column', () => {
    const mapping = { pin_name: 'Name', artist: 'Artist/Brand' };
    expect(headerMappedToField(mapping, 'Name', 'source')).toBe('pin_name');
    expect(headerMappedToField(mapping, 'Name', 'pin_name')).toBeUndefined();
  });

  it('detects image URLs from link imports', () => {
    expect(
      isLikelyImportImageUrl(
        'https://docs.google.com/sheets-images-rt/abc123=w800-h800',
      ),
    ).toBe(true);
    expect(isLikelyImportImageUrl('https://www.shopdisney.com/')).toBe(false);
  });

  it('normalizes duplicate preset mappings', () => {
    const normalized = normalizeUniqueColumnMapping(
      { pin_name: 'Name', artist: 'Name' },
      ['Name', 'Artist/Brand'],
    );
    expect(normalized).toEqual({ pin_name: 'Name' });
  });
});

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

  it('skips spreadsheet error cells when sampling', () => {
    const rows = [{ Image: '#REF!' }, { Image: '', Name: 'Real pin' }];
    expect(sampleValueForColumn(rows, 'Image')).toBeNull();
    expect(isIgnoredImportSampleValue('#REF!')).toBe(true);
  });

  it('does not truncate long image URLs in samples', () => {
    const longUrl =
      'https://docs.google.com/sheets-images-rt/ADAzV4S8bOvBos2o2GMbqEl_BmUN7Y5iu-t_f2WKUKbvHEkkk8vuQtFXUa_BGDAgeJCVEGpzluvHviVmkq64JqD4cirXNH5NJTay6WYzRR6awtHiDUDiS-ONbQNZhv4CDsejPqKp2ATvKxQAEQJBIoTg11BgFhKBfMpYx-NqptAE8g=w800-h800';
    const rows = [{ Image: longUrl }];
    expect(sampleValueForColumn(rows, 'Image')).toBe(longUrl);
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

describe('importImagePreview', () => {
  it('allowlists google sheets image hosts', () => {
    const url =
      'https://docs.google.com/sheets-images-rt/ADAzV4S8bOvBos2o2GMbqEl_BmUN7Y5iu-t_f2WKUKbvHEkkk8vuQtFXUa_BGDAgeJCVEGpzluvHviVmkq64JqD4cirXNH5NJTay6WYzRR6awtHiDUDiS-ONbQNZhv4CDsejPqKp2ATvKxQAEQJBIoTg11BgFhKBfMpYx-NqptAE8g=w800-h800';
    expect(isAllowedImportImagePreviewUrl(url)).toBe(true);
    expect(importImagePreviewSrc(url)).toContain('/api/import/image-preview?url=');
  });
});
