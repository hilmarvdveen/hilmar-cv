import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import { workHistory } from "@/data/workHistory";

type ProjectCase = {
  outcome: string;
  client: string;
  title: string;
  body: string;
  roleLabel: string;
  href: string;
};

const EXPERIENCE_PAGE_PREFIX = "/experience/";

function findWorkEntry(href: string) {
  if (!href.startsWith(EXPERIENCE_PAGE_PREFIX)) {
    return undefined;
  }
  const entryId = href.slice(EXPERIENCE_PAGE_PREFIX.length);
  return workHistory.find((entry) => entry.id === entryId);
}

export const ProjectShowcase = () => {
  const t = useTranslations("projects");
  const work = useTranslations("work");
  const cases = t.raw("cases") as ProjectCase[];

  return (
    <>
      <Section background="light" aria-labelledby="projects-showcase-heading">
        <Container>
          <SectionTitle
            id="projects-showcase-heading"
            title={t("showcase.title")}
            subtitle={t("showcase.subtitle")}
          />
          <div className="space-y-6">
            {cases.map((projectCase) => {
              const workEntry = findWorkEntry(projectCase.href);
              return (
                <Card key={projectCase.title}>
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-3xl font-extrabold text-emerald-700">{projectCase.outcome}</p>
                    {workEntry && (
                      <span className="relative hidden h-10 w-32 shrink-0 sm:block">
                        <Image
                          src={`/logos/${workEntry.logo}`}
                          alt={projectCase.client}
                          fill
                          sizes="128px"
                          className="object-contain object-right"
                        />
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-textMain">{projectCase.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {projectCase.client} · {projectCase.roleLabel}
                  </p>
                  <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-gray-600">
                    {projectCase.body}
                  </p>
                  <Link
                    href={projectCase.href}
                    className="mt-4 inline-flex items-center gap-2 rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    {work("readMore")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="projects-cta-heading">
        <Container width="narrow" className="text-center">
          <h2
            id="projects-cta-heading"
            className="mb-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-4xl"
          >
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
            {t("cta.description")}
          </p>
          <Button href="/book" variant="white" size="lg" data-placement="projects-close">
            {t("cta.button")}
          </Button>
        </Container>
      </Section>
    </>
  );
};
