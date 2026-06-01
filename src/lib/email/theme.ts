import { siteDetails } from "@/data/siteDetails";

/** Brand tokens aligned with pinporium-web globals.css (inline styles for email clients). */
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
  fontDisplay: "Georgia, 'Times New Roman', serif",
  fontBody:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

/** logo-wordmark.png intrinsic size (697×140) — used for email img height/width */
export const EMAIL_WORDMARK_WIDTH = 280;
export const EMAIL_WORDMARK_HEIGHT = 56;

const WORDMARK_PATH = "/images/logo-wordmark.png";
const DISCORD_JOIN_BUTTON_PATH = "/images/discord-join-button.png";

/** discord-join-button.png intrinsic size (800×272) — display size in email */
export const EMAIL_DISCORD_BUTTON_WIDTH = 260;
export const EMAIL_DISCORD_BUTTON_HEIGHT = 88;

/**
 * Public HTTPS origin for email images (must be absolute — not a filesystem path).
 * Uses www to avoid apex→www redirects that some clients block for images.
 */
export function getEmailAssetsOrigin(override?: string) {
  const raw =
    override?.replace(/\/$/, "") ??
    process.env.EMAIL_ASSETS_BASE_URL?.replace(/\/$/, "") ??
    siteDetails.siteUrl.replace(/\/$/, "");

  if (raw === "https://pinporium.app") {
    return "https://www.pinporium.app";
  }
  return raw;
}

export function getEmailAssetUrls(
  assetsBaseUrl?: string,
  options?: { wordmarkSrc?: string },
) {
  const origin = getEmailAssetsOrigin(assetsBaseUrl);
  return {
    wordmarkUrl:
      options?.wordmarkSrc ?? `${origin}${WORDMARK_PATH}`,
    discordJoinButtonUrl: `${origin}${DISCORD_JOIN_BUTTON_PATH}`,
    siteUrl: siteDetails.siteUrl.replace(/\/$/, ""),
  };
}
