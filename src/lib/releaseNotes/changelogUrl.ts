import { siteDetails } from "@/data/siteDetails";

export const CHANGELOG_BASE_PATH = "/changelog";

export function changelogUrl(version?: string): string {
  const base = `${siteDetails.siteUrl}${CHANGELOG_BASE_PATH}`;
  if (!version) return base;
  return `${base}#v${version.replace(/\./g, "-")}`;
}
