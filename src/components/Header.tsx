"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { HiOutlineXMark, HiBars3 } from "react-icons/hi2";

import { HeaderUserMenu } from "./auth/HeaderUserMenu";
import { useWebAuth } from "./auth/WebAuthProvider";
import BetaApplyButton from "./BetaApplyButton";
import { useBetaApply } from "./BetaApplyProvider";
import Container from "./Container";
import { siteDetails } from "@/data/siteDetails";
import { menuItems } from "@/data/menuItems";

const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, loading: authLoading } = useWebAuth();
  const { openBetaApply } = useBetaApply();
  const [isOpen, setIsOpen] = useState(false);

  const isImportTool = pathname.startsWith("/import");
  const showMarketingNav = !(isImportTool && user);
  const showUserMenu = !authLoading && Boolean(user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-cream/90 backdrop-blur-md fixed top-0 left-0 right-0 md:absolute z-50 mx-auto w-full border-b border-gold-deco/15 md:border-b-0">
      <Container className="!px-0">
        <nav className="shadow-sm md:shadow-none md:bg-transparent mx-auto flex justify-between items-center gap-4 py-3 px-5 md:py-6 lg:py-8">
          <Link
            href="/"
            className="flex items-center group shrink-0 min-w-0 max-w-[min(100%,min(92vw,440px))] sm:max-w-[480px] md:max-w-[520px] lg:max-w-[580px]"
          >
            <Image
              src={siteDetails.siteLogo}
              alt="Pinporium"
              width={siteDetails.logoWidth}
              height={siteDetails.logoHeight}
              sizes="(max-width: 768px) 160px, 240px"
              className="h-9 w-auto object-contain object-left sm:h-10 md:h-11 lg:h-12"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8 shrink-0">
            {showMarketingNav
              ? menuItems.map(item => (
                  <li key={item.text}>
                    <Link
                      href={item.url}
                      className="text-navy hover:text-primary-ink text-sm uppercase tracking-deco font-body transition-colors"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))
              : null}
            <li>
              {showUserMenu ? (
                <HeaderUserMenu />
              ) : (
                <BetaApplyButton dark compact label="Apply for beta" />
              )}
            </li>
          </ul>

          <div className="md:hidden flex items-center shrink-0 gap-2">
            {showUserMenu ? <HeaderUserMenu /> : null}
            {showMarketingNav ? (
              <button
                onClick={toggleMenu}
                type="button"
                className="bg-navy text-cream focus:outline-none rounded-full w-10 h-10 flex items-center justify-center border border-gold-deco/25"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <HiBars3 className="h-6 w-6" aria-hidden="true" />
                )}
                <span className="sr-only">Toggle navigation</span>
              </button>
            ) : null}
          </div>
        </nav>
      </Container>

      <Transition
        show={isOpen && showMarketingNav}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div id="mobile-menu" className="md:hidden bg-cream-warm border-t border-gold-deco/20 shadow-lg">
          <ul className="flex flex-col space-y-4 pt-2 pb-6 px-6">
            {menuItems.map(item => (
              <li key={item.text}>
                <Link
                  href={item.url}
                  className="text-navy hover:text-primary-ink block font-body"
                  onClick={toggleMenu}
                >
                  {item.text}
                </Link>
              </li>
            ))}
            {!showUserMenu ? (
              <li>
                <button
                  type="button"
                  className="text-cream bg-navy px-5 py-2.5 rounded-full block w-fit text-sm uppercase tracking-deco font-body border border-gold-deco/30"
                  onClick={() => {
                    setIsOpen(false);
                    openBetaApply();
                  }}
                >
                  Apply for beta
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
