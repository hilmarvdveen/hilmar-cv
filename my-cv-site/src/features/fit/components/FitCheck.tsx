"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useHoneypot } from "@/hooks/useHoneypot";
import {
  FIT_LIMITS,
  countFitVerdicts,
  isDailyCapRetry,
  readFitRefusalReason,
  retryAfterSecondsFromBody,
  trackFitEvent,
  turnstileTokenFrom,
  type FitReport as FitReportData,
} from "@/lib/fit/client";
import { FitVacancyForm, type FitCheckFailure } from "./FitVacancyForm";
import { FitReport } from "./FitReport";
import { FitQuestion } from "./FitQuestion";
import { FitCvCard } from "./FitCvCard";
import { FitBooking } from "./FitBooking";

const readResponseBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

type FitCheckProps = {
  heading: string;
  intro: string;
  disclosure: ReactNode;
  turnstileSiteKey?: string;
};

export const FitCheck = ({ heading, intro, disclosure, turnstileSiteKey }: FitCheckProps) => {
  const t = useTranslations("fit.check");
  const locale = useLocale();
  const honeypot = useHoneypot();

  const [vacancy, setVacancy] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [report, setReport] = useState<FitReportData | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [failure, setFailure] = useState<FitCheckFailure | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const firstChangeAt = useRef<number | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (report) resultHeadingRef.current?.focus();
  }, [report]);

  const handleVacancyChange = (value: string) => {
    if (firstChangeAt.current === null) firstChangeAt.current = Date.now();
    setVacancy(value);
  };

  const refusalFailure = (body: unknown): FitCheckFailure => {
    const reason = readFitRefusalReason(body) ?? "notAVacancy";
    return { message: t(`errors.reasons.${reason}`), recoverable: true };
  };

  const rateLimitFailure = (body: unknown): FitCheckFailure => {
    const retryAfterSeconds = retryAfterSecondsFromBody(body);
    return {
      message: isDailyCapRetry(retryAfterSeconds)
        ? t("errors.capReached")
        : t("errors.rateLimited"),
      recoverable: false,
    };
  };

  const failureFor = async (response: Response): Promise<FitCheckFailure> => {
    if (response.status === 422) return refusalFailure(await readResponseBody(response));
    if (response.status === 429) return rateLimitFailure(await readResponseBody(response));
    return { message: t("errors.failed"), recoverable: false };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isChecking) return;

    const turnstileToken = turnstileTokenFrom(event.currentTarget as HTMLFormElement);
    const trimmed = vacancy.trim();
    if (trimmed.length < FIT_LIMITS.vacancyMinimum) {
      setFailure({ message: t("errors.reasons.tooShort"), recoverable: true });
      return;
    }

    setIsChecking(true);
    setFailure(null);
    setStatusMessage(t("status.checking"));
    trackFitEvent("fit_submitted", { characters: trimmed.length });

    try {
      const response = await fetch("/api/fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vacancy: trimmed,
          locale,
          turnstileToken,
          ...honeypot.payload(),
          formStartedAt: firstChangeAt.current ?? Date.now(),
        }),
      });

      if (!response.ok) {
        trackFitEvent("fit_failed", { status: response.status });
        setFailure(await failureFor(response));
        setStatusMessage("");
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
      setStatusMessage(t("status.ready"));
    } catch {
      trackFitEvent("fit_failed", { status: 0 });
      setFailure({ message: t("errors.failed"), recoverable: false });
      setStatusMessage("");
    } finally {
      setIsChecking(false);
    }
  };

  const offersTailoredCv = sessionId !== "" && (report?.requirements.length ?? 0) > 0;

  return (
    <div>
      <FitVacancyForm
        heading={heading}
        intro={intro}
        vacancy={vacancy}
        onVacancyChange={handleVacancyChange}
        onSubmit={handleSubmit}
        isChecking={isChecking}
        failure={failure}
        honeypotValue={honeypot.value}
        onHoneypotChange={honeypot.setValue}
        turnstileSiteKey={turnstileSiteKey}
      />

      <div className="mt-8">{disclosure}</div>

      <p role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </p>

      {report && !isChecking && (
        <>
          <FitReport
            report={report}
            sessionId={sessionId}
            headingRef={resultHeadingRef}
            nextStepsNote={offersTailoredCv ? t("report.nextSteps") : undefined}
          />
          {sessionId && (
            <FitQuestion sessionId={sessionId} turnstileSiteKey={turnstileSiteKey} />
          )}
          {offersTailoredCv && <FitCvCard sessionId={sessionId} onSent={setStatusMessage} />}
          <FitBooking />
        </>
      )}
    </div>
  );
};
