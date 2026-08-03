import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  StartVaultImportResult,
  VaultImportColumnMapping,
  VaultImportJobProgress,
  VaultImportJobSummary,
  VaultImportNormalizedRow,
  VaultImportStagedRowFailure,
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

/** Delete vault rows created by an import job (beta testing / undo). */
export async function listVaultImportJobs(
  supabase: SupabaseClient,
  limit = 25,
): Promise<VaultImportJobSummary[]> {
  const { data: jobs, error } = await supabase
    .from("vault_import_jobs")
    .select(
      "id, status, file_name, total_rows, processed_rows, succeeded_rows, failed_rows, skipped_duplicate_rows, error_message, created_at, completed_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[vaultImport] list jobs", error.message);
    return [];
  }

  const rows = (jobs ?? []) as Record<string, unknown>[];
  const jobIds = rows.map(row => String(row.id));
  const pinCounts = new Map<string, number>();

  if (jobIds.length > 0) {
    const { data: items, error: countError } = await supabase
      .from("collection_items")
      .select("import_job_id")
      .in("import_job_id", jobIds);

    if (countError) {
      console.warn("[vaultImport] list job pin counts", countError.message);
    } else {
      for (const item of items ?? []) {
        const jobId = item.import_job_id as string | null;
        if (!jobId) continue;
        pinCounts.set(jobId, (pinCounts.get(jobId) ?? 0) + 1);
      }
    }
  }

  return rows
    .map(row => {
      const progress = parseJobProgress(row);
      if (!progress) return null;
      const pinsRemaining = pinCounts.get(progress.id) ?? 0;
      return {
        ...progress,
        pins_remaining: pinsRemaining,
        reverted: progress.succeeded_rows > 0 && pinsRemaining === 0,
      };
    })
    .filter((job): job is VaultImportJobSummary => job !== null);
}

export async function fetchImportJobFailedRows(
  supabase: SupabaseClient,
  jobId: string,
): Promise<VaultImportStagedRowFailure[]> {
  const { data, error } = await supabase
    .from("vault_import_staged_rows")
    .select("row_number, error_code, error_message, normalized_row")
    .eq("import_job_id", jobId)
    .eq("status", "failed")
    .order("row_number", { ascending: true });

  if (error) {
    console.warn("[vaultImport] fetch failed rows", error.message);
    return [];
  }

  return (data ?? []).map(row => {
    const normalized = row.normalized_row as { pin_name?: string } | null;
    return {
      row_number: Number(row.row_number),
      error_code: typeof row.error_code === "string" ? row.error_code : null,
      error_message: typeof row.error_message === "string" ? row.error_message : null,
      pin_name: typeof normalized?.pin_name === "string" ? normalized.pin_name : null,
    };
  });
}

export async function revertVaultImportJob(
  supabase: SupabaseClient,
  jobId: string,
): Promise<{ ok: true; deletedCount: number } | { ok: false; message: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in required" };

  const { data, error } = await supabase
    .from("collection_items")
    .delete()
    .eq("import_job_id", jobId)
    .eq("user_id", user.id)
    .select("id");

  if (error) return { ok: false, message: error.message };
  return { ok: true, deletedCount: data?.length ?? 0 };
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
