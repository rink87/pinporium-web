import {
  EMAIL_WORDMARK_HEIGHT,
  EMAIL_WORDMARK_WIDTH,
  emailTheme,
  getEmailAssetUrls,
} from "./theme";

export function emailLayout({
  previewText,
  title,
  bodyHtml,
  footerHtml,
  assetsBaseUrl,
  wordmarkSrc,
}: {
  previewText: string;
  title: string;
  bodyHtml: string;
  footerHtml?: string;
  /** Override asset host (optional; preview uses inline wordmark instead) */
  assetsBaseUrl?: string;
  /** Dev preview: data URI so iframe sandbox does not block localhost images */
  wordmarkSrc?: string;
}) {
  const t = emailTheme;
  const assets = getEmailAssetUrls(assetsBaseUrl, {
    wordmarkSrc: wordmarkSrc,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${t.background};font-family:${t.fontBody};color:${t.foreground};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${t.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${t.cream};border-radius:12px;border:1px solid rgba(201,168,76,0.35);overflow:hidden;box-shadow:0 12px 40px -16px rgba(44,51,69,0.25);">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, ${t.secondary} 0%, ${t.gold} 50%, ${t.primary} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 16px;text-align:center;background-color:${t.heroBackground};">
              <a href="${assets.siteUrl}" style="text-decoration:none;">
                <img src="${assets.wordmarkUrl}" width="${EMAIL_WORDMARK_WIDTH}" height="${EMAIL_WORDMARK_HEIGHT}" alt="Pinporium" style="display:block;margin:0 auto;border:0;max-width:100%;height:auto;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;font-size:16px;line-height:1.6;color:${t.foreground};">
              ${bodyHtml}
            </td>
          </tr>
          ${
            footerHtml
              ? `<tr><td style="padding:0 32px 28px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};border-top:1px solid rgba(201,168,76,0.25);">${footerHtml}</td></tr>`
              : ""
          }
        </table>
        <p style="margin:20px 0 0;font-size:12px;color:${t.foregroundAccent};text-align:center;">
          <a href="${assets.siteUrl}" style="color:${t.secondary};text-decoration:none;">pinporium.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
