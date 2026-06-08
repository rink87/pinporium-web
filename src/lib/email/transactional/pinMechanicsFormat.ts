/** Display labels aligned with pinporium/src/lib/pinType.ts and pinFeatures.ts */

const PIN_TYPE_LABELS: Record<string, string> = {
  spinner: 'Spinner',
  slider: 'Slider',
  hinge: 'Hinge / moving parts',
  dangler: 'Dangler / charm',
  chain: 'Chain / drop',
  bobble: 'Bobble / wiggle',
  pin_on_pin: 'Pin-on-pin / layered',
  multi_post: 'Multi-post / stacked',
  other: 'Other',
};

const PIN_FEATURE_LABELS: Record<string, string> = {
  glow: 'Glow in the dark',
  glitter: 'Glitter / shimmer',
  stained_glass: 'Stained glass / translucent',
  pearl_swirl: 'Pearl swirl / pearlescent',
  epoxy_dome: 'Epoxy dome / resin coat',
  dual_plating: 'Dual plating',
  holographic: 'Holographic',
  sculpted_3d: '3D sculpted / high relief',
  lenticular: 'Lenticular',
  flocking: 'Flocking',
  uv_reactive: 'UV / neon reactive',
  back_relief: 'Back relief',
};

export function formatPinTypeLabel(value: string | null | undefined): string | null {
  const v = value?.trim().toLowerCase();
  if (!v || v === 'standard') return null;
  return PIN_TYPE_LABELS[v] ?? v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatPinFeaturesLabel(values: string[] | null | undefined): string | null {
  if (!values?.length) return null;
  const labels = values
    .map(f => f?.trim().toLowerCase())
    .filter((f): f is string => Boolean(f))
    .map(f => PIN_FEATURE_LABELS[f] ?? f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  if (labels.length === 0) return null;
  return labels.join(', ');
}

export function normalizePinFeaturesKey(values: string[] | null | undefined): string {
  return (values ?? [])
    .map(f => f?.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join(',');
}
