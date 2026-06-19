"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { FormEvent, useRef, useState } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

import type { CatalogArtistDirectoryRow } from "@/lib/catalog/publicArtists";
import { submitPartnersInquiry } from "@/lib/partners/submitPartnersInquiry";

import {
  partnersFieldClass,
  partnersLabelClass,
  partnersTextareaClass,
} from "./partnersFormStyles";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Props = {
  artist: CatalogArtistDirectoryRow | null;
  onClose: () => void;
};

export function ArtistClaimDialog({ artist, onClose }: Props) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmsIsArtist, setConfirmsIsArtist] = useState(false);
  const [notes, setNotes] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const open = artist != null;

  function handleClose() {
    if (status === "submitting") return;
    setStatus("idle");
    setErrorMessage("");
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!artist || status === "submitting") return;

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
    if (!confirmsIsArtist) {
      setErrorMessage("Confirm you are the artist or an authorized representative.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await submitPartnersInquiry({
        kind: "artist_claim",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        confirmsIsArtist: true,
        notes: notes.trim() || undefined,
        artistId: artist.id,
        artistName: artist.name,
        artistSlug: artist.slug,
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

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-[60]">
      <div className="fixed inset-0 bg-navy/40 backdrop-blur-[2px]" aria-hidden />
      <div className="fixed inset-0 flex items-end justify-center p-4 sm:items-center">
        <DialogPanel className="relative w-full max-w-lg max-h-[min(92vh,720px)] overflow-y-auto rounded-deco border border-gold-deco/25 bg-cream shadow-[0_24px_80px_-12px_rgba(44,51,69,0.35)]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-2 text-foreground-accent hover:bg-white/70"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>

          <div className="p-6 sm:p-8">
            {status === "success" ? (
              <div className="text-center pt-4">
                <FiCheckCircle className="mx-auto h-10 w-10 text-secondary-ink" aria-hidden />
                <DialogTitle className="mt-4 font-display text-xl text-navy">
                  Claim submitted
                </DialogTitle>
                <p className="mt-2 text-foreground-accent font-body">
                  We verify every claim before linking an account. We&apos;ll follow up at{" "}
                  {email.trim()}.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 rounded-deco bg-navy px-5 py-2.5 text-sm font-semibold text-white font-body"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <DialogTitle className="font-display text-xl text-navy pr-8">
                  Claim this artist profile
                </DialogTitle>
                <p className="mt-2 text-sm text-foreground-accent font-body leading-relaxed">
                  Request access to manage the official catalog profile for{" "}
                  <strong className="text-navy">{artist?.name}</strong>. We verify every claim
                  before linking an account — same process as in the Pinporium app.
                </p>

                <form onSubmit={e => void handleSubmit(e)} className="mt-6 space-y-4">
                  <div>
                    <label className={partnersLabelClass} htmlFor="claim-name">
                      Your name <span className="text-primary-ink">*</span>
                    </label>
                    <input
                      id="claim-name"
                      className={partnersFieldClass}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={status === "submitting"}
                      required
                    />
                  </div>
                  <div>
                    <label className={partnersLabelClass} htmlFor="claim-email">
                      Email <span className="text-primary-ink">*</span>
                    </label>
                    <input
                      id="claim-email"
                      type="email"
                      className={partnersFieldClass}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={status === "submitting"}
                      required
                    />
                  </div>
                  <div>
                    <label className={partnersLabelClass} htmlFor="claim-phone">
                      Phone <span className="text-foreground-accent font-normal">(optional)</span>
                    </label>
                    <input
                      id="claim-phone"
                      type="tel"
                      className={partnersFieldClass}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      disabled={status === "submitting"}
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gold-deco/40 text-secondary focus:ring-secondary/30"
                      checked={confirmsIsArtist}
                      onChange={e => setConfirmsIsArtist(e.target.checked)}
                      disabled={status === "submitting"}
                    />
                    <span className="text-sm text-navy font-body leading-relaxed">
                      I am the artist (or an authorized representative of this brand)
                    </span>
                  </label>
                  <div>
                    <label className={partnersLabelClass} htmlFor="claim-notes">
                      Additional notes <span className="text-foreground-accent font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="claim-notes"
                      className={partnersTextareaClass}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Links to your shop, socials, or proof of ownership…"
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
                    className="w-full rounded-deco bg-navy px-6 py-3.5 text-sm font-body font-semibold text-white disabled:opacity-60"
                  >
                    {status === "submitting" ? "Submitting…" : "Submit claim request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
