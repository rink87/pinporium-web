import LandingPage from "@/components/marketing/LandingPage";
import { getSeoLanding } from "@/data/seoLandings";
import { buildLandingMetadata } from "@/lib/seo/landingMetadata";

const page = getSeoLanding("enamel-pin-collection")!;

export const metadata = buildLandingMetadata(page);

export default function EnamelPinCollectionPage() {
  return <LandingPage page={page} />;
}
