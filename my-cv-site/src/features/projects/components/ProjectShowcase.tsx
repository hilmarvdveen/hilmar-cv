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

const EXPERIENCE_ANCHOR_PREFIX = "/experience#experience-";

function findWorkEntry(href: string) {
  if (!href.startsWith(EXPERIENCE_ANCHOR_PREFIX)) {
    return undefined;
  }
  const entryId = href.slice(EXPERIENCE_ANCHOR_PREFIX.length);
  return workHistory.find((entry) => entry.id === entryId);
}

export const ProjectShowcase = () => {
  const t = useTranslations("projects");
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
                <Card
                  key={projectCase.title}
                  className="md:grid md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-8"
                >
                  <div className="min-w-0">
                    <p className="mb-3 text-3xl font-extrabold text-emerald-700">
                      {projectCase.outcome}
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-textMain">
                      {projectCase.title}
                    </h3>
                    <p className="mb-4 max-w-[68ch] text-[15px] leading-relaxed text-gray-600">
                      {projectCase.body}
                    </p>
                    <Link
                      href={projectCase.href}
                      className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
                    >
                      {projectCase.roleLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="mt-6 flex h-32 items-center justify-center rounded-xl bg-bgLight p-6 md:mt-0 md:h-full">
                    {workEntry && (
                      <Image
                        src={`/logos/${workEntry.logo}`}
                        alt={projectCase.client}
                        width={160}
                        height={80}
                        className="h-12 w-auto object-contain"
                      />
                    )}
                  </div>
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
