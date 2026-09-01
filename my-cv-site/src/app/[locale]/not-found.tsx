import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-6xl font-bold text-emerald-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{t("title")}</h1>
      <p className="mt-3 max-w-md text-gray-600">{t("description")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="primary" size="md" className="rounded-xl">
          {t("backHome")}
        </Button>
        <Button href="/contact" variant="outline" size="md" className="rounded-xl">
          {t("contact")}
        </Button>
      </div>
    </section>
  );
}
