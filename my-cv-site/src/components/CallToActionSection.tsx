import Link from "next/link";
import { useTranslation } from "next-i18next";

export const CallToActionSection = () => {
  const { t } = useTranslation("home");

  return (
    <section className="py-10 bg-sky-600 text-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {t("cta.title", "Klaar om samen te bouwen?")}
        </h2>
        <p className="text-lg mb-8">
          {t(
            "cta.subtitle",
            "Neem contact op en ontdek hoe ik jouw frontend naar het volgende niveau kan tillen."
          )}
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-white text-sky-600 font-semibold rounded hover:bg-gray-100 transition"
        >
          {t("cta.button", "Plan een kennismaking")}
        </Link>
      </div>
    </section>
  );
};
