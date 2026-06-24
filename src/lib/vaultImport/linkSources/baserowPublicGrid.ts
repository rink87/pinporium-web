import { VAULT_IMPORT_ROW_CAP } from "../constants";
import type { IngestedImportTable } from "./types";

const FETCH_HEADERS = {
  "User-Agent": "PinporiumImport/1.0 (+https://pinporium.app/import)",
  Accept: "application/json",
};

type BaserowFieldInfo = {
  id: number;
  name: string;
  type: string;
};

type BaserowPublicInfo = {
  fields: BaserowFieldInfo[];
};

type BaserowRowsPage = {
  count: number;
  next: string | null;
  results: Record<string, unknown>[];
};

function fieldKey(fieldId: number): string {
  return `field_${fieldId}`;
}

/** Flatten Baserow cell values to import-friendly strings. */
export function baserowCellToString(value: unknown, fieldType: string): string {
  if (value == null) return "";

  if (fieldType === "file") {
    const files = Array.isArray(value) ? value : [value];
    const first = files[0] as { url?: string; thumbnails?: { card_cover?: { url?: string } } } | undefined;
    return first?.url?.trim() || first?.thumbnails?.card_cover?.url?.trim() || "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  if (Array.isArray(value)) {
    const first = value[0];
    if (first && typeof first === "object" && "url" in first) {
      const file = first as { url?: string };
      return file.url?.trim() || "";
    }

    return value
      .map(item => {
        if (item && typeof item === "object" && "value" in item) {
          return String((item as { value: unknown }).value ?? "").trim();
        }
        return String(item ?? "").trim();
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object" && value !== null && "value" in value) {
    return String((value as { value: unknown }).value ?? "").trim();
  }

  return "";
}

async function fetchBaserowJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: FETCH_HEADERS, redirect: "follow" });
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Could not open that Baserow view. Check the link is still shared publicly."
        : "Could not load the Baserow collection.",
    );
  }
  return (await res.json()) as T;
}

export async function ingestBaserowPublicGrid(args: { slug: string }): Promise<IngestedImportTable> {
  const info = await fetchBaserowJson<BaserowPublicInfo>(
    `https://api.baserow.io/api/database/views/${args.slug}/public/info/`,
  );

  const fields = (info.fields ?? []).filter(f => f.name?.trim());
  if (fields.length === 0) {
    throw new Error("That Baserow view has no columns to import.");
  }

  const headers = fields.map(f => f.name.trim());
  const rows: Record<string, string>[] = [];

  let nextUrl: string | null =
    `https://api.baserow.io/api/database/views/grid/${args.slug}/public/rows/?size=200`;

  while (nextUrl && rows.length <= VAULT_IMPORT_ROW_CAP) {
    const page: BaserowRowsPage = await fetchBaserowJson<BaserowRowsPage>(nextUrl);
    for (const result of page.results ?? []) {
      const row: Record<string, string> = {};
      for (const field of fields) {
        const raw = result[fieldKey(field.id)];
        row[field.name.trim()] = baserowCellToString(raw, field.type);
      }
      if (Object.values(row).some(v => v.trim())) {
        rows.push(row);
      }
      if (rows.length > VAULT_IMPORT_ROW_CAP) break;
    }
    nextUrl = page.next;
  }

  if (rows.length === 0) {
    throw new Error("No rows found in that Baserow view.");
  }

  return {
    headers,
    rows: rows.slice(0, VAULT_IMPORT_ROW_CAP),
    source: "baserow_public_grid",
    label: "Baserow collection",
  };
}
