import { getTranslations } from "next-intl/server";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Link } from "@/i18n/navigation";

const MAIN_PAGE_NAV_KEYS = [
  "services",
  "experience",
  "projects",
  "blog",
  "contact",
] as const;

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const searchTranslations = await getTranslations("search");
  const commonTranslations = await getTranslations("common");

  return (
    <>
      <PageHero
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button href="/" variant="primary" size="md">
              {t("backHome")}
            </Button>
            <Button href="/search" variant="outlineOnDark" size="md">
              {searchTranslations("title")}
            </Button>
          </>
        }
      />
      <Section>
        <Container width="narrow">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {MAIN_PAGE_NAV_KEYS.map((key) => (
              <li key={key}>
                <Link
                  href={`/${key}`}
                  className="text-primary font-semibold underline underline-offset-4"
                >
                  {commonTranslations(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
