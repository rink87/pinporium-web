import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { isRoadmapFeatureId } from "@/content/roadmap";

export type RoadmapVoteSnapshot = {
  counts: Record<string, number>;
  votedFeatureIds: string[];
};

export async function fetchRoadmapVotes(
  voterKey?: string | null,
): Promise<RoadmapVoteSnapshot> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { counts: {}, votedFeatureIds: [] };
  }

  const { data: rows, error } = await admin
    .from("roadmap_feature_upvotes")
    .select("feature_id, voter_key");

  if (error) {
    console.error("roadmap_feature_upvotes fetch failed", error);
    return { counts: {}, votedFeatureIds: [] };
  }

  const counts: Record<string, number> = {};
  const votedFeatureIds: string[] = [];

  for (const row of rows ?? []) {
    const featureId = String(row.feature_id);
    counts[featureId] = (counts[featureId] ?? 0) + 1;
    if (voterKey && String(row.voter_key) === voterKey) {
      votedFeatureIds.push(featureId);
    }
  }

  return { counts, votedFeatureIds };
}

export async function toggleRoadmapVote(
  featureId: string,
  voterKey: string,
): Promise<
  | { ok: true; voted: boolean; count: number }
  | { ok: false; error: string }
> {
  if (!isRoadmapFeatureId(featureId)) {
    return { ok: false, error: "Unknown roadmap feature." };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Voting is temporarily unavailable." };
  }

  const { data: existing, error: readError } = await admin
    .from("roadmap_feature_upvotes")
    .select("feature_id")
    .eq("feature_id", featureId)
    .eq("voter_key", voterKey)
    .maybeSingle();

  if (readError) {
    console.error("roadmap upvote read failed", readError);
    return { ok: false, error: "Could not record your vote. Try again." };
  }

  if (existing) {
    const { error: deleteError } = await admin
      .from("roadmap_feature_upvotes")
      .delete()
      .eq("feature_id", featureId)
      .eq("voter_key", voterKey);

    if (deleteError) {
      console.error("roadmap upvote delete failed", deleteError);
      return { ok: false, error: "Could not remove your vote. Try again." };
    }
  } else {
    const { error: insertError } = await admin
      .from("roadmap_feature_upvotes")
      .insert({ feature_id: featureId, voter_key: voterKey });

    if (insertError) {
      console.error("roadmap upvote insert failed", insertError);
      return { ok: false, error: "Could not record your vote. Try again." };
    }
  }

  const { count, error: countError } = await admin
    .from("roadmap_feature_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("feature_id", featureId);

  if (countError) {
    console.error("roadmap upvote count failed", countError);
    return { ok: false, error: "Vote saved but count could not be refreshed." };
  }

  return {
    ok: true,
    voted: !existing,
    count: count ?? 0,
  };
}
