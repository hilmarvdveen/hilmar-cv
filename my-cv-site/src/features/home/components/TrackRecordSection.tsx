import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";

type TrackRecordCard = {
  meta: string;
  headline: string;
  body: string;
  tags: string[];
};

export const TrackRecordSection = () => {
  const t = useTranslations("home.trackRecord");
  const cards = t.raw("cards") as TrackRecordCard[];

  return (
    <Section
      background="light"
      padding="default"
      aria-labelledby="track-record-heading"
    >
      <Container>
        <SectionTitle
          id="track-record-heading"
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.headline}>
              <p className="text-[13px] font-semibold text-gray-500 mb-2">
                {card.meta}
              </p>
              <h3 className="text-xl font-extrabold text-brand-navy leading-snug mb-3">
                {card.headline}
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-600 mb-4">
                {card.body}
              </p>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-md px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
