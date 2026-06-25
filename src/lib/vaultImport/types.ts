/** Canonical vault fields after column mapping (ADR-002 template). */
export type VaultImportFieldKey =
  | 'pin_name'
  | 'artist'
  | 'collaborating_artists'
  | 'front_image_url'
  | 'back_image_url'
  | 'grade'
  | 'price_paid'
  | 'personal_value'
  | 'currency'
  | 'source'
  | 'edition'
  | 'variant'
  | 'metal_finish'
  | 'enamel_type'
  | 'num_posts'
  | 'notes';

export type VaultImportColumnMapping = Partial<Record<VaultImportFieldKey, string>>;

export type VaultImportRawRow = Record<string, string>;

export type VaultImportNormalizedRow = {
  pin_name: string;
  artist: string;
  collaborating_artists?: string[];
  front_image_url?: string;
  back_image_url?: string;
  grade?: string;
  price_paid?: string;
  personal_value?: string;
  currency?: string;
  source?: string;
  edition?: string;
  variant?: string;
  metal_finish?: string;
  enamel_type?: string;
  num_posts?: number | null;
  notes?: string;
};

export type VaultImportJobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type VaultImportJobProgress = {
  id: string;
  status: VaultImportJobStatus;
  file_name: string | null;
  total_rows: number;
  processed_rows: number;
  succeeded_rows: number;
  failed_rows: number;
  skipped_duplicate_rows: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type StartVaultImportResult =
  | { ok: true; jobId: string; totalRows: number; skippedDuplicateRows: number }
  | { ok: false; reason: 'row_cap' | 'validation' | 'error'; message: string };
