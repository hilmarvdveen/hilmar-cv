import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";

export const ProjectsHero = () => {
  const t = useTranslations("projects");

  return (
    <PageHero
      breadcrumb={<Breadcrumb />}
      badge={t("hero.badge")}
      title={t("hero.title")}
      description={t("hero.description")}
      actions={
        <Button href="/book" variant="primary" size="lg">
          <Calendar className="h-5 w-5" aria-hidden="true" />
          <span>{t("cta.button")}</span>
        </Button>
      }
    />
  );
};
