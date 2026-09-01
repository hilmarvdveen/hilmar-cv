import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument, getLegalDoc } from "@/features/legal";
import { localizedAlternates } from "@/lib/seo";

const SLUG = "privacy" as const;

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

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc(SLUG, locale);
  const lastUpdatedLabel = locale === "nl" ? "Bijgewerkt op" : "Last updated";
  return <LegalDocument doc={doc} lastUpdatedLabel={lastUpdatedLabel} />;
}
