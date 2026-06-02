import { emailTheme } from "./theme";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailSectionHeading(text: string) {
  const t = emailTheme;
  return `<p style="margin:24px 0 12px;font-family:${t.fontDisplay};font-size:18px;font-weight:600;color:${t.foreground};">${text}</p>`;
}

/** Email-safe checklist (□ renders consistently in clients). */
export function emailChecklist(items: string[]) {
  const t = emailTheme;
  const rows = items
    .map(
      (item) =>
        `<tr><td style="padding:0 0 10px 0;vertical-align:top;width:22px;color:${t.secondary};font-size:16px;line-height:1.5;">□</td><td style="padding:0 0 10px 0;color:${t.foreground};font-size:15px;line-height:1.5;">${item}</td></tr>`,
    )
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px;width:100%;">${rows}</table>`;
}

/** Scenario-style prompts (title + narrative body). */
export function emailUserStories(
  stories: { title: string; bodyHtml: string }[],
) {
  const t = emailTheme;
  return stories
    .map(
      (story) =>
        `<p style="margin:0 0 16px;color:${t.foreground};font-size:15px;line-height:1.55;"><strong style="color:${t.foreground};">${escapeHtml(story.title)}</strong> — ${story.bodyHtml}</p>`,
    )
    .join("");
}

export function emailButton(href: string, label: string) {
  const t = emailTheme;
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:20px auto;">
      <tr>
        <td style="border-radius:8px;background-color:${t.secondary};">
          <a href="${safeHref}" style="display:inline-block;padding:14px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">${safeLabel}</a>
        </td>
      </tr>
    </table>`;
}

/** Clickable banner image (e.g. official Discord join graphic). */
export function emailImageLink({
  href,
  imageUrl,
  alt,
  width,
  height,
}: {
  href: string;
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
}) {
  const safeHref = escapeHtml(href);
  const safeUrl = escapeHtml(imageUrl);
  const safeAlt = escapeHtml(alt);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:20px auto;">
      <tr>
        <td align="center">
          <a href="${safeHref}" style="text-decoration:none;display:inline-block;">
            <img src="${safeUrl}" width="${width}" height="${height}" alt="${safeAlt}" style="display:block;border:0;max-width:100%;height:auto;border-radius:8px;" />
          </a>
        </td>
      </tr>
    </table>`;
}

/** Google Play–style CTA for internal testing (email-safe table layout). */
export function emailPlayInternalButton(href: string) {
  const safeHref = escapeHtml(href);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:20px auto;">
      <tr>
        <td align="center" style="border-radius:6px;background-color:#01875f;">
          <a href="${safeHref}" style="display:block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;white-space:nowrap;">Get Pinporium on Google Play</a>
        </td>
      </tr>
    </table>`;
}

/** Sign in with Apple–style CTA for TestFlight (email-safe table layout). */
export function emailAppleTestFlightButton(href: string) {
  const safeHref = escapeHtml(href);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:20px auto;">
      <tr>
        <td align="center" style="border-radius:6px;background-color:#000000;">
          <a href="${safeHref}" style="display:block;padding:14px 28px;text-decoration:none;">
            <table role="presentation" cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:32px;line-height:1;color:#ffffff;padding-right:12px;vertical-align:middle;">&#63743;</td>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:600;line-height:1.2;color:#ffffff;vertical-align:middle;white-space:nowrap;">Install on TestFlight</td>
              </tr>
            </table>
          </a>
        </td>
      </tr>
    </table>`;
}
