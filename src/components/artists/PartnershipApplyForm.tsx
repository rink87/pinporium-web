"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

import {
  PARTNERS_SELL_CHANNELS,
  type PartnersSellChannelId,
} from "@/lib/partners/constants";
import { submitPartnersInquiry } from "@/lib/partners/submitPartnersInquiry";

import {
  partnersFieldClass,
  partnersLabelClass,
  partnersTextareaClass,
} from "./partnersFormStyles";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function PartnershipApplyForm() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pinCountApprox, setPinCountApprox] = useState("");
  const [sellChannels, setSellChannels] = useState<PartnersSellChannelId[]>([]);
  const [notes, setNotes] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleChannel(id: PartnersSellChannelId) {
    setSellChannels(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    if (name.trim().length < 2) {
      setErrorMessage("Add your name so we know who to reply to.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Add a valid email address.");
      setStatus("error");
      return;
    }
    if (sellChannels.length === 0) {
      setErrorMessage("Pick at least one way you sell pins.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await submitPartnersInquiry({
        kind: "partnership",
        name: name.trim(),
        brandName: brandName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        pinCountApprox: pinCountApprox.trim() || undefined,
        sellChannels,
        notes: notes.trim() || undefined,
        turnstileToken: turnstileToken || undefined,
      });
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not send. Try again.");
      setStatus("error");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-deco border border-secondary/25 bg-white/90 p-8 text-center shadow-card">
        <FiCheckCircle className="mx-auto h-10 w-10 text-secondary-ink" aria-hidden />
        <h3 className="mt-4 font-display text-xl text-navy">Inquiry sent</h3>
        <p className="mt-2 text-foreground-accent font-body">
          Our partnerships team will follow up at {email.trim()}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={partnersLabelClass} htmlFor="partner-name">
            Your name <span className="text-primary-ink">*</span>
          </label>
          <input
            id="partner-name"
            className={partnersFieldClass}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            disabled={status === "submitting"}
            required
          />
        </div>
        <div>
          <label className={partnersLabelClass} htmlFor="partner-brand">
            Brand name <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <input
            id="partner-brand"
            className={partnersFieldClass}
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            placeholder="Studio or shop name"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={partnersLabelClass} htmlFor="partner-email">
            Email <span className="text-primary-ink">*</span>
          </label>
          <input
            id="partner-email"
            type="email"
            className={partnersFieldClass}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@studio.com"
            disabled={status === "submitting"}
            required
          />
        </div>
        <div>
          <label className={partnersLabelClass} htmlFor="partner-phone">
            Phone <span className="text-foreground-accent font-normal">(optional)</span>
          </label>
          <input
            id="partner-phone"
            type="tel"
            className={partnersFieldClass}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div>
        <label className={partnersLabelClass} htmlFor="partner-pin-count">
          About how many pins do you have?
        </label>
        <input
          id="partner-pin-count"
          className={partnersFieldClass}
          value={pinCountApprox}
          onChange={e => setPinCountApprox(e.target.value)}
          placeholder="e.g. 40 catalog designs, 200+ SKUs"
          disabled={status === "submitting"}
        />
      </div>

      <fieldset>
        <legend className={partnersLabelClass}>
          How do you sell pins? <span className="text-primary-ink">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PARTNERS_SELL_CHANNELS.map(option => (
            <label
              key={option.id}
              className={clsx(
                "flex cursor-pointer items-center gap-3 rounded-deco border px-3 py-2.5 font-body text-sm transition-colors",
                sellChannels.includes(option.id)
                  ? "border-secondary/40 bg-secondary/5 text-navy"
                  : "border-gold-deco/25 bg-cream/50 text-foreground-accent",
              )}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gold-deco/40 text-secondary focus:ring-secondary/30"
                checked={sellChannels.includes(option.id)}
                onChange={() => toggleChannel(option.id)}
                disabled={status === "submitting"}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={partnersLabelClass} htmlFor="partner-notes">
          Additional notes <span className="text-foreground-accent font-normal">(optional)</span>
        </label>
        <textarea
          id="partner-notes"
          className={partnersTextareaClass}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Upcoming drops, events, or anything else we should know…"
          disabled={status === "submitting"}
        />
      </div>

      {turnstileSiteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "light", size: "flexible" }}
        />
      ) : null}

      {status === "error" && errorMessage ? (
        <p className="text-sm text-primary font-body" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-deco bg-navy px-6 py-3.5 text-sm font-body font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send to partnerships team"}
      </button>
    </form>
  );
}
