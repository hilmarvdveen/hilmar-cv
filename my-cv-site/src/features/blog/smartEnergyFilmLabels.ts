import { BUSINESS_PROFILE, type Locale } from "@/lib/seo";
import type { BlockId, FrameId, LineKind, ShieldId } from "@/lib/smartEnergyFilm/layout";
import type { FilmSceneId } from "@/lib/smartEnergyFilm/film";
import type { LocalizedText } from "./types";

export type FilmCaption = { headline: string; detail: string };

export type TabId = Exclude<FilmSceneId, "title" | "end">;

export type SmartEnergyFilmLabels = {
  blocks: Record<BlockId, { title: readonly string[]; note: string }>;
  frames: Record<FrameId, string>;
  cloudFrames: Record<FrameId, string>;
  legend: Record<LineKind, string>;
  legendData: string;
  shields: Record<ShieldId, string>;
  gates: readonly string[];
  gatesLine: string;
  safety: {
    title: string;
    duplicateKey: readonly string[];
    duplicateResult: string;
    raceWinner: string;
    raceLoser: string;
    lockName: string;
    lockFirst: string;
    lockSecond: string;
    lockWaits: string;
    lockDone: string;
    auditChange: string;
    auditRow: string;
    auditTransaction: string;
    mechanisms: readonly string[];
  };
  captions: Record<FilmSceneId, readonly FilmCaption[]>;
  tabs: Record<TabId, string>;
  scaleTags: { replicas: string; queue: string; iotHub: string; serviceBus: string; database: string; zero: string };
  stepEyebrow: string;
  titleCard: { eyebrow: string; headline: string; support: string };
  name: string;
  role: string;
  endCard: { read: string; link: string; ownWork: string };
};

type Localized<Shape> = Shape extends string
  ? LocalizedText
  : Shape extends readonly string[]
    ? readonly LocalizedText[]
    : Shape extends readonly FilmCaption[]
      ? readonly { headline: LocalizedText; detail: LocalizedText }[]
      : { [Key in keyof Shape]: Localized<Shape[Key]> };

const same = (text: string): LocalizedText => ({ en: text, nl: text });

const NO_NOTE = same("");

const COPY: Localized<Omit<SmartEnergyFilmLabels, "name" | "role" | "endCard" | "gatesLine">> & { endCard: Localized<Omit<SmartEnergyFilmLabels["endCard"], "link">> } = {
  blocks: {
    battery: { title: [{ en: "Battery", nl: "Batterij" }], note: NO_NOTE },
    prices: { title: [same("Day-ahead"), { en: "prices", nl: "prijzen" }], note: NO_NOTE },
    iotHub: { title: [same("IoT Hub")], note: NO_NOTE },
    serviceBus: { title: [same("Service Bus")], note: { en: "pro only", nl: "alleen pro" } },
    gateway: { title: [same("Gateway")], note: NO_NOTE },
    api: { title: [same("API")], note: NO_NOTE },
    planner: { title: [same("Planner")], note: NO_NOTE },
    steering: { title: [{ en: "Steering", nl: "Sturing" }], note: NO_NOTE },
    dashboard: { title: [same("Dashboard")], note: NO_NOTE },
    database: { title: [same("PostgreSQL")], note: same("TimescaleDB") },
    browser: { title: [same("Browser")], note: { en: "household", nl: "huishouden" } },
  },
  frames: {
    azure: same("Azure"),
    containerApps: same("Container Apps"),
  },
  cloudFrames: {
    azure: { en: "Azure, dev and pro", nl: "Azure, dev en pro" },
    containerApps: { en: "Container Apps, 0 to 1 replica", nl: "Container Apps, 0 tot 1 replica" },
  },
  legend: {
    telemetry: { en: "telemetry", nl: "telemetrie" },
    commands: same("commands"),
    reads: { en: "reads", nl: "lezen" },
    control: { en: "plan", nl: "plan" },
  },
  legendData: same("data"),
  shields: {
    deviceKey: { en: "SAS key", nl: "SAS-sleutel" },
    hubIdentity: { en: "hub identity", nl: "hub-identiteit" },
    parameterised: { en: "parameterised", nl: "geparametriseerd" },
    contentPolicy: same("CSP, PKCE"),
    token: same("JWT"),
    internalIngress: { en: "internal only", nl: "alleen intern" },
    entraQueue: { en: "Entra only", nl: "alleen Entra" },
  },
  gates: [same("NuGet audit"), same("Grype"), same("Semgrep"), same("Gitleaks"), same("Trivy"), same("terraform test"), same("Dependabot")],
  safety: {
    title: { en: "PostgreSQL keeps the data right", nl: "PostgreSQL houdt de data juist" },
    duplicateKey: [same("asset_id,"), same("measured_at")],
    duplicateResult: same("DO NOTHING"),
    raceWinner: { en: "Sent to Acknowledged: 1 row", nl: "Sent naar Acknowledged: 1 rij" },
    raceLoser: { en: "Sent to Expired: 0 rows", nl: "Sent naar Expired: 0 rijen" },
    lockName: same("advisory lock"),
    lockFirst: same("host 1"),
    lockSecond: same("host 2"),
    lockWaits: { en: "waits", nl: "wacht" },
    lockDone: { en: "schema current", nl: "schema bij" },
    auditChange: { en: "state change", nl: "statuswijziging" },
    auditRow: { en: "audit row", nl: "auditrij" },
    auditTransaction: { en: "one transaction", nl: "een transactie" },
    mechanisms: [
      { en: "duplicate", nl: "dubbel" },
      { en: "race", nl: "race" },
      { en: "migration", nl: "migratie" },
      { en: "audit", nl: "audit" },
    ],
  },
  captions: {
    title: [],
    overview: [
      {
        headline: { en: "The whole platform at a glance", nl: "Het hele platform in een oogopslag" },
        detail: { en: "readings come in, plans go out, a household watches", nl: "metingen komen binnen, plannen gaan eruit, een huishouden kijkt mee" },
      },
    ],
    reading: [
      {
        headline: { en: "A reading leaves the battery", nl: "Een meting verlaat de batterij" },
        detail: { en: "MQTT to IoT Hub, one device identity per asset", nl: "MQTT naar IoT Hub, een apparaatidentiteit per asset" },
      },
      {
        headline: { en: "The gateway picks it up", nl: "De gateway pakt hem op" },
        detail: { en: "from the Event Hubs endpoint, with checkpoints in Blob", nl: "van het Event Hubs-endpoint, met checkpoints in Blob" },
      },
      {
        headline: { en: "One batch, one transaction", nl: "Een batch, een transactie" },
        detail: { en: "the raw readings, the 15 minute rollup and the current state", nl: "de ruwe metingen, de rollup per 15 minuten en de actuele stand" },
      },
    ],
    command: [
      {
        headline: { en: "Prices become a plan", nl: "Prijzen worden een plan" },
        detail: { en: "the hourly planner stores a versioned plan", nl: "de planner slaat elk uur een plan met versie op" },
      },
      {
        headline: { en: "Steering issues a command", nl: "Sturing geeft een commando uit" },
        detail: { en: "every 15 minutes, with an idempotency key", nl: "elke 15 minuten, met een idempotency key" },
      },
      {
        headline: { en: "The command reaches the battery", nl: "Het commando bereikt de batterij" },
        detail: { en: "queue in pro, in-memory channel on a laptop, then cloud to device", nl: "wachtrij in pro, in-memory kanaal op een laptop, dan cloud naar apparaat" },
      },
      {
        headline: { en: "The next reading confirms it", nl: "De volgende meting bevestigt het" },
        detail: { en: "Sent, Acknowledged, Confirmed", nl: "Sent, Acknowledged, Confirmed" },
      },
    ],
    customer: [
      {
        headline: { en: "The household opens the dashboard", nl: "Het huishouden opent het dashboard" },
        detail: { en: "the browser polls every 10 seconds while the tab is visible", nl: "de browser pollt elke 10 seconden zolang het tabblad zichtbaar is" },
      },
      {
        headline: { en: "The dashboard asks the api", nl: "Het dashboard vraagt de api" },
        detail: { en: "on internal ingress, reading from PostgreSQL", nl: "op interne ingress, lezend uit PostgreSQL" },
      },
      {
        headline: { en: "Nothing changed, nothing sent", nl: "Niets veranderd, niets verstuurd" },
        detail: { en: "a weak ETag and 304 Not Modified", nl: "een zwakke ETag en 304 Not Modified" },
      },
    ],
    safety: [
      {
        headline: { en: "The same reading twice is stored once", nl: "Dezelfde meting twee keer wordt een keer opgeslagen" },
        detail: { en: "key (asset_id, measured_at), ON CONFLICT DO NOTHING", nl: "sleutel (asset_id, measured_at), ON CONFLICT DO NOTHING" },
      },
      {
        headline: { en: "A stale update changes nothing", nl: "Een verouderde update verandert niets" },
        detail: { en: "UPDATE ... WHERE state = expected, 0 rows", nl: "UPDATE ... WHERE state = verwacht, 0 rijen" },
      },
      {
        headline: { en: "One host migrates, the other waits", nl: "Een host migreert, de ander wacht" },
        detail: { en: "a PostgreSQL advisory lock", nl: "een advisory lock in PostgreSQL" },
      },
      {
        headline: { en: "Every state change leaves a trace", nl: "Elke statuswijziging laat een spoor na" },
        detail: { en: "the audit row in the same transaction", nl: "de auditrij in dezelfde transactie" },
      },
    ],
    scale: [
      {
        headline: { en: "Out: gateways follow the queue", nl: "Uit: gateways volgen de wachtrij" },
        detail: { en: "KEDA on queue length, Terraform holds one replica today", nl: "KEDA op de wachtrijlengte, Terraform houdt vandaag een replica" },
      },
      {
        headline: { en: "Up: bigger tiers where load lands", nl: "Op: grotere tiers waar de last landt" },
        detail: { en: "IoT Hub tiers, Service Bus Premium, a larger PostgreSQL tier", nl: "IoT Hub-tiers, Service Bus Premium, een grotere PostgreSQL-tier" },
      },
      {
        headline: { en: "Down: apps scale to zero", nl: "Af: apps schalen naar nul" },
        detail: { en: "minimum 0 replicas, the jobs run once and exit", nl: "minimaal 0 replica's, de jobs draaien een keer en stoppen" },
      },
      {
        headline: { en: "What changes first as it grows", nl: "Wat als eerste verandert bij groei" },
        detail: { en: "the single-site planner loop, the rollup in the app, in-memory caches", nl: "de plannerlus per site, de rollup in de app, caches in het geheugen" },
      },
    ],
    cloud: [
      {
        headline: { en: "Containers in two environments", nl: "Containers in twee omgevingen" },
        detail: { en: "Container Apps in dev and pro, KEDA on queue length", nl: "Container Apps in dev en pro, KEDA op de lengte van de wachtrij" },
      },
      {
        headline: { en: "A control where it applies", nl: "Een controle waar die hoort" },
        detail: { en: "seven managed identities and Key Vault", nl: "zeven managed identities en Key Vault" },
      },
    ],
    end: [],
  },
  tabs: {
    overview: { en: "Overview", nl: "Overzicht" },
    reading: { en: "Reading", nl: "Meting" },
    command: { en: "Command", nl: "Commando" },
    customer: { en: "Household", nl: "Huishouden" },
    safety: { en: "Consistency", nl: "Consistentie" },
    scale: { en: "Scale", nl: "Schalen" },
    cloud: same("Cloud"),
  },
  scaleTags: {
    replicas: { en: "1 to n", nl: "1 tot n" },
    queue: { en: "queue length", nl: "wachtrijlengte" },
    iotHub: { en: "higher tier", nl: "hogere tier" },
    serviceBus: same("Premium"),
    database: { en: "larger tier, chunks, retention", nl: "grotere tier, chunks, retentie" },
    zero: same("0"),
  },
  stepEyebrow: same("{current} / {total}"),
  titleCard: {
    eyebrow: { en: "Architecture in one minute", nl: "Architectuur in een minuut" },
    headline: { en: "A battery that charges when power is cheap.", nl: "Een batterij die laadt als stroom goedkoop is." },
    support: { en: "This is the whole platform that plans and steers it.", nl: "Dit is het hele platform dat hem plant en stuurt." },
  },
  endCard: {
    read: { en: "How it is built, step by step:", nl: "Hoe het gebouwd is, stap voor stap:" },
    ownWork: { en: "Own work, never ran at a client.", nl: "Eigen werk, nooit bij een klant gedraaid." },
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

export const POST_SLUG = "smart-energy-steering-architecture";

export function smartEnergyFilmLabels(locale: Locale): SmartEnergyFilmLabels {
  const resolved = resolve(COPY, locale) as Omit<SmartEnergyFilmLabels, "name" | "role" | "endCard" | "gatesLine"> & {
    endCard: Omit<SmartEnergyFilmLabels["endCard"], "link">;
  };
  return {
    ...resolved,
    gatesLine: resolved.gates.join(", "),
    name: BUSINESS_PROFILE.NAME,
    role: BUSINESS_PROFILE.TITLE,
    endCard: { ...resolved.endCard, link: `${BUSINESS_PROFILE.CONTACT.WEBSITE.replace("https://", "")}/${locale}/blog/${POST_SLUG}` },
  };
}
