import { NextResponse } from "next/server";

import { syncBetaApplicationEmailHistory } from "@/lib/betaEmailHistorySync";

function adminSecret(): string | undefined {
  return process.env.ADMIN_BETA_EMAIL_SECRET?.trim();
}

/** Server-to-server: pinporium-admin backfills beta email sent timestamps. */
export async function POST(request: Request) {
  const secret = adminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_BETA_EMAIL_SECRET is not configured on pinporium-web." },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-pinporium-admin-secret")?.trim();
  if (!provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncBetaApplicationEmailHistory();
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 502 });
  }

  return NextResponse.json(result);
}
