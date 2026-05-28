"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { createContext, useCallback, useContext, useState } from "react";

import BetaTesterForm from "./BetaTesterForm";

type BetaApplyContextValue = {
  openBetaApply: () => void;
};

const BetaApplyContext = createContext<BetaApplyContextValue | null>(null);

export function useBetaApply(): BetaApplyContextValue {
  const ctx = useContext(BetaApplyContext);
  if (!ctx) {
    throw new Error("useBetaApply must be used within BetaApplyProvider");
  }
  return ctx;
}

export function BetaApplyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openBetaApply = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <BetaApplyContext.Provider value={{ openBetaApply }}>
      {children}
      <Dialog open={open} onClose={handleClose} className="relative z-[60]">
        <div className="fixed inset-0 bg-black/55" aria-hidden="true" />
        <div className="fixed inset-0 flex items-stretch sm:items-center justify-center p-0 sm:p-6">
          <DialogPanel className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white sm:h-auto sm:max-h-[min(90vh,820px)] sm:max-w-[440px] sm:rounded-deco sm:border sm:border-gold-deco/20 sm:shadow-[0_24px_80px_-12px_rgba(44,51,69,0.35)]">
            <div
              className="shrink-0 h-1 w-full bg-gradient-to-r from-secondary via-gold to-primary"
              aria-hidden
            />
            <div className="shrink-0 relative px-6 pt-6 pb-4 sm:px-7 border-b border-gold-deco/15 bg-cream/40">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 sm:right-5 sm:top-5 flex h-9 w-9 items-center justify-center rounded-full text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
              <DialogTitle className="font-display text-2xl text-navy pr-10">
                Apply for beta
              </DialogTitle>
              <p className="mt-1.5 text-[15px] text-foreground-accent font-body leading-relaxed max-w-sm">
                A few details and we&apos;ll email you a TestFlight invite when a spot opens.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-8 sm:py-6 bg-cream/30">
              <BetaTesterForm onClose={handleClose} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </BetaApplyContext.Provider>
  );
}
