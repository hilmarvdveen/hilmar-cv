import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalDocument, getLegalDoc } from "@/features/legal";
import { brandedTitle, clampDescription, localizedAlternates, localizedOpenGraph } from "@/lib/seo";

const SLUG = "terms" as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(SLUG, locale);
  const description = clampDescription(doc.intro ?? doc.title);
  return {
    title: brandedTitle(doc.title),
    description,
    alternates: localizedAlternates(SLUG, locale),
    ...localizedOpenGraph(SLUG, locale, doc.title, description),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc(SLUG, locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return <LegalDocument doc={doc} lastUpdatedLabel={t("lastUpdated")} />;
}
