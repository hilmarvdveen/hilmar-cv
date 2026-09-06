import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { ArrowRight, Check, MapPin, Globe, Languages } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { workHistory, type WorkEntry } from "@/data/workHistory";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { formatMonthYear } from "@/lib/workPeriod";
import { hasBrandColor } from "../brandColor";
import { ExperienceQuickNav, type ExperienceChip } from "./ExperienceQuickNav";


const SECTION_HEADING_ID = "work-experience-heading";
const EARLIER_HEADING_ID = "work-experience-earlier-heading";
const MID_CTA_HEADING_ID = "work-experience-mid-cta-heading";
export const FULL_CARD_COUNT = 4;
const ENTRIES_BEFORE_MID_CTA = FULL_CARD_COUNT;

export const WorkExperienceSection = () => {
  const t = useTranslations("work");
  const commonT = useTranslations("common");
  const experiencePageT = useTranslations("experiencePage");
  const locale = useLocale();
  const sectionTitle = t("sectionTitle");

  const chips: ExperienceChip[] = workHistory.map((entry) => ({
    id: entry.id,
    company: t(`${entry.id}.company`),
  }));

  const renderCompactEntry = (entry: WorkEntry) => {
    const id = entry.id;
    const company = t(`${id}.company`);
    const period = t("period", {
      from: formatMonthYear(entry.from, locale),
      to: formatMonthYear(entry.to, locale),
    });

    return (
      <article key={id} id={`experience-${id}`} className="scroll-mt-16">
        <Card className="transition-shadow hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="relative mt-1 h-8 w-24 shrink-0">
              <Image
                src={`/logos/${entry.logo}`}
                alt={commonT("images.companyLogoAlt", { company: entry.company })}
                fill
                sizes="96px"
                className="object-contain object-left"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-textMain">{company}</h3>
              <p className="text-sm text-gray-500">
                {period} · {t(`${id}.role`)}
              </p>
              <p className="mt-2 text-base leading-relaxed text-gray-700">{t(`${id}.summary`)}</p>
              <Link
                href={`/experience/${id}`}
                className="mt-3 inline-flex min-h-6 items-center gap-1 rounded-md text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                {t("readMore")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Card>
      </article>
    );
  };

  const renderEntry = (entry: WorkEntry) => {
    const id = entry.id;
    const company = t(`${id}.company`);
    const location = t(`${id}.location`);
    const role = t(`${id}.role`);
    const summary = t(`${id}.summary`);
    const delivered = (t.raw(`${id}.delivered`) as string[] | undefined) ?? [];

    return (
      <article key={id} id={`experience-${id}`} className="scroll-mt-16">
        <Card className="transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center">
            <div
              className="relative mr-4 h-10 w-32 rounded"
              style={
                hasBrandColor(entry.color)
                  ? { backgroundColor: entry.color }
                  : undefined
              }
            >
              <Image
                src={`/logos/${entry.logo}`}
                alt={commonT("images.companyLogoAlt", {
                  company: entry.company,
                })}
                fill
                sizes="128px"
                className="rounded object-contain"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-textMain">
                {company}
              </h3>
              <p className="text-sm text-gray-500">
                {t("period", {
                  from: formatMonthYear(entry.from, locale),
                  to: formatMonthYear(entry.to, locale),
                })}
              </p>
            </div>
          </div>

          <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <li className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {location}
            </li>
            <li className="inline-flex items-center gap-1">
              <Globe className="h-4 w-4" aria-hidden="true" />
              {t(entry.mode)}
            </li>
            <li className="inline-flex items-center gap-1">
              <Languages className="h-4 w-4" aria-hidden="true" />
              {t(entry.language)}
            </li>
          </ul>

          <p className="mb-2 text-sm text-gray-700">
            <span className="font-semibold">{t("role")}:</span> {role}
          </p>

          <p className="mt-2 text-base font-medium leading-relaxed text-textMain">
            {summary}
          </p>

          {delivered.length > 0 && (
            <>
              <h4 className="mt-5 text-xs font-bold uppercase tracking-widest text-primary">
                {t("deliveredTitle")}
              </h4>
              <ul aria-label={t("deliveredTitle")} className="mt-2 space-y-2">
                {delivered.map((item) => (
                  <li key={item} className="flex gap-2 text-base leading-relaxed text-gray-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Link
            href={`/experience/${id}`}
            className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-bgLight px-4 py-3 text-base font-semibold text-primary transition-colors hover:border-emerald-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <span>{t("readMore")}</span>
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </Link>

          {entry.tech.length > 0 && (
            <ul
              aria-label={t("technologies")}
              className="mt-4 flex flex-wrap gap-2"
            >
              {entry.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md bg-bgLight px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200"
                >
                  {t(tech)}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </article>
    );
  };

  const leadEntries = workHistory.slice(0, ENTRIES_BEFORE_MID_CTA);
  const remainingEntries = workHistory.slice(ENTRIES_BEFORE_MID_CTA);

  return (
    <>
      <ExperienceQuickNav chips={chips} label={sectionTitle} />
      <Section background="light" aria-labelledby={SECTION_HEADING_ID}>
        <Container width="narrow">
          <SectionTitle id={SECTION_HEADING_ID} title={sectionTitle} />
        </Container>
        <Container width="narrow">
          <div className="grid grid-cols-1 gap-8">
            {leadEntries.map((entry) => renderEntry(entry))}
          </div>
        </Container>
      </Section>

      {remainingEntries.length > 0 && (
        <Section
          background="navy"
          padding="compact"
          aria-labelledby={MID_CTA_HEADING_ID}
        >
          <Container width="narrow" className="text-center">
            <div data-track-section="experience-band">
              <SectionTitle
                id={MID_CTA_HEADING_ID}
                title={experiencePageT("cta.title")}
                subtitle={experiencePageT("cta.description")}
                align="center"
                onDark
              />
              <Button href="/book" variant="white" size="lg" data-placement="experience-band">
                {experiencePageT("cta.button")}
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {remainingEntries.length > 0 && (
        <Section background="light" aria-labelledby={EARLIER_HEADING_ID}>
          <Container width="narrow">
            <SectionTitle id={EARLIER_HEADING_ID} title={t("earlierTitle")} />
            <div className="grid grid-cols-1 gap-4">
              {remainingEntries.map((entry) => renderCompactEntry(entry))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
};
