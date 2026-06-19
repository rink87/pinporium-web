/**
 * Release notes for site changelog, marketing emails, and Discord.
 * Keep in sync with pinporium/content/release-notes.ts when shipping app builds.
 */

/** Lucide icon key — matches in-app What's new modal. */
export type ReleaseNoteIcon =
  | "layers"
  | "truck"
  | "arrow-left-right"
  | "shield"
  | "sparkles"
  | "map-pin"
  | "medal"
  | "circle-user";

export type ReleaseNoteItem = {
  title: string;
  body: string;
  icon?: ReleaseNoteIcon;
};

export type ChangelogKind = "feature" | "fix" | "improvement";

/**
 * How to categorize /changelog items (strict — reserve "feature" for net-new capability):
 *
 * - **feature** — A new screen, tab, flow, or action users could not do before. Not a sub-option,
 *   field, badge, rename, or extension of something already shipped.
 * - **improvement** — Extends or polishes existing product: new fields on a known form, UX/copy,
 *   sorting, performance, policy, or visibility toggles on settings that already exist.
 * - **fix** — Repairs broken or unintended behavior.
 *
 * When in doubt, prefer improvement over feature.
 */
export type ChangelogItem = {
  kind: ChangelogKind;
  text: string;
};

export type ReleaseNotesEntry = {
  version: string;
  date: string;
  headline?: string;
  summary?: string;
  highlights: ReleaseNoteItem[];
  /** Granular items for /changelog — features, improvements, and fixes. */
  changelog?: ChangelogItem[];
};

/** Newest first. */
export const RELEASE_NOTES: ReleaseNotesEntry[] = [
  {
    version: "1.0.3",
    date: "2026-06-12",
    headline: "What's new",
    summary:
      "Sell pins from your vault, manage trades and sales on The Hunt → Offers, find collectors, support artists, and browse listings on Discover.",
    highlights: [
      {
        title: "For sale",
        icon: "sparkles",
        body: "Mark vault copies **for sale** alongside **for trade**. Set a **fixed ask** or **open to offers**, **USD/CAD** pricing, shipping terms, and a buyer contact email.",
      },
      {
        title: "Offers on The Hunt",
        icon: "arrow-left-right",
        body: "The Hunt **Trades** subtab is now **Offers**. Trade proposals and **sale offers** share one inbox — **Needs action**, **Waiting**, and **History**.",
      },
      {
        title: "Collector search",
        icon: "circle-user",
        body: "**Search collectors** from Search and visit their **public profiles**. Control what you show — **stats**, **trade pins**, **sale pins**, **vault**, and **boards** — in **Settings**.",
      },
      {
        title: "Artists support",
        icon: "medal",
        body: "Artists can **claim their profile** from artist pages to manage their official catalog. Pin makers can **apply to become a partner artist** from Search.",
      },
      {
        title: "Discover listings",
        icon: "map-pin",
        body: "Browse **For trade** and **For sale** on Discover, open a **listing preview** before you message, and check **Recently added** catalog pins.",
      },
    ],
    changelog: [
      { kind: "feature", text: "**For sale** — list vault copies for sale alongside for trade." },
      { kind: "improvement", text: "Set a **fixed ask** or **open to offers (OBO)** when listing for sale." },
      { kind: "improvement", text: "**USD/CAD** currency on ask price, personal value, and price paid." },
      { kind: "improvement", text: "Buyer **contact email** required before listing for sale (defaults to your account email)." },
      { kind: "improvement", text: "Shipping terms when listing: included, additional amount, or **contact seller**." },
      { kind: "improvement", text: "**For Sale** listing sheet from pin detail; copy locks while a sale is pending." },
      { kind: "improvement", text: "Fixed-ask listings: **Contact seller**. OBO listings: **Suggest an offer** with one seller counter." },
      { kind: "improvement", text: "Sale flow: accept offer → pending sale → mark paid → **mark as sold** when finished offline." },
      { kind: "improvement", text: "Sale complete screen with summary, pin stack, notes, and timeline." },
      { kind: "improvement", text: "**Close** completed sales from your side when the deal is done." },
      { kind: "improvement", text: "The Hunt **Trades** subtab renamed **Offers** (still on The Hunt)." },
      { kind: "feature", text: "Trade and **sale offers** in one inbox — **Needs action**, **Waiting**, and **History**." },
      { kind: "improvement", text: "Offer history sorted newest first across trades and sales." },
      { kind: "improvement", text: "Home cards for pending trades, incoming trade requests, pending sales, and offer updates." },
      { kind: "improvement", text: "Offer **expiry badges** on inbox cards and clearer expired states on detail screens." },
      { kind: "improvement", text: "Unresolved trade and sale offers expire after ~14 days." },
      { kind: "feature", text: "**Report a problem** on active trade or sale fulfillment; mark **resolved** when sorted out." },
      { kind: "improvement", text: "Richer **completion timelines** on finished trades and sales." },
      { kind: "feature", text: "**Search collectors** by username or display name from Search." },
      { kind: "improvement", text: "Public profiles: tabs for trade listings, sale listings, vault, and boards." },
      { kind: "improvement", text: "**Sale pins** added to public profile visibility settings." },
      { kind: "improvement", text: "Public profiles show **completed sales** count alongside trades." },
      { kind: "improvement", text: "Shareable **public board** pages." },
      { kind: "improvement", text: "**Trade request** and **counter-offer pin picker** policies in Settings." },
      { kind: "feature", text: "**Claim this artist profile** on unverified artist pages to request catalog access." },
      { kind: "feature", text: "**Partner with Pinporium** — apply from Search to become a verified partner artist." },
      { kind: "improvement", text: "**Partner** badge on Discover, Search, and artist profiles for verified artists." },
      { kind: "feature", text: "Discover **For trade** and **For sale** categories show live collector listings." },
      { kind: "feature", text: "**Recently added** catalog pins on Discover." },
      { kind: "feature", text: "**Listing preview** before you contact a seller or send an offer." },
      { kind: "improvement", text: "Consistent pin row and grid cards across Home, vault, and Discover." },
      { kind: "feature", text: "**Retake vault photos** from pin detail with optional catalog re-link." },
      { kind: "improvement", text: "Optional **number of pin posts** on vault rows and catalog submissions." },
      { kind: "improvement", text: "**Suggest an edit** on catalog pins; **Report an issue** on vault pins." },
      { kind: "fix", text: "Fixed **Quick Add** crashing after photo crop on Android." },
      { kind: "improvement", text: "Smoother **3D pin viewer** performance on Android." },
    ],
  },
  {
    version: "1.0.2",
    date: "2026-06-02",
    headline: "What's new",
    summary:
      "Richer pin details, public profiles, collector leaderboards, smoother onboarding, and US & Canada shipping.",
    highlights: [
      {
        title: "Expanded pin details",
        icon: "layers",
        body: "New attributes of pin type — **mechanism** (spinners, sliders, etc.) and pin features — **effects** (glow, glitter, stained glass) available on catalog and vault pins.",
      },
      {
        title: "Public profile",
        icon: "circle-user",
        body: "Choose what other collectors see on your profile — **stats**, **trade pins**, **vault pins**, and **boards**.",
      },
      {
        title: "Collector leaderboards",
        icon: "medal",
        body: "See where you rank — **collector score**, **vault size**, and **catalog contributions**.",
      },
      {
        title: "US & Canada shipping",
        icon: "truck",
        body: "Shipping addresses support both countries with formatted **ZIP** and **postal codes** on your trade profile.",
      },
      {
        title: "Onboarding refresh",
        icon: "sparkles",
        body: "Follow artists during setup, set profile visibility, and review your choices on a **welcome recap** with quick edits.",
      },
    ],
    changelog: [
      { kind: "improvement", text: "Expanded **mechanism** options on catalog and vault pins (spinners, sliders, and more)." },
      { kind: "improvement", text: "Expanded **effects** options on catalog and vault pins (glow, glitter, stained glass, and more)." },
      { kind: "feature", text: "Public **profile visibility** toggles — control **stats**, **trade pins**, **vault pins**, and **boards**." },
      { kind: "feature", text: "**Collector leaderboards** — rank by collector score, vault size, and catalog contributions." },
      { kind: "improvement", text: "**Follow artists** during onboarding." },
      { kind: "improvement", text: "**Welcome recap** at end of onboarding with quick edits before you start collecting." },
      { kind: "improvement", text: "Refreshed onboarding flow and clearer setup copy." },
    ],
  },
  {
    version: "1.0.1",
    date: "2026-06-01",
    headline: "What's new",
    summary: "Smarter pin details, trade shipping, and onboarding polish.",
    highlights: [
      {
        title: "Pin type & features",
        icon: "layers",
        body: "Catalog and vault pins now separate **mechanism** (spinners, sliders, etc.) from **effects** (glow, glitter, stained glass).",
      },
      {
        title: "US & Canada shipping",
        icon: "truck",
        body: "Shipping addresses support both countries with formatted ZIP and postal codes on your trade profile.",
      },
      {
        title: "Trade settings in onboarding",
        icon: "arrow-left-right",
        body: "New collectors set **trade policy** and shipping during setup so trades are ready sooner.",
      },
      {
        title: "Collection items in vault",
        icon: "shield",
        body: "Promote series and collection-aware vault flows for organizing drops and sets.",
      },
    ],
    changelog: [
      { kind: "feature", text: "Pin details split **mechanism** (spinners, sliders, etc.) from **effects** (glow, glitter, stained glass)." },
      { kind: "feature", text: "**US & Canada** shipping addresses on trade profiles with formatted ZIP and postal codes." },
      { kind: "improvement", text: "Set **trade policy** and shipping address during onboarding." },
      { kind: "feature", text: "**Collection items** and series-aware vault organization for drops and sets." },
      { kind: "improvement", text: "Clearer trade setup prompts during onboarding." },
    ],
  },
];

export function getLatestReleaseNotes(): ReleaseNotesEntry | null {
  return RELEASE_NOTES[0] ?? null;
}

export function stripReleaseNoteMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}

function renderBoldDiscord(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "**$1**");
}

export function formatReleaseNotesDiscord(entry: ReleaseNotesEntry): string {
  const headline = entry.headline ?? "What's new";
  const lines = [
    `## ${headline} — v${entry.version}`,
    "",
    entry.summary ? `${entry.summary}\n` : "",
    ...entry.highlights.flatMap((item) => [
      `**${item.title}**`,
      renderBoldDiscord(item.body),
      "",
    ]),
    "_Pinporium — one vault for your whole pin collection._",
  ];
  return lines.join("\n").trim();
}

export function formatReleaseNotesPlaintext(entry: ReleaseNotesEntry): string {
  const headline = entry.headline ?? "What's new";
  const lines = [
    `${headline} (v${entry.version})`,
    entry.summary ?? "",
    "",
    ...entry.highlights.map((item) => {
      const body = stripReleaseNoteMarkdown(item.body);
      return `• ${item.title} — ${body}`;
    }),
    "",
    "Pinporium — one vault for your whole pin collection.",
  ];
  return lines
    .filter((line, i, arr) => line !== "" || (i > 0 && arr[i - 1] !== ""))
    .join("\n")
    .trim();
}

export function formatReleaseNotesEmailBodyHtml(
  entry: ReleaseNotesEntry,
  theme: {
    foreground: string;
    foregroundAccent: string;
    fontDisplay: string;
  },
): string {
  const headline = entry.headline ?? "What's new";
  const summaryBlock = entry.summary
    ? `<p style="margin:0 0 20px;color:${theme.foregroundAccent};font-size:15px;line-height:1.5;">${escapeHtml(entry.summary)}</p>`
    : "";

  const items = entry.highlights
    .map((item) => {
      const bodyHtml = formatInlineBoldHtml(item.body);
      return `<p style="margin:0 0 16px;color:${theme.foreground};font-size:15px;line-height:1.55;"><strong style="color:${theme.foreground};">${escapeHtml(item.title)}</strong> — ${bodyHtml}</p>`;
    })
    .join("");

  return `
    <p style="margin:0 0 8px;font-family:${theme.fontDisplay};font-size:22px;color:${theme.foreground};">${escapeHtml(headline)}</p>
    <p style="margin:0 0 16px;font-size:14px;color:${theme.foregroundAccent};">Version ${escapeHtml(entry.version)}</p>
    ${summaryBlock}
    ${items}
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInlineBoldHtml(text: string): string {
  return text
    .split(/(\*\*.+?\*\*)/g)
    .map((part) => {
      const bold = part.match(/^\*\*(.+)\*\*$/);
      if (bold) return `<strong>${escapeHtml(bold[1])}</strong>`;
      return escapeHtml(part);
    })
    .join("");
}
