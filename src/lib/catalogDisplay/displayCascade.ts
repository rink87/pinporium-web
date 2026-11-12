/**
 * Catalog card/thumbnail **Picture** preference (flat image):
 * original front photo → approved cutout PNG → design primary → placeholder.
 *
 * Cutout is secondary for flat image (3D-style viewer uses it separately).
 * Approving a cutout does not generate a mesh. Callers advance on onError; never retry the same URL.
 */

export type CatalogDisplayImageInput = {
  cutoutImageUrl?: string | null;
  frontImageUrl?: string | null;
  designPrimaryImageUrl?: string | null;
  placeholderUrl?: string | null;
  /** Include cutout only when approved into the canonical cutout slot. */
  cutoutApproved?: boolean;
};

export type CatalogDisplayLayer =
  | "cutout"
  | "front"
  | "design"
  | "placeholder"
  | "none";

export function catalogDisplayCandidates(
  input: CatalogDisplayImageInput,
): { layer: CatalogDisplayLayer; url: string }[] {
  const out: { layer: CatalogDisplayLayer; url: string }[] = [];
  const push = (layer: CatalogDisplayLayer, raw: string | null | undefined) => {
    const url = raw?.trim();
    if (!url) return;
    if (out.some((c) => c.url === url)) return;
    out.push({ layer, url });
  };

  push("front", input.frontImageUrl);
  if (input.cutoutApproved !== false) {
    push("cutout", input.cutoutImageUrl);
  }
  push("design", input.designPrimaryImageUrl);
  push("placeholder", input.placeholderUrl);
  return out;
}

export function resolveCatalogDisplayImage(
  input: CatalogDisplayImageInput,
  failedUrls: ReadonlySet<string> = new Set(),
): { layer: CatalogDisplayLayer; url: string | null } {
  for (const candidate of catalogDisplayCandidates(input)) {
    if (!failedUrls.has(candidate.url)) {
      return candidate;
    }
  }
  return { layer: "none", url: null };
}
