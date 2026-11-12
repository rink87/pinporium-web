import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeBetaEmail, type BetaPlatform } from "@/lib/betaTester";
import type { BetaCheckInAudience, BetaCheckInReason } from "@/lib/betaCheckIn";

/**
 * Persist a check-in survey response for admin collector profiles.
 * Best-effort: Slack remains the primary notify path; DB write failures are logged.
 * Requires migration `check_in_survey_responses` (not applied until Chris confirms).
 */
export async function recordCheckInSurveyResponse(input: {
  email: string;
  audience: BetaCheckInAudience;
  reason: BetaCheckInReason | string;
  platform?: BetaPlatform;
  name?: string;
  details?: string;
}): Promise<{ ok: true } | { ok: false; message: string; skipped?: boolean }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      skipped: true,
      message: "SUPABASE_SERVICE_ROLE_KEY is not configured on pinporium-web.",
    };
  }

  const { error } = await admin.from("check_in_survey_responses").insert({
    email: normalizeBetaEmail(input.email),
    audience: input.audience,
    reason: String(input.reason),
    platform: input.platform ?? null,
    name: input.name?.trim() || null,
    details: input.details?.trim() || null,
  });

  if (error) {
    console.error("check_in_survey_responses insert failed", error);
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
