import { UNKNOWN_ARTIST_SENTINELS } from './constants';
import type { VaultImportNormalizedRow } from './types';

function splitCollaborators(value: string | undefined): string[] | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const parts = raw
    .split(/[,;|]/)
    .map(s => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

function parseNumPosts(value: string | undefined): number | null | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

export function normalizeUnknownArtist(artist: string): string {
  const key = artist.trim().toLowerCase();
  if ((UNKNOWN_ARTIST_SENTINELS as readonly string[]).includes(key)) {
    return 'Unknown artist';
  }
  return artist.trim();
}

export function normalizeMappedImportRow(mapped: Record<string, string>): VaultImportNormalizedRow | null {
  const pin_name = mapped.pin_name?.trim() ?? '';
  const artistRaw = mapped.artist?.trim() ?? '';
  if (!pin_name || !artistRaw) return null;

  const row: VaultImportNormalizedRow = {
    pin_name,
    artist: normalizeUnknownArtist(artistRaw),
  };

  const collabs = splitCollaborators(mapped.collaborating_artists);
  if (collabs) row.collaborating_artists = collabs;

  const front = mapped.front_image_url?.trim();
  if (front) row.front_image_url = front;

  const back = mapped.back_image_url?.trim();
  if (back) row.back_image_url = back;

  const grade = mapped.grade?.trim();
  if (grade) row.grade = grade;

  const pricePaid = mapped.price_paid?.trim();
  if (pricePaid) row.price_paid = pricePaid;

  const personalValue = mapped.personal_value?.trim();
  if (personalValue) row.personal_value = personalValue;

  const currency = mapped.currency?.trim();
  if (currency) row.currency = currency;

  const source = mapped.source?.trim();
  if (source) row.source = source;

  const edition = mapped.edition?.trim();
  if (edition) row.edition = edition;

  const variant = mapped.variant?.trim();
  if (variant) row.variant = variant;

  const metalFinish = mapped.metal_finish?.trim();
  if (metalFinish) row.metal_finish = metalFinish;

  const numPosts = parseNumPosts(mapped.num_posts);
  if (numPosts != null) row.num_posts = numPosts;

  const notes = mapped.notes?.trim();
  if (notes) row.notes = notes;

  return row;
}

/** Dedupe key for within-file duplicate detection (ADR-002). */
export function importRowDedupeKey(row: VaultImportNormalizedRow): string {
  const front = (row.front_image_url ?? '').trim().toLowerCase();
  return `${row.pin_name.trim().toLowerCase()}|${row.artist.trim().toLowerCase()}|${front}`;
}
