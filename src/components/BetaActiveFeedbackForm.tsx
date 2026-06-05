"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FiCheckCircle } from "react-icons/fi";
import { FormEvent, useRef, useState } from "react";

import {
  BETA_ACTIVE_FEATURES_USED,
  BETA_FLOW_EXPERIENCE_OPTIONS,
  type BetaActiveFeatureUsed,
  type BetaFlowExperience,
} from "@/lib/betaActiveFeedback";
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
const sectionClass = "font-display text-lg text-navy mb-1";
const hintClass = "text-sm text-foreground-accent mb-3 leading-relaxed";

type BetaActiveFeedbackFormProps = {
  initialEmail: string;
  initialName: string;
  initialPlatform: BetaPlatform | null;
};

export function BetaActiveFeedbackForm({
  initialEmail,
  initialName,
  initialPlatform,
}: BetaActiveFeedbackFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [featuresUsed, setFeaturesUsed] = useState<Set<BetaActiveFeatureUsed>>(new Set());
  const [addPinFlow, setAddPinFlow] = useState<BetaFlowExperience | "">("");
  const [catalogSubmitFlow, setCatalogSubmitFlow] = useState<BetaFlowExperience | "">("");
  const [platform, setPlatform] = useState<BetaPlatform | "">(initialPlatform ?? "");

  function toggleFeature(value: BetaActiveFeatureUsed) {
    setFeaturesUsed((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  function validateForm(): boolean {
    const emailInput = formRef.current?.elements.namedItem("email") as HTMLInputElement | null;
    const emailVal = emailInput?.value ?? "";
    const err = validateBetaEmail(emailVal);
    setEmailError(err ?? "");
    if (err) {
      return false;
    }
    if (featuresUsed.size === 0) {
      setErrorMessage("Please check at least one feature you've used.");
      return false;
    }
    if (!addPinFlow) {
      setErrorMessage('Please answer how adding a pin to your vault went (or choose "Haven\'t tried this yet").');
      return false;
    }
    if (!catalogSubmitFlow) {
      setErrorMessage(
        'Please answer how submitting to the catalog went (or choose "Haven\'t tried this yet").',
      );
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
          audience: "active",
          name: fd.get("name"),
          email: fd.get("email"),
          platform: platform || undefined,
          featuresUsed: Array.from(featuresUsed),
          addPinFlow,
          addPinNotes: fd.get("addPinNotes"),
          catalogSubmitFlow,
          catalogSubmitNotes: fd.get("catalogSubmitNotes"),
          likedBest: fd.get("likedBest"),
          confusing: fd.get("confusing"),
          wishFeature: fd.get("wishFeature"),
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
          Your feedback goes straight to the team building Pinporium. Questions or follow-ups? Email{" "}
          <a href={`mailto:${siteDetails.supportEmail}`} className="text-secondary-ink font-semibold underline">
            {siteDetails.supportEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8" noValidate>
      <section className="space-y-4">
        <h2 className={sectionClass}>About you</h2>
        <div>
          <label htmlFor="feedback-email" className={labelClass}>
            Email <span className="text-primary-ink">*</span>
          </label>
          <input
            id="feedback-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={initialEmail}
            className={clsx(fieldClass, emailError && "border-primary-ink/50")}
            placeholder="Same address you used for the beta"
            disabled={status === "submitting"}
          />
          {emailError ? (
            <p className="mt-2 text-sm text-primary-ink font-body" role="alert">
              {emailError}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="feedback-name" className={labelClass}>
            Name <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <input
            id="feedback-name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={initialName}
            className={fieldClass}
            disabled={status === "submitting"}
          />
        </div>
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
      </section>

      <section className="space-y-3">
        <h2 className={sectionClass}>Which features have you used?</h2>
        <p className={hintClass}>Check all that apply.</p>
        <div className="space-y-2">
          {BETA_ACTIVE_FEATURES_USED.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                featuresUsed.has(option.value)
                  ? "border-secondary/40 bg-secondary/5"
                  : "border-navy/10 bg-white hover:border-navy/20",
              )}
            >
              <input
                type="checkbox"
                checked={featuresUsed.has(option.value)}
                onChange={() => toggleFeature(option.value)}
                className="mt-1"
                disabled={status === "submitting"}
              />
              <span className="text-[15px] text-navy leading-snug">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={sectionClass}>Adding a pin to your vault</h2>
        <p className={hintClass}>How was the add pin flow?</p>
        <div className="space-y-2">
          {BETA_FLOW_EXPERIENCE_OPTIONS.map((option) => (
            <label
              key={`add-${option.value}`}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                addPinFlow === option.value
                  ? "border-secondary/40 bg-secondary/5"
                  : "border-navy/10 bg-white hover:border-navy/20",
              )}
            >
              <input
                type="radio"
                name="addPinFlowDisplay"
                checked={addPinFlow === option.value}
                onChange={() => setAddPinFlow(option.value)}
                className="mt-1"
                disabled={status === "submitting"}
              />
              <span className="text-[15px] text-navy leading-snug">{option.label}</span>
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="add-pin-notes" className={labelClass}>
            Anything specific about adding pins?{" "}
            <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <textarea
            id="add-pin-notes"
            name="addPinNotes"
            rows={3}
            className={clsx(fieldClass, "resize-y min-h-[80px]")}
            placeholder="Steps that tripped you up, missing info, bugs…"
            disabled={status === "submitting"}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={sectionClass}>Submitting a pin to the catalog</h2>
        <p className={hintClass}>Community submissions — photos, artist, edition, etc.</p>
        <div className="space-y-2">
          {BETA_FLOW_EXPERIENCE_OPTIONS.map((option) => (
            <label
              key={`catalog-${option.value}`}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                catalogSubmitFlow === option.value
                  ? "border-secondary/40 bg-secondary/5"
                  : "border-navy/10 bg-white hover:border-navy/20",
              )}
            >
              <input
                type="radio"
                name="catalogSubmitFlowDisplay"
                checked={catalogSubmitFlow === option.value}
                onChange={() => setCatalogSubmitFlow(option.value)}
                className="mt-1"
                disabled={status === "submitting"}
              />
              <span className="text-[15px] text-navy leading-snug">{option.label}</span>
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="catalog-submit-notes" className={labelClass}>
            Anything specific about catalog submit?{" "}
            <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <textarea
            id="catalog-submit-notes"
            name="catalogSubmitNotes"
            rows={3}
            className={clsx(fieldClass, "resize-y min-h-[80px]")}
            placeholder="Review queue, required fields, photo upload…"
            disabled={status === "submitting"}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionClass}>Overall impressions</h2>
        <p className={hintClass}>Short answers are great — a sentence or two each is plenty.</p>
        <div>
          <label htmlFor="liked-best" className={labelClass}>
            What did you like best? <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <textarea
            id="liked-best"
            name="likedBest"
            rows={3}
            className={clsx(fieldClass, "resize-y min-h-[80px]")}
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="confusing" className={labelClass}>
            What was confusing or frustrating?{" "}
            <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <textarea
            id="confusing"
            name="confusing"
            rows={3}
            className={clsx(fieldClass, "resize-y min-h-[80px]")}
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="wish-feature" className={labelClass}>
            What&apos;s a feature you wish Pinporium had?{" "}
            <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <textarea
            id="wish-feature"
            name="wishFeature"
            rows={3}
            className={clsx(fieldClass, "resize-y min-h-[80px]")}
            disabled={status === "submitting"}
          />
        </div>
      </section>

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
        {status === "submitting" ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
