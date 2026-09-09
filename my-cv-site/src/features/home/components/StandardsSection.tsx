import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Shield, Accessibility, ClipboardCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

type StandardsColumn = {
  title: string;
  body: string;
};

const columnIcons = [Shield, Accessibility, ClipboardCheck];

const ARTICLES = [
  { href: "/blog/unit-testing-react-the-right-way", labelKey: "link" },
  { href: "/blog/sessions-and-jwt-one-design-built-seven-times", labelKey: "securityLink" },
];

const ARTICLE_LINK_CLASS =
  "inline-flex min-h-6 items-center rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

export const StandardsSection = () => {
  const t = useTranslations("home.standards");
  const columns = t.raw("columns") as StandardsColumn[];

  return (
    <Section background="white" padding="default" aria-labelledby="standards-heading">
      <Container>
        <SectionTitle id="standards-heading" title={t("title")} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column, index) => {
            const ColumnIcon = columnIcons[index];
            return (
              <Card key={column.title} variant="tinted">
                <ColumnIcon className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-bold text-textMain mb-2">
                  {column.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {column.body}
                </p>
              </Card>
            );
          })}
        </div>
        <ul className="mt-6 flex flex-col items-center gap-2 text-sm text-gray-600">
          {ARTICLES.map((article) => (
            <li key={article.href}>
              <Link
                href={article.href}
                data-placement="home-standards-article"
                className={ARTICLE_LINK_CLASS}
              >
                {t(article.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
