"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  HelpCircle,
  Clock,
  Euro,
  Code,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import { FAQ_CATEGORY_IDS, type FaqCategoryId } from "../categories";

type FaqQuestion = {
  question: string;
  answer: string;
};

const CATEGORY_ICONS: Record<FaqCategoryId, typeof HelpCircle> = {
  general: HelpCircle,
  services: Code,
  pricing: Euro,
  process: Clock,
  collaboration: Users,
};

const INITIAL_OPEN_ITEMS = FAQ_CATEGORY_IDS.map(
  (_, categoryIndex) => categoryIndex * 100
);

export function FAQClientContent() {
  const t = useTranslations("faq");
  const [openItems, setOpenItems] = useState<number[]>(INITIAL_OPEN_ITEMS);

  const toggleItem = (index: number) => {
    setOpenItems((previous) =>
      previous.includes(index)
        ? previous.filter((openIndex) => openIndex !== index)
        : [...previous, index]
    );
  };

  const faqCategories = FAQ_CATEGORY_IDS.map((id) => ({
    id,
    title: t(`categories.${id}.title`),
    icon: CATEGORY_ICONS[id],
    questions: t.raw(`categories.${id}.questions`) as FaqQuestion[],
  }));

  return (
    <>
      <Section
        background="light"
        padding="spacious"
        aria-labelledby="faq-categories-heading"
      >
        <Container width="narrow">
          <SectionTitle
            id="faq-categories-heading"
            title={t("quickNav.title")}
            align="center"
          />

          <div className="mb-16 grid gap-4 md:grid-cols-5">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:border-emerald-300 hover:shadow-md"
                >
                  <Icon
                    className="mb-3 h-8 w-8 text-emerald-700 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-emerald-700">
                    {category.title}
                  </span>
                </a>
              );
            })}
          </div>

          {faqCategories.map((category, categoryIndex) => (
            <div key={category.id} id={category.id} className="mb-16">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy">
                  <category.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-textMain">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <Card key={faq.question} className="overflow-hidden p-0">
                      <button
                        type="button"
                        onClick={() => toggleItem(globalIndex)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-bgLight"
                      >
                        <span className="pr-4 text-lg font-medium text-textMain">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp
                            className="h-5 w-5 flex-shrink-0 text-emerald-700"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5">
                          <p className="whitespace-pre-line leading-relaxed text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <Section
        background="navy"
        padding="default"
        aria-labelledby="faq-cta-heading"
      >
        <Container width="narrow" className="text-center">
          <div data-track-section="faq-close">
            <SectionTitle
              id="faq-cta-heading"
              title={t("cta.title")}
              subtitle={t("cta.description")}
              align="center"
              onDark
            />
            <div className="flex flex-col items-center gap-4">
              <Button href="/book" variant="white" size="lg" data-placement="faq-close">
                {t("cta.book")}
              </Button>
              <Link
                href="/contact"
                className="text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                {t("cta.contact")}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
