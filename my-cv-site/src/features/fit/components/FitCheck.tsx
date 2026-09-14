"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useHoneypot } from "@/hooks/useHoneypot";
import {
  FIT_LIMITS,
  countFitVerdicts,
  trackFitEvent,
  type FitReport as FitReportData,
} from "@/lib/fit";
import { FitVacancyForm } from "./FitVacancyForm";
import { FitReport } from "./FitReport";
import { FitQuestion } from "./FitQuestion";

type FitCheckStatus = "idle" | "checking" | "done" | "failed";

export const FitCheck = () => {
  const t = useTranslations("fit.check");
  const locale = useLocale();
  const honeypot = useHoneypot();

  const [vacancy, setVacancy] = useState("");
  const [status, setStatus] = useState<FitCheckStatus>("idle");
  const [report, setReport] = useState<FitReportData | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = vacancy.trim();

    if (trimmed.length < FIT_LIMITS.vacancyMinimum) {
      setStatus("failed");
      setErrorMessage(t("errors.tooShort"));
      return;
    }

    setStatus("checking");
    setErrorMessage("");
    trackFitEvent("fit_submitted", { characters: trimmed.length });

    try {
      const response = await fetch("/api/fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vacancy: trimmed, locale, ...honeypot.payload() }),
      });

      if (!response.ok) {
        trackFitEvent("fit_failed", { status: response.status });
        setStatus("failed");
        setErrorMessage(
          response.status === 429 ? t("errors.rateLimited") : t("errors.failed")
        );
        return;
      }

      const data = (await response.json()) as { report: FitReportData; sessionId: string };
      const counts = countFitVerdicts(data.report);
      trackFitEvent("fit_completed", {
        requirements: data.report.requirements.length,
        inRecord: counts.inRecord,
        partly: counts.partly,
        notInRecord: counts.notInRecord,
      });
      setReport(data.report);
      setSessionId(data.sessionId);
      setStatus("done");
    } catch {
      trackFitEvent("fit_failed", { status: 0 });
      setStatus("failed");
      setErrorMessage(t("errors.failed"));
    }
  };

  return (
    <div>
      <FitVacancyForm
        vacancy={vacancy}
        onVacancyChange={setVacancy}
        onSubmit={handleSubmit}
        isChecking={status === "checking"}
        errorMessage={errorMessage}
        honeypotValue={honeypot.value}
        onHoneypotChange={honeypot.setValue}
      />

      {status === "done" && report && <FitReport report={report} />}
      {status === "done" && report && sessionId && <FitQuestion sessionId={sessionId} />}
    </div>
  );
};
