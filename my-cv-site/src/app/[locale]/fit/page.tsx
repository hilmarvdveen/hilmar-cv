import { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { ChevronDown, Sparkles } from "lucide-react";
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
import {
  TURNSTILE_SCRIPT_URL,
  getTurnstileConfiguration,
  getTurnstileSiteKey,
} from "@/lib/fit/turnstile";
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
  const isReopened = reopenState === "valid";
  const resultKey = typeof key === "string" ? key : "";
  const turnstileSiteKey = getTurnstileConfiguration() ? getTurnstileSiteKey() : null;
  const nonce = turnstileSiteKey ? ((await headers()).get("x-nonce") ?? undefined) : undefined;

  const structuredData = fitPageSchema({
    locale: locale === "en" ? "en" : "nl",
    title: t("meta.title"),
    description: t("meta.description"),
    homeLabel: breadcrumbLabels("home"),
    pageLabel: breadcrumbLabels("fit"),
  });

  const checkIsland = (
    <FitCheck
      heading={t("section.title")}
      intro={t("section.intro")}
      disclosure={<FitDisclosure />}
      turnstileSiteKey={turnstileSiteKey ?? undefined}
    />
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      {turnstileSiteKey && (
        <script src={TURNSTILE_SCRIPT_URL} async defer nonce={nonce} />
      )}
      <PageHero
        width="narrow"
        padding="compact"
        badge={isReopened ? undefined : t("hero.badge")}
        badgeIcon={Sparkles}
        title={isReopened ? t("result.title") : t("hero.title")}
        description={isReopened ? t("result.intro") : t("hero.description")}
        descriptionHiddenOnPhones={!isReopened}
        breadcrumb={<Breadcrumb />}
      />

      {isReopened && (
        <Section padding="compact" background="light">
          <Container width="narrow">
            <FitReopenedResult
              sessionId={sanitizeSessionId(result)}
              resultKey={resultKey}
              turnstileSiteKey={turnstileSiteKey ?? undefined}
              labels={{
                loading: t("result.loading"),
                ready: t("result.ready"),
                failed: t("result.failed"),
                rateLimited: t("result.rateLimited"),
                checkedOn: t("result.checkedOn"),
                untitled: t("result.untitled"),
                download: t("result.download"),
                downloading: t("result.downloading"),
                downloadNote: t("result.downloadNote"),
                downloaded: t("result.downloaded"),
                downloadFailed: t("result.downloadFailed"),
                downloadTimedOut: t("result.downloadTimedOut"),
                downloadRateLimited: t("result.downloadRateLimited"),
                nextSteps: t("result.nextSteps"),
                nextStepsLink: t("result.nextStepsLink"),
                mailAction: t("result.mailAction"),
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
          {isReopened ? (
            <details className="group">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-sm py-1 text-base font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
                {t("result.newCheck")}
                <ChevronDown
                  className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-6">{checkIsland}</div>
            </details>
          ) : (
            checkIsland
          )}
        </Container>
      </Section>
    </>
  );
}
