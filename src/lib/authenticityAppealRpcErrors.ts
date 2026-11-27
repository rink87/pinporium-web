/** Map Postgres RPC raise messages to collector-facing copy (no em dashes). */
export function mapAuthenticityRereviewRpcError(
  message: string,
  supportEmail = "help@pinporium.app",
): {
  status: number;
  error: string;
} {
  const lower = message.toLowerCase();
  if (
    lower.includes("already under review") ||
    lower.includes("already pending") ||
    lower.includes("open authenticity") ||
    (lower.includes("already") && lower.includes("review"))
  ) {
    return {
      status: 409,
      error: "This pin is already under review. We will notify you in the app when it is done.",
    };
  }
  if (
    lower.includes("not unofficial") ||
    lower.includes("not an unofficial") ||
    lower.includes("unauthorized_copy") ||
    (lower.includes("unofficial") && (lower.includes("required") || lower.includes("must")))
  ) {
    return {
      status: 400,
      error:
        "This re-review is only for vault pins marked Unofficial copy. Open the pin in the app if you need something else.",
    };
  }
  if (
    lower.includes("not found") ||
    lower.includes("does not exist") ||
    lower.includes("not owned") ||
    lower.includes("ownership")
  ) {
    return {
      status: 400,
      error:
        "We could not find that vault pin for this link. Use I think mine is authentic in the app instead.",
    };
  }
  return {
    status: 502,
    error: `Could not submit your request. Please try again or email ${supportEmail}.`,
  };
}
