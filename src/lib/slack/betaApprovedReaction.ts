import type { BetaTesterPayload } from "@/lib/betaTester";
import {
  BETA_SLACK_SIGNUP_HEADER,
  parseBetaTesterSlackMessage,
  platformLabel,
} from "@/lib/betaTester";
import { upsertBetaApplicationFromSignup } from "@/lib/betaApplicationDb";

import { fetchSlackMessageText, postSlackThreadReply } from "./api";
import {
  getBetaApprovedReactionName,
  isAllowedBetaReactionChannel,
  isAllowedBetaReactionUser,
} from "./betaSlackGuards";

export async function handleBetaApprovedReactionAdded({
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
  const expectedReaction = getBetaApprovedReactionName();
  if (reaction !== expectedReaction) {
    return;
  }

  if (!isAllowedBetaReactionChannel(channelId)) {
    console.info(
      `Beta approved reaction ignored: channel ${channelId} does not match SLACK_BETA_CHANNEL_ID`,
    );
    return;
  }

  if (!process.env.SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_TOKEN missing — cannot fetch signup message");
    return;
  }

  if (!isAllowedBetaReactionUser(userId)) {
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: "You are not allowed to approve beta signups from this reaction.",
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
      text: `This doesn’t look like a beta signup message — react with :${expectedReaction}: on a post that starts with *${BETA_SLACK_SIGNUP_HEADER}*.`,
    });
    return;
  }

  const result = await upsertBetaApplicationFromSlack(signup);
  if (!result.ok) {
    await postSlackThreadReply({
      channel: channelId,
      threadTs: messageTs,
      text: result.message,
    });
    return;
  }

  await postSlackThreadReply({
    channel: channelId,
    threadTs: messageTs,
    text: result.created
      ? `Added *${signup.name}* (${signup.email}) to Beta testers in admin — ${platformLabel(signup.platform)}. React with :incoming_envelope: when ready to send the welcome email.`
      : `Updated *${signup.name}* (${signup.email}) in Beta testers admin — ${platformLabel(signup.platform)}.`,
  });
}

async function upsertBetaApplicationFromSlack(
  signup: BetaTesterPayload,
): Promise<{ ok: true; created: boolean } | { ok: false; message: string }> {
  const result = await upsertBetaApplicationFromSignup({
    name: signup.name,
    email: signup.email,
    platform: signup.platform,
    pinCount: signup.pinCount,
    why: signup.why,
    adminNotes: "Approved via Slack :approved:",
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return { ok: true, created: result.created };
}
