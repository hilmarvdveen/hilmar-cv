import { useTranslation } from "next-i18next";
import { workHistory } from "../../public/data/workHistory";
import Image from "next/image";
import {
  MapPinIcon,
  GlobeAltIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { TranslatedWorkEntry } from "@/models/TranslatedWorkEntry.model";

export const WorkExperienceSection = () => {
  const { t } = useTranslation("work");

  return (
    <section className="bg-gray-50">
      <div className="container max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">
          {t("sectionTitle", "Werkervaring")}
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {workHistory.map((entry) => {
            const entryData = t(entry.id, {
              returnObjects: true,
            }) as TranslatedWorkEntry;

            const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(entry.color || "");

            return (
              <div
                key={`${entryData.company}-${entry.from}`}
                className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div
                    className="relative w-32 h-10 mr-4 rounded"
                    style={
                      isHexColor ? { backgroundColor: entry.color } : undefined
                    }
                  >
                    <Image
                      src={`/logos/${entry.logo}`}
                      alt={`${entry.company} logo`}
                      fill
                      className="object-contain rounded"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {entryData.company}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {entry.from} – {entry.to}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {entryData.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GlobeAltIcon className="w-4 h-4" />
                    {t(`${entryData.mode}`)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <LanguageIcon className="w-4 h-4" />
                    {t(`${entryData.language}`)}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">{t("role", "Rol")}:</span>{" "}
                  {entryData.role}
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

                {entryData.heading && (
                  <p className="text-md font-semibold text-gray-900 mb-2">
                    {entryData.heading}
                  </p>
                )}

                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  {entryData.body?.map(
                    (
                      section: { title: string; paragraph: string },
                      idx: number
                    ) => (
                      <div key={idx}>
                        <p className="font-semibold mb-1">{section.title}</p>
                        <p>{section.paragraph}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
