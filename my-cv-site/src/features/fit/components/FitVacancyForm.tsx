"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HoneypotField } from "@/components/HoneypotField";
import { FIT_LIMITS } from "@/lib/fit";

const VACANCY_FIELD_ID = "fit-vacancy";

type FitVacancyFormProps = {
  vacancy: string;
  onVacancyChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  isChecking: boolean;
  errorMessage: string;
  honeypotValue: string;
  onHoneypotChange: (value: string) => void;
};

export const FitVacancyForm = ({
  vacancy,
  onVacancyChange,
  onSubmit,
  isChecking,
  errorMessage,
  honeypotValue,
  onHoneypotChange,
}: FitVacancyFormProps) => {
  const t = useTranslations("fit.check");

  return (
    <Card className="p-4 sm:p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <HoneypotField value={honeypotValue} onChange={onHoneypotChange} />

        <div>
          <label
            htmlFor={VACANCY_FIELD_ID}
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            {t("form.label")}
          </label>
          <p className="text-sm text-gray-600 mb-3">{t("form.hint")}</p>
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
          />
          <p className="mt-2 text-sm text-gray-600">
            {t("form.counter", {
              characters: vacancy.length,
              maximum: FIT_LIMITS.vacancyMaximum,
            })}
          </p>
        </div>

        {errorMessage && (
          <p
            className="rounded-xl border-2 border-red-200 bg-red-50 px-5 py-4 text-red-800"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isChecking || vacancy.trim().length === 0}
          className="w-full sm:w-auto"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              {t("form.checking")}
            </>
          ) : (
            <>
              <Search className="h-5 w-5" aria-hidden="true" />
              {t("form.submit")}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
