/** Hosts allowed for import mapping thumbnails (server-side proxy). */
const IMPORT_IMAGE_PREVIEW_PATTERNS: RegExp[] = [
  /^https:\/\/docs\.google\.com\/sheets-images-rt\//i,
  /^https:\/\/[^/]+\.s3\.[a-z0-9-]+\.amazonaws\.com\//i,
  /^https:\/\/files\.baserow\.io\//i,
];

export function isAllowedImportImagePreviewUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  return IMPORT_IMAGE_PREVIEW_PATTERNS.some(pattern => pattern.test(trimmed));
}

/** Same-origin proxy path — Google Sheets images block cross-origin <img> embeds. */
export function importImagePreviewSrc(originalUrl: string): string {
  return `/api/import/image-preview?url=${encodeURIComponent(originalUrl.trim())}`;
}
