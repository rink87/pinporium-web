import { normalizeBetaEmail, parseBetaTesterSlackMessage } from "@/lib/betaTester";

import { fetchBetaChannelMessages, slackTsToIso } from "./betaChannelHistory";

function recordSignup(map: Map<string, string>, email: string, submittedAt: string) {
  const existing = map.get(email);
  if (!existing || new Date(submittedAt).getTime() < new Date(existing).getTime()) {
    map.set(email, submittedAt);
  }
}

/** Slack signup post time from "Beta Tester Request" webhook messages. */
export async function fetchBetaSignupHistoryFromSlack(options?: {
  maxMessages?: number;
}): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const messages = await fetchBetaChannelMessages(options);

  for (const message of messages) {
    if (!message.ts) continue;
    const signup = parseBetaTesterSlackMessage(message.text);
    if (!signup) continue;
    recordSignup(map, normalizeBetaEmail(signup.email), slackTsToIso(message.ts));
  }

  return map;
}
