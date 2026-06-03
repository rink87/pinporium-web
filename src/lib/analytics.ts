import { sendGAEvent } from "@next/third-parties/google";

/** Fires when the beta form submits successfully (mark as key event in GA4). */
export function trackBetaApplySuccess(platform: string): void {
  sendGAEvent("event", "beta_apply_success", {
    event_category: "beta",
    platform,
  });
}
