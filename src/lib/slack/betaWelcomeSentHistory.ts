import { normalizeBetaEmail } from "@/lib/betaTester";

import {
  fetchBetaChannelMessages,
  fetchBetaChannelThreadRepliesForBetaChannel,
  slackTsToIso,
} from "./betaChannelHistory";

/** Bot thread reply after :incoming_envelope: welcome send. */
const WELCOME_SENT_REPLY_RE =
  /Sent .+ email to \*[^*]+\* \(([^)]+)\)/i;

function recordWelcome(
  map: Map<string, string>,
  emailRaw: string,
  sentAt: string,
) {
  const email = normalizeBetaEmail(emailRaw);
  if (!email.includes("@")) return;
  const existing = map.get(email);
  if (!existing || new Date(sentAt).getTime() < new Date(existing).getTime()) {
    map.set(email, sentAt);
  }
}

function parseWelcomeReply(text: string, ts: string, map: Map<string, string>) {
  const match = text.match(WELCOME_SENT_REPLY_RE);
  if (!match?.[1]) return;
  recordWelcome(map, match[1], slackTsToIso(ts));
}

export async function fetchBetaWelcomeHistoryFromSlack(options?: {
  maxMessages?: number;
}): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const messages = await fetchBetaChannelMessages(options);

  for (const message of messages) {
    if (message.text) {
      parseWelcomeReply(message.text, message.ts, map);
    }

    if ((message.reply_count ?? 0) > 0) {
      const replies = await fetchBetaChannelThreadRepliesForBetaChannel(message.ts);
      for (const reply of replies) {
        if (reply.text) {
          parseWelcomeReply(reply.text, reply.ts, map);
        }
      }
    }
  }

  return map;
}
