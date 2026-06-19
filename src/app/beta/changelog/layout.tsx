import type { Metadata } from "next";

/** Legacy app URL — redirects client-side to /changelog (preserves version anchors). */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BetaChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
