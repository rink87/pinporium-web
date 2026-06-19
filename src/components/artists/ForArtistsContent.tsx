import Link from "next/link";

import { CatalogArtistsDirectory } from "@/components/artists/CatalogArtistsDirectory";
import { PartnershipApplyForm } from "@/components/artists/PartnershipApplyForm";
import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";
import type { CatalogArtistDirectoryRow } from "@/lib/catalog/publicArtists";
import { PARTNERS_EMAIL } from "@/lib/partners/constants";
import { siteDetails } from "@/data/siteDetails";

type Props = {
  artists: CatalogArtistDirectoryRow[];
};

export function ForArtistsContent({ artists }: Props) {
  const url = `${siteDetails.siteUrl}/for-artists`;

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 deco-grid opacity-50"
        aria-hidden
      />
      <JsonLd
        data={[
          {
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: `For pin artists & shops — ${siteDetails.siteName}`,
            description:
              "Partner with Pinporium or claim your catalog artist profile. Reach collectors who hunt, trade, and sell pins in one app.",
            isPartOf: { "@id": `${siteDetails.siteUrl}/#website` },
            inLanguage: siteDetails.locale,
          },
        ]}
      />

      <article className="pt-28 md:pt-32 pb-20 md:pb-24">
        <Container className="max-w-4xl">
          <header className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
              Artists & shops
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight text-balance">
              Put your pins where collectors already catalog and trade
            </h1>
            <p className="mt-5 text-foreground-accent font-body leading-relaxed text-lg">
              Pinporium is building a reviewed enamel pin catalog with verified artist listings.
              Apply to partner with us, or claim a profile that collectors already added to the
              catalog.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#apply-partner"
                className="inline-flex rounded-deco bg-navy px-6 py-3 text-sm font-body font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Apply to partner
              </a>
              <a
                href="#catalog-artists"
                className="inline-flex rounded-deco border border-gold-deco/35 bg-cream/80 px-6 py-3 text-sm font-body font-semibold text-navy hover:bg-white transition-colors"
              >
                Find your profile
              </a>
            </div>
          </header>

          <section className="mt-14 md:mt-16 grid gap-6 md:grid-cols-2">
            <div className="rounded-deco border border-gold-deco/25 bg-cream/70 p-6">
              <h2 className="font-display text-xl text-navy mb-2">Become a partner artist</h2>
              <p className="text-foreground-accent font-body text-[15px] leading-relaxed">
                Official partnerships include verified catalog listings, priority onboarding, and
                input on how your releases show up in Discover and collector vaults. Best if
                you&apos;re launching new drops or want help seeding your full catalog.
              </p>
            </div>
            <div className="rounded-deco border border-secondary/20 bg-white/80 p-6 shadow-card">
              <h2 className="font-display text-xl text-navy mb-2">Claim an existing profile</h2>
              <p className="text-foreground-accent font-body text-[15px] leading-relaxed">
                Collectors may have already added your pins to the community catalog. Search below,
                submit a claim, and we&apos;ll verify before linking your account — the same flow
                as <strong className="text-navy font-semibold">Claim this artist profile</strong> in
                the Pinporium app.
              </p>
            </div>
          </section>

          <section id="apply-partner" className="mt-16 md:mt-20 scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-2">
                Partner application
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-navy tracking-tight">
                Apply to partner with Pinporium
              </h2>
              <p className="mt-3 text-foreground-accent font-body leading-relaxed max-w-2xl">
                Tell us about your brand and how you sell. We review every inquiry and follow up
                from {PARTNERS_EMAIL}.
              </p>
            </div>
            <div className="rounded-deco border border-gold-deco/25 bg-cream/60 p-6 md:p-8 shadow-card">
              <PartnershipApplyForm />
            </div>
          </section>

          <section id="catalog-artists" className="mt-16 md:mt-20 scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-2">
                Catalog directory
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-navy tracking-tight">
                Artists in the catalog
              </h2>
              <p className="mt-3 text-foreground-accent font-body leading-relaxed max-w-2xl">
                These artists have approved catalog pins in Pinporium today. If you see your studio,
                tap <strong className="text-navy font-semibold">Claim this profile</strong> to
                request access.
              </p>
            </div>
            <CatalogArtistsDirectory artists={artists} />
          </section>

          <section className="mt-16 rounded-deco border border-gold-deco/20 bg-white/60 p-6 text-center">
            <h2 className="font-display text-lg text-navy">Already in the beta?</h2>
            <p className="mt-2 text-sm text-foreground-accent font-body max-w-xl mx-auto">
              Open any artist page in the app and tap{" "}
              <strong className="text-navy">Claim this artist profile</strong> at the bottom — or
              contact partnerships from Search.
            </p>
          </section>

          <p className="mt-14 text-center font-body text-foreground-accent text-sm">
            <Link href="/" className="text-secondary-ink font-semibold hover:underline">
              ← Back to home
            </Link>
          </p>
        </Container>
      </article>
    </div>
  );
}
