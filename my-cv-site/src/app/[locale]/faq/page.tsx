import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Shield, Globe, HelpCircle } from "lucide-react";
import { SEOFactory } from "@/lib/seo";
import type { Locale, FAQItem } from "@/lib/seo";
import { FAQClientContent, FAQ_CATEGORY_IDS } from "@/features/faq";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";

type Props = {
  params: Promise<{ locale: string }>;
};

async function loadFaqItems(locale: string): Promise<FAQItem[]> {
  const t = await getTranslations({ locale, namespace: "faq" });
  return FAQ_CATEGORY_IDS.flatMap(
    (id) => t.raw(`categories.${id}.questions`) as FAQItem[]
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const faqItems = await loadFaqItems(locale);
  const seoData = SEOFactory.faq(locale as Locale, faqItems);
  return seoData.metadata;
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });
  const faqItems = await loadFaqItems(locale);
  const seoData = SEOFactory.faq(locale as Locale, faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoData.structuredData }}
      />
      <PageHero
        width="narrow"
        badge={t("badge")}
        badgeIcon={HelpCircle}
        title={t("hero.title")}
        titleAccent={t("hero.subtitle")}
        description={t("hero.description")}
        breadcrumb={<Breadcrumb />}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <p className="flex items-center gap-3 text-slate-200">
            <Clock className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            {t("hero.features.quick")}
          </p>
          <p className="flex items-center gap-3 text-slate-200">
            <Shield className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            {t("hero.features.expert")}
          </p>
          <p className="flex items-center gap-3 text-slate-200">
            <Globe className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            {t("hero.features.remote")}
          </p>
        </div>
      </PageHero>
      <FAQClientContent />
    </>
  );
}
