import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type CatalogArtistDirectoryRow = {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  isVerified: boolean;
  catalogVariantCount: number;
  catalogDesignCount: number;
};

function mapRow(row: Record<string, unknown>): CatalogArtistDirectoryRow {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    avatarUrl: (row.avatar_url as string | null) ?? null,
    isVerified: Boolean(row.is_verified),
    catalogVariantCount: Number(row.catalog_variant_count ?? 0),
    catalogDesignCount: Number(row.catalog_design_count ?? 0),
  };
}

export async function fetchCatalogArtists(
  query?: string,
): Promise<CatalogArtistDirectoryRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    console.warn(
      "Catalog artists skipped: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on pinporium-web.",
    );
    return [];
  }

  const { data, error } = await admin.rpc("list_catalog_artists_for_web", {
    p_query: query?.trim() || null,
  });

  if (error) {
    console.error("list_catalog_artists_for_web failed", error);
    return [];
  }

  return ((data as Record<string, unknown>[]) ?? []).map(mapRow);
}
