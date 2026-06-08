import { escapeHtml } from "../blocks";
import {
  EMAIL_WORDMARK_HEIGHT,
  EMAIL_WORDMARK_WIDTH,
  emailTheme,
  getEmailAssetUrls,
  transactionalEmailTheme,
} from "./theme";

/** Keep in sync with pinporium/supabase/functions/_shared/email/transactionalLayout.ts */
export function transactionalEmailLayout(args: {
  previewText: string;
  title: string;
  bodyHtml: string;
  footerHtml?: string;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}): string {
  const t = transactionalEmailTheme;
  const assets = getEmailAssetUrls(args.assetsBaseUrl, {
    wordmarkSrc: args.wordmarkSrc,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(args.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${t.background};font-family:${t.fontBody};color:${t.foreground};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(args.previewText)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${t.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${emailTheme.cream};border-radius:12px;border:1px solid ${emailTheme.cardBorder};overflow:hidden;box-shadow:0 12px 40px -16px rgba(44,51,69,0.25);">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, ${emailTheme.secondary} 0%, ${emailTheme.gold} 50%, ${emailTheme.primary} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td bgcolor="${emailTheme.heroBackground}" style="padding:28px 32px 16px;text-align:center;background-color:${emailTheme.heroBackground};">
              <a href="${assets.siteUrl}" style="text-decoration:none;">
                <img src="${assets.wordmarkUrl}" width="${EMAIL_WORDMARK_WIDTH}" height="${EMAIL_WORDMARK_HEIGHT}" alt="Pinporium" style="display:block;margin:0 auto;border:0;max-width:100%;height:auto;" />
              </a>
            </td>
          </tr>
          <tr>
            <td bgcolor="${t.bodyBackground}" style="padding:8px 32px 28px;font-size:16px;line-height:1.6;color:${t.foreground};background-color:${t.bodyBackground};">
              ${args.bodyHtml}
            </td>
          </tr>
          ${
            args.footerHtml
              ? `<tr><td bgcolor="${t.bodyBackground}" style="padding:0 32px 28px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};border-top:1px solid rgba(201,168,76,0.25);background-color:${t.bodyBackground};">${args.footerHtml}</td></tr>`
              : ""
          }
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
