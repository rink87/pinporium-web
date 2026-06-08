import { emailAppLoginSection } from "@/lib/email/transactional/appOpenCopy";
import { emailCalloutBox } from "@/lib/email/transactional/blocks";
import { escapeHtml } from "@/lib/email/blocks";
import {
  formatPinFeaturesLabel,
  formatPinTypeLabel,
  normalizePinFeaturesKey,
} from "@/lib/email/transactional/pinMechanicsFormat";
import { pinImageEmailPreviewUrl } from "@/lib/email/transactional/pinImageUrls";
import { transactionalEmailLayout } from "@/lib/email/transactional/layout";
import { transactionalEmailTheme } from "@/lib/email/transactional/theme";

export type SubmissionEmailRow = {
  id: string;
  proposed_artist_name: string | null;
  proposed_design_name: string | null;
  proposed_variant_name: string | null;
  proposed_edition: string | null;
  proposed_enamel_type: string | null;
  proposed_metal_finish: string | null;
  proposed_pin_type: string | null;
  proposed_pin_features: string[] | null;
  proposed_series_name: string | null;
  canonical_artist_name: string | null;
  canonical_design_name: string | null;
  canonical_variant_name: string | null;
  canonical_enamel_type: string | null;
  canonical_metal_finish: string | null;
  canonical_series_name: string | null;
  canonical_edition_size: number | null;
  canonical_edition_type: string | null;
  processed_front_url: string | null;
  processed_back_url: string | null;
  front_image_url: string | null;
  back_image_url: string | null;
  reviewed_at: string | null;
  /** User-facing note from reviewer (shown in app and approval email). */
  submitter_message: string | null;
};

export type CatalogVariantSnapshot = {
  front_image_url: string | null;
  back_image_url: string | null;
  variant_name: string | null;
  design_name: string | null;
  artist_name: string | null;
  pin_type: string | null;
  pin_features: string[] | null;
};

function norm(v: string | null | undefined): string {
  return (v ?? '').trim().toLowerCase();
}

function displayDesignName(row: SubmissionEmailRow, variant?: CatalogVariantSnapshot | null): string {
  return (
    row.canonical_design_name?.trim() ||
    variant?.design_name?.trim() ||
    row.proposed_design_name?.trim() ||
    'Your pin'
  );
}

function displayArtistName(row: SubmissionEmailRow, variant?: CatalogVariantSnapshot | null): string {
  return (
    row.canonical_artist_name?.trim() ||
    variant?.artist_name?.trim() ||
    row.proposed_artist_name?.trim() ||
    ''
  );
}

function formatEdition(row: SubmissionEmailRow): string | null {
  const parts: string[] = [];
  if (row.canonical_edition_size != null && !Number.isNaN(row.canonical_edition_size)) {
    parts.push(`LE ${row.canonical_edition_size}`);
  }
  if (row.canonical_edition_type?.trim()) {
    parts.push(row.canonical_edition_type.trim().replace(/_/g, ' '));
  }
  if (parts.length > 0) return parts.join(' · ');
  return row.proposed_edition?.trim() || null;
}

function formatEnamelLabel(raw: string | null | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  return v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

type FieldChange = { label: string; from: string; to: string };

function collectFieldChanges(row: SubmissionEmailRow, variant?: CatalogVariantSnapshot | null): FieldChange[] {
  const changes: FieldChange[] = [];
  const push = (label: string, proposed: string | null | undefined, canonical: string | null | undefined) => {
    const p = (proposed ?? '').trim();
    const c = (canonical ?? '').trim();
    if (!p && !c) return;
    if (p && c && norm(p) !== norm(c)) {
      changes.push({ label, from: p, to: c });
    }
  };

  push('Artist', row.proposed_artist_name, row.canonical_artist_name ?? variant?.artist_name);
  push('Design', row.proposed_design_name, row.canonical_design_name ?? variant?.design_name);
  push('Variant', row.proposed_variant_name, row.canonical_variant_name ?? variant?.variant_name);
  push('Edition', row.proposed_edition, formatEdition(row));
  push('Enamel', formatEnamelLabel(row.proposed_enamel_type), formatEnamelLabel(row.canonical_enamel_type));
  push('Metal finish', row.proposed_metal_finish, row.canonical_metal_finish);
  push('Series', row.proposed_series_name, row.canonical_series_name);

  const proposedType = formatPinTypeLabel(row.proposed_pin_type);
  const catalogType = formatPinTypeLabel(variant?.pin_type ?? row.proposed_pin_type);
  push('Pin type', proposedType, catalogType);

  const proposedFeatures = formatPinFeaturesLabel(row.proposed_pin_features);
  const catalogFeatures = formatPinFeaturesLabel(variant?.pin_features ?? row.proposed_pin_features);
  if (
    proposedFeatures &&
    catalogFeatures &&
    normalizePinFeaturesKey(row.proposed_pin_features) !==
      normalizePinFeaturesKey(variant?.pin_features ?? row.proposed_pin_features)
  ) {
    changes.push({ label: 'Pin features', from: proposedFeatures, to: catalogFeatures });
  }

  return changes;
}

function pickImageUrl(...candidates: (string | null | undefined)[]): string | null {
  for (const c of candidates) {
    const u = pinImageEmailPreviewUrl(c);
    if (u && /^https?:\/\//i.test(u)) return u;
  }
  return null;
}

function specCell(
  label: string,
  value: string,
  widthPct: number,
  t: typeof transactionalEmailTheme,
  opts?: { borderTop?: boolean },
): string {
  const topBorder = opts?.borderTop ? 'border-top:1px solid rgba(201,168,76,0.2);' : '';
  return `
      <td style="width:${widthPct}%;padding:8px 6px;text-align:center;vertical-align:top;${topBorder}">
        <p style="margin:0;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};">${escapeHtml(label)}</p>
        <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${t.foreground};">${escapeHtml(value)}</p>
      </td>`;
}

function emailShareCardPreview(args: {
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
  const specCells = specs.map(s => specCell(s.label, s.value, specWidth, t)).join('');

  const showMechanics = Boolean(args.pinTypeLine || args.pinFeaturesLine);
  const mechanicsCells = showMechanics
    ? `<tr>
              ${specCell('Pin type', args.pinTypeLine ?? '—', 50, t, { borderTop: specs.length > 0 })}
              ${specCell('Pin features', args.pinFeaturesLine ?? '—', 50, t, { borderTop: specs.length > 0 })}
            </tr>`
    : '';

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
        specs.length > 0 || showMechanics
          ? `<tr><td style="padding:4px 12px 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${
              specs.length > 0 ? `<tr>${specCells}</tr>` : ''
            }${mechanicsCells}</table></td></tr>`
          : ''
      }
      <tr>
        <td style="padding:0 12px 10px;text-align:center;">
          <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(45,139,117,0.15);color:${t.secondary};font-size:11px;font-weight:700;letter-spacing:0.04em;">CATALOG ENTRY</span>
        </td>
      </tr>
    </table>`;
}

function emailChangesTable(changes: FieldChange[], reviewerNote?: string | null): string {
  const t = transactionalEmailTheme;
  const note = reviewerNote?.trim() ?? '';
  if (changes.length === 0 && !note) return '';

  const rows = changes
    .map(
      c => `
      <tr>
        <td style="padding:10px 8px;font-size:13px;font-weight:600;color:${t.foreground};border-bottom:1px solid rgba(201,168,76,0.25);vertical-align:top;width:28%;">${escapeHtml(c.label)}</td>
        <td style="padding:10px 8px;font-size:13px;color:${t.foregroundAccent};border-bottom:1px solid rgba(201,168,76,0.25);vertical-align:top;width:36%;">${escapeHtml(c.from)}</td>
        <td style="padding:10px 8px;font-size:13px;font-weight:600;color:${t.secondary};border-bottom:1px solid rgba(201,168,76,0.25);vertical-align:top;">${escapeHtml(c.to)}</td>
      </tr>`,
    )
    .join('');

  const changesTable =
    changes.length > 0
      ? `
      <tr>
        <td style="padding:0 10px ${note ? '8px' : '12px'};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 8px;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:${t.foregroundAccent};">Field</td>
              <td style="padding:6px 8px;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:${t.foregroundAccent};">You submitted</td>
              <td style="padding:6px 8px;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:${t.foregroundAccent};">Catalog listing</td>
            </tr>
            ${rows}
          </table>
        </td>
      </tr>`
      : '';

  const noteBlock = note
    ? `
      <tr>
        <td style="padding:12px 14px 14px;border-top:1px solid rgba(201,168,76,0.35);">
          <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${t.foregroundAccent};">Note from reviewer</p>
          <p style="margin:8px 0 0;font-size:14px;line-height:1.5;color:${t.foreground};">${escapeHtml(note)}</p>
        </td>
      </tr>`
    : '';

  const intro =
    changes.length > 0
      ? 'We normalized a few details for the public catalog listing:'
      : 'A quick note from our review team:';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;border:1px solid rgba(232,115,74,0.35);border-radius:10px;background:rgba(232,115,74,0.08);">
      <tr>
        <td style="padding:12px 14px 8px;">
          <p style="margin:0;font-family:${t.fontDisplay};font-size:15px;font-weight:600;color:${t.foreground};">Reviewer adjustments</p>
          <p style="margin:6px 0 0;font-size:13px;color:${t.foregroundAccent};">${escapeHtml(intro)}</p>
        </td>
      </tr>
      ${changesTable}
      ${noteBlock}
    </table>`;
}

export function submissionApprovedEmailSubject(row: SubmissionEmailRow, variant?: CatalogVariantSnapshot | null): string {
  return `Catalog approved: ${displayDesignName(row, variant)}`;
}

export function submissionApprovedEmailHtml(args: {
  row: SubmissionEmailRow;
  variant?: CatalogVariantSnapshot | null;
  recipientFirstName?: string;
  appUrl?: string;
  assetsBaseUrl?: string;
  wordmarkSrc?: string;
}): string {
  const t = transactionalEmailTheme;
  const { row, variant } = args;
  const designName = displayDesignName(row, variant);
  const artistName = displayArtistName(row, variant);
  const variantLine = row.canonical_variant_name?.trim() || variant?.variant_name?.trim() || row.proposed_variant_name?.trim() || null;
  const editionLine = formatEdition(row);
  const enamelLine = formatEnamelLabel(row.canonical_enamel_type ?? row.proposed_enamel_type);
  const metalLine = row.canonical_metal_finish?.trim() || row.proposed_metal_finish?.trim() || null;
  const pinTypeLine = formatPinTypeLabel(variant?.pin_type ?? row.proposed_pin_type);
  const pinFeaturesLine = formatPinFeaturesLabel(variant?.pin_features ?? row.proposed_pin_features);

  const frontUrl = pickImageUrl(
    variant?.front_image_url,
    row.processed_front_url,
    row.front_image_url,
  );
  const backUrl = pickImageUrl(
    variant?.back_image_url,
    row.processed_back_url,
    row.back_image_url,
  );

  const changes = collectFieldChanges(row, variant);
  const greetingName = (args.recipientFirstName ?? '').trim() || 'there';
  const reviewed = row.reviewed_at
    ? new Date(row.reviewed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-family:${t.fontDisplay};font-size:20px;color:${t.foreground};">Hi ${escapeHtml(greetingName)},</p>
    <p style="margin:0 0 16px;color:${t.foreground};">Great news — <strong>${escapeHtml(designName)}</strong> is now in the Pinporium catalog. Thank you for helping grow the community catalog.</p>
    ${reviewed ? `<p style="margin:0 0 16px;font-size:14px;color:${t.foregroundAccent};">Approved on ${escapeHtml(reviewed)}</p>` : ''}

    ${emailShareCardPreview({
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

    ${emailChangesTable(changes, row.submitter_message)}

    ${emailCalloutBox({
      title: 'What this means for your pin',
      borderColor: t.secondary,
      backgroundColor: 'rgba(45, 139, 117, 0.1)',
      bodyHtml: `
        <p style="margin:0 0 10px;">We created a <strong>catalog entry</strong> from your submission — a shared listing other collectors can discover and link to.</p>
        <p style="margin:0 0 10px;">Your vault pin can stay linked to that listing so details like artist, design, variant, edition, and enamel stay aligned with the community record. <strong>Your vault photos always show your actual pin</strong> — they do not change when the catalog updates.</p>
        <p style="margin:0 0 10px;">The catalog listing may use your submission photos as a reference example for discovery. When you mark a linked pin <strong>for trade</strong>, other collectors see <strong>your real pin images</strong> in trade discovery.</p>
      `,
    })}

    ${emailAppLoginSection()}
  `;

  const footerHtml = `
    <p style="margin:20px 0 0;padding-top:20px;font-size:13px;line-height:1.5;color:${t.foregroundAccent};">
      Pinporium — one vault for your whole pin collection.
    </p>
  `;

  return transactionalEmailLayout({
    previewText: `${designName} was approved for the Pinporium catalog.`,
    title: 'Your catalog submission was approved',
    bodyHtml,
    footerHtml,
    assetsBaseUrl: args.assetsBaseUrl,
    wordmarkSrc: args.wordmarkSrc,
  });
}
