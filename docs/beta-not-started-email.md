# Beta check-in emails

Two manual check-ins, sent from **pinporium-admin** → **Send check-in** (dropdown with **Suggested** based on sign-in count):

| Type | When to use | DB column | Resend tag |
|------|-------------|-----------|------------|
| **Not started yet** | Welcome sent, **0 app sign-ins** | `check_in_sent_at` | `beta_check_in` |
| **Active user** | **≥1 app sign-in** | `check_in_active_sent_at` | `beta_check_in_active` |

Migration: `20260688_beta_check_in_active.sql`.

---

## Not started yet

For collectors who **applied**, received the **welcome email** (Slack :incoming_envelope:), but have **not signed into the app**.

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

## Admin (pinporium-admin)

After migration `20260682_beta_applications` is applied:

- **Beta** nav → `/beta-testers` — list, platform, lifecycle status, both check-in sent dates, sign-in count, **Send check-in** dropdown (suggests not-started vs active from sign-in count).
- **Add signup** — backfill Slack-only applicants.
- Requires `ADMIN_BETA_EMAIL_SECRET` (same on web + admin) and `PINPORIUM_WEB_URL` on admin.

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

`Quick check-in — haven't started yet`

## Check-in page (not started)

- URL: `https://pinporium.app/beta/check-in`
- Query params: `reason`, `platform` (`ios` | `android`), `email` (optional)
- Example: `https://pinporium.app/beta/check-in?reason=install-trouble&platform=ios&email=alex@example.com`

Reason values: `not-installed`, `install-trouble`, `no-account`, `no-time`, `wrong-device`, `privacy`, `not-interested`, `other`.

## Slack (not started)

Submissions post to `SLACK_BETA_WEBHOOK_URL` with header **Beta check-in (not started yet)**.

---

## Active user (feature feedback)

For testers who have **signed into the app** at least once. The email is a **single CTA** to a web form (no survey inside the email).

### Send

```ts
import { sendBetaActiveUserCheckInEmail } from "@/lib/email/sendBetaEmails";

await sendBetaActiveUserCheckInEmail({
  name: "Alex",
  email: "alex@example.com",
  platform: "ios",
});
```

Test script: `npx tsx --env-file=.env.local scripts/send-check-in-test.ts [email] [name] [ios|android] active`

### Subject

`Quick beta feedback (~3 min) — which features have you tried?`

### Feedback form (active)

- URL: `https://pinporium.app/beta/check-in?audience=active&platform=ios&email=alex@example.com`
- **Features used** — check all that apply (vault add, catalog search/submit, ISOs, trades, etc.)
- **Add pin to vault** — experience rating + optional notes
- **Submit to catalog** — experience rating + optional notes
- **Open text** — liked best, confusing, wish-list feature

### Slack (active)

Header **Beta check-in (active user)** with structured feature list and flow ratings.
