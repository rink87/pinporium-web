"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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
        <div className="fixed inset-0 bg-navy/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-lg rounded-deco bg-cream border border-gold-deco/30 shadow-frame p-6 sm:p-8 my-8 max-h-[min(92vh,900px)] overflow-y-auto">
            <DialogTitle className="font-display text-2xl text-navy mb-1 pr-8">
              Apply for beta
            </DialogTitle>
            <p className="text-foreground-accent font-body text-sm leading-relaxed mb-6">
              Tell us a bit about your collection. We&apos;ll email you a TestFlight invite when a
              spot opens.
            </p>
            <BetaTesterForm onClose={handleClose} />
          </DialogPanel>
        </div>
      </Dialog>
    </BetaApplyContext.Provider>
  );
}
