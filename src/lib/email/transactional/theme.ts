import { siteDetails } from "@/data/siteDetails";

/** Keep in sync with pinporium/supabase/functions/_shared/email/theme.ts */
export const emailTheme = {
  background: "#f1e5d8",
  heroBackground: "#eadbcc",
  foreground: "#2c3345",
  foregroundAccent: "#524e5f",
  primary: "#e8734a",
  secondary: "#2d8b75",
  gold: "#c9a84c",
  cream: "#fff9f5",
  navyDark: "#1a1a2e",
  cardBorder: "rgba(201, 168, 76, 0.35)",
  fontDisplay: "Georgia, 'Times New Roman', serif",
  fontBody:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

export const transactionalEmailTheme = {
  ...emailTheme,
  background: "#e4e2e6",
  bodyBackground: "#ffffff",
} as const;

export const EMAIL_WORDMARK_WIDTH = 280;
export const EMAIL_WORDMARK_HEIGHT = 56;

export function getEmailAssetsOrigin(override?: string): string {
  const raw =
    override?.replace(/\/$/, "") ??
    process.env.EMAIL_ASSETS_BASE_URL?.replace(/\/$/, "") ??
    siteDetails.siteUrl.replace(/\/$/, "");

  if (raw === "https://pinporium.app") return "https://www.pinporium.app";
  return raw;
}

export function getEmailAssetUrls(
  assetsBaseUrl?: string,
  options?: { wordmarkSrc?: string },
) {
  const origin = getEmailAssetsOrigin(assetsBaseUrl);
  return {
    wordmarkUrl: options?.wordmarkSrc ?? `${origin}/images/logo-wordmark.png`,
    siteUrl: siteDetails.siteUrl.replace(/\/$/, ""),
  };
}
