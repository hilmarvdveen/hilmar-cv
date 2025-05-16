import { useTranslation } from "next-i18next";
import { SectionTitle } from "./SectionTitle";
import { Tech } from "../../public/data/workHistory";

export const TechStackSection = () => {
  const { t: tHome } = useTranslation("home");
  const { t: tWork } = useTranslation("work"); // if you ever need it

  const stackGroups = [
    {
      label: tHome("tech.frontend", "Frontend"),
      items: [
        Tech.HTML5,
        Tech.CSS3,
        Tech.SCSS,
        Tech.BEM,
        Tech.JavaScript,
        Tech.TypeScript,
        Tech.React,
        Tech.NextJS,
        Tech.Angular,
        Tech.AngularMaterial,
        Tech.Vue,
        Tech.TailwindCSS,
        Tech.Stencil,
        Tech.WebComponents,
        Tech.RxJS,
        Tech.Storybook,
        Tech.Redux,
        Tech.ReactQuery,
        Tech.Zustand,
        Tech.ReactRouter,
        Tech.ComponentDesign,
        Tech.SVG,
        Tech.UIKit,
      ],
    },
    {
      label: tHome("tech.backend", "Backend & API"),
      items: [
        Tech.CSharp,
        Tech.DotNetCore,
        Tech.AspNetMVC,
        Tech.Java8,
        "Node.js",
        "Express",
        Tech.REST,
        Tech.OpenAPI,
        Tech.JWT,
        "GraphQL",
        Tech.API,
        Tech.CQRS,
        Tech.MediatorPattern,
        Tech.MediatR,
        Tech.NHibernate,
        Tech.EntityFramework,
        Tech.AzureAppServices,
      ],
    },
    {
      label: tHome("tech.architecture", "Architectuur & Patterns"),
      items: [
        "Monorepos (Nx)",
        "Clean Architecture",
        "Domain-Driven Design (DDD)",
        Tech.CQRS,
        "Event-driven design",
        Tech.Microservices,
        Tech.ConfigurationDrivenUI,
        Tech.DataDrivenUI,
        "SSR / SSG",
      ],
    },
    {
      label: tHome("tech.devops", "Tooling & DevOps"),
      items: [
        Tech.Git,
        Tech.Gitlab,
        Tech.Gitlabs,
        "GitHub Actions",
        "Bitbucket",
        Tech.AzureDevOps,
        "CI/CD pipelines",
        Tech.Jenkins,
        Tech.Tekton,
        Tech.ArgoCD,
        Tech.Docker,
        Tech.SonarQube,
        Tech.SPLUNK,
        Tech.ESLint,
        Tech.TSLint,
        Tech.Prettier,
        Tech.Confluence,
        Tech.Jira,
        Tech.SourceTree,
        Tech.OctopusDeploy,
      ],
    },
    {
      label: tHome("tech.testing", "Testing"),
      items: [
        Tech.Jest,
        "React Testing Library",
        Tech.Playwright,
        Tech.Cypress,
        "Vitest",
        Tech.IntegrationTesting,
        Tech.xUnit,
      ],
    },
    {
      label: tHome("tech.databases", "Databases"),
      items: [
        "PostgreSQL",
        Tech.MSSQL,
        Tech.MySQL,
        Tech.AzureCosmosDB,
        Tech.Neo4J,
        Tech.SQLServer,
      ],
    },
    {
      label: tHome("tech.platforms", "Platforms & Cloud"),
      items: [
        Tech.Azure,
        Tech.AzureCloud,
        "Vercel",
        "Netlify",
        "Firebase",
        Tech.AWSLambda,
        Tech.Kubernetes,
      ],
    },
  ];

  return (
    <section className="py-10 bg-bgLight text-textMain">
      <SectionTitle title={tHome("tech.title", "Tech Stack")} />
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
                  {tWork(item)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
