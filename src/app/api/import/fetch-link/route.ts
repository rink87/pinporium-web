import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { fetchImportFromLink, normalizeImportLinkInput } from "@/lib/vaultImport/linkSources";

function getSupabaseForRequest(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!accessToken) {
    return NextResponse.json({ error: "Sign in to import from a link." }, { status: 401 });
  }

  const supabase = getSupabaseForRequest(accessToken);
  if (!supabase) {
    return NextResponse.json({ error: "Import is not configured on this site." }, { status: 503 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return NextResponse.json({ error: "Sign in to import from a link." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawUrl =
    body && typeof body === "object" && typeof (body as Record<string, unknown>).url === "string"
      ? (body as Record<string, string>).url
      : "";

  const url = normalizeImportLinkInput(rawUrl);
  if (!url) {
    return NextResponse.json(
      { error: "Paste a published Google Sheets link or a public Baserow grid link." },
      { status: 400 },
    );
  }

  const result = await fetchImportFromLink(url);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({
    headers: result.data.headers,
    rows: result.data.rows,
    source: result.data.source,
    label: result.data.label,
  });
}
