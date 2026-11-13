const PIN_IMAGES_PUBLIC_PATH = /\/storage\/v1\/object\/public\/pin-images\//i;
const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif)$/i;
/** Seeded / hand-placed catalog objects — often lack `-thumb` siblings. */
const PIN_IMAGES_CATALOG_PATH = /\/storage\/v1\/object\/public\/pin-images\/catalog\//i;

function thumbExtensionForPath(path: string): "png" | "jpg" {
  return /\.png$/i.test(path) ? "png" : "jpg";
}

/**
 * Prefer the lighter `-thumb` sibling for Resend/HTML email.
 * Only rewrites public `pin-images` HTTPS URLs. Leaves signed URLs, non-storage
 * hosts, already-thumb paths, and `pin-images/catalog/` objects unchanged.
 * Catalog seeds are often uploaded without thumbs; email clients cannot fall
 * back like in-app `PinImage`, so rewriting those paths breaks the image.
 * Never returns data: URIs.
 */
export function pinImageEmailPreviewUrl(uri: string | null | undefined): string | null {
  const full = uri?.trim();
  if (!full) return null;
  if (!/^https:\/\//i.test(full)) {
    // Email clients reject data: and relative/http srcs for remote images.
    return null;
  }
  if (
    !PIN_IMAGES_PUBLIC_PATH.test(full) ||
    /-thumb\.(jpe?g|png)(\?|$)/i.test(full) ||
    PIN_IMAGES_CATALOG_PATH.test(full)
  ) {
    return full;
  }
  const qIndex = full.indexOf("?");
  const path = qIndex >= 0 ? full.slice(0, qIndex) : full;
  const query = qIndex >= 0 ? full.slice(qIndex) : "";
  const thumbExt = thumbExtensionForPath(path);
  const thumbPath = path.replace(IMAGE_EXT, `-thumb.${thumbExt}`);
  if (thumbPath === path) return full;
  return `${thumbPath}${query}`;
}
