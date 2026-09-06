import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import type { WorkEntry } from "@/data/workHistory";
import { regionPath, type Region } from "@/data/regions";

type RegionHubProps = {
  regions: Region[];
  engagementCounts: Record<string, number>;
  outside: WorkEntry[];
};

const linkClass =
  "inline-flex items-center gap-1 rounded-md text-[15px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

export const RegionHub = ({ regions, engagementCounts, outside }: RegionHubProps) => {
  const t = useTranslations("regions");
  const work = useTranslations("work");
  const home = useTranslations("home");

  return (
    <>
      <Section background="white" aria-labelledby="region-base-heading">
        <Container width="narrow">
          <SectionTitle id="region-base-heading" title={t("hub.baseTitle")} size="compact" />
          <Card variant="quiet">
            <p className="text-lg leading-relaxed text-textMain">{t("hub.baseBody")}</p>
          </Card>
        </Container>
      </Section>

      <Section background="light" aria-labelledby="region-cities-heading">
        <Container>
          <SectionTitle id="region-cities-heading" title={t("hub.citiesTitle")} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {regions.map((region) => (
              <Card key={region.id} className="flex h-full flex-col">
                <h3 className="text-xl font-bold text-textMain">{t(`${region.id}.name`)}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-gray-600">
                  {t(`${region.id}.hubLine`, { count: engagementCounts[region.id] ?? 0 })}
                </p>
                <Link href={regionPath(region)} className={`${linkClass} mt-4 self-start`} data-placement="region-hub-city">
                  {t("hub.cityLink", { city: t(`${region.id}.name`) })}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white" aria-labelledby="region-rest-heading">
        <Container width="narrow">
          <SectionTitle id="region-rest-heading" title={t("hub.restTitle")} subtitle={t("hub.restBody")} size="compact" />
          <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {outside.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[15px] text-gray-700">
                  <span className="font-semibold text-textMain">{work(`${entry.id}.company`)}</span>
                  {" · "}
                  {work(`${entry.id}.location`)}
                </span>
                <Link href={`/experience/${entry.id}`} className={linkClass}>
                  {work("readMore")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section background="light" aria-labelledby="region-remote-heading">
        <Container width="narrow">
          <SectionTitle id="region-remote-heading" title={t("hub.remoteTitle")} size="compact" />
          <Card>
            <p className="text-[15px] leading-relaxed text-gray-700">{t("hub.remoteBody")}</p>
          </Card>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="region-hub-close-heading">
        <Container width="narrow" className="text-center">
          <h2 id="region-hub-close-heading" className="mb-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-4xl">
            {t("hub.closeTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">{t("hub.closeBody")}</p>
          <Button href="/book" variant="white" size="lg" data-placement="region-hub-close">
            {home("close.button")}
          </Button>
        </Container>
      </Section>
    </>
  );
};
