import type { PartnersSellChannelId } from "./constants";

export type PartnershipInquiryInput = {
  kind: "partnership";
  name: string;
  brandName?: string;
  email: string;
  phone?: string;
  pinCountApprox?: string;
  sellChannels: PartnersSellChannelId[];
  notes?: string;
  turnstileToken?: string;
};

export type ArtistClaimInquiryInput = {
  kind: "artist_claim";
  name: string;
  email: string;
  phone?: string;
  confirmsIsArtist: boolean;
  notes?: string;
  artistId: string;
  artistName: string;
  artistSlug?: string;
  turnstileToken?: string;
};

export type PartnersInquiryInput =
  | PartnershipInquiryInput
  | ArtistClaimInquiryInput;

type PartnersInquirySuccess =
  | { ok: true; method: "email" }
  | { ok: true; method: "mailto"; mailto: { to: string; subject: string; body: string } };

type PartnersInquiryFailure = { error?: string };

export async function submitPartnersInquiry(
  payload: PartnersInquiryInput,
): Promise<"email" | "mailto"> {
  const res = await fetch("/api/partners/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as PartnersInquirySuccess | PartnersInquiryFailure;

  if (!res.ok) {
    const message =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Could not send. Try again.";
    throw new Error(message);
  }

  const success = data as PartnersInquirySuccess;

  if (success.method === "mailto" && success.mailto) {
    const params = new URLSearchParams({
      subject: success.mailto.subject,
      body: success.mailto.body,
    });
    window.location.href = `mailto:${encodeURIComponent(success.mailto.to)}?${params.toString()}`;
    return "mailto";
  }

  if (success.ok) {
    return success.method === "mailto" ? "mailto" : "email";
  }

  throw new Error("Could not send. Try again.");
}
