import type { Metadata } from "next";

import { PartnerToolsSurveyForm } from "@/components/artists/PartnerToolsSurveyForm";
import Container from "@/components/Container";
import { PARTNERS_EMAIL } from "@/lib/partners/constants";
import {
  parsePartnerToolsSurveyBrandParam,
  parsePartnerToolsSurveyEmailParam,
  parsePartnerToolsSurveyNameParam,
} from "@/lib/partners/toolsSurvey";
import { siteDetails } from "@/data/siteDetails";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Artist tools survey — ${siteDetails.siteName}`,
  description:
    "Tell Pinporium which artist and shop tools would help most as a partner.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function PartnerToolsSurveyPage({ searchParams }: PageProps) {
  const initialEmail = parsePartnerToolsSurveyEmailParam(firstParam(searchParams.email));
  const initialName = parsePartnerToolsSurveyNameParam(firstParam(searchParams.name));
  const initialBrand = parsePartnerToolsSurveyBrandParam(firstParam(searchParams.brand));

  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-cream pt-28 md:pt-32 pb-12 sm:pb-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10 deco-grid opacity-50"
        aria-hidden
      />
      <Container className="max-w-2xl">
        <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
          For partners
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-navy mb-2 tracking-tight">
          Which artist tools would help most?
        </h1>
        <p className="text-[15px] text-foreground-accent leading-relaxed mb-8">
          We&apos;re onboarding early pin artists and shops, and we want to build the tools you
          would actually use. Check what matters, pick a first priority if you have one (~2 minutes).
        </p>
        <div className="rounded-xl border border-gold-deco/30 bg-white/90 p-5 sm:p-6 shadow-sm">
          <PartnerToolsSurveyForm
            initialName={initialName}
            initialEmail={initialEmail}
            initialBrand={initialBrand}
          />
        </div>
        <p className="mt-6 text-sm text-foreground-accent">
          Prefer email? Write to{" "}
          <a href={`mailto:${PARTNERS_EMAIL}`} className="text-secondary-ink font-semibold underline">
            {PARTNERS_EMAIL}
          </a>
          .
        </p>
      </Container>
    </main>
  );
}
