import type { MetadataRoute } from "next";

import { RELEASE_NOTES } from "@/content/release-notes";
import { SEO_LANDING_PAGES } from "@/data/seoLandings";
import { siteDetails } from "@/data/siteDetails";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: siteDetails.siteUrl,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${siteDetails.siteUrl}/roadmap`,
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${siteDetails.siteUrl}/changelog`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  ...SEO_LANDING_PAGES.map((page) => ({
    url: `${siteDetails.siteUrl}${page.path}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  })),
  {
    url: `${siteDetails.siteUrl}/privacy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${siteDetails.siteUrl}/terms`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${siteDetails.siteUrl}/delete-account`,
    changeFrequency: "yearly",
    priority: 0.25,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const latestNoteDate = RELEASE_NOTES[0]?.date;

  return staticRoutes.map((entry) => {
    const isHome = entry.url === siteDetails.siteUrl;
    const isRoadmap = entry.url.endsWith("/roadmap");
    const isChangelog = entry.url.endsWith("/changelog");
    const lastModified =
      (isHome || isRoadmap || isChangelog) && latestNoteDate
        ? new Date(`${latestNoteDate}T12:00:00`)
        : undefined;

    return lastModified ? { ...entry, lastModified } : entry;
  });
}
