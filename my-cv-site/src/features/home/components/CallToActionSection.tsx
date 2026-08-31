import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Mid-page call-to-action band. The closing ask lives in CloseSection, so
 * this band appears once, with its own copy, instead of the former three
 * identical mounts.
 */
export const CallToActionSection = () => {
  const t = useTranslations("home.cta");

  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-emerald-50 border-y border-emerald-100 py-14"
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
    </section>
  );
};
