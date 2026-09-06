import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import type { LegalDoc } from "../legalContent";

type LegalDocumentProps = {
  doc: LegalDoc;
  lastUpdatedLabel: string;
};

export function LegalDocument({ doc, lastUpdatedLabel }: LegalDocumentProps) {
  return (
    <Section background="light" padding="compact">
      <Container width="prose">
        <h1 className="text-display text-textMain mb-2">{doc.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {lastUpdatedLabel}: {doc.lastUpdated}
        </p>

        <Card className="space-y-8">
          {doc.intro && <p className="text-gray-700 leading-relaxed">{doc.intro}</p>}

          {doc.sections.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2 className="text-subsection-title text-textMain mb-3">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-gray-700 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </Card>
      </Container>
    </Section>
  );
}
