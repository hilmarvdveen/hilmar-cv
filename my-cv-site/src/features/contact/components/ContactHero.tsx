import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

type ContactFact = {
  label: string;
  value: string;
};

export const ContactHero = () => {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const facts = t.raw("facts.items") as ContactFact[];

  return (
    <PageHero
      width="narrow"
      breadcrumb={<Breadcrumb />}
      badge={t("hero.badge")}
      title={t("hero.title")}
      description={t("hero.description")}
      actions={
        <>
          <Button href="/book" variant="primary" size="lg" data-placement="contact-hero">
            {t("cta.button")}
          </Button>
          <Button
            href={BUSINESS_PROFILE.CONTACT.WHATSAPP}
            variant="outlineOnDark"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            data-placement="contact-whatsapp"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {common("whatsapp")}
          </Button>
        </>
      }
      aside={
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">{t("facts.title")}</h2>
          <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    />
  );
};
