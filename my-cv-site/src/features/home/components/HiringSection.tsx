import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";

type HiringFact = {
  label: string;
  value: string;
  detail: string;
  highlight: boolean;
};

type HiringFaqItem = {
  question: string;
  answer: string;
};

type HiringFaq = {
  title: string;
  items: HiringFaqItem[];
  linkLabel: string;
};

export const HiringSection = () => {
  const t = useTranslations("home.hiring");
  const facts = t.raw("facts") as HiringFact[];
  const faq = t.raw("faq") as HiringFaq;

  return (
    <Section background="light" padding="default" aria-labelledby="hiring-heading">
      <Container>
        <SectionTitle title={t("title")} id="hiring-heading" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    {fact.label}
                  </p>
                  <p className="text-base font-bold text-textMain">
                    {fact.highlight && (
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2"
                        aria-hidden="true"
                      />
                    )}
                    {fact.value}
                  </p>
                  {fact.detail && (
                    <p className="text-[13.5px] text-gray-600 mt-0.5">
                      {fact.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
          <div>
            <h3 className="text-lg font-bold text-textMain mb-4">
              {faq.title}
            </h3>
            {faq.items.map((item) => (
              <Card key={item.question} className="p-5 mb-3">
                <p className="text-[14.5px] font-bold text-textMain mb-1">
                  {item.question}
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.answer}
                </p>
              </Card>
            ))}
            <Link
              href="/faq"
              className="text-primary font-semibold underline underline-offset-4 text-sm"
            >
              {faq.linkLabel}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
};
