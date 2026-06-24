import { describe, expect, it } from "vitest";

import { suggestVaultImportColumnMapping } from "../columnMapping";
import { baserowCellToString } from "./baserowPublicGrid";
import {
  detectImportLink,
  isSupportedImportLink,
  normalizeImportLinkInput,
  unsupportedImportLinkMessage,
} from "./detectImportLink";
import { parseGooglePublishedSheetHtml, unwrapGoogleRedirectUrl } from "./googlePublishedSheet";

describe("detectImportLink", () => {
  it("detects published Google Sheets links", () => {
    const parsed = detectImportLink(
      "https://docs.google.com/spreadsheets/d/e/abc123/pubhtml?gid=99&single=true",
    );
    expect(parsed?.source).toBe("google_published_sheet");
    expect(parsed?.google).toEqual({ publishId: "abc123", gid: "99" });
    expect(isSupportedImportLink("https://docs.google.com/spreadsheets/d/e/abc123/pubhtml?gid=99")).toBe(true);
  });

  it("detects Baserow public grid links", () => {
    const parsed = detectImportLink("https://baserow.io/public/grid/MySlug123");
    expect(parsed?.source).toBe("baserow_public_grid");
    expect(parsed?.baserow).toEqual({ slug: "MySlug123" });
  });

  it("rejects unpublished Google edit links", () => {
    const msg = unsupportedImportLinkMessage(
      "https://docs.google.com/spreadsheets/d/1abc/edit#gid=0",
    );
    expect(msg).toMatch(/published/i);
  });

  it("strips trailing punctuation from pasted links", () => {
    expect(normalizeImportLinkInput("https://baserow.io/public/grid/Slug).")).toBe(
      "https://baserow.io/public/grid/Slug",
    );
  });
});

describe("parseGooglePublishedSheetHtml", () => {
  const sampleHtml = `
    <table>
      <tr><td></td><td></td></tr>
      <tr>
        <td></td><td>Image</td><td></td><td>Name</td><td>Artist/Brand</td><td>Website</td>
      </tr>
      <tr>
        <td></td>
        <td><img src="https://docs.google.com/sheets-images-rt/TOKEN123=w148-h134" /></td>
        <td></td>
        <td>Mickey Mouse</td>
        <td>Disney</td>
        <td><a href="https://www.google.com/url?q=https://shop.example.com/">link</a></td>
      </tr>
    </table>
  `;

  it("extracts headers, text, images, and redirect URLs", () => {
    const parsed = parseGooglePublishedSheetHtml(sampleHtml);
    expect(parsed.headers).toEqual(["Image", "Name", "Artist/Brand", "Website"]);
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0].Name).toBe("Mickey Mouse");
    expect(parsed.rows[0]["Artist/Brand"]).toBe("Disney");
    expect(parsed.rows[0].Website).toBe("https://shop.example.com/");
    expect(parsed.rows[0].Image).toMatch(/^https:\/\/docs\.google\.com\/sheets-images-rt\/TOKEN123=w800-h800$/);
  });

  it("unwraps Google redirect URLs", () => {
    expect(unwrapGoogleRedirectUrl("https://www.google.com/url?q=https://shop.example.com/")).toBe(
      "https://shop.example.com/",
    );
  });
});

describe("baserowCellToString", () => {
  it("extracts file URLs", () => {
    const value = [{ url: "https://files.example.com/pin.jpg" }];
    expect(baserowCellToString(value, "file")).toBe("https://files.example.com/pin.jpg");
  });

  it("joins multi-select values", () => {
    const value = [{ value: "Goofy" }, { value: "Donald" }];
    expect(baserowCellToString(value, "multiple_select")).toBe("Goofy, Donald");
  });
});

describe("baserow column mapping aliases", () => {
  it("maps common Baserow headers", () => {
    const mapping = suggestVaultImportColumnMapping([
      "Pin Description",
      "Creator",
      "Image",
      "Source",
    ]);
    expect(mapping.pin_name).toBe("Pin Description");
    expect(mapping.artist).toBe("Creator");
    expect(mapping.front_image_url).toBe("Image");
    expect(mapping.source).toBe("Source");
  });
});
