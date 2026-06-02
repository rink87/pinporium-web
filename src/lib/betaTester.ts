import { normalizeSlackMessageText } from "@/lib/slack/normalizeMessageText";

export const PIN_COUNT_OPTIONS = [
  { value: "under-25", label: "Fewer than 25" },
  { value: "25-100", label: "25–100" },
  { value: "100-500", label: "100–500" },
  { value: "500-1000", label: "500–1,000" },
  { value: "1000-plus", label: "1,000+" },
] as const;

export type PinCountValue = (typeof PIN_COUNT_OPTIONS)[number]["value"];

export const BETA_PLATFORM_OPTIONS = [
  {
    value: "ios",
    label: "iPhone",
    hint: "via TestFlight",
  },
  {
    value: "android",
    label: "Android",
    hint: "via Play Internal Testing",
  },
] as const;

export type BetaPlatform = (typeof BETA_PLATFORM_OPTIONS)[number]["value"];

/** Practical RFC-style check — local part, domain, and TLD */
const EMAIL_RE =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

export function normalizeBetaEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateBetaEmail(email: string): string | null {
  const normalized = normalizeBetaEmail(email);

  if (!normalized) {
    return "Please enter your email address.";
  }

  if (normalized.length > 254) {
    return "Email address is too long.";
  }

  if (normalized.includes("..") || normalized.startsWith(".") || normalized.includes("@.")) {
    return "Please enter a valid email address.";
  }

  if (!EMAIL_RE.test(normalized)) {
    return "Please enter a valid email address (e.g. you@gmail.com).";
  }

  const domain = normalized.split("@")[1];
  const tld = domain?.split(".").pop() ?? "";
  if (tld.length < 2) {
    return "Please enter a valid email address.";
  }

  return null;
}

export interface BetaTesterPayload {
  name: string;
  email: string;
  pinCount: PinCountValue;
  why?: string;
  platform: BetaPlatform;
}

export function platformLabel(value: BetaPlatform): string {
  return BETA_PLATFORM_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export const BETA_SLACK_SIGNUP_HEADER = "Beta Tester Request";

export function parseBetaTesterSlackMessage(
  text: string,
): Pick<BetaTesterPayload, "name" | "email" | "platform"> | null {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const body = normalizeSlackMessageText(normalized);

  if (!body.includes(BETA_SLACK_SIGNUP_HEADER)) {
    return null;
  }

  const nameLine = body.match(/^Name:\s*(.+)$/m);
  const emailLine = body.match(/^Email:\s*(.+)$/m);
  const platformLine = body.match(/^Platform:\s*(.+)$/m);

  const name = nameLine?.[1]?.trim() ?? "";
  const emailRaw = emailLine?.[1]?.trim() ?? "";
  const platform = platformLine?.[1]
    ? parsePlatformFromSlackLine(platformLine[1])
    : null;

  if (!name || !emailRaw || !platform) {
    return null;
  }

  if (validateBetaEmail(emailRaw)) {
    return null;
  }

  return {
    name,
    email: normalizeBetaEmail(emailRaw),
    platform,
  };
}

function parsePlatformFromSlackLine(line: string): BetaPlatform | null {
  const lower = line.toLowerCase();
  if (lower.includes("iphone") || lower.includes("testflight")) {
    return "ios";
  }
  if (lower.includes("android")) {
    return "android";
  }
  return null;
}

export function formatBetaTesterSlackMessage(data: BetaTesterPayload): string {
  const why = data.why?.trim();
  const platformLine =
    data.platform === "ios"
      ? "Platform: iPhone (TestFlight)"
      : "Platform: Android (Play internal testing)";

  return [
    BETA_SLACK_SIGNUP_HEADER,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    platformLine,
    `Approximate pins: ${pinCountLabel(data.pinCount)}`,
    `Why they want to be a tester: ${why || "(not provided)"}`,
  ].join("\n");
}

export function pinCountLabel(value: PinCountValue): string {
  return PIN_COUNT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export type ParsedBetaTesterRequest = BetaTesterPayload & { turnstileToken: string };

export function parseBetaTesterBody(
  body: unknown,
): { ok: true; data: ParsedBetaTesterRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return { ok: false, error: "Invalid request." };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const emailRaw = typeof raw.email === "string" ? raw.email : "";
  const emailError = validateBetaEmail(emailRaw);
  const email = normalizeBetaEmail(emailRaw);
  const pinCount = raw.pinCount;
  const why = typeof raw.why === "string" ? raw.why.trim() : undefined;
  const turnstileToken =
    typeof raw.turnstileToken === "string" ? raw.turnstileToken.trim() : "";
  const platform = raw.platform;

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Please enter your name." };
  }

  if (emailError) {
    return { ok: false, error: emailError };
  }

  const validPlatforms = BETA_PLATFORM_OPTIONS.map((o) => o.value);
  if (typeof platform !== "string" || !validPlatforms.includes(platform as BetaPlatform)) {
    return { ok: false, error: "Please choose iPhone or Android." };
  }

  const validPinCounts = PIN_COUNT_OPTIONS.map((o) => o.value);
  if (typeof pinCount !== "string" || !validPinCounts.includes(pinCount as PinCountValue)) {
    return { ok: false, error: "Please select how many pins you collect." };
  }

  if (why && why.length > 2000) {
    return { ok: false, error: "Please keep your message under 2,000 characters." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      pinCount: pinCount as PinCountValue,
      why: why || undefined,
      platform: platform as BetaPlatform,
      turnstileToken,
    },
  };
}
