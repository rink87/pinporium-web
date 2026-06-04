import type { BetaPlatform } from "@/lib/betaTester";
import { normalizeBetaEmail, validateBetaEmail } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

/** Why someone has not started the beta yet — used in email links and check-in form. */
export const BETA_CHECK_IN_REASONS = [
  {
    value: "not-installed",
    label: "I haven't installed the app yet",
    shortLabel: "Haven't installed yet",
  },
  {
    value: "install-trouble",
    label: "I had trouble with the TestFlight or Play install link",
    shortLabel: "Install link didn't work",
  },
  {
    value: "no-account",
    label: "I installed the app but haven't created an account",
    shortLabel: "Installed, no account yet",
  },
  {
    value: "no-time",
    label: "I haven't had time to try it yet",
    shortLabel: "No time yet",
  },
  {
    value: "wrong-device",
    label: "I'm on the wrong device or platform (iPhone vs Android)",
    shortLabel: "Wrong device / platform",
  },
  {
    value: "privacy",
    label: "I have privacy or account concerns",
    shortLabel: "Privacy / account concerns",
  },
  {
    value: "not-interested",
    label: "I'm no longer interested in the beta",
    shortLabel: "No longer interested",
  },
  {
    value: "other",
    label: "Something else",
    shortLabel: "Something else",
  },
] as const;

export type BetaCheckInReason = (typeof BETA_CHECK_IN_REASONS)[number]["value"];

const REASON_VALUES = new Set<string>(BETA_CHECK_IN_REASONS.map((r) => r.value));

export function isBetaCheckInReason(value: string): value is BetaCheckInReason {
  return REASON_VALUES.has(value);
}

export function betaCheckInReasonLabel(value: BetaCheckInReason): string {
  return BETA_CHECK_IN_REASONS.find((r) => r.value === value)?.label ?? value;
}

export function parseBetaCheckInReasonParam(
  raw: string | null | undefined,
): BetaCheckInReason | null {
  const trimmed = raw?.trim();
  if (!trimmed || !isBetaCheckInReason(trimmed)) {
    return null;
  }
  return trimmed;
}

export function parseBetaCheckInPlatformParam(
  raw: string | null | undefined,
): BetaPlatform | null {
  if (raw === "ios" || raw === "android") {
    return raw;
  }
  return null;
}

/** Public check-in page with optional pre-selected reason (from email links). */
export function betaCheckInPageUrl(params?: {
  reason?: BetaCheckInReason;
  platform?: BetaPlatform;
  email?: string;
}): string {
  const base = `${siteDetails.siteUrl.replace(/\/$/, "")}/beta/check-in`;
  const search = new URLSearchParams();
  if (params?.reason) {
    search.set("reason", params.reason);
  }
  if (params?.platform) {
    search.set("platform", params.platform);
  }
  if (params?.email?.trim()) {
    search.set("email", params.email.trim().toLowerCase());
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export const BETA_SLACK_CHECK_IN_HEADER = "Beta check-in (not started yet)";

export function formatBetaCheckInSlackMessage(data: {
  name?: string;
  email: string;
  reason: BetaCheckInReason;
  platform?: BetaPlatform;
  details?: string;
}): string {
  const lines = [
    BETA_SLACK_CHECK_IN_HEADER,
    "",
    `Email: ${data.email}`,
    `Reason: ${betaCheckInReasonLabel(data.reason)}`,
  ];
  if (data.name?.trim()) {
    lines.push(`Name: ${data.name.trim()}`);
  }
  if (data.platform) {
    lines.push(
      `Platform: ${data.platform === "ios" ? "iPhone (TestFlight)" : "Android (Play internal)"}`,
    );
  }
  if (data.details?.trim()) {
    lines.push(`Details: ${data.details.trim()}`);
  }
  return lines.join("\n");
}

export function parseBetaCheckInBody(
  body: unknown,
): { ok: true; data: BetaCheckInPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return { ok: false, error: "Invalid request." };
  }

  const emailRaw = typeof raw.email === "string" ? raw.email : "";
  const emailError = validateBetaEmail(emailRaw);
  if (emailError) {
    return { ok: false, error: emailError };
  }

  const reasonRaw = typeof raw.reason === "string" ? raw.reason.trim() : "";
  if (!isBetaCheckInReason(reasonRaw)) {
    return { ok: false, error: "Please choose what best describes your situation." };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (name.length > 120) {
    return { ok: false, error: "Please shorten your name." };
  }

  const details = typeof raw.details === "string" ? raw.details.trim() : "";
  if (details.length > 2000) {
    return { ok: false, error: "Please keep details under 2,000 characters." };
  }

  const platform = parseBetaCheckInPlatformParam(
    typeof raw.platform === "string" ? raw.platform : undefined,
  );

  const turnstileToken =
    typeof raw.turnstileToken === "string" ? raw.turnstileToken.trim() : "";

  return {
    ok: true,
    data: {
      name: name || undefined,
      email: normalizeBetaEmail(emailRaw),
      reason: reasonRaw,
      platform: platform ?? undefined,
      details: details || undefined,
      turnstileToken,
    },
  };
}

export type BetaCheckInPayload = {
  name?: string;
  email: string;
  reason: BetaCheckInReason;
  platform?: BetaPlatform;
  details?: string;
  turnstileToken: string;
};
