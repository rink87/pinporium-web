import type { Metadata } from "next";

import { ImportHistoryView } from "@/components/import/ImportHistoryView";

export const metadata: Metadata = {
  title: "Import history",
  description: "Review past vault imports, see results, and revert imports when needed.",
  robots: { index: false, follow: false },
};

export default function ImportHistoryPage() {
  return <ImportHistoryView />;
}
