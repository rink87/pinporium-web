import type { BetaEmailKind } from "@/lib/betaApplicationDb";

import { betaNotYetStartedEmailSubject } from "./templates/betaNotYetStarted";
import { betaSignupReceivedEmailSubject } from "./templates/betaSignupReceived";
import { betaThanksEmailSubject } from "./templates/betaThanks";

const SIGNUP_SUBJECT = betaSignupReceivedEmailSubject();
const CHECK_IN_SUBJECT = betaNotYetStartedEmailSubject();
const WELCOME_IOS_SUBJECT = betaThanksEmailSubject("ios");
const WELCOME_ANDROID_SUBJECT = betaThanksEmailSubject("android");

/** Resend tag value when present (beta_signup_received, beta_welcome, beta_check_in). */
export function betaEmailKindFromResendTag(tagValue: string | undefined): BetaEmailKind | null {
  if (!tagValue) return null;
  if (tagValue === "beta_signup_received") return "signup_received";
  if (tagValue === "beta_welcome") return "welcome";
  if (tagValue === "beta_check_in") return "check_in";
  return null;
}

export function betaEmailKindFromSubject(subject: string | undefined): BetaEmailKind | null {
  const normalized = subject?.trim() ?? "";
  if (!normalized) return null;
  if (normalized === SIGNUP_SUBJECT) return "signup_received";
  if (normalized === CHECK_IN_SUBJECT) return "check_in";
  if (normalized === WELCOME_IOS_SUBJECT || normalized === WELCOME_ANDROID_SUBJECT) {
    return "welcome";
  }
  if (normalized.startsWith("Welcome to the Pinporium beta")) return "welcome";
  return null;
}
