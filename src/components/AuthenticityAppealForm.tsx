"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { FormEvent, useRef, useState } from "react";
import { FiCheckCircle, FiImage, FiX } from "react-icons/fi";

import { siteDetails } from "@/data/siteDetails";
import { AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES } from "@/lib/authenticityAppealProof";
import { turnstileRequired } from "@/lib/turnstile";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const fieldClass =
  "w-full rounded-lg border border-navy/10 bg-white px-3.5 py-2.5 text-[15px] text-navy font-body shadow-sm placeholder:text-foreground-accent/75 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 disabled:opacity-60 transition-shadow";

const labelClass = "block text-sm font-medium text-navy font-body mb-2";

type FormStatus = "idle" | "submitting" | "success" | "error";

type AuthenticityAppealFormProps = {
  token: string;
  designName: string;
  artistName: string;
};

type ProofPreview = {
  id: string;
  file: File;
  url: string;
};

export function AuthenticityAppealForm({
  token,
  designName,
  artistName,
}: AuthenticityAppealFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [proofs, setProofs] = useState<ProofPreview[]>([]);

  const pinLabel = artistName.trim()
    ? `${designName} by ${artistName}`
    : designName;

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const remaining = AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES - proofs.length;
    if (remaining <= 0) {
      setErrorMessage(`You can add up to ${AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES} photos.`);
      return;
    }

    const additions: ProofPreview[] = [];
    for (const file of Array.from(fileList)) {
      if (additions.length >= remaining) break;
      if (!file.type.startsWith("image/")) continue;
      additions.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      });
    }
    if (additions.length === 0) {
      setErrorMessage("Please choose image files (JPEG, PNG, or WebP).");
      return;
    }
    setErrorMessage("");
    setProofs((prev) => [...prev, ...additions].slice(0, AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeProof(id: string) {
    setProofs((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const messageInput = formRef.current?.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement | null;
    const message = messageInput?.value?.trim() ?? "";
    if (message.length < 3) {
      setErrorMessage("Add a few words about the backstamp, packaging, or where you bought it.");
      return;
    }

    if (turnstileRequired() && !turnstileToken) {
      setErrorMessage("Please complete the security check and try again.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const body = new FormData();
      body.append("token", token);
      body.append("message", message);
      if (turnstileToken) body.append("turnstileToken", turnstileToken);
      for (const proof of proofs) {
        body.append("proofImages", proof.file, proof.file.name);
      }

      const res = await fetch("/api/authenticity-appeal", {
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Could not submit. Please try again.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }
      setProofs((prev) => {
        for (const item of prev) URL.revokeObjectURL(item.url);
        return [];
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(`Could not submit. Please try again or email ${siteDetails.supportEmail}.`);
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-5 sm:p-6 text-center">
        <FiCheckCircle className="mx-auto mb-3 text-secondary" size={36} aria-hidden />
        <h2 className="font-display text-xl text-navy mb-2">Re-review requested</h2>
        <p className="text-[15px] text-foreground-accent leading-relaxed">
          Thanks — we&apos;ll take another look at{" "}
          <span className="text-navy font-medium">{pinLabel}</span>. You&apos;ll get a notification
          in Activity in the Pinporium app when it&apos;s reviewed.
        </p>
      </div>
    );
  }

  const canAddMore = proofs.length < AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <p className="text-[15px] text-foreground-accent leading-relaxed">
        You&apos;re asking us to re-review{" "}
        <span className="text-navy font-medium">{pinLabel}</span> as an authentic original release.
        Backstamp text, packaging, or where you bought it helps most — photos are welcome too.
      </p>

      <div>
        <label htmlFor="appeal-message" className={labelClass}>
          Why this looks authentic
        </label>
        <textarea
          id="appeal-message"
          name="message"
          rows={5}
          required
          minLength={3}
          maxLength={4000}
          disabled={status === "submitting"}
          className={fieldClass}
          placeholder="Backstamp text, packaging, where you bought it, comparison to known originals…"
        />
      </div>

      <div>
        <span className={labelClass}>Photos (optional)</span>
        <p className="text-xs text-foreground-accent leading-relaxed mb-3">
          Backstamp, packaging, or a purchase receipt — whatever helps us take another look. Up to{" "}
          {AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES} images.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
          multiple
          className="hidden"
          disabled={status === "submitting" || !canAddMore}
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <div className="flex flex-wrap gap-2.5">
          {proofs.map((proof) => (
            <div key={proof.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proof.url}
                alt=""
                className="h-20 w-20 rounded-lg border border-navy/10 object-cover bg-cream"
              />
              <button
                type="button"
                onClick={() => removeProof(proof.id)}
                disabled={status === "submitting"}
                aria-label="Remove photo"
                className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white shadow-sm disabled:opacity-60"
              >
                <FiX size={12} aria-hidden />
              </button>
            </div>
          ))}
          {canAddMore ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={status === "submitting"}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-navy/20 bg-cream/60 text-foreground-accent hover:border-secondary/40 disabled:opacity-60"
            >
              <FiImage size={18} aria-hidden />
              <span className="text-[11px] font-body">Add</span>
            </button>
          ) : null}
        </div>
      </div>

      {turnstileSiteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "light" }}
        />
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-secondary px-4 py-3 text-[16px] font-semibold text-white hover:opacity-95 disabled:opacity-60 transition-opacity"
      >
        {status === "submitting" ? "Sending…" : "Request re-review"}
      </button>

      <p className="text-xs text-foreground-accent leading-relaxed text-center">
        Same request as <strong>I think mine is authentic</strong> in the app. Questions?{" "}
        <a href={`mailto:${siteDetails.supportEmail}`} className="text-secondary-ink underline">
          {siteDetails.supportEmail}
        </a>
      </p>
    </form>
  );
}
