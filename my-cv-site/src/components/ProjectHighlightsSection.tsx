import { useTranslation } from "next-i18next";
import { SectionTitle } from "./SectionTitle";

export const ProjectHighlightsSection = () => {
  const { t } = useTranslation("home");

  const highlights = [
    {
      title: t("projects.canvas.title"),
      description: t("projects.canvas.description"),
      tech: ["React", "TypeScript", "Angular", "Stencil", "MySQL", "JAVA"],
    },
    {
      title: t("projects.postcodeloterij.title"),
      description: t("projects.postcodeloterij.description"),
      tech: ["Next.js", "Tailwind CSS", "React", "AWS Lambda", "Gitlab CI"],
    },
    {
      title: t("projects.athlon.title", "Athlon – Migratie & Herbouw"),
      description: t("projects.athlon.description"),
      tech: ["Angular", "RxJS", "SCSS", "JAVA", "KeyCloak"],
    },
  ];

  return (
    <section className="py-16 bg-white text-textMain">
      <SectionTitle title={t("projects.title", "Project Highlights")} />

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {highlights.map((project, i) => (
          <div
            key={i}
            className="bg-bgLight border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-primary mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {project.description}
            </p>
            <ul className="flex flex-wrap gap-2 text-xs text-gray-600">
              {project.tech.map((tech, idx) => (
                <li
                  key={idx}
                  className="px-2 py-0.5 border border-gray-300 bg-white rounded"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-base text-textMuted max-w-3xl mx-auto px-6">
        {t(
          "projects.cta.text",
          "Bent u op zoek naar een ontwikkelaar die niet alleen bouwt, maar ook strategisch meedenkt over schaalbaarheid, snelheid en design? Iemand die UX, toegankelijkheid en samenwerking met business écht begrijpt?"
        )}
      </p>

      <div className="mt-6 text-center">
        <a
          href="/contact"
          className="mt-6 inline-block px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {t("projects.cta.button", "Neem contact op")}
        </a>
      </div>
    </section>
  );
};
