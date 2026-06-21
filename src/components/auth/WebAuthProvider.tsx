"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export type WebProfile = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_beta_user: boolean;
};

type WebAuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: WebProfile | null;
  isBetaUser: boolean;
  loading: boolean;
  displayLabel: string;
  initials: string;
  signOut: () => Promise<void>;
};

const WebAuthContext = createContext<WebAuthContextValue | null>(null);

function labelFromUser(user: User, profile: WebProfile | null): string {
  const display = profile?.display_name?.trim();
  if (display) return display;
  const username = profile?.username?.trim();
  if (username) return `@${username}`;
  const metaName =
    typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name.trim()
      : typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name.trim()
        : "";
  if (metaName) return metaName;
  const email = user.email?.split("@")[0]?.trim();
  return email || "Collector";
}

function initialsFromLabel(label: string): string {
  const cleaned = label.replace(/^@/, "").trim();
  if (!cleaned) return "P";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

export function WebAuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<WebProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(
    async (userId: string) => {
      if (!supabase) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url, is_beta_user")
        .eq("id", userId)
        .maybeSingle();
      setProfile(data ?? null);
    },
    [supabase],
  );

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        void loadProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        void loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile, supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, [supabase]);

  const user = session?.user ?? null;
  const displayLabel = user ? labelFromUser(user, profile) : "";
  const initials = displayLabel ? initialsFromLabel(displayLabel) : "P";
  const isBetaUser = profile?.is_beta_user === true;

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isBetaUser,
      loading,
      displayLabel,
      initials,
      signOut,
    }),
    [session, user, profile, isBetaUser, loading, displayLabel, initials, signOut],
  );

  return <WebAuthContext.Provider value={value}>{children}</WebAuthContext.Provider>;
}

export function useWebAuth(): WebAuthContextValue {
  const ctx = useContext(WebAuthContext);
  if (!ctx) {
    throw new Error("useWebAuth must be used within WebAuthProvider");
  }
  return ctx;
}

/** Safe hook for components that may render outside provider during static analysis. */
export function useWebAuthOptional(): WebAuthContextValue | null {
  return useContext(WebAuthContext);
}
