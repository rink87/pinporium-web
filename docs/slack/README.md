# Pinporium Beta — Slack app manifests

Use these to create the **Pinporium Beta** Slack app in one step (scopes, events, bot user).

| File | Use when |
|------|----------|
| [`pinporium-beta-welcome-manifest.yaml`](./pinporium-beta-welcome-manifest.yaml) | Slack UI → **Create New App** → **From an app manifest** (paste YAML) |
| [`pinporium-beta-welcome-manifest.json`](./pinporium-beta-welcome-manifest.json) | Same flow if you prefer JSON |

Full setup and env vars: [`../slack-beta-welcome-email.md`](../slack-beta-welcome-email.md).

## Quick install

1. **Deploy** `pinporium-web` with `RESEND_*` and at least placeholder `SLACK_SIGNING_SECRET` / `SLACK_BOT_TOKEN` (or deploy first, add secrets after creating the app).
2. [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From an app manifest** → select workspace.
3. Paste contents of `pinporium-beta-welcome-manifest.yaml` (edit `request_url` if not using production).
4. **Install to workspace**.
5. Copy **Signing Secret** → `SLACK_SIGNING_SECRET`, **Bot User OAuth Token** → `SLACK_BOT_TOKEN` in Vercel → redeploy.
6. In Slack app settings → **Event Subscriptions** → confirm Request URL shows **Verified**.
7. `/invite @Pinporium Beta` in your beta channel.
8. Optional: channel ID → `SLACK_BETA_CHANNEL_ID`.

## Trigger

React with **:incoming_envelope:** on a message that starts with `Beta Tester Request`.

## Separate: signup webhook

Site form posts use an **Incoming Webhook** (`SLACK_BETA_WEBHOOK_URL`) — not part of this manifest. Create under **Incoming Webhooks** in any app, or keep your existing webhook URL.
