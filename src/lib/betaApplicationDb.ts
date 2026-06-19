import type { BetaPlatform, PinCountValue } from "@/lib/betaTester";
import { normalizeBetaEmail } from "@/lib/betaTester";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type BetaEmailKind =
  | "signup_received"
  | "welcome"
  | "check_in"
  | "check_in_active";

export function parseReleaseNotesSent(
  raw: unknown,
): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [version, at] of Object.entries(raw)) {
    if (typeof at === "string" && at.trim()) {
      out[version] = at;
    }
  }
  return out;
}

export async function recordBetaReleaseNotesSent(
  email: string,
  version: string,
): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return;
  }

  const normalized = normalizeBetaEmail(email);
  const now = new Date().toISOString();

  const { data: existing } = await admin
    .from("beta_applications")
    .select("release_notes_sent")
    .eq("email", normalized)
    .maybeSingle();

  const current = parseReleaseNotesSent(existing?.release_notes_sent);
  const next = { ...current, [version]: now };

  const { error } = await admin
    .from("beta_applications")
    .update({
      release_notes_sent: next,
      updated_at: now,
    })
    .eq("email", normalized);

  if (error) {
    console.error("beta_applications release_notes_sent update failed", error);
  }
}

export async function upsertBetaApplicationFromSignup(data: {
  name: string;
  email: string;
  platform: BetaPlatform;
  pinCount?: PinCountValue;
  why?: string;
  adminNotes?: string;
}): Promise<{ ok: true; created: boolean } | { ok: false; message: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      message:
        "Beta application not saved — SUPABASE_SERVICE_ROLE_KEY is not configured on pinporium-web.",
    };
  }

  const email = normalizeBetaEmail(data.email);

  const { data: existing } = await admin
    .from("beta_applications")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    name: data.name.trim(),
    email,
    platform: data.platform,
    pin_count_bucket: data.pinCount ?? null,
    why: data.why?.trim() || null,
    updated_at: now,
  };

  if (!existing?.id) {
    row.submitted_at = now;
  }

  if (data.adminNotes?.trim()) {
    row.admin_notes = data.adminNotes.trim();
  }

  const { error } = await admin.from("beta_applications").upsert(row, { onConflict: "email" });

  if (error) {
    console.error("beta_applications upsert failed", error);
    return { ok: false, message: `Could not save beta application: ${error.message}` };
  }

  return { ok: true, created: !existing?.id };
}

export async function recordBetaApplicationEmailSent(
  email: string,
  kind: BetaEmailKind,
): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return;
  }

  const normalized = normalizeBetaEmail(email);
  const column =
    kind === "signup_received"
      ? "signup_received_at"
      : kind === "welcome"
        ? "welcome_sent_at"
        : kind === "check_in_active"
          ? "check_in_active_sent_at"
          : "check_in_sent_at";

  const { error } = await admin
    .from("beta_applications")
    .update({
      [column]: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("email", normalized);

  if (error) {
    console.error(`beta_applications ${column} update failed`, error);
  }
}

export async function fetchBetaApplicationById(id: string) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  const { data, error } = await admin
    .from("beta_applications")
    .select("id, name, email, platform")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("beta_applications fetch by id failed", error);
    return null;
  }
  return data;
}

export async function fetchBetaApplicationByEmail(email: string) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  const { data, error } = await admin
    .from("beta_applications")
    .select("id, name, email, platform")
    .eq("email", normalizeBetaEmail(email))
    .maybeSingle();

  if (error) {
    console.error("beta_applications fetch failed", error);
    return null;
  }
  return data;
}
