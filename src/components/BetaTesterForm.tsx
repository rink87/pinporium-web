"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FiCheckCircle, FiSmartphone } from "react-icons/fi";
import { FormEvent, useRef, useState } from "react";

import {
  PIN_COUNT_OPTIONS,
  validateBetaEmail,
} from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

type FormStatus = "idle" | "submitting" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const fieldClass =
  "w-full rounded-lg border border-navy/10 bg-white px-3.5 py-2.5 text-[15px] text-navy font-body shadow-sm placeholder:text-foreground-accent/50 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 disabled:opacity-60 transition-shadow";

const labelClass = "block text-sm font-medium text-navy font-body mb-2";

function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <span className={labelClass}>
      {children}
      {required ? <span className="text-primary ml-0.5">*</span> : null}
      {optional ? (
        <span className="text-foreground-accent font-normal ml-1">(optional)</span>
      ) : null}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-body font-semibold uppercase tracking-wider text-foreground-accent/90 mb-3">
      {children}
    </p>
  );
}

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
      setErrorMessage("Please confirm you can test on an iPhone.");
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
      setErrorMessage("Complete the security check to continue.");
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
      <div className="text-center py-4 sm:py-6" role="status">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <FiCheckCircle className="h-8 w-8" strokeWidth={1.75} />
        </div>
        <p className="font-display text-2xl text-navy mb-2">You&apos;re on the list</p>
        <p className="text-[15px] text-foreground-accent font-body leading-relaxed max-w-xs mx-auto">
          We&apos;ll email your TestFlight invite when a spot opens. Use the same address as your
          iPhone App Store account.
        </p>
        <p className="mt-3 text-sm text-foreground-accent font-body">
          Questions?{" "}
          <a
            href={`mailto:${siteDetails.supportEmail}`}
            className="text-secondary font-medium hover:underline underline-offset-2"
          >
            {siteDetails.supportEmail}
          </a>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full h-12 rounded-full text-sm font-semibold font-body bg-navy text-cream hover:bg-deco-dark transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="text-left space-y-6" noValidate>
      <div className="flex gap-3 rounded-lg border border-secondary/20 bg-secondary/[0.06] px-4 py-3.5">
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-secondary">
          <FiSmartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-navy font-body">iOS beta (TestFlight)</p>
          <p className="text-sm text-foreground-accent font-body leading-snug mt-0.5">
            Android is coming soon. You&apos;ll need an iPhone to test for now.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading>About you</SectionHeading>

        <label className="block">
          <FieldLabel required>Name</FieldLabel>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            disabled={status === "submitting"}
            className={fieldClass}
            placeholder="Chris Collector"
          />
        </label>

        <label className="block">
          <FieldLabel required>Email</FieldLabel>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            disabled={status === "submitting"}
            onBlur={handleEmailBlur}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "beta-email-error" : "beta-email-hint"}
            className={clsx(
              fieldClass,
              emailError && "border-primary/60 focus:border-primary focus:ring-primary/15",
            )}
            placeholder="you@example.com"
          />
          {emailError ? (
            <p id="beta-email-error" className="mt-2 text-sm text-primary font-body" role="alert">
              {emailError}
            </p>
          ) : (
            <p id="beta-email-hint" className="mt-2 text-sm text-foreground-accent font-body leading-snug">
              Use the email on your iPhone&apos;s App Store account — that&apos;s where TestFlight
              invites go.
            </p>
          )}
        </label>
      </div>

      <label
        className={clsx(
          "flex items-start gap-3.5 rounded-lg border px-4 py-3.5 cursor-pointer transition-colors",
          "border-gold-deco/25 bg-white hover:border-gold-deco/40",
        )}
      >
        <input
          type="checkbox"
          name="iosConfirmed"
          required
          disabled={status === "submitting"}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-navy/20 text-secondary focus:ring-secondary/30"
        />
        <span className="text-[15px] text-navy font-body leading-snug">
          I have an iPhone and can install Pinporium through TestFlight when invited.
        </span>
      </label>

      <div className="space-y-4">
        <SectionHeading>Your collection</SectionHeading>

        <label className="block">
          <FieldLabel required>How many pins do you collect?</FieldLabel>
          <select
            name="pinCount"
            required
            defaultValue=""
            disabled={status === "submitting"}
            className={clsx(fieldClass, "appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat")}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23524e5f'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="" disabled>
              Choose a range
            </option>
            {PIN_COUNT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <FieldLabel optional>Why do you want in?</FieldLabel>
          <textarea
            name="why"
            rows={3}
            maxLength={2000}
            disabled={status === "submitting"}
            className={clsx(fieldClass, "resize-none min-h-[96px]")}
            placeholder="What you collect, if you trade, what you want from Pinporium…"
          />
        </label>
      </div>

      <label className="sr-only" aria-hidden="true">
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>

      {turnstileSiteKey ? (
        <div className="w-full min-h-[65px] [&_iframe]:w-full">
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
            options={{ theme: "light", size: "flexible" }}
            className="w-full"
          />
        </div>
      ) : null}

      {errorMessage ? (
        <div
          className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-primary font-body"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="space-y-3 pt-4 border-t border-gold-deco/15">
        <button
          type="submit"
          disabled={status === "submitting" || (Boolean(turnstileSiteKey) && !turnstileToken)}
          className={clsx(
            "w-full h-12 rounded-full text-sm font-semibold font-body transition-colors",
            "bg-navy text-cream hover:bg-deco-dark",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {status === "submitting" ? "Sending…" : "Submit application"}
        </button>
        <button
          type="button"
          disabled={status === "submitting"}
          onClick={onClose}
          className="w-full py-2 text-sm font-body text-foreground-accent hover:text-navy transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BetaTesterForm;
