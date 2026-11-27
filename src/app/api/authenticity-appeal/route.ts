import { NextResponse } from "next/server";

import { siteDetails } from "@/data/siteDetails";
import {
  resolveAuthenticityAppealSecret,
  verifyAuthenticityAppealToken,
} from "@/lib/authenticityAppealToken";
import {
  AUTHENTICITY_APPEAL_MAX_PROOF_BYTES,
  AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES,
  appealProofObjectPath,
  isAllowedProofImageMime,
  normalizeProofImageUrls,
} from "@/lib/authenticityAppealProof";
import { mapAuthenticityRereviewRpcError } from "@/lib/authenticityAppealRpcErrors";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { turnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

const UNAVAILABLE_ERROR = `Form is temporarily unavailable. Email ${siteDetails.supportEmail} instead.`;
const MAX_MESSAGE_LENGTH = 4000;
const PIN_IMAGES_BUCKET = "pin-images";

type ParsedAppealBody = {
  token: string;
  message: string;
  turnstileToken: string;
  proofFiles: File[];
};

async function parseAppealBody(request: Request): Promise<ParsedAppealBody | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const token = typeof form.get("token") === "string" ? String(form.get("token")).trim() : "";
    const rawMessage =
      typeof form.get("message") === "string" ? String(form.get("message")).trim() : "";
    const turnstileToken =
      typeof form.get("turnstileToken") === "string"
        ? String(form.get("turnstileToken")).trim()
        : "";
    const proofFiles = form
      .getAll("proofImages")
      .filter((entry): entry is File => typeof File !== "undefined" && entry instanceof File)
      .slice(0, AUTHENTICITY_APPEAL_MAX_PROOF_IMAGES);
    return {
      token,
      message: rawMessage.slice(0, MAX_MESSAGE_LENGTH),
      turnstileToken,
      proofFiles,
    };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return null;
  }
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const token = typeof record.token === "string" ? record.token.trim() : "";
  const rawMessage = typeof record.message === "string" ? record.message.trim() : "";
  const turnstileToken =
    typeof record.turnstileToken === "string" ? record.turnstileToken.trim() : "";
  return {
    token,
    message: rawMessage.slice(0, MAX_MESSAGE_LENGTH),
    turnstileToken,
    proofFiles: [],
  };
}

export async function POST(request: Request) {
  const secret = resolveAuthenticityAppealSecret();
  if (!secret) {
    return NextResponse.json({ error: UNAVAILABLE_ERROR }, { status: 503 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: UNAVAILABLE_ERROR }, { status: 503 });
  }

  const parsed = await parseAppealBody(request);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token, message, turnstileToken, proofFiles } = parsed;

  if (!token) {
    return NextResponse.json({ error: "Missing appeal link. Open the link from your email." }, { status: 400 });
  }
  if (message.length < 3) {
    return NextResponse.json(
      { error: "Add a few words about the backstamp, packaging, or where you bought it." },
      { status: 400 },
    );
  }

  if (turnstileRequired()) {
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Please complete the security check and try again." },
        { status: 400 },
      );
    }
    const valid = await verifyTurnstileToken(turnstileToken);
    if (!valid) {
      return NextResponse.json(
        { error: "Security check failed. Please try again." },
        { status: 400 },
      );
    }
  }

  const payload = verifyAuthenticityAppealToken(token, secret);
  if (!payload) {
    return NextResponse.json(
      {
        error:
          "This link is invalid or has expired. Use I think mine is authentic in the app instead.",
      },
      { status: 400 },
    );
  }

  if (!payload.c) {
    return NextResponse.json(
      {
        error:
          "This link is missing vault pin details. Use I think mine is authentic in the app instead.",
      },
      { status: 400 },
    );
  }

  for (const file of proofFiles) {
    const mime = (file.type || "application/octet-stream").toLowerCase();
    if (!isAllowedProofImageMime(mime)) {
      return NextResponse.json(
        { error: "Photos must be JPEG, PNG, WebP, or HEIC." },
        { status: 400 },
      );
    }
    if (file.size <= 0 || file.size > AUTHENTICITY_APPEAL_MAX_PROOF_BYTES) {
      return NextResponse.json(
        { error: "Each photo must be under 8 MB." },
        { status: 400 },
      );
    }
  }

  const uploadedUrls: string[] = [];
  for (let i = 0; i < proofFiles.length; i++) {
    const file = proofFiles[i];
    const mime = (file.type || "image/jpeg").toLowerCase();
    const objectPath = appealProofObjectPath(payload.u, i, mime);
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage.from(PIN_IMAGES_BUCKET).upload(objectPath, bytes, {
      contentType: mime === "image/jpg" ? "image/jpeg" : mime,
      upsert: false,
    });
    if (uploadError) {
      console.error("authenticity-appeal proof upload failed", uploadError.message);
      return NextResponse.json(
        {
          error: `Could not upload your photos. Please try again or email ${siteDetails.supportEmail}.`,
        },
        { status: 502 },
      );
    }
    const { data: urlData } = admin.storage.from(PIN_IMAGES_BUCKET).getPublicUrl(objectPath);
    if (urlData?.publicUrl) uploadedUrls.push(urlData.publicUrl);
  }
  const proofImageUrls = normalizeProofImageUrls(uploadedUrls);

  // Creates a catalog_submissions link_verification row (authenticity_rereview).
  // Legacy app binaries still write app_feedback; this web path goes direct via RPC.
  const { data: submissionId, error } = await admin.rpc("create_authenticity_rereview_submission", {
    p_user_id: payload.u,
    p_collection_item_id: payload.c,
    p_note: message,
    p_proof_urls: proofImageUrls,
  });

  if (error) {
    console.error("authenticity-appeal rpc failed", error.message);
    const mapped = mapAuthenticityRereviewRpcError(
      error.message ?? "",
      siteDetails.supportEmail,
    );
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }

  if (typeof submissionId !== "string" || !submissionId) {
    console.error("authenticity-appeal rpc returned no submission id", submissionId);
    return NextResponse.json(
      {
        error: `Could not submit your request. Please try again or email ${siteDetails.supportEmail}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, submissionId });
}
