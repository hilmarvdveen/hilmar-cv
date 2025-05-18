import { useTranslation } from "next-i18next";
import { SectionTitle } from "./SectionTitle";
import { Icon, IconName } from "./Icon";

const iconNames: IconName[] = [
  "idea",
  "ai",
  "design",
  "integration",
  "mentorship",
  "scale",
];

export const UspSection = () => {
  const { t } = useTranslation("home");

  return (
    <section className="py-16 bg-bgLight text-textMain">
      <SectionTitle title={t("usp.title")} />
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {iconNames.map((iconName, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon name={iconName} className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-primary">
                {t(`usp.items.${i}.title`)}
              </h3>
            </div>
            <p className="text-textMuted leading-relaxed">
              {t(`usp.items.${i}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
