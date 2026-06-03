# Mobile performance (PageSpeed)

## Changes in place

- **Homepage JS** — Removed `framer-motion`; benefit sections use CSS scroll-driven animation.
- **Images** — `next/image` at quality 80–82, AVIF/WebP via `next.config.mjs`, lazy below the fold, hero `fetchPriority="high"`.
- **Beta modal** — Form + Turnstile load only when the dialog opens (`dynamic` import).
- **Demo video** — Loads and plays only when scrolled into view.
- **Fonts** — Subset weights only; Playfair uses `display: optional` to reduce render blocking.

## Re-test

[PageSpeed Insights](https://pagespeed.web.dev/) → mobile → `https://www.pinporium.app` (or `pinporium.app`).

## If score is still below 95 mobile

1. **CrUX** — “No data” is normal for low traffic; lab score is what we optimize.
2. **Hero asset** — Replace `hero-home.png` with a tighter crop or pre-compressed WebP under ~80KB.
3. **GA** — `NEXT_PUBLIC_GA_MEASUREMENT_ID` adds third-party JS; acceptable tradeoff for analytics.
4. **Screenshots folder** — Unused assets under `public/images/Screenshots/` are not served but add repo weight; safe to delete locally if not needed.
