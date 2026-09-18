import { useId, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";
import { mergeClasses } from "@/lib/mergeClasses";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import {
  FIT_VERDICTS,
  companyNamesForEngagements,
  countFitVerdicts,
  fitTechnologyDuration,
  type FitReport as FitReportData,
  type FitVerdict,
} from "@/lib/fit/client";
import { FitEvidence } from "./FitEvidence";
import { FitNote } from "./FitNote";

export const FIT_COMPANIES_NAMED_PER_TECHNOLOGY = 3;

const VERDICT_STYLES: Record<FitVerdict, string> = {
  inRecord: "bg-emerald-100 text-emerald-800",
  partly: "bg-brand-navy/10 text-brand-navy",
  notInRecord: "bg-gray-200 text-gray-700",
};

const VERDICT_MARKS: Record<FitVerdict, string> = {
  inRecord: "bg-emerald-100",
  partly: "bg-brand-navy/10",
  notInRecord: "bg-gray-200",
};

const VERDICT_RULES: Record<FitVerdict, string> = {
  inRecord: "border-l-emerald-600",
  partly: "border-l-brand-navy",
  notInRecord: "border-l-gray-400",
};

type FitReportProps = {
  report: FitReportData;
  sessionId: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  nextStepsNote?: string;
  nextStepsLinkLabel?: string;
};

export const FitReport = ({
  report,
  sessionId,
  headingRef,
  nextStepsNote,
  nextStepsLinkLabel,
}: FitReportProps) => {
  const t = useTranslations("fit.check");
  const resultHeadingId = useId();
  const requirementsHeadingId = useId();
  const technologiesHeadingId = useId();
  const counts = countFitVerdicts(report);
  const hasRequirements = report.requirements.length > 0;
  const technologyRows = report.technologies.flatMap((technology) => {
    const duration = fitTechnologyDuration(technology.years);
    if (!duration) return [];
    return [
      {
        name: technology.name,
        duration,
        companies: companyNamesForEngagements(technology.engagements),
      },
    ];
  });
  const describeCompanies = (companies: string[]): string => {
    const named = companies.slice(0, FIT_COMPANIES_NAMED_PER_TECHNOLOGY);
    const others = companies.length - named.length;
    return others > 0
      ? `${named.join(", ")} ${t("report.otherCompanies", { count: others })}`
      : named.join(", ");
  };

  return (
    <section aria-labelledby={resultHeadingId} className="mt-8 space-y-8">
      <Card>
        <h2
          id={resultHeadingId}
          ref={headingRef}
          tabIndex={-1}
          className="text-subsection-title text-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {t("report.title")}
        </h2>
        {hasRequirements && (
          <>
            <p className="sr-only">
              {t("report.counts", {
                inRecord: counts.inRecord,
                partly: counts.partly,
                notInRecord: counts.notInRecord,
                total: report.requirements.length,
              })}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3" aria-hidden="true">
              {FIT_VERDICTS.map((verdict) => (
                <div
                  key={verdict}
                  className={mergeClasses(
                    "flex flex-col-reverse justify-end rounded-lg border-l-4 bg-gray-50 p-3",
                    VERDICT_RULES[verdict]
                  )}
                >
                  <dt className="mt-1 text-sm leading-snug text-gray-600">
                    {t(`report.verdicts.${verdict}`)}
                  </dt>
                  <dd className="text-figure text-primary tabular-nums">{counts[verdict]}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        {report.summary && (
          <p className="mt-3 text-base leading-relaxed text-gray-700">{report.summary}</p>
        )}
        {!hasRequirements && !report.summary && (
          <p className="mt-3 text-base leading-relaxed text-gray-700">{t("report.empty")}</p>
        )}
        {nextStepsNote && (
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {nextStepsNote}
            {nextStepsLinkLabel && (
              <>
                {" "}
                <Link
                  href="/book"
                  data-placement="fit-result-next"
                  className="inline-flex min-h-6 items-center rounded-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  {nextStepsLinkLabel}
                </Link>
              </>
            )}
          </p>
        )}
      </Card>

      {hasRequirements && (
        <section aria-labelledby={requirementsHeadingId}>
          <h3 id={requirementsHeadingId} className="text-subsection-title text-textMain mb-4">
            {t("report.requirementsTitle")}
          </h3>

          <Card variant="quiet" className="mb-6">
            <p className="text-sm font-semibold text-textMain">{t("report.legend.title")}</p>
            <ul className="mt-2 space-y-2">
              {FIT_VERDICTS.map((verdict) => (
                <li
                  key={verdict}
                  className="flex items-start gap-3 text-sm leading-relaxed text-gray-700"
                >
                  <span
                    className={mergeClasses(
                      "mt-1 h-3 w-3 shrink-0 rounded-sm",
                      VERDICT_MARKS[verdict]
                    )}
                    aria-hidden="true"
                  />
                  {t(`report.legend.${verdict}`)}
                </li>
              ))}
            </ul>
          </Card>

          <ul className="space-y-4">
            {report.requirements.map((requirement) => (
              <li key={requirement.requirement}>
                <Card className={mergeClasses("border-l-4 p-4 sm:p-7", VERDICT_RULES[requirement.verdict])}>
                  <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
                    <p className="text-base font-bold text-textMain">{requirement.requirement}</p>
                    <span
                      className={mergeClasses(
                        "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
                        VERDICT_STYLES[requirement.verdict]
                      )}
                    >
                      {t(`report.verdicts.${requirement.verdict}`)}
                    </span>
                  </div>
                  <FitNote note={requirement.note} requirement={requirement.requirement} />
                  <FitEvidence engagements={requirement.engagements} placement="fit-evidence" />
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {technologyRows.length > 0 && (
        <section aria-labelledby={technologiesHeadingId}>
          <Card className="p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:p-7 [&::-webkit-details-marker]:hidden">
                <span>
                  <h3 id={technologiesHeadingId} className="text-subsection-title text-textMain">
                    {t("report.technologiesTitle")}
                  </h3>
                  <span className="mt-1 block text-sm text-gray-600">
                    {t("report.technologiesSummary", { count: technologyRows.length })}
                  </span>
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-gray-600 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-4 pb-4 sm:px-7 sm:pb-7">
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {t("report.technologiesBasis")}
                </p>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {technologyRows.map((row) => (
                    <div key={row.name}>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-base text-textMain">{row.name}</dt>
                        <dd className="text-right text-base font-bold tabular-nums text-primary">
                          {row.duration.unit === "years"
                            ? t("report.years", { years: row.duration.value })
                            : t("report.months", { months: row.duration.value })}
                        </dd>
                      </div>
                      {row.companies.length > 0 && (
                        <dd className="mt-1 text-sm text-gray-600">
                          {describeCompanies(row.companies)}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            </details>
          </Card>
        </section>
      )}

      {sessionId && (
        <p className="text-sm leading-relaxed text-gray-500">
          {t("report.sessionLabel", { sessionId, email: BUSINESS_PROFILE.CONTACT.EMAIL })}
        </p>
      )}
    </section>
  );
};
