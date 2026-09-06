import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import type { WorkEntry } from "@/data/workHistory";
import { regionPath, type Region } from "@/data/regions";
import type { BlogPostMeta } from "@/features/blog/types";
import type { Locale } from "@/lib/seo";
import { RegionEngagementCard } from "./RegionEngagementCard";

type Shape = { title: string; body: string };
type Question = { question: string; answer: string };
type Fact = { label: string; value: string; detail: string };

type RegionPageProps = {
  region: Region;
  locale: Locale;
  engagements: WorkEntry[];
  nearby: WorkEntry[];
  sector: WorkEntry[];
  posts: BlogPostMeta[];
  siblings: Region[];
  totalEngagements: number;
};

const linkClass =
  "inline-flex items-center gap-1 rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

export const RegionPage = ({ region, locale, engagements, nearby, sector, posts, siblings, totalEngagements }: RegionPageProps) => {
  const t = useTranslations("regions");
  const home = useTranslations("home");
  const city = t(`${region.id}.name`);
  const count = engagements.length;
  const travel = t.raw(`${region.id}.travel`) as string[];
  const shapes = t.raw(`${region.id}.shapes`) as Shape[];
  const questions = t.raw(`${region.id}.questions`) as Question[];
  const facts = home.raw("hiring.facts") as Fact[];

  return (
    <>
      <Section background="white" aria-labelledby="region-pitch-heading">
        <Container width="narrow">
          <SectionTitle id="region-pitch-heading" title={t("shared.pitchTitle")} size="compact" />
          <Card variant="quiet">
            <p className="text-xl font-semibold leading-snug text-textMain">{home("hiring.pitch.sentence")}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{home("hiring.pitch.examples")}</p>
          </Card>
        </Container>
      </Section>

      <Section background="light" aria-labelledby="region-engagements-heading">
        <Container>
          <SectionTitle
            id="region-engagements-heading"
            title={t("shared.engagementsTitle", { city })}
            subtitle={t(`${region.id}.engagementsLead`, { count, total: totalEngagements })}
          />
          {engagements.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {engagements.map((entry) => (
                <RegionEngagementCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
          {sector.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-bold text-textMain">{t("shared.sectorTitle")}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {sector.map((entry) => (
                  <RegionEngagementCard key={entry.id} entry={entry} showCity />
                ))}
              </div>
            </div>
          )}
          {nearby.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-bold text-textMain">{t("shared.nearbyTitle")}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {nearby.map((entry) => (
                  <RegionEngagementCard key={entry.id} entry={entry} showCity />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section background="white" aria-labelledby="region-travel-heading">
        <Container width="narrow">
          <SectionTitle id="region-travel-heading" title={t("shared.travelTitle", { city })} size="compact" />
          <Card>
            <ul className="space-y-3">
              {travel.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </Section>

      {shapes.length > 0 && (
        <Section background="light" aria-labelledby="region-shapes-heading">
          <Container>
            <SectionTitle id="region-shapes-heading" title={t("shared.shapesTitle")} />
            {shapes.length === 1 ? (
              <Card variant="quiet">
                <p className="text-lg leading-relaxed text-textMain">{shapes[0].body}</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {shapes.map((shape) => (
                  <Card key={shape.title} className="flex h-full flex-col">
                    <h3 className="text-lg font-bold text-textMain">{shape.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{shape.body}</p>
                  </Card>
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}

      {posts.length > 0 && (
        <Section background="white" aria-labelledby="region-reading-heading">
          <Container>
            <SectionTitle id="region-reading-heading" title={t("shared.readingTitle")} subtitle={t(`${region.id}.readingLead`)} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.slug} className="flex h-full flex-col">
                  <h3 className="text-lg font-bold text-textMain">{post.title[locale]}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-gray-600">{post.description[locale]}</p>
                  <Link href={`/blog/${post.slug}`} className={`${linkClass} mt-4 self-start text-[15px]`}>
                    {t("shared.readPost")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section background="light" aria-labelledby="region-facts-heading">
        <Container width="narrow">
          <SectionTitle id="region-facts-heading" title={t("shared.factsTitle")} size="compact" />
          <Card>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{fact.label}</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-textMain">{fact.value}</dd>
                  {fact.detail && <dd className="mt-0.5 text-sm text-gray-600">{fact.detail}</dd>}
                </div>
              ))}
            </dl>
          </Card>
        </Container>
      </Section>

      <Section background="white" aria-labelledby="region-questions-heading">
        <Container width="narrow">
          <SectionTitle id="region-questions-heading" title={t("shared.questionsTitle", { city })} size="compact" />
          <div className="space-y-3">
            {questions.map((item) => (
              <details key={item.question} className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer list-none text-[15px] font-semibold text-textMain">{item.question}</summary>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="light" padding="compact" aria-labelledby="region-others-heading">
        <Container width="narrow">
          <h2 id="region-others-heading" className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            {t("shared.othersTitle")}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                <Link href={regionPath(sibling)} className={`${linkClass} text-[15px]`} data-placement={`region-${region.id}-sibling`}>
                  {t(`${sibling.id}.name`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={regionPath()} className={`${linkClass} text-[15px]`}>
                {t("shared.hubLink")}
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="region-close-heading">
        <Container width="narrow" className="text-center">
          <h2 id="region-close-heading" className="mb-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-4xl">
            {t(`${region.id}.closeTitle`)}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">{t(`${region.id}.closeBody`)}</p>
          <Button href="/book" variant="white" size="lg" data-placement={`region-${region.id}-close`}>
            {home("close.button")}
          </Button>
          <p className="mt-6 text-sm text-slate-300">
            <Link href="/contact" className="underline underline-offset-4 hover:text-white">
              {home("close.alternative")}
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
};
