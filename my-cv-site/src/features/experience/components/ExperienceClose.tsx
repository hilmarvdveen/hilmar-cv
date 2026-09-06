import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

const HEADING_ID = "experience-close-heading";

export const ExperienceClose = () => {
  const t = useTranslations("experiencePage");
  const common = useTranslations("common");

  return (
    <Section background="navy" padding="spacious" aria-labelledby={HEADING_ID}>
      <Container width="narrow" className="text-center">
        <h2
          id={HEADING_ID}
          className="mb-4 text-section-title text-balance text-white"
        >
          {t("close.title")}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
          {t("close.description")}
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button href="/book" variant="white" size="lg" data-placement="experience-close">
            {t("close.button")}
          </Button>
          <a
            href={BUSINESS_PROFILE.CONTACT.WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="experience-close-whatsapp"
            className="inline-flex min-h-6 items-center gap-2 rounded-md text-sm text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {common("whatsapp")}
          </a>
        </div>
      </Container>
    </Section>
  );
};
