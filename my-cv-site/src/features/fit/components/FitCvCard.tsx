"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HoneypotField } from "@/components/HoneypotField";
import { Link } from "@/i18n/navigation";
import { useHoneypot } from "@/hooks/useHoneypot";
import { LIMITS, isValidEmail } from "@/lib/security";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { trackFitEvent } from "@/lib/fit/client";

const NAME_FIELD_ID = "fit-cv-name";
const EMAIL_FIELD_ID = "fit-cv-email";
const ORGANISATION_FIELD_ID = "fit-cv-organisation";
const NAME_ERROR_ID = "fit-cv-name-error";
const EMAIL_ERROR_ID = "fit-cv-email-error";
const FAILURE_ID = "fit-cv-failure";

const FIELD_CLASS =
  "w-full rounded-lg border border-gray-500 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

const LABEL_CLASS = "block text-sm font-semibold text-gray-900 mb-2";

const ERROR_CLASS = "mt-2 text-sm font-semibold text-red-800";

const INLINE_LINK_CLASS =
  "inline-flex min-h-6 items-center rounded-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

type FitCvCardProps = {
  sessionId: string;
  onSent: (sentMessage: string) => void;
};

type FitCvErrors = {
  name?: string;
  email?: string;
};

export const FitCvCard = ({ sessionId, onSent }: FitCvCardProps) => {
  const t = useTranslations("fit.cv");
  const locale = useLocale();
  const honeypot = useHoneypot();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [errors, setErrors] = useState<FitCvErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [failureMessage, setFailureMessage] = useState("");

  const sentHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (sentTo) sentHeadingRef.current?.focus();
  }, [sentTo]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSending) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const nextErrors: FitCvErrors = {};
    if (trimmedName === "") nextErrors.name = t("errors.name");
    if (!isValidEmail(trimmedEmail)) nextErrors.email = t("errors.email");
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email) return;

    setIsSending(true);
    setFailureMessage("");

    try {
      const response = await fetch("/api/fit/cv-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: trimmedName,
          email: trimmedEmail,
          organisation: organisation.trim(),
          locale,
          ...honeypot.payload(),
        }),
      });

      if (!response.ok) {
        trackFitEvent("fit_cv_failed", { status: response.status });
        setFailureMessage(
          response.status === 429 ? t("errors.rateLimited") : t("errors.failed")
        );
        return;
      }

      trackFitEvent("fit_cv_requested");
      setSentTo(trimmedEmail);
      onSent(t("sentText", { email: trimmedEmail }));
    } catch {
      trackFitEvent("fit_cv_failed", { status: 0 });
      setFailureMessage(t("errors.failed"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="mt-8">
      {sentTo ? (
        <div className="flex items-start gap-3">
          <MailCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h3
              ref={sentHeadingRef}
              tabIndex={-1}
              className="text-subsection-title text-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {t("sentTitle")}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-gray-700">
              {t("sentText", { email: sentTo })}
            </p>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-subsection-title text-textMain">{t("title")}</h3>
          <p className="mt-2 text-base leading-relaxed text-gray-700">{t("intro")}</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" aria-busy={isSending} noValidate>
            <HoneypotField value={honeypot.value} onChange={honeypot.setValue} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={NAME_FIELD_ID} className={LABEL_CLASS}>
                  {t("nameLabel")}
                </label>
                <input
                  id={NAME_FIELD_ID}
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={LIMITS.name}
                  className={FIELD_CLASS}
                  required
                  aria-required="true"
                  aria-invalid={errors.name !== undefined}
                  aria-describedby={errors.name === undefined ? undefined : NAME_ERROR_ID}
                />
                {errors.name && (
                  <p id={NAME_ERROR_ID} role="alert" className={ERROR_CLASS}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={EMAIL_FIELD_ID} className={LABEL_CLASS}>
                  {t("emailLabel")}
                </label>
                <input
                  id={EMAIL_FIELD_ID}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={LIMITS.email}
                  className={FIELD_CLASS}
                  required
                  aria-required="true"
                  aria-invalid={errors.email !== undefined}
                  aria-describedby={errors.email === undefined ? undefined : EMAIL_ERROR_ID}
                />
                {errors.email && (
                  <p id={EMAIL_ERROR_ID} role="alert" className={ERROR_CLASS}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={ORGANISATION_FIELD_ID} className={LABEL_CLASS}>
                {t("organisationLabel")}
              </label>
              <input
                id={ORGANISATION_FIELD_ID}
                name="organisation"
                type="text"
                value={organisation}
                onChange={(event) => setOrganisation(event.target.value)}
                maxLength={LIMITS.subjectLike}
                className={FIELD_CLASS}
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              size="md"
              aria-disabled={isSending}
              className="w-full sm:w-auto"
            >
              {isSending ? (
                <>
                  <Loader2
                    className="h-5 w-5 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {t("sending")}
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  {t("submit")}
                </>
              )}
            </Button>

            <p className="text-sm leading-relaxed text-gray-600">
              {t("privacyNote")}{" "}
              <Link href="/privacy" className={INLINE_LINK_CLASS}>
                {t("privacyLink")}
              </Link>
            </p>

            {failureMessage && (
              <p
                id={FAILURE_ID}
                role="alert"
                className="rounded-xl border-2 border-red-200 bg-red-50 px-5 py-4 text-red-800"
              >
                {failureMessage}{" "}
                <a
                  href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
                  data-placement="fit-cv-mail"
                  className={INLINE_LINK_CLASS}
                >
                  {t("mailAction")}
                </a>
              </p>
            )}
          </form>
        </>
      )}
    </Card>
  );
};
