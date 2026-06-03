import { siteDetails } from "@/data/siteDetails";

type JsonLdNode = Record<string, unknown>;

export function jsonLdGraph(nodes: JsonLdNode[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  });
}

export function organizationJsonLd(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${siteDetails.siteUrl}/#organization`,
    name: siteDetails.siteName,
    url: siteDetails.siteUrl,
    logo: `${siteDetails.siteUrl}/images/logo-wordmark.png`,
    email: siteDetails.supportEmail,
  };
}

export function websiteJsonLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${siteDetails.siteUrl}/#website`,
    name: siteDetails.siteName,
    url: siteDetails.siteUrl,
    description: siteDetails.metadata.description,
    publisher: { "@id": `${siteDetails.siteUrl}/#organization` },
    inLanguage: siteDetails.locale,
  };
}

export function mobileApplicationJsonLd(): JsonLdNode {
  return {
    "@type": "MobileApplication",
    "@id": `${siteDetails.siteUrl}/#app`,
    name: siteDetails.siteName,
    url: siteDetails.siteUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android",
    description: siteDetails.metadata.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      description: "Beta via TestFlight (iOS) and Google Play internal testing (Android). Apply on the website.",
    },
    publisher: { "@id": `${siteDetails.siteUrl}/#organization` },
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${siteDetails.siteUrl}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
