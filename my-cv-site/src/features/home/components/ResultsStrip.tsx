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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {items.map((item) => (
            <div
              key={item.value}
              className="border-l-[3px] border-primary pl-6"
            >
              {/* One line at every breakpoint, and a fixed slot height so the
                  four detail lines start on the same level. */}
              <p className="flex min-h-10 items-end text-2xl lg:text-xl xl:text-[26px] font-extrabold leading-none text-brand-navy tracking-tight whitespace-nowrap">
                {item.value}
              </p>
              <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        {/* The GMV qualification reads as a plain fact next to the number,
            in the same voice as the rest of the strip. */}
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600">
          {t("caveat")}
        </p>
      </Container>
    </Section>
  );
};
