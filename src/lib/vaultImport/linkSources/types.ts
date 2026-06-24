export type ImportLinkSource = "google_published_sheet" | "baserow_public_grid";

export type ParsedImportLink = {
  source: ImportLinkSource;
  /** Display label for mapping step */
  label: string;
  google?: { publishId: string; gid: string };
  baserow?: { slug: string };
};

export type IngestedImportTable = {
  headers: string[];
  rows: Record<string, string>[];
  source: ImportLinkSource;
  label: string;
};

export type FetchImportLinkResult =
  | { ok: true; data: IngestedImportTable }
  | { ok: false; message: string };
