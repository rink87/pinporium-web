import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { Nunito, Playfair_Display } from "next/font/google";

import { BetaApplyProvider } from "@/components/BetaApplyProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { siteDetails } from "@/data/siteDetails";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteDetails.siteUrl),
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  alternates: {
    canonical: siteDetails.siteUrl,
  },
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: "website",
    // og:image from app/opengraph-image.tsx (1200×630 hero-style card)
  },
  twitter: {
    card: "summary_large_image",
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    // twitter:image from app/twitter-image.tsx (same as Open Graph)
  },
};

const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
  process.env.GOOGLE_ANALYTICS_ID?.trim() ||
  "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${nunito.variable} font-body`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
        <BetaApplyProvider>
          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </BetaApplyProvider>
        <Analytics />
      </body>
    </html>
  );
}
