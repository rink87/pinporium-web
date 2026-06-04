import type { Metadata } from "next";

import { BetaCheckInForm } from "@/components/BetaCheckInForm";
import {
  parseBetaCheckInPlatformParam,
  parseBetaCheckInReasonParam,
} from "@/lib/betaCheckIn";
import { normalizeBetaEmail, validateBetaEmail } from "@/lib/betaTester";
import { siteDetails } from "@/data/siteDetails";

/** Pre-filled reason/email from email links require request-time searchParams. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Beta check-in — ${siteDetails.siteName}`,
  description:
    "Tell us what's keeping you from trying the Pinporium beta — quick one-minute form.",
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
  const reason = parseBetaCheckInReasonParam(firstParam(searchParams.reason));
  const platform = parseBetaCheckInPlatformParam(firstParam(searchParams.platform));
  const emailRaw = firstParam(searchParams.email) ?? "";
  const initialEmail =
    emailRaw && !validateBetaEmail(emailRaw) ? normalizeBetaEmail(emailRaw) : "";

  return (
    <main className="min-h-[70vh] bg-cream">
      <div className="mx-auto max-w-lg px-5 py-12 sm:py-16">
        <h1 className="font-display text-3xl text-navy mb-2">Beta check-in</h1>
        <p className="text-[15px] text-foreground-accent leading-relaxed mb-8">
          You signed up for the Pinporium beta — we&apos;d love to know what&apos;s in the way.
          {reason ? " Your email link pre-selected an option below; change it if another fits better." : null}
        </p>
        <div className="rounded-xl border border-gold-deco/30 bg-white/90 p-5 sm:p-6 shadow-sm">
          <BetaCheckInForm
            initialReason={reason}
            initialEmail={initialEmail}
            initialPlatform={platform}
          />
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
