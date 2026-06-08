import { emailCalloutBox } from "@/lib/email/transactional/blocks";
import { escapeHtml } from "@/lib/email/blocks";
import {
  formatPinFeaturesLabel,
  formatPinTypeLabel,
} from "@/lib/email/transactional/pinMechanicsFormat";
import { pinImageEmailPreviewUrl } from "@/lib/email/transactional/pinImageUrls";
import type { CatalogVariantSnapshot, SubmissionEmailRow } from "./submissionApproved";
import { transactionalEmailLayout } from "@/lib/email/transactional/layout";
import { transactionalEmailTheme } from "@/lib/email/transactional/theme";

function displayDesignName(
  row: SubmissionEmailRow,
  variant?: CatalogVariantSnapshot | null,
): string {
  return (
    variant?.design_name?.trim() ||
    row.canonical_design_name?.trim() ||
    row.proposed_design_name?.trim() ||
    'Your pin'
  );
}

function displayArtistName(
  row: SubmissionEmailRow,
  variant?: CatalogVariantSnapshot | null,
): string {
  return (
    variant?.artist_name?.trim() ||
    row.canonical_artist_name?.trim() ||
    row.proposed_artist_name?.trim() ||
    ''
  );
}

function formatEnamelLabel(raw: string | null | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  return v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function pickImageUrl(...candidates: (string | null | undefined)[]): string | null {
  for (const c of candidates) {
    const u = pinImageEmailPreviewUrl(c);
    if (u && /^https?:\/\//i.test(u)) return u;
  }
  return null;
}

function emailCatalogListingPreview(args: {
  designName: string;
  artistName: string;
  variantLine: string | null;
  editionLine: string | null;
  enamelLine: string | null;
  metalLine: string | null;
  pinTypeLine: string | null;
  pinFeaturesLine: string | null;
  frontUrl: string | null;
  backUrl: string | null;
}): string {
  const t = transactionalEmailTheme;
  const specs: { label: string; value: string }[] = [];
  if (args.variantLine) specs.push({ label: 'Variant', value: args.variantLine });
  if (args.editionLine) specs.push({ label: 'Edition', value: args.editionLine });
  if (args.enamelLine) specs.push({ label: 'Enamel', value: args.enamelLine });
  if (args.metalLine) specs.push({ label: 'Metal', value: args.metalLine });

  const specWidth = Math.floor(100 / Math.max(specs.length, 1));
  const specCells = specs
    .map(
      s => `
      <td style="width:${specWidth}%;padding:8px 6px;text-align:center;vertical-align:top;">
        <p style="margin:0;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};">${escapeHtml(s.label)}</p>
        <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${t.foreground};">${escapeHtml(s.value)}</p>
      </td>`,
    )
    .join('');

  const photoCell = (label: string, url: string | null) => {
    if (!url) {
      return `
        <td width="50%" style="padding:4px;">
          <div style="height:140px;border-radius:8px;border:1px dashed ${t.cardBorder};background:#f8f4ef;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:12px;color:${t.foregroundAccent};">No ${escapeHtml(label)} image</span>
          </div>
        </td>`;
    }
    return `
      <td width="50%" style="padding:4px;">
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};text-align:center;">${escapeHtml(label)}</p>
        <img src="${escapeHtml(url)}" alt="${escapeHtml(label)}" width="220" style="display:block;width:100%;max-width:220px;height:auto;margin:0 auto;border-radius:8px;border:1px solid ${t.cardBorder};background:#fff;" />
      </td>`;
  };

  const mechanics =
    args.pinTypeLine || args.pinFeaturesLine
      ? `<tr>
            <td colspan="${Math.max(specs.length, 2)}" style="padding:8px 6px 0;text-align:center;border-top:1px solid rgba(201,168,76,0.2);">
              <p style="margin:0;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};">Pin details</p>
              <p style="margin:4px 0 0;font-size:13px;color:${t.foreground};">${escapeHtml(
                [args.pinTypeLine, args.pinFeaturesLine].filter(Boolean).join(' · ') || '—',
              )}</p>
            </td>
          </tr>`
      : '';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:2px solid ${t.gold};border-radius:12px;background:linear-gradient(180deg, #fffdf9 0%, #f8f1e8 100%);overflow:hidden;">
      <tr>
        <td style="padding:12px 12px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>${photoCell('Front', args.frontUrl)}${photoCell('Back', args.backUrl)}</tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px 4px;text-align:center;">
          <p style="margin:0;font-family:${t.fontDisplay};font-size:20px;font-weight:700;color:${t.foreground};line-height:1.25;">${escapeHtml(args.designName)}</p>
          ${
            args.artistName
              ? `<p style="margin:6px 0 0;font-size:14px;color:${t.foregroundAccent};">${escapeHtml(args.artistName)}</p>`
              : ''
          }
        </td>
      </tr>
      ${
        specs.length > 0 || mechanics
          ? `<tr><td style="padding:4px 12px 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${
              specs.length > 0 ? `<tr>${specCells}</tr>` : ''
            }${mechanics}</table></td></tr>`
          : ''
      }
      <tr>
        <td style="padding:0 12px 10px;text-align:center;">
          <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(45,139,117,0.15);color:${t.secondary};font-size:11px;font-weight:700;letter-spacing:0.04em;">CATALOG LISTING</span>
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

function emailLinkVerifiedAppSection(): string {
  const t = transactionalEmailTheme;
  return `
    <p style="margin:0 0 4px;font-family:${t.fontDisplay};font-size:18px;font-weight:600;color:${t.foreground};">See it in the app</p>
    <p style="margin:0;font-size:15px;line-height:1.55;color:${t.foreground};">Open the Pinporium app to view your linked pin in your vault. Your photos and notes stay on your copy — the catalog link keeps specs aligned with the community listing.</p>`;
}

export function linkVerificationApprovedEmailSubject(
  row: SubmissionEmailRow,
  variant?: CatalogVariantSnapshot | null,
): string {
  return `Catalog link verified: ${displayDesignName(row, variant)}`;
}

export function linkVerificationApprovedEmailHtml(args: {
  row: SubmissionEmailRow;
  variant?: CatalogVariantSnapshot | null;
  recipientFirstName?: string;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}): string {
  const t = transactionalEmailTheme;
  const { row, variant } = args;
  const designName = displayDesignName(row, variant);
  const artistName = displayArtistName(row, variant);
  const variantLine = variant?.variant_name?.trim() || row.canonical_variant_name?.trim() || null;
  const editionLine = row.proposed_edition?.trim() || null;
  const enamelLine = formatEnamelLabel(row.canonical_enamel_type ?? row.proposed_enamel_type);
  const metalLine = row.canonical_metal_finish?.trim() || row.proposed_metal_finish?.trim() || null;
  const pinTypeLine = formatPinTypeLabel(variant?.pin_type ?? row.proposed_pin_type);
  const pinFeaturesLine = formatPinFeaturesLabel(variant?.pin_features ?? row.proposed_pin_features);

  const frontUrl = pickImageUrl(variant?.front_image_url, row.processed_front_url, row.front_image_url);
  const backUrl = pickImageUrl(variant?.back_image_url, row.processed_back_url, row.back_image_url);

  const reviewerNote = row.submitter_message?.trim() || '';
  const greetingName = (args.recipientFirstName ?? '').trim() || 'there';
  const reviewed = row.reviewed_at
    ? new Date(row.reviewed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">Hi ${escapeHtml(greetingName)},</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Good news — we verified that your vault pin matches <strong>${escapeHtml(designName)}</strong> in the Pinporium catalog. Your pin is now linked to this existing listing.</p>
    ${reviewed ? `<p style="margin:0 0 16px;font-size:14px;color:${t.foregroundAccent};">Verified on ${escapeHtml(reviewed)}</p>` : ''}

    ${emailCatalogListingPreview({
      designName,
      artistName,
      variantLine,
      editionLine,
      enamelLine,
      metalLine,
      pinTypeLine,
      pinFeaturesLine,
      frontUrl,
      backUrl,
    })}

    ${reviewerNote ? emailReviewerNoteBlock(reviewerNote) : ''}

    ${emailCalloutBox({
      title: 'What this means',
      borderColor: t.secondary,
      backgroundColor: 'rgba(45, 139, 117, 0.1)',
      bodyHtml: `
        <p style="margin:0 0 10px;">You connected your vault pin to an <strong>existing catalog listing</strong> — we did not create a new catalog entry.</p>
        <p style="margin:0 0 10px;">Your vault pin keeps <strong>your photos and notes</strong>. The link keeps details like artist, design, and variant aligned with the community record.</p>
        <p style="margin:0;">When you mark this pin <strong>for trade</strong>, other collectors see your real pin images in trade discovery.</p>
      `,
    })}

    ${emailLinkVerifiedAppSection()}
  `;

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return transactionalEmailLayout({
    previewText: `Your pin is linked to ${designName} in the catalog.`,
    title: 'Your catalog link was verified',
    bodyHtml,
    footerHtml,
    assetsBaseUrl: args.assetsBaseUrl,
    wordmarkSrc: args.wordmarkSrc,
  });
}
