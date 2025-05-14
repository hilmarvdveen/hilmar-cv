import { useTranslation } from "next-i18next";
import { SectionTitle } from "./SectionTitle";

export const UspSection = () => {
  const { t } = useTranslation("home");

  return (
    <section className="py-10 bg-bgLight text-textMain">
      <SectionTitle title={t("usp.title")} />
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-primary mb-2">
              {t(`usp.items.${i}.title`)}
            </h3>
            <p className="text-textMuted leading-relaxed">
              {t(`usp.items.${i}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
