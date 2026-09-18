import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isOwnWorkEngagement, type FitEngagementReference } from "@/lib/fit/client";

type FitEvidenceProps = {
  engagements: FitEngagementReference[];
  placement: string;
};

export const FitEvidence = ({ engagements, placement }: FitEvidenceProps) => {
  const t = useTranslations("fit.check.report");
  if (engagements.length === 0) return null;

  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
      <span className="font-semibold">{t("evidenceLabel")}</span>
      {engagements.map((engagement) =>
        isOwnWorkEngagement(engagement.id) ? (
          <span key={engagement.id} className="inline-flex min-h-6 items-center gap-2 px-1">
            {t(`ownWork.${engagement.id}`)}
            <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-semibold text-brand-navy">
              {t("ownWorkLabel")}
            </span>
          </span>
        ) : (
          <Link
            key={engagement.id}
            href={`/experience/${engagement.id}`}
            className="inline-flex min-h-6 items-center rounded-sm px-1 text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            data-placement={placement}
          >
            {engagement.company}
          </Link>
        )
      )}
    </p>
  );
};
