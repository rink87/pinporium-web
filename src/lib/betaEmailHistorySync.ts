import type { BetaEmailKind } from "@/lib/betaApplicationDb";
import { normalizeBetaEmail } from "@/lib/betaTester";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

import { fetchBetaEmailHistoryFromResend } from "./email/resendSentEmailHistory";
import { fetchBetaWelcomeHistoryFromSlack } from "./slack/betaWelcomeSentHistory";

type BetaApplicationRow = {
  id: string;
  email: string;
  signup_received_at: string | null;
  welcome_sent_at: string | null;
  check_in_sent_at: string | null;
};

export type BetaEmailHistorySyncResult = {
  ok: true;
  scannedApplications: number;
  updatedApplications: number;
  filled: {
    signup_received: number;
    welcome: number;
    check_in: number;
  };
  sources: {
    resendRecipients: number;
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
    [resendHistory] = await Promise.all([
      fetchBetaEmailHistoryFromResend(),
      // Slack runs in parallel; merged below.
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Resend history sync failed.";
    return { ok: false, message };
  }

  let slackWelcomeHistory: Map<string, string>;
  try {
    slackWelcomeHistory = await fetchBetaWelcomeHistoryFromSlack();
  } catch (err) {
    console.error("Slack beta welcome history sync failed", err);
    slackWelcomeHistory = new Map();
  }

  const { data: applications, error } = await admin
    .from("beta_applications")
    .select("id, email, signup_received_at, welcome_sent_at, check_in_sent_at");

  if (error) {
    return { ok: false, message: error.message };
  }

  const filled = { signup_received: 0, welcome: 0, check_in: 0 };
  let updatedApplications = 0;

  for (const app of (applications ?? []) as BetaApplicationRow[]) {
    const email = normalizeBetaEmail(app.email);
    const fromResend = resendHistory.get(email) ?? {};
    const welcomeFromSlack = slackWelcomeHistory.get(email);

    const patch: Record<string, string> = {};

    for (const kind of ["signup_received", "welcome", "check_in"] as const) {
      const column = columnForKind(kind);
      if (app[column]) continue;

      const fromResendAt = fromResend[kind];
      const discovered =
        kind === "welcome" && welcomeFromSlack
          ? fromResendAt
            ? new Date(welcomeFromSlack).getTime() < new Date(fromResendAt).getTime()
              ? welcomeFromSlack
              : fromResendAt
            : welcomeFromSlack
          : fromResendAt;

      if (discovered) {
        patch[column] = discovered;
        filled[kind] += 1;
      }
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
      slackWelcomeRecipients: slackWelcomeHistory.size,
    },
  };
}
