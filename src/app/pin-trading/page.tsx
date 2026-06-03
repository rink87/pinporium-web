import LandingPage from "@/components/marketing/LandingPage";
import { getSeoLanding } from "@/data/seoLandings";
import { buildLandingMetadata } from "@/lib/seo/landingMetadata";

const page = getSeoLanding("pin-trading")!;

export const metadata = buildLandingMetadata(page);

export default function PinTradingPage() {
  return <LandingPage page={page} />;
}
