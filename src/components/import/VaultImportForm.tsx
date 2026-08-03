"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HiArrowUpTray, HiDocumentArrowDown, HiLink } from "react-icons/hi2";

import { useWebAuth } from "@/components/auth/WebAuthProvider";
import { ImportCard, ImportShell, type ImportStepKey } from "@/components/import/ImportShell";
import {
  formatBetaImportRowCount,
  parseBetaImportRowLimit,
  sliceRowsForBetaLimit,
} from "@/lib/vaultImport/betaImportTools";
import { ImportColumnSelect } from "@/components/import/ImportColumnSelect";
import { ImportReviewPreview } from "@/components/import/ImportReviewPreview";
import { ImportDuplicatesModal } from "@/components/import/ImportDuplicatesModal";
import {
  ImportAuthDivider,
  ImportSocialAuthButtons,
} from "@/components/import/ImportSocialAuthButtons";
import {
  clearOAuthCallbackParams,
  readOAuthCallbackError,
  startImportOAuthSignIn,
  type ImportOAuthProvider,
} from "@/lib/importAuth";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { fetchVaultImportFromLink } from "@/lib/vaultImport/fetchImportLink";
import { normalizeImportLinkInput } from "@/lib/vaultImport/linkSources";
import { parseCsvText } from "@/lib/vaultImport/csvParse";
import {
  applyColumnMapping,
  buildImportHeaderFingerprint,
  canonicalTemplateColumnMapping,
  isCanonicalTemplateHeaders,
  suggestVaultImportColumnMapping,
} from "@/lib/vaultImport/columnMapping";
import { sampleValueForColumn, pickRepresentativeImportRow } from "@/lib/vaultImport/columnSamples";
import { normalizeUniqueColumnMapping, setUniqueColumnMapping } from "@/lib/vaultImport/mappingUi";
import { VAULT_IMPORT_MAPPING_SECTIONS, VAULT_IMPORT_REQUIRED_FIELDS, VAULT_IMPORT_TEMPLATE_CSV } from "@/lib/vaultImport/constants";
import type { VaultImportColumnMapping, VaultImportFieldKey } from "@/lib/vaultImport/types";
import {
  findInFileDuplicateGroups,
  prepareVaultImportRows,
  type DuplicateRowPolicy,
} from "@/lib/vaultImport/validateRows";
import {
  fetchActiveVaultImportJob,
  fetchVaultImportJobStatus,
  listVaultImportMappingPresets,
  revertVaultImportJob,
  saveVaultImportMappingPreset,
  startVaultImportJob,
  type VaultImportMappingPreset,
} from "@/lib/vaultImportService";
import type { VaultImportJobProgress } from "@/lib/vaultImport/types";

const FIELD_LABELS: Record<VaultImportFieldKey, string> = {
  pin_name: "Pin name",
  artist: "Artist",
  collaborating_artists: "Collaborating artists",
  front_image_url: "Front image URL",
  back_image_url: "Back image URL",
  grade: "Grade",
  price_paid: "Price paid",
  personal_value: "Personal value",
  currency: "Currency",
  source: "Source",
  edition: "Edition",
  variant: "Variant",
  metal_finish: "Metal finish",
  enamel_type: "Enamel type",
  num_posts: "Num posts",
  notes: "Notes",
};

const IMAGE_PREVIEW_FIELDS = new Set<VaultImportFieldKey>(["front_image_url", "back_image_url"]);

const STEP_COPY: Record<
  ImportStepKey,
  { title: string; subtitle: string }
> = {
  auth: {
    title: "Sign in to import your vault",
    subtitle:
      "Use the same Pinporium account as the app. Your import runs in the background — open the app when it finishes to review catalog matches.",
  },
  pick: {
    title: "Upload or paste your collection",
    subtitle:
      "CSV file, published Google Sheets link, or public Baserow grid. We import up to 5,000 pins and save your column mapping for next time.",
  },
  map: {
    title: "Map your columns",
    subtitle: "Match each Pinporium field to a column from your file. Required fields are grouped at the top.",
  },
  preview: {
    title: "Review before import",
    subtitle: "Confirm how a sample pin will land in your vault, then start the import job.",
  },
  progress: {
    title: "Import in progress",
    subtitle: "You can close this tab — progress also appears on Home when you open the Pinporium app.",
  },
};

const fieldClass =
  "w-full rounded-lg border border-navy/10 bg-white px-3.5 py-2.5 text-[15px] text-navy font-body shadow-sm placeholder:text-foreground-accent/75 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 disabled:opacity-60";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-deco bg-primary px-5 py-3 text-white font-bold font-body hover:opacity-90 disabled:opacity-60 transition-opacity";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-deco border border-navy/15 bg-white px-5 py-3 text-navy font-bold font-body hover:bg-navy/5 disabled:opacity-60 transition-colors";

const IMPORT_JOB_POLL_MS = 2000;

function resetImportState(setters: {
  setFileName: (v: string) => void;
  setHeaders: (v: string[]) => void;
  setRawRows: (v: Record<string, string>[]) => void;
  setMapping: (v: VaultImportColumnMapping) => void;
  setHeaderFingerprint: (v: string) => void;
  setPresets: (v: VaultImportMappingPreset[]) => void;
  setPresetName: (v: string) => void;
  setActiveJob: (v: VaultImportJobProgress | null) => void;
  setMessage: (v: string) => void;
  setImportRunMeta: (v: { invalidRows: number } | null) => void;
}) {
  setters.setFileName("");
  setters.setHeaders([]);
  setters.setRawRows([]);
  setters.setMapping({});
  setters.setHeaderFingerprint("");
  setters.setPresets([]);
  setters.setPresetName("");
  setters.setActiveJob(null);
  setters.setMessage("");
  setters.setImportRunMeta(null);
}

export function VaultImportForm() {
  const supabaseRef = useRef<SupabaseClient | null>(getSupabaseBrowser());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { session, loading: authLoading, isBetaUser } = useWebAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [oauthBusy, setOauthBusy] = useState<ImportOAuthProvider | null>(null);

  const [step, setStep] = useState<ImportStepKey>("auth");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<VaultImportColumnMapping>({});
  const [headerFingerprint, setHeaderFingerprint] = useState("");
  const [presets, setPresets] = useState<VaultImportMappingPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [activeJob, setActiveJob] = useState<VaultImportJobProgress | null>(null);
  const [betaRowLimitInput, setBetaRowLimitInput] = useState("");
  const [importLink, setImportLink] = useState("");
  const [duplicatePolicyByRowIndex, setDuplicatePolicyByRowIndex] = useState<
    Record<number, DuplicateRowPolicy>
  >({});
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [startingImport, setStartingImport] = useState(false);
  const [importRunMeta, setImportRunMeta] = useState<{ invalidRows: number } | null>(null);

  const supabase = supabaseRef.current;
  const copy = STEP_COPY[step];
  const betaRowLimit = isBetaUser ? parseBetaImportRowLimit(betaRowLimitInput) : null;

  useEffect(() => {
    if (!supabase) {
      setMessage("Import is not configured yet — missing Supabase browser credentials.");
      return;
    }

    const oauthError = readOAuthCallbackError();
    if (oauthError) {
      setAuthError(oauthError);
      clearOAuthCallbackParams();
    }
  }, [supabase]);

  useEffect(() => {
    if (authLoading || !supabase) return;

    if (!session) {
      setStep("auth");
      resetImportState({
        setFileName,
        setHeaders,
        setRawRows,
        setMapping,
        setHeaderFingerprint,
        setPresets,
        setPresetName,
        setActiveJob,
        setMessage,
        setImportRunMeta,
      });
      return;
    }

    void fetchActiveVaultImportJob(supabase).then(job => {
      if (job && (job.status === "pending" || job.status === "processing")) {
        setActiveJob(job);
        setStep("progress");
      } else if (step === "auth") {
        setStep("pick");
      }
    });
  }, [authLoading, session, supabase]); // eslint-disable-line react-hooks/exhaustive-deps -- step only checked on session attach

  useEffect(() => {
    if (!supabase || step !== "map") return;
    void listVaultImportMappingPresets(supabase).then(setPresets);
  }, [step, supabase]);

  useEffect(() => {
    const jobId = activeJob?.id;
    if (!supabase || step !== "progress" || !jobId) return;
    if (activeJob?.status === "completed" || activeJob?.status === "failed") return;

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      const next = await fetchVaultImportJobStatus(supabase, jobId);
      if (cancelled || !next) return next;
      setActiveJob(next);
      return next;
    };

    void poll();

    timer = window.setInterval(() => {
      void poll().then(next => {
        if (next && (next.status === "completed" || next.status === "failed") && timer) {
          window.clearInterval(timer);
          timer = null;
        }
      });
    }, IMPORT_JOB_POLL_MS);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [step, supabase, activeJob?.id, activeJob?.status]);

  const previewRow = useMemo(
    () => pickRepresentativeImportRow(rawRows, mapping) ?? rawRows[0] ?? null,
    [rawRows, mapping],
  );

  const previewRowIndex = useMemo(() => {
    if (!previewRow) return null;
    const index = rawRows.indexOf(previewRow);
    return index >= 0 ? index : 0;
  }, [previewRow, rawRows]);

  const mappedPreview = useMemo(() => {
    if (!previewRow) return null;
    return applyColumnMapping(previewRow, mapping);
  }, [previewRow, mapping]);

  const prepared = useMemo(() => {
    if (step !== "preview") return null;
    return prepareVaultImportRows(rawRows, mapping, {
      duplicatePolicyByRowIndex,
    });
  }, [step, rawRows, mapping, duplicatePolicyByRowIndex]);

  const duplicateGroups = useMemo(() => {
    if (step !== "preview") return [];
    return findInFileDuplicateGroups(rawRows, mapping);
  }, [step, rawRows, mapping]);

  const missingRequired = VAULT_IMPORT_REQUIRED_FIELDS.filter(f => !mapping[f]?.trim());
  const matchedPreset = headerFingerprint
    ? presets.find(p => p.header_fingerprint === headerFingerprint)
    : undefined;

  const columnSamples = useMemo(() => {
    const samples: Record<string, string | null> = {};
    for (const header of headers) {
      samples[header] = sampleValueForColumn(rawRows, header);
    }
    return samples;
  }, [headers, rawRows]);

  const progressPercent =
    activeJob && activeJob.total_rows > 0
      ? Math.min(100, Math.round((activeJob.processed_rows / activeJob.total_rows) * 100))
      : 0;

  const progressIndeterminate =
    !!activeJob &&
    (activeJob.status === "pending" ||
      (activeJob.status === "processing" && activeJob.processed_rows === 0));

  const progressCountLabel =
    activeJob && activeJob.total_rows > 0 && !progressIndeterminate
      ? `${activeJob.processed_rows.toLocaleString()} / ${activeJob.total_rows.toLocaleString()} rows`
      : null;

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setAuthError("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      setStep("pick");
    } finally {
      setBusy(false);
    }
  };

  const handleOAuthSignIn = async (provider: ImportOAuthProvider) => {
    if (!supabase) return;
    setAuthError("");
    setOauthBusy(provider);
    try {
      const result = await startImportOAuthSignIn(supabase, provider);
      if (!result.ok) {
        setAuthError(result.message);
        setOauthBusy(null);
      }
    } catch {
      setAuthError("Could not start sign in. Try again.");
      setOauthBusy(null);
    }
  };

  const authBusy = busy || oauthBusy != null;

  const applyParsedImport = async (args: {
    headers: string[];
    rows: Record<string, string>[];
    fileName: string;
  }) => {
    if (!supabase) return;

    if (args.headers.length === 0 || args.rows.length === 0) {
      setMessage("That source has no rows to import.");
      return;
    }

    const fingerprint = buildImportHeaderFingerprint(args.headers);
    const savedPresets = await listVaultImportMappingPresets(supabase);
    setPresets(savedPresets);
    const savedMatch = savedPresets.find(p => p.header_fingerprint === fingerprint);
    const suggested = savedMatch?.column_mapping
      ? savedMatch.column_mapping
      : isCanonicalTemplateHeaders(args.headers)
        ? canonicalTemplateColumnMapping(args.headers)
        : suggestVaultImportColumnMapping(args.headers);

    setFileName(args.fileName);
    setHeaders(args.headers);
    setRawRows(args.rows);
    setHeaderFingerprint(fingerprint);
    setMapping(normalizeUniqueColumnMapping(suggested, args.headers));
    setStep("map");
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !supabase) return;

    setBusy(true);
    setMessage("");
    try {
      const text = await file.text();
      const parsed = parseCsvText(text);
      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        setMessage("Choose a CSV with a header row and at least one data row.");
        return;
      }
      await applyParsedImport({
        headers: parsed.headers,
        rows: parsed.rows,
        fileName: file.name,
      });
    } catch {
      setMessage("Could not read that file — try another CSV.");
    } finally {
      setBusy(false);
    }
  };

  const handleFetchLink = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    const url = normalizeImportLinkInput(importLink);
    if (!url) {
      setMessage("Paste a published Google Sheets or Baserow link.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const result = await fetchVaultImportFromLink(supabase, url);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      await applyParsedImport({
        headers: result.data.headers,
        rows: result.data.rows,
        fileName: result.data.label,
      });
    } catch {
      setMessage("Could not load that link — try again or upload a CSV.");
    } finally {
      setBusy(false);
    }
  };

  const handleStartImport = async () => {
    if (!supabase) return;
    const result = prepareVaultImportRows(rawRows, mapping, {
      duplicatePolicyByRowIndex,
    });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setStartingImport(true);
    setBusy(true);
    setMessage("");
    setImportRunMeta({ invalidRows: result.invalidRowCount });
    setStep("progress");
    try {
      const rowsToImport = sliceRowsForBetaLimit(result.rows, betaRowLimit);
      const started = await startVaultImportJob(supabase, {
        fileName,
        columnMapping: mapping,
        rows: rowsToImport,
        skippedDuplicateRows: result.skippedDuplicateRows,
      });
      if (!started.ok) {
        setMessage(started.message);
        setStep("preview");
        return;
      }

      setActiveJob({
        id: started.jobId,
        status: "pending",
        file_name: fileName,
        total_rows: started.totalRows,
        processed_rows: 0,
        succeeded_rows: 0,
        failed_rows: 0,
        skipped_duplicate_rows: result.skippedDuplicateRows,
        error_message: null,
        created_at: new Date().toISOString(),
        completed_at: null,
      });

      const job = await fetchVaultImportJobStatus(supabase, started.jobId);
      if (job) {
        setActiveJob(job);
      }
    } finally {
      setBusy(false);
      setStartingImport(false);
    }
  };

  const handleSavePreset = async () => {
    if (!supabase || !presetName.trim()) return;
    setBusy(true);
    try {
      const saved = await saveVaultImportMappingPreset(supabase, {
        name: presetName.trim(),
        columnMapping: mapping,
        headerFingerprint: headerFingerprint || buildImportHeaderFingerprint(headers),
      });
      if (!saved.ok) {
        setMessage(saved.error ?? "Could not save preset.");
        return;
      }
      setPresets(await listVaultImportMappingPresets(supabase));
      setPresetName("");
      setMessage(`Saved preset “${presetName.trim()}”.`);
    } finally {
      setBusy(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([VAULT_IMPORT_TEMPLATE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pinporium-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRevertImport = async () => {
    if (!supabase || !activeJob) return;
    const confirmed = window.confirm(
      "Remove every vault pin from this import job? You can run the import again afterward.",
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage("");
    try {
      const result = await revertVaultImportJob(supabase, activeJob.id);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setMessage(
        `Removed ${result.deletedCount.toLocaleString()} imported pin${result.deletedCount === 1 ? "" : "s"} from your vault.`,
      );
      setActiveJob(null);
      setStep("pick");
    } finally {
      setBusy(false);
    }
  };

  const handleMappingChange = (field: VaultImportFieldKey, header: string | undefined) => {
    setMapping(prev => setUniqueColumnMapping(prev, field, header));
  };

  const handleApplyPreset = (presetMapping: VaultImportColumnMapping) => {
    setMapping(normalizeUniqueColumnMapping(presetMapping, headers));
  };

  if (authLoading) {
    return (
      <ImportShell step="auth" title={STEP_COPY.auth.title} subtitle={STEP_COPY.auth.subtitle}>
        <ImportCard>
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded-deco bg-navy/5" />
            <div className="h-12 rounded-deco bg-navy/5" />
            <div className="h-24 rounded-deco bg-navy/5" />
          </div>
        </ImportCard>
      </ImportShell>
    );
  }

  if (!supabase) {
    return (
      <ImportShell step="auth" title="Import unavailable" subtitle="This tool needs Supabase credentials configured for the web app.">
        <ImportCard>
          <p className="text-red-800 font-body">{message}</p>
        </ImportCard>
      </ImportShell>
    );
  }

  if (!session || step === "auth") {
    return (
      <ImportShell step="auth" title={copy.title} subtitle={copy.subtitle}>
        <ImportCard className="max-w-lg mx-auto">
          <ImportSocialAuthButtons
            busy={authBusy}
            busyProvider={oauthBusy}
            onApple={() => void handleOAuthSignIn("apple")}
            onGoogle={() => void handleOAuthSignIn("google")}
          />

          <ImportAuthDivider />

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="import-email" className="block text-sm font-semibold text-navy mb-2 font-body">
                Email
              </label>
              <input
                id="import-email"
                type="email"
                autoComplete="email"
                className={fieldClass}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={authBusy}
              />
            </div>
            <div>
              <label htmlFor="import-password" className="block text-sm font-semibold text-navy mb-2 font-body">
                Password
              </label>
              <input
                id="import-password"
                type="password"
                autoComplete="current-password"
                className={fieldClass}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={authBusy}
              />
            </div>
            {authError ? (
              <p className="text-sm text-red-700 font-body rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                {authError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={authBusy || !email.trim() || !password}
              className={clsx(primaryBtn, "w-full")}
            >
              {busy ? "Signing in…" : "Sign in with email"}
            </button>
          </form>
        </ImportCard>
      </ImportShell>
    );
  }

  return (
    <ImportShell step={step} title={copy.title} subtitle={copy.subtitle}>
      {message ? (
        <p className="mb-4 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-deco px-4 py-3 font-body">
          {message}
        </p>
      ) : null}

      {step === "pick" ? (
        <ImportCard>
          <button
            type="button"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
            className="group w-full rounded-deco border-2 border-dashed border-gold-deco/40 bg-cream-warm/50 px-6 py-12 text-center transition-colors hover:border-secondary/50 hover:bg-cream-warm disabled:opacity-60"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4 group-hover:bg-secondary/15">
              <HiArrowUpTray className="h-7 w-7" aria-hidden />
            </span>
            <p className="text-lg font-bold text-navy font-display">
              {busy ? "Reading file…" : "Drop a CSV here or click to browse"}
            </p>
            <p className="mt-2 text-sm text-foreground-accent font-body">
              CSV, published Google Sheets, or public Baserow · up to 5,000 rows
            </p>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-navy/10" />
            </div>
            <p className="relative mx-auto w-fit bg-white px-3 text-xs uppercase tracking-deco-wide text-foreground-accent font-body">
              Or paste a link
            </p>
          </div>

          <form onSubmit={handleFetchLink} className="space-y-3">
            <label htmlFor="import-link" className="sr-only">
              Collection link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="import-link"
                type="url"
                inputMode="url"
                placeholder="Google Sheets (published) or Baserow public grid URL"
                value={importLink}
                onChange={e => setImportLink(e.target.value)}
                className={clsx(fieldClass, "flex-1 min-w-0")}
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !importLink.trim()}
                className={clsx(primaryBtn, "sm:shrink-0")}
              >
                <HiLink className="h-5 w-5" aria-hidden />
                {busy ? "Loading…" : "Import from link"}
              </button>
            </div>
            <p className="text-xs text-foreground-accent font-body leading-relaxed">
              Works with published Google Sheets (thumbnail images included) and public Baserow grid views.
              Private edit links need the sheet owner to publish to web first.
            </p>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button type="button" disabled={busy} onClick={() => fileInputRef.current?.click()} className={primaryBtn}>
              Choose CSV file
            </button>
            <button type="button" onClick={downloadTemplate} className={secondaryBtn}>
              <HiDocumentArrowDown className="h-5 w-5" aria-hidden />
              Download template
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
        </ImportCard>
      ) : null}

      {step === "map" ? (
        <ImportCard>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-navy/8">
            <div>
              <p className="font-bold text-navy font-body">{fileName}</p>
              <p className="text-sm text-foreground-accent font-body mt-0.5">
                {rawRows.length.toLocaleString()} rows
                {matchedPreset ? ` · preset “${matchedPreset.name}”` : ""}
              </p>
            </div>
            <button type="button" onClick={() => setStep("pick")} className="text-sm font-semibold text-secondary-ink font-body hover:underline">
              Change source
            </button>
          </div>

          {presets.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.column_mapping)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-sm font-bold font-body transition-colors",
                    preset.id === matchedPreset?.id
                      ? "border-secondary bg-secondary/10 text-secondary-ink"
                      : "border-navy/10 bg-white text-navy hover:bg-navy/5",
                  )}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          ) : null}

          <div className="space-y-8">
            {VAULT_IMPORT_MAPPING_SECTIONS.map(section => (
              <section key={section.id} aria-labelledby={`import-section-${section.id}`}>
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id={`import-section-${section.id}`}
                      className={clsx(
                        "text-sm font-bold uppercase tracking-deco-wide font-body",
                        section.id === "required" ? "text-secondary-ink" : "text-navy",
                      )}
                    >
                      {section.title}
                    </h2>
                    {section.badge ? (
                      <span
                        className={clsx(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold font-body",
                          section.id === "required"
                            ? "uppercase tracking-deco-wide bg-secondary/15 text-secondary-ink"
                            : "uppercase tracking-deco-wide text-foreground-accent bg-navy/6",
                        )}
                      >
                        {section.badge}
                      </span>
                    ) : null}
                  </div>
                  {section.description ? (
                    <p className="mt-1.5 text-sm text-foreground-accent font-body leading-relaxed">
                      {section.description}
                    </p>
                  ) : null}
                </div>

                <div className="divide-y divide-navy/8 rounded-lg border border-navy/8 overflow-hidden">
                  {section.fields.map(field => (
                    <div
                      key={field}
                      className="grid grid-cols-1 sm:grid-cols-[minmax(160px,1fr)_minmax(240px,1.5fr)] gap-2 sm:gap-4 py-3.5 px-3 sm:px-4 items-start sm:items-center bg-white"
                    >
                      <p className="text-sm font-bold text-navy font-body pt-2 sm:pt-0">{FIELD_LABELS[field]}</p>
                      <ImportColumnSelect
                        field={field}
                        mapping={mapping}
                        headers={headers}
                        columnSamples={columnSamples}
                        fieldLabels={FIELD_LABELS}
                        showImagePreview={IMAGE_PREVIEW_FIELDS.has(field)}
                        onChange={handleMappingChange}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {missingRequired.length > 0 ? (
            <p className="mt-4 text-sm text-amber-900 font-body">
              Map required fields: {missingRequired.map(f => FIELD_LABELS[f]).join(", ")}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3 items-end pt-5 border-t border-navy/8">
            <button
              type="button"
              disabled={missingRequired.length > 0}
              onClick={() => setStep("preview")}
              className={primaryBtn}
            >
              Preview mapping
            </button>
            <div className="flex flex-1 min-w-[220px] gap-2 items-center">
              <input
                type="text"
                placeholder="Preset name"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                className={clsx(fieldClass, "flex-1 min-w-0")}
                disabled={missingRequired.length > 0}
              />
              <button
                type="button"
                disabled={!presetName.trim() || missingRequired.length > 0 || busy}
                onClick={() => void handleSavePreset()}
                className={secondaryBtn}
              >
                Save preset
              </button>
            </div>
          </div>
        </ImportCard>
      ) : null}

      {step === "preview" && mappedPreview ? (
        <ImportCard>
          <ImportReviewPreview
            fieldLabels={FIELD_LABELS}
            mapped={mappedPreview}
            sampleIndex={previewRowIndex}
            totalRows={rawRows.length}
          />
          {prepared?.ok ? (
            <p className="mt-4 text-sm text-foreground-accent font-body leading-relaxed">
              Ready to import {formatBetaImportRowCount(prepared.rows.length, betaRowLimit)} rows.
              {duplicateGroups.length > 0 ? (
                <>
                  {" "}
                  We found{" "}
                  <button
                    type="button"
                    onClick={() => setDuplicateModalOpen(true)}
                    className="font-bold text-primary underline underline-offset-2 hover:opacity-80"
                  >
                    {duplicateGroups.length} duplicate group{duplicateGroups.length === 1 ? "" : "s"}
                  </button>
                  {" "}
                  ({prepared.skippedDuplicateRows} matching row
                  {prepared.skippedDuplicateRows === 1 ? "" : "s"} skipped by default
                  {prepared.skippedDuplicateRows > duplicateGroups.length
                    ? "; some groups have more than one extra row"
                    : ""}
                  ). Open the review if you want any extras as separate pins or additional copies.
                </>
              ) : null}
            </p>
          ) : null}
          {prepared?.ok && prepared.invalidRowCount > 0 ? (
            <p className="mt-2 text-sm text-foreground-accent font-body leading-relaxed">
              {prepared.invalidRowCount.toLocaleString()} row
              {prepared.invalidRowCount === 1 ? "" : "s"} with missing pin name/artist or spreadsheet errors
              (like #REF!) will not be imported.
            </p>
          ) : null}
          {isBetaUser ? (
            <div className="mt-4 rounded-lg border border-secondary/25 bg-secondary/5 p-4">
              <p className="text-sm font-bold text-secondary-ink font-body mb-1">Beta test limit</p>
              <p className="text-xs text-foreground-accent font-body mb-3">
                Optional cap on rows to import from this file. Leave blank to import all valid rows.
              </p>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                placeholder="e.g. 10"
                value={betaRowLimitInput}
                onChange={e => setBetaRowLimitInput(e.target.value)}
                className={clsx(fieldClass, "max-w-[160px]")}
              />
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy || startingImport || !prepared?.ok}
              onClick={() => void handleStartImport()}
              className={primaryBtn}
            >
              {startingImport || busy ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Starting import…
                </>
              ) : (
                "Start import"
              )}
            </button>
            <button type="button" onClick={() => setStep("map")} className={secondaryBtn}>
              Edit mapping
            </button>
          </div>
        </ImportCard>
      ) : null}

      {step === "progress" && (activeJob || startingImport) ? (
        <ImportCard className="max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-sm font-bold uppercase tracking-deco-wide text-foreground-accent font-body">
              {activeJob?.status === "completed"
                ? "Complete"
                : activeJob?.status === "failed"
                  ? "Failed"
                  : "Processing"}
            </p>
            <p className="text-sm font-bold text-navy font-body">
              {startingImport && !activeJob
                ? "Starting…"
                : progressCountLabel ??
                  (progressIndeterminate ? "Preparing…" : `${progressPercent}%`)}
            </p>
          </div>
          <div className="h-2.5 rounded-full bg-navy/8 overflow-hidden relative">
            {progressIndeterminate ? (
              <div
                className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-secondary"
                style={{ animation: "import-indeterminate 1.2s ease-in-out infinite" }}
              />
            ) : (
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-500",
                  activeJob?.status === "failed" ? "bg-red-500" : "bg-secondary",
                )}
                style={{ width: `${progressPercent}%` }}
              />
            )}
          </div>

          {progressCountLabel && activeJob?.status === "processing" ? (
            <p className="mt-2 text-xs text-foreground-accent font-body">
              {progressPercent}% complete — keep this tab open or check progress in the app.
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-cream-warm/60 px-3 py-3">
              <p className="text-lg font-bold text-navy font-display">
                {(activeJob?.processed_rows ?? 0).toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body">Processed</p>
            </div>
            <div className="rounded-lg bg-cream-warm/60 px-3 py-3">
              <p className="text-lg font-bold text-secondary-ink font-display">
                {(activeJob?.succeeded_rows ?? 0).toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body">Succeeded</p>
            </div>
            <div className="rounded-lg bg-cream-warm/60 px-3 py-3">
              <p className="text-lg font-bold text-navy font-display">
                {(activeJob?.failed_rows ?? 0).toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body">Failed</p>
            </div>
          </div>

          <p className="text-sm text-foreground-accent font-body mt-6 leading-relaxed">
            {activeJob?.status === "completed"
              ? "Import finished. Open the Pinporium app to finish setup tasks and review suggested catalog links."
              : activeJob?.status === "failed"
                ? "Something went wrong. Try again or contact support if the problem persists."
                : startingImport
                  ? "Starting your import job…"
                  : copy.subtitle}
          </p>

          {activeJob?.status === "completed" && (importRunMeta?.invalidRows ?? 0) > 0 ? (
            <p className="mt-3 text-sm text-foreground-accent font-body leading-relaxed">
              <span className="font-semibold text-navy">
                {importRunMeta!.invalidRows.toLocaleString()} row
                {importRunMeta!.invalidRows === 1 ? "" : "s"}
              </span>{" "}
              were not imported — missing pin name/artist or spreadsheet formula errors (e.g. #REF!).
            </p>
          ) : null}

          {(activeJob?.status === "completed" || activeJob?.status === "failed") &&
          (activeJob?.succeeded_rows ?? 0) > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {activeJob?.status === "completed" ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveJob(null);
                    setStep("pick");
                  }}
                  className={secondaryBtn}
                >
                  Import another file
                </button>
              ) : null}
              <Link href="/import/history" className={secondaryBtn}>
                View import history
              </Link>
              {(activeJob?.succeeded_rows ?? 0) > 0 ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleRevertImport()}
                  className="inline-flex items-center justify-center rounded-deco border border-red-200 bg-red-50 px-5 py-3 text-red-800 font-bold font-body hover:bg-red-100 disabled:opacity-60"
                >
                  {busy ? "Removing…" : "Remove imported pins"}
                </button>
              ) : null}
            </div>
          ) : activeJob?.status === "completed" ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveJob(null);
                  setStep("pick");
                }}
                className={secondaryBtn}
              >
                Import another file
              </button>
              <Link href="/import/history" className={secondaryBtn}>
                View import history
              </Link>
            </div>
          ) : null}
        </ImportCard>
      ) : null}

      <ImportDuplicatesModal
        open={duplicateModalOpen}
        groups={duplicateGroups}
        rawRows={rawRows}
        mapping={mapping}
        fieldLabels={FIELD_LABELS}
        policyByRowIndex={duplicatePolicyByRowIndex}
        onPolicyChange={(rowIndex, policy) =>
          setDuplicatePolicyByRowIndex(prev => ({ ...prev, [rowIndex]: policy }))
        }
        onClose={() => setDuplicateModalOpen(false)}
      />
    </ImportShell>
  );
}
