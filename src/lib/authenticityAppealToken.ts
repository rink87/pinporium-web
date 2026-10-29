import { createHmac, timingSafeEqual } from "node:crypto";

/** Keep in sync with pinporium-app `supabase/functions/_shared/email/authenticityAppealToken.ts`. */

/** Same `app_feedback.metadata.appealKind` as the in-app re-review sheet. */
export const AUTHENTICITY_APPEAL_KIND = "authenticity_rereview" as const;

export type AuthenticityAppealTokenPayload = {
  u: string;
  s: string;
  c: string | null;
  v: string | null;
  o: string | null;
  d: string;
  a: string;
  e: number;
};

const DEFAULT_TTL_SECONDS = 90 * 24 * 60 * 60;

function base64UrlFromBuffer(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function bufferFromBase64Url(value: string): Buffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function hmacSha256(secret: string, message: string): Buffer {
  return createHmac("sha256", secret).update(message, "utf8").digest();
}

/** Same shared secret as the submission-email Edge Function (`SUBMISSION_EMAIL_SECRET`). */
export function resolveAuthenticityAppealSecret(): string | null {
  return process.env.SUBMISSION_EMAIL_SECRET?.trim() || null;
}

export function signAuthenticityAppealToken(
  payload: Omit<AuthenticityAppealTokenPayload, "e"> & { e?: number },
  secret: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): string {
  const body: AuthenticityAppealTokenPayload = {
    u: payload.u,
    s: payload.s,
    c: payload.c,
    v: payload.v,
    o: payload.o,
    d: payload.d,
    a: payload.a,
    e: payload.e ?? Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const bodyPart = base64UrlFromBuffer(Buffer.from(JSON.stringify(body), "utf8"));
  const sig = hmacSha256(secret, bodyPart);
  return `${bodyPart}.${base64UrlFromBuffer(sig)}`;
}

export function verifyAuthenticityAppealToken(
  token: string,
  secret: string,
  nowUnix = Math.floor(Date.now() / 1000),
): AuthenticityAppealTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [bodyPart, sigPart] = parts;
  if (!bodyPart || !sigPart) return null;

  const expected = hmacSha256(secret, bodyPart);
  let actual: Buffer;
  try {
    actual = bufferFromBase64Url(sigPart);
  } catch {
    return null;
  }
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const json = bufferFromBase64Url(bodyPart).toString("utf8");
    const parsed = JSON.parse(json) as AuthenticityAppealTokenPayload;
    if (
      typeof parsed.u !== "string" ||
      typeof parsed.s !== "string" ||
      typeof parsed.d !== "string" ||
      typeof parsed.a !== "string" ||
      typeof parsed.e !== "number"
    ) {
      return null;
    }
    if (parsed.e < nowUnix) return null;
    return {
      u: parsed.u,
      s: parsed.s,
      c: typeof parsed.c === "string" ? parsed.c : null,
      v: typeof parsed.v === "string" ? parsed.v : null,
      o: typeof parsed.o === "string" ? parsed.o : null,
      d: parsed.d,
      a: parsed.a,
      e: parsed.e,
    };
  } catch {
    return null;
  }
}

export function authenticityAppealPageUrl(args: { siteUrl: string; token: string }): string {
  const base = args.siteUrl.replace(/\/$/, "");
  return `${base}/authenticity-appeal?t=${encodeURIComponent(args.token)}`;
}

/** Short support ref matching pinporium-app `catalogReferenceId(id, 'variant')`. */
export function authenticityAppealPinReferenceId(variantId: string | null): string | null {
  if (!variantId) return null;
  return `V-${variantId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
