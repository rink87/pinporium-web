import crypto from "crypto";

export function verifySlackRequestSignature({
  signingSecret,
  signature,
  timestamp,
  rawBody,
}: {
  signingSecret: string;
  signature: string | null;
  timestamp: string | null;
  rawBody: string;
}): boolean {
  if (!signature?.startsWith("v0=") || !timestamp) {
    return false;
  }

  const ts = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(ts)) {
    return false;
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - ts;
  if (ageSeconds < 0 || ageSeconds > 60 * 5) {
    return false;
  }

  const base = `v0:${timestamp}:${rawBody}`;
  const digest = crypto
    .createHmac("sha256", signingSecret)
    .update(base)
    .digest("hex");
  const expected = `v0=${digest}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}
