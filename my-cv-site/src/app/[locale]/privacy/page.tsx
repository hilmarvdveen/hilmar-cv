import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalDocument, getLegalDoc } from "@/features/legal";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";

const SLUG = "privacy" as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(SLUG, locale);
  const description = doc.intro ?? doc.title;
  return {
    title: doc.title,
    description,
    alternates: localizedAlternates(SLUG, locale),
    ...localizedOpenGraph(SLUG, locale, doc.title, description),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc(SLUG, locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return <LegalDocument doc={doc} lastUpdatedLabel={t("lastUpdated")} />;
}
