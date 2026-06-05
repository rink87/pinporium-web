import type { BetaEmailKind } from "@/lib/betaApplicationDb";

import { betaActiveUserCheckInEmailSubject } from "./templates/betaActiveUserCheckIn";
import { betaNotYetStartedEmailSubject } from "./templates/betaNotYetStarted";
import { betaSignupReceivedEmailSubject } from "./templates/betaSignupReceived";
import { betaThanksEmailSubject } from "./templates/betaThanks";

const SIGNUP_SUBJECT = betaSignupReceivedEmailSubject();
const CHECK_IN_NOT_STARTED_SUBJECT = betaNotYetStartedEmailSubject();
const CHECK_IN_ACTIVE_SUBJECT = betaActiveUserCheckInEmailSubject();
const WELCOME_IOS_SUBJECT = betaThanksEmailSubject("ios");
const WELCOME_ANDROID_SUBJECT = betaThanksEmailSubject("android");

/** Resend tag value when present (beta_signup_received, beta_welcome, beta_check_in). */
export function betaEmailKindFromResendTag(tagValue: string | undefined): BetaEmailKind | null {
  if (!tagValue) return null;
  if (tagValue === "beta_signup_received") return "signup_received";
  if (tagValue === "beta_welcome") return "welcome";
  if (tagValue === "beta_check_in") return "check_in";
  if (tagValue === "beta_check_in_active") return "check_in_active";
  return null;
}

export function betaEmailKindFromSubject(subject: string | undefined): BetaEmailKind | null {
  const normalized = subject?.trim() ?? "";
  if (!normalized) return null;
  if (normalized === SIGNUP_SUBJECT) return "signup_received";
  if (
    normalized === CHECK_IN_NOT_STARTED_SUBJECT ||
    normalized === "Quick check-in — Pinporium beta"
  ) {
    return "check_in";
  }
  if (
    normalized === CHECK_IN_ACTIVE_SUBJECT ||
    normalized === "Quick check-in — how's Pinporium going?"
  ) {
    return "check_in_active";
  }
  if (normalized === WELCOME_IOS_SUBJECT || normalized === WELCOME_ANDROID_SUBJECT) {
    return "welcome";
  }
  if (normalized.startsWith("Welcome to the Pinporium beta")) return "welcome";
  return null;
}
