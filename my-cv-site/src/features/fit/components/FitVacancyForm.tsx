"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HoneypotField } from "@/components/HoneypotField";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { FIT_LIMITS, TURNSTILE_TOKEN_FIELD } from "@/lib/fit/client";

export const FIT_CHECK_HEADING_ID = "fit-check-heading";

const VACANCY_FIELD_ID = "fit-vacancy";
const HINT_ID = "fit-vacancy-hint";
const COUNTER_ID = "fit-vacancy-counter";
const CAP_NOTE_ID = "fit-vacancy-cap-note";
const FAILURE_ID = "fit-vacancy-failure";

export type FitCheckFailure = {
  message: string;
  recoverable: boolean;
};

type FitVacancyFormProps = {
  heading: string;
  intro: string;
  vacancy: string;
  onVacancyChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  isChecking: boolean;
  failure: FitCheckFailure | null;
  honeypotValue: string;
  onHoneypotChange: (value: string) => void;
  turnstileSiteKey?: string;
};

export const FitVacancyForm = ({
  heading,
  intro,
  vacancy,
  onVacancyChange,
  onSubmit,
  isChecking,
  failure,
  honeypotValue,
  onHoneypotChange,
  turnstileSiteKey,
}: FitVacancyFormProps) => {
  const t = useTranslations("fit.check");
  const failureRef = useRef<HTMLDivElement | null>(null);
  const hasReachedCap = vacancy.length >= FIT_LIMITS.vacancyMaximum;

  useEffect(() => {
    if (failure) failureRef.current?.focus();
  }, [failure]);

  const fieldDescription = [
    HINT_ID,
    COUNTER_ID,
    hasReachedCap ? CAP_NOTE_ID : null,
    failure ? FAILURE_ID : null,
  ]
    .filter((identifier) => identifier !== null)
    .join(" ");

  return (
    <Card className="p-4 sm:p-6">
      <h2 id={FIT_CHECK_HEADING_ID} className="text-subsection-title text-textMain">
        {heading}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-gray-600">{intro}</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4" aria-busy={isChecking} noValidate>
        <HoneypotField value={honeypotValue} onChange={onHoneypotChange} />

        <div>
          <label
            htmlFor={VACANCY_FIELD_ID}
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            {t("form.label")}
          </label>
          <p id={HINT_ID} className="text-sm text-gray-600 mb-3">
            {t("form.hint")}
          </p>
          <textarea
            id={VACANCY_FIELD_ID}
            name="vacancy"
            value={vacancy}
            onChange={(event) => onVacancyChange(event.target.value)}
            rows={10}
            maxLength={FIT_LIMITS.vacancyMaximum}
            placeholder={t("form.placeholder")}
            className="w-full resize-y rounded-lg border border-gray-500 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            required
            aria-required="true"
            aria-describedby={fieldDescription}
            aria-invalid={failure !== null}
          />
          <p id={COUNTER_ID} className="mt-2 text-sm text-gray-600">
            {t("form.counter", {
              characters: vacancy.length,
              minimum: FIT_LIMITS.vacancyMinimum,
              maximum: FIT_LIMITS.vacancyMaximum,
            })}
          </p>
          {hasReachedCap && (
            <p id={CAP_NOTE_ID} className="mt-1 text-sm leading-relaxed text-gray-700">
              {t("form.capNote")}
            </p>
          )}
        </div>

        {turnstileSiteKey && (
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-response-field-name={TURNSTILE_TOKEN_FIELD}
          />
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            aria-disabled={isChecking}
            className="w-full sm:w-auto"
          >
            {isChecking ? (
              <>
                <Loader2
                  className="h-5 w-5 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                {t("form.checking")}
              </>
            ) : (
              <>
                <Search className="h-5 w-5" aria-hidden="true" />
                {t("form.submit")}
              </>
            )}
          </Button>
        </div>

        {failure &&
          (failure.recoverable ? (
            <div
              id={FAILURE_ID}
              ref={failureRef}
              tabIndex={-1}
              className="rounded-xl border-2 border-red-200 bg-red-50 px-5 py-4 text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              role="alert"
            >
              <p>{failure.message}</p>
            </div>
          ) : (
            <div
              id={FAILURE_ID}
              ref={failureRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Card variant="tinted" className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-base leading-relaxed text-gray-700">{failure.message}</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                        {t("errors.retryAction")}
                      </Button>
                      <Button
                        href="/book"
                        variant="outline"
                        size="md"
                        data-placement="fit-failed"
                        className="w-full sm:w-auto"
                      >
                        {t("report.bookButton")}
                      </Button>
                      <a
                        href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
                        data-placement="fit-failed-mail"
                        className="inline-flex min-h-6 items-center rounded-sm text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                      >
                        {t("errors.mailAction")}
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
      </form>
    </Card>
  );
};
