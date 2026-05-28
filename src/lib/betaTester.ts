export const PIN_COUNT_OPTIONS = [
  { value: "under-25", label: "Fewer than 25" },
  { value: "25-100", label: "25–100" },
  { value: "100-500", label: "100–500" },
  { value: "500-1000", label: "500–1,000" },
  { value: "1000-plus", label: "1,000+" },
] as const;

export type PinCountValue = (typeof PIN_COUNT_OPTIONS)[number]["value"];

export interface BetaTesterPayload {
  name: string;
  email: string;
  pinCount: PinCountValue;
  why?: string;
}

export function pinCountLabel(value: PinCountValue): string {
  return PIN_COUNT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function formatBetaTesterSlackMessage(data: BetaTesterPayload): string {
  const why = data.why?.trim();
  return [
    "Beta Tester Request",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Approximate pins: ${pinCountLabel(data.pinCount)}`,
    `Why they want to be a tester: ${why || "(not provided)"}`,
  ].join("\n");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const pinCount = raw.pinCount;
  const why = typeof raw.why === "string" ? raw.why.trim() : undefined;
  const turnstileToken =
    typeof raw.turnstileToken === "string" ? raw.turnstileToken.trim() : "";

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Please enter your name." };
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, error: "Please enter a valid email address." };
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
      turnstileToken,
    },
  };
}
