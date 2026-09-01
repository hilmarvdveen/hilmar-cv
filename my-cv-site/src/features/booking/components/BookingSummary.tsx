"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Card } from "@/components/Card";
import { formatLongDate, formatSlotTime } from "@/lib/booking";
import type { BookingDetails } from "../context/BookingFormContext";

type BookingSummaryProps = {
  details: BookingDetails;
  compact?: boolean;
};

export const BookingSummary = ({ details, compact = false }: BookingSummaryProps) => {
  const t = useTranslations("booking.summary");
  const locale = useLocale();
  const expectations = t.raw("expectations") as string[];
  const practical = t.raw("practical") as string[];

  const whenText =
    details.date && details.time
      ? `${formatLongDate(details.date, locale)}, ${formatSlotTime(details.time)}`
      : null;
  const whoText = details.name
    ? [details.name, details.company].filter(Boolean).join(", ")
    : null;

  return (
    <div className="space-y-4">
      {!compact && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-textMain">{t("title")}</h3>
          <dl className="mt-4 space-y-4">
            <SummaryRow
              label={t("when")}
              value={whenText}
              placeholder={t("whenEmpty")}
            />
            <SummaryRow label={t("who")} value={whoText} placeholder={t("whoEmpty")} />
            <SummaryRow
              label={t("topic")}
              value={details.topic || null}
              placeholder={t("topicEmpty")}
            />
          </dl>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-base font-bold text-textMain">{t("expectTitle")}</h3>
        <ul className="mt-3 space-y-2.5">
          {expectations.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-600">
              <Check
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
              />
              {item}
            </li>
          ))}
        </ul>
        <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-gray-500">
          {t("practicalTitle")}
        </h4>
        <ul className="mt-2.5 space-y-2">
          {practical.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-600">
              <Check
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-gray-600">
          {t("alternativeLead")}{" "}
          <a
            href="mailto:hilmar@hilmarvanderveen.com"
            className="font-semibold text-primary underline underline-offset-4"
          >
            hilmar@hilmarvanderveen.com
          </a>{" "}
          {t("alternativeOr")}{" "}
          <a
            href="tel:+31680149947"
            className="font-semibold text-primary underline underline-offset-4 whitespace-nowrap"
          >
            +31 6 8014 9947
          </a>
        </p>
        <p className="mt-3 text-xs text-gray-500">{t("privacy")}</p>
      </Card>
    </div>
  );
};

type SummaryRowProps = {
  label: string;
  value: string | null;
  placeholder: string;
};

const SummaryRow = ({ label, value, placeholder }: SummaryRowProps) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </dt>
    <dd
      className={`mt-0.5 text-sm ${
        value ? "font-semibold text-textMain" : "text-gray-400"
      }`}
    >
      {value ?? placeholder}
    </dd>
  </div>
);
