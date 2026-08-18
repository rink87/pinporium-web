"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

import { PARTNERS_EMAIL } from "@/lib/partners/constants";
import {
  PARTNER_TOOLS_OPTIONS,
  type PartnerToolId,
} from "@/lib/partners/toolsSurvey";
import { turnstileRequired } from "@/lib/turnstile";

import {
  partnersFieldClass,
  partnersLabelClass,
  partnersTextareaClass,
} from "./partnersFormStyles";

type FormStatus = "idle" | "submitting" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Props = {
  initialName: string;
  initialEmail: string;
  initialBrand: string;
};

export function PartnerToolsSurveyForm({ initialName, initialEmail, initialBrand }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [tools, setTools] = useState<Set<PartnerToolId>>(new Set());
  const [topPriority, setTopPriority] = useState<PartnerToolId | "">("");

  function toggleTool(value: PartnerToolId) {
    setTools((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
        if (topPriority === value) setTopPriority("");
      } else {
        next.add(value);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const brandName = String(fd.get("brandName") ?? "").trim();
    const otherText = String(fd.get("otherText") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();

    if (name.length < 2) {
      setErrorMessage("Add your name so we know who to reply to.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Add a valid email address.");
      setStatus("error");
      return;
    }
    if (tools.size === 0) {
      setErrorMessage("Pick at least one tool that would be useful.");
      setStatus("error");
      return;
    }
    if (tools.has("other") && !otherText) {
      setErrorMessage("Tell us what else would be useful.");
      setStatus("error");
      return;
    }
    if (topPriority && !tools.has(topPriority)) {
      setErrorMessage("Your #1 pick should be one of the tools you checked.");
      setStatus("error");
      return;
    }
    if (turnstileRequired() && !turnstileToken) {
      setErrorMessage("Please complete the security check and try again.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/partners/tools-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          brandName: brandName || undefined,
          tools: Array.from(tools),
          topPriority: topPriority || undefined,
          otherText: otherText || undefined,
          notes: notes || undefined,
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
          Your answers go to the partnerships team and help us decide what to build first for
          artists. Questions? Email{" "}
          <a href={`mailto:${PARTNERS_EMAIL}`} className="text-secondary-ink font-semibold underline">
            {PARTNERS_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  const selectedTools = PARTNER_TOOLS_OPTIONS.filter((option) => tools.has(option.value));

  return (
    <form ref={formRef} onSubmit={(e) => void handleSubmit(e)} className="space-y-8" noValidate>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <section className="space-y-4">
        <h2 className="font-display text-lg text-navy mb-1">About you</h2>
        <div>
          <label htmlFor="survey-name" className={partnersLabelClass}>
            Name <span className="text-primary-ink">*</span>
          </label>
          <input
            id="survey-name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={initialName}
            className={partnersFieldClass}
            disabled={status === "submitting"}
            required
          />
        </div>
        <div>
          <label htmlFor="survey-email" className={partnersLabelClass}>
            Email <span className="text-primary-ink">*</span>
          </label>
          <input
            id="survey-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={initialEmail}
            className={partnersFieldClass}
            disabled={status === "submitting"}
            required
          />
        </div>
        <div>
          <label htmlFor="survey-brand" className={partnersLabelClass}>
            Brand name <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <input
            id="survey-brand"
            name="brandName"
            type="text"
            defaultValue={initialBrand}
            className={partnersFieldClass}
            placeholder="Studio or shop name"
            disabled={status === "submitting"}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg text-navy mb-1">Which tools would help most?</h2>
        <p className="text-sm text-foreground-accent mb-3 leading-relaxed">
          Check anything you&apos;d use. We&apos;re prioritizing what to build for early partners.
        </p>
        <div className="space-y-2">
          {PARTNER_TOOLS_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                tools.has(option.value)
                  ? "border-secondary/40 bg-secondary/5"
                  : "border-navy/10 bg-white hover:border-navy/20",
              )}
            >
              <input
                type="checkbox"
                checked={tools.has(option.value)}
                onChange={() => toggleTool(option.value)}
                className="mt-1"
                disabled={status === "submitting"}
              />
              <span className="text-[15px] text-navy leading-snug">{option.label}</span>
            </label>
          ))}
        </div>
        {tools.has("other") ? (
          <div>
            <label htmlFor="survey-other" className={partnersLabelClass}>
              What else would be useful? <span className="text-primary-ink">*</span>
            </label>
            <textarea
              id="survey-other"
              name="otherText"
              rows={3}
              className={partnersTextareaClass}
              placeholder="A tool, workflow, or integration we didn't list…"
              disabled={status === "submitting"}
            />
          </div>
        ) : (
          <input type="hidden" name="otherText" value="" />
        )}
      </section>

      {selectedTools.length > 1 ? (
        <section className="space-y-3">
          <h2 className="font-display text-lg text-navy mb-1">If we could only ship one first</h2>
          <p className="text-sm text-foreground-accent mb-3 leading-relaxed">
            Optional — which of the ones you checked should we build first?
          </p>
          <div className="space-y-2">
            {selectedTools.map((option) => (
              <label
                key={`priority-${option.value}`}
                className={clsx(
                  "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                  topPriority === option.value
                    ? "border-secondary/40 bg-secondary/5"
                    : "border-navy/10 bg-white hover:border-navy/20",
                )}
              >
                <input
                  type="radio"
                  name="topPriorityDisplay"
                  checked={topPriority === option.value}
                  onChange={() => setTopPriority(option.value)}
                  className="mt-1"
                  disabled={status === "submitting"}
                />
                <span className="text-[15px] text-navy leading-snug">{option.label}</span>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <label htmlFor="survey-notes" className={partnersLabelClass}>
          Anything else we should know?{" "}
          <span className="text-foreground-accent font-normal">(optional)</span>
        </label>
        <textarea
          id="survey-notes"
          name="notes"
          rows={4}
          className={partnersTextareaClass}
          placeholder="Upcoming drops, how you prefer to be credited, catalog format…"
          disabled={status === "submitting"}
        />
      </section>

      {turnstileSiteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "light", size: "flexible" }}
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
        className="w-full rounded-deco bg-navy px-6 py-3.5 text-sm font-body font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send answers"}
      </button>
    </form>
  );
}
