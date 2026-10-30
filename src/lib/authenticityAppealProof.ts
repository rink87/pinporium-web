/** Keep in sync with pinporium-app `src/lib/authenticityAppeal.ts`. */

export const AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES = 4;
export const AUTHENTICITY_APPEAL_MAX_PROOF_BYTES = 8 * 1024 * 1024;

const ALLOWED_PROOF_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export function normalizeProofImageUrls(
  urls: unknown,
  max = AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES,
): string[] {
  if (!Array.isArray(urls)) return [];
  const out: string[] = [];
  for (const raw of urls) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!/^https?:\/\//i.test(trimmed)) continue;
    out.push(trimmed);
    if (out.length >= max) break;
  }
  return out;
}

export function proofImageExtFromMime(mime: string): string {
  const normalized = mime.toLowerCase().trim();
  if (normalized.includes("png")) return "png";
  if (normalized.includes("webp")) return "webp";
  if (normalized.includes("heic") || normalized.includes("heif")) return "heic";
  return "jpg";
}

export function isAllowedProofImageMime(mime: string): boolean {
  return ALLOWED_PROOF_MIME.has(mime.toLowerCase().trim());
}

export function appealProofObjectPath(userId: string, index: number, mime: string): string {
  const ext = proofImageExtFromMime(mime);
  return `${userId}/appeal-proof-${Date.now()}-${index}.${ext}`;
}
