import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { toggleRoadmapVote } from "@/lib/roadmap/votes";
import {
  isValidRoadmapVoterKey,
  newRoadmapVoterKey,
  ROADMAP_VOTER_COOKIE,
} from "@/lib/roadmap/voterCookie";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const featureId =
    body && typeof body === "object" && typeof (body as { featureId?: unknown }).featureId === "string"
      ? (body as { featureId: string }).featureId.trim()
      : "";

  if (!featureId) {
    return NextResponse.json({ error: "Missing featureId." }, { status: 400 });
  }

  const jar = cookies();
  let voterKey = jar.get(ROADMAP_VOTER_COOKIE)?.value;
  const needsCookie = !isValidRoadmapVoterKey(voterKey);
  if (needsCookie) {
    voterKey = newRoadmapVoterKey();
  }

  const result = await toggleRoadmapVote(featureId, voterKey!);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({
    featureId,
    voted: result.voted,
    count: result.count,
  });

  if (needsCookie) {
    response.cookies.set(ROADMAP_VOTER_COOKIE, voterKey!, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
