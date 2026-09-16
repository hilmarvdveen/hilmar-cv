"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { Card, type CardVariant } from "@/components/Card";

type FitBookingProps = {
  cardVariant?: CardVariant;
};

export const FitBooking = ({ cardVariant = "tinted" }: FitBookingProps) => {
  const t = useTranslations("fit.check");

  return (
    <Card variant={cardVariant} className="mt-8">
      <h2 className="text-subsection-title text-textMain">{t("report.bookTitle")}</h2>
      <p className="mt-2 mb-5 text-base leading-relaxed text-gray-700">{t("report.bookText")}</p>
      <Button
        href="/book"
        variant="primary"
        size="md"
        data-placement="fit-report"
        className="w-full sm:w-auto"
      >
        {t("report.bookButton")}
      </Button>
    </Card>
  );
};
