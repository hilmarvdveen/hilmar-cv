import { getTranslations } from "next-intl/server";
import { ArrowRight, Home, Mail, Search } from "lucide-react";
import { Card } from "@/components/Card";
import { PageHero } from "@/components/PageHero";
import { Link } from "@/i18n/navigation";

const RECOVERY_DESTINATIONS = [
  { href: "/", icon: Home },
  { href: "/search", icon: Search },
  { href: "/contact", icon: Mail },
] as const;

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const searchTranslations = await getTranslations("search");
  const commonTranslations = await getTranslations("common");

  const destinationLabels: Record<(typeof RECOVERY_DESTINATIONS)[number]["href"], string> = {
    "/": t("backHome"),
    "/search": searchTranslations("title"),
    "/contact": commonTranslations("nav.contact"),
  };

  return (
    <PageHero
      title={t("title")}
      description={t("description")}
      aside={
        <div className="space-y-4">
          {RECOVERY_DESTINATIONS.map(({ href, icon: Icon }) => (
            <Link key={href} href={href} className="block">
              <Card className="flex items-center gap-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50">
                <Icon
                  className="h-5 w-5 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <span className="font-semibold text-textMain">
                  {destinationLabels[href]}
                </span>
                <ArrowRight
                  className="ml-auto h-4 w-4 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </Card>
            </Link>
          ))}
        </div>
      }
    />
  );
}
