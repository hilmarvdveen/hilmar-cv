import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/Card";

type CompactEngagementCardProps = {
  id: string;
  logo: string;
  logoAlt: string;
  company: string;
  metaLine: string;
  summary: string;
  readMoreLabel: string;
  anchorId?: string;
};

const readMoreClass =
  "mt-3 inline-flex min-h-6 items-center gap-1 rounded-md text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 after:absolute after:inset-0 after:content-['']";

export const CompactEngagementCard = ({
  id,
  logo,
  logoAlt,
  company,
  metaLine,
  summary,
  readMoreLabel,
  anchorId,
}: CompactEngagementCardProps) => (
  <article id={anchorId} className="scroll-mt-16">
    <Card className="relative transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="relative mt-1 h-8 w-24 shrink-0">
          <Image src={`/logos/${logo}`} alt={logoAlt} fill sizes="96px" className="object-contain object-left" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-textMain">{company}</h3>
          <p className="text-sm text-gray-500">{metaLine}</p>
          <p className="mt-2 text-base leading-relaxed text-gray-700">{summary}</p>
          <Link href={`/experience/${id}`} className={readMoreClass}>
            {readMoreLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  </article>
);
