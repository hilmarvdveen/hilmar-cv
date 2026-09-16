import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";

const FEDERATION_POST_HREF = "/blog/apollo-federation-explained-by-building-a-supergraph";

const ARTICLE_LINK_CLASS =
  "inline-flex min-h-6 items-center rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

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
        <p className="mt-3 text-sm text-gray-600">
          <Link
            href={FEDERATION_POST_HREF}
            data-placement="home-stack-article"
            className={ARTICLE_LINK_CLASS}
          >
            {t("link")}
          </Link>
        </p>
      </Container>
    </Section>
  );
};
