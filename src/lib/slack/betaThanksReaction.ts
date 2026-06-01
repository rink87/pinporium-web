import {
  parseBetaTesterSlackMessage,
  platformLabel,
  type BetaPlatform,
} from "@/lib/betaTester";
import { sendBetaThanksEmail } from "@/lib/email/sendBetaThanks";

import { fetchSlackMessageText, postSlackThreadReply } from "./api";

export function getBetaThanksReactionName(): string {
  return (
    process.env.SLACK_BETA_THANKS_REACTION?.trim().replace(/^:+|:+$/g, "") ||
    "incoming_envelope"
  );
}

function isAllowedReactionChannel(channelId: string): boolean {
  const allowed = process.env.SLACK_BETA_CHANNEL_ID?.trim();
  if (!allowed) {
    return true;
  }
  return channelId === allowed;
}

function isAllowedReactionUser(userId: string): boolean {
  const allowlist = process.env.SLACK_BETA_THANKS_USER_IDS?.trim();
  if (!allowlist) {
    return true;
  }
  return allowlist.split(",").map((id) => id.trim()).includes(userId);
}

function emailPlatformLabel(platform: BetaPlatform): string {
  return platform === "ios" ? "iPhone / TestFlight welcome" : "Android waitlist";
}

export async function handleBetaThanksReactionAdded({
  userId,
  reaction,
  channelId,
  messageTs,
}: {
  userId: string;
  reaction: string;
  channelId: string;
  messageTs: string;
}): Promise<void> {
  const expectedReaction = getBetaThanksReactionName();
  if (reaction !== expectedReaction) {
    console.info(
      `Beta thanks reaction ignored: got "${reaction}", expected "${expectedReaction}"`,
    );
    return;
  }

  if (!isAllowedReactionChannel(channelId)) {
    console.info(
      `Beta thanks reaction ignored: channel ${channelId} does not match SLACK_BETA_CHANNEL_ID`,
    );
    return;
  }

  if (!process.env.SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_TOKEN missing — cannot fetch signup message");
    return;
  }

  if (!isAllowedReactionUser(userId)) {
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: "You are not allowed to send beta welcome emails from this reaction.",
    });
    return;
  }

  let messageText: string | null;
  try {
    messageText = await fetchSlackMessageText(channelId, messageTs);
  } catch (err) {
    console.error("Slack conversations.history failed", err);
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: "Could not load this message. Is the Pinporium bot in this channel?",
    });
    return;
  }

  if (!messageText) {
    return;
  }

  const signup = parseBetaTesterSlackMessage(messageText);
  if (!signup) {
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: "This doesn’t look like a beta signup message — react on a post that starts with *Beta Tester Request*.",
    });
    return;
  }

  const emailResult = await sendBetaThanksEmail({
    name: signup.name,
    email: signup.email,
    platform: signup.platform,
  });

  if (emailResult.skipped) {
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: "Welcome email not sent — Resend is not configured (RESEND_API_KEY / RESEND_FROM).",
    });
    return;
  }

  if (!emailResult.sent) {
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: `Failed to send welcome email: ${emailResult.error ?? "unknown error"}`,
    });
    return;
  }

  await postSlackThreadReply({
    channel: channelId,
    threadTs: messageTs,
    text: `Sent ${emailPlatformLabel(signup.platform)} email to *${signup.name}* (${signup.email}) — platform: ${platformLabel(signup.platform)}.`,
  });
}
