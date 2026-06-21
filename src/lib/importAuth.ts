import type { SupabaseClient } from "@supabase/supabase-js";

import { siteDetails } from "@/data/siteDetails";

/** OAuth return URL after Supabase auth — must be allowlisted in Supabase redirect URLs. */
export function importAuthRedirectUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/import`;
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? siteDetails.siteUrl;
  return `${base}/import`;
}

export type ImportOAuthProvider = "google" | "apple";

export async function startImportOAuthSignIn(
  supabase: SupabaseClient,
  provider: ImportOAuthProvider,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: importAuthRedirectUrl(),
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

/** Read OAuth error params left in the URL after a failed redirect. */
export function readOAuthCallbackError(): string | null {
  if (typeof window === "undefined") return null;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  const raw =
    hashParams.get("error_description") ??
    searchParams.get("error_description") ??
    hashParams.get("error") ??
    searchParams.get("error");

  if (!raw) return null;

  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return raw;
  }
}

export function clearOAuthCallbackParams(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("error") && !url.searchParams.has("error_description") && !url.hash.includes("error")) {
    return;
  }
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  url.hash = "";
  window.history.replaceState({}, "", url.pathname + url.search);
}
