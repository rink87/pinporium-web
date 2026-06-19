import type { Metadata } from "next";

import { ForArtistsContent } from "@/components/artists/ForArtistsContent";
import { fetchCatalogArtists } from "@/lib/catalog/publicArtists";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
  title: `For pin artists & shops — ${siteDetails.siteName}`,
  description:
    "Partner with Pinporium or claim your catalog artist profile. Reach collectors who hunt, trade, and sell pins in one app.",
  alternates: {
    canonical: `${siteDetails.siteUrl}/for-artists`,
  },
  openGraph: {
    title: `For pin artists & shops — ${siteDetails.siteName}`,
    description:
      "Apply to partner with Pinporium or claim an existing catalog artist profile.",
    url: `${siteDetails.siteUrl}/for-artists`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function ForArtistsPage() {
  const artists = await fetchCatalogArtists();
  return <ForArtistsContent artists={artists} />;
}
