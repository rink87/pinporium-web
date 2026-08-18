import { siteDetails } from "@/data/siteDetails";

/** Artist-facing tools we can seed for early partners (check all that apply). */
export const PARTNER_TOOLS_OPTIONS = [
  {
    value: "verified-profile",
    label: "Verified artist profile + partner badge in Discover and Search",
  },
  {
    value: "catalog-page",
    label: "Official catalog page collectors can browse and follow",
  },
  {
    value: "drop-reminders",
    label: "Drop reminders — collectors get notified when you announce a release",
  },
  {
    value: "purchase-links",
    label: "Purchase links on each pin (Etsy, website, etc.)",
  },
  {
    value: "shop-sync",
    label: "Shop / Etsy sync so new listings flow into the catalog automatically",
  },
  {
    value: "set-pages",
    label: "Set / series pages so collectors can track completion of your releases",
  },
  {
    value: "follower-insights",
    label: "Follower insights — who follows your brand, which pins are most ISO'd",
  },
  {
    value: "convention-promo",
    label: "Convention / event promo — pin your drop at a show or pop-up",
  },
  {
    value: "bulk-upload",
    label: "Bulk catalog upload — manage many designs at once (spreadsheet import)",
  },
  {
    value: "other",
    label: "Something else",
  },
] as const;

export type PartnerToolId = (typeof PARTNER_TOOLS_OPTIONS)[number]["value"];

const TOOL_VALUES = new Set<string>(PARTNER_TOOLS_OPTIONS.map((o) => o.value));

export function partnerToolLabel(value: PartnerToolId): string {
  return PARTNER_TOOLS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export function parsePartnerToolsSurveyNameParam(raw: string | null | undefined): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed || trimmed.length > 120) return "";
  return trimmed;
}

export function parsePartnerToolsSurveyBrandParam(raw: string | null | undefined): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed || trimmed.length > 120) return "";
  return trimmed;
}

export function parsePartnerToolsSurveyEmailParam(raw: string | null | undefined): string {
  const trimmed = raw?.trim().toLowerCase() ?? "";
  if (!trimmed || !isValidEmail(trimmed)) return "";
  return trimmed.slice(0, 200);
}

export function partnerToolsSurveyPageUrl(params?: {
  email?: string;
  name?: string;
  brand?: string;
  siteUrl?: string;
}): string {
  const origin = (params?.siteUrl ?? siteDetails.siteUrl).replace(/\/$/, "");
  const base = `${origin}/for-artists/tools-survey`;
  const search = new URLSearchParams();
  const email = parsePartnerToolsSurveyEmailParam(params?.email);
  if (email) search.set("email", email);
  const name = parsePartnerToolsSurveyNameParam(params?.name);
  if (name) search.set("name", name);
  const brand = parsePartnerToolsSurveyBrandParam(params?.brand);
  if (brand) search.set("brand", brand);
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

function parseTools(raw: unknown): PartnerToolId[] | null {
  if (!Array.isArray(raw)) return null;
  const out: PartnerToolId[] = [];
  for (const item of raw) {
    if (typeof item !== "string" || !TOOL_VALUES.has(item)) continue;
    if (!out.includes(item as PartnerToolId)) {
      out.push(item as PartnerToolId);
    }
  }
  return out.length > 0 ? out : null;
}

export type PartnerToolsSurveyPayload = {
  name: string;
  email: string;
  brandName?: string;
  tools: PartnerToolId[];
  topPriority?: PartnerToolId;
  otherText?: string;
  notes?: string;
  turnstileToken: string;
};

export function parsePartnerToolsSurveyBody(
  body: unknown,
): { ok: true; data: PartnerToolsSurveyPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return { ok: false, error: "Invalid request." };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (name.length < 2) {
    return { ok: false, error: "Add your name so we know who to reply to." };
  }
  if (name.length > 120) {
    return { ok: false, error: "Please shorten your name." };
  }

  const emailRaw = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!isValidEmail(emailRaw)) {
    return { ok: false, error: "Add a valid email address." };
  }

  const tools = parseTools(raw.tools);
  if (!tools) {
    return { ok: false, error: "Pick at least one tool that would be useful." };
  }

  const otherText = clip(raw.otherText, 800);
  if (tools.includes("other") && !otherText) {
    return { ok: false, error: "Tell us what else would be useful." };
  }

  let topPriority: PartnerToolId | undefined;
  if (typeof raw.topPriority === "string" && TOOL_VALUES.has(raw.topPriority)) {
    topPriority = raw.topPriority as PartnerToolId;
    if (!tools.includes(topPriority)) {
      return { ok: false, error: "Your #1 pick should be one of the tools you checked." };
    }
  }

  const turnstileToken =
    typeof raw.turnstileToken === "string" ? raw.turnstileToken.trim() : "";

  return {
    ok: true,
    data: {
      name,
      email: emailRaw.toLowerCase().slice(0, 200),
      brandName: clip(raw.brandName, 120),
      tools,
      topPriority,
      otherText,
      notes: clip(raw.notes, 2000),
      turnstileToken,
    },
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldRow(label: string, value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return `<tr><td style="padding:6px 0;vertical-align:top;width:160px;font-weight:700;color:#5E5A6C;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#2C3345;">${escapeHtml(value.trim())}</td></tr>`;
}

export function partnerToolsSurveySubject(data: PartnerToolsSurveyPayload): string {
  const who = data.brandName?.trim() || data.name;
  return `Partner tools survey — ${who}`;
}

export function partnerToolsSurveyPlainText(data: PartnerToolsSurveyPayload): string {
  const lines = ["Partner tools survey", "", `Name: ${data.name}`, `Email: ${data.email}`];
  if (data.brandName) lines.push(`Brand: ${data.brandName}`);
  lines.push("", "Useful tools:");
  for (const tool of data.tools) {
    lines.push(`• ${partnerToolLabel(tool)}`);
  }
  if (data.otherText) lines.push(`Something else: ${data.otherText}`);
  if (data.topPriority) lines.push("", `Ship first: ${partnerToolLabel(data.topPriority)}`);
  if (data.notes) lines.push("", "Notes:", data.notes);
  return lines.join("\n");
}

export function partnerToolsSurveyHtml(data: PartnerToolsSurveyPayload): string {
  const toolsList = data.tools.map((id) => `• ${partnerToolLabel(id)}`).join("\n");
  const rows = [
    fieldRow("Name", data.name),
    fieldRow("Brand", data.brandName),
    fieldRow("Email", data.email),
    fieldRow("Useful tools", toolsList),
    fieldRow("Something else", data.otherText),
    fieldRow("Ship first", data.topPriority ? partnerToolLabel(data.topPriority) : null),
    fieldRow("Notes", data.notes),
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Partner tools survey</title></head>
<body style="margin:0;padding:24px;font-family:Helvetica,Arial,sans-serif;background:#FFF9F5;color:#2C3345;">
  <h1 style="font-size:20px;margin:0 0 16px;">Partner tools survey</h1>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">${rows.filter(Boolean).join("")}</table>
</body>
</html>`;
}
