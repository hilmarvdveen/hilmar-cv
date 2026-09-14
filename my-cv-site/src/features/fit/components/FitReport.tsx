"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";
import { mergeClasses } from "@/lib/mergeClasses";
import type { FitReport as FitReportData, FitVerdict } from "@/lib/fit";

const VERDICT_STYLES: Record<FitVerdict, string> = {
  inRecord: "bg-emerald-50 text-emerald-800 border-emerald-200",
  partly: "bg-brand-navy/5 text-brand-navy border-brand-navy/20",
  notInRecord: "bg-gray-100 text-gray-700 border-gray-300",
};

type FitReportProps = {
  report: FitReportData;
};

export const FitReport = ({ report }: FitReportProps) => {
  const t = useTranslations("fit.check");

  if (report.requirements.length === 0) {
    return (
      <Card className="mt-8">
        <p className="text-base leading-relaxed text-gray-700">{t("report.empty")}</p>
      </Card>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <h3 className="text-subsection-title text-textMain">{t("report.title")}</h3>
        <p className="mt-3 text-base leading-relaxed text-gray-700">{report.summary}</p>
      </Card>

      <section aria-labelledby="fit-requirements-heading">
        <h3 id="fit-requirements-heading" className="text-subsection-title text-textMain mb-4">
          {t("report.requirementsTitle")}
        </h3>
        <ul className="space-y-4">
          {report.requirements.map((requirement) => (
            <li key={requirement.requirement}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-base font-bold text-textMain">{requirement.requirement}</p>
                  <span
                    className={mergeClasses(
                      "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide",
                      VERDICT_STYLES[requirement.verdict]
                    )}
                  >
                    {t(`report.verdicts.${requirement.verdict}`)}
                  </span>
                </div>
                <p className="mt-2 text-base leading-relaxed text-gray-700">{requirement.note}</p>
                {requirement.engagements.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                    <span className="font-semibold">{t("report.evidenceLabel")}</span>
                    {requirement.engagements.map((engagement) => (
                      <Link
                        key={engagement.id}
                        href={`/experience/${engagement.id}`}
                        className="inline-flex min-h-6 items-center rounded-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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

      {report.technologies.length > 0 && (
        <section aria-labelledby="fit-technologies-heading">
          <h3 id="fit-technologies-heading" className="text-subsection-title text-textMain mb-4">
            {t("report.technologiesTitle")}
          </h3>
          <Card>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {report.technologies.map((technology) => (
                <li key={technology.name} className="flex items-baseline justify-between gap-4">
                  <span className="text-base text-textMain">{technology.name}</span>
                  <span className="text-base font-bold text-primary">
                    {t("report.years", { years: technology.years })}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <Card className="bg-bgLight">
        <h3 className="text-subsection-title text-textMain">{t("report.bookTitle")}</h3>
        <p className="mt-2 mb-5 text-base leading-relaxed text-gray-700">{t("report.bookText")}</p>
        <Button href="/book" variant="primary" size="lg" data-placement="fit-report">
          {t("report.bookButton")}
        </Button>
      </Card>
    </div>
  );
};
