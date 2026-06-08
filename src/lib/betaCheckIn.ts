import type { BetaPlatform } from "@/lib/betaTester";
import { normalizeBetaEmail, validateBetaEmail } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

export type BetaCheckInAudience = "not_started" | "active" | "active_no_pins";

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

/** Signed in but no vault pins yet — lighter check-in than full feature feedback. */
export const BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS = [
  {
    value: "not-tried-add",
    label: "I haven't tried adding a pin yet",
    shortLabel: "Haven't tried adding a pin",
  },
  {
    value: "add-pin-confusing",
    label: "Adding a pin felt confusing",
    shortLabel: "Add pin was confusing",
  },
  {
    value: "photos-hard",
    label: "The photo step was hard or time-consuming",
    shortLabel: "Photos were hard",
  },
  {
    value: "catalog-blocked",
    label: "I couldn't find my pin in the catalog",
    shortLabel: "Couldn't find in catalog",
  },
  {
    value: "started-gave-up",
    label: "I started adding a pin but gave up",
    shortLabel: "Started, gave up",
  },
  {
    value: "browsing-only",
    label: "I'm browsing for now — planning to add soon",
    shortLabel: "Browsing for now",
  },
  {
    value: "other-no-pins",
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
export type BetaCheckInActiveNoPinsReason =
  (typeof BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS)[number]["value"];
export type BetaCheckInReason =
  | BetaCheckInNotStartedReason
  | BetaCheckInActiveReason
  | BetaCheckInActiveNoPinsReason;

const NOT_STARTED_VALUES = new Set<string>(
  BETA_CHECK_IN_NOT_STARTED_REASONS.map((r) => r.value),
);
const ACTIVE_VALUES = new Set<string>(
  BETA_CHECK_IN_ACTIVE_REASONS.map((r) => r.value),
);
const ACTIVE_NO_PINS_VALUES = new Set<string>(
  BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS.map((r) => r.value),
);

export function getBetaCheckInReasons(audience: BetaCheckInAudience) {
  if (audience === "active") return BETA_CHECK_IN_ACTIVE_REASONS;
  if (audience === "active_no_pins") return BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS;
  return BETA_CHECK_IN_NOT_STARTED_REASONS;
}

export function parseBetaCheckInAudienceParam(
  raw: string | null | undefined,
): BetaCheckInAudience {
  const v = raw?.trim();
  if (v === "active") return "active";
  if (v === "active_no_pins") return "active_no_pins";
  return "not_started";
}

/** Prefer explicit ?audience=; fall back to reason slug (email deep links). */
export function resolveBetaCheckInAudience(
  audienceRaw: string | null | undefined,
  reasonRaw: string | null | undefined,
): BetaCheckInAudience {
  const explicit = audienceRaw?.trim();
  if (explicit === "active") return "active";
  if (explicit === "active_no_pins") return "active_no_pins";

  const reason = reasonRaw?.trim() ?? "";
  if (reason && ACTIVE_NO_PINS_VALUES.has(reason)) return "active_no_pins";
  if (reason && ACTIVE_VALUES.has(reason)) return "active";
  return "not_started";
}

export function isBetaCheckInReasonForAudience(
  value: string,
  audience: BetaCheckInAudience,
): value is BetaCheckInReason {
  if (audience === "active") return ACTIVE_VALUES.has(value);
  if (audience === "active_no_pins") return ACTIVE_NO_PINS_VALUES.has(value);
  return NOT_STARTED_VALUES.has(value);
}

export function isBetaCheckInReason(value: string): value is BetaCheckInReason {
  return (
    NOT_STARTED_VALUES.has(value) ||
    ACTIVE_VALUES.has(value) ||
    ACTIVE_NO_PINS_VALUES.has(value)
  );
}

export function betaCheckInReasonLabel(
  value: BetaCheckInReason,
  audience?: BetaCheckInAudience,
): string {
  if (audience === "active_no_pins" || ACTIVE_NO_PINS_VALUES.has(value)) {
    const hit = BETA_CHECK_IN_ACTIVE_NO_PINS_REASONS.find((r) => r.value === value);
    if (hit) return hit.label;
  }
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
  /** Local email preview passes localhost; production emails omit this. */
  siteUrl?: string;
}): string {
  const origin = (params?.siteUrl ?? siteDetails.siteUrl).replace(/\/$/, "");
  const base = `${origin}/beta/check-in`;
  const search = new URLSearchParams();
  const audience = params?.audience ?? "not_started";
  if (audience === "active" || audience === "active_no_pins") {
    search.set("audience", audience);
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
export const BETA_SLACK_CHECK_IN_ACTIVE_NO_PINS_HEADER =
  "Beta check-in (signed in, no vault pins)";

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
    (ACTIVE_NO_PINS_VALUES.has(data.reason)
      ? "active_no_pins"
      : ACTIVE_VALUES.has(data.reason)
        ? "active"
        : "not_started");
  const header =
    audience === "active"
      ? BETA_SLACK_CHECK_IN_ACTIVE_HEADER
      : audience === "active_no_pins"
        ? BETA_SLACK_CHECK_IN_ACTIVE_NO_PINS_HEADER
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

  const reasonRaw = typeof raw.reason === "string" ? raw.reason.trim() : "";

  const audience = resolveBetaCheckInAudience(
    typeof raw.audience === "string" ? raw.audience : undefined,
    reasonRaw || undefined,
  );

  if (!reasonRaw || !isBetaCheckInReasonForAudience(reasonRaw, audience)) {
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

/** Which active check-in email fits this tester (for admin UI). */
export function suggestedActiveCheckInEmailType(
  signInCount: number,
  vaultPinCount: number,
): "check_in_active" | "check_in_active_no_pins" | null {
  if (signInCount <= 0) return null;
  return vaultPinCount > 0 ? "check_in_active" : "check_in_active_no_pins";
}

/** @deprecated Use suggestedActiveCheckInEmailType */
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
    value: "check_in_active_no_pins" as const,
    label: "Signed in, no pins",
    description: "Has signed in but vault is empty",
  },
  {
    value: "check_in_active" as const,
    label: "Active — has pins",
    description: "Vault pins added — feature feedback form (~3 min)",
  },
];
