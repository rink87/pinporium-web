import type { SupabaseClient } from "@supabase/supabase-js";

import type { IngestedImportTable } from "@/lib/vaultImport/linkSources";

export async function fetchVaultImportFromLink(
  supabase: SupabaseClient,
  url: string,
): Promise<{ ok: true; data: IngestedImportTable } | { ok: false; message: string }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { ok: false, message: "Sign in to import from a link." };
  }

  const res = await fetch("/api/import/fetch-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ url }),
  });

  const payload = (await res.json().catch(() => null)) as
    | { error?: string; headers?: string[]; rows?: Record<string, string>[]; source?: string; label?: string }
    | null;

  if (!res.ok) {
    return { ok: false, message: payload?.error ?? "Could not load that link." };
  }

  if (!payload?.headers?.length || !payload.rows?.length || !payload.source || !payload.label) {
    return { ok: false, message: "That link did not return importable rows." };
  }

  return {
    ok: true,
    data: {
      headers: payload.headers,
      rows: payload.rows,
      source: payload.source as IngestedImportTable["source"],
      label: payload.label,
    },
  };
}
