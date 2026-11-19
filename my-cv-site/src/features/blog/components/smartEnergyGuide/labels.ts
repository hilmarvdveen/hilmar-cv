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

export const FLOW_LABELS = {
  caption: {
    en: "Readings come in through one transaction. A plan becomes one command per period, and the next reading confirms it.",
    nl: "Metingen komen binnen via een transactie. Een plan wordt een commando per periode, en de volgende meting bevestigt het.",
  },
  devices: { en: "Devices, simulated", nl: "Devices, gesimuleerd" },
  devicesNote: {
    en: "a battery, an EV charger, a PV inverter and a heat pump",
    nl: "een batterij, een laadpaal, een PV inverter en een warmtepomp",
  },
  devicesConfirm: { en: "the next reading confirms the command", nl: "de volgende meting bevestigt het commando" },
  hub: same("IoT Hub"),
  hubNote: { en: "one identity per device", nl: "een identity per device" },
  gateway: same("Gateway"),
  gatewayNote: { en: "validates, batches", nl: "valideert, batcht" },
  queue: { en: "Service Bus session queue", nl: "Service Bus session queue" },
  queueNote: { en: "an in-memory channel on a laptop", nl: "een in-memory channel op een laptop" },
  database: { en: "PostgreSQL with TimescaleDB", nl: "PostgreSQL met TimescaleDB" },
  databaseNotes: [
    { en: "raw reading", nl: "ruwe meting" },
    { en: "current state", nl: "actuele stand" },
    { en: "15 minute rollup", nl: "rollup per 15 minuten" },
  ],
  planner: same("Planner"),
  plannerNotes: [
    { en: "every hour", nl: "elk uur" },
    { en: "reads day-ahead prices", nl: "leest day-ahead prijzen" },
  ],
  steering: same("Steering"),
  steeringNotes: [
    { en: "every 15 minutes", nl: "elke 15 minuten" },
    { en: "issues a command with an idempotency key", nl: "geeft een commando uit met een idempotency key" },
  ],
  readingArrow: { en: "reading over MQTT", nl: "meting via MQTT" },
  commandArrow: { en: "command, cloud to device", nl: "commando, cloud to device" },
  endpointArrow: { en: "built-in endpoint", nl: "built-in endpoint" },
  sendArrow: { en: "sends to the device", nl: "stuurt naar de device" },
  transactionArrow: { en: "one transaction", nl: "een transactie" },
  commandSmallArrow: { en: "command", nl: "commando" },
  planArrow: { en: "stores a versioned plan", nl: "slaat een versioned plan op" },
  steps: [
    {
      en: "A device (a battery, an EV charger, a PV inverter or a heat pump, simulated) sends a reading to IoT Hub over MQTT, with one identity per device.",
      nl: "Een device (een batterij, een laadpaal, een PV inverter of een warmtepomp, gesimuleerd) stuurt een meting naar IoT Hub via MQTT, met een identity per device.",
    },
    { en: "The built-in endpoint of IoT Hub delivers it to the Gateway, which validates and batches.", nl: "Het built-in endpoint van IoT Hub levert het af bij de Gateway, die valideert en batcht." },
    {
      en: "The Gateway writes one transaction to PostgreSQL with TimescaleDB: the raw reading, the current state and the 15 minute rollup.",
      nl: "De Gateway schrijft een transactie naar PostgreSQL met TimescaleDB: de ruwe meting, de actuele stand en de rollup per 15 minuten.",
    },
    { en: "The Planner runs every hour, reads day-ahead prices and stores a versioned plan.", nl: "De Planner draait elk uur, leest day-ahead prijzen en slaat een versioned plan op." },
    { en: "Steering runs every 15 minutes and issues a command with an idempotency key.", nl: "Steering draait elke 15 minuten en geeft een commando uit met een idempotency key." },
    {
      en: "The command goes over a Service Bus session queue (an in-memory channel on a laptop) to the Gateway.",
      nl: "Het commando gaat via een Service Bus session queue (een in-memory channel op een laptop) naar de Gateway.",
    },
    { en: "The Gateway sends it cloud to device through IoT Hub to the battery.", nl: "De Gateway stuurt het cloud to device via IoT Hub naar de batterij." },
    { en: "The next reading confirms the command.", nl: "De volgende meting bevestigt het commando." },
  ],
} as const;

export const CONCURRENCY_LABELS = {
  caption: {
    en: "Writes go in one transaction per batch. Reads hit the current state and the rollup, and an unchanged answer costs a 304.",
    nl: "Schrijfacties gaan in een transactie per batch. Leesacties raken de actuele stand en de rollup, en een ongewijzigd antwoord kost een 304.",
  },
  axis: { en: "one 15 minute window", nl: "een venster van 15 minuten" },
  devices: same("Devices"),
  devicesNote: { en: "batteries charging, a heat pump on", nl: "batterijen laden, een warmtepomp aan" },
  gateway: same("Gateway"),
  gatewayNote: {
    en: "one transaction per batch: raw, current state, rollup",
    nl: "een transactie per batch: raw, actuele stand, rollup",
  },
  steering: same("Steering"),
  steeringNote: {
    en: "insert on conflict do nothing, then compare-and-set",
    nl: "insert on conflict do nothing, dan compare-and-set",
  },
  steeringAnnotation: { en: "a second run issues nothing", nl: "een tweede run geeft niets uit" },
  dashboard: same("Dashboard"),
  dashboardNote: {
    en: "every 10 seconds: read current state, ETag unchanged, 304",
    nl: "elke 10 seconden: lees actuele stand, ETag ongewijzigd, 304",
  },
  dashboardAnnotations: [
    { en: "readers do not wait for writers", nl: "lezers wachten niet op schrijvers" },
    { en: "nothing changed, nothing sent", nl: "niets veranderd, niets verstuurd" },
  ],
  steps: [
    { en: "Four lanes share one 15 minute window.", nl: "Vier lanes delen een venster van 15 minuten." },
    { en: "Devices: batteries charging, a heat pump on.", nl: "Devices: batterijen laden, een warmtepomp aan." },
    { en: "Gateway: repeated short blocks, one transaction per batch with the raw reading, the current state and the rollup.", nl: "Gateway: herhaalde korte blokken, een transactie per batch met de ruwe meting, de actuele stand en de rollup." },
    {
      en: "Steering: one block at the start of the period, insert on conflict do nothing, then compare-and-set. A second run issues nothing.",
      nl: "Steering: een blok aan het begin van de periode, insert on conflict do nothing, dan compare-and-set. Een tweede run geeft niets uit.",
    },
    {
      en: "Dashboard: a tick every 10 seconds, read current state, ETag unchanged, 304. Readers do not wait for writers. Nothing changed, nothing sent.",
      nl: "Dashboard: een tick elke 10 seconden, lees actuele stand, ETag ongewijzigd, 304. Lezers wachten niet op schrijvers. Niets veranderd, niets verstuurd.",
    },
  ],
} as const;

export const FRONTEND_LABELS = {
  caption: {
    en: "The browser only talks to its own origin. The route handler calls the internal api, and when nothing changed the answer is a 304.",
    nl: "De browser praat alleen met de eigen origin. De route handler roept de interne api aan, en als er niets veranderde is het antwoord een 304.",
  },
  browser: same("Browser"),
  browserNotes: [
    same("React"),
    { en: "polls every 10 seconds while the tab is visible", nl: "pollt elke 10 seconden zolang de tab zichtbaar is" },
    { en: "sends If-None-Match", nl: "stuurt If-None-Match mee" },
  ],
  handler: { en: "Next.js route handler", nl: "Next.js route handler" },
  handlerNotes: [
    same("/api/site"),
    { en: "same origin", nl: "eigen origin" },
    { en: "token bucket", nl: "token bucket" },
    { en: "5 second answer cache per caller", nl: "antwoordcache van 5 seconden per aanroeper" },
    { en: "passes the ETag on", nl: "geeft de ETag door" },
  ],
  api: same("Api"),
  apiNotes: [
    { en: "internal ingress", nl: "interne ingress" },
    { en: "bearer or Entra token", nl: "bearer of Entra token" },
    { en: "one organisation per request", nl: "een organisatie per verzoek" },
    { en: "weak ETag", nl: "zwakke ETag" },
  ],
  database: same("PostgreSQL"),
  databaseNote: { en: "current state per asset", nl: "actuele stand per asset" },
  serverNote: {
    en: "The first view is rendered on the server with 24 hours of 15 minute data.",
    nl: "De eerste weergave wordt op de server gerenderd met 24 uur aan data per 15 minuten.",
  },
  requestArrow: { en: "request", nl: "verzoek" },
  callArrow: { en: "internal call", nl: "interne call" },
  readArrow: { en: "reads current state", nl: "leest actuele stand" },
  returnTitle: { en: "304 Not Modified", nl: "304 Not Modified" },
  returnNote: { en: "nothing sent", nl: "niets verstuurd" },
  steps: [
    {
      en: "Browser: React, polls every 10 seconds while the tab is visible, sends If-None-Match.",
      nl: "Browser: React, pollt elke 10 seconden zolang de tab zichtbaar is, stuurt If-None-Match mee.",
    },
    {
      en: "Next.js route handler on /api/site: same origin, token bucket, a 5 second answer cache per caller, passes the ETag on.",
      nl: "Next.js route handler op /api/site: eigen origin, token bucket, een antwoordcache van 5 seconden per aanroeper, geeft de ETag door.",
    },
    {
      en: "Api: internal ingress, bearer or Entra token, one organisation per request, weak ETag.",
      nl: "Api: interne ingress, bearer of Entra token, een organisatie per verzoek, zwakke ETag.",
    },
    { en: "PostgreSQL: current state per asset.", nl: "PostgreSQL: actuele stand per asset." },
    { en: "When nothing changed, a 304 Not Modified goes back up and nothing is sent.", nl: "Als er niets veranderde, gaat een 304 Not Modified terug omhoog en wordt er niets verstuurd." },
    {
      en: "Side note: the first view is rendered on the server with 24 hours of 15 minute data.",
      nl: "Kanttekening: de eerste weergave wordt op de server gerenderd met 24 uur aan data per 15 minuten.",
    },
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
