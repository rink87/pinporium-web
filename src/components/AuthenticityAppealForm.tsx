"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { FormEvent, useRef, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

import { siteDetails } from "@/data/siteDetails";
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

export function AuthenticityAppealForm({
  token,
  designName,
  artistName,
}: AuthenticityAppealFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const pinLabel = artistName.trim()
    ? `${designName} by ${artistName}`
    : designName;

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
      const res = await fetch("/api/authenticity-appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          message,
          turnstileToken: turnstileToken || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Could not submit. Please try again.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Could not submit. Please try again or email help@pinporium.app.");
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

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <p className="text-[15px] text-foreground-accent leading-relaxed">
        You&apos;re asking us to re-review{" "}
        <span className="text-navy font-medium">{pinLabel}</span> as an authentic original release.
        Backstamp text, packaging, or where you bought it helps most.
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
          disabled={status === "submitting"}
          className={fieldClass}
          placeholder="Backstamp text, packaging, where you bought it, comparison to known originals…"
        />
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
        <a href={`mailto:${siteDetails.supportEmail}`} className="text-secondary underline">
          {siteDetails.supportEmail}
        </a>
      </p>
    </form>
  );
}
