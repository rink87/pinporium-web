"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy app URL — preserves #v1-0-3 anchors when opening from the app. */
export default function BetaChangelogRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    router.replace(`/changelog${hash}`);
  }, [router]);

  return null;
}
