import type { ReactNode } from "react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import type { LegalDoc } from "../legalContent";

type LegalDocumentProps = {
  doc: LegalDoc;
  lastUpdatedLabel: string;
};

type TextLink = {
  label: string;
  href: string;
  external: boolean;
};

const TEXT_LINK_CLASS_NAME =
  "inline-flex min-h-6 items-center rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

const AUTHORITY_NAME = "Autoriteit Persoonsgegevens";
const AUTHORITY_URL = "https://www.autoriteitpersoonsgegevens.nl/";

const TEXT_LINKS: TextLink[] = [
  { label: BUSINESS_PROFILE.CONTACT.EMAIL, href: `mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`, external: false },
  { label: AUTHORITY_NAME, href: AUTHORITY_URL, external: true },
];

function renderTextWithLinks(text: string, links: TextLink[] = TEXT_LINKS): ReactNode {
  for (const link of links) {
    const linkIndex = text.indexOf(link.label);
    if (linkIndex === -1) continue;
    const before = text.slice(0, linkIndex);
    const after = text.slice(linkIndex + link.label.length);
    return (
      <>
        {before}
        <a
          href={link.href}
          className={TEXT_LINK_CLASS_NAME}
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {link.label}
        </a>
        {renderTextWithLinks(after, links)}
      </>
    );
  }
  return text;
}

export function LegalDocument({ doc, lastUpdatedLabel }: LegalDocumentProps) {
  return (
    <Section background="light" padding="compact">
      <Container width="prose">
        <h1 className="text-display text-textMain mb-2">{doc.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {lastUpdatedLabel}: {doc.lastUpdated}
        </p>

        <Card className="space-y-8">
          {doc.intro && (
            <p className="text-gray-700 leading-relaxed">{renderTextWithLinks(doc.intro)}</p>
          )}

          {doc.sections.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2 className="text-subsection-title text-textMain mb-3">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-gray-700 leading-relaxed mb-3">
                  {renderTextWithLinks(paragraph)}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{renderTextWithLinks(bullet)}</li>
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
