"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { BiMinus, BiPlus } from "react-icons/bi";

import SectionTitle from "./SectionTitle";
import { faqs } from "@/data/faq";
import { siteDetails } from "@/data/siteDetails";

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-10 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-10">
        <div>
          <p className="hidden lg:block text-foreground-accent text-xs uppercase tracking-deco-wide font-body">
            FAQ
          </p>
          <SectionTitle>
            <h2 className="my-3 !leading-snug lg:max-w-sm text-center lg:text-left font-display">
              Questions collectors ask
            </h2>
          </SectionTitle>
          <p className="lg:mt-8 text-foreground-accent text-center lg:text-left font-body">
            Straight answers about how Pinporium works.
          </p>
          {siteDetails.supportEmail ? (
            <a
              href={`mailto:${siteDetails.supportEmail}`}
              className="mt-4 block text-xl lg:text-3xl text-secondary-ink font-semibold hover:underline text-center lg:text-left font-display"
            >
              {siteDetails.supportEmail}
            </a>
          ) : null}
        </div>

        <div className="w-full lg:max-w-2xl mx-auto border-b border-gold-deco/20">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-2">
              <Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex items-center justify-between w-full px-4 pt-7 text-lg text-left border-t border-gold-deco/15 hover:bg-cream-warm/50 transition-colors rounded-t-deco">
                      <span className="text-xl font-display font-medium text-navy pr-4">
                        {faq.question}
                      </span>
                      {open ? (
                        <BiMinus className="w-5 h-5 text-secondary-ink shrink-0" />
                      ) : (
                        <BiPlus className="w-5 h-5 text-secondary-ink shrink-0" />
                      )}
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pt-3 pb-4 text-foreground-accent font-body leading-relaxed">
                      {faq.answer}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
