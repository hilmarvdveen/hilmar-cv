import { useTranslation } from "next-i18next";
import { workHistory } from "../../public/data/workHistory";
import {
  MapPinIcon,
  GlobeAltIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";

export const WorkExperienceSection = () => {
  const { t } = useTranslation("work");

  return (
    <section className=" bg-gray-50">
      <div className="container max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">
          {t("sectionTitle", "Werkervaring")}
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {workHistory.map((entry) => (
            <div
              key={`${entry.company}-${entry.from}`}
              className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={`/logos/${entry.logo}`}
                  alt={`${entry.company} logo`}
                  className="w-30 h-10 mr-4 object-contain rounded"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {entry.company}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {entry.from} – {entry.to}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {entry.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GlobeAltIcon className="w-4 h-4" />
                  {t(entry.mode)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <LanguageIcon className="w-4 h-4" />
                  {t(entry.language)}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">{t("role", "Rol")}:</span>{" "}
                {entry.role}
              </p>

              <div className="flex flex-wrap gap-2 text-sm mb-4">
                <span className="font-semibold w-full">
                  {t("technologies", "Technieken")}:
                </span>
                {entry.tech.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium"
                  >
                    {t(tech)}
                  </span>
                ))}
              </div>

              {entry.description.heading && (
                <p className="text-md font-semibold text-gray-900 mb-2">
                  {entry.description.heading}
                </p>
              )}
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                {entry.description.body.map((section, idx) => (
                  <div key={idx}>
                    <p className="font-semibold mb-1">{section.title}</p>
                    <p>{section.paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
