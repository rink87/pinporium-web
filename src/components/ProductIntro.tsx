import Container from "./Container";
import { productIntro } from "@/data/productIntro";

const ProductIntro: React.FC = () => {
  return (
    <section
      aria-label="About Pinporium"
      className="border-y border-gold-deco/15 bg-cream-warm/40 py-8 md:py-10"
    >
      <Container className="max-w-2xl">
        <p className="text-center text-foreground-accent font-body leading-relaxed text-base md:text-lg text-balance">
          {productIntro.text}
        </p>
      </Container>
    </section>
  );
};

export default ProductIntro;
