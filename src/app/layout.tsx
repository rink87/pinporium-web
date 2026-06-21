import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";

const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((m) => m.Analytics),
  { ssr: false },
);
import { Nunito, Playfair_Display } from "next/font/google";

import { WebAuthProvider } from "@/components/auth/WebAuthProvider";
import { BetaApplyProvider } from "@/components/BetaApplyProvider";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { siteDetails } from "@/data/siteDetails";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "optional",
  weight: ["600", "700"],
  adjustFontFallback: true,
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "600", "700"],
  adjustFontFallback: true,
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
        <WebAuthProvider>
          <BetaApplyProvider>
            <Header />
            <main className="overflow-x-hidden">{children}</main>
            <SiteFooter />
          </BetaApplyProvider>
        </WebAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
