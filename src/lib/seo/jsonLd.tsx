import { siteDetails } from "@/data/siteDetails";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/data/storeLinks";

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
    downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    installUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: APP_STORE_URL,
      description:
        "Free on the App Store for iPhone and on Google Play for Android.",
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
