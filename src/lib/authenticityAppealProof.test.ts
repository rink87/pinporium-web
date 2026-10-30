import { describe, expect, it } from "vitest";

import {
  AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES,
  appealProofObjectPath,
  isAllowedProofImageMime,
  normalizeProofImageUrls,
  proofImageExtFromMime,
} from "./authenticityAppealProof";

describe("authenticityAppealProof", () => {
  it("normalizes and caps proof URLs", () => {
    expect(
      normalizeProofImageUrls([
        " https://cdn.example/a.jpg ",
        "not-a-url",
        "https://cdn.example/b.png",
      ]),
    ).toEqual(["https://cdn.example/a.jpg", "https://cdn.example/b.png"]);
    const many = Array.from(
      { length: AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES + 3 },
      (_, i) => `https://cdn.example/${i}.jpg`,
    );
    expect(normalizeProofImageUrls(many)).toHaveLength(AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES);
  });

  it("maps mime types for storage paths", () => {
    expect(proofImageExtFromMime("image/png")).toBe("png");
    expect(proofImageExtFromMime("image/webp")).toBe("webp");
    expect(isAllowedProofImageMime("image/jpeg")).toBe(true);
    expect(isAllowedProofImageMime("application/pdf")).toBe(false);
    expect(appealProofObjectPath("user-1", 0, "image/jpeg")).toMatch(
      /^user-1\/appeal-proof-\d+-0\.jpg$/,
    );
  });
});
