import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";

type ValidationPanel = {
  title: string;
  body: string;
  attribution: string;
};

export const ValidationSection = () => {
  const t = useTranslations("home.validation");
  const panels = t.raw("panels") as ValidationPanel[];

  return (
    <Section background="light" padding="default" aria-labelledby="validation-heading">
      <Container>
        <SectionTitle title={t("title")} id="validation-heading" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {panels.map((panel, index) => (
            <Card key={index} variant="quiet">
              <h3 className="text-base font-bold text-primary mb-2">
                {panel.title}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {panel.body}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
                {panel.attribution}
              </p>
              {index === panels.length - 1 && (
                <Link
                  href="/experience"
                  data-placement="validation-history"
                  className="mt-4 inline-flex min-h-6 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  {t("historyLink")}
                </Link>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
