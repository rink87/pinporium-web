const PIN_IMAGES_PUBLIC_PATH = /\/storage\/v1\/object\/public\/pin-images\//i;
const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif)$/i;

function thumbExtensionForPath(path: string): 'png' | 'jpg' {
  return /\.png$/i.test(path) ? 'png' : 'jpg';
}

export function pinImageEmailPreviewUrl(uri: string | null | undefined): string | null {
  const full = uri?.trim();
  if (!full) return null;
  if (!PIN_IMAGES_PUBLIC_PATH.test(full) || /-thumb\.(jpe?g|png)(\?|$)/i.test(full)) {
    return full;
  }
  const qIndex = full.indexOf('?');
  const path = qIndex >= 0 ? full.slice(0, qIndex) : full;
  const query = qIndex >= 0 ? full.slice(qIndex) : '';
  const thumbExt = thumbExtensionForPath(path);
  const thumbPath = path.replace(IMAGE_EXT, `-thumb.${thumbExt}`);
  if (thumbPath === path) return full;
  return `${thumbPath}${query}`;
}
