"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HiChevronDown, HiClock } from "react-icons/hi2";

import type { VaultImportJobSummary } from "@/lib/vaultImport/types";
import {
  fetchImportJobFailedRows,
  listVaultImportJobs,
  revertVaultImportJob,
} from "@/lib/vaultImportService";

function formatImportWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: VaultImportJobSummary["status"]): string {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-900 border-emerald-200";
    case "failed":
      return "bg-red-50 text-red-900 border-red-200";
    case "processing":
    case "pending":
      return "bg-amber-50 text-amber-900 border-amber-200";
    default:
      return "bg-navy/5 text-navy/70 border-navy/10";
  }
}

function statusLabel(job: VaultImportJobSummary): string {
  if (job.reverted) return "Reverted";
  if (job.status === "completed") return "Completed";
  if (job.status === "failed") return "Failed";
  if (job.status === "processing") return "Processing";
  if (job.status === "pending") return "Pending";
  return "Cancelled";
}

export function ImportHistoryPanel({
  supabase,
  refreshKey = 0,
  className = "",
  showEmptyState = false,
  onReverted,
}: {
  supabase: SupabaseClient;
  refreshKey?: number;
  className?: string;
  showEmptyState?: boolean;
  onReverted?: (jobId: string, deletedCount: number) => void;
}) {
  const [jobs, setJobs] = useState<VaultImportJobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [failedRowsByJob, setFailedRowsByJob] = useState<
    Record<string, Awaited<ReturnType<typeof fetchImportJobFailedRows>>>
  >({});
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const next = await listVaultImportJobs(supabase);
    setJobs(next);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs, refreshKey]);

  const toggleExpanded = async (job: VaultImportJobSummary) => {
    if (expandedJobId === job.id) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(job.id);
    if (job.failed_rows > 0 && !failedRowsByJob[job.id]) {
      const rows = await fetchImportJobFailedRows(supabase, job.id);
      setFailedRowsByJob(prev => ({ ...prev, [job.id]: rows }));
    }
  };

  const handleRevert = async (job: VaultImportJobSummary) => {
    const confirmed = window.confirm(
      `Remove ${job.pins_remaining.toLocaleString()} vault pin${job.pins_remaining === 1 ? "" : "s"} from this import? You can run the import again afterward.`,
    );
    if (!confirmed) return;

    setBusyJobId(job.id);
    setMessage("");
    try {
      const result = await revertVaultImportJob(supabase, job.id);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setMessage(
        `Removed ${result.deletedCount.toLocaleString()} imported pin${result.deletedCount === 1 ? "" : "s"}.`,
      );
      onReverted?.(job.id, result.deletedCount);
      await loadJobs();
    } finally {
      setBusyJobId(null);
    }
  };

  if (loading) {
    return (
      <div className={clsx("rounded-deco border border-gold-deco/25 bg-white/90 p-6", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 rounded bg-navy/5" />
          <div className="h-16 rounded-deco bg-navy/5" />
          <div className="h-16 rounded-deco bg-navy/5" />
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className={clsx("rounded-deco border border-gold-deco/25 bg-white/90 p-8 md:p-10 text-center", className)}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy mb-4">
          <HiClock className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="text-xl font-display font-bold text-navy">No imports yet</h2>
        <p className="mt-2 text-sm text-foreground-accent font-body leading-relaxed max-w-md mx-auto">
          When you import a spreadsheet, it will show up here with results and revert options.
        </p>
        <Link
          href="/import"
          className="mt-6 inline-flex items-center justify-center rounded-deco bg-primary px-5 py-3 text-white font-bold font-body hover:opacity-90"
        >
          Start a new import
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx("rounded-deco border border-gold-deco/25 bg-white/90 p-6 md:p-7", className)}>
      <div className="flex items-start gap-3 mb-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy">
          <HiClock className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-display font-bold text-navy">Your imports</h2>
          <p className="mt-1 text-sm text-foreground-accent font-body leading-relaxed">
            Expand an import for failed row details or to remove its pins from your vault.
          </p>
        </div>
      </div>

      {message ? (
        <p className="mb-4 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-deco px-4 py-3 font-body">
          {message}
        </p>
      ) : null}

      <ul className="space-y-3">
        {jobs.map(job => {
          const expanded = expandedJobId === job.id;
          const failedRows = failedRowsByJob[job.id] ?? [];
          const sourceLabel = job.file_name?.trim() || "Untitled import";

          return (
            <li key={job.id} className="rounded-deco border border-navy/10 overflow-hidden">
              <button
                type="button"
                onClick={() => void toggleExpanded(job)}
                className="w-full px-4 py-4 text-left hover:bg-cream-warm/40 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-navy font-body truncate">{sourceLabel}</p>
                    <p className="mt-1 text-sm text-foreground-accent font-body">
                      {formatImportWhen(job.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={clsx(
                        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-deco-wide font-body",
                        job.reverted
                          ? "bg-navy/5 text-navy/70 border-navy/10"
                          : statusBadgeClass(job.status),
                      )}
                    >
                      {statusLabel(job)}
                    </span>
                    <HiChevronDown
                      className={clsx("h-5 w-5 text-navy/50 transition-transform", expanded && "rotate-180")}
                      aria-hidden
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="rounded-lg bg-cream-warm/60 px-3 py-2">
                    <p className="text-base font-bold text-navy font-display">{job.succeeded_rows}</p>
                    <p className="text-[11px] uppercase tracking-deco-wide text-foreground-accent font-body">
                      Imported
                    </p>
                  </div>
                  <div className="rounded-lg bg-cream-warm/60 px-3 py-2">
                    <p className="text-base font-bold text-navy font-display">{job.failed_rows}</p>
                    <p className="text-[11px] uppercase tracking-deco-wide text-foreground-accent font-body">
                      Failed
                    </p>
                  </div>
                  <div className="rounded-lg bg-cream-warm/60 px-3 py-2">
                    <p className="text-base font-bold text-navy font-display">{job.skipped_duplicate_rows}</p>
                    <p className="text-[11px] uppercase tracking-deco-wide text-foreground-accent font-body">
                      Skipped
                    </p>
                  </div>
                  <div className="rounded-lg bg-cream-warm/60 px-3 py-2">
                    <p className="text-base font-bold text-navy font-display">{job.pins_remaining}</p>
                    <p className="text-[11px] uppercase tracking-deco-wide text-foreground-accent font-body">
                      In vault
                    </p>
                  </div>
                </div>
              </button>

              {expanded ? (
                <div className="border-t border-navy/8 bg-cream-warm/25 px-4 py-4 space-y-4">
                  {job.error_message ? (
                    <p className="text-sm text-red-800 font-body leading-relaxed">{job.error_message}</p>
                  ) : null}

                  {job.failed_rows > 0 ? (
                    <div>
                      <p className="text-sm font-bold text-navy font-body mb-2">Failed rows</p>
                      {failedRows.length === 0 ? (
                        <p className="text-sm text-foreground-accent font-body">Loading row details…</p>
                      ) : (
                        <ul className="space-y-2">
                          {failedRows.map(row => (
                            <li
                              key={row.row_number}
                              className="rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-body"
                            >
                              <span className="font-semibold text-navy">
                                Row {row.row_number}
                                {row.pin_name ? `: ${row.pin_name}` : ""}
                              </span>
                              {row.error_message ? (
                                <span className="text-foreground-accent"> — {row.error_message}</span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}

                  {job.pins_remaining > 0 ? (
                    <button
                      type="button"
                      disabled={busyJobId === job.id}
                      onClick={() => void handleRevert(job)}
                      className="inline-flex items-center justify-center rounded-deco border border-red-200 bg-red-50 px-4 py-2.5 text-red-800 font-bold font-body hover:bg-red-100 disabled:opacity-60"
                    >
                      {busyJobId === job.id
                        ? "Removing…"
                        : `Remove ${job.pins_remaining.toLocaleString()} imported pin${job.pins_remaining === 1 ? "" : "s"}`}
                    </button>
                  ) : job.reverted ? (
                    <p className="text-sm text-foreground-accent font-body">
                      These pins were removed from your vault.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
