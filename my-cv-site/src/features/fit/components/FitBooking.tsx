"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export const FitBooking = () => {
  const t = useTranslations("fit.check");

  return (
    <Card variant="tinted" className="mt-8">
      <h2 className="text-subsection-title text-textMain">{t("report.bookTitle")}</h2>
      <p className="mt-2 mb-5 text-base leading-relaxed text-gray-700">{t("report.bookText")}</p>
      <Button
        href="/book"
        variant="primary"
        size="lg"
        data-placement="fit-report"
        className="w-full sm:w-auto"
      >
        {t("report.bookButton")}
      </Button>
    </Card>
  );
};
