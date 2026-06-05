import type { BetaPlatform } from "@/lib/betaTester";
import { normalizeBetaEmail, validateBetaEmail } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

export type BetaCheckInAudience = "not_started" | "active";

/** Why someone has not started the beta yet — email links and check-in form. */
export const BETA_CHECK_IN_NOT_STARTED_REASONS = [
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

/** Why someone signed in but we want feedback on their experience. */
export const BETA_CHECK_IN_ACTIVE_REASONS = [
  {
    value: "barely-used",
    label: "I've signed in but haven't explored much yet",
    shortLabel: "Haven't explored much",
  },
  {
    value: "confusing",
    label: "The app is hard to figure out",
    shortLabel: "Hard to figure out",
  },
  {
    value: "missing-feature",
    label: "I'm missing a feature I need",
    shortLabel: "Missing a feature",
  },
  {
    value: "bugs",
    label: "I ran into bugs or crashes",
    shortLabel: "Bugs or crashes",
  },
  {
    value: "catalog-gaps",
    label: "I couldn't find pins I expected in the catalog",
    shortLabel: "Catalog gaps",
  },
  {
    value: "trades-not-tried",
    label: "I haven't tried trades or The Hunt yet",
    shortLabel: "Haven't tried trades / Hunt",
  },
  {
    value: "going-well",
    label: "It's going well — I want to share feedback",
    shortLabel: "Going well (feedback)",
  },
  {
    value: "other-active",
    label: "Something else",
    shortLabel: "Something else",
  },
] as const;

/** @deprecated Use BETA_CHECK_IN_NOT_STARTED_REASONS */
export const BETA_CHECK_IN_REASONS = BETA_CHECK_IN_NOT_STARTED_REASONS;

export type BetaCheckInNotStartedReason =
  (typeof BETA_CHECK_IN_NOT_STARTED_REASONS)[number]["value"];
export type BetaCheckInActiveReason =
  (typeof BETA_CHECK_IN_ACTIVE_REASONS)[number]["value"];
export type BetaCheckInReason = BetaCheckInNotStartedReason | BetaCheckInActiveReason;

const NOT_STARTED_VALUES = new Set<string>(
  BETA_CHECK_IN_NOT_STARTED_REASONS.map((r) => r.value),
);
const ACTIVE_VALUES = new Set<string>(
  BETA_CHECK_IN_ACTIVE_REASONS.map((r) => r.value),
);

export function getBetaCheckInReasons(audience: BetaCheckInAudience) {
  return audience === "active"
    ? BETA_CHECK_IN_ACTIVE_REASONS
    : BETA_CHECK_IN_NOT_STARTED_REASONS;
}

export function parseBetaCheckInAudienceParam(
  raw: string | null | undefined,
): BetaCheckInAudience {
  return raw?.trim() === "active" ? "active" : "not_started";
}

export function isBetaCheckInReasonForAudience(
  value: string,
  audience: BetaCheckInAudience,
): value is BetaCheckInReason {
  return audience === "active"
    ? ACTIVE_VALUES.has(value)
    : NOT_STARTED_VALUES.has(value);
}

export function isBetaCheckInReason(value: string): value is BetaCheckInReason {
  return NOT_STARTED_VALUES.has(value) || ACTIVE_VALUES.has(value);
}

export function betaCheckInReasonLabel(
  value: BetaCheckInReason,
  audience?: BetaCheckInAudience,
): string {
  if (audience === "active" || ACTIVE_VALUES.has(value)) {
    const hit = BETA_CHECK_IN_ACTIVE_REASONS.find((r) => r.value === value);
    if (hit) return hit.label;
  }
  const hit = BETA_CHECK_IN_NOT_STARTED_REASONS.find((r) => r.value === value);
  return hit?.label ?? value;
}

export function parseBetaCheckInReasonParam(
  raw: string | null | undefined,
  audience: BetaCheckInAudience = "not_started",
): BetaCheckInReason | null {
  const trimmed = raw?.trim();
  if (!trimmed || !isBetaCheckInReasonForAudience(trimmed, audience)) {
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

export function parseBetaCheckInNameParam(raw: string | null | undefined): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed || trimmed.length > 120) {
    return "";
  }
  return trimmed;
}

export function betaCheckInPageUrl(params?: {
  audience?: BetaCheckInAudience;
  reason?: BetaCheckInReason;
  platform?: BetaPlatform;
  email?: string;
  name?: string;
}): string {
  const base = `${siteDetails.siteUrl.replace(/\/$/, "")}/beta/check-in`;
  const search = new URLSearchParams();
  const audience = params?.audience ?? "not_started";
  if (audience === "active") {
    search.set("audience", "active");
  }
  if (params?.reason) {
    search.set("reason", params.reason);
  }
  if (params?.platform) {
    search.set("platform", params.platform);
  }
  if (params?.email?.trim()) {
    search.set("email", params.email.trim().toLowerCase());
  }
  const name = parseBetaCheckInNameParam(params?.name);
  if (name) {
    search.set("name", name);
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export const BETA_SLACK_CHECK_IN_NOT_STARTED_HEADER = "Beta check-in (not started yet)";
export const BETA_SLACK_CHECK_IN_ACTIVE_HEADER = "Beta check-in (active user)";

/** @deprecated */
export const BETA_SLACK_CHECK_IN_HEADER = BETA_SLACK_CHECK_IN_NOT_STARTED_HEADER;

export function formatBetaCheckInSlackMessage(
  data: {
    name?: string;
    email: string;
    reason: BetaCheckInReason;
    audience?: BetaCheckInAudience;
    platform?: BetaPlatform;
    details?: string;
  } & { turnstileToken?: string },
): string {
  const audience =
    data.audience ??
    (ACTIVE_VALUES.has(data.reason) ? "active" : "not_started");
  const header =
    audience === "active"
      ? BETA_SLACK_CHECK_IN_ACTIVE_HEADER
      : BETA_SLACK_CHECK_IN_NOT_STARTED_HEADER;

  const lines = [
    header,
    "",
    `Email: ${data.email}`,
    `Reason: ${betaCheckInReasonLabel(data.reason, audience)}`,
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

  const audience = parseBetaCheckInAudienceParam(
    typeof raw.audience === "string" ? raw.audience : undefined,
  );

  const reasonRaw = typeof raw.reason === "string" ? raw.reason.trim() : "";
  if (!isBetaCheckInReasonForAudience(reasonRaw, audience)) {
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
      audience,
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
  audience: BetaCheckInAudience;
  platform?: BetaPlatform;
  details?: string;
  turnstileToken: string;
};

/** Which check-in email fits this tester (for admin UI). */
export function suggestedBetaCheckInEmailType(signInCount: number): "check_in" | "check_in_active" {
  return signInCount > 0 ? "check_in_active" : "check_in";
}

export const BETA_CHECK_IN_EMAIL_OPTIONS = [
  {
    value: "check_in" as const,
    label: "Not started yet",
    description: "No app sign-ins — what's blocking them?",
  },
  {
    value: "check_in_active" as const,
    label: "Active user",
    description: "Has signed in — feature feedback form (~3 min)",
  },
];
