import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  Accessibility,
  Briefcase,
  Check,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  Shield,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { CvDownloadTrigger } from "@/features/home";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { NetherlandsMap } from "./NetherlandsMap";

type ValueBlock = {
  title: string;
  body: string;
  evidence: string;
};

type StandardsCard = {
  title: string;
  body: string;
};

const standardsCardIcons = [Shield, Accessibility, ClipboardCheck];

export function AboutPageContent() {
  const t = useTranslations("about");
  const locale = useLocale();
  const blocks = t.raw("value.blocks") as ValueBlock[];
  const standardsCards = t.raw("standards.cards") as StandardsCard[];

  return (
    <>
      <PageHero
        badge={t("hero.badge")}
        title={t("hero.title")}
        description={t("hero.description")}
        aside={
          <div>
            <Image
              src="/images/profile.jpg"
              alt={BUSINESS_PROFILE.NAME}
              width={400}
              height={400}
              className="mx-auto w-full max-w-xs rounded-2xl object-cover md:mx-0"
              priority
            />
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                <span>
                  {t("hero.location", {
                    city: BUSINESS_PROFILE.REGISTERED_ADDRESS.CITY,
                  })}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                <span>{t("hero.education")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                <span>
                  {BUSINESS_PROFILE.REGISTRATION.LEGAL_NAME}, KVK{" "}
                  {BUSINESS_PROFILE.REGISTRATION.KVK}
                </span>
              </li>
            </ul>
          </div>
        }
        actions={
          <>
            <Button href="/book" variant="primary">
              {t("cta.button")}
            </Button>
            <Button
              href={BUSINESS_PROFILE.SOCIAL.LINKEDIN}
              variant="outlineOnDark"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("hero.linkedin")}
            </Button>
            <CvDownloadTrigger label={t("hero.cv")} locale={locale} />
          </>
        }
      />

      <Section background="light" aria-labelledby="about-value-heading">
        <Container>
          <SectionTitle
            id="about-value-heading"
            title={t("value.title")}
            subtitle={t("value.subtitle")}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blocks.map((block) => (
              <Card key={block.title}>
                <h3 className="mb-2 text-lg font-bold text-textMain">{block.title}</h3>
                <p className="mb-4 text-[14.5px] leading-relaxed text-gray-600">
                  {block.body}
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {block.evidence}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white" aria-labelledby="about-standards-heading">
        <Container>
          <SectionTitle id="about-standards-heading" title={t("standards.title")} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {standardsCards.map((card, index) => {
              const CardIcon = standardsCardIcons[index];
              return (
                <Card key={card.title} className="bg-bgLight">
                  <CardIcon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-bold text-textMain">{card.title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-gray-600">{card.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="light">
        <NetherlandsMap />
        <Container>
          <p className="mt-6 text-center text-[15px] leading-relaxed text-gray-700">
            {t("map.contactLine")}
          </p>
          <div className="mt-4 flex justify-center">
            <Button href="/book" variant="primary">
              {t("cta.button")}
            </Button>
          </div>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="about-cta-heading">
        <Container width="narrow" className="text-center">
          <h2
            id="about-cta-heading"
            className="mb-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-4xl"
          >
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
            {t("cta.description")}
          </p>
          <Button href="/book" variant="white" size="lg">
            {t("cta.button")}
          </Button>
        </Container>
      </Section>
    </>
  );
}
