import { useTranslation } from "next-i18next";
import { SectionTitle } from "./SectionTitle";

export const TechStackSection = () => {
  const { t } = useTranslation("home");

  const stackGroups = [
    {
      label: t("tech.frontend", "Frontend"),
      items: [
        "React",
        "Next.js",
        "Angular (2–18)",
        "Vue.js",
        "Tailwind CSS",
        "SCSS / BEM",
        "Stencil",
        "RxJS",
        "Web Components",
        "Storybook",
      ],
    },
    {
      label: t("tech.backend", "Backend & API"),
      items: [
        "C#",
        ".NET (Core, 6+)",
        "ASP.NET MVC",
        "Node.js",
        "Express",
        "REST",
        "GraphQL",
        "OpenAPI / Swagger",
        "CQRS",
        "MediatR",
      ],
    },
    {
      label: t("tech.architecture", "Architectuur & Patterns"),
      items: [
        "Monorepos (Nx)",
        "Clean Architecture",
        "Domain-Driven Design (DDD)",
        "CQRS",
        "Event-driven design",
        "Microservices",
        "SSR / SSG",
      ],
    },
    {
      label: t("tech.devops", "Tooling & DevOps"),
      items: [
        "Git",
        "GitHub Actions",
        "Azure DevOps",
        "Docker",
        "CI/CD pipelines",
        "Jenkins",
        "SonarQube",
        "ESLint / Prettier",
      ],
    },
    {
      label: t("tech.testing", "Testing"),
      items: [
        "Jest",
        "React Testing Library",
        "Playwright",
        "Cypress",
        "Vitest",
        "xUnit",
      ],
    },
    {
      label: t("tech.databases", "Databases"),
      items: ["PostgreSQL", "MSSQL", "MySQL", "Cosmos DB", "Neo4j"],
    },
    {
      label: t("tech.platforms", "Platforms & Cloud"),
      items: ["Azure", "Vercel", "Netlify", "Firebase"],
    },
  ];

  return (
    <section className="py-10 bg-bgLight text-textMain">
      <SectionTitle title={t("tech.title", "Tech Stack")} />
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {stackGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-primary font-semibold text-lg mb-4">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-3 text-sm text-textMuted">
              {group.items.map((item, i) => (
                <li
                  key={i}
                  className="px-3 py-1 border border-gray-300 rounded-full bg-white shadow-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
