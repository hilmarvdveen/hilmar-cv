import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

type FlagshipCard = {
  title: string;
  body: string;
};

export const FlagshipSection = () => {
  const t = useTranslations("home.flagship");
  const cards = t.raw("cards") as FlagshipCard[];
  const stack = t.raw("stack") as string[];

  return (
    <Section background="white" padding="default" aria-labelledby="flagship-heading">
      <div data-track-section="flagship">
      <Container>
        <div className="max-w-3xl">
          <p className="text-[13px] font-bold uppercase tracking-widest text-primary mb-3">
            {t("eyebrow")}
          </p>
          <SectionTitle
            id="flagship-heading"
            title={t("title")}
            subtitle={t("intro")}
            size="display"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <Card key={index} variant="tinted">
              <h3 className="text-base font-bold text-brand-navy mb-2">
                {card.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-600">
                {card.body}
              </p>
            </Card>
          ))}
        </div>
        <ul
          aria-label={t("stackLabel")}
          className="mt-6 flex flex-wrap gap-2"
        >
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-brand-navy"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            href="/experience"
            className="text-primary font-semibold underline underline-offset-4"
          >
            {t("linkLabel")}
            <ArrowRight className="w-4 h-4 inline" aria-hidden="true" />
          </Link>
        </div>
      </Container>
      </div>
    </Section>
  );
};
