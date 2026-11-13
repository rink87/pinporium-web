import type {
  CatalogVariantSnapshot,
  SubmissionEmailRow,
} from "./submissionApproved";

const reviewedAt = "2026-05-28T18:30:00.000Z";

/**
 * Stable public HTTPS pin-images (not data: URIs). Must exist in storage with
 * matching `-thumb` siblings — `pinImageEmailPreviewUrl` rewrites to thumbs for email.
 * The old `pin-images/sample/preview-*.jpg` paths 404 (empty sample/ prefix).
 */
const sampleImages = {
  front:
    "https://ffcrjkumvydeyqirxgnm.supabase.co/storage/v1/object/public/pin-images/41a7d16c-f636-4f6f-8b63-1478a7b79f06/processed-front-1779209869707.png",
  back: "https://ffcrjkumvydeyqirxgnm.supabase.co/storage/v1/object/public/pin-images/41a7d16c-f636-4f6f-8b63-1478a7b79f06/processed-back-1779209870356.png",
  /** Distinct front for unofficial-copy "Original" comparison cell. */
  originalFront:
    "https://ffcrjkumvydeyqirxgnm.supabase.co/storage/v1/object/public/pin-images/730c36b5-94fa-45d9-be84-fd390f2f86bc/processed-front-1780235488324.png",
};

/** Prefill / "From our team" copy for unofficial-copy decisions (no em dashes). */
export const UNOFFICIAL_COPY_SUBMITTER_MESSAGE =
  "Unofficial copies are common, and they are often sold as originals, so this is not on you. Your pin stays in your vault with your photos and notes. It is linked to the original in the catalog for reference, so collectors can see the linked official pin. You can still trade or sell it. Your vault shows it as an unofficial copy of the linked official pin.";


export const sampleCatalogVariant: CatalogVariantSnapshot = {
  front_image_url: sampleImages.front,
  back_image_url: sampleImages.back,
  variant_name: "Standard",
  design_name: "Lucoa",
  artist_name: "Laserbrain Patch Co",
  pin_type: "standard",
  pin_features: ["glitter", "back_relief"],
};

export const sampleNewPinSubmission: SubmissionEmailRow & {
  submission_type: string;
} = {
  id: "00000000-0000-0000-0000-000000000001",
  submission_type: "new_pin",
  proposed_artist_name: "Laserbrain Patch Co",
  proposed_design_name: "Lucoa",
  proposed_variant_name: "Standard",
  proposed_edition: "LE 200",
  proposed_enamel_type: "hard_enamel",
  proposed_metal_finish: "Gold",
  proposed_pin_type: "standard",
  proposed_pin_features: ["glitter", "back_relief"],
  proposed_series_name: null,
  canonical_artist_name: "Laserbrain Patch Co",
  canonical_design_name: "Lucoa",
  canonical_variant_name: "Standard",
  canonical_enamel_type: "hard_enamel",
  canonical_metal_finish: "Gold",
  canonical_series_name: null,
  canonical_edition_size: 200,
  canonical_edition_type: "limited",
  processed_front_url: sampleImages.front,
  processed_back_url: sampleImages.back,
  front_image_url: null,
  back_image_url: null,
  reviewed_at: reviewedAt,
  submitter_message: null,
};

export const sampleNewPinSubmissionWithAdjustments: SubmissionEmailRow & {
  submission_type: string;
} = {
  ...sampleNewPinSubmission,
  proposed_artist_name: "Laserbrain",
  proposed_design_name: "Lucoa Dragon Maid",
  proposed_edition: "200",
  submitter_message:
    "We shortened the design title to match our catalog naming. Your vault pin is unchanged.",
};

export const sampleLinkVerificationSubmission: SubmissionEmailRow & {
  submission_type: string;
} = {
  id: "00000000-0000-0000-0000-000000000002",
  submission_type: "link_verification",
  proposed_artist_name: "Disney",
  proposed_design_name: "Grogu",
  proposed_variant_name: "Standard",
  proposed_edition: null,
  proposed_enamel_type: "soft_enamel",
  proposed_metal_finish: "Antique gold",
  proposed_pin_type: null,
  proposed_pin_features: null,
  proposed_series_name: null,
  canonical_artist_name: null,
  canonical_design_name: null,
  canonical_variant_name: null,
  canonical_enamel_type: null,
  canonical_metal_finish: null,
  canonical_series_name: null,
  canonical_edition_size: null,
  canonical_edition_type: null,
  processed_front_url: sampleImages.front,
  processed_back_url: sampleImages.back,
  front_image_url: null,
  back_image_url: null,
  reviewed_at: reviewedAt,
  submitter_message: null,
};

export const sampleRejectedSubmission: SubmissionEmailRow & {
  submission_type: string;
} = {
  ...sampleNewPinSubmission,
  submitter_message:
    "Thanks for submitting! The photos are a bit dark and we cannot read the back stamp. Please retake in natural light and submit again when ready.",
};

export const sampleLinkRejectedSubmission: SubmissionEmailRow & {
  submission_type: string;
} = {
  ...sampleLinkVerificationSubmission,
  submitter_message:
    "The pin in your photos does not match the catalog listing you selected. Try linking to a different variant or retake with the pin flat and centered.",
};

/** Original catalog pin used when a submission is classified as an unofficial copy. */
export const sampleUnofficialCopyOriginal: CatalogVariantSnapshot = {
  front_image_url: sampleImages.originalFront,
  back_image_url: sampleImages.back,
  variant_name: "Standard",
  design_name: "I Panic at Discos",
  artist_name: "Sugar & Sloth",
  pin_type: "standard",
  pin_features: null,
};

export const sampleUnofficialCopySubmission: SubmissionEmailRow & {
  submission_type: string;
} = {
  id: "00000000-0000-0000-0000-000000000003",
  submission_type: "new_pin",
  proposed_artist_name: "Sugar & Sloth",
  proposed_design_name: "I Panic at Discos",
  proposed_variant_name: "Standard",
  proposed_edition: null,
  proposed_enamel_type: "soft_enamel",
  proposed_metal_finish: "Gold",
  proposed_pin_type: "standard",
  proposed_pin_features: null,
  proposed_series_name: null,
  canonical_artist_name: "Sugar & Sloth",
  canonical_design_name: "I Panic at Discos",
  canonical_variant_name: "Standard",
  canonical_enamel_type: "soft_enamel",
  canonical_metal_finish: "Gold",
  canonical_series_name: null,
  canonical_edition_size: null,
  canonical_edition_type: null,
  processed_front_url: sampleImages.front,
  processed_back_url: sampleImages.back,
  front_image_url: null,
  back_image_url: null,
  reviewed_at: reviewedAt,
  submitter_message: UNOFFICIAL_COPY_SUBMITTER_MESSAGE,
};
