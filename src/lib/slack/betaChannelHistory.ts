import { BETA_SLACK_SIGNUP_HEADER, parseBetaTesterSlackMessage } from "@/lib/betaTester";

import { slackApi } from "./api";

export type BetaChannelMessage = {
  ts: string;
  text: string;
  reply_count?: number;
};

type SlackMessage = {
  ts?: string;
  text?: string;
  reply_count?: number;
  attachments?: { text?: string; fallback?: string; pretext?: string }[];
};

type SlackChannel = {
  id?: string;
  name?: string;
  is_member?: boolean;
};

let cachedBetaChannelId: string | null | undefined;

export function slackTsToIso(ts: string): string {
  return new Date(Math.floor(parseFloat(ts) * 1000)).toISOString();
}

function flattenMessageText(message: SlackMessage): string {
  const parts: string[] = [];
  if (message.text?.trim()) {
    parts.push(message.text);
  }
  for (const attachment of message.attachments ?? []) {
    for (const field of [attachment.pretext, attachment.text, attachment.fallback]) {
      if (field?.trim()) {
        parts.push(field);
      }
    }
  }
  return parts.join("\n");
}

function looksLikeBetaSignupMessage(text: string): boolean {
  if (parseBetaTesterSlackMessage(text)) {
    return true;
  }
  return text.includes(BETA_SLACK_SIGNUP_HEADER);
}

async function listMemberChannels(): Promise<SlackChannel[]> {
  const channels: SlackChannel[] = [];
  let cursor: string | undefined;

  do {
    const params: Record<string, string> = {
      types: "public_channel,private_channel",
      exclude_archived: "true",
      limit: "200",
    };
    if (cursor) {
      params.cursor = cursor;
    }

    const data = await slackApi<{
      channels?: SlackChannel[];
      response_metadata?: { next_cursor?: string };
    }>("conversations.list", params);

    channels.push(...(data.channels ?? []).filter((channel) => channel.is_member && channel.id));
    cursor = data.response_metadata?.next_cursor?.trim();
  } while (cursor);

  return channels;
}

/** Explicit SLACK_BETA_CHANNEL_ID, else auto-detect channel with signup posts. */
export async function resolveBetaSlackChannelId(): Promise<string | null> {
  if (cachedBetaChannelId !== undefined) {
    return cachedBetaChannelId;
  }

  const explicit = process.env.SLACK_BETA_CHANNEL_ID?.trim();
  if (explicit) {
    cachedBetaChannelId = explicit;
    return explicit;
  }

  if (!process.env.SLACK_BOT_TOKEN?.trim()) {
    cachedBetaChannelId = null;
    return null;
  }

  try {
    const channels = await listMemberChannels();
    const byName = channels.find((channel) => /beta|pinporium|testflight/i.test(channel.name ?? ""));
    if (byName?.id) {
      cachedBetaChannelId = byName.id;
      console.info(`Using beta Slack channel #${byName.name} (${byName.id})`);
      return byName.id;
    }

    for (const channel of channels) {
      if (!channel.id) continue;
      const data = await slackApi<{ messages?: SlackMessage[] }>("conversations.history", {
        channel: channel.id,
        limit: "50",
      });

      for (const message of data.messages ?? []) {
        if (looksLikeBetaSignupMessage(flattenMessageText(message))) {
          cachedBetaChannelId = channel.id;
          console.info(`Detected beta Slack channel #${channel.name} (${channel.id}) from signup posts`);
          return channel.id;
        }
      }
    }
  } catch (err) {
    console.error("resolveBetaSlackChannelId failed", err);
  }

  cachedBetaChannelId = null;
  return null;
}

async function fetchChannelMessages(
  channel: string,
  maxMessages: number,
): Promise<BetaChannelMessage[]> {
  const messages: BetaChannelMessage[] = [];
  let cursor: string | undefined;

  while (messages.length < maxMessages) {
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

    for (const message of data.messages ?? []) {
      if (!message.ts) continue;
      messages.push({
        ts: message.ts,
        text: flattenMessageText(message),
        reply_count: message.reply_count,
      });
    }

    cursor = data.response_metadata?.next_cursor?.trim();
    if (!cursor) {
      break;
    }
  }

  return messages.slice(0, maxMessages);
}

export async function fetchBetaChannelMessages(options?: {
  maxMessages?: number;
}): Promise<BetaChannelMessage[]> {
  const channel = await resolveBetaSlackChannelId();
  if (!channel) {
    return [];
  }

  return fetchChannelMessages(channel, options?.maxMessages ?? 500);
}

export async function fetchBetaChannelThreadReplies(
  channel: string,
  threadTs: string,
): Promise<BetaChannelMessage[]> {
  const data = await slackApi<{ messages?: SlackMessage[] }>("conversations.replies", {
    channel,
    ts: threadTs,
    limit: "100",
  });

  return (data.messages ?? [])
    .filter((message) => message.ts)
    .map((message) => ({
      ts: message.ts!,
      text: flattenMessageText(message),
    }));
}

export async function fetchBetaChannelThreadRepliesForBetaChannel(
  threadTs: string,
): Promise<BetaChannelMessage[]> {
  const channel = await resolveBetaSlackChannelId();
  if (!channel) {
    return [];
  }
  return fetchBetaChannelThreadReplies(channel, threadTs);
}
