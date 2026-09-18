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
import { sanitizeJobId } from "@/lib/fit/job";
import {
  markFinishedFitJobAsSeen,
  showFinishedFitJob,
  startPendingFitJob,
} from "@/lib/fit/jobStore";
import { useFitJob } from "../hooks/useFitJob";
import { useTrackFitJobOutcome } from "../hooks/useTrackFitJobOutcome";
import { FitVacancyForm, type FitCheckFailure } from "./FitVacancyForm";
import { FitWaitingPanel, FIT_WAITING_EXCERPT_LENGTH } from "./FitWaitingPanel";
import { FitReport } from "./FitReport";
import { FitQuestion } from "./FitQuestion";
import { FitCvCard } from "./FitCvCard";
import { FitBooking } from "./FitBooking";

const HTTP_UNPROCESSABLE = 422;
const HTTP_BAD_REQUEST = 400;
const HTTP_TOO_MANY_REQUESTS = 429;

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

type StartAnswer = { jobId?: unknown; report?: FitReportData; sessionId?: string };

export const FitCheck = ({ heading, intro, disclosure, turnstileSiteKey }: FitCheckProps) => {
  const t = useTranslations("fit.check");
  const locale = useLocale();
  const honeypot = useHoneypot();
  const job = useFitJob(true);

  const [vacancy, setVacancy] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [startFailure, setStartFailure] = useState<FitCheckFailure | null>(null);
  const [cvStatusMessage, setCvStatusMessage] = useState("");

  const firstChangeAt = useRef<number | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const resultAwaitsFocus = useRef(false);

  const view = job.view;
  const result = job.standingResult;
  const isRunning = view.state === "running";

  useTrackFitJobOutcome(view, true, () => resultHeadingRef.current?.focus());

  useEffect(() => {
    if (result !== null && !result.seen) markFinishedFitJobAsSeen();
  }, [result]);

  useEffect(() => {
    if (result === null || !resultAwaitsFocus.current) return;
    resultAwaitsFocus.current = false;
    resultHeadingRef.current?.focus();
  }, [result]);

  const handleVacancyChange = (value: string) => {
    if (firstChangeAt.current === null) firstChangeAt.current = Date.now();
    setVacancy(value);
  };

  const refusalFailure = (body: unknown): FitCheckFailure => {
    const reason = readFitRefusalReason(body) ?? "notAVacancy";
    return { message: t(`errors.reasons.${reason}`), recoverable: true };
  };

  const rateLimitFailure = (retryAfterSeconds: number): FitCheckFailure => ({
    message: isDailyCapRetry(retryAfterSeconds) ? t("errors.capReached") : t("errors.rateLimited"),
    recoverable: false,
  });

  const failureFor = async (response: Response): Promise<FitCheckFailure> => {
    if (response.status === HTTP_UNPROCESSABLE) {
      return refusalFailure(await readResponseBody(response));
    }
    if (response.status === HTTP_TOO_MANY_REQUESTS) {
      return rateLimitFailure(retryAfterSecondsFromBody(await readResponseBody(response)));
    }
    return { message: t("errors.failed"), recoverable: false };
  };

  const jobFailure = (): FitCheckFailure | null => {
    if (view.state !== "failed") return null;
    if (view.status === HTTP_BAD_REQUEST && view.reason !== null) {
      return { message: t(`errors.reasons.${view.reason}`), recoverable: true };
    }
    if (view.status === HTTP_TOO_MANY_REQUESTS) return rateLimitFailure(view.retryAfterSeconds);
    return { message: t("errors.failed"), recoverable: false };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isStarting || isRunning) return;

    const turnstileToken = turnstileTokenFrom(event.currentTarget as HTMLFormElement);
    const trimmed = vacancy.trim();
    job.forgetFailure();
    if (trimmed.length < FIT_LIMITS.vacancyMinimum) {
      setStartFailure({ message: t("errors.reasons.tooShort"), recoverable: true });
      return;
    }

    setIsStarting(true);
    setStartFailure(null);
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
        setStartFailure(await failureFor(response));
        return;
      }

      const answer = (await response.json()) as StartAnswer;
      const jobId = sanitizeJobId(answer.jobId);
      if (jobId !== "") {
        startPendingFitJob({ jobId, startedAt: Date.now(), locale: locale === "en" ? "en" : "nl" });
        return;
      }

      if (answer.report) {
        const counts = countFitVerdicts(answer.report);
        trackFitEvent("fit_completed", {
          requirements: answer.report.requirements.length,
          inRecord: counts.inRecord,
          partly: counts.partly,
          notInRecord: counts.notInRecord,
        });
        resultAwaitsFocus.current = true;
        showFinishedFitJob({
          report: answer.report,
          sessionId: answer.sessionId ?? "",
          finishedAt: Date.now(),
          seen: true,
        });
      }
    } catch {
      trackFitEvent("fit_failed", { status: 0 });
      setStartFailure({ message: t("errors.failed"), recoverable: false });
    } finally {
      setIsStarting(false);
    }
  };

  const failure = startFailure ?? jobFailure();
  const offersTailoredCv =
    result !== null && result.sessionId !== "" && result.report.requirements.length > 0;
  const statusMessage = result !== null && !isRunning ? t("status.ready") : "";

  return (
    <div>
      {view.state === "running" ? (
        <FitWaitingPanel
          phase={view.phase}
          toolCalls={view.toolCalls}
          elapsedSeconds={view.elapsedSeconds}
          vacancyExcerpt={vacancy.trim().slice(0, FIT_WAITING_EXCERPT_LENGTH)}
        />
      ) : (
        <FitVacancyForm
          heading={heading}
          intro={intro}
          vacancy={vacancy}
          onVacancyChange={handleVacancyChange}
          onSubmit={handleSubmit}
          isChecking={isStarting}
          failure={failure}
          honeypotValue={honeypot.value}
          onHoneypotChange={honeypot.setValue}
          turnstileSiteKey={turnstileSiteKey}
        />
      )}

      <div className="mt-8">{disclosure}</div>

      <p role="status" aria-live="polite" className="sr-only">
        {cvStatusMessage || statusMessage}
      </p>

      {result !== null && (
        <>
          <FitReport
            key={result.sessionId}
            report={result.report}
            sessionId={result.sessionId}
            headingRef={resultHeadingRef}
            nextStepsNote={offersTailoredCv ? t("report.nextSteps") : undefined}
          />
          {result.sessionId && (
            <FitQuestion
              key={`question-${result.sessionId}`}
              sessionId={result.sessionId}
              turnstileSiteKey={turnstileSiteKey}
            />
          )}
          {offersTailoredCv && (
            <FitCvCard
              key={`cv-${result.sessionId}`}
              sessionId={result.sessionId}
              onSent={setCvStatusMessage}
            />
          )}
          <FitBooking />
        </>
      )}
    </div>
  );
};
