import { useTranslations } from "next-intl";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
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
  const tCommon = useTranslations("common.nav");
  const facts = t.raw("facts.items") as ContactFact[];

  return (
    <PageHero
      breadcrumb={<Breadcrumb />}
      badge={t("hero.badge")}
      title={t("hero.title")}
      description={t("hero.description")}
      actions={
        <>
          <Button href="/book" variant="primary" size="lg">
            {tCommon("book")}
          </Button>
          <Button href="#contact-form" variant="outlineOnDark" size="lg">
            {t("cta.write")}
          </Button>
        </>
      }
      aside={
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">{t("facts.title")}</h2>
          <dl className="space-y-4 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-start justify-between gap-4">
                <dt className="text-slate-400">{fact.label}</dt>
                <dd className="text-right font-medium text-white">{fact.value}</dd>
              </div>
            ))}
            <div className="flex items-start justify-between gap-4">
              <dt className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {t("info.email")}
              </dt>
              <dd className="text-right font-medium text-white">
                <a
                  href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
                  className="hover:text-emerald-300"
                >
                  {BUSINESS_PROFILE.CONTACT.EMAIL}
                </a>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {t("info.phone")}
              </dt>
              <dd className="text-right font-medium text-white">
                <a
                  href={`tel:${BUSINESS_PROFILE.CONTACT.PHONE}`}
                  className="hover:text-emerald-300"
                >
                  {BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="flex items-center gap-2 text-slate-400">
                <MessageSquare
                  className="h-4 w-4 shrink-0 text-emerald-300"
                  aria-hidden="true"
                />
                WhatsApp
              </dt>
              <dd className="text-right font-medium text-white">
                <a
                  href={BUSINESS_PROFILE.CONTACT.WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300"
                >
                  {BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {t("info.location")}
              </dt>
              <dd className="text-right font-medium text-white">{t("info.locationValue")}</dd>
            </div>
          </dl>
        </div>
      }
    />
  );
};
