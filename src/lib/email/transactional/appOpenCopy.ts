import { emailTheme } from "./theme";

/** Preview / send copy — keep in sync with pinporium edge appOpenCopy.ts */
export function emailAppLoginSection(): string {
  const t = emailTheme;
  return `
    <p style="margin:0 0 4px;font-family:${t.fontDisplay};font-size:18px;font-weight:600;color:${t.foreground};">See it in the app</p>
    <p style="margin:0;font-size:15px;line-height:1.55;color:${t.foreground};">Log in to the Pinporium app to view your catalog listing, check <strong>My Submissions</strong>, or share your pin.</p>`;
}
