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

export type ChangelogSection = {
  title: string;
  items: string[];
};

export type ReleaseNotesEntry = {
  version: string;
  date: string;
  headline?: string;
  summary?: string;
  highlights: ReleaseNoteItem[];
  /** Full detail — /beta/changelog only (noindex). */
  changelog?: ChangelogSection[];
};

/** Newest first. */
export const RELEASE_NOTES: ReleaseNotesEntry[] = [
  {
    version: "1.0.3",
    date: "2026-06-12",
    headline: "What's new",
    summary:
      "List pins for sale, manage trades and sales in one Offers inbox, find other collectors, and browse real listings on Discover.",
    highlights: [
      {
        title: "List pins for sale",
        icon: "sparkles",
        body: "Mark vault copies **for sale** alongside **for trade**. Set a **fixed ask** or **open to offers**, **USD/CAD** pricing, shipping terms, and a buyer contact email.",
      },
      {
        title: "Offers — trades and sales together",
        icon: "arrow-left-right",
        body: "Hunt **Trades** is now **Offers**. Trade proposals and **sale offers** share one inbox — **Needs action**, **Waiting**, and **History**.",
      },
      {
        title: "Find collectors & profile controls",
        icon: "circle-user",
        body: "**Search collectors** from Search. Choose what your public profile shows — **stats**, **trade pins**, **sale pins**, **vault**, and **boards** — plus **trade request** policies in Settings.",
      },
      {
        title: "Discover real listings",
        icon: "map-pin",
        body: "Browse **For trade** and **For sale** on Discover, open a **listing preview** before you message, and check **Recently added** catalog pins.",
      },
      {
        title: "Clearer deals end to end",
        icon: "shield",
        body: "**Expiry reminders** on open offers, **report a problem** during fulfillment, and richer **completion timelines** when a trade or sale finishes.",
      },
    ],
    changelog: [
      {
        title: "List pins for sale",
        items: [
          "**For sale** vault flag — independent per copy, alongside **for trade**.",
          "**Fixed ask** or **open to offers (OBO)** when listing.",
          "**USD/CAD** on ask price, personal value, and price paid.",
          "Sale **contact email** required before listing (defaults to account email).",
          "Shipping: included, additional amount, or **contact seller**.",
          "**For Sale** listing sheet from pin detail; pending sale locks the copy while a deal is active.",
          "Fixed ask listings: **Contact seller**. OBO listings: **Suggest an offer** thread with one seller counter.",
          "Accept an offer → **pending sale** → mark buyer paid → **mark as sold** when complete offline.",
          "Sale complete screen with summary, pin stack, notes, and timeline.",
          "Per-user **close** on completed sales.",
        ],
      },
      {
        title: "Offers — trades and sales together",
        items: [
          "Hunt **Trades** tab renamed **Offers**.",
          "Trade and **sale offers** merged into **Needs action**, **Waiting**, and **History**.",
          "Combined offer history sorted newest first.",
          "Home cards for pending trades, incoming trade intake, pending sales, and offer updates.",
          "Offer **expiry badges** on inbox cards; clearer expired state on trade and sale detail screens.",
          "Open offers expire after ~14 days; hourly maintenance job.",
        ],
      },
      {
        title: "Collector profiles & settings",
        items: [
          "**Search collectors** by username or display name from the Search tab.",
          "Public profile toggles for **stats**, **trade pins**, **sale pins**, **vault pins**, and **boards**.",
          "Public profiles show **completed sales** count alongside trades.",
          "Shareable **public board** pages for collector boards.",
          "**Trade requests** policy in Settings — traders only vs any owned pin.",
          "**Counter-offer pin picker** policy in Settings — who can offer when you counter.",
        ],
      },
      {
        title: "Discover & listings",
        items: [
          "Discover **For trade** and **For sale** categories show real collector listings.",
          "**Recently added** surfaces new catalog variants by approval date.",
          "**Listing preview** before you contact a seller or send an offer.",
          "Standardized pin row and grid cards across Home, vault, and Discover.",
          "Optional **No. of pin posts** on vault rows and catalog submissions.",
          "Catalog pin detail → **Suggest an edit**; vault → **Report an issue**.",
          "**Retake vault photos** from pin detail with optional catalog re-link.",
        ],
      },
      {
        title: "Clearer deals & community",
        items: [
          "**Report a problem** on active trade or sale fulfillment (shipment issues, etc.).",
          "Mark a reported problem **resolved** when you and your counterparty sort it out.",
          "Richer **completion timelines** on finished trades and sales (notes folded in).",
          "Artists can **claim your profile** from artist pages.",
          "Partnerships contact form on Search.",
          "Android: smoother **3D pin viewer** and **Quick Add** crash fix after photo crop.",
        ],
      },
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
