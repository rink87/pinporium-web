import { normalizeBetaEmail } from "@/lib/betaTester";

import { slackApi } from "./api";

/** Bot thread reply after :incoming_envelope: welcome send. */
const WELCOME_SENT_REPLY_RE =
  /Sent .+ email to \*[^*]+\* \(([^)]+)\)/i;

function slackTsToIso(ts: string): string {
  return new Date(Math.floor(parseFloat(ts) * 1000)).toISOString();
}

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

type SlackMessage = {
  ts?: string;
  text?: string;
  reply_count?: number;
};

async function fetchReplies(channel: string, threadTs: string): Promise<SlackMessage[]> {
  const data = await slackApi<{ messages?: SlackMessage[] }>("conversations.replies", {
    channel,
    ts: threadTs,
    limit: "100",
  });
  return data.messages ?? [];
}

export async function fetchBetaWelcomeHistoryFromSlack(options?: {
  maxParentMessages?: number;
}): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const channel = process.env.SLACK_BETA_CHANNEL_ID?.trim();
  if (!channel || !process.env.SLACK_BOT_TOKEN?.trim()) {
    return map;
  }

  const maxParentMessages = options?.maxParentMessages ?? 500;
  const parents: SlackMessage[] = [];
  let cursor: string | undefined;

  while (parents.length < maxParentMessages) {
    const params: Record<string, string> = {
      channel,
      limit: "200",
    };
    if (cursor) {
      params.cursor = cursor;
    }

    const data = await slackApi<{
      messages?: SlackMessage[];
      response_metadata?: { next_cursor?: string };
    }>("conversations.history", params);

    parents.push(...(data.messages ?? []));

    cursor = data.response_metadata?.next_cursor?.trim();
    if (!cursor) {
      break;
    }
  }

  for (const message of parents.slice(0, maxParentMessages)) {
    if (message.text && message.ts) {
      parseWelcomeReply(message.text, message.ts, map);
    }

    if ((message.reply_count ?? 0) > 0 && message.ts) {
      const replies = await fetchReplies(channel, message.ts);
      for (const reply of replies) {
        if (reply.text && reply.ts) {
          parseWelcomeReply(reply.text, reply.ts, map);
        }
      }
    }
  }

  return map;
}
