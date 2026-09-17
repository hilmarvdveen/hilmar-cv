"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";
import {
  FIT_LIMITS,
  TURNSTILE_TOKEN_FIELD,
  trackFitEvent,
  turnstileTokenFrom,
  type FitAnswer,
} from "@/lib/fit/client";

type FitQuestionProps = {
  sessionId: string;
  turnstileSiteKey?: string;
};

export const FitQuestion = ({ sessionId, turnstileSiteKey }: FitQuestionProps) => {
  const t = useTranslations("fit.check");
  const locale = useLocale();
  const questionFieldId = useId();
  const questionErrorId = useId();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<FitAnswer | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isAsking) return;

    const turnstileToken = turnstileTokenFrom(event.currentTarget as HTMLFormElement);
    const trimmed = question.trim();
    if (trimmed.length < FIT_LIMITS.questionMinimum) {
      setErrorMessage(t("question.errors.tooShort"));
      return;
    }

    setIsAsking(true);
    setErrorMessage("");
    setAnswer(null);
    trackFitEvent("fit_question_submitted", { characters: trimmed.length });

    try {
      const response = await fetch("/api/fit/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, sessionId, locale, turnstileToken }),
      });

      if (!response.ok) {
        trackFitEvent("fit_question_failed", { status: response.status });
        setErrorMessage(
          response.status === 429 ? t("question.errors.rateLimited") : t("question.errors.failed")
        );
        return;
      }

      const data = (await response.json()) as { answer: FitAnswer };
      trackFitEvent("fit_question_answered", { engagements: data.answer.engagements.length });
      setAnswer(data.answer);
    } catch {
      trackFitEvent("fit_question_failed", { status: 0 });
      setErrorMessage(t("question.errors.failed"));
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <Card className="mt-8">
      <h3 className="text-subsection-title text-textMain">{t("question.title")}</h3>
      <p className="mt-2 text-base leading-relaxed text-gray-700">{t("question.description")}</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" aria-busy={isAsking}>
        <div>
          <label
            htmlFor={questionFieldId}
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            {t("question.label")}
          </label>
          <textarea
            id={questionFieldId}
            name="question"
            rows={2}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={FIT_LIMITS.questionMaximum}
            placeholder={t("question.placeholder")}
            className="w-full resize-y rounded-lg border border-gray-500 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            required
            aria-required="true"
            aria-invalid={errorMessage !== ""}
            aria-describedby={errorMessage === "" ? undefined : questionErrorId}
          />
        </div>

        {turnstileSiteKey && (
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-response-field-name={TURNSTILE_TOKEN_FIELD}
          />
        )}

        <Button type="submit" variant="outline" size="md" aria-disabled={isAsking}>
          {isAsking ? (
            <>
              <Loader2
                className="h-5 w-5 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              {t("question.asking")}
            </>
          ) : (
            <>
              <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
              {t("question.submit")}
            </>
          )}
        </Button>
      </form>

      <div role="status" className="mt-5">
        {errorMessage && (
          <p
            id={questionErrorId}
            className="rounded-xl border-2 border-red-200 bg-red-50 px-5 py-4 text-red-800"
          >
            {errorMessage}
          </p>
        )}
        {answer && (
          <Card variant="tinted" className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {t("question.answerLabel")}
            </p>
            <p className="mt-2 text-base leading-relaxed text-gray-700">{answer.answer}</p>
            {answer.engagements.length > 0 && (
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                <span className="font-semibold">{t("report.evidenceLabel")}</span>
                {answer.engagements.map((engagement) => (
                  <Link
                    key={engagement.id}
                    href={`/experience/${engagement.id}`}
                    className="inline-flex min-h-6 items-center rounded-sm px-1 text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    data-placement="fit-answer-evidence"
                  >
                    {engagement.company}
                  </Link>
                ))}
              </p>
            )}
          </Card>
        )}
      </div>
    </Card>
  );
};
