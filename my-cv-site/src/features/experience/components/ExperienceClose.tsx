import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

const HEADING_ID = "experience-close-heading";

export const ExperienceClose = () => {
  const t = useTranslations("experiencePage");

  return (
    <Section background="navy" padding="spacious" aria-labelledby={HEADING_ID}>
      <Container width="narrow" className="text-center">
        <h2
          id={HEADING_ID}
          className="mb-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-4xl"
        >
          {t("close.title")}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
          {t("close.description")}
        </p>
        <Button href="/book" variant="white" size="lg">
          {t("close.button")}
        </Button>
      </Container>
    </Section>
  );
};
