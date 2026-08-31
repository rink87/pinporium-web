"use client";

import Link from "next/link";

import BetaApplyLink from "./BetaApplyLink";
import { footerDetails } from "@/data/footer";

const linkClass = "hover:text-gold transition-colors";

const FooterQuickLinks: React.FC = () => {
  return (
    <ul className="text-cream/75 space-y-2 font-body">
      {footerDetails.quickLinks.map((link) => (
        <li key={link.text}>
          {link.text === "Android beta" ? (
            <BetaApplyLink className={linkClass}>{link.text}</BetaApplyLink>
          ) : link.url.startsWith("http") ? (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.text}
            </a>
          ) : (
            <Link href={link.url} className={linkClass}>
              {link.text}
            </Link>
          )}
        </li>
      ))}
      {footerDetails.exploreLinks?.length ? (
        <>
          <li className="pt-3 text-[10px] uppercase tracking-deco-wide text-gold/80">
            Learn more
          </li>
          {footerDetails.exploreLinks.map((link) => (
            <li key={link.text}>
              <Link href={link.url} className={linkClass}>
                {link.text}
              </Link>
            </li>
          ))}
        </>
      ) : null}
    </ul>
  );
};

export default FooterQuickLinks;
