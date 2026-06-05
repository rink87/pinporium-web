import type { BetaPlatform } from "@/lib/betaTester";
import { normalizeBetaEmail, validateBetaEmail } from "@/lib/betaTester";

import {
  BETA_SLACK_CHECK_IN_ACTIVE_HEADER,
  parseBetaCheckInAudienceParam,
  parseBetaCheckInPlatformParam,
} from "./betaCheckIn";

/** Features shown on the active-user feedback form (check all that apply). */
export const BETA_ACTIVE_FEATURES_USED = [
  { value: "add-pin", label: "Adding pins to my vault" },
  { value: "catalog-search", label: "Searching or browsing the catalog" },
  { value: "catalog-submit", label: "Submitting a pin to the catalog" },
  {
    value: "hunt-isos-grails",
    label: "Viewed The Hunt or added a pin to your ISO, DISO, or Grail list",
  },
  { value: "trades", label: "Trades or trade matching" },
  { value: "pin-boards", label: "Pin boards or organizing my vault" },
  { value: "artist-pages", label: "Artist pages" },
  { value: "collector-score", label: "Collector Score / Leaderboard" },
  { value: "profile-settings", label: "Profile, settings, or account" },
  { value: "in-app-feedback", label: "In-app feedback (shake to send)" },
] as const;

export type BetaActiveFeatureUsed = (typeof BETA_ACTIVE_FEATURES_USED)[number]["value"];

const FEATURE_VALUES = new Set<string>(BETA_ACTIVE_FEATURES_USED.map((f) => f.value));

export const BETA_FLOW_EXPERIENCE_OPTIONS = [
  { value: "not-tried", label: "Haven't tried this yet" },
  { value: "easy", label: "Easy — no problems" },
  { value: "okay", label: "Okay — a few rough edges" },
  { value: "confusing", label: "Confusing — hard to figure out" },
  { value: "frustrating", label: "Frustrating — I gave up or hit errors" },
] as const;

export type BetaFlowExperience = (typeof BETA_FLOW_EXPERIENCE_OPTIONS)[number]["value"];

const FLOW_VALUES = new Set<string>(BETA_FLOW_EXPERIENCE_OPTIONS.map((o) => o.value));

export function betaActiveFeatureLabel(value: BetaActiveFeatureUsed): string {
  return BETA_ACTIVE_FEATURES_USED.find((f) => f.value === value)?.label ?? value;
}

export function betaFlowExperienceLabel(value: BetaFlowExperience): string {
  return BETA_FLOW_EXPERIENCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function parseFeaturesUsed(raw: unknown): BetaActiveFeatureUsed[] | null {
  if (!Array.isArray(raw)) return null;
  const out: BetaActiveFeatureUsed[] = [];
  for (const item of raw) {
    if (typeof item !== "string" || !FEATURE_VALUES.has(item)) continue;
    if (!out.includes(item as BetaActiveFeatureUsed)) {
      out.push(item as BetaActiveFeatureUsed);
    }
  }
  return out.length > 0 ? out : null;
}

function parseFlowExperience(raw: unknown, fieldLabel: string): BetaFlowExperience | { error: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value || !FLOW_VALUES.has(value)) {
    return { error: `Please tell us how the ${fieldLabel} went (or choose "Haven't tried this yet").` };
  }
  return value as BetaFlowExperience;
}

function trimText(raw: unknown, max: number): string | undefined {
  const text = typeof raw === "string" ? raw.trim() : "";
  if (!text) return undefined;
  return text.length > max ? text.slice(0, max) : text;
}

export type BetaActiveFeedbackPayload = {
  audience: "active";
  name?: string;
  email: string;
  platform?: BetaPlatform;
  featuresUsed: BetaActiveFeatureUsed[];
  addPinFlow: BetaFlowExperience;
  addPinNotes?: string;
  catalogSubmitFlow: BetaFlowExperience;
  catalogSubmitNotes?: string;
  likedBest?: string;
  confusing?: string;
  wishFeature?: string;
  turnstileToken: string;
};

export function parseBetaActiveFeedbackBody(
  body: unknown,
): { ok: true; data: BetaActiveFeedbackPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return { ok: false, error: "Invalid request." };
  }

  const audience = parseBetaCheckInAudienceParam(
    typeof raw.audience === "string" ? raw.audience : undefined,
  );
  if (audience !== "active") {
    return { ok: false, error: "Invalid request." };
  }

  const emailRaw = typeof raw.email === "string" ? raw.email : "";
  const emailError = validateBetaEmail(emailRaw);
  if (emailError) {
    return { ok: false, error: emailError };
  }

  const featuresUsed = parseFeaturesUsed(raw.featuresUsed);
  if (!featuresUsed) {
    return { ok: false, error: "Please check at least one feature you've used." };
  }

  const addPinResult = parseFlowExperience(raw.addPinFlow, "add pin to vault");
  if (typeof addPinResult === "object" && "error" in addPinResult) {
    return { ok: false, error: addPinResult.error };
  }

  const catalogResult = parseFlowExperience(raw.catalogSubmitFlow, "submit to catalog");
  if (typeof catalogResult === "object" && "error" in catalogResult) {
    return { ok: false, error: catalogResult.error };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (name.length > 120) {
    return { ok: false, error: "Please shorten your name." };
  }

  const addPinNotes = trimText(raw.addPinNotes, 800);
  const catalogSubmitNotes = trimText(raw.catalogSubmitNotes, 800);
  const likedBest = trimText(raw.likedBest, 1500);
  const confusing = trimText(raw.confusing, 1500);
  const wishFeature = trimText(raw.wishFeature, 1500);

  const platform = parseBetaCheckInPlatformParam(
    typeof raw.platform === "string" ? raw.platform : undefined,
  );

  const turnstileToken =
    typeof raw.turnstileToken === "string" ? raw.turnstileToken.trim() : "";

  return {
    ok: true,
    data: {
      audience: "active",
      name: name || undefined,
      email: normalizeBetaEmail(emailRaw),
      platform: platform ?? undefined,
      featuresUsed,
      addPinFlow: addPinResult,
      addPinNotes,
      catalogSubmitFlow: catalogResult,
      catalogSubmitNotes,
      likedBest,
      confusing,
      wishFeature,
      turnstileToken,
    },
  };
}

export function formatBetaActiveFeedbackSlackMessage(data: BetaActiveFeedbackPayload): string {
  const {
    turnstileToken: _ignored,
    featuresUsed,
    addPinFlow,
    addPinNotes,
    catalogSubmitFlow,
    catalogSubmitNotes,
    likedBest,
    confusing,
    wishFeature,
    ...rest
  } = data;
  void _ignored;
  const feedback = {
    ...rest,
    featuresUsed,
    addPinFlow,
    addPinNotes,
    catalogSubmitFlow,
    catalogSubmitNotes,
    likedBest,
    confusing,
    wishFeature,
  };
  const lines = [
    BETA_SLACK_CHECK_IN_ACTIVE_HEADER,
    "",
    `Email: ${feedback.email}`,
  ];

  if (feedback.name?.trim()) {
    lines.push(`Name: ${feedback.name.trim()}`);
  }
  if (feedback.platform) {
    lines.push(
      `Platform: ${feedback.platform === "ios" ? "iPhone (TestFlight)" : "Android (Play internal)"}`,
    );
  }

  lines.push("", "Features used:");
  for (const feature of feedback.featuresUsed) {
    lines.push(`• ${betaActiveFeatureLabel(feature)}`);
  }

  lines.push("", `Add pin to vault: ${betaFlowExperienceLabel(feedback.addPinFlow)}`);
  if (feedback.addPinNotes) {
    lines.push(`Add pin notes: ${feedback.addPinNotes}`);
  }

  lines.push(`Submit to catalog: ${betaFlowExperienceLabel(feedback.catalogSubmitFlow)}`);
  if (feedback.catalogSubmitNotes) {
    lines.push(`Catalog submit notes: ${feedback.catalogSubmitNotes}`);
  }

  if (feedback.likedBest) {
    lines.push("", `Liked best: ${feedback.likedBest}`);
  }
  if (feedback.confusing) {
    lines.push(`Confusing: ${feedback.confusing}`);
  }
  if (feedback.wishFeature) {
    lines.push(`Wish list: ${feedback.wishFeature}`);
  }

  return lines.join("\n");
}
