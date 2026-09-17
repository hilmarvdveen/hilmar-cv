import { Language, Tech, WorkMode } from "./workHistory";

export type OwnWorkEntry = {
  id: string;
  name: string;
  url: string;
  from: string;
  location: string;
  mode: WorkMode;
  language: Language;
  tech: Tech[];
};

export const ownWork: OwnWorkEntry[] = [
  {
    id: "own-platform",
    name: "hilmarvanderveen.com",
    url: "/",
    from: "2025-05",
    location: "Zandvoort",
    mode: WorkMode.Remote,
    language: Language.Dutch,
    tech: [
      Tech.NextJS,
      Tech.React,
      Tech.TypeScript,
      Tech.NodeJS,
      Tech.TailwindCSS,
      Tech.MicrosoftGraph,
      Tech.OAuth2,
      Tech.ContentSecurityPolicy,
      Tech.WCAG22,
      Tech.Vitest,
      Tech.ReactTestingLibrary,
      Tech.ESLint,
      Tech.Vercel,
      Tech.GitHub,
      Tech.CodingAgents,
    ],
  },
  {
    id: "reference-repository",
    name: "Zappy Mart",
    url: "/blog",
    from: "2026-09",
    location: "Zandvoort",
    mode: WorkMode.Remote,
    language: Language.English,
    tech: [
      Tech.CSharp,
      Tech.DotNet10,
      Tech.AspNetCore,
      Tech.Java25,
      Tech.Kotlin,
      Tech.SpringBoot,
      Tech.NodeJS,
      Tech.GraphQL,
      Tech.ApolloServer,
      Tech.ApolloFederation,
      Tech.React,
      Tech.ReactRouter,
      Tech.NextJS,
      Tech.Angular,
      Tech.TypeScript,
      Tech.Playwright,
      Tech.GitHubActions,
      Tech.CICDPipelines,
      Tech.CodingAgents,
    ],
  },
  {
    id: "vacancy-fit",
    name: "Vacancy fit check",
    url: "/fit",
    from: "2026-09",
    location: "Zandvoort",
    mode: WorkMode.Remote,
    language: Language.English,
    tech: [
      Tech.ArtificialIntelligenceAgents,
      Tech.LanguageModelIntegration,
      Tech.AzureOpenAI,
      Tech.ModelContextProtocolServer,
      Tech.ModelContextProtocolClient,
      Tech.TextToSql,
      Tech.TypeScript,
      Tech.NodeJS,
      Tech.Express,
      Tech.PostgreSQL,
      Tech.MongoDB,
      Tech.Terraform,
      Tech.Azure,
      Tech.AzureContainerApps,
      Tech.AzureKeyVault,
      Tech.Docker,
      Tech.Linux,
      Tech.GitHubActions,
      Tech.CICDPipelines,
      Tech.Vitest,
      Tech.CodingAgents,
    ],
  },
];
