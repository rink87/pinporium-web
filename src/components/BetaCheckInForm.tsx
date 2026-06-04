"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FiCheckCircle } from "react-icons/fi";
import { FormEvent, useRef, useState } from "react";

import {
  BETA_CHECK_IN_REASONS,
  type BetaCheckInReason,
} from "@/lib/betaCheckIn";
import {
  BETA_PLATFORM_OPTIONS,
  type BetaPlatform,
  validateBetaEmail,
} from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";
import { turnstileRequired } from "@/lib/turnstile";

type FormStatus = "idle" | "submitting" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const fieldClass =
  "w-full rounded-lg border border-navy/10 bg-white px-3.5 py-2.5 text-[15px] text-navy font-body shadow-sm placeholder:text-foreground-accent/75 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 disabled:opacity-60 transition-shadow";

const labelClass = "block text-sm font-medium text-navy font-body mb-2";

type BetaCheckInFormProps = {
  initialReason: BetaCheckInReason | null;
  initialEmail: string;
  initialPlatform: BetaPlatform | null;
};

export function BetaCheckInForm({
  initialReason,
  initialEmail,
  initialPlatform,
}: BetaCheckInFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [reason, setReason] = useState<BetaCheckInReason | "">(initialReason ?? "");
  const [platform, setPlatform] = useState<BetaPlatform | "">(initialPlatform ?? "");

  function validateForm(): boolean {
    const emailInput = formRef.current?.elements.namedItem("email") as HTMLInputElement | null;
    const emailVal = emailInput?.value ?? "";
    const err = validateBetaEmail(emailVal);
    setEmailError(err ?? "");
    if (err) {
      return false;
    }
    if (!reason) {
      setErrorMessage("Please choose what best describes your situation.");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") {
      return;
    }
    if (!validateForm()) {
      return;
    }

    if (turnstileRequired() && !turnstileToken) {
      setErrorMessage("Please complete the security check and try again.");
      return;
    }

    const form = formRef.current;
    if (!form) {
      return;
    }

    const fd = new FormData(form);
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/beta-check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          reason,
          platform: platform || undefined,
          details: fd.get("details"),
          turnstileToken,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-secondary/25 bg-secondary/5 p-6 text-center">
        <FiCheckCircle className="mx-auto mb-3 text-secondary" size={40} aria-hidden />
        <h2 className="font-display text-xl text-navy mb-2">Thanks — we got it</h2>
        <p className="text-[15px] text-foreground-accent leading-relaxed">
          Your note helps us improve the beta. If you&apos;re ready to try Pinporium, use the install
          link from your welcome email, or reply to{" "}
          <a href={`mailto:${siteDetails.supportEmail}`} className="text-secondary-ink font-semibold underline">
            {siteDetails.supportEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="check-in-email" className={labelClass}>
          Email <span className="text-primary-ink">*</span>
        </label>
        <input
          id="check-in-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={initialEmail}
          className={clsx(fieldClass, emailError && "border-primary-ink/50")}
          placeholder="Same address you used to apply"
          disabled={status === "submitting"}
        />
        {emailError ? (
          <p className="mt-2 text-sm text-primary-ink font-body" role="alert">
            {emailError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="check-in-name" className={labelClass}>
          Name <span className="text-foreground-accent font-normal">(optional)</span>
        </label>
        <input
          id="check-in-name"
          name="name"
          type="text"
          autoComplete="name"
          className={fieldClass}
          disabled={status === "submitting"}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>What&apos;s going on? <span className="text-primary-ink">*</span></legend>
        <div className="space-y-2">
          {BETA_CHECK_IN_REASONS.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                reason === option.value
                  ? "border-secondary/40 bg-secondary/5"
                  : "border-navy/10 bg-white hover:border-navy/20",
              )}
            >
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="mt-1"
                disabled={status === "submitting"}
              />
              <span className="text-[15px] text-navy leading-snug">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <span className={labelClass}>Platform <span className="text-foreground-accent font-normal">(optional)</span></span>
        <div className="flex flex-wrap gap-2">
          {BETA_PLATFORM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPlatform((p) => (p === opt.value ? "" : opt.value))}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-body font-semibold transition-colors",
                platform === opt.value
                  ? "border-secondary bg-secondary text-white"
                  : "border-navy/15 bg-white text-navy hover:border-navy/25",
              )}
              disabled={status === "submitting"}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="check-in-details" className={labelClass}>
          Anything else? <span className="text-foreground-accent font-normal">(optional)</span>
        </label>
        <textarea
          id="check-in-details"
          name="details"
          rows={4}
          className={clsx(fieldClass, "resize-y min-h-[100px]")}
          placeholder="Install error message, device model, etc."
          disabled={status === "submitting"}
        />
      </div>

      {turnstileSiteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "light", size: "normal" }}
        />
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-primary-ink font-body" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-secondary py-3.5 text-[16px] font-display font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-60 transition"
      >
        {status === "submitting" ? "Sending…" : "Send check-in"}
      </button>
    </form>
  );
}
