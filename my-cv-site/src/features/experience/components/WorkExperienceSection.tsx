import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { MapPin, Globe, Languages } from "lucide-react";
import { workHistory, type WorkEntry } from "@/data/workHistory";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { formatMonthYear } from "@/lib/workPeriod";
import { hasBrandColor } from "../brandColor";
import { ExperienceQuickNav, type ExperienceChip } from "./ExperienceQuickNav";

type BodyParagraph = { paragraph: string };

const SECTION_HEADING_ID = "work-experience-heading";
const MID_CTA_HEADING_ID = "work-experience-mid-cta-heading";
const ENTRIES_BEFORE_MID_CTA = 2;

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

  const renderEntry = (entry: WorkEntry) => {
    const id = entry.id;
    const company = t(`${id}.company`);
    const location = t(`${id}.location`);
    const role = t(`${id}.role`);
    const summary = t(`${id}.summary`);
    const bodyParagraphs =
      (t.raw(`${id}.body`) as BodyParagraph[] | undefined) ?? [];

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

          <p className="mt-2 text-[15px] font-medium leading-relaxed text-textMain">
            {summary}
          </p>

          <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-gray-700">
            {bodyParagraphs.map((item, index) =>
              item?.paragraph ? <p key={index}>{item.paragraph}</p> : null
            )}
          </div>

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
        <Container>
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
        <Section background="light">
          <Container width="narrow">
            <div className="grid grid-cols-1 gap-8">
              {remainingEntries.map((entry) => renderEntry(entry))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
};
