/**
 * Release notes for marketing emails / Discord.
 * Keep in sync with pinporium/content/release-notes.ts when shipping app builds.
 */

export type ReleaseNoteItem = {
  title: string;
  body: string;
};

export type ReleaseNotesEntry = {
  version: string;
  date: string;
  headline?: string;
  summary?: string;
  highlights: ReleaseNoteItem[];
};

export const RELEASE_NOTES: ReleaseNotesEntry[] = [
  {
    version: "1.0.1",
    date: "2026-06-01",
    headline: "What's new",
    summary: "Smarter pin details, trade shipping, and onboarding polish.",
    highlights: [
      {
        title: "Pin type & features",
        body: "Catalog and vault pins now separate **mechanism** (spinners, sliders, etc.) from **effects** (glow, glitter, stained glass).",
      },
      {
        title: "US & Canada shipping",
        body: "Shipping addresses support both countries with formatted ZIP and postal codes on your trade profile.",
      },
      {
        title: "Trade settings in onboarding",
        body: "New collectors set **trade policy** and shipping during setup so trades are ready sooner.",
      },
      {
        title: "Collection items in vault",
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
