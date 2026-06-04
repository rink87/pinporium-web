# Beta check-in email (not started yet)

For collectors who **applied**, received the **welcome email** (Slack :incoming_envelope:), but have **not created an app account**.

## Recommended flow

1. **Email** — Short note + tappable reason links (each opens the web form with that reason selected).
2. **Web form** — [`/beta/check-in`](https://pinporium.app/beta/check-in) collects email, optional details, posts to **Slack** (same webhook as beta signups).
3. **Do not** embed a full survey inside the email — most clients block forms; one-click links convert better.

### Why links beat other options

| Approach | Verdict |
|----------|---------|
| List of links in email → form with `?reason=` | **Best** — one tap, pre-selected, works on mobile |
| Full survey in email | Poor — broken in Gmail/Apple Mail |
| `mailto:` with options | OK as fallback; messy replies, hard to aggregate |
| Google Form only | Fine; less branded, no install CTA in same email |

Optional: include `?email=` in links when sending via Resend (per-recipient merge) so the form is pre-filled. Email in URLs is visible in browser history — acceptable for a small beta list.

## Send the email

### Preview (local)

```bash
cd pinporium-web && npm run dev
# http://localhost:3001/email-preview — section "3 — Not started yet"
```

### Resend (manual or broadcast)

Use HTML from `betaNotYetStartedEmailHtml({ name, platform, email })` or call:

```ts
import { sendBetaNotYetStartedEmail } from "@/lib/email/sendBetaEmails";

await sendBetaNotYetStartedEmail({
  name: "Alex",
  email: "alex@example.com",
  platform: "ios", // or "android"
});
```

Per-recipient `email` in the template pre-fills check-in links and the form.

### Subject

`Quick check-in — Pinporium beta`

## Check-in page

- URL: `https://pinporium.app/beta/check-in`
- Query params: `reason`, `platform` (`ios` | `android`), `email` (optional)
- Example: `https://pinporium.app/beta/check-in?reason=install-trouble&platform=ios&email=alex@example.com`

Reason values: `not-installed`, `install-trouble`, `no-account`, `no-time`, `wrong-device`, `privacy`, `not-interested`, `other`.

## Slack

Submissions post to `SLACK_BETA_WEBHOOK_URL` with header **Beta check-in (not started yet)**.
