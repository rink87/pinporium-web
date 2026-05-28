"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";

import { PIN_COUNT_OPTIONS } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

type FormStatus = "idle" | "submitting" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const BetaTesterForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  function openConfirmModal() {
    const form = formRef.current;
    if (!form?.reportValidity()) {
      return;
    }
    setErrorMessage("");
    setTurnstileToken("");
    turnstileRef.current?.reset();
    setConfirmOpen(true);
  }

  async function submitApplication() {
    const form = formRef.current;
    if (!form) {
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage("Please complete the security check below.");
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

      setConfirmOpen(false);
      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openConfirmModal();
  }

  if (status === "success") {
    return (
      <div
        className="mt-8 w-full max-w-lg mx-auto rounded-deco border border-gold-deco/30 bg-cream/10 px-6 py-8 text-left"
        role="status"
      >
        <p className="font-display text-xl text-cream mb-2">You&apos;re on the list</p>
        <p className="text-cream/80 font-body leading-relaxed">
          Thanks for applying. We&apos;ll email you when a TestFlight or Android early access spot
          opens up. Questions?{" "}
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
    <>
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
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
            placeholder="What you collect, whether you trade, what you're hoping Pinporium helps with…"
          />
        </label>

        <label className="sr-only" aria-hidden="true">
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>

        {status === "error" && errorMessage && !confirmOpen ? (
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
          Apply to be a beta tester
        </button>
      </form>

      <Dialog
        open={confirmOpen}
        onClose={() => {
          if (status !== "submitting") {
            setConfirmOpen(false);
            setErrorMessage("");
          }
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-navy/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-deco bg-cream border border-gold-deco/30 shadow-frame p-6 sm:p-8">
            <DialogTitle className="font-display text-xl text-navy mb-2">
              Send your application?
            </DialogTitle>
            <p className="text-foreground-accent font-body text-sm leading-relaxed mb-6">
              Confirm you&apos;re not a bot, then we&apos;ll add you to the beta invite list.
            </p>

            {turnstileSiteKey ? (
              <div className="flex justify-center mb-4 min-h-[65px]">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => setTurnstileToken("")}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>
            ) : (
              <p className="text-sm text-foreground-accent font-body mb-4 text-center">
                Security check is not configured on this environment.
              </p>
            )}

            {errorMessage && confirmOpen ? (
              <p className="text-sm text-primary font-body mb-4" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                disabled={status === "submitting"}
                onClick={() => setConfirmOpen(false)}
                className="px-6 py-3 rounded-full text-sm font-body text-navy border border-gold-deco/40 hover:bg-cream-warm disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={status === "submitting" || (Boolean(turnstileSiteKey) && !turnstileToken)}
                onClick={() => void submitApplication()}
                className={clsx(
                  "px-6 py-3 rounded-full text-sm uppercase tracking-deco font-body",
                  "bg-primary text-cream hover:bg-primary-accent disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                {status === "submitting" ? "Sending…" : "Submit application"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default BetaTesterForm;
