import { randomUUID } from "node:crypto";

export const ROADMAP_VOTER_COOKIE = "pp_roadmap_voter";

export function newRoadmapVoterKey(): string {
  return randomUUID();
}

export function isValidRoadmapVoterKey(value: string | undefined | null): value is string {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
