"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";

import {
  PIN_COUNT_OPTIONS,
  validateBetaEmail,
} from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

type FormStatus = "idle" | "submitting" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface BetaTesterFormProps {
  onClose: () => void;
}

const BetaTesterForm: React.FC<BetaTesterFormProps> = ({ onClose }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  function validateForm(): boolean {
    const form = formRef.current;
    if (!form) {
      return false;
    }

    if (!form.reportValidity()) {
      return false;
    }

    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const err = validateBetaEmail(email);
    setEmailError(err ?? "");
    if (err) {
      return false;
    }

    if (data.get("iosConfirmed") !== "on") {
      setErrorMessage("Please confirm you can test on an iPhone. Android is coming soon.");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  function handleEmailBlur(event: React.FocusEvent<HTMLInputElement>) {
    const err = validateBetaEmail(event.target.value);
    setEmailError(err ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage("Please complete the security check below.");
      return;
    }

    const form = formRef.current;
    if (!form) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const data = new FormData(form);

    try {
      const res = await fetch("/api/beta-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          pinCount: data.get("pinCount"),
          why: data.get("why"),
          company: data.get("company"),
          iosConfirmed: data.get("iosConfirmed") === "on",
          turnstileToken,
        }),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }

      setStatus("success");
      form.reset();
      setEmailError("");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  if (status === "success") {
    return (
      <div role="status">
        <p className="font-display text-xl text-navy mb-2">You&apos;re on the list</p>
        <p className="text-foreground-accent font-body leading-relaxed">
          Thanks for applying. We&apos;ll send a TestFlight invite to the email you provided when a
          spot opens. Use the same email you use for the App Store on your iPhone. Questions?{" "}
          <a
            href={`mailto:${siteDetails.supportEmail}`}
            className="text-primary underline underline-offset-2 hover:text-primary-accent"
          >
            {siteDetails.supportEmail}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full sm:w-auto min-w-[180px] px-8 h-12 rounded-full text-sm uppercase tracking-deco font-body bg-primary text-cream hover:bg-primary-accent"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="text-left space-y-4" noValidate>
      <div className="rounded-xl border border-gold-deco/25 bg-cream-warm/80 px-4 py-3">
        <p className="text-sm text-navy font-body leading-relaxed">
          <strong className="font-semibold">Beta is iOS only right now</strong> (TestFlight).
          Android is coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-1.5 block">
            Name <span className="text-primary">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-gold-deco/25 bg-white px-4 py-3 text-navy font-body placeholder:text-foreground-accent/60 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-1.5 block">
            Email <span className="text-primary">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            disabled={status === "submitting"}
            onBlur={handleEmailBlur}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "beta-email-error" : undefined}
            className={clsx(
              "w-full rounded-xl border bg-white px-4 py-3 text-navy font-body placeholder:text-foreground-accent/60 focus:outline-none focus:ring-2 disabled:opacity-60",
              emailError
                ? "border-primary focus:ring-primary/40"
                : "border-gold-deco/25 focus:ring-gold/50",
            )}
            placeholder="you@example.com"
          />
          {emailError ? (
            <p id="beta-email-error" className="mt-1.5 text-sm text-primary font-body" role="alert">
              {emailError}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-foreground-accent font-body">
              Use the email tied to your iPhone App Store account — that&apos;s where we send
              TestFlight invites.
            </p>
          )}
        </label>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="iosConfirmed"
          required
          disabled={status === "submitting"}
          className="mt-1 h-4 w-4 rounded border-gold-deco/40 text-primary focus:ring-gold/50"
        />
        <span className="text-sm text-navy font-body leading-relaxed">
          I can test Pinporium on an <strong>iPhone</strong> via TestFlight when invited. I
          understand Android isn&apos;t available yet.
        </span>
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-1.5 block">
          Approximate number of pins <span className="text-primary">*</span>
        </span>
        <select
          name="pinCount"
          required
          defaultValue=""
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-gold-deco/25 bg-white px-4 py-3 text-navy font-body focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
        >
          <option value="" disabled>
            Select a range
          </option>
          {PIN_COUNT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-1.5 block">
          Why do you want to beta test? <span className="text-foreground-accent/70">(optional)</span>
        </span>
        <textarea
          name="why"
          rows={3}
          maxLength={2000}
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-gold-deco/25 bg-white px-4 py-3 text-navy font-body placeholder:text-foreground-accent/60 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60 resize-y min-h-[88px]"
          placeholder="What you collect, whether you trade, what you're hoping Pinporium helps with…"
        />
      </label>

      <label className="sr-only" aria-hidden="true">
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>

      {turnstileSiteKey ? (
        <div className="flex justify-center min-h-[65px]">
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
            options={{ theme: "light", size: "normal" }}
          />
        </div>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-primary font-body" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={status === "submitting"}
          onClick={onClose}
          className="px-6 py-3 rounded-full text-sm font-body text-navy border border-gold-deco/40 hover:bg-cream-warm disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === "submitting" || (Boolean(turnstileSiteKey) && !turnstileToken)}
          className={clsx(
            "px-8 py-3 rounded-full text-sm uppercase tracking-deco font-body",
            "bg-primary text-cream hover:bg-primary-accent disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {status === "submitting" ? "Sending…" : "Submit application"}
        </button>
      </div>
    </form>
  );
};

export default BetaTesterForm;
