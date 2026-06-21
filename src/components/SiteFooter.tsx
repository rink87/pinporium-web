"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Footer from "./Footer";
import { siteDetails } from "@/data/siteDetails";

export default function SiteFooter() {
  const pathname = usePathname();
  const isImportTool = pathname.startsWith("/import");

  if (isImportTool) {
    return (
      <footer className="border-t border-gold-deco/20 bg-deco-dark text-cream/75 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-body">
          <p>© {new Date().getFullYear()} Pinporium</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${siteDetails.supportEmail}`} className="hover:text-gold-light transition-colors">
              {siteDetails.supportEmail}
            </a>
            <Link href="/" className="hover:text-gold-light transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return <Footer />;
}
