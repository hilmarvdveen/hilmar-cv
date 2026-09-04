import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export const CallToActionSection = () => {
  const t = useTranslations("home.cta");

  return (
    <Section
      background="light"
      padding="compact"
      className="border-y border-gray-200"
      aria-labelledby="cta-heading"
    >
      <Container className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <h2
            id="cta-heading"
            className="text-2xl font-extrabold text-textMain mb-2"
          >
            {t("title")}
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
        <Button href="/book" variant="primary" size="lg" className="shrink-0">
          <Calendar className="w-5 h-5" />
          <span>{t("button")}</span>
        </Button>
      </Container>
    </Section>
  );
};
