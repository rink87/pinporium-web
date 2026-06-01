/** Decode Slack mrkdwn link formats before parsing signup fields. */
export function normalizeSlackMessageText(text: string): string {
  return text
    .replace(/<mailto:([^>|]+)\|([^>]+)>/gi, (_, _addr, label) => label)
    .replace(/<mailto:([^>]+)>/gi, (_, addr) => addr)
    .replace(/<(?:https?:\/\/[^>|]+)\|([^>]+)>/gi, (_, label) => label)
    .replace(/<(https?:\/\/[^>]+)>/gi, (_, url) => url)
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1");
}
