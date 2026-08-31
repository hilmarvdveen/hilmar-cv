import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";

type ResultItem = {
  value: string;
  detail: string;
};

const RESULTS_TITLE_ID = "results-strip-title";

/**
 * Static stat strip summarising measurable outcomes. No visible heading in
 * the design, so the section title renders sr-only for accessible structure.
 */
export const ResultsStrip = () => {
  const t = useTranslations("home.results");
  const items = t.raw("items") as ResultItem[];

  return (
    <Section
      padding="compact"
      className="border-b border-gray-200"
      aria-labelledby={RESULTS_TITLE_ID}
    >
      <Container>
        <h2 id={RESULTS_TITLE_ID} className="sr-only">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.value}
              className="border-l-[3px] border-primary pl-5"
            >
              <p className="text-3xl font-extrabold text-brand-navy tracking-tight">
                {item.value}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[13px] italic text-gray-500 mt-5">
          {t("caveat")}
        </p>
      </Container>
    </Section>
  );
};
