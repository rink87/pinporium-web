import { describe, expect, it } from "vitest";

import { mapAuthenticityRereviewRpcError } from "./authenticityAppealRpcErrors";

describe("mapAuthenticityRereviewRpcError", () => {
  it("maps already-under-review style messages", () => {
    const mapped = mapAuthenticityRereviewRpcError(
      "open authenticity re-review already under review for this item",
    );
    expect(mapped.status).toBe(409);
    expect(mapped.error).toMatch(/already under review/i);
    expect(mapped.error).not.toMatch(/—/);
  });

  it("maps not-unofficial style messages", () => {
    const mapped = mapAuthenticityRereviewRpcError(
      "collection item is not an unofficial copy link",
    );
    expect(mapped.status).toBe(400);
    expect(mapped.error).toMatch(/Unofficial copy/);
    expect(mapped.error).not.toMatch(/—/);
  });

  it("maps not-found style messages", () => {
    const mapped = mapAuthenticityRereviewRpcError("collection item not found");
    expect(mapped.status).toBe(400);
    expect(mapped.error).toMatch(/could not find/i);
    expect(mapped.error).not.toMatch(/—/);
  });

  it("falls back for unknown errors", () => {
    const mapped = mapAuthenticityRereviewRpcError("something unexpected");
    expect(mapped.status).toBe(502);
    expect(mapped.error).toMatch(/Could not submit/);
  });
});
