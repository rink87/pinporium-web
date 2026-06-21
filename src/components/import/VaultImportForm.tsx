"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HiArrowUpTray, HiDocumentArrowDown } from "react-icons/hi2";

import { useWebAuth } from "@/components/auth/WebAuthProvider";
import { ImportCard, ImportShell, type ImportStepKey } from "@/components/import/ImportShell";
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
import { parseCsvText } from "@/lib/vaultImport/csvParse";
import {
  applyColumnMapping,
  buildImportHeaderFingerprint,
  canonicalTemplateColumnMapping,
  isCanonicalTemplateHeaders,
  suggestVaultImportColumnMapping,
} from "@/lib/vaultImport/columnMapping";
import { VAULT_IMPORT_REQUIRED_FIELDS, VAULT_IMPORT_TEMPLATE_CSV } from "@/lib/vaultImport/constants";
import type { VaultImportColumnMapping, VaultImportFieldKey } from "@/lib/vaultImport/types";
import { prepareVaultImportRows } from "@/lib/vaultImport/validateRows";
import {
  fetchActiveVaultImportJob,
  fetchVaultImportJobStatus,
  listVaultImportMappingPresets,
  saveVaultImportMappingPreset,
  startVaultImportJob,
  type VaultImportMappingPreset,
} from "@/lib/vaultImportService";
import type { VaultImportJobProgress } from "@/lib/vaultImport/types";

const FIELD_LABELS: Record<VaultImportFieldKey, string> = {
  pin_name: "Pin name *",
  artist: "Artist *",
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
  num_posts: "Num posts",
  notes: "Notes",
};

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
    title: "Upload your spreadsheet",
    subtitle:
      "CSV from Pinventory, Airtable, or your own export. We import up to 5,000 pins and save your column mapping for next time.",
  },
  map: {
    title: "Map your columns",
    subtitle: "Match each Pinporium field to a column in your file. Required fields are marked with an asterisk.",
  },
  preview: {
    title: "Review before import",
    subtitle: "Here is how your first row will land in the vault. Start the job when everything looks right.",
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
}

export function VaultImportForm() {
  const supabaseRef = useRef<SupabaseClient | null>(getSupabaseBrowser());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { session, loading: authLoading } = useWebAuth();

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

  const supabase = supabaseRef.current;
  const copy = STEP_COPY[step];

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
    if (!supabase || step !== "progress" || !activeJob) return;
    if (activeJob.status === "completed" || activeJob.status === "failed") return;

    const timer = window.setInterval(() => {
      void fetchVaultImportJobStatus(supabase, activeJob.id).then(next => {
        if (next) setActiveJob(next);
      });
    }, 4000);

    return () => window.clearInterval(timer);
  }, [activeJob, step, supabase]);

  const previewRow = rawRows[0];
  const mappedPreview = useMemo(() => {
    if (!previewRow) return null;
    return applyColumnMapping(previewRow, mapping);
  }, [previewRow, mapping]);

  const prepared = useMemo(() => {
    if (step !== "preview") return null;
    return prepareVaultImportRows(rawRows, mapping);
  }, [step, rawRows, mapping]);

  const missingRequired = VAULT_IMPORT_REQUIRED_FIELDS.filter(f => !mapping[f]?.trim());
  const matchedPreset = headerFingerprint
    ? presets.find(p => p.header_fingerprint === headerFingerprint)
    : undefined;

  const progressPercent =
    activeJob && activeJob.total_rows > 0
      ? Math.min(100, Math.round((activeJob.processed_rows / activeJob.total_rows) * 100))
      : 0;

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

      const fingerprint = buildImportHeaderFingerprint(parsed.headers);
      const savedPresets = await listVaultImportMappingPresets(supabase);
      setPresets(savedPresets);
      const savedMatch = savedPresets.find(p => p.header_fingerprint === fingerprint);
      const suggested = savedMatch?.column_mapping
        ? savedMatch.column_mapping
        : isCanonicalTemplateHeaders(parsed.headers)
          ? canonicalTemplateColumnMapping(parsed.headers)
          : suggestVaultImportColumnMapping(parsed.headers);

      setFileName(file.name);
      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setHeaderFingerprint(fingerprint);
      setMapping(suggested);
      setStep("map");
    } catch {
      setMessage("Could not read that file — try another CSV.");
    } finally {
      setBusy(false);
    }
  };

  const handleStartImport = async () => {
    if (!supabase) return;
    const result = prepareVaultImportRows(rawRows, mapping);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const started = await startVaultImportJob(supabase, {
        fileName,
        columnMapping: mapping,
        rows: result.rows,
        skippedDuplicateRows: result.skippedDuplicateRows,
      });
      if (!started.ok) {
        setMessage(started.message);
        return;
      }
      const job = await fetchVaultImportJobStatus(supabase, started.jobId);
      if (job) {
        setActiveJob(job);
        setStep("progress");
      }
    } finally {
      setBusy(false);
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
              Pinventory, Airtable, or Pinporium template · up to 5,000 rows
            </p>
          </button>

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
              Change file
            </button>
          </div>

          {presets.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setMapping(preset.column_mapping)}
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

          <div className="space-y-5 max-h-[min(52vh,520px)] overflow-y-auto pr-1">
            {(Object.keys(FIELD_LABELS) as VaultImportFieldKey[]).map(field => (
              <div key={field} className="rounded-lg border border-navy/8 bg-cream-warm/30 p-4">
                <p className="text-sm font-bold text-navy font-body mb-3">{FIELD_LABELS[field]}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMapping(prev => ({ ...prev, [field]: undefined }))}
                    className={clsx(
                      "rounded-full border px-3 py-1 text-sm font-body transition-colors",
                      !mapping[field] ? "border-secondary bg-secondary/10 text-secondary-ink" : "border-navy/10 bg-white",
                    )}
                  >
                    —
                  </button>
                  {headers.map(header => (
                    <button
                      key={`${field}-${header}`}
                      type="button"
                      onClick={() => setMapping(prev => ({ ...prev, [field]: header }))}
                      className={clsx(
                        "rounded-full border px-3 py-1 text-sm font-body transition-colors",
                        mapping[field] === header
                          ? "border-secondary bg-secondary/10 text-secondary-ink"
                          : "border-navy/10 bg-white hover:bg-white/80",
                      )}
                    >
                      {header}
                    </button>
                  ))}
                </div>
              </div>
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
          <div className="rounded-lg border border-navy/10 bg-cream-warm/40 p-5 space-y-2 text-sm font-body text-navy">
            {(Object.keys(FIELD_LABELS) as VaultImportFieldKey[]).map(field => {
              const value = mappedPreview[field]?.trim();
              if (!value) return null;
              return (
                <p key={field}>
                  <span className="font-bold">{FIELD_LABELS[field].replace(" *", "")}: </span>
                  {value}
                </p>
              );
            })}
          </div>
          {prepared?.ok ? (
            <p className="mt-4 text-sm text-foreground-accent font-body">
              Ready to import {prepared.rows.length.toLocaleString()} rows
              {prepared.skippedDuplicateRows > 0
                ? ` (${prepared.skippedDuplicateRows} in-file duplicates will be skipped)`
                : ""}
              .
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy || !prepared?.ok}
              onClick={() => void handleStartImport()}
              className={primaryBtn}
            >
              {busy ? "Starting…" : "Start import"}
            </button>
            <button type="button" onClick={() => setStep("map")} className={secondaryBtn}>
              Edit mapping
            </button>
          </div>
        </ImportCard>
      ) : null}

      {step === "progress" && activeJob ? (
        <ImportCard className="max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-sm font-bold uppercase tracking-deco-wide text-foreground-accent font-body">
              {activeJob.status === "completed"
                ? "Complete"
                : activeJob.status === "failed"
                  ? "Failed"
                  : "Processing"}
            </p>
            <p className="text-sm font-bold text-navy font-body">{progressPercent}%</p>
          </div>
          <div className="h-2.5 rounded-full bg-navy/8 overflow-hidden">
            <div
              className={clsx(
                "h-full rounded-full transition-all duration-500",
                activeJob.status === "failed" ? "bg-red-500" : "bg-secondary",
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-cream-warm/60 px-3 py-3">
              <p className="text-lg font-bold text-navy font-display">{activeJob.processed_rows.toLocaleString()}</p>
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body">Processed</p>
            </div>
            <div className="rounded-lg bg-cream-warm/60 px-3 py-3">
              <p className="text-lg font-bold text-secondary-ink font-display">{activeJob.succeeded_rows.toLocaleString()}</p>
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body">Succeeded</p>
            </div>
            <div className="rounded-lg bg-cream-warm/60 px-3 py-3">
              <p className="text-lg font-bold text-navy font-display">{activeJob.failed_rows.toLocaleString()}</p>
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body">Failed</p>
            </div>
          </div>

          <p className="text-sm text-foreground-accent font-body mt-6 leading-relaxed">
            {activeJob.status === "completed"
              ? "Import finished. Open the Pinporium app to finish setup tasks and review suggested catalog links."
              : activeJob.status === "failed"
                ? "Something went wrong. Try again or contact support if the problem persists."
                : copy.subtitle}
          </p>

          {activeJob.status === "completed" ? (
            <button
              type="button"
              onClick={() => {
                setActiveJob(null);
                setStep("pick");
              }}
              className={clsx(secondaryBtn, "mt-6")}
            >
              Import another file
            </button>
          ) : null}
        </ImportCard>
      ) : null}
    </ImportShell>
  );
}
