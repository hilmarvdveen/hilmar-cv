import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Accessibility, ArrowDown, ArrowRight, ExternalLink, Lock, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { CvDownloadTrigger } from "@/features/home";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import {
  highlightedRegionCount,
  workCityCount,
  workCompanyCount,
} from "../netherlandsMapData";
import { AboutValueList } from "./AboutValueList";
import { AboutHiringFacts } from "./AboutHiringFacts";
import { NetherlandsMap } from "./NetherlandsMap";

type StandardsCard = {
  title: string;
  body: string;
};

const standardsCardIcons = [Shield, Accessibility, Lock];

const TEXT_LINK_CLASS =
  "inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

const ON_NAVY_LINK_CLASS =
  "inline-flex min-h-6 items-center text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy";

export function AboutPageContent() {
  const t = useTranslations("about");
  const locale = useLocale();
  const standardsCards = t.raw("standards.cards") as StandardsCard[];

  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb />}
        badge={t("hero.badge")}
        title={t("hero.title")}
        description={t("hero.lead")}
        asideWidth="rail"
        asideLeadsOnMobile
        aside={
          <div className="flex items-center gap-3 md:flex-col md:gap-4 md:text-center">
            <Image
              src="/images/profile.jpg"
              alt=""
              width={200}
              height={200}
              priority
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white/15 md:h-50 md:w-50 md:ring-4"
            />
            <div>
              <p className="text-lg font-bold text-white">{BUSINESS_PROFILE.NAME}</p>
              <p className="text-sm text-slate-300">{t("hero.role")}</p>
            </div>
          </div>
        }
        actions={
          <>
            <Button href="/book" variant="primary" data-placement="about-hero">
              {t("cta.button")}
            </Button>
            <CvDownloadTrigger label={t("hero.cv")} locale={locale} />
            <a
              href="#about-hiring"
              data-placement="about-hero-facts"
              className="inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-emerald-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            >
              {t("hero.factsLink")}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        }
      />

      <Section background="light" aria-labelledby="about-value-heading">
        <Container width="narrow">
          <SectionTitle
            id="about-value-heading"
            eyebrow={t("value.eyebrow")}
            title={t("value.title")}
            subtitle={t("value.subtitle")}
          />
          <AboutValueList />
          <Link
            href={t("value.link.href")}
            data-placement="about-experience"
            className={`mt-10 ${TEXT_LINK_CLASS}`}
          >
            {t("value.link.label")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>
      </Section>

      <Section background="white" aria-labelledby="about-standards-heading">
        <Container>
          <SectionTitle
            id="about-standards-heading"
            eyebrow={t("standards.eyebrow")}
            title={t("standards.title")}
            subtitle={t("standards.subtitle")}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {standardsCards.map((card, index) => {
              const CardIcon = standardsCardIcons[index];
              return (
                <Card key={card.title} variant="tinted">
                  <CardIcon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-bold text-textMain">{card.title}</h3>
                  <p className="text-base leading-relaxed text-gray-600">{card.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="light" aria-labelledby="about-map-heading">
        <Container width="narrow">
          <SectionTitle
            id="about-map-heading"
            eyebrow={t("map.eyebrow")}
            title={t("map.title")}
            subtitle={t("map.subtitle", {
              companies: workCompanyCount,
              cities: workCityCount,
              provinces: highlightedRegionCount,
            })}
          />
          <NetherlandsMap />
        </Container>
      </Section>

      <Section background="white" id="about-hiring" aria-labelledby="about-hiring-heading">
        <Container width="narrow">
          <SectionTitle
            id="about-hiring-heading"
            eyebrow={t("hiring.eyebrow")}
            title={t("hiring.title")}
          />
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-700">
            {t("hiring.intro")}
          </p>
          <AboutHiringFacts />
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <CvDownloadTrigger
              label={t("hiring.cv")}
              locale={locale}
              placement="about-hiring-cv"
              className={TEXT_LINK_CLASS}
            />
            <a
              href={BUSINESS_PROFILE.SOCIAL.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="about-hiring-linkedin"
              className={TEXT_LINK_CLASS}
            >
              {t("hiring.linkedin")}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/faq"
              data-placement="about-hiring-rate"
              className={TEXT_LINK_CLASS}
            >
              {t("hiring.rateLink")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="about-cta-heading">
        <Container width="narrow" className="text-center">
          <SectionTitle
            id="about-cta-heading"
            align="center"
            onDark
            title={t("cta.title")}
            subtitle={t("cta.description")}
          />
          <Button href="/book" variant="white" size="lg" data-placement="about-close">
            {t("cta.button")}
          </Button>
          <p className="mt-4 text-sm text-slate-300">
            {t("cta.alternativeLead")}{" "}
            <Link
              href="/contact"
              data-placement="about-close-contact"
              className={ON_NAVY_LINK_CLASS}
            >
              {t("cta.alternativeLink")}
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
