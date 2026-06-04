/** Shared guards for beta signup Slack reaction handlers. */

export function getBetaThanksReactionName(): string {
  return (
    process.env.SLACK_BETA_THANKS_REACTION?.trim().replace(/^:+|:+$/g, "") ||
    "incoming_envelope"
  );
}

export function getBetaApprovedReactionName(): string {
  return (
    process.env.SLACK_BETA_APPROVED_REACTION?.trim().replace(/^:+|:+$/g, "") ||
    "approved"
  );
}

export function isAllowedBetaReactionChannel(channelId: string): boolean {
  const allowed = process.env.SLACK_BETA_CHANNEL_ID?.trim();
  if (!allowed) {
    return true;
  }
  return channelId === allowed;
}

export function isAllowedBetaReactionUser(userId: string): boolean {
  const allowlist = process.env.SLACK_BETA_THANKS_USER_IDS?.trim();
  if (!allowlist) {
    return true;
  }
  return allowlist.split(",").map((id) => id.trim()).includes(userId);
}
