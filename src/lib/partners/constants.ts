export const PARTNERS_EMAIL = "partners@pinporium.app";

export const PARTNERS_SELL_CHANNELS = [
  { id: "direct", label: "Direct (DM / website)" },
  { id: "popshop", label: "Pop shop" },
  { id: "etsy", label: "Etsy" },
  { id: "other", label: "Other" },
] as const;

export type PartnersSellChannelId = (typeof PARTNERS_SELL_CHANNELS)[number]["id"];
