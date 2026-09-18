"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { mergeClasses } from "@/lib/mergeClasses";
import {
  FIT_JOB_LONG_RUN_SECONDS,
  FIT_JOB_PHASES,
  FIT_JOB_VERY_LONG_RUN_SECONDS,
  type FitJobPhase,
} from "@/lib/fit/job";

export const FIT_WAITING_EXCERPT_LENGTH = 140;
export const FIT_WAITING_VERB_SECONDS = 5;

const SECONDS_IN_A_MINUTE = 60;

type FitWaitingPanelProps = {
  phase: FitJobPhase;
  toolCalls: number;
  elapsedSeconds: number;
  vacancyExcerpt: string;
};

const segmentClasses = (position: number, current: number): string => {
  if (position < current) return "bg-emerald-600";
  if (position === current) {
    return "bg-emerald-600/40 animate-pulse motion-reduce:animate-none";
  }
  return "bg-gray-200";
};

export const FitWaitingPanel = ({
  phase,
  toolCalls,
  elapsedSeconds,
  vacancyExcerpt,
}: FitWaitingPanelProps) => {
  const t = useTranslations("fit.check.progress");
  const bookLabel = useTranslations("fit.check.report")("bookButton");
  const headingId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();

  const current = FIT_JOB_PHASES.indexOf(phase);
  const verbs = Object.values(t.raw(`phases.${phase}`) as Record<string, string>);
  const verbPosition = prefersReducedMotion
    ? 0
    : Math.floor(elapsedSeconds / FIT_WAITING_VERB_SECONDS) % verbs.length;
  const minutes = Math.floor(elapsedSeconds / SECONDS_IN_A_MINUTE);
  const seconds = elapsedSeconds % SECONDS_IN_A_MINUTE;
  const isLong = elapsedSeconds >= FIT_JOB_LONG_RUN_SECONDS;
  const isVeryLong = elapsedSeconds >= FIT_JOB_VERY_LONG_RUN_SECONDS;

  return (
    <Card className="min-h-[14rem] p-4 sm:p-6" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-subsection-title text-textMain">
        {t("title")}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-gray-600">{t("intro")}</p>

      {vacancyExcerpt && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{vacancyExcerpt}</p>
      )}

      <div className="mt-5 flex gap-1.5" aria-hidden="true">
        {FIT_JOB_PHASES.map((known, position) => (
          <span
            key={known}
            className={mergeClasses("h-1.5 flex-1 rounded-full", segmentClasses(position, current))}
          />
        ))}
      </div>

      <p className="mt-4 text-base font-semibold text-textMain" aria-hidden="true">
        {verbs[verbPosition]}
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {isLong ? t("announceStillRunning") : t("announceStart")}
      </p>

      <p className="mt-1 text-sm tabular-nums text-gray-600">
        {minutes > 0 ? t("elapsedMinutes", { minutes, seconds }) : t("elapsedSeconds", { seconds })}
        {toolCalls > 0 && <> · {t("lookups", { count: toolCalls })}</>}
      </p>

      {isLong && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          {isVeryLong ? t("takingLong") : t("stillRunning")}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/experience"
          data-placement="fit-waiting-browse"
          className="inline-flex min-h-6 items-center rounded-sm text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {t("keepBrowsing")}
        </Link>
        {isVeryLong && (
          <Button
            href="/book"
            variant="primary"
            size="md"
            data-placement="fit-waiting-book"
            className="w-full sm:w-auto"
          >
            {bookLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
