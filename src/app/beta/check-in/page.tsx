import type { Metadata } from "next";

import { BetaActiveFeedbackForm } from "@/components/BetaActiveFeedbackForm";
import { BetaCheckInForm } from "@/components/BetaCheckInForm";
import {
  parseBetaCheckInNameParam,
  parseBetaCheckInPlatformParam,
  parseBetaCheckInReasonParam,
  resolveBetaCheckInAudience,
} from "@/lib/betaCheckIn";
import { normalizeBetaEmail, validateBetaEmail } from "@/lib/betaTester";
import clsx from "clsx";

import { siteDetails } from "@/data/siteDetails";

/** Pre-filled reason/email from email links require request-time searchParams. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Beta feedback — ${siteDetails.siteName}`,
  description:
    "Share Pinporium beta feedback — which features you've used and how key flows felt.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default function BetaCheckInPage({ searchParams }: PageProps) {
  const audienceRaw = firstParam(searchParams.audience);
  const reasonRaw = firstParam(searchParams.reason);
  const audience = resolveBetaCheckInAudience(audienceRaw, reasonRaw);
  const reason = parseBetaCheckInReasonParam(reasonRaw, audience);
  const platform = parseBetaCheckInPlatformParam(firstParam(searchParams.platform));
  const emailRaw = firstParam(searchParams.email) ?? "";
  const initialEmail =
    emailRaw && !validateBetaEmail(emailRaw) ? normalizeBetaEmail(emailRaw) : "";
  const initialName = parseBetaCheckInNameParam(firstParam(searchParams.name));

  const isFullActiveFeedback = audience === "active";
  const isNoPinsCheckIn = audience === "active_no_pins";

  return (
    <main className="min-h-[70vh] bg-cream pt-28 md:pt-32 pb-12 sm:pb-16">
      <div
        className={clsx(
          "mx-auto px-5",
          isFullActiveFeedback ? "max-w-2xl" : "max-w-lg",
        )}
      >
        <h1 className="font-display text-3xl text-navy mb-2">
          {isFullActiveFeedback ? "Beta feature feedback" : "Beta check-in"}
        </h1>
        <p className="text-[15px] text-foreground-accent leading-relaxed mb-8">
          {isFullActiveFeedback ? (
            <>
              Thanks for using Pinporium — this form helps us prioritize what to fix and build next.
              Check the features you&apos;ve tried, rate a couple of key flows, and add anything else
              on your mind (~3 minutes).
            </>
          ) : isNoPinsCheckIn ? (
            <>
              Thanks for signing into Pinporium — we&apos;d love to know what&apos;s in the way of
              adding your first pin.
              {reason
                ? " Your email link pre-selected an option below; change it if another fits better."
                : null}
            </>
          ) : (
            <>
              You signed up for the Pinporium beta — we&apos;d love to know what&apos;s in the way.
              {reason
                ? " Your email link pre-selected an option below; change it if another fits better."
                : null}
            </>
          )}
        </p>
        <div className="rounded-xl border border-gold-deco/30 bg-white/90 p-5 sm:p-6 shadow-sm">
          {isFullActiveFeedback ? (
            <BetaActiveFeedbackForm
              initialEmail={initialEmail}
              initialName={initialName}
              initialPlatform={platform}
            />
          ) : (
            <BetaCheckInForm
              audience={audience}
              initialReason={reason}
              initialEmail={initialEmail}
              initialName={initialName}
              initialPlatform={platform}
            />
          )}
        </div>
        <p className="mt-6 text-sm text-foreground-accent">
          Prefer email? Write to{" "}
          <a href={`mailto:${siteDetails.supportEmail}`} className="text-secondary-ink font-semibold underline">
            {siteDetails.supportEmail}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
