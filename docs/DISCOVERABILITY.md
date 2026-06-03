# Pinporium discoverability checklist

What’s already implemented in **pinporium-web** vs what you need to do in external tools.

## Already on the site

- [x] Meta titles, descriptions, Open Graph, Twitter cards
- [x] `sitemap.xml` and `robots.txt`
- [x] JSON-LD: Organization, WebSite, MobileApplication, FAQPage (home)
- [x] `llms.txt` for AI crawlers
- [x] Product intro block on homepage (GEO-friendly definition)
- [x] `/changelog` synced with release notes
- [x] SEO landing pages:
  - [/for-artists](https://pinporium.app/for-artists)
  - [/for-collectors](https://pinporium.app/for-collectors)
  - [/enamel-pin-collection](https://pinporium.app/enamel-pin-collection)
  - [/pin-trading](https://pinporium.app/pin-trading)
  - [/pin-wishlist](https://pinporium.app/pin-wishlist)

---

## Your checklist

### 1. Google Search Console (required)

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property **URL prefix**: `https://pinporium.app` (or domain property if you control DNS at root).
3. Verify ownership (HTML tag in Vercel, DNS TXT, or Google Analytics — easiest if GA4 is already on the site).
4. Submit sitemap: `https://pinporium.app/sitemap.xml`
5. Request indexing for the homepage and new landing pages (URL inspection → Request indexing).
6. Check back in 1–2 weeks: Coverage, Pages, and **Performance** (queries, impressions, CTR).

### 2. Google Analytics 4 (required for ads & decisions)

1. Create a GA4 property for pinporium.app.
2. Copy the Measurement ID (`G-XXXXXXXX`).
3. In **Vercel** → Project → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = your `G-` ID (Production + Preview optional).
4. Redeploy.
5. In GA4: Admin → Data display → mark **Beta apply** as a key event (see step 3).

### 3. Beta apply conversion (recommended)

The form fires a GA4 event **`beta_apply_success`** (with `platform`: `ios` | `android`) on successful submit — see `src/lib/analytics.ts`.

1. In GA4: **Admin → Events** — wait 24–48h or use DebugView while testing.
2. Toggle **Mark as key event** on `beta_apply_success`.
3. Use this event as the conversion for Google Ads when you run campaigns.

### 4. Bing Webmaster Tools (optional, ~10 min)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Import from Google Search Console or verify site manually.
3. Submit the same sitemap URL.

### 5. App store discoverability (when listings go public)

- [ ] **App Store Connect** — Subtitle and keywords: enamel pin, collection, trade, catalog, ISO, pin collector (within Apple’s limits).
- [ ] **Google Play** — Short/full description aligned with site copy; screenshot captions mentioning vault, Hunt, trades.
- [ ] Use the same positioning as `/for-collectors` and `/enamel-pin-collection`.

### 6. Off-site presence (ongoing)

These don’t ship in the repo but drive SEO and GEO:

- [ ] Pin collector communities (Reddit, Facebook groups, Discord servers) — share beta when appropriate; link to `pinporium.app/for-collectors`.
- [ ] Reach out to pin artists you know → `pinporium.app/for-artists` + `help@pinporium.app`.
- [ ] Add site link to Discord server topic / welcome message.
- [ ] When you have social accounts, add URLs to `src/data/footer.ts` (`socials`) and verify in Search Console.

### 7. Content rhythm (you + repo)

- [ ] Each app release: add entry to `pinporium/content/release-notes.ts` and sync `pinporium-web/src/content/release-notes.ts` (see `pinporium/docs/RELEASE_NOTES.md`).
- [ ] Changelog updates automatically on deploy.
- [ ] Optional later: blog or “Guides” section for long-tail articles (not built yet).

### 8. Google Ads (when ready to spend)

Prerequisites: GA4 live, beta flow stable.

1. [Google Ads](https://ads.google.com) account.
2. Campaign: **Search** → Brand (`Pinporium`, `pinporium app`).
3. Second campaign: **Search** → Collection intent (`enamel pin collection app`, `pin trading app`, `pin ISO tracker`) → landing URLs:
   - `/enamel-pin-collection`
   - `/pin-trading`
   - `/pin-wishlist`
4. Negative keywords: `make pins`, `manufacturer`, `park trading pins` (unless you target that audience deliberately).
5. Conversion: tie to GA4 key event or manual offline conversion from Slack.

### 9. Testimonials & social proof (site)

- [ ] Collect 2–3 short quotes from beta collectors (name, optional @, one sentence).
- [ ] Uncomment/add testimonials on homepage (`src/app/page.tsx` + `src/data/testimonials.ts`).

### 10. Verify after deploy

```text
https://pinporium.app/sitemap.xml
https://pinporium.app/robots.txt
https://pinporium.app/llms.txt
https://pinporium.app/for-artists
```

Search: `site:pinporium.app` (may take days for new URLs).

---

## Env reference

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (preferred) |
| `GOOGLE_ANALYTICS_ID` | GA4 fallback (server layout) |
| `RESEND_*`, `SLACK_*`, `TURNSTILE_*` | Beta funnel (not SEO, but converts traffic) |

See `.env.example` in the repo root.
