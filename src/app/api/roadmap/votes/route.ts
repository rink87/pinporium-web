import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { fetchRoadmapVotes } from "@/lib/roadmap/votes";
import {
  isValidRoadmapVoterKey,
  ROADMAP_VOTER_COOKIE,
} from "@/lib/roadmap/voterCookie";

export async function GET() {
  const jar = cookies();
  const voterKey = jar.get(ROADMAP_VOTER_COOKIE)?.value;
  const snapshot = await fetchRoadmapVotes(
    isValidRoadmapVoterKey(voterKey) ? voterKey : null,
  );

  return NextResponse.json(snapshot);
}
