const SLACK_API = "https://slack.com/api";

export async function slackApi<T extends Record<string, unknown>>(
  method: string,
  params: Record<string, string>,
): Promise<T & { ok: boolean; error?: string }> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error("SLACK_BOT_TOKEN is not configured");
  }

  const res = await fetch(`${SLACK_API}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });

  const data = (await res.json()) as T & { ok: boolean; error?: string };
  if (!data.ok) {
    throw new Error(data.error ?? `Slack ${method} failed`);
  }
  return data;
}

export async function fetchSlackMessageText(
  channel: string,
  messageTs: string,
): Promise<string | null> {
  const data = await slackApi<{
    messages?: {
      text?: string;
      attachments?: { text?: string; fallback?: string; pretext?: string }[];
    }[];
  }>("conversations.history", {
    channel,
    latest: messageTs,
    inclusive: "true",
    limit: "1",
  });

  const message = data.messages?.[0];
  if (!message) {
    return null;
  }

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

  return parts.length > 0 ? parts.join("\n") : null;
}

export async function postSlackThreadReply({
  channel,
  threadTs,
  text,
}: {
  channel: string;
  threadTs: string;
  text: string;
}) {
  await slackApi("chat.postMessage", {
    channel,
    thread_ts: threadTs,
    text,
  });
}
