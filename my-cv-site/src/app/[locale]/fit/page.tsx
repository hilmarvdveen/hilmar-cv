import { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import {
  FitCheck,
  FitDisclosure,
  FitReopenedResult,
  FIT_CHECK_HEADING_ID,
} from "@/features/fit";
import { sanitizeSessionId } from "@/lib/fit";
import { fitReopenState, getFitLinkSecret } from "@/lib/fit/resultLink";
import { TURNSTILE_SCRIPT_URL, getTurnstileSiteKey } from "@/lib/fit/turnstile";
import { brandedTitle, localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { fitPageSchema } from "@/lib/seo/fitSchema";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ result?: string; key?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fit" });
  const title = t("meta.title");
  const description = t("meta.description");

  return {
    title: brandedTitle(title),
    description,
    alternates: localizedAlternates("fit", locale),
    ...localizedOpenGraph("fit", locale, title, description),
  };
}

export default async function FitPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { result, key } = await searchParams;
  const t = await getTranslations({ locale, namespace: "fit" });
  const breadcrumbLabels = await getTranslations({ locale, namespace: "breadcrumb" });

  const reopenState = fitReopenState(result, key, getFitLinkSecret());
  const turnstileSiteKey = getTurnstileSiteKey();
  const nonce = turnstileSiteKey ? ((await headers()).get("x-nonce") ?? undefined) : undefined;

  const structuredData = fitPageSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t("meta.title"),
    description: t("meta.description"),
    homeLabel: breadcrumbLabels("home"),
    pageLabel: breadcrumbLabels("fit"),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      {turnstileSiteKey && (
        <script src={TURNSTILE_SCRIPT_URL} async defer nonce={nonce} />
      )}
      <PageHero
        width="narrow"
        padding="compact"
        badge={t("hero.badge")}
        badgeIcon={Sparkles}
        title={t("hero.title")}
        description={t("hero.description")}
        breadcrumb={<Breadcrumb />}
      />

      {reopenState === "valid" && (
        <Section padding="compact" background="light">
          <Container width="narrow">
            <FitReopenedResult
              sessionId={sanitizeSessionId(result)}
              resultKey={key as string}
              labels={{
                title: t("result.title"),
                intro: t("result.intro"),
                loading: t("result.loading"),
                failed: t("result.failed"),
                download: t("result.download"),
                downloading: t("result.downloading"),
                downloadNote: t("result.downloadNote"),
              }}
            />
          </Container>
        </Section>
      )}

      <Section padding="compact" aria-labelledby={FIT_CHECK_HEADING_ID}>
        <Container width="narrow">
          {reopenState === "invalid" && (
            <Card variant="tinted" className="mb-8">
              <p className="text-base leading-relaxed text-gray-700">{t("result.invalid")}</p>
            </Card>
          )}
          <FitCheck
            heading={t("section.title")}
            intro={t("section.intro")}
            disclosure={<FitDisclosure />}
            turnstileSiteKey={turnstileSiteKey ?? undefined}
          />
        </Container>
      </Section>
    </>
  );
}
