import LandingPage from "@/components/marketing/LandingPage";
import { getSeoLanding } from "@/data/seoLandings";
import { buildLandingMetadata } from "@/lib/seo/landingMetadata";

const page = getSeoLanding("for-collectors")!;

export const metadata = buildLandingMetadata(page);

export default function ForCollectorsPage() {
  return <LandingPage page={page} />;
}
