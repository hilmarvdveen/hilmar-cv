import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalDocument, getLegalDoc } from "@/features/legal";
import { localizedAlternates } from "@/lib/seo";

const SLUG = "disclaimer" as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(SLUG, locale);
  return {
    title: doc.title,
    description: doc.intro,
    alternates: localizedAlternates(SLUG, locale),
  };
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc(SLUG, locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return <LegalDocument doc={doc} lastUpdatedLabel={t("lastUpdated")} />;
}
