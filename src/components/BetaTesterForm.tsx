"use client";

import clsx from "clsx";
import { FormEvent, useState } from "react";

import { PIN_COUNT_OPTIONS } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

type FormStatus = "idle" | "submitting" | "success" | "error";

const BetaTesterForm: React.FC = () => {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
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
        }),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="mt-8 w-full max-w-lg mx-auto rounded-deco border border-gold-deco/30 bg-cream/10 px-6 py-8 text-left"
        role="status"
      >
        <p className="font-display text-xl text-cream mb-2">You&apos;re on the list</p>
        <p className="text-cream/80 font-body leading-relaxed">
          Thanks for applying. We&apos;ll email you at the address you provided when a TestFlight
          or early access spot opens up. Questions?{" "}
          <a
            href={`mailto:${siteDetails.supportEmail}`}
            className="text-gold underline underline-offset-2 hover:text-gold-light"
          >
            {siteDetails.supportEmail}
          </a>
          .
        </p>
        <p className="mt-4 text-cream/70 font-body text-sm">
          Already in the beta? Use in-app feedback (shake your phone on iOS) to send bugs and ideas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-lg mx-auto text-left space-y-4"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-deco-wide text-cream/80 font-body mb-1.5 block">
            Name <span className="text-gold">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-gold-deco/25 bg-cream/95 px-4 py-3 text-navy font-body placeholder:text-foreground-accent/60 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-deco-wide text-cream/80 font-body mb-1.5 block">
            Email <span className="text-gold">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-gold-deco/25 bg-cream/95 px-4 py-3 text-navy font-body placeholder:text-foreground-accent/60 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-deco-wide text-cream/80 font-body mb-1.5 block">
          Approximate number of pins <span className="text-gold">*</span>
        </span>
        <select
          name="pinCount"
          required
          defaultValue=""
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-gold-deco/25 bg-cream/95 px-4 py-3 text-navy font-body focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
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
        <span className="text-xs uppercase tracking-deco-wide text-cream/80 font-body mb-1.5 block">
          Why do you want to beta test? <span className="text-cream/50">(optional)</span>
        </span>
        <textarea
          name="why"
          rows={4}
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-gold-deco/25 bg-cream/95 px-4 py-3 text-navy font-body placeholder:text-foreground-accent/60 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60 resize-y min-h-[100px]"
          placeholder="What you collect, whether you trade, what you hope Pinporium solves…"
        />
      </label>

      <label className="sr-only" aria-hidden="true">
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>

      {status === "error" && errorMessage ? (
        <p className="text-sm text-red-200 font-body" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={clsx(
          "w-full sm:w-auto min-w-[220px] px-8 h-14 rounded-full text-sm uppercase tracking-deco font-body transition-colors border border-gold-deco/30",
          "bg-gold text-navy hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {status === "submitting" ? "Sending…" : "Apply to be a beta tester"}
      </button>
    </form>
  );
};

export default BetaTesterForm;
