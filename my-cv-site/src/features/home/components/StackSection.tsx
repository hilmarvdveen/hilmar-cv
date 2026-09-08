import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";

type StackTier = {
  label: string;
  emphasis: boolean;
  items: string[];
};

export const StackSection = () => {
  const t = useTranslations("home.stack");
  const tiers = t.raw("tiers") as StackTier[];

  return (
    <Section background="white" padding="default" aria-labelledby="stack-heading">
      <Container>
        <SectionTitle title={t("title")} id="stack-heading" />
        <div className="space-y-6">
          {tiers.map((tier) => (
            <div
              key={tier.label}
              className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start"
            >
              <span
                className={
                  tier.emphasis
                    ? "w-24 shrink-0 text-sm font-bold pt-1.5 text-primary"
                    : "w-24 shrink-0 text-sm font-bold pt-1.5 text-gray-500"
                }
              >
                {tier.label}
              </span>
              <ul className="flex flex-wrap gap-2">
                {tier.items.map((item) => (
                  <li
                    key={item}
                    className={
                      tier.emphasis
                        ? "text-sm font-semibold rounded-md px-3.5 py-1.5 text-brand-navy bg-emerald-50"
                        : "text-sm font-semibold rounded-md px-3.5 py-1.5 text-gray-700 bg-gray-100"
                    }
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-8">{t("footnote")}</p>
      </Container>
    </Section>
  );
};
