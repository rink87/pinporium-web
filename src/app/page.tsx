import BeliefsStrip from "@/components/BeliefsStrip";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import ProductIntro from "@/components/ProductIntro";
import Pricing from "@/components/Pricing/Pricing";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import { faqs } from "@/data/faq";
import {
  faqPageJsonLd,
  mobileApplicationJsonLd,
} from "@/lib/seo/jsonLd";
// import Testimonials from "@/components/Testimonials"; // TODO: replace with real collector/shop testimonials

const HomePage: React.FC = () => {
  return (
    <>
      <JsonLd
        data={[
          mobileApplicationJsonLd(),
          faqPageJsonLd(
            faqs.map(({ question, answer }) => ({ question, answer })),
          ),
        ]}
      />
      <Hero />
      <ProductIntro />
      <BeliefsStrip />
      <Container>
        <Benefits />

        <Section
          id="roadmap"
          title="Where we’re headed"
          description="Vault, catalog, The Hunt, trades, and achievements are in the beta today. Drop alerts, sharing, and marketplace features are what we’re building toward next."
        >
          <Pricing />
        </Section>

        {/* TODO: add real testimonials from collectors and shops once we have quotes */}
        {/* <Section
          id="testimonials"
          title="From the community"
          description="Early voices — swap in real quotes from collectors and shops as the beta grows."
        >
          <Testimonials />
        </Section> */}

        <FAQ />

        <Stats />

        <CTA />
      </Container>
    </>
  );
};

export default HomePage;
