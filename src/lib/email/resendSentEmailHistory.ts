import type { BetaEmailKind } from "@/lib/betaApplicationDb";
import { normalizeBetaEmail } from "@/lib/betaTester";

import {
  betaEmailKindFromResendTag,
  betaEmailKindFromSubject,
} from "./betaEmailSubjectMatch";

export type BetaEmailSentAtByKind = Partial<Record<BetaEmailKind, string>>;

type ResendListedEmail = {
  id: string;
  to?: string[] | null;
  subject?: string | null;
  created_at?: string | null;
  tags?: { name: string; value: string }[] | null;
};

function earliest(isoA: string | undefined, isoB: string): string {
  if (!isoA) return isoB;
  return new Date(isoA).getTime() <= new Date(isoB).getTime() ? isoA : isoB;
}

function kindFromListedEmail(email: ResendListedEmail): BetaEmailKind | null {
  const tag = email.tags?.find((t) => t.name === "category")?.value;
  const fromTag = betaEmailKindFromResendTag(tag);
  if (fromTag) return fromTag;
  return betaEmailKindFromSubject(email.subject ?? undefined);
}

function recordSent(
  map: Map<string, BetaEmailSentAtByKind>,
  recipient: string,
  kind: BetaEmailKind,
  sentAt: string,
) {
  const key = normalizeBetaEmail(recipient);
  const existing = map.get(key) ?? {};
  existing[kind] = earliest(existing[kind], sentAt);
  map.set(key, existing);
}

export async function fetchBetaEmailHistoryFromResend(options?: {
  maxPages?: number;
}): Promise<Map<string, BetaEmailSentAtByKind>> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const map = new Map<string, BetaEmailSentAtByKind>();
  if (!apiKey) {
    return map;
  }

  const maxPages = options?.maxPages ?? 40;
  let after: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const url = new URL("https://api.resend.com/emails");
    url.searchParams.set("limit", "100");
    if (after) {
      url.searchParams.set("after", after);
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Resend list emails failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const payload = (await res.json()) as {
      has_more?: boolean;
      data?: ResendListedEmail[];
    };

    const batch = payload.data ?? [];
    for (const item of batch) {
      const kind = kindFromListedEmail(item);
      const sentAt = item.created_at?.trim();
      if (!kind || !sentAt) continue;

      for (const recipient of item.to ?? []) {
        if (recipient?.trim()) {
          recordSent(map, recipient, kind, sentAt);
        }
      }
    }

    if (!payload.has_more || batch.length === 0) {
      break;
    }

    after = batch[batch.length - 1]?.id;
    if (!after) {
      break;
    }
  }

  return map;
}
