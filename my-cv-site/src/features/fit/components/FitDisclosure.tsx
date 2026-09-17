import { useTranslations } from "next-intl";
import { Card } from "@/components/Card";
import { Link } from "@/i18n/navigation";

export const FitDisclosure = () => {
  const t = useTranslations("fit");

  return (
    <Card variant="tinted" className="max-w-2xl">
      <p className="text-sm font-semibold text-textMain">{t("disclosure.title")}</p>
      <p className="mt-2 text-base leading-relaxed text-gray-700">{t("disclosure.assistant")}</p>
      <p className="mt-2 text-base leading-relaxed text-gray-700">{t("disclosure.processing")}</p>
      <p className="mt-2 text-base leading-relaxed text-gray-700">{t("disclosure.register")}</p>
      <p className="mt-4 text-base leading-relaxed text-gray-700">
        {t("hero.note")}{" "}
        <Link
          href="/book"
          data-placement="fit-hero"
          className="inline-flex min-h-6 items-center rounded-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {t("hero.noteLink")}
        </Link>
      </p>
    </Card>
  );
};
