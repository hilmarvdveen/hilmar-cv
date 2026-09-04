import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";

type ResultItem = {
  value: string;
  label: string;
  detail: string;
};

const RESULTS_HEADING_ID = "results-heading";

export const ResultsStrip = () => {
  const t = useTranslations("home.results");
  const items = t.raw("items") as ResultItem[];

  return (
    <Section
      padding="default"
      className="border-b border-gray-200"
      aria-labelledby={RESULTS_HEADING_ID}
    >
      <Container>
        <div data-track-section="results-strip">
          <SectionTitle id={RESULTS_HEADING_ID} title={t("title")} align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {items.map((item) => (
              <div
                key={item.value}
                className="border-l-[3px] border-primary pl-6 lg:grid lg:grid-rows-[5rem_2.5rem_1fr]"
              >
                <p className="text-3xl xl:text-4xl font-extrabold leading-[1.1] text-primary tracking-tight text-balance">
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-textMain">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600">
            {t("caveat")}
          </p>
        </div>
      </Container>
    </Section>
  );
};
