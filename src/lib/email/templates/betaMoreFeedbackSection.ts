import { emailImageLink, emailSectionHeading } from "../blocks";
import { BETA_DISCORD_URL } from "../constants";
import {
  EMAIL_DISCORD_BUTTON_HEIGHT,
  EMAIL_DISCORD_BUTTON_WIDTH,
  emailTheme,
  getEmailAssetUrls,
} from "../theme";

export function betaMoreFeedbackSection(assetsBaseUrl?: string) {
  const t = emailTheme;
  const assets = getEmailAssetUrls(assetsBaseUrl);

  return `
    ${emailSectionHeading("Have more feedback?")}
    <p style="margin:0 0 8px;color:${t.foreground};font-size:15px;line-height:1.6;">Submit through the app or join our Discord.</p>
    ${emailImageLink({
      href: BETA_DISCORD_URL,
      imageUrl: assets.discordJoinButtonUrl,
      alt: "Join us on Discord",
      width: EMAIL_DISCORD_BUTTON_WIDTH,
      height: EMAIL_DISCORD_BUTTON_HEIGHT,
    })}
  `;
}
