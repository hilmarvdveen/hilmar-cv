import { useLocale, useTranslations } from "next-intl";
import { regionForCity, regionPath } from "@/data/regions";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import type { WorkEntry } from "@/data/workHistory";
import { formatMonthYear } from "@/lib/workPeriod";

type BodyParagraph = { paragraph: string; heading?: string };

type ExperienceDetailProps = {
  entry: WorkEntry;
  previous?: WorkEntry;
  next?: WorkEntry;
  others?: WorkEntry[];
};

const OTHERS_HEADING_ID = "experience-others-heading";
const STORY_HEADING_ID = "experience-story-heading";
const DELIVERED_HEADING_ID = "experience-delivered-heading";
const TECHNOLOGY_HEADING_ID = "experience-technology-heading";
const FACTS_HEADING_ID = "experience-facts-heading";

const neighbourLinkClass =
  "inline-flex min-h-6 items-center gap-2 rounded-md text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

export const ExperienceDetail = ({ entry, previous, next, others = [] }: ExperienceDetailProps) => {
  const t = useTranslations("work");
  const page = useTranslations("experiencePage");
  const locale = useLocale();
  const bodyParagraphs =
    (t.raw(`${entry.id}.body`) as BodyParagraph[] | undefined) ?? [];
  const delivered = (t.raw(`${entry.id}.delivered`) as string[] | undefined) ?? [];
  const facts = [
    {
      label: page("detail.periodLabel"),
      value: t("period", {
        from: formatMonthYear(entry.from, locale),
        to: formatMonthYear(entry.to, locale),
      }),
    },
    {
      label: page("detail.locationLabel"),
      value: t(`${entry.id}.location`),
      href: regionForCity(entry.location) ? regionPath(regionForCity(entry.location)) : undefined,
    },
    { label: page("detail.modeLabel"), value: t(entry.mode) },
    { label: page("detail.languageLabel"), value: t(entry.language) },
    { label: page("detail.roleLabel"), value: t(`${entry.id}.role`) },
  ];

  return (
    <Section background="white" aria-labelledby={STORY_HEADING_ID}>
      <Container width="narrow">
        <p className="text-lg font-medium leading-relaxed text-textMain">
          {t(`${entry.id}.summary`)}
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
          <div>
            {delivered.length > 0 && (
              <>
                <h2 id={DELIVERED_HEADING_ID} className="text-subsection-title text-textMain">
                  {t("deliveredTitle")}
                </h2>
                <ul aria-labelledby={DELIVERED_HEADING_ID} className="mt-4 space-y-2">
                  {delivered.map((item) => (
                    <li key={item} className="flex gap-2 text-base leading-relaxed text-gray-700">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-bgLight p-5">
            <h2 id={FACTS_HEADING_ID} className="text-xs font-bold uppercase tracking-widest text-primary">
              {page("detail.factsTitle")}
            </h2>
            <dl aria-labelledby={FACTS_HEADING_ID} className="mt-3 space-y-3 text-sm">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-gray-500">{fact.label}</dt>
                  <dd className="font-medium text-textMain">
                    {fact.href ? (
                      <Link
                        href={fact.href}
                        className="inline-flex min-h-6 items-center rounded-sm underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        data-placement="experience-detail-location"
                      >
                        {fact.value}
                      </Link>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <h2 id={STORY_HEADING_ID} className="mt-12 text-subsection-title text-textMain">
          {page("detail.storyTitle")}
        </h2>
        <div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-700">
          {bodyParagraphs.map((item, index) =>
            item?.paragraph ? (
              <div key={index} className="space-y-4">
                {item.heading && (
                  <h3 className="pt-4 text-lg font-bold text-textMain">{item.heading}</h3>
                )}
                <p>{item.paragraph}</p>
              </div>
            ) : null
          )}
        </div>

        {entry.tech.length > 0 && (
          <>
            <h2 id={TECHNOLOGY_HEADING_ID} className="mt-12 text-subsection-title text-textMain">
              {page("detail.technologyTitle")}
            </h2>
            <ul aria-labelledby={TECHNOLOGY_HEADING_ID} className="mt-4 flex flex-wrap gap-2">
              {entry.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md bg-bgLight px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200"
                >
                  {t(tech)}
                </li>
              ))}
            </ul>
          </>
        )}

        <nav
          aria-label={page("detail.back")}
          className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          {previous ? (
            <Link href={`/experience/${previous.id}`} className={neighbourLinkClass}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>
                {page("detail.previous")}: {t(`${previous.id}.company`)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          <Link href="/experience" className={neighbourLinkClass}>
            {page("detail.back")}
          </Link>
          {next ? (
            <Link href={`/experience/${next.id}`} className={neighbourLinkClass}>
              <span>
                {page("detail.next")}: {t(`${next.id}.company`)}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {others.length > 0 && (
          <>
            <h2 id={OTHERS_HEADING_ID} className="mt-10 text-xs font-bold uppercase tracking-widest text-primary">
              {page("detail.others")}
            </h2>
            <ul aria-labelledby={OTHERS_HEADING_ID} className="mt-3 flex flex-wrap gap-2">
              {others.map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/experience/${other.id}`}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-textMain transition-colors hover:border-emerald-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    {t(`${other.id}.company`)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Container>
    </Section>
  );
};
