/**
 * Send beta check-in email via Resend.
 * Usage (with npx tsx and --env-file=.env.local):
 *   npx tsx --env-file=.env.local scripts/send-check-in-test.ts [email] [name] [ios|android] [not_started|active_no_pins|active]
 */
import {
  sendBetaActiveNoPinsCheckInEmail,
  sendBetaActiveUserCheckInEmail,
  sendBetaNotYetStartedEmail,
} from "../src/lib/email/sendBetaEmails";

async function main() {
  const to = process.argv[2] ?? "rink87@gmail.com";
  const name = process.argv[3] ?? "Chris";
  const platform = (process.argv[4] === "android" ? "android" : "ios") as
    | "ios"
    | "android";
  const audienceArg = process.argv[5] ?? "not_started";
  const audience =
    audienceArg === "active"
      ? "active"
      : audienceArg === "active_no_pins"
        ? "active_no_pins"
        : "not_started";

  const result =
    audience === "active"
      ? await sendBetaActiveUserCheckInEmail({ name, email: to, platform })
      : audience === "active_no_pins"
        ? await sendBetaActiveNoPinsCheckInEmail({ name, email: to, platform })
        : await sendBetaNotYetStartedEmail({ name, email: to, platform });

  console.log(JSON.stringify({ to, name, platform, audience, ...result }, null, 2));
  process.exit(result.sent ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
