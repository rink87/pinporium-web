"use client";

import Link from "next/link";

import BetaApplyLink from "./BetaApplyLink";
import { footerDetails } from "@/data/footer";

const FooterQuickLinks: React.FC = () => {
  return (
    <ul className="text-cream/75 space-y-2 font-body">
      {footerDetails.quickLinks.map((link) => (
        <li key={link.text}>
          {link.text === "Apply for beta" ? (
            <BetaApplyLink className="hover:text-gold transition-colors">
              {link.text}
            </BetaApplyLink>
          ) : (
            <Link href={link.url} className="hover:text-gold transition-colors">
              {link.text}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FooterQuickLinks;
