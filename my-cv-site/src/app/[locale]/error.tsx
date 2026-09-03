"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("error.title")}</h1>
      <p className="mt-3 max-w-md text-gray-600">{t("error.description")}</p>
      <Button
        onClick={reset}
        variant="primary"
        size="md"
        className="mt-8 rounded-xl"
      >
        {t("error.retry")}
      </Button>
    </section>
  );
}
