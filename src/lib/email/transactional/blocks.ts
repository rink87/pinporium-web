import { emailTheme } from "./theme";

export function emailCalloutBox(args: {
  title: string;
  bodyHtml: string;
  borderColor?: string;
  backgroundColor?: string;
}): string {
  const t = emailTheme;
  const border = args.borderColor ?? t.gold;
  const bg = args.backgroundColor ?? "rgba(201, 168, 76, 0.12)";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border:1px solid ${border};border-radius:10px;background:${bg};">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0 0 8px;font-family:${t.fontDisplay};font-size:16px;font-weight:600;color:${t.foreground};">${escapeHtml(args.title)}</p>
          <div style="font-size:14px;line-height:1.55;color:${t.foreground};">${args.bodyHtml}</div>
        </td>
      </tr>
    </table>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
