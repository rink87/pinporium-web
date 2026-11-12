import { describe, expect, it } from "vitest";
import { catalogDisplayCandidates, resolveCatalogDisplayImage } from "./displayCascade";

describe("catalog display cascade (web)", () => {
  it("prefers front then cutout then design for Picture mode", () => {
    expect(
      catalogDisplayCandidates({
        cutoutImageUrl: "https://x/c.png",
        frontImageUrl: "https://x/f.jpg",
        designPrimaryImageUrl: "https://x/d.jpg",
      }).map((c) => c.layer),
    ).toEqual(["front", "cutout", "design"]);
  });

  it("advances past failed front without looping", () => {
    const failed = new Set(["https://x/f.jpg"]);
    expect(
      resolveCatalogDisplayImage(
        {
          cutoutImageUrl: "https://x/c.png",
          frontImageUrl: "https://x/f.jpg",
        },
        failed,
      ),
    ).toEqual({ layer: "cutout", url: "https://x/c.png" });
  });
});
