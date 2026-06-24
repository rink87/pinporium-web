import { detectImportLink, unsupportedImportLinkMessage } from "./detectImportLink";
import { ingestBaserowPublicGrid } from "./baserowPublicGrid";
import { ingestGooglePublishedSheet } from "./googlePublishedSheet";
import type { FetchImportLinkResult } from "./types";

export type { FetchImportLinkResult, IngestedImportTable, ImportLinkSource } from "./types";
export {
  detectImportLink,
  isSupportedImportLink,
  normalizeImportLinkInput,
  unsupportedImportLinkMessage,
} from "./detectImportLink";
export { parseGooglePublishedSheetHtml, unwrapGoogleRedirectUrl } from "./googlePublishedSheet";
export { baserowCellToString } from "./baserowPublicGrid";

export async function fetchImportFromLink(rawUrl: string): Promise<FetchImportLinkResult> {
  const unsupported = unsupportedImportLinkMessage(rawUrl);
  if (unsupported) {
    return { ok: false, message: unsupported };
  }

  const parsed = detectImportLink(rawUrl);
  if (!parsed) {
    return { ok: false, message: "Paste a published Google Sheets link or a public Baserow grid link." };
  }

  try {
    if (parsed.source === "google_published_sheet" && parsed.google?.publishId) {
      const data = await ingestGooglePublishedSheet(parsed.google);
      return { ok: true, data };
    }

    if (parsed.source === "baserow_public_grid" && parsed.baserow?.slug) {
      const data = await ingestBaserowPublicGrid(parsed.baserow);
      return { ok: true, data };
    }

    return { ok: false, message: "Unsupported import link." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load that link.";
    return { ok: false, message };
  }
}
