import type { Metadata } from "next";

import type { SeoLandingPage } from "@/data/seoLandings";
import { siteDetails } from "@/data/siteDetails";

export function buildLandingMetadata(page: SeoLandingPage): Metadata {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `${siteDetails.siteUrl}${page.path}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${siteDetails.siteUrl}${page.path}`,
      type: "website",
    },
  };
}
