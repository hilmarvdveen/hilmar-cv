import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument, getLegalDoc } from "@/features/legal";

const SLUG = "disclaimer" as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDoc(SLUG, locale);
  return {
    title: doc.title,
    description: doc.intro,
    alternates: {
      canonical: `/${locale}/${SLUG}`,
      languages: {
        en: `/en/${SLUG}`,
        nl: `/nl/${SLUG}`,
        "x-default": `/en/${SLUG}`,
      },
    },
  };
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc(SLUG, locale);
  const lastUpdatedLabel = locale === "nl" ? "Bijgewerkt op" : "Last updated";
  return <LegalDocument doc={doc} lastUpdatedLabel={lastUpdatedLabel} />;
}
