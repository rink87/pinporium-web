import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { turnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

const PARTNERS_EMAIL = "partners@pinporium.app";

const SELL_CHANNEL_IDS = new Set(["direct", "popshop", "etsy", "other"]);

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function parsePartnershipBody(raw: Record<string, unknown>) {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const sellChannels = Array.isArray(raw.sellChannels)
    ? raw.sellChannels.filter(
        (id): id is string => typeof id === "string" && SELL_CHANNEL_IDS.has(id),
      )
    : [];

  if (name.length < 2 || !isValidEmail(email) || sellChannels.length === 0) {
    return null;
  }

  return {
    kind: "partnership" as const,
    name: name.slice(0, 120),
    brandName: clip(raw.brandName, 120) ?? null,
    email: email.slice(0, 200),
    phone: clip(raw.phone, 40) ?? null,
    pinCountApprox: clip(raw.pinCountApprox, 80) ?? null,
    sellChannels: sellChannels.slice(0, 8),
    notes: clip(raw.notes, 4000) ?? null,
    route: "/for-artists",
    userId: null,
    username: null,
  };
}

function parseArtistClaimBody(raw: Record<string, unknown>) {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const artistId = typeof raw.artistId === "string" ? raw.artistId.trim() : "";
  const artistName = typeof raw.artistName === "string" ? raw.artistName.trim() : "";

  if (
    name.length < 2 ||
    !isValidEmail(email) ||
    !artistId ||
    !artistName ||
    raw.confirmsIsArtist !== true
  ) {
    return null;
  }

  return {
    kind: "artist_claim" as const,
    name: name.slice(0, 120),
    email: email.slice(0, 200),
    phone: clip(raw.phone, 40) ?? null,
    confirmsIsArtist: true as const,
    notes: clip(raw.notes, 4000) ?? null,
    artistId: artistId.slice(0, 80),
    artistName: artistName.slice(0, 200),
    artistSlug: clip(raw.artistSlug, 200) ?? null,
    route: "/for-artists",
    userId: null,
    username: null,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = body as Record<string, unknown> & { turnstileToken?: string };
  const turnstileToken = raw.turnstileToken;

  if (turnstileRequired()) {
    if (!turnstileToken || typeof turnstileToken !== "string") {
      return NextResponse.json(
        { error: "Please complete the security check and try again." },
        { status: 400 },
      );
    }
    const valid = await verifyTurnstileToken(turnstileToken);
    if (!valid) {
      return NextResponse.json(
        { error: "Security check failed. Please try again." },
        { status: 400 },
      );
    }
  }

  const kind = raw.kind;
  const payload =
    kind === "artist_claim"
      ? parseArtistClaimBody(raw)
      : kind === "partnership"
        ? parsePartnershipBody(raw)
        : null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid or incomplete form." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        error: `Partnerships form is temporarily unavailable. Email ${PARTNERS_EMAIL} instead.`,
      },
      { status: 503 },
    );
  }

  const { data, error } = await admin.functions.invoke("partners-inquiry", {
    body: payload,
  });

  if (error) {
    console.error("partners-inquiry invoke failed", error);
    return NextResponse.json({ error: "Could not send inquiry. Try again." }, { status: 502 });
  }

  const result = data as
    | { ok?: boolean; method?: string; error?: string; mailto?: { to: string; subject: string; body: string } }
    | null;

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result?.ok) {
    return NextResponse.json({
      ok: true,
      method: result.method ?? "email",
      mailto: result.mailto,
    });
  }

  return NextResponse.json({ error: "Could not send inquiry. Try again." }, { status: 502 });
}
