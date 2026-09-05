import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Code, Zap, Palette, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";

type ServiceCardId = "frontend" | "fullstack" | "designSystems" | "consulting";

type ServiceCard = {
  id: ServiceCardId;
  Icon: ComponentType<{ className?: string }>;
  href: string;
};

const SERVICE_CARDS: ServiceCard[] = [
  { id: "frontend", Icon: Code, href: "/services/frontend" },
  { id: "fullstack", Icon: Zap, href: "/services/fullstack" },
  { id: "designSystems", Icon: Palette, href: "/services/design-systems" },
  { id: "consulting", Icon: Users, href: "/services/consulting" },
];

export const ServicesHero = () => {
  const t = useTranslations("services");

  return (
    <PageHero
      breadcrumb={<Breadcrumb />}
      badge={t("hero.badge")}
      title={t("hero.title")}
      description={t("hero.description")}
      actions={
        <>
          <Button href="/book" variant="primary" size="lg" data-placement="services-hero">
            {t("cta.book")}
          </Button>
          <Button href="/contact" variant="outlineOnDark" size="lg">
            {t("cta.contact")}
          </Button>
        </>
      }
      aside={
        <div className="grid grid-cols-2 gap-4">
          {SERVICE_CARDS.map(({ id, Icon, href }) => (
            <Link
              key={id}
              href={href}
              className="group rounded-xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:bg-white/10"
            >
              <Icon className="h-6 w-6 text-emerald-300" aria-hidden="true" />
              <span className="mt-3 flex items-center gap-1.5 font-semibold text-gray-100">
                {t(`main.services.${id}.title`)}
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-emerald-300 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1 block text-sm text-slate-300">
                {t(`main.services.${id}.outcome`)}
              </span>
            </Link>
          ))}
        </div>
      }
    />
  );
};
