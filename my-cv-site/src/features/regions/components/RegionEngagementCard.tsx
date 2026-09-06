import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";
import { formatMonthYear } from "@/lib/workPeriod";
import type { WorkEntry } from "@/data/workHistory";

type RegionEngagementCardProps = {
  entry: WorkEntry;
  showCity?: boolean;
};

export const RegionEngagementCard = ({ entry, showCity = false }: RegionEngagementCardProps) => {
  const work = useTranslations("work");
  const common = useTranslations("common");
  const locale = useLocale();
  const period = work("period", {
    from: formatMonthYear(entry.from, locale),
    to: formatMonthYear(entry.to, locale),
  });
  const meta = [showCity ? work(`${entry.id}.location`) : undefined, period, work(`${entry.id}.role`)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="relative mt-1 h-8 w-24 shrink-0">
          <Image
            src={`/logos/${entry.logo}`}
            alt={common("images.companyLogoAlt", { company: entry.company })}
            fill
            sizes="96px"
            className="object-contain object-left"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-textMain">{work(`${entry.id}.company`)}</h3>
          <p className="text-sm text-gray-500">{meta}</p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-base leading-relaxed text-gray-700">{work(`${entry.id}.summary`)}</p>
      <Link
        href={`/experience/${entry.id}`}
        className="mt-3 inline-flex min-h-6 items-center gap-1 self-start rounded-md text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        {work("readMore")}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
};
