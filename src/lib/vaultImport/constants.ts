import type { VaultImportFieldKey } from './types';

/** Hard cap enforced after parse, before job queue (ADR-002). */
export const VAULT_IMPORT_ROW_CAP = 5000;

export const VAULT_IMPORT_REQUIRED_FIELDS: VaultImportFieldKey[] = ['pin_name', 'artist'];

export const VAULT_IMPORT_RECOMMENDED_FIELDS: VaultImportFieldKey[] = [
  'metal_finish',
  'grade',
  'enamel_type',
];

export const VAULT_IMPORT_MAPPING_SECTIONS: {
  id: string;
  title: string;
  description?: string;
  fields: VaultImportFieldKey[];
}[] = [
  {
    id: 'required',
    title: 'Required',
    description: 'Every pin needs a name and artist. Artist can be “Unknown artist” if your file doesn’t have one.',
    fields: ['pin_name', 'artist'],
  },
  {
    id: 'photos',
    title: 'Photos',
    description: 'Optional — skip any you don’t have and add them later with Finish import tasks in the app.',
    fields: ['front_image_url', 'back_image_url'],
  },
  {
    id: 'recommended',
    title: 'Recommended',
    description: 'Metal finish, grade, and enamel type help your vault look complete on import.',
    fields: ['metal_finish', 'grade', 'enamel_type'],
  },
  {
    id: 'optional',
    title: 'Optional',
    description: 'Map anything useful from your file. Unmapped columns are ignored.',
    fields: [
      'collaborating_artists',
      'price_paid',
      'personal_value',
      'currency',
      'source',
      'edition',
      'variant',
      'num_posts',
      'notes',
    ],
  },
];

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
  'enamel_type',
  'num_posts',
  'notes',
];

/** Header aliases for auto-mapping (lowercase). */
export const VAULT_IMPORT_HEADER_ALIASES: Record<VaultImportFieldKey, string[]> = {
  pin_name: [
    'pin name',
    'pin_name',
    'name',
    'title',
    'pin title',
    'design name',
    'pin description',
    'character name',
  ],
  artist: ['artist', 'artist/brand', 'artist brand', 'maker', 'studio', 'designer', 'brand', 'creator'],
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
    'image',
    'photo',
    'picture',
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
  personal_value: [
    'personal value',
    'personal_value',
    'value',
    'estimated value',
    'sale price',
    'net value formula',
  ],
  currency: ['currency', 'currency code'],
  source: ['source', 'where bought', 'acquired from', 'website', 'url', 'shop url'],
  edition: ['edition', 'le', 'run size'],
  variant: ['variant', 'variant name', 'colorway'],
  metal_finish: ['metal finish', 'metal_finish', 'metal', 'backing'],
  enamel_type: ['enamel type', 'enamel_type', 'enamel', 'pin type', 'finish type'],
  num_posts: ['num posts', 'num_posts', 'posts', 'post count', 'pin posts'],
  notes: ['notes', 'note', 'comments', 'description'],
};

export const VAULT_IMPORT_TEMPLATE_CSV = `${VAULT_IMPORT_TEMPLATE_HEADERS.join(',')}\n`;
