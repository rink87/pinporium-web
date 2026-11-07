import { describe, expect, it } from "vitest";
import { catalogDisplayCandidates, resolveCatalogDisplayImage } from "./displayCascade";

describe("catalog display cascade (web)", () => {
  it("prefers cutout then front then design", () => {
    expect(
      catalogDisplayCandidates({
        cutoutImageUrl: "https://x/c.png",
        frontImageUrl: "https://x/f.jpg",
        designPrimaryImageUrl: "https://x/d.jpg",
      }).map((c) => c.layer),
    ).toEqual(["cutout", "front", "design"]);
  });

  it("advances past failed cutout and front without looping", () => {
    const failed = new Set(["https://x/c.png"]);
    expect(
      resolveCatalogDisplayImage(
        {
          cutoutImageUrl: "https://x/c.png",
          frontImageUrl: "https://x/f.jpg",
        },
        failed,
      ),
    ).toEqual({ layer: "front", url: "https://x/f.jpg" });
  });
});
