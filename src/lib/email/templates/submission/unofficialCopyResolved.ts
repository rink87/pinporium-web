import { emailCalloutBox } from "@/lib/email/transactional/blocks";
import { escapeHtml } from "@/lib/email/blocks";
import { pinImageEmailPreviewUrl } from "@/lib/email/transactional/pinImageUrls";
import type { CatalogVariantSnapshot, SubmissionEmailRow } from "./submissionApproved";
import { transactionalEmailLayout } from "@/lib/email/transactional/layout";
import { transactionalEmailTheme } from "@/lib/email/transactional/theme";

/** User-facing label; the internal designation is `unauthorized_copy`. */
const UNOFFICIAL_COPY_LABEL = "Unofficial copy";

export type UnofficialCopyEmailKind = "new_pin" | "link_verification";

function originalDesignName(
  row: SubmissionEmailRow,
  original?: CatalogVariantSnapshot | null,
): string {
  return (
    original?.design_name?.trim() ||
    row.canonical_design_name?.trim() ||
    row.proposed_design_name?.trim() ||
    "this pin"
  );
}

function originalArtistName(original?: CatalogVariantSnapshot | null): string {
  return original?.artist_name?.trim() || "";
}

/** Mirrors `unofficialCopyOfLine` in the app so email and app read the same. */
export function unofficialCopyOfEmailLine(
  original?: CatalogVariantSnapshot | null,
): string {
  const design = original?.design_name?.trim();
  const artist = original?.artist_name?.trim();
  if (design && artist) return `Copy of ${design} by ${artist}`;
  if (design) return `Copy of ${design}`;
  return "Copy of another catalog pin";
}

function pickImageUrl(...candidates: (string | null | undefined)[]): string | null {
  for (const c of candidates) {
    const u = pinImageEmailPreviewUrl(c);
    if (u && /^https?:\/\//i.test(u)) return u;
  }
  return null;
}

function photoCell(label: string, url: string | null, caption: string): string {
  const t = transactionalEmailTheme;
  const media = url
    ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(label)}" width="200" style="display:block;width:100%;max-width:200px;height:auto;margin:0 auto;border-radius:8px;border:1px solid ${t.cardBorder};background:#fff;" />`
    : `<div style="height:120px;border-radius:8px;border:1px dashed ${t.cardBorder};background:#f8f4ef;"></div>`;
  return `
    <td width="50%" style="padding:4px;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};text-align:center;">${escapeHtml(label)}</p>
      ${media}
      <p style="margin:6px 0 0;font-size:12px;line-height:1.4;color:${t.foregroundAccent};text-align:center;">${escapeHtml(caption)}</p>
    </td>`;
}

function emailUnofficialCopyComparison(args: {
  yourFrontUrl: string | null;
  originalFrontUrl: string | null;
  originalLabel: string;
  copyOfLine: string;
}): string {
  const t = transactionalEmailTheme;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid ${t.cardBorder};border-radius:12px;background:#fffdf9;overflow:hidden;">
      <tr>
        <td style="padding:12px 12px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${photoCell("Your pin", args.yourFrontUrl, args.copyOfLine)}
              ${photoCell("Original", args.originalFrontUrl, args.originalLabel)}
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 12px 12px;text-align:center;">
          <span style="display:inline-block;padding:4px 10px;border-radius:999px;border:1px solid ${t.cardBorder};color:${t.foregroundAccent};font-size:11px;font-weight:700;letter-spacing:0.04em;">${escapeHtml(UNOFFICIAL_COPY_LABEL.toUpperCase())}</span>
        </td>
      </tr>
    </table>`;
}

function emailReviewerNoteBlock(note: string): string {
  const t = transactionalEmailTheme;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;border:1px solid rgba(45,139,117,0.35);border-radius:10px;background:rgba(45,139,117,0.06);">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};">From our team</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.55;color:${t.foreground};">${escapeHtml(note)}</p>
        </td>
      </tr>
    </table>`;
}

export function unofficialCopyResolvedEmailSubject(
  row: SubmissionEmailRow,
  original?: CatalogVariantSnapshot | null,
): string {
  const name =
    original?.design_name?.trim() ||
    row.canonical_design_name?.trim() ||
    row.proposed_design_name?.trim();
  return name ? `Catalog update: ${name}` : "Catalog update for your pin";
}

export function unofficialCopyResolvedEmailHtml(args: {
  row: SubmissionEmailRow;
  original?: CatalogVariantSnapshot | null;
  kind: UnofficialCopyEmailKind;
  recipientFirstName?: string;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}): string {
  const t = transactionalEmailTheme;
  const { row, original, kind } = args;
  const designName = originalDesignName(row, original);
  const artistName = originalArtistName(original);
  const originalLabel = artistName ? `${designName} by ${artistName}` : designName;
  const copyOfLine = unofficialCopyOfEmailLine(original);
  const greetingName = (args.recipientFirstName ?? "").trim() || "there";
  const reviewerNote = row.submitter_message?.trim() || "";

  const yourFrontUrl = pickImageUrl(row.processed_front_url, row.front_image_url);
  const originalFrontUrl = pickImageUrl(original?.front_image_url);

  const intro =
    kind === "new_pin"
      ? `Thanks for adding this pin to Pinporium. While reviewing it, we found it closely matches <strong>${escapeHtml(originalLabel)}</strong>, but it looks like an unofficial copy rather than a release from the original artist.`
      : `Thanks for linking this pin. While reviewing it, we found it closely matches <strong>${escapeHtml(originalLabel)}</strong>, but it looks like an unofficial copy rather than a release from the original artist. We linked your vault pin to the unofficial copy listing instead.`;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">Hi ${escapeHtml(greetingName)},</p>
    <p style="margin:0 0 16px;color:${t.foreground};">${intro}</p>

    ${emailUnofficialCopyComparison({ yourFrontUrl, originalFrontUrl, originalLabel, copyOfLine })}

    ${reviewerNote ? emailReviewerNoteBlock(reviewerNote) : ""}

    ${emailCalloutBox({
      title: "What this means",
      bodyHtml: `
        <p style="margin:0 0 10px;">Unofficial copies are common, and they are often sold as originals, so this is not on you.</p>
        <p style="margin:0 0 10px;">Your pin <strong>stays in your vault</strong> with your photos and notes. It is listed in the catalog as <strong>${escapeHtml(UNOFFICIAL_COPY_LABEL)}</strong> so other collectors know what they are looking at.</p>
        <p style="margin:0;">You can still trade or sell it. The ${escapeHtml(UNOFFICIAL_COPY_LABEL.toLowerCase())} label travels with it.</p>
      `,
    })}

    <p style="margin:0 0 4px;font-family:${t.fontDisplay};font-size:18px;font-weight:600;color:${t.foreground};">Think yours is original?</p>
    <p style="margin:0;font-size:15px;line-height:1.55;color:${t.foreground};">Open the pin in your vault in the Pinporium app and tap <strong>I think mine is original</strong>. Clear photos of the back and backstamp help us take another look.</p>
  `;

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return transactionalEmailLayout({
    previewText: `${copyOfLine}. It stays in your vault.`,
    title: "Catalog update",
    bodyHtml,
    footerHtml,
    assetsBaseUrl: args.assetsBaseUrl,
    wordmarkSrc: args.wordmarkSrc,
  });
}
