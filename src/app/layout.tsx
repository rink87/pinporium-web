import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";

const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((m) => m.Analytics),
  { ssr: false },
);
import localFont from "next/font/local";

import { WebAuthProvider } from "@/components/auth/WebAuthProvider";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { siteDetails } from "@/data/siteDetails";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

import "./globals.css";

// Self-hosted to avoid Vercel build failures when fonts.gstatic.com is unreachable
// during `next/font/google` fetches (preview deploy type_error on Google loader).
const playfair = localFont({
  src: [
    { path: "../fonts/PlayfairDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/PlayfairDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "optional",
  adjustFontFallback: "Times New Roman",
});

const nunito = localFont({
  src: [
    { path: "../fonts/Nunito-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Nunito-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Nunito-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: "Arial",
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
          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <SiteFooter />
        </WebAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
