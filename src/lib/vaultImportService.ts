import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  StartVaultImportResult,
  VaultImportColumnMapping,
  VaultImportJobProgress,
  VaultImportNormalizedRow,
} from "@/lib/vaultImport/types";

function parseJobProgress(raw: Record<string, unknown> | null): VaultImportJobProgress | null {
  if (!raw || typeof raw.id !== "string") return null;
  return {
    id: raw.id,
    status: raw.status as VaultImportJobProgress["status"],
    file_name: typeof raw.file_name === "string" ? raw.file_name : null,
    total_rows: Number(raw.total_rows ?? 0),
    processed_rows: Number(raw.processed_rows ?? 0),
    succeeded_rows: Number(raw.succeeded_rows ?? 0),
    failed_rows: Number(raw.failed_rows ?? 0),
    skipped_duplicate_rows: Number(raw.skipped_duplicate_rows ?? 0),
    error_message: typeof raw.error_message === "string" ? raw.error_message : null,
    created_at: String(raw.created_at ?? ""),
    completed_at: typeof raw.completed_at === "string" ? raw.completed_at : null,
  };
}

export type VaultImportMappingPreset = {
  id: string;
  name: string;
  column_mapping: VaultImportColumnMapping;
  header_fingerprint: string | null;
};

export async function fetchActiveVaultImportJob(
  supabase: SupabaseClient,
): Promise<VaultImportJobProgress | null> {
  const { data, error } = await supabase.rpc("get_active_vault_import_job");
  if (error) {
    console.warn("[vaultImport] get_active_vault_import_job", error.message);
    return null;
  }
  if (!data || typeof data !== "object") return null;
  return parseJobProgress(data as Record<string, unknown>);
}

export async function fetchVaultImportJobStatus(
  supabase: SupabaseClient,
  jobId: string,
): Promise<VaultImportJobProgress | null> {
  const { data, error } = await supabase.rpc("get_vault_import_job_status", { p_job_id: jobId });
  if (error) {
    console.warn("[vaultImport] get_vault_import_job_status", error.message);
    return null;
  }
  if (!data || typeof data !== "object") return null;
  return parseJobProgress(data as Record<string, unknown>);
}

export async function startVaultImportJob(
  supabase: SupabaseClient,
  args: {
    fileName: string;
    columnMapping: VaultImportColumnMapping;
    rows: VaultImportNormalizedRow[];
    skippedDuplicateRows: number;
  },
): Promise<StartVaultImportResult> {
  const { data, error } = await supabase.rpc("create_vault_import_job", {
    p_file_name: args.fileName,
    p_column_mapping: args.columnMapping,
    p_rows: args.rows,
  });

  if (error) {
    const msg = error.message ?? "Could not start import";
    if (msg.toLowerCase().includes("row cap")) {
      return { ok: false, reason: "row_cap", message: msg };
    }
    return { ok: false, reason: "error", message: msg };
  }

  const payload = data as { job_id?: string; total_rows?: number } | null;
  const jobId = payload?.job_id;
  if (!jobId) {
    return { ok: false, reason: "error", message: "Import job did not return an id." };
  }

  const { error: invokeErr } = await supabase.functions.invoke("vault-import-process", {
    body: { jobId },
  });
  if (invokeErr) {
    console.warn("[vaultImport] vault-import-process invoke", invokeErr.message);
  }

  return {
    ok: true,
    jobId,
    totalRows: payload?.total_rows ?? args.rows.length,
    skippedDuplicateRows: args.skippedDuplicateRows,
  };
}

export async function saveVaultImportMappingPreset(
  supabase: SupabaseClient,
  args: {
    name: string;
    columnMapping: VaultImportColumnMapping;
    headerFingerprint?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required" };

  const { error } = await supabase.from("vault_import_mapping_presets").upsert(
    {
      user_id: user.id,
      name: args.name.trim(),
      column_mapping: args.columnMapping,
      header_fingerprint: args.headerFingerprint ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,name" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listVaultImportMappingPresets(
  supabase: SupabaseClient,
): Promise<VaultImportMappingPreset[]> {
  const { data, error } = await supabase
    .from("vault_import_mapping_presets")
    .select("id, name, column_mapping, header_fingerprint")
    .order("updated_at", { ascending: false });
  if (error) {
    console.warn("[vaultImport] list presets", error.message);
    return [];
  }
  return (data ?? []) as VaultImportMappingPreset[];
}
