import type { Metadata } from "next";

import { VaultImportForm } from "@/components/import/VaultImportForm";

export const metadata: Metadata = {
  title: "Import your vault",
  description:
    "Upload a spreadsheet and map columns to import up to 5,000 enamel pins into your Pinporium vault.",
  robots: { index: false, follow: false },
};

export default function ImportPage() {
  return <VaultImportForm />;
}
