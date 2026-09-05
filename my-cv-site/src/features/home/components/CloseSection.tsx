import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Link } from "@/i18n/navigation";
import { Calendar, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

export const CloseSection = () => {
  const t = useTranslations("home.close");
  const common = useTranslations("common");

  return (
    <Section
      background="navy"
      padding="spacious"
      aria-labelledby="close-heading"
      className="border-b border-white/10 bg-brand-navy-deep"
    >
      <Container width="narrow" className="text-center">
        <div data-track-section="close">
          <h2
            id="close-heading"
            className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 text-balance"
          >
            {t("title")}
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            {t("body")}
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button href="/book" variant="white" size="lg" data-placement="close">
              <Calendar className="w-5 h-5" />
              <span>{t("button")}</span>
            </Button>
            <Link
              href="/contact"
              className="text-sm text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              {t("alternative")}
            </Link>
            <a
              href={BUSINESS_PROFILE.CONTACT.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="close-whatsapp"
              className="inline-flex items-center gap-2 rounded-md text-sm text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {common("whatsapp")}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
};
