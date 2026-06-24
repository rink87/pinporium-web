import { NextResponse } from "next/server";

import { isAllowedImportImagePreviewUrl } from "@/lib/vaultImport/importImagePreview";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim() ?? "";

  if (!rawUrl || !isAllowedImportImagePreviewUrl(rawUrl)) {
    return NextResponse.json({ error: "Invalid image URL." }, { status: 400 });
  }

  try {
    const upstream = await fetch(rawUrl, {
      headers: {
        "User-Agent": "PinporiumImport/1.0 (+https://pinporium.app/import)",
        Accept: "image/*",
      },
      redirect: "follow",
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Image not found." }, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Not an image." }, { status: 400 });
    }

    const bytes = await upstream.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > 15_000_000) {
      return NextResponse.json({ error: "Image too large." }, { status: 400 });
    }

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not load image." }, { status: 502 });
  }
}
