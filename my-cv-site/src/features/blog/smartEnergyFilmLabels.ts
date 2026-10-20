import { BUSINESS_PROFILE, type Locale } from "@/lib/seo";
import type { ArrowId, ChipId, FrameId, NodeId } from "@/lib/smartEnergyFilm/layout";
import type { FilmSceneId } from "@/lib/smartEnergyFilm/film";
import type { LocalizedText } from "./types";

export type SmartEnergyFilmLabels = {
  title: string;
  subtitle: string;
  steps: readonly string[];
  frames: Record<FrameId, string>;
  nodes: Record<NodeId, { title: string; subtitle: string }>;
  sourceNotes: readonly string[];
  priceNotes: readonly string[];
  consumerNotes: readonly string[];
  serviceBusNotes: readonly string[];
  replicaChip: string;
  jobsLabel: string;
  databaseTitle: string;
  chips: Record<ChipId, string>;
  databaseSummary: string;
  arrows: Partial<Record<ArrowId, string>>;
  backendCode: readonly string[];
  controls: readonly string[];
  gatesLabel: string;
  gates: readonly string[];
  acceptedNote: string;
  scenes: Record<FilmSceneId, { step: string; title: string; caption: string; beats: readonly string[] }>;
  closing: string;
  url: string;
};

type Localized<Shape> = Shape extends string
  ? LocalizedText
  : Shape extends readonly string[]
    ? readonly LocalizedText[]
    : { [Key in keyof Shape]: Localized<Shape[Key]> };

const same = (text: string): LocalizedText => ({ en: text, nl: text });

const COPY: Localized<Omit<SmartEnergyFilmLabels, "url">> = {
  title: { en: "Smart energy steering, explained", nl: "Slim energie sturen, uitgelegd" },
  subtitle: {
    en: "Own proof of concept. It never ran at a client. Nothing is measured.",
    nl: "Eigen proof of concept. Het heeft nooit bij een klant gedraaid. Er is niets gemeten.",
  },
  steps: [
    { en: "the whole application", nl: "de hele applicatie" },
    { en: "frontend with backend", nl: "frontend met backend" },
    { en: "backend patterns", nl: "backendpatronen" },
    { en: "the cloud", nl: "de cloud" },
    { en: "everything running", nl: "alles draait" },
  ],
  frames: {
    sources: { en: "SOURCES", nl: "BRONNEN" },
    consumer: { en: "CONSUMER", nl: "GEBRUIKER" },
    subscription: { en: "AZURE SUBSCRIPTION, OWN", nl: "AZURE-ABONNEMENT, EIGEN" },
    resourceGroup: { en: "RESOURCE GROUP PER ENVIRONMENT: DEV, PRO", nl: "RESOURCE GROUP PER OMGEVING: DEV, PRO" },
    containerApps: { en: "CONTAINER APPS ENVIRONMENT", nl: "CONTAINER APPS-OMGEVING" },
    security: { en: "SECURITY ALONG THE FLOW", nl: "BEVEILIGING LANGS DE FLOW" },
  },
  nodes: {
    battery: { title: { en: "Battery", nl: "Batterij" }, subtitle: { en: "steerable", nl: "stuurbaar" } },
    evCharger: { title: { en: "EV charger", nl: "Laadpaal" }, subtitle: { en: "simulated", nl: "gesimuleerd" } },
    pvInverter: { title: { en: "PV inverter", nl: "PV-omvormer" }, subtitle: { en: "simulated", nl: "gesimuleerd" } },
    heatPump: { title: { en: "Heat pump", nl: "Warmtepomp" }, subtitle: { en: "simulated", nl: "gesimuleerd" } },
    prices: { title: { en: "Day-ahead prices", nl: "Day-ahead prijzen" }, subtitle: { en: "three adapters", nl: "drie adapters" } },
    browser: { title: same("Browser"), subtitle: { en: "business customer", nl: "zakelijke klant" } },
    iotHub: { title: same("IoT Hub"), subtitle: { en: "S1 in dev, F1 in pro", nl: "S1 in dev, F1 in pro" } },
    blob: { title: same("Blob"), subtitle: same("checkpoints") },
    budget: { title: same("Budget"), subtitle: { en: "35 euro each", nl: "35 euro per stuk" } },
    keyVault: { title: same("Key Vault"), subtitle: { en: "device keys", nl: "apparaatsleutels" } },
    serviceBus: { title: same("Service Bus"), subtitle: { en: "queue commands", nl: "wachtrij commands" } },
    logAnalytics: { title: same("Log Analytics"), subtitle: same("App Insights") },
    identities: { title: { en: "7 identities", nl: "7 identiteiten" }, subtitle: { en: "one per workload", nl: "een per workload" } },
    gateway: { title: same("gateway"), subtitle: { en: "no ingress, KEDA on queue", nl: "KEDA op wachtrij" } },
    api: { title: same("api"), subtitle: { en: "internal ingress", nl: "interne ingress" } },
    dashboard: { title: same("dashboard"), subtitle: { en: "external ingress", nl: "externe ingress" } },
    planner: { title: same("planner"), subtitle: { en: "hourly", nl: "elk uur" } },
    steering: { title: { en: "steering", nl: "sturing" }, subtitle: { en: "every 15 min", nl: "elke 15 min" } },
    retention: { title: { en: "retention", nl: "retentie" }, subtitle: { en: "nightly", nl: "elke nacht" } },
    simulator: { title: same("simulator"), subtitle: { en: "manual", nl: "handmatig" } },
  },
  sourceNotes: [
    { en: "one device identity per asset", nl: "een apparaatidentiteit per asset" },
    { en: "telemetry over MQTT", nl: "telemetrie over MQTT" },
  ],
  priceNotes: [same("synthetic, Energy-Charts,"), same("ENTSO-E")],
  consumerNotes: [
    { en: "polls every 10 s", nl: "pollt elke 10 s" },
    { en: "only while visible", nl: "alleen als zichtbaar" },
  ],
  serviceBusNotes: [
    { en: "pro only,", nl: "alleen pro," },
    { en: "never applied", nl: "nooit uitgerold" },
  ],
  replicaChip: { en: "min 0, max 1 replica", nl: "min 0, max 1 replica" },
  jobsLabel: { en: "Jobs, run once and exit", nl: "Jobs, draaien een keer en stoppen" },
  databaseTitle: same("PostgreSQL Flexible Server B1ms, PG17, TimescaleDB"),
  chips: {
    readings: { en: "telemetry_readings hypertable", nl: "telemetry_readings hypertable" },
    rollup: { en: "telemetry_15m rollup", nl: "telemetry_15m rollup" },
    currentState: same("asset_current_state"),
    command: { en: "command, unique idempotency key", nl: "command, unieke idempotency key" },
    audit: same("command_audit"),
    plans: { en: "plans and prices, versioned", nl: "plannen en prijzen, met versie" },
  },
  databaseSummary: {
    en: "ON CONFLICT keys, forward-only current state, compare-and-set, advisory lock on migrate",
    nl: "ON CONFLICT-sleutels, actuele stand alleen vooruit, compare-and-set, advisory lock bij migreren",
  },
  arrows: {
    eventHubs: { en: "Event Hubs endpoint", nl: "Event Hubs-endpoint" },
    checkpoint: same("checkpoint"),
    batch: { en: "one batch, one transaction", nl: "een batch, een transactie" },
    reads: { en: "reads", nl: "leest" },
    calls: { en: "calls", nl: "roept aan" },
    poll: same("/api/site, ETag, 304"),
    prices: { en: "prices", nl: "prijzen" },
    commands: { en: "commands with idempotency key", nl: "commands met idempotency key" },
    sessions: { en: "sessions per asset", nl: "sessies per asset" },
    cloudToDevice: { en: "cloud to device", nl: "cloud naar apparaat" },
  },
  backendCode: [
    { en: "Postgres adapter or in-memory adapter behind one port, last registration wins", nl: "Postgres-adapter of in-memory adapter achter een poort, laatste registratie wint" },
    same("ON CONFLICT (asset_id, measured_at) DO NOTHING"),
    same("WHERE excluded.measured_at > asset_current_state.measured_at"),
    { en: "ON CONFLICT (idempotency_key) DO NOTHING, then AlreadyIssued", nl: "ON CONFLICT (idempotency_key) DO NOTHING, daarna AlreadyIssued" },
    { en: "UPDATE ... WHERE state = expected, 0 rows stops, audit row in the same transaction", nl: "UPDATE ... WHERE state = verwacht, 0 rijen stopt, auditrij in dezelfde transactie" },
    { en: "SELECT pg_advisory_lock(@key) before migrate, a second host waits", nl: "SELECT pg_advisory_lock(@key) voor het migreren, een tweede host wacht" },
  ],
  controls: [
    { en: "SAS key per device in Key Vault", nl: "SAS-sleutel per apparaat in Key Vault" },
    { en: "identity from the hub, never the body", nl: "identiteit van de hub, nooit uit de body" },
    { en: "bounded parser that never throws", nl: "begrensde parser die nooit gooit" },
    { en: "time window on readings", nl: "tijdvenster op metingen" },
    { en: "parameterised, one transaction per batch", nl: "geparametriseerd, een transactie per batch" },
    { en: "api on internal ingress", nl: "api op interne ingress" },
    { en: "bearer or Entra JWT, organisation per request", nl: "bearer of Entra JWT, organisatie per verzoek" },
    { en: "raw reads capped at 86 400 rows", nl: "ruwe reads begrensd op 86 400 rijen" },
    { en: "token bucket and 5 s cache on the dashboard", nl: "token bucket en 5 s cache op het dashboard" },
    { en: "nonce CSP and PKCE sign-in", nl: "nonce CSP en PKCE-aanmelding" },
    { en: "Entra-only queue with sessions", nl: "wachtrij alleen voor Entra, met sessies" },
    { en: "migrations under an advisory lock", nl: "migraties onder een advisory lock" },
  ],
  gatesLabel: { en: "Gates for known advisories", nl: "Gates voor bekende advisories" },
  gates: [same("NuGet audit"), same("Grype"), same("Semgrep"), same("Gitleaks"), same("Trivy"), same("terraform test"), same("Dependabot")],
  acceptedNote: {
    en: "Accepted for now: S7 database network and logins, S8 events key that can steer, S16 smaller items. Each has its reason in the sweep.",
    nl: "Voorlopig geaccepteerd: S7 databasenetwerk en logins, S8 events-sleutel die kan sturen, S16 kleinere punten. Elk heeft zijn reden in de sweep.",
  },
  scenes: {
    overview: {
      step: same("01"),
      title: { en: "The whole application", nl: "De hele applicatie" },
      caption: {
        en: "Four simulated assets on the left, the business customer's browser on the right, and in between one Azure subscription with IoT Hub, Container Apps, PostgreSQL and the jobs that plan and steer.",
        nl: "Vier gesimuleerde assets links, de browser van de zakelijke klant rechts, en daartussen een Azure-abonnement met IoT Hub, Container Apps, PostgreSQL en de jobs die plannen en sturen.",
      },
      beats: [],
    },
    frontend: {
      step: same("02"),
      title: { en: "Frontend with backend", nl: "Frontend met backend" },
      caption: {
        en: "The browser talks only to the dashboard, and the dashboard talks to the api.",
        nl: "De browser praat alleen met het dashboard, en het dashboard praat met de api.",
      },
      beats: [
        {
          en: "The browser polls the dashboard's own /api/site every 10 seconds with If-None-Match, only while the tab is visible, and backs off to 60 seconds on failure.",
          nl: "De browser pollt elke 10 seconden de eigen /api/site van het dashboard met If-None-Match, alleen als het tabblad zichtbaar is, en wacht 60 seconden na een fout.",
        },
        {
          en: "The dashboard route asks the api, which answers the site and the asset state with a weak ETag built from the newest measured moment.",
          nl: "De dashboardroute vraagt het aan de api, die de site en de assetstand beantwoordt met een zwakke ETag op basis van het nieuwste meetmoment.",
        },
        {
          en: "When nothing changed, the api answers 304 and the route passes it on, so an unchanged poll carries no body.",
          nl: "Is er niets veranderd, dan antwoordt de api met 304 en geeft de route dat door, dus een ongewijzigde poll draagt geen body.",
        },
        {
          en: "The plan, commands and savings routes keep a 5 second answer cache per caller, behind a token bucket of 60 burst and 1 per second.",
          nl: "De routes voor plan, commands en besparing houden per aanroeper een antwoordcache van 5 seconden, achter een token bucket van 60 burst en 1 per seconde.",
        },
      ],
    },
    backend: {
      step: same("03"),
      title: { en: "Backend architecture and patterns", nl: "Backendarchitectuur en patronen" },
      caption: {
        en: "Ports and adapters, and the keys and conditions that keep the data right.",
        nl: "Poorten en adapters, en de sleutels en voorwaarden die de data juist houden.",
      },
      beats: [
        {
          en: "Every store sits behind one port. The hosts register the in-memory adapter first and Postgres when a connection string is configured. The last registration wins.",
          nl: "Elke store zit achter een poort. De hosts registreren eerst de in-memory adapter en Postgres als er een connection string is ingesteld. De laatste registratie wint.",
        },
        {
          en: "The same reading twice: the primary key is the asset and the measured moment, and the insert does nothing on a conflict.",
          nl: "Dezelfde meting twee keer: de primaire sleutel is de asset met het meetmoment, en de insert doet niets bij een conflict.",
        },
        {
          en: "A late, older reading lands in the history. The current state only moves forward.",
          nl: "Een late, oudere meting komt in de historie. De actuele stand gaat alleen vooruit.",
        },
        {
          en: "Steering twice for one period meets the idempotency key of asset, period and plan version, and returns AlreadyIssued.",
          nl: "Twee keer sturen voor een periode stuit op de idempotency key van asset, periode en planversie, en geeft AlreadyIssued terug.",
        },
        {
          en: "Two transitions race on one command. The update carries the expected state, so the loser changes zero rows and stops. Each change writes its audit row in the same transaction.",
          nl: "Twee overgangen racen op een commando. De update neemt de verwachte status mee, dus de verliezer wijzigt nul rijen en stopt. Elke wijziging schrijft zijn auditrij in dezelfde transactie.",
        },
        {
          en: "Hosts migrate the schema under a PostgreSQL advisory lock, so a second host waits until the first has migrated.",
          nl: "Hosts migreren het schema onder een advisory lock in PostgreSQL, dus een tweede host wacht tot de eerste gemigreerd heeft.",
        },
      ],
    },
    cloud: {
      step: same("04"),
      title: { en: "The cloud", nl: "De cloud" },
      caption: {
        en: "Everything in one own Azure subscription, described in Terraform.",
        nl: "Alles in een eigen Azure-abonnement, beschreven in Terraform.",
      },
      beats: [
        {
          en: "One own Azure subscription with a resource group per environment. Dev was applied once on 29 September 2026 and destroyed the same morning. Pro was never applied.",
          nl: "Een eigen Azure-abonnement met een resource group per omgeving. Dev is een keer uitgerold op 29 september 2026 en dezelfde ochtend afgebroken. Pro is nooit uitgerold.",
        },
        {
          en: "Container Apps: the dashboard on external ingress, the api on internal ingress, the gateway without ingress and scaled by KEDA on queue length. Minimum 0 and maximum 1 replica, held by a Terraform test.",
          nl: "Container Apps: het dashboard op externe ingress, de api op interne ingress, de gateway zonder ingress en geschaald door KEDA op de lengte van de wachtrij. Minimaal 0 en maximaal 1 replica, bewaakt door een Terraform-test.",
        },
        {
          en: "Jobs run once and exit: the planner hourly, steering every 15 minutes, retention nightly and the simulator by hand.",
          nl: "Jobs draaien een keer en stoppen: de planner elk uur, sturing elke 15 minuten, retentie elke nacht en de simulator met de hand.",
        },
        {
          en: "IoT Hub S1 in dev and F1 in pro, Service Bus Standard in pro only, and PostgreSQL Flexible Server B1ms with PG17 and TimescaleDB.",
          nl: "IoT Hub S1 in dev en F1 in pro, Service Bus Standard alleen in pro, en PostgreSQL Flexible Server B1ms met PG17 en TimescaleDB.",
        },
        {
          en: "Key Vault for the device keys, one user-assigned identity per workload, seven in all, Log Analytics with App Insights and a 35 euro budget per environment.",
          nl: "Key Vault voor de apparaatsleutels, een user-assigned identity per workload, zeven in totaal, Log Analytics met App Insights en een budget van 35 euro per omgeving.",
        },
      ],
    },
    running: {
      step: same("05"),
      title: { en: "Everything running", nl: "Alles draait" },
      caption: {
        en: "Telemetry comes in, plans become commands and the browser polls, while the band below lights each security control in flow order.",
        nl: "Telemetrie komt binnen, plannen worden commando's en de browser pollt, terwijl de band eronder elke beveiligingscontrole oplicht in de volgorde van de flow.",
      },
      beats: [],
    },
  },
  closing: {
    en: "Own work, built in two weeks. It never ran at a client.",
    nl: "Eigen werk, gebouwd in twee weken. Het heeft nooit bij een klant gedraaid.",
  },
};

const isLocalizedText = (value: unknown): value is LocalizedText =>
  typeof value === "object" && value !== null && "en" in value && "nl" in value && typeof (value as LocalizedText).en === "string";

const resolve = (value: unknown, locale: Locale): unknown => {
  if (isLocalizedText(value)) {
    return value[locale];
  }
  if (Array.isArray(value)) {
    return value.map((entry) => resolve(entry, locale));
  }
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, resolve(entry, locale)]));
};

export function smartEnergyFilmLabels(locale: Locale): SmartEnergyFilmLabels {
  return {
    ...(resolve(COPY, locale) as Omit<SmartEnergyFilmLabels, "url">),
    url: BUSINESS_PROFILE.CONTACT.WEBSITE.replace("https://", ""),
  };
}
