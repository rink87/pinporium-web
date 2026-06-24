import { VAULT_IMPORT_ROW_CAP } from "../constants";
import type { IngestedImportTable } from "./types";

const FETCH_HEADERS = {
  "User-Agent": "PinporiumImport/1.0 (+https://pinporium.app/import)",
  Accept: "text/html,text/csv,*/*",
};

const GOOGLE_REDIRECT_PREFIX = "https://www.google.com/url?q=";

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Unwrap Google redirect links from published sheet cells. */
export function unwrapGoogleRedirectUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith(GOOGLE_REDIRECT_PREFIX)) return trimmed;
  try {
    const target = new URL(trimmed).searchParams.get("q");
    return target?.trim() || trimmed;
  } catch {
    return trimmed;
  }
}

function normalizeImageUrl(src: string): string {
  const base = src.split("=")[0];
  return `${base}=w800-h800`;
}

function parseSheetCell(tdHtml: string): string {
  const img = tdHtml.match(/https:\/\/docs\.google\.com\/sheets-images-rt\/[^"'\s<>]+/);
  if (img) return normalizeImageUrl(img[0]);

  const anchor = tdHtml.match(/href="([^"]+)"/);
  if (anchor) return unwrapGoogleRedirectUrl(decodeHtmlEntities(anchor[1]));

  const text = decodeHtmlEntities(tdHtml.replace(/<[^>]+>/g, "")).trim();
  return unwrapGoogleRedirectUrl(text);
}

function parseSheetRow(rowHtml: string): string[] {
  const cells: string[] = [];
  const pattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match = pattern.exec(rowHtml);
  while (match) {
    cells.push(parseSheetCell(match[1]));
    match = pattern.exec(rowHtml);
  }
  return cells;
}

function isHeaderRow(cells: string[]): boolean {
  const normalized = cells.map(c => c.trim().toLowerCase());
  const hasName = normalized.some(c => c === "name" || c === "pin name" || c === "pin description");
  const hasImage = normalized.some(c => c === "image" || c.includes("photo"));
  return hasName || (hasImage && normalized.filter(Boolean).length >= 2);
}

function rowHasData(cells: string[], headerIndexes: number[]): boolean {
  return headerIndexes.some(index => Boolean(cells[index]?.trim()));
}

export function parseGooglePublishedSheetHtml(html: string): { headers: string[]; rows: Record<string, string>[] } {
  const rowHtmlBlocks: string[] = [];
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch = rowPattern.exec(html);
  while (rowMatch) {
    rowHtmlBlocks.push(rowMatch[1]);
    rowMatch = rowPattern.exec(html);
  }
  if (rowHtmlBlocks.length === 0) {
    return { headers: [], rows: [] };
  }

  let headerCells: string[] = [];
  let headerStartIndex = -1;

  for (let i = 0; i < Math.min(rowHtmlBlocks.length, 20); i += 1) {
    const cells = parseSheetRow(rowHtmlBlocks[i]);
    if (isHeaderRow(cells)) {
      headerCells = cells;
      headerStartIndex = i;
      break;
    }
  }

  if (headerStartIndex < 0) {
    return { headers: [], rows: [] };
  }

  const columnIndexes: number[] = [];
  const headers: string[] = [];
  headerCells.forEach((header, index) => {
    const name = header.trim();
    if (!name) return;
    columnIndexes.push(index);
    headers.push(name);
  });

  if (headers.length === 0) {
    return { headers: [], rows: [] };
  }

  const rows: Record<string, string>[] = [];
  for (let i = headerStartIndex + 1; i < rowHtmlBlocks.length; i += 1) {
    const cells = parseSheetRow(rowHtmlBlocks[i]);
    if (!rowHasData(cells, columnIndexes)) continue;

    const row: Record<string, string> = {};
    columnIndexes.forEach((colIndex, headerIndex) => {
      row[headers[headerIndex]] = cells[colIndex]?.trim() ?? "";
    });

    if (Object.values(row).every(v => !v.trim())) continue;
    rows.push(row);
    if (rows.length > VAULT_IMPORT_ROW_CAP) break;
  }

  return { headers, rows };
}

export async function ingestGooglePublishedSheet(args: {
  publishId: string;
  gid: string;
}): Promise<IngestedImportTable> {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/e/${args.publishId}/pubhtml/sheet?headers=false&gid=${args.gid}`;

  const res = await fetch(sheetUrl, { headers: FETCH_HEADERS, redirect: "follow" });
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Could not open that published sheet. Check the link is still shared publicly."
        : "Could not load the published Google Sheet.",
    );
  }

  const html = await res.text();
  const parsed = parseGooglePublishedSheetHtml(html);
  if (parsed.headers.length === 0 || parsed.rows.length === 0) {
    throw new Error("No rows found in that published sheet.");
  }

  return {
    headers: parsed.headers,
    rows: parsed.rows,
    source: "google_published_sheet",
    label: "Google Sheets (published)",
  };
}
