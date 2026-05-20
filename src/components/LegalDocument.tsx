import Link from "next/link";
import Container from "./Container";

export interface LegalSection {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface LegalDocumentProps {
    title: string;
    effectiveDate: string;
    intro: string;
    sections: LegalSection[];
}

const LegalDocument: React.FC<LegalDocumentProps> = ({
    title,
    effectiveDate,
    intro,
    sections,
}) => {
    return (
        <article className="pt-28 md:pt-32 pb-20 md:pb-24">
            <Container className="max-w-3xl">
                <p className="text-xs uppercase tracking-deco-wide text-foreground-accent font-body mb-3">
                    Legal
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-navy tracking-tight">
                    {title}
                </h1>
                <p className="mt-3 text-sm text-foreground-accent font-body">
                    Effective date: {effectiveDate}
                </p>
                <p className="mt-8 text-foreground-accent font-body leading-relaxed text-lg">
                    {intro}
                </p>

                <div className="mt-12 space-y-10">
                    {sections.map((section) => (
                        <section key={section.id} id={section.id}>
                            <h2 className="font-display text-2xl text-navy mb-4">
                                {section.title}
                            </h2>
                            <div className="legal-prose font-body text-foreground-accent leading-relaxed space-y-4">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>

                <p className="mt-14 pt-8 border-t border-gold-deco/25 text-sm font-body text-foreground-accent">
                    <Link href="/" className="text-primary hover:underline">
                        Back to home
                    </Link>
                    {" · "}
                    <Link href="/privacy" className="hover:text-primary">
                        Privacy Policy
                    </Link>
                    {" · "}
                    <Link href="/terms" className="hover:text-primary">
                        Terms of Service
                    </Link>
                </p>
            </Container>
        </article>
    );
};

export default LegalDocument;
