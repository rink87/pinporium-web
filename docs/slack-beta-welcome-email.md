# Send beta welcome email from Slack

Signups post to your beta channel via the site webhook. **You** send the welcome email by reacting on that message.

## Trigger

React with **:incoming_envelope:** (`incoming_envelope`) on any message that starts with `Beta Tester Request`.

The bot reads **Name**, **Email**, and **Platform** from the message and sends:

- **iPhone** → TestFlight welcome + checklist + Discord
- **Android** → waitlist welcome + Discord

Override the emoji with `SLACK_BETA_THANKS_REACTION`.

## Slack app setup

**Easy path — use the manifest**

1. Deploy `pinporium-web` so `https://www.pinporium.app/api/slack/events` exists.
2. [Create New App → From an app manifest](https://api.slack.com/apps?new_app_type=manifest)
3. Paste [`docs/slack/pinporium-beta-welcome-manifest.yaml`](./slack/pinporium-beta-welcome-manifest.yaml) (or upload the `.json`).
4. **Install to workspace** → copy tokens to Vercel (below).
5. Confirm **Event Subscriptions** shows the request URL **Verified**.
6. `/invite @Pinporium Beta` in your beta channel.

See [`docs/slack/README.md`](./slack/README.md) for file list and troubleshooting.

**Manual path** (if you already have an app)

1. **OAuth & Permissions** → Bot scopes: `channels:history`, `groups:history`, `chat:write`, `reactions:read`
2. **Install to workspace** → `SLACK_BOT_TOKEN`
3. **Signing Secret** → `SLACK_SIGNING_SECRET`
4. **Event Subscriptions** → `https://www.pinporium.app/api/slack/events` → bot event **`reaction_added`**
5. Invite bot to beta channel; optional `SLACK_BETA_CHANNEL_ID`

## Vercel env

- `SLACK_SIGNING_SECRET`, `SLACK_BOT_TOKEN`
- `RESEND_API_KEY`, `RESEND_FROM`
- Optional: `SLACK_BETA_CHANNEL_ID`, `SLACK_BETA_THANKS_REACTION`, `SLACK_BETA_THANKS_USER_IDS`

Redeploy, then re-verify the Event Subscriptions URL in Slack.

## Flow

1. Someone applies on pinporium.app → Slack message (webhook only, no email).
2. You review the signup.
3. You react with :incoming_envelope: → Resend sends the right template → bot replies in thread with confirmation.

Automatic email on form submit is **off** to avoid duplicates.
