# Color contrast (WCAG 2.2)

Pinporium web targets **WCAG 2.2 Level AA** for text and UI on marketing pages.

## Design tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--foreground` / `navy` | `#2C3345` | Headings, body on light backgrounds |
| `--foreground-accent` | `#524E5F` | Secondary body, labels, placeholders (≥75% on white for inputs) |
| `--primary` | `#E8734A` | Brand fills (buttons use ink variant below) |
| `--primary-ink` | `#A34A29` | Links, errors, coral icons on light backgrounds |
| `--primary-accent` | `#8B3B22` | Hover for primary-ink links and buttons |
| `--secondary` | `#2D8B75` | Fills, focus rings, teal on dark footer CTAs |
| `--secondary-ink` | `#1F604F` | Links, teal icons and accents on light backgrounds |

## Pairs that pass AA (normal text ≥4.5:1)

- Navy / foreground on `--background`, `cream`, `hero-background`
- `foreground-accent` on light page backgrounds
- `primary-ink` and `secondary-ink` on light backgrounds
- Footer: `cream/65`–`cream/80` on `deco-dark` for body and links
- CTA block: `cream/70`–`cream/90` on `deco-dark`

## Decorative (not required to meet text contrast)

- `gold-deco` borders, diamond bullets, gradient rules
- Hero deco grid / sunburst washes
- Device frame chrome

## Re-check after visual changes

When you change brand colors, re-run contrast checks on:

1. Body + muted text on `--background`
2. Footer muted links (`text-cream/65` minimum on `deco-dark`)
3. Primary CTA button (`text-white` on `bg-primary-ink`)
4. Form placeholders (`placeholder:text-foreground-accent/75` on white)

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or Lighthouse Accessibility audit in Chrome DevTools.
