import Link from "next/link";

import BetaApplyButton from "@/components/BetaApplyButton";
import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";
import type { SeoLandingPage } from "@/data/seoLandings";
import { getSeoLanding } from "@/data/seoLandings";
import { siteDetails } from "@/data/siteDetails";

type Props = {
  page: SeoLandingPage;
};

function landingJsonLd(page: SeoLandingPage) {
  const url = `${siteDetails.siteUrl}${page.path}`;
  return [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.metaTitle,
      description: page.metaDescription,
      isPartOf: { "@id": `${siteDetails.siteUrl}/#website` },
      about: { "@id": `${siteDetails.siteUrl}/#app` },
      inLanguage: siteDetails.locale,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteDetails.siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.heading,
          item: url,
        },
      ],
    },
  ];
}

const LandingPage: React.FC<Props> = ({ page }) => {
  const related = page.relatedSlugs
    .map((slug) => getSeoLanding(slug))
    .filter((p): p is SeoLandingPage => Boolean(p));

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 deco-grid opacity-50"
        aria-hidden
      />
      <JsonLd data={landingJsonLd(page)} />

      <article className="pt-28 md:pt-32 pb-16 md:pb-20">
        <Container className="max-w-3xl">
          <header className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
              {page.eyebrow}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight text-balance">
              {page.heading}
            </h1>
            <p className="mt-5 text-foreground-accent font-body leading-relaxed text-lg">
              {page.subheading}
            </p>
            <div className="mt-8 flex justify-center">
              <BetaApplyButton label="Apply for beta access" />
            </div>
          </header>

          <div className="mt-14 md:mt-16 space-y-12">
            {page.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="font-display text-2xl md:text-3xl text-navy mb-4">
                  {section.title}
                </h2>
                <div className="space-y-4 font-body text-foreground-accent leading-relaxed">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-4 list-disc pl-6 space-y-2 font-body text-foreground-accent leading-relaxed">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <aside className="mt-14 rounded-deco border border-gold-deco/25 bg-cream/90 p-8 md:p-10 text-center shadow-card">
            <h2 className="font-display text-2xl text-navy mb-3">
              {page.ctaHeading ?? "Join the Pinporium beta"}
            </h2>
            <p className="text-foreground-accent font-body leading-relaxed max-w-lg mx-auto">
              {page.ctaSubheading ??
                "Apply for early access on iOS (TestFlight) and Android (Google Play internal testing)."}
            </p>
            <div className="mt-6 flex justify-center">
              <BetaApplyButton />
            </div>
            {siteDetails.supportEmail ? (
              <p className="mt-5 text-sm text-foreground-accent font-body">
                Questions?{" "}
                <a
                  href={`mailto:${siteDetails.supportEmail}`}
                  className="text-secondary font-semibold hover:underline"
                >
                  {siteDetails.supportEmail}
                </a>
              </p>
            ) : null}
          </aside>

          {related.length > 0 ? (
            <nav
              className="mt-12 pt-10 border-t border-gold-deco/20"
              aria-label="Related pages"
            >
              <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-4">
                Explore
              </p>
              <ul className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6">
                {related.map((rel) => (
                  <li key={rel.slug}>
                    <Link
                      href={rel.path}
                      className="font-body text-secondary font-semibold hover:underline"
                    >
                      {rel.eyebrow}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/changelog"
                    className="font-body text-secondary font-semibold hover:underline"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </nav>
          ) : null}

          <p className="mt-10 text-center font-body text-foreground-accent">
            <Link href="/" className="text-secondary font-semibold hover:underline">
              ← Back to home
            </Link>
          </p>
        </Container>
      </article>
    </div>
  );
};

export default LandingPage;
