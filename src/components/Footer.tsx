import Link from "next/link";
import Image from "next/image";
import React from "react";

import FooterQuickLinks from "./FooterQuickLinks";
import { siteDetails } from "@/data/siteDetails";
import { footerDetails } from "@/data/footer";
import { getPlatformIconByName } from "@/utils";

const Footer: React.FC = () => {
  const socialEntries = footerDetails.socials
    ? Object.keys(footerDetails.socials).filter(
        (k) => footerDetails.socials[k as keyof typeof footerDetails.socials],
      )
    : [];

  return (
    <footer className="bg-deco-dark text-cream py-14 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            315deg,
            transparent,
            transparent 40px,
            rgba(240, 185, 97, 0.5) 40px,
            rgba(240, 185, 97, 0.5) 41px
          )`,
        }}
        aria-hidden
      />
      <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        <div>
          <Link href="/" className="inline-block w-full max-w-lg">
            <Image
              src={siteDetails.siteLogo}
              alt="Pinporium"
              width={siteDetails.logoWidth}
              height={siteDetails.logoHeight}
              className="h-12 w-auto object-contain object-left sm:h-14 md:h-16 lg:h-[4.25rem]"
            />
          </Link>
          <p className="mt-4 text-cream/70 text-base leading-relaxed max-w-sm">
            {footerDetails.subheading}
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-deco-wide text-gold mb-4 font-body">
            Explore
          </h4>
          <FooterQuickLinks />
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-deco-wide text-gold mb-4 font-body">
            Legal
          </h4>
          <ul className="text-cream/75 space-y-2 font-body">
            {footerDetails.legalLinks.map((link) => (
              <li key={link.text}>
                <Link href={link.url} className="hover:text-gold transition-colors">
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-deco-wide text-gold mb-4 font-body">
            Connect
          </h4>
          {footerDetails.email ? (
            <a
              href={`mailto:${footerDetails.email}`}
              className="block text-cream/75 hover:text-gold transition-colors font-body"
            >
              {footerDetails.email}
            </a>
          ) : (
            <p className="text-cream/70 text-sm font-body">
              Public inbox coming soon — follow announcements on social when we
              open them.
            </p>
          )}
          {siteDetails.supportTipUrl ? (
            <a
              href={siteDetails.supportTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-body text-gold hover:bg-gold/20 hover:border-gold/60 transition-colors"
            >
              {siteDetails.supportTipLabel}
            </a>
          ) : null}
          {footerDetails.telephone && (
            <a
              href={`tel:${footerDetails.telephone}`}
              className="block text-cream/75 hover:text-gold mt-2 font-body"
            >
              {footerDetails.telephone}
            </a>
          )}
          {socialEntries.length > 0 && (
            <div className="mt-5 flex items-center gap-5 flex-wrap">
              {socialEntries.map((platformName) => {
                const url = footerDetails.socials[platformName];
                if (!url) return null;
                return (
                  <Link
                    href={url}
                    key={platformName}
                    aria-label={platformName}
                    className="text-cream/80 hover:text-gold transition-colors"
                  >
                    {getPlatformIconByName(platformName)}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-12 md:text-center text-cream/70 px-6 text-sm font-body relative z-10">
        <p>
          Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}.
          All rights reserved.
        </p>
        <p className="mt-3 text-cream/65 text-xs max-w-xl mx-auto">
          <Link href="/privacy" className="hover:text-cream underline">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-cream underline">
            Terms
          </Link>
          {" · "}
          <Link href="/delete-account" className="hover:text-cream underline">
            Delete account
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
