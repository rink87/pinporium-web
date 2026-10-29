import type { Metadata } from "next";
import Link from "next/link";

import { AuthenticityAppealForm } from "@/components/AuthenticityAppealForm";
import { siteDetails } from "@/data/siteDetails";
import {
  resolveAuthenticityAppealSecret,
  verifyAuthenticityAppealToken,
} from "@/lib/authenticityAppealToken";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Authenticity re-review — ${siteDetails.siteName}`,
  description: "Request a re-review if you believe your pin is an authentic original.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function AuthenticityAppealPage({ searchParams }: PageProps) {
  const token = firstParam(searchParams.t)?.trim() ?? "";
  const secret = resolveAuthenticityAppealSecret();
  const payload =
    token && secret ? verifyAuthenticityAppealToken(token, secret) : null;

  return (
    <main className="min-h-[70vh] bg-cream pt-28 md:pt-32 pb-12 sm:pb-16">
      <div className="mx-auto max-w-lg px-5">
        <h1 className="font-display text-3xl text-navy mb-2">I think mine is authentic</h1>
        <p className="text-[15px] text-foreground-accent leading-relaxed mb-8">
          Unofficial copies are common — and often sold as originals. If you believe yours is a
          genuine release, request a re-review and we&apos;ll look again.
        </p>

        <div className="rounded-xl border border-gold-deco/30 bg-white/90 p-5 sm:p-6 shadow-sm">
          {!secret ? (
            <p className="text-[15px] text-foreground-accent leading-relaxed">
              This form is temporarily unavailable. Email{" "}
              <a
                href={`mailto:${siteDetails.supportEmail}`}
                className="text-secondary-ink font-semibold underline"
              >
                {siteDetails.supportEmail}
              </a>{" "}
              and we&apos;ll help.
            </p>
          ) : !payload ? (
            <div className="space-y-4">
              <p className="text-[15px] text-foreground-accent leading-relaxed">
                This link is invalid or has expired. Open the pin in your vault in the Pinporium
                app and tap <strong>I think mine is authentic</strong>, or email{" "}
                <a
                  href={`mailto:${siteDetails.supportEmail}`}
                  className="text-secondary-ink font-semibold underline"
                >
                  {siteDetails.supportEmail}
                </a>
                .
              </p>
              <Link href="/" className="inline-block text-sm text-secondary-ink underline">
                Back to Pinporium
              </Link>
            </div>
          ) : (
            <AuthenticityAppealForm
              token={token}
              designName={payload.d}
              artistName={payload.a}
            />
          )}
        </div>
      </div>
    </main>
  );
}
