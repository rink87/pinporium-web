import type { BetaEmailKind } from "@/lib/betaApplicationDb";
import { normalizeBetaEmail } from "@/lib/betaTester";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

import { fetchBetaEmailHistoryFromResend } from "./email/resendSentEmailHistory";
import { fetchBetaSignupHistoryFromSlack } from "./slack/betaSignupSlackHistory";
import { fetchBetaWelcomeHistoryFromSlack } from "./slack/betaWelcomeSentHistory";

type BetaApplicationRow = {
  id: string;
  email: string;
  submitted_at: string | null;
  signup_received_at: string | null;
  welcome_sent_at: string | null;
  check_in_sent_at: string | null;
};

export type BetaEmailHistorySyncResult = {
  ok: true;
  scannedApplications: number;
  updatedApplications: number;
  filled: {
    submitted: number;
    signup_received: number;
    welcome: number;
    check_in: number;
  };
  sources: {
    resendRecipients: number;
    slackSignupRecipients: number;
    slackWelcomeRecipients: number;
  };
};

function columnForKind(kind: BetaEmailKind): keyof Pick<
  BetaApplicationRow,
  "signup_received_at" | "welcome_sent_at" | "check_in_sent_at"
> {
  if (kind === "signup_received") return "signup_received_at";
  if (kind === "welcome") return "welcome_sent_at";
  return "check_in_sent_at";
}

function pickEarlier(existing: string | null | undefined, candidate: string): string {
  if (!existing) return candidate;
  return new Date(existing).getTime() <= new Date(candidate).getTime() ? existing : candidate;
}

function shouldUpdateSubmittedAt(
  current: string | null | undefined,
  discovered: string,
): boolean {
  if (!current) return true;
  return new Date(discovered).getTime() < new Date(current).getTime();
}

function resolveSubmittedAt(
  app: BetaApplicationRow,
  submittedFromSlack: string | undefined,
  fromResend: Partial<Record<BetaEmailKind, string>>,
  patch: Record<string, string>,
): string | null {
  const candidates = [
    submittedFromSlack,
    fromResend.signup_received,
    app.signup_received_at ?? undefined,
    patch.signup_received_at,
  ].filter((value): value is string => Boolean(value));

  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce((earliest, candidate) => pickEarlier(earliest, candidate));
}

export async function syncBetaApplicationEmailHistory(): Promise<
  BetaEmailHistorySyncResult | { ok: false; message: string }
> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      message: "SUPABASE_SERVICE_ROLE_KEY is not configured on pinporium-web.",
    };
  }

  let resendHistory: Awaited<ReturnType<typeof fetchBetaEmailHistoryFromResend>>;
  try {
    resendHistory = await fetchBetaEmailHistoryFromResend();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Resend history sync failed.";
    return { ok: false, message };
  }

  let slackSignupHistory: Map<string, string>;
  let slackWelcomeHistory: Map<string, string>;
  try {
    [slackSignupHistory, slackWelcomeHistory] = await Promise.all([
      fetchBetaSignupHistoryFromSlack(),
      fetchBetaWelcomeHistoryFromSlack(),
    ]);
  } catch (err) {
    console.error("Slack beta history sync failed", err);
    slackSignupHistory = new Map();
    slackWelcomeHistory = new Map();
  }

  const { data: applications, error } = await admin
    .from("beta_applications")
    .select("id, email, submitted_at, signup_received_at, welcome_sent_at, check_in_sent_at");

  if (error) {
    return { ok: false, message: error.message };
  }

  const filled = { submitted: 0, signup_received: 0, welcome: 0, check_in: 0 };
  let updatedApplications = 0;

  for (const app of (applications ?? []) as BetaApplicationRow[]) {
    const email = normalizeBetaEmail(app.email);
    const fromResend = resendHistory.get(email) ?? {};
    const welcomeFromSlack = slackWelcomeHistory.get(email);
    const submittedFromSlack = slackSignupHistory.get(email);

    const patch: Record<string, string> = {};

    for (const kind of ["signup_received", "welcome", "check_in"] as const) {
      const column = columnForKind(kind);
      if (app[column]) continue;

      const fromResendAt = fromResend[kind];
      const discovered =
        kind === "welcome" && welcomeFromSlack
          ? fromResendAt
            ? pickEarlier(fromResendAt, welcomeFromSlack)
            : welcomeFromSlack
          : fromResendAt;

      if (discovered) {
        patch[column] = discovered;
        filled[kind] += 1;
      }
    }

    const submittedCandidate = resolveSubmittedAt(app, submittedFromSlack, fromResend, patch);
    if (submittedCandidate && shouldUpdateSubmittedAt(app.submitted_at, submittedCandidate)) {
      patch.submitted_at = app.submitted_at
        ? pickEarlier(app.submitted_at, submittedCandidate)
        : submittedCandidate;
      filled.submitted += 1;
    }

    if (Object.keys(patch).length === 0) continue;

    patch.updated_at = new Date().toISOString();
    const { error: updateError } = await admin
      .from("beta_applications")
      .update(patch)
      .eq("id", app.id);

    if (updateError) {
      console.error("beta email history sync update failed", app.id, updateError);
      continue;
    }

    updatedApplications += 1;
  }

  return {
    ok: true,
    scannedApplications: applications?.length ?? 0,
    updatedApplications,
    filled,
    sources: {
      resendRecipients: resendHistory.size,
      slackSignupRecipients: slackSignupHistory.size,
      slackWelcomeRecipients: slackWelcomeHistory.size,
    },
  };
}
