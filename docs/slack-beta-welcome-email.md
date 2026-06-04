# Send beta welcome email from Slack

Signups post to your beta channel via the site webhook. **You** approve and send emails by reacting on that message.

## Triggers

| Reaction | Action |
|----------|--------|
| **:approved:** | Adds/updates the signup in **Admin → Beta testers** (reads name, email, platform, pins, why from the Slack message) |
| **:incoming_envelope:** | Sends the welcome email (TestFlight or Play) and records `welcome_sent_at` |

Override emojis with `SLACK_BETA_APPROVED_REACTION` and `SLACK_BETA_THANKS_REACTION`.

## Typical flow

1. Someone applies on pinporium.app → Slack message (webhook).
2. React **:approved:** → row appears in admin Beta testers.
3. React **:incoming_envelope:** → welcome email sent → status becomes **Invited** in admin.

New signups also upsert to admin automatically when the form submits (if `SUPABASE_SERVICE_ROLE_KEY` is set). **:approved:** is useful for backfill, re-sync, or if you prefer manual approval before they show up.

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
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (for :approved: → admin)
- Optional: `SLACK_BETA_CHANNEL_ID`, `SLACK_BETA_APPROVED_REACTION`, `SLACK_BETA_THANKS_REACTION`, `SLACK_BETA_THANKS_USER_IDS`

Redeploy, then re-verify the Event Subscriptions URL in Slack.

## Flow

1. Someone applies on pinporium.app → Slack message (webhook).
2. You react with **:approved:** → signup saved to admin Beta testers → bot confirms in thread.
3. You react with **:incoming_envelope:** → Resend sends the welcome template → bot confirms in thread.

Automatic upsert on form submit also runs when Supabase service role is configured.
