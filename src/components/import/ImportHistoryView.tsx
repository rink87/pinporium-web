"use client";

import Link from "next/link";
import { useWebAuth } from "@/components/auth/WebAuthProvider";
import { ImportCard, ImportPageChrome } from "@/components/import/ImportShell";
import { ImportHistoryPanel } from "@/components/import/ImportHistoryPanel";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export function ImportHistoryView() {
  const { session, loading: authLoading } = useWebAuth();
  const supabase = getSupabaseBrowser();

  if (authLoading) {
    return (
      <ImportPageChrome
        title="Import history"
        subtitle="Past imports and their results. Revert an import to remove its pins from your vault."
      >
        <ImportCard>
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded-deco bg-navy/5" />
            <div className="h-24 rounded-deco bg-navy/5" />
          </div>
        </ImportCard>
      </ImportPageChrome>
    );
  }

  if (!session || !supabase) {
    return (
      <ImportPageChrome
        title="Sign in to view import history"
        subtitle="Your past vault imports and revert options are available after you sign in."
      >
        <ImportCard className="max-w-lg mx-auto text-center">
          <Link
            href="/import"
            className="inline-flex items-center justify-center rounded-deco bg-primary px-5 py-3 text-white font-bold font-body hover:opacity-90"
          >
            Sign in on the import page
          </Link>
        </ImportCard>
      </ImportPageChrome>
    );
  }

  return (
    <ImportPageChrome
      title="Import history"
      subtitle="Past imports and their results. Revert an import to remove its pins from your vault."
    >
      <ImportHistoryPanel supabase={supabase} showEmptyState />
    </ImportPageChrome>
  );
}
