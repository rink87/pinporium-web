"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

import { useWebAuth } from "./WebAuthProvider";

export function HeaderUserMenu() {
  const { displayLabel, initials, profile, signOut, loading } = useWebAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (loading) {
    return (
      <div className="h-10 w-28 rounded-full bg-navy/5 animate-pulse" aria-hidden />
    );
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-full border border-gold-deco/25 bg-white/80 pl-1.5 pr-3 py-1.5 shadow-sm hover:bg-white transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- user avatars from Supabase storage
          <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white font-body">
            {initials}
          </span>
        )}
        <span className="max-w-[120px] truncate text-sm font-semibold text-navy font-body hidden sm:inline">
          {displayLabel}
        </span>
        <HiChevronDown className="h-4 w-4 text-navy/50 shrink-0" aria-hidden />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-deco border border-gold-deco/20 bg-white py-1 shadow-frame"
          >
            <p className="px-4 py-2 text-xs text-foreground-accent font-body truncate border-b border-navy/5">
              {displayLabel}
            </p>
            <button
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={() => void handleSignOut()}
              className="w-full px-4 py-2.5 text-left text-sm font-semibold text-navy font-body hover:bg-cream-warm disabled:opacity-60"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
