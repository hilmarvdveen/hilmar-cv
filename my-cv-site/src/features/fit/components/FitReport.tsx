"use client";

import type { RefObject } from "react";
import { useTranslations } from "next-intl";
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
} from "@/lib/fit";

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

const RESULT_HEADING_ID = "fit-result-heading";
const REQUIREMENTS_HEADING_ID = "fit-requirements-heading";
const TECHNOLOGIES_HEADING_ID = "fit-technologies-heading";

type FitReportProps = {
  report: FitReportData;
  sessionId: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
};

export const FitReport = ({ report, sessionId, headingRef }: FitReportProps) => {
  const t = useTranslations("fit.check");
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

  return (
    <section aria-labelledby={RESULT_HEADING_ID} className="mt-8 space-y-8">
      <Card>
        <h2
          id={RESULT_HEADING_ID}
          ref={headingRef}
          tabIndex={-1}
          className="text-subsection-title text-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {t("report.title")}
        </h2>
        {hasRequirements && (
          <p className="mt-3 text-base font-semibold text-textMain">
            {t("report.counts", {
              inRecord: counts.inRecord,
              partly: counts.partly,
              notInRecord: counts.notInRecord,
              total: report.requirements.length,
            })}
          </p>
        )}
        {report.summary && (
          <p className="mt-3 text-base leading-relaxed text-gray-700">{report.summary}</p>
        )}
        {!hasRequirements && (
          <p className="mt-3 text-base leading-relaxed text-gray-700">{t("report.empty")}</p>
        )}
      </Card>

      {hasRequirements && (
        <section aria-labelledby={REQUIREMENTS_HEADING_ID}>
          <h3 id={REQUIREMENTS_HEADING_ID} className="text-subsection-title text-textMain mb-4">
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
                <Card>
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
                  <p className="mt-2 text-base leading-relaxed text-gray-700">
                    {requirement.note}
                  </p>
                  {requirement.engagements.length > 0 && (
                    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span className="font-semibold">{t("report.evidenceLabel")}</span>
                      {requirement.engagements.map((engagement) => (
                        <Link
                          key={engagement.id}
                          href={`/experience/${engagement.id}`}
                          className="inline-flex min-h-6 items-center rounded-sm px-1 text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                          data-placement="fit-evidence"
                        >
                          {engagement.company}
                        </Link>
                      ))}
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {technologyRows.length > 0 && (
        <section aria-labelledby={TECHNOLOGIES_HEADING_ID}>
          <h3 id={TECHNOLOGIES_HEADING_ID} className="text-subsection-title text-textMain mb-2">
            {t("report.technologiesTitle")}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {t("report.technologiesBasis")}
          </p>
          <Card>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {technologyRows.map((row) => (
                <li key={row.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-base text-textMain">{row.name}</span>
                    <span className="text-base font-bold text-primary">
                      {row.duration.unit === "years"
                        ? t("report.years", { years: row.duration.value })
                        : t("report.months", { months: row.duration.value })}
                    </span>
                  </div>
                  {row.companies.length > 0 && (
                    <p className="mt-1 text-sm text-gray-600">{row.companies.join(", ")}</p>
                  )}
                </li>
              ))}
            </ul>
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
