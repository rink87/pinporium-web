import fs from "fs";
import path from "path";

let cached: string | null = null;

/** Inline wordmark for local email preview (email clients need hosted HTTPS URLs). */
export function getWordmarkDataUri(): string {
  if (cached) {
    return cached;
  }
  const filePath = path.join(
    process.cwd(),
    "public",
    "images",
    "logo-wordmark.png",
  );
  const base64 = fs.readFileSync(filePath).toString("base64");
  cached = `data:image/png;base64,${base64}`;
  return cached;
}
