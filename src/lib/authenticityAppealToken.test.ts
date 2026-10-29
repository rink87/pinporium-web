import { describe, expect, it } from "vitest";

import {
  AUTHENTICITY_APPEAL_KIND,
  authenticityAppealPageUrl,
  authenticityAppealPinReferenceId,
  signAuthenticityAppealToken,
  verifyAuthenticityAppealToken,
} from "./authenticityAppealToken";

const secret = "test-submission-email-secret";

const payload = {
  u: "11111111-1111-1111-1111-111111111111",
  s: "22222222-2222-2222-2222-222222222222",
  c: "33333333-3333-3333-3333-333333333333",
  v: "44444444-4444-4444-4444-444444444444",
  o: "55555555-5555-5555-5555-555555555555",
  d: "I Panic at Discos",
  a: "Sugar & Sloth",
};

describe("authenticityAppealToken", () => {
  it("round-trips a signed unofficial-copy email token", () => {
    const token = signAuthenticityAppealToken(payload, secret);
    const verified = verifyAuthenticityAppealToken(token, secret);
    expect(verified).toMatchObject(payload);
    expect(typeof verified?.e).toBe("number");
  });

  it("rejects a tampered payload or wrong secret", () => {
    const token = signAuthenticityAppealToken(payload, secret);
    expect(verifyAuthenticityAppealToken(`${token}x`, secret)).toBeNull();
    expect(verifyAuthenticityAppealToken(token, "other-secret")).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = signAuthenticityAppealToken({ ...payload, e: 1 }, secret);
    expect(verifyAuthenticityAppealToken(token, secret, 2)).toBeNull();
  });

  it("builds the email CTA URL the Edge Function signs", () => {
    expect(authenticityAppealPageUrl({ siteUrl: "https://pinporium.app/", token: "abc.def" })).toBe(
      "https://pinporium.app/authenticity-appeal?t=abc.def",
    );
  });

  it("matches app catalog variant support refs", () => {
    expect(AUTHENTICITY_APPEAL_KIND).toBe("authenticity_rereview");
    expect(authenticityAppealPinReferenceId(payload.v)).toBe("V-44444444");
    expect(authenticityAppealPinReferenceId(null)).toBeNull();
  });
});
