import type { Locale } from "@/lib/seo";

export type Pair = { en: string; nl: string };

export const pick = (pair: Pair, locale: Locale): string => pair[locale];

export const pickAll = (pairs: readonly Pair[], locale: Locale): string[] => pairs.map((pair) => pair[locale]);

const same = (text: string): Pair => ({ en: text, nl: text });

export const HEXAGON_LABELS = {
  caption: {
    en: "Dependencies point inward. Every port has an in-memory adapter and an Azure or Postgres adapter, and each host registers only what it needs.",
    nl: "Afhankelijkheden wijzen naar binnen. Elke poort heeft een in-memory adapter en een Azure- of Postgres-adapter, en elke host registreert alleen wat hij nodig heeft.",
  },
  ring: { en: "Application, use cases and 18 ports", nl: "Application, use cases en 18 ports" },
  domain: { en: "Domain", nl: "Domain" },
  inMemory: { en: "In memory", nl: "In memory" },
  inMemoryItems: [same("Stores"), same("Command channel"), same("Telemetry channel")],
  azure: { en: "Azure and Postgres", nl: "Azure en Postgres" },
  azureItems: [
    same("Postgres stores"),
    { en: "IoT Hub source and sender", nl: "IoT Hub source en sender" },
    { en: "Service Bus sender and receiver", nl: "Service Bus sender en receiver" },
    { en: "Energy-Charts and ENTSO-E prices", nl: "Energy-Charts en ENTSO-E prijzen" },
  ],
  hosts: { en: "Five hosts", nl: "Vijf hosts" },
  hostNames: ["Api", "Gateway", "Planner", "Steering", "Retention"],
  steps: [
    { en: "The domain sits at the centre.", nl: "De domain staat in het midden." },
    { en: "Around it the application ring holds the use cases and 18 ports.", nl: "Eromheen houdt de application ring de use cases en 18 ports." },
    {
      en: "In memory adapters: stores, command channel and telemetry channel. They depend on the ring.",
      nl: "In memory adapters: stores, command channel en telemetry channel. Ze hangen af van de ring.",
    },
    {
      en: "Azure and Postgres adapters: Postgres stores, IoT Hub source and sender, Service Bus sender and receiver, Energy-Charts and ENTSO-E prices. They depend on the ring.",
      nl: "Azure en Postgres adapters: Postgres stores, IoT Hub source en sender, Service Bus sender en receiver, Energy-Charts en ENTSO-E prijzen. Ze hangen af van de ring.",
    },
    { en: "Five hosts: Api, Gateway, Planner, Steering and Retention.", nl: "Vijf hosts: Api, Gateway, Planner, Steering en Retention." },
  ],
} as const;

export const PIPELINE_LABELS = {
  caption: {
    en: "Every job runs on GitHub-hosted runners with actions pinned by SHA. Deploys log in with OIDC and roll out images by digest.",
    nl: "Elke job draait op runners van GitHub met actions vastgezet op SHA. Deploys melden aan met OIDC en rollen images uit op digest.",
  },
  push: { en: "Push or pull request", nl: "Push of pull request" },
  ci: { en: "ci.yml, jobs in parallel", nl: "ci.yml, jobs parallel" },
  backend: same("backend"),
  backendNote: same("NuGet audit, build, tests"),
  dashboard: same("dashboard"),
  dashboardNote: same("pnpm audit, lint, tests, build, Playwright"),
  terraform: same("terraform"),
  terraformNote: same("fmt, validate, test, Trivy"),
  semgrep: same("Semgrep"),
  gitleaks: same("Gitleaks"),
  main: { en: "On main", nl: "Op main" },
  mainNotes: [
    { en: "seven images scanned by Grype", nl: "zeven images gescand met Grype" },
    { en: "pushed to ghcr.io", nl: "gepusht naar ghcr.io" },
  ],
  deploy: same("deploy.yml"),
  login: { en: "OIDC login, no stored secret", nl: "OIDC login, geen opgeslagen secret" },
  digests: { en: "tags resolved to digests", nl: "tags omgezet naar digests" },
  plan: { en: "terraform plan saved", nl: "terraform plan opgeslagen" },
  apply: same("apply"),
  target: same("Container Apps"),
  targetNote: { en: "apps and cron jobs", nl: "apps en cron jobs" },
  drift: { en: "Drift check", nl: "Drift check" },
  driftNote: { en: "every Monday", nl: "elke maandag" },
  steps: [
    { en: "A push or a pull request starts ci.yml.", nl: "Een push of pull request start ci.yml." },
    { en: "ci.yml runs five jobs in parallel: backend, dashboard, terraform, Semgrep and Gitleaks.", nl: "ci.yml draait vijf jobs parallel: backend, dashboard, terraform, Semgrep en Gitleaks." },
    { en: "backend: NuGet audit, build, tests.", nl: "backend: NuGet audit, build, tests." },
    { en: "dashboard: pnpm audit, lint, tests, build, Playwright.", nl: "dashboard: pnpm audit, lint, tests, build, Playwright." },
    { en: "terraform: fmt, validate, test, Trivy.", nl: "terraform: fmt, validate, test, Trivy." },
    { en: "On main, seven images are scanned by Grype and pushed to ghcr.io.", nl: "Op main worden zeven images gescand met Grype en gepusht naar ghcr.io." },
    {
      en: "deploy.yml: OIDC login with no stored secret, tags resolved to digests, terraform plan saved, then apply.",
      nl: "deploy.yml: OIDC login zonder opgeslagen secret, tags omgezet naar digests, terraform plan opgeslagen, dan apply.",
    },
    { en: "The result runs on Container Apps, as apps and cron jobs.", nl: "Het resultaat draait op Container Apps, als apps en cron jobs." },
    { en: "A drift check runs every Monday.", nl: "Een drift check draait elke maandag." },
  ],
} as const;

export const API_LABELS = {
  caption: {
    en: "The route handler calls the internal api. The api runs in one auth mode, scopes every query to an organisation and answers a matching ETag with a 304 and no body sent.",
    nl: "De route handler roept de interne api aan. De api draait in een auth mode, beperkt elke query tot een organisatie en beantwoordt een passende ETag met een 304 zonder verstuurde body.",
  },
  caller: { en: "Browser and route handler", nl: "Browser en route handler" },
  callerNotes: [
    { en: "the browser polls its own origin", nl: "de browser pollt de eigen origin" },
    { en: "the route handler adds a server-side token", nl: "de route handler voegt een server-side token toe" },
  ],
  ingress: { en: "internal ingress", nl: "interne ingress" },
  api: { en: "Api, one of two auth modes", nl: "Api, een van twee auth modes" },
  bearer: { en: "Static bearer", nl: "Static bearer" },
  bearerNote: { en: "one fixed organisation", nl: "een vaste organisatie" },
  entra: same("Entra"),
  entraNote: { en: "the organisation per request", nl: "de organisatie per verzoek" },
  endpoints: { en: "Endpoints under /v1", nl: "Endpoints onder /v1" },
  endpointNotes: [same("/sites/{siteId}"), same("/assets/{assetId}/state"), same("/assets/{assetId}/telemetry")],
  organisation: { en: "Organisation on every query", nl: "Organisatie op elke query" },
  organisationNote: { en: "applied in one place", nl: "op een plek toegepast" },
  limits: { en: "Limits", nl: "Limieten" },
  limitNotes: [
    { en: "86 400 rows for a raw series", nl: "86 400 rijen voor een ruwe reeks" },
    { en: "64 KB request body", nl: "64 KB request body" },
  ],
  etag: { en: "Weak ETag", nl: "Zwakke ETag" },
  etagNotes: [
    { en: "on the site and the asset state", nl: "op de site en de asset state" },
    { en: "a match in If-None-Match gives a 304", nl: "een match in If-None-Match geeft een 304" },
  ],
  etagResult: { en: "no body sent", nl: "geen body verstuurd" },
  other: { en: "Another organisation", nl: "Een andere organisatie" },
  otherNote: { en: "asks for the same site", nl: "vraagt om dezelfde site" },
  otherResult: { en: "404, finds nothing", nl: "404, vindt niets" },
  steps: [
    {
      en: "Browser and route handler: the browser polls its own origin and the route handler adds a server-side token.",
      nl: "Browser en route handler: de browser pollt de eigen origin en de route handler voegt een server-side token toe.",
    },
    { en: "The route handler calls the api over internal ingress.", nl: "De route handler roept de api aan via interne ingress." },
    {
      en: "The api runs in one of two auth modes: a static bearer token for one fixed organisation, or Entra with the organisation per request.",
      nl: "De api draait in een van twee auth modes: een static bearer token voor een vaste organisatie, of Entra met de organisatie per verzoek.",
    },
    { en: "Endpoints under /v1: /sites/{siteId}, /assets/{assetId}/state and /assets/{assetId}/telemetry.", nl: "Endpoints onder /v1: /sites/{siteId}, /assets/{assetId}/state en /assets/{assetId}/telemetry." },
    { en: "The organisation is applied on every query, in one place.", nl: "De organisatie wordt op elke query toegepast, op een plek." },
    { en: "Limits: 86 400 rows for a raw series and a 64 KB request body.", nl: "Limieten: 86 400 rijen voor een ruwe reeks en een request body van 64 KB." },
    {
      en: "The site and the asset state carry a weak ETag. A match in If-None-Match gives a 304 with no body sent.",
      nl: "De site en de asset state dragen een zwakke ETag. Een match in If-None-Match geeft een 304 zonder verstuurde body.",
    },
    {
      en: "Another organisation asking for the same site gets a 404 and finds nothing.",
      nl: "Een andere organisatie die om dezelfde site vraagt krijgt een 404 en vindt niets.",
    },
  ],
} as const;

export const STILL_LABELS = {
  blocks: { en: "Blocks", nl: "Blokken" },
  hop: { en: "Hop", nl: "Stap" },
  to: { en: "to", nl: "naar" },
  list: { en: "Blocks and hops in view", nl: "Blokken en stappen in beeld" },
} as const;

export const FIGURE_LABELS = {
  steps: { en: "Steps in the figure", nl: "Stappen in de figuur" },
} as const;
