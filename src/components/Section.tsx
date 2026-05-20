import SectionTitle from "./SectionTitle";

interface Props {
  id: string;
  title: string;
  description: string;
}

const Section: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  title,
  description,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <section id={id} className="py-10 lg:py-20 scroll-mt-24">
      <div className="flex justify-center mb-3">
        <span
          className="h-px w-16 bg-gradient-to-r from-transparent via-gold-deco to-transparent"
          aria-hidden
        />
      </div>
      <SectionTitle>
        <h2 className="text-center mb-4">{title}</h2>
      </SectionTitle>
      <p className="mb-12 text-center text-foreground-accent max-w-2xl mx-auto font-body leading-relaxed">
        {description}
      </p>
      {children}
    </section>
  );
};

export default Section;
