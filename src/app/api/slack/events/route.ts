import { NextResponse } from "next/server";

import { handleBetaThanksReactionAdded } from "@/lib/slack/betaThanksReaction";
import { verifySlackRequestSignature } from "@/lib/slack/verifyRequest";

type SlackUrlVerification = {
  type: "url_verification";
  challenge: string;
};

type SlackReactionAdded = {
  type: "reaction_added";
  user: string;
  reaction: string;
  item: {
    type: string;
    channel: string;
    ts: string;
  };
};

type SlackEventCallback = {
  type: "event_callback";
  event: { type: string } & Partial<SlackReactionAdded>;
};

export async function POST(request: Request) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    console.error("SLACK_SIGNING_SECRET is not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-slack-signature");
  const timestamp = request.headers.get("x-slack-request-timestamp");

  if (
    !verifySlackRequestSignature({
      signingSecret,
      signature,
      timestamp,
      rawBody,
    })
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: SlackUrlVerification | SlackEventCallback;
  try {
    payload = JSON.parse(rawBody) as SlackUrlVerification | SlackEventCallback;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (payload.type === "event_callback" && payload.event.type === "reaction_added") {
    const event = payload.event as SlackReactionAdded;
    if (
      event.item?.type === "message" &&
      event.item.channel &&
      event.item.ts &&
      event.user &&
      event.reaction
    ) {
      try {
        await handleBetaThanksReactionAdded({
          userId: event.user,
          reaction: event.reaction,
          channelId: event.item.channel,
          messageTs: event.item.ts,
        });
      } catch (err) {
        console.error("Beta thanks reaction handler failed", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
