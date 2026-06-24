import type { ImportLinkSource, ParsedImportLink } from "./types";

function parseGid(input: string | null): string | null {
  if (!input?.trim()) return null;
  return input.trim();
}

/** Normalize user paste: trim, strip trailing punctuation from chat apps. */
export function normalizeImportLinkInput(raw: string): string {
  return raw.trim().replace(/[)\].,;]+$/g, "");
}

export function detectImportLink(raw: string): ParsedImportLink | null {
  const input = normalizeImportLinkInput(raw);
  if (!input) return null;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  if (host === "baserow.io" && path.startsWith("/public/grid/")) {
    const slug = path.slice("/public/grid/".length).split("/")[0]?.trim();
    if (!slug) return null;
    return {
      source: "baserow_public_grid",
      label: "Baserow collection",
      baserow: { slug },
    };
  }

  if (host === "docs.google.com" && path.includes("/spreadsheets/")) {
    const published = path.match(/\/spreadsheets\/d\/e\/([^/]+)/);
    if (published) {
      const gid = parseGid(url.searchParams.get("gid")) ?? "0";
      return {
        source: "google_published_sheet",
        label: "Google Sheets (published)",
        google: { publishId: published[1], gid },
      };
    }

    // Edit/share links are not ingestible without OAuth — caller shows a helpful error.
    if (path.match(/\/spreadsheets\/d\/[^/]+/)) {
      return {
        source: "google_published_sheet",
        label: "Google Sheets",
        google: { publishId: "", gid: parseGid(url.searchParams.get("gid")) ?? "0" },
      };
    }
  }

  return null;
}

export function isSupportedImportLink(raw: string): boolean {
  const parsed = detectImportLink(raw);
  if (!parsed) return false;
  if (parsed.source === "google_published_sheet") {
    return Boolean(parsed.google?.publishId);
  }
  return Boolean(parsed.baserow?.slug);
}

export function unsupportedImportLinkMessage(raw: string): string | null {
  const parsed = detectImportLink(raw);
  if (!parsed) {
    return "Paste a published Google Sheets link or a public Baserow grid link.";
  }
  if (parsed.source === "google_published_sheet" && !parsed.google?.publishId) {
    return "That Google Sheets link is not published to the web. Ask the owner for a “Publish to web” link, or upload a CSV export.";
  }
  return null;
}

export function importLinkSourceLabel(source: ImportLinkSource): string {
  if (source === "baserow_public_grid") return "Baserow";
  return "Google Sheets";
}
