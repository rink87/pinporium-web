import { describe, expect, it } from "vitest";
import { pinImageEmailPreviewUrl } from "./pinImageUrls";

const vaultPng =
  "https://ffcrjkumvydeyqirxgnm.supabase.co/storage/v1/object/public/pin-images/806f766a-ea7a-4e44-9068-3b2ae7ba8cb4/processed-front-1791857741377.png";
const catalogPng =
  "https://ffcrjkumvydeyqirxgnm.supabase.co/storage/v1/object/public/pin-images/catalog/sugar-and-sloth/i-panic-at-discos-original.png";

describe("pinImageEmailPreviewUrl", () => {
  it("rewrites vault pin-images uploads to -thumb siblings", () => {
    expect(pinImageEmailPreviewUrl(vaultPng)).toBe(
      vaultPng.replace(/\.png$/i, "-thumb.png"),
    );
  });

  it("keeps full HTTPS URL for catalog/ seeds (no thumb rewrite)", () => {
    expect(pinImageEmailPreviewUrl(catalogPng)).toBe(catalogPng);
  });

  it("rejects non-HTTPS and data URIs", () => {
    expect(pinImageEmailPreviewUrl("data:image/png;base64,aaa")).toBeNull();
    expect(pinImageEmailPreviewUrl("http://example.com/a.png")).toBeNull();
  });
});
