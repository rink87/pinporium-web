import type { MetadataRoute } from "next";

import { siteDetails } from "@/data/siteDetails";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/email-preview", "/beta/", "/for-artists/tools-survey"],
    },
    sitemap: `${siteDetails.siteUrl}/sitemap.xml`,
    host: siteDetails.siteUrl,
  };
}
