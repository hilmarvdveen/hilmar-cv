import { useTranslation } from "next-i18next";
import { SectionTitle } from "./SectionTitle";

export const ProjectHighlightsSection = () => {
  const { t } = useTranslation("home");

  const highlights = [
    {
      title: "Belastingdienst – CANVAS Formuliereneditor",
      description:
        "Low-code formulierbouwer met dynamische configuratie, meertalige content en visuele drag-and-drop interface voor redacteuren.",
      tech: ["React", "TypeScript", "Stencil", "MySQL"],
    },
    {
      title: "Nationale Postcode Loterij – Design System",
      description:
        "Internationaal design system gebouwd in Next.js en Tailwind voor marketingcampagnes, inclusief headless CMS en SVG-animaties.",
      tech: ["Next.js", "Tailwind CSS", "React", "AWS Lambda"],
    },
    {
      title: "Athlon – Migratie & Herbouw",
      description:
        "Herbouw van Angular 1.6-applicatie naar moderne stack met RxJS, WCAG-compliance en configuratiegestuurde formulieren.",
      tech: ["Angular", "RxJS", "SCSS", ".NET Core"],
    },
  ];

  return (
    <section className="py-10 bg-white text-textMain">
      <SectionTitle title={t("projects.title", "Project Highlights")} />

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {highlights.map((project, i) => (
          <div
            key={i}
            className="bg-bgLight p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold text-primary mb-2">
              {project.title}
            </h3>
            <p className="text-textMuted text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <ul className="flex flex-wrap gap-2 text-xs text-textMuted">
              {project.tech.map((tech, idx) => (
                <li
                  key={idx}
                  className="px-2 py-0.5 border border-gray-300 rounded"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
