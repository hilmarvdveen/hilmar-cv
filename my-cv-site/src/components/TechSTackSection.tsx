"use client";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./SectionTitle";
import { Tech } from "../data/workHistory";

export const TechStackSection = () => {
  const tHome = useTranslations("home");
  const tWork = useTranslations("work"); // if you ever need it

  const stackGroups = [
    {
      label: tHome("tech.frontend", { defaultValue: "Frontend" }),
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
      label: tHome("tech.backend", { defaultValue: "Backend & API" }),
      items: [
        Tech.CSharp,
        Tech.DotNetCore,
        Tech.AspNetMVC,
        Tech.Java8,
        Tech.NodeJS,
        Tech.Express,
        Tech.REST,
        Tech.OpenAPI,
        Tech.JWT,
        Tech.GraphQL,
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
      label: tHome("tech.architecture", {
        defaultValue: "Architectuur & Patterns",
      }),
      items: [
        Tech.MonoreposNx,
        Tech.CleanArchitecture,
        Tech.DomainDrivenDesign,
        Tech.CQRS,
        Tech.EventDrivenDesign,
        Tech.Microservices,
        Tech.ConfigurationDrivenUI,
        Tech.DataDrivenUI,
        Tech.SSRSSG,
      ],
    },
    {
      label: tHome("tech.devops", { defaultValue: "Tooling & DevOps" }),
      items: [
        Tech.Git,
        Tech.Gitlab,
        Tech.Gitlabs,
        Tech.GitHubActions,
        Tech.Bitbucket,
        Tech.AzureDevOps,
        Tech.CICDPipelines,
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
      label: tHome("tech.testing", { defaultValue: "Testing" }),
      items: [
        Tech.Jest,
        Tech.ReactTestingLibrary,
        Tech.Playwright,
        Tech.Cypress,
        Tech.Vitest,
        Tech.IntegrationTesting,
        Tech.xUnit,
      ],
    },
    {
      label: tHome("tech.databases", { defaultValue: "Databases" }),
      items: [
        Tech.PostgreSQL,
        Tech.MSSQL,
        Tech.MySQL,
        Tech.AzureCosmosDB,
        Tech.Neo4J,
        Tech.SQLServer,
      ],
    },
    {
      label: tHome("tech.platforms", { defaultValue: "Platforms & Cloud" }),
      items: [
        Tech.Azure,
        Tech.AzureCloud,
        Tech.Vercel,
        Tech.Netlify,
        Tech.Firebase,
        Tech.AWSLambda,
        Tech.Kubernetes,
      ],
    },
  ];

  return (
    <section className="py-10 bg-bgLight text-textMain">
      <SectionTitle title={tHome("tech.title")} />
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
                  {tWork(item) || item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
