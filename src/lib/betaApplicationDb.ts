import type { BetaPlatform, PinCountValue } from "@/lib/betaTester";
import { normalizeBetaEmail } from "@/lib/betaTester";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type BetaEmailKind = "signup_received" | "welcome" | "check_in";

export async function upsertBetaApplicationFromSignup(data: {
  name: string;
  email: string;
  platform: BetaPlatform;
  pinCount: PinCountValue;
  why?: string;
}): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.warn("Beta application upsert skipped: SUPABASE_SERVICE_ROLE_KEY not set");
    return;
  }

  const email = normalizeBetaEmail(data.email);
  const { error } = await admin.from("beta_applications").upsert(
    {
      name: data.name.trim(),
      email,
      platform: data.platform,
      pin_count_bucket: data.pinCount,
      why: data.why?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("beta_applications upsert failed", error);
  }
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
