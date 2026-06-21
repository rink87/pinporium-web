import type { VaultImportFieldKey } from './types';

/** Hard cap enforced after parse, before job queue (ADR-002). */
export const VAULT_IMPORT_ROW_CAP = 5000;

export const VAULT_IMPORT_REQUIRED_FIELDS: VaultImportFieldKey[] = ['pin_name', 'artist'];

export const UNKNOWN_ARTIST_SENTINELS = ['unknown artist', 'unknown', 'unknown-artist'] as const;

export const VAULT_IMPORT_TEMPLATE_HEADERS: VaultImportFieldKey[] = [
  'pin_name',
  'artist',
  'collaborating_artists',
  'front_image_url',
  'back_image_url',
  'grade',
  'price_paid',
  'personal_value',
  'currency',
  'source',
  'edition',
  'variant',
  'metal_finish',
  'num_posts',
  'notes',
];

/** Header aliases for auto-mapping (lowercase). */
export const VAULT_IMPORT_HEADER_ALIASES: Record<VaultImportFieldKey, string[]> = {
  pin_name: ['pin name', 'pin_name', 'name', 'title', 'pin title', 'design name'],
  artist: ['artist', 'maker', 'studio', 'designer'],
  collaborating_artists: [
    'collaborating artists',
    'collaborating_artists',
    'collaborators',
    'collab artists',
  ],
  front_image_url: [
    'front image url',
    'front_image_url',
    'front url',
    'front photo',
    'front image',
    'photo front',
  ],
  back_image_url: [
    'back image url',
    'back_image_url',
    'back url',
    'back photo',
    'back image',
    'photo back',
  ],
  grade: ['grade', 'condition'],
  price_paid: ['price paid', 'price_paid', 'paid', 'cost', 'purchase price'],
  personal_value: ['personal value', 'personal_value', 'value', 'estimated value'],
  currency: ['currency', 'currency code'],
  source: ['source', 'where bought', 'acquired from'],
  edition: ['edition', 'le', 'run size'],
  variant: ['variant', 'variant name', 'colorway'],
  metal_finish: ['metal finish', 'metal_finish', 'metal', 'backing'],
  num_posts: ['num posts', 'num_posts', 'posts', 'post count', 'pin posts'],
  notes: ['notes', 'note', 'comments', 'description'],
};

export const VAULT_IMPORT_TEMPLATE_CSV = `${VAULT_IMPORT_TEMPLATE_HEADERS.join(',')}\n`;
