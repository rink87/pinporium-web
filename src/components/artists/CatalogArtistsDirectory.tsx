"use client";

import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

import type { CatalogArtistDirectoryRow } from "@/lib/catalog/publicArtists";

import { ArtistClaimDialog } from "./ArtistClaimDialog";
import { partnersFieldClass } from "./partnersFormStyles";

type Props = {
  artists: CatalogArtistDirectoryRow[];
};

function ArtistAvatar({ artist }: { artist: CatalogArtistDirectoryRow }) {
  if (artist.avatarUrl) {
    return (
      <Image
        src={artist.avatarUrl}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover border border-gold-deco/20"
        unoptimized
      />
    );
  }

  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-deco/15 border border-gold-deco/25 font-display font-bold text-navy"
      aria-hidden
    >
      {artist.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function CatalogArtistsDirectory({ artists }: Props) {
  const [query, setQuery] = useState("");
  const [claimArtist, setClaimArtist] = useState<CatalogArtistDirectoryRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter(
      artist =>
        artist.name.toLowerCase().includes(q) || artist.slug.toLowerCase().includes(q),
    );
  }, [artists, query]);

  const partnerCount = artists.filter(a => a.isVerified).length;
  const claimableCount = artists.filter(a => !a.isVerified).length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-md flex-1">
          <FiSearch
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-accent"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search artists in the catalog…"
            className={clsx(partnersFieldClass, "pl-10")}
            aria-label="Search artists"
          />
        </div>
        <p className="text-sm text-foreground-accent font-body shrink-0">
          {partnerCount} partner{partnerCount === 1 ? "" : "s"} · {claimableCount} available to
          claim
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-deco border border-dashed border-gold-deco/30 bg-cream/50 px-6 py-12 text-center">
          <p className="font-body text-foreground-accent">
            {artists.length === 0
              ? "Artist directory is loading from the catalog — check back shortly."
              : "No artists match your search."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map(artist => (
            <li key={artist.id}>
              <article className="flex h-full flex-col justify-between rounded-deco border border-gold-deco/25 bg-white/80 p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <ArtistAvatar artist={artist} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-navy truncate">
                        {artist.name}
                      </h3>
                      {artist.isVerified ? (
                        <span className="shrink-0 rounded-full bg-gold-deco/20 px-2 py-0.5 text-[10px] font-body font-semibold uppercase tracking-wide text-navy">
                          Partner
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-foreground-accent font-body">
                      {artist.catalogVariantCount} catalog pin
                      {artist.catalogVariantCount === 1 ? "" : "s"}
                      {artist.catalogDesignCount > 0
                        ? ` · ${artist.catalogDesignCount} design${artist.catalogDesignCount === 1 ? "" : "s"}`
                        : ""}
                    </p>
                  </div>
                </div>

                {!artist.isVerified ? (
                  <button
                    type="button"
                    onClick={() => setClaimArtist(artist)}
                    className="mt-4 w-full rounded-deco border border-secondary/30 bg-secondary/5 px-4 py-2.5 text-sm font-body font-semibold text-secondary-ink transition-colors hover:bg-secondary/10"
                  >
                    Claim this profile
                  </button>
                ) : (
                  <p className="mt-4 text-xs text-foreground-accent font-body">
                    Verified partner artist in Pinporium.
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}

      <ArtistClaimDialog artist={claimArtist} onClose={() => setClaimArtist(null)} />
    </>
  );
}
