import { BUSINESS_PROFILE, type Locale } from "@/lib/seo";
import type { BlogPostMeta, LocalizedText } from "../types";
import { H2, P, Lead, UL, LI, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { FileTree, type FileNode } from "./FileTree";
import { Contents } from "./Contents";
import { SmartEnergyFlowExplainer } from "./SmartEnergyFlowExplainer";
import type { SmartEnergyExplainerLabels } from "./SmartEnergyFlowDrawing";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "smart-energy-steering-architecture",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-10-02",
  updatedDate: "2026-10-20",
  readingTimeMin: 13,
  title: {
    en: "One drawing, five questions about a steering platform",
    nl: "Een tekening, vijf vragen over een stuurplatform",
  },
  description: {
    en: "A proof of concept that steers a battery: hexagonal ports, IoT Hub, TimescaleDB, ETag polling, Service Bus sessions, and how its data stays consistent.",
    nl: "Een proof of concept dat een batterij stuurt: hexagonale poorten, IoT Hub, TimescaleDB, ETag-polling, Service Bus-sessies en hoe de data consistent blijft.",
  },
  excerpt: {
    en: "Five questions about a platform that reads energy assets and steers a battery, answered with one animated drawing of my own proof of concept, plus how its data stays consistent and what keeps it clean of known vulnerabilities.",
    nl: "Vijf vragen over een platform dat energie-assets uitleest en een batterij stuurt, beantwoord met een geanimeerde tekening van mijn eigen proof of concept, plus hoe de data consistent blijft en wat het vrij houdt van bekende kwetsbaarheden.",
  },
  keywords: [
    "hexagonal architecture",
    "ports and adapters",
    "Azure IoT Hub",
    "TimescaleDB",
    "ETag conditional GET",
    "KEDA",
    "Service Bus sessions",
    "Recharts versus SVG",
    "idempotency key",
  ],
};

const READINGS_CODE = `
ON CONFLICT (asset_id, measured_at) DO NOTHING
RETURNING measured_at
`;

const CURRENT_STATE_CODE = `
ON CONFLICT (asset_id) DO UPDATE SET ...
WHERE excluded.measured_at > asset_current_state.measured_at
`;

const COMMAND_INSERT_CODE = `
ON CONFLICT (idempotency_key) DO NOTHING
`;

const COMPARE_AND_SET_CODE = `
var updatedRowCount = await database.Commands
    .Where(row => row.Id == movedId && row.State == stateBeforeTheMove)
    .ExecuteUpdateAsync(...);
`;

const QUEUE_MESSAGE_CODE = `
MessageId = command.IdempotencyKey,
SessionId = command.AssetId.Value,
TimeToLive = TimeSpan.FromMinutes(command.PeriodMinutes)
`;

const ADVISORY_LOCK_CODE = `
SELECT pg_advisory_lock(@key)
SELECT pg_advisory_unlock(@key)
`;

const FRAME_FUNCTION_CODE = `
export const explainerFrameAtMilliseconds = (elapsed: number): ExplainerFrame => {
  const wrapped = wrapElapsed(elapsed);
  const sceneIndex = sceneIndexAtMilliseconds(wrapped);
  const scene = SCENES[sceneIndex];
  const base = restingFrame(scene.id, sceneIndex, STAGE_OF_SCENE[scene.id]);
  return sceneFrame(base, wrapped - scene.startMilliseconds);
};
`;

const ASSISTANT_CODE = `
public interface IAssistant
{
    Task<string> ExplainPlan(string planId, CancellationToken cancellationToken);
}

public sealed class NoAssistant : IAssistant
{
    public Task<string> ExplainPlan(string planId, CancellationToken cancellationToken) =>
        Task.FromResult(string.Empty);
}
`;

function buildCachingDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("gateway", copy.nodeGateway[locale], { x: 250, y: 0 }, { tone: "blue", subtitle: copy.nodeGatewaySub[locale], width: 190, direction: "TB" }),
    flowNode("hypertable", copy.nodeHypertable[locale], { x: 0, y: 130 }, { tone: "emerald", subtitle: copy.nodeHypertableSub[locale], width: 190 }),
    flowNode("rollup", copy.nodeRollup[locale], { x: 250, y: 130 }, { tone: "emerald", subtitle: copy.nodeRollupSub[locale], width: 190 }),
    flowNode("currentState", copy.nodeCurrentState[locale], { x: 500, y: 130 }, { tone: "emerald", subtitle: copy.nodeCurrentStateSub[locale], width: 190 }),
    flowNode("api", copy.nodeApi[locale], { x: 500, y: 290 }, { tone: "blue", subtitle: copy.nodeApiSub[locale], width: 190 }),
    flowNode("routes", copy.nodeRoutes[locale], { x: 250, y: 290 }, { tone: "blue", subtitle: copy.nodeRoutesSub[locale], width: 190 }),
    flowNode("browser", copy.nodeBrowser[locale], { x: 0, y: 290 }, { tone: "slate", subtitle: copy.nodeBrowserSub[locale], width: 190 }),
  ];
  const edges = [
    flowEdge("gateway", "hypertable"),
    flowEdge("gateway", "rollup"),
    flowEdge("gateway", "currentState"),
    flowEdge("currentState", "api"),
    flowEdge("api", "routes"),
    flowEdge("routes", "browser"),
  ];
  return { nodes, edges };
}

function buildStateDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("created", copy.stateCreated[locale], { x: 0, y: 120 }, { tone: "slate", width: 150 }),
    flowNode("sent", copy.stateSent[locale], { x: 210, y: 120 }, { tone: "blue", width: 150 }),
    flowNode("acknowledged", copy.stateAcknowledged[locale], { x: 420, y: 120 }, { tone: "blue", width: 150 }),
    flowNode("confirmed", copy.stateConfirmed[locale], { x: 630, y: 120 }, { tone: "emerald", width: 150 }),
    flowNode("rejected", copy.stateRejected[locale], { x: 0, y: 260 }, { tone: "slate", width: 150, direction: "TB" }),
    flowNode("failed", copy.stateFailed[locale], { x: 210, y: 260 }, { tone: "slate", width: 150, direction: "TB" }),
    flowNode("expired", copy.stateExpired[locale], { x: 420, y: 260 }, { tone: "slate", width: 150, direction: "TB" }),
  ];
  const edges = [
    flowEdge("created", "sent"),
    flowEdge("sent", "acknowledged"),
    flowEdge("acknowledged", "confirmed"),
    flowEdge("created", "rejected", { dashed: true }),
    flowEdge("created", "failed", { dashed: true }),
    flowEdge("created", "expired", { dashed: true }),
    flowEdge("sent", "failed", { dashed: true }),
    flowEdge("sent", "expired", { dashed: true }),
    flowEdge("acknowledged", "expired", { dashed: true }),
  ];
  return { nodes, edges };
}

function buildTouchPoints(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    { name: "Domain/Primitives/AssetKind.cs", comment: copy.touchKind[locale] },
    { name: "Domain/Telemetry/<Kind>Details.cs", comment: copy.touchDetails[locale] },
    { name: "Contracts/Telemetry/AssetKindNames.cs", comment: copy.touchNames[locale] },
    { name: "Adapters.Persistence/Assets/AssetKindCode.cs", comment: copy.touchCode[locale] },
    { name: "Adapters.Persistence/Telemetry/ReadingDetailsJson.cs", comment: copy.touchJson[locale] },
    { name: "<Kind>DetailsResponse.cs", comment: copy.touchResponse[locale] },
    { name: "Simulator <Kind>Model.cs", comment: copy.touchModel[locale] },
  ];
}

const both = (text: string): LocalizedText => ({ en: text, nl: text });

const LABELS = {
  scenes: {
    title: {
      title: { en: "One drawing, five questions", nl: "Een tekening, vijf vragen" },
      caption: { en: "A proof of concept that steers a battery, and the five questions it answers.", nl: "Een proof of concept dat een batterij stuurt, en de vijf vragen die het beantwoordt." },
    },
    layers: {
      title: { en: "The layers", nl: "De lagen" },
      caption: { en: "Devices, IoT Hub, the gateway, PostgreSQL, the in-memory adapters, the api with the dashboard, and the planner with steering and the queue.", nl: "Apparaten, IoT Hub, de gateway, PostgreSQL, de in-memory adapters, de api met het dashboard, en de planner met sturing en de wachtrij." },
    },
    telemetry: {
      title: { en: "A reading travels", nl: "Een meting reist" },
      caption: { en: "From the simulator through IoT Hub and the gateway into the hypertable, the current state and the 15 minute rollup, then out through the api with an ETag to the dashboard and a 304 in the browser.", nl: "Van de simulator via IoT Hub en de gateway naar de hypertable, de actuele stand en de rollup per 15 minuten, en dan via de api met een ETag naar het dashboard en een 304 in de browser." },
    },
    command: {
      title: { en: "A command travels", nl: "Een commando reist" },
      caption: { en: "The planner stores a plan, steering issues a command with an idempotency key, the gateway sends it to the battery, feedback acknowledges it and the next reading confirms it. Failed, Expired and Rejected are the side exits.", nl: "De planner slaat een plan op, sturing geeft een commando met een idempotency key uit, de gateway stuurt het naar de batterij, feedback bevestigt de ontvangst en de volgende meting bevestigt het resultaat. Failed, Expired en Rejected zijn de zijuitgangen." },
    },
    ports: {
      title: { en: "Ports and adapters", nl: "Poorten en adapters" },
      caption: { en: "Ten of the ports around the application core. In-memory adapters attach first, the configured adapters override them, and the assistant port has no adapter.", nl: "Tien van de poorten rond de applicatiekern. Eerst hangen de in-memory adapters eraan, de geconfigureerde adapters gaan eroverheen, en de assistentpoort heeft geen adapter." },
    },
    stores: {
      title: { en: "Two stores behind one port", nl: "Twee stores achter een poort" },
      caption: { en: "The Postgres adapter wraps each write in a transaction. The in-memory adapter takes a lock, so a second thread waits. The same use case runs on both, only the adapter changes.", nl: "De Postgres-adapter zet elke schrijfactie in een transactie. De in-memory adapter neemt een lock, dus een tweede thread wacht. Dezelfde use case draait op beide, alleen de adapter verschilt." },
    },
    consistency: {
      title: { en: "How the data stays consistent", nl: "Hoe de data consistent blijft" },
      caption: { en: "A duplicate reading bounces off its key, a late reading leaves the current state alone, a second steering run finds the command already issued, a losing transition changes zero rows, each asset has its own queue lane, and one host migrates while the other waits.", nl: "Een dubbele meting stuit op de sleutel, een late meting laat de actuele stand met rust, een tweede stuurronde vindt het commando al uitgegeven, een verliezende overgang wijzigt nul rijen, elke asset heeft een eigen rij in de wachtrij, en een host migreert terwijl de ander wacht." },
    },
    assetKind: {
      title: { en: "A fifth asset kind", nl: "Een vijfde soort asset" },
      caption: { en: "A new kind touches seven places. The gateway, the stores, the queue and the dashboard polling stay as they are.", nl: "Een nieuwe soort raakt zeven plekken. De gateway, de stores, de wachtrij en de polling van het dashboard blijven zoals ze zijn." },
    },
    scale: {
      title: { en: "The scaling levers", nl: "De knoppen om te schalen" },
      caption: { en: "Queue depth drives gateway replicas, the hub moves up a tier, the hypertable grows chunks, and the jobs run once and exit. Terraform caps the gateway at one replica today.", nl: "De diepte van de wachtrij bepaalt de replica's van de gateway, de hub gaat een tier omhoog, de hypertable krijgt chunks erbij, en de jobs draaien een keer en stoppen. Terraform houdt de gateway vandaag op een replica." },
    },
    security: {
      title: { en: "Controls along the flow", nl: "Controles langs de flow" },
      caption: { en: "Each hop lights its control in flow order, then the gates for known advisories. The open items are listed in the post.", nl: "Elke stap toont zijn controle in de volgorde van de flow, daarna de gates voor bekende advisories. De open punten staan in het artikel." },
    },
    closing: {
      title: { en: "Own work", nl: "Eigen werk" },
      caption: { en: "Built in two weeks on my own Azure subscription. It never ran at a client.", nl: "Gebouwd in twee weken op mijn eigen Azure-abonnement. Het heeft nooit bij een klant gedraaid." },
    },
  },
  previous: { en: "Previous scene", nl: "Vorige scene" },
  next: { en: "Next scene", nl: "Volgende scene" },
  pause: { en: "Pause", nl: "Pauze" },
  sceneCounter: { en: "Scene {current} of {total}", nl: "Scene {current} van {total}" },
  heading: { en: "One drawing, five questions", nl: "Een tekening, vijf vragen" },
  claim: { en: "A proof of concept that reads energy assets and steers a battery.", nl: "Een proof of concept dat energie-assets uitleest en een batterij stuurt." },
  questions: [
    { en: "Another asset kind?", nl: "Een andere soort asset?" },
    { en: "Often-read data?", nl: "Vaak gelezen data?" },
    { en: "Customizable diagrams?", nl: "Aanpasbare diagrammen?" },
    { en: "An assistant?", nl: "Een assistent?" },
    { en: "Scale?", nl: "Schalen?" },
  ],
  nodes: {
    simulator: both("Simulator"),
    battery: { en: "Battery", nl: "Batterij" },
    hub: both("IoT Hub"),
    gateway: both("Gateway"),
    database: both("PostgreSQL"),
    memory: both("In-memory"),
    api: both("API"),
    dashboard: both("Dashboard"),
    browser: both("Browser"),
    planner: both("Planner"),
    steering: { en: "Steering", nl: "Sturing" },
    queue: both("Service Bus"),
  },
  telemetryBadges: {
    checkpoint: both("checkpoint"),
    hypertable: both("hypertable"),
    currentState: { en: "current state", nl: "actuele stand" },
    rollup: both("15m rollup"),
    etag: both("ETag"),
    cache: { en: "5 s cache", nl: "5 s cache" },
    notModified: both("304"),
  },
  commandStates: {
    created: both("Created"),
    sent: both("Sent"),
    acknowledged: both("Acknowledged"),
    confirmed: both("Confirmed"),
    failed: both("Failed"),
    expired: both("Expired"),
    rejected: both("Rejected"),
  },
  idempotencyKey: both("idempotency key"),
  sideExits: { en: "side exits", nl: "zijuitgangen" },
  ports: {
    core: { en: "Application core", nl: "Applicatiekern" },
    inMemory: both("in-memory"),
    assistant: both("IAssistant"),
    noAdapter: { en: "no adapter", nl: "geen adapter" },
  },
  stores: {
    names: {
      telemetry: both("telemetry"),
      commands: { en: "commands", nl: "commando's" },
      plans: { en: "plans", nl: "plannen" },
      prices: { en: "prices", nl: "prijzen" },
      switch: { en: "steering switch", nl: "stuurschakelaar" },
      sites: both("sites"),
    },
    port: { en: "Port", nl: "Poort" },
    postgres: { en: "Postgres adapter", nl: "Postgres-adapter" },
    inMemory: { en: "In-memory adapter", nl: "In-memory adapter" },
    transaction: both("BEGIN … COMMIT"),
    lock: both("lock (gate)"),
    waiting: { en: "waits", nl: "wacht" },
    readOnly: { en: "read only", nl: "alleen lezen" },
    hosts: {
      api: { en: "API: Postgres with a connection string, else in-memory", nl: "API: Postgres met een connection string, anders in-memory" },
      gateway: { en: "Gateway: in-memory, then Postgres when configured", nl: "Gateway: in-memory, daarna Postgres als die is ingesteld" },
      planner: { en: "Planner: in-memory, then Postgres when configured", nl: "Planner: in-memory, daarna Postgres als die is ingesteld" },
      steering: { en: "Steering: in-memory, then Postgres when configured", nl: "Sturing: in-memory, daarna Postgres als die is ingesteld" },
      simulator: { en: "Simulator: in-memory, then Postgres when configured", nl: "Simulator: in-memory, daarna Postgres als die is ingesteld" },
      tests: { en: "Persistence tests: Testcontainers", nl: "Persistence-tests: Testcontainers" },
    },
  },
  consistencyBeats: {
    duplicate: { en: "The same reading twice", nl: "Dezelfde meting twee keer" },
    lateReading: { en: "A late, older reading", nl: "Een late, oudere meting" },
    idempotency: { en: "Steering runs twice", nl: "Sturing draait twee keer" },
    compareAndSet: { en: "Two transitions race", nl: "Twee overgangen racen" },
    sessions: { en: "One lane per asset", nl: "Een rij per asset" },
    migrationLock: { en: "Two hosts start at once", nl: "Twee hosts starten tegelijk" },
  },
  consistency: {
    readingsKey: both("(asset_id, measured_at)"),
    reading: { en: "reading 12:00", nl: "meting 12:00" },
    conflict: both("ON CONFLICT DO NOTHING"),
    currentState: { en: "current state 12:00", nl: "actuele stand 12:00" },
    lateReading: { en: "late reading 11:45", nl: "late meting 11:45" },
    forwardOnly: { en: "only a newer reading moves it", nl: "alleen een nieuwere meting verzet hem" },
    firstRun: { en: "steering run one", nl: "stuurronde een" },
    secondRun: { en: "steering run two", nl: "stuurronde twee" },
    commandKey: { en: "(asset, period, plan version)", nl: "(asset, periode, planversie)" },
    issued: { en: "issued", nl: "uitgegeven" },
    alreadyIssued: both("AlreadyIssued"),
    firstTransition: { en: "Sent to Acknowledged", nl: "Sent naar Acknowledged" },
    secondTransition: { en: "Sent to Expired", nl: "Sent naar Expired" },
    expectedState: both("WHERE state = Sent"),
    oneRow: { en: "1 row", nl: "1 rij" },
    zeroRows: { en: "0 rows, stops", nl: "0 rijen, stopt" },
    firstLane: { en: "session of asset one", nl: "sessie van asset een" },
    secondLane: { en: "session of asset two", nl: "sessie van asset twee" },
    duplicateDropped: { en: "same message id dropped", nl: "zelfde message id valt weg" },
    deadLetter: { en: "expired to dead letter", nl: "verlopen naar dead letter" },
    firstHost: { en: "first host", nl: "eerste host" },
    secondHost: { en: "second host", nl: "tweede host" },
    advisoryLock: both("pg_advisory_lock"),
    hostWaits: { en: "waits", nl: "wacht" },
    schemaCurrent: { en: "schema current", nl: "schema bijgewerkt" },
    audit: { en: "command_audit row in the same transaction as each state change", nl: "command_audit-rij in dezelfde transactie als elke statuswijziging" },
  },
  fifthAsset: { en: "Fifth asset kind", nl: "Vijfde soort asset" },
  touchPoints: [
    both("AssetKind.cs"),
    both("<Kind>Details.cs"),
    both("AssetKindNames.cs"),
    both("AssetKindCode.cs"),
    both("ReadingDetailsJson.cs"),
    both("<Kind>DetailsResponse.cs"),
    both("<Kind>Model.cs"),
  ],
  scale: {
    queueDepth: { en: "depth", nl: "diepte" },
    replicas: { en: "{count} replicas", nl: "{count} replica's" },
    runsOnce: { en: "runs once", nl: "draait een keer" },
    retention: { en: "retention runs once", nl: "retentie draait een keer" },
  },
  controls: {
    deviceKey: { en: "SAS key per device in the vault", nl: "SAS-sleutel per apparaat in de kluis" },
    hubIdentity: { en: "identity from the hub, never the body", nl: "identiteit van de hub, nooit uit de body" },
    parserCaps: { en: "parser that never throws, bounded input", nl: "parser die nooit gooit, begrensde invoer" },
    parameterisedWrites: { en: "parameterised, one transaction per batch", nl: "geparametriseerd, een transactie per batch" },
    internalIngress: { en: "api on internal ingress", nl: "api op interne ingress" },
    jwtAuthorisedParty: { en: "bearer or Entra JWT checked", nl: "bearer of Entra JWT gecontroleerd" },
    bearerStaysOnServer: { en: "token bucket on the dashboard", nl: "token bucket op het dashboard" },
    nonceContentPolicy: { en: "nonce CSP and PKCE sign-in", nl: "nonce CSP en PKCE-aanmelding" },
    entraQueue: { en: "Entra-only queue with sessions", nl: "wachtrij alleen voor Entra, met sessies" },
    commandReloaded: { en: "optimistic state transitions", nl: "optimistische statusovergangen" },
    pinnedDeploys: { en: "Grype on every container image", nl: "Grype op elk container-image" },
  },
  gates: [
    both("NuGet audit"),
    both("Grype"),
    both("Semgrep"),
    both("Gitleaks"),
    both("Trivy"),
    both("terraform test"),
    both("Dependabot"),
  ],
  closing: {
    claim: { en: "Own work. It never ran at a client.", nl: "Eigen werk. Het heeft nooit bij een klant gedraaid." },
    repository: both("github.com/hilmarvdveen/smart-energy-poc"),
  },
} as const;

type LocalizedRecord<Key extends string> = Readonly<Record<Key, LocalizedText>>;

const pick = <Key extends string>(record: LocalizedRecord<Key>, locale: Locale): Record<Key, string> =>
  Object.fromEntries(Object.entries<LocalizedText>(record).map(([key, text]) => [key, text[locale]])) as Record<Key, string>;

const PORT_NAMES = {
  telemetrySource: "ITelemetrySource",
  telemetryStore: "ITelemetryStore",
  siteReader: "ISiteReader",
  dayAheadPrices: "IDayAheadPrices",
  priceStore: "IDayAheadPriceStore",
  planStore: "IPlanStore",
  commandStore: "ICommandStore",
  commandSender: "ICommandSender",
  steeringSwitch: "ISteeringSwitch",
  clock: "IClock",
};

const CONFIGURED_ADAPTERS = {
  telemetrySource: "IoT Hub",
  telemetryStore: "PostgreSQL",
  siteReader: "PostgreSQL",
  dayAheadPrices: "ENTSO-E, Energy-Charts",
  priceStore: "PostgreSQL",
  planStore: "PostgreSQL",
  commandStore: "PostgreSQL",
  commandSender: "Service Bus",
  steeringSwitch: "PostgreSQL",
};

export function smartEnergyExplainerLabels(locale: Locale): SmartEnergyExplainerLabels {
  const labels = LABELS;
  return {
    scenes: Object.fromEntries(
      Object.entries(labels.scenes).map(([id, scene]) => [id, { title: scene.title[locale], caption: scene.caption[locale] }])
    ) as SmartEnergyExplainerLabels["scenes"],
    previous: labels.previous[locale],
    next: labels.next[locale],
    pause: labels.pause[locale],
    sceneCounter: labels.sceneCounter[locale],
    title: {
      heading: labels.heading[locale],
      claim: labels.claim[locale],
      questions: labels.questions.map((question) => question[locale]),
    },
    nodes: pick(labels.nodes, locale),
    telemetryBadges: pick(labels.telemetryBadges, locale),
    commandStates: pick(labels.commandStates, locale),
    idempotencyKey: labels.idempotencyKey[locale],
    sideExits: labels.sideExits[locale],
    ports: {
      core: labels.ports.core[locale],
      names: PORT_NAMES,
      inMemory: labels.ports.inMemory[locale],
      configured: CONFIGURED_ADAPTERS,
      assistant: labels.ports.assistant[locale],
      noAdapter: labels.ports.noAdapter[locale],
    },
    stores: {
      names: pick(labels.stores.names, locale),
      port: labels.stores.port[locale],
      postgres: labels.stores.postgres[locale],
      inMemory: labels.stores.inMemory[locale],
      transaction: labels.stores.transaction[locale],
      lock: labels.stores.lock[locale],
      waiting: labels.stores.waiting[locale],
      readOnly: labels.stores.readOnly[locale],
      hosts: pick(labels.stores.hosts, locale),
    },
    consistency: { ...pick(labels.consistency, locale), beats: pick(labels.consistencyBeats, locale) },
    assetKind: {
      fifthAsset: labels.fifthAsset[locale],
      touchPoints: labels.touchPoints.map((touchPoint) => touchPoint[locale]),
    },
    scale: pick(labels.scale, locale),
    security: {
      controls: pick(labels.controls, locale),
      gates: labels.gates.map((gate) => gate[locale]),
    },
    closing: { ...pick(labels.closing, locale), url: BUSINESS_PROFILE.CONTACT.WEBSITE.replace("https://", "") },
  };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const caching = buildCachingDiagram(locale);
  const states = buildStateDiagram(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <Callout variant="warning" title={copy.neverClaimsTitle[locale]}>
        {copy.neverClaimsBody[locale]}
      </Callout>

      <SmartEnergyFlowExplainer labels={smartEnergyExplainerLabels(locale)} />
      <P>{copy.explainer1[locale]}</P>

      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.kindTitle[locale],
          copy.readTitle[locale],
          copy.diagramTitle[locale],
          copy.assistantTitle[locale],
          copy.scaleTitle[locale],
          copy.dataTitle[locale],
          copy.securityTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.kindTitle[locale]}</H2>
      <P>{copy.kind1[locale]}</P>
      <FileTree tree={buildTouchPoints(locale)} caption={copy.kindTreeCaption[locale]} />
      <P>{copy.kind2[locale]}</P>

      <H2>{copy.readTitle[locale]}</H2>
      <P>{copy.read1[locale]}</P>
      <P>{copy.read2[locale]}</P>
      <FlowDiagram
        nodes={caching.nodes}
        edges={caching.edges}
        height={360}
        ariaLabel={copy.cachingAria[locale]}
        caption={copy.cachingCaption[locale]}
      />
      <P>{copy.read3[locale]}</P>
      <Callout variant="info" title={copy.apiCacheTitle[locale]}>
        {copy.apiCacheBody[locale]}
      </Callout>

      <H2>{copy.diagramTitle[locale]}</H2>
      <P>{copy.diagram1[locale]}</P>
      <P>{copy.diagram2[locale]}</P>
      <CodeBlock lang="ts" filename="src/lib/smartEnergyExplainer/frame.ts" code={FRAME_FUNCTION_CODE} />
      <P>{copy.diagram3[locale]}</P>

      <H2>{copy.assistantTitle[locale]}</H2>
      <P>{copy.assistant1[locale]}</P>
      <Callout variant="warning" title={copy.decisionTitle[locale]}>
        {copy.decisionBody[locale]}
      </Callout>
      <P>{copy.assistant2[locale]}</P>
      <CodeBlock lang="cs" filename={copy.assistantFilename[locale]} code={ASSISTANT_CODE} />
      <P>{copy.assistant3[locale]}</P>

      <H2>{copy.scaleTitle[locale]}</H2>
      <P>{copy.scale1[locale]}</P>
      <UL>
        <LI>{copy.scaleOut[locale]}</LI>
        <LI>{copy.scaleUp[locale]}</LI>
        <LI>{copy.scaleDown[locale]}</LI>
        <LI>{copy.scaleNot[locale]}</LI>
      </UL>
      <P>{copy.scale2[locale]}</P>

      <Divider />

      <H2>{copy.dataTitle[locale]}</H2>
      <P>{copy.data1[locale]}</P>
      <P>{copy.data2[locale]}</P>
      <P>{copy.duplicate1[locale]}</P>
      <CodeBlock lang="sql" filename="PostgresTelemetryStore.cs" code={READINGS_CODE} />
      <P>{copy.late1[locale]}</P>
      <CodeBlock lang="sql" filename="PostgresTelemetryStore.cs" code={CURRENT_STATE_CODE} />
      <P>{copy.idempotency1[locale]}</P>
      <CodeBlock lang="sql" filename="PostgresCommandStore.cs" code={COMMAND_INSERT_CODE} />
      <P>{copy.compare1[locale]}</P>
      <CodeBlock lang="cs" filename="PostgresCommandStore.cs" code={COMPARE_AND_SET_CODE} />
      <P>{copy.sessions1[locale]}</P>
      <CodeBlock lang="cs" filename="ServiceBusCommandMessage.cs" code={QUEUE_MESSAGE_CODE} />
      <P>{copy.migration1[locale]}</P>
      <CodeBlock lang="sql" filename="SchemaMigration.cs" code={ADVISORY_LOCK_CODE} />
      <P>{copy.audit1[locale]}</P>
      <FlowDiagram
        nodes={states.nodes}
        edges={states.edges}
        height={360}
        ariaLabel={copy.statesAria[locale]}
        caption={copy.statesCaption[locale]}
      />
      <P>{copy.locks1[locale]}</P>
      <Callout variant="info" title={copy.adaptersTitle[locale]}>
        {copy.adaptersBody[locale]}
      </Callout>

      <H2>{copy.securityTitle[locale]}</H2>
      <P>{copy.security1[locale]}</P>
      <P>{copy.security2[locale]}</P>
      <P>{copy.sweepIntro[locale]}</P>
      <UL>
        <LI>{copy.sweepS1[locale]}</LI>
        <LI>{copy.sweepS2[locale]}</LI>
        <LI>{copy.sweepS3[locale]}</LI>
        <LI>{copy.sweepS4[locale]}</LI>
        <LI>{copy.sweepS5[locale]}</LI>
        <LI>{copy.sweepS6[locale]}</LI>
        <LI>{copy.sweepS9[locale]}</LI>
        <LI>{copy.sweepS10[locale]}</LI>
        <LI>{copy.sweepS11[locale]}</LI>
        <LI>{copy.sweepS12[locale]}</LI>
        <LI>{copy.sweepS13[locale]}</LI>
        <LI>{copy.sweepS14[locale]}</LI>
        <LI>{copy.sweepS15[locale]}</LI>
        <LI>{copy.sweepAccepted[locale]}</LI>
      </UL>
      <P>{copy.accepted1[locale]}</P>
      <P>{copy.bumps1[locale]}</P>
      <P>{copy.bumps2[locale]}</P>
      <Callout variant="info" title={copy.cleanTitle[locale]}>
        {copy.cleanBody[locale]}
      </Callout>

      <Divider />

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
    </>
  );
}

const COPY = {
  lead: {
    en: "This post walks through a proof of concept I built in September and October 2026: a platform that reads telemetry from simulated energy assets, plans a battery against day-ahead prices and steers it with commands. It took two weeks on my own Azure subscription, and I built it with Claude Code under my direction and review.",
    nl: "Dit artikel loopt door een proof of concept dat ik in september en oktober 2026 bouwde: een platform dat telemetrie van gesimuleerde energie-assets uitleest, een batterij plant op day-ahead prijzen en die met commando's stuurt. Het kostte twee weken op mijn eigen Azure-abonnement, en ik bouwde het met Claude Code onder mijn regie en review.",
  },
  intro1: {
    en: "Five questions came with it, and the post answers them in the order they were asked. How does another asset kind get in? How do you keep often-read data cheap? How do the diagrams stay customizable? Where would an assistant fit? How does it scale? Two more sections follow that I added myself: how the data stays consistent, and what keeps the code clean of known vulnerabilities.",
    nl: "Er kwamen vijf vragen bij, en het artikel beantwoordt ze in de volgorde waarin ze gesteld zijn. Hoe komt er een andere soort asset bij? Hoe houd je vaak gelezen data goedkoop? Hoe blijven de diagrammen aanpasbaar? Waar past een assistent? Hoe schaalt het? Daarna volgen twee delen die ik zelf toevoegde: hoe de data consistent blijft, en wat de code vrij houdt van bekende kwetsbaarheden.",
  },
  intro2: {
    en: "The simulator models a battery, an EV charger, a PV inverter and a heat pump, each with its own device identity in IoT Hub. A gateway stores the readings in PostgreSQL with TimescaleDB, an api serves them and a server-rendered dashboard shows them. An hourly planner and a steering job every 15 minutes turn day-ahead prices into commands for the battery.",
    nl: "De simulator modelleert een batterij, een laadpaal, een PV-omvormer en een warmtepomp, elk met een eigen apparaatidentiteit in IoT Hub. Een gateway slaat de metingen op in PostgreSQL met TimescaleDB, een api serveert ze en een server-rendered dashboard toont ze. Een planner die elk uur draait en een stuurjob die elke 15 minuten draait, maken van day-ahead prijzen commando's voor de batterij.",
  },
  neverClaimsTitle: {
    en: "What this never claims",
    nl: "Wat dit nooit claimt",
  },
  neverClaimsBody: {
    en: "This is own work, and it never ran at a client. No client of mine and no internal system of a client appears in it. Nothing has been measured, so no number in this post describes speed or load. The infrastructure was applied once to dev on 29 September 2026 and destroyed the same morning. Pro has never been applied.",
    nl: "Dit is eigen werk, en het heeft nooit bij een klant gedraaid. Er komt geen klant van mij en geen intern systeem van een klant in voor. Er is niets gemeten, dus geen getal in dit artikel beschrijft snelheid of belasting. De infrastructuur is een keer op dev uitgerold op 29 september 2026 en dezelfde ochtend weer afgebroken. Pro is nooit uitgerold.",
  },
  explainer1: {
    en: "The drawing runs through eleven scenes in ninety seconds. Pointing at it or moving focus into it pauses it, and the buttons step through the scenes. With reduced motion switched on, each scene shows as a still of its last frame.",
    nl: "De tekening loopt in negentig seconden door elf scenes. Wijzen of de focus erin zetten pauzeert hem, en met de knoppen stap je door de scenes. Met verminderde beweging aan toont elke scene een stilstaand beeld van zijn laatste frame.",
  },
  contentsLabel: {
    en: "In this article",
    nl: "In dit artikel",
  },
  kindTitle: {
    en: "How does another asset kind get in?",
    nl: "Hoe komt er een andere soort asset bij?",
  },
  kind1: {
    en: "Every kind shares one telemetry event schema. Only the details differ per kind. A new kind touches seven places, and the gateway, the stores, the queue and the dashboard polling stay as they are.",
    nl: "Elke soort deelt een schema voor het telemetrie-event. Alleen de details verschillen per soort. Een nieuwe soort raakt zeven plekken, en de gateway, de stores, de wachtrij en de polling van het dashboard blijven zoals ze zijn.",
  },
  kindTreeCaption: {
    en: "The seven touch points of a new asset kind.",
    nl: "De zeven plekken die een nieuwe soort asset raakt.",
  },
  kind2: {
    en: "Steering is the part that is not generic yet. ComputePlan and IssueCommandsForPeriod pick the one steerable battery today, so steering a new kind also generalises those two. The flow is kind-agnostic. The planner is not yet.",
    nl: "Sturing is het deel dat nog niet generiek is. ComputePlan en IssueCommandsForPeriod kiezen vandaag de ene stuurbare batterij, dus een nieuwe soort sturen maakt ook die twee generiek. De flow kent geen soorten. De planner nog wel.",
  },
  touchKind: {
    en: "the new kind",
    nl: "de nieuwe soort",
  },
  touchDetails: {
    en: "its details, with a case in ReadingDetails.RequiredFor",
    nl: "de details, met een case in ReadingDetails.RequiredFor",
  },
  touchNames: {
    en: "the wire name, with contracts/telemetry-event.v1.schema.json",
    nl: "de naam op de lijn, met contracts/telemetry-event.v1.schema.json",
  },
  touchCode: {
    en: "the stored code",
    nl: "de opgeslagen code",
  },
  touchJson: {
    en: "the stored details",
    nl: "de opgeslagen details",
  },
  touchResponse: {
    en: "the api response, with contracts/openapi.v1.json",
    nl: "het api-antwoord, met contracts/openapi.v1.json",
  },
  touchModel: {
    en: "the simulated device",
    nl: "het gesimuleerde apparaat",
  },
  readTitle: {
    en: "How do you keep often-read data cheap?",
    nl: "Hoe houd je vaak gelezen data goedkoop?",
  },
  read1: {
    en: "The gateway writes three things per batch. The raw readings go into the telemetry_readings hypertable, the newest reading per asset goes into asset_current_state, and the touched bucket of the 15 minute rollup is recomputed on ingest. A screen that wants the present reads one row per asset instead of scanning history.",
    nl: "De gateway schrijft per batch drie dingen. De ruwe metingen gaan in de hypertable telemetry_readings, de nieuwste meting per asset gaat in asset_current_state, en de geraakte bucket van de rollup per 15 minuten wordt bij binnenkomst opnieuw berekend. Een scherm dat het heden wil, leest een rij per asset in plaats van door de historie te zoeken.",
  },
  read2: {
    en: "The api answers the site and the asset state with a weak ETag built from the newest measured moment, and with a 304 when nothing changed. The telemetry series has no ETag. The dashboard page is server rendered and polls its own /api/site every 10 seconds with If-None-Match, backs off to 60 seconds on failure and polls only while the tab is visible. Its plan, commands and savings routes keep a 5 second answer cache per caller.",
    nl: "De api beantwoordt de site en de assetstand met een zwakke ETag op basis van het nieuwste meetmoment, en met een 304 als er niets veranderde. De telemetriereeks heeft geen ETag. De dashboardpagina wordt op de server gerenderd en pollt elke 10 seconden de eigen /api/site met If-None-Match, wacht 60 seconden na een fout en pollt alleen als het tabblad zichtbaar is. De routes voor plan, commando's en besparing houden per aanroeper een antwoordcache van 5 seconden.",
  },
  cachingAria: {
    en: "Diagram of the gateway writing the hypertable, the rollup and the current state in one batch, and the read path from the current state through the api and the dashboard routes to the browser",
    nl: "Diagram van de gateway die de hypertable, de rollup en de actuele stand in een batch schrijft, en het leespad van de actuele stand via de api en de dashboardroutes naar de browser",
  },
  cachingCaption: {
    en: "Writes prepare the reads. The api adds an ETag, the dashboard routes pass it on or cache for 5 seconds, and the browser polls with If-None-Match.",
    nl: "Het schrijven bereidt het lezen voor. De api voegt een ETag toe, de dashboardroutes geven die door of cachen 5 seconden, en de browser pollt met If-None-Match.",
  },
  read3: {
    en: "The next steps, in order of cost: TimescaleDB continuous aggregates, response caching at the ingress or Front Door keyed on the ETag, Azure Cache for Redis once more than one dashboard replica exists, and push instead of poll. None of it is measured. The repository lists chart performance on a day of ten-second samples as a risk not yet felt.",
    nl: "De volgende stappen, in volgorde van kosten: continuous aggregates in TimescaleDB, response caching bij de ingress of Front Door op basis van de ETag, Azure Cache for Redis zodra er meer dan een dashboardreplica is, en push in plaats van poll. Niets daarvan is gemeten. De repository noemt de prestaties van een grafiek over een dag met samples van tien seconden als risico dat nog niet gevoeld is.",
  },
  apiCacheTitle: {
    en: "What the api does not cache",
    nl: "Wat de api niet cachet",
  },
  apiCacheBody: {
    en: "The api caches nothing beyond the ETag on the site and the asset state. In-memory caches do not scale as they are once there is more than one replica. Redis comes once more than one dashboard replica exists.",
    nl: "De api cachet niets behalve de ETag op de site en de assetstand. Caches in het geheugen schalen niet zoals ze zijn zodra er meer dan een replica is. Redis komt zodra er meer dan een dashboardreplica is.",
  },
  diagramTitle: {
    en: "How do the diagrams stay customizable?",
    nl: "Hoe blijven de diagrammen aanpasbaar?",
  },
  diagram1: {
    en: "The dashboard charts use Recharts 3 today, PowerChart and PlanChart, each with a table for screen readers beside it. The next steps follow the need: visx for custom marks, hand-written SVG with d3-scale and d3-shape for one-off drawings, and full d3 only for force layouts or very large point counts. One library per chart.",
    nl: "De grafieken in het dashboard gebruiken vandaag Recharts 3, PowerChart en PlanChart, elk met een tabel voor schermlezers ernaast. De volgende stappen volgen de behoefte: visx voor eigen markeringen, handgeschreven SVG met d3-scale en d3-shape voor losse tekeningen, en volledige d3 alleen voor force layouts of heel veel punten. Een bibliotheek per grafiek.",
  },
  diagram2: {
    en: "The drawing in this post sits at the hand-written end of that range, without any library. A pure function maps a moment in the loop to a frame.",
    nl: "De tekening in dit artikel zit aan de handgeschreven kant van dat spectrum, zonder bibliotheek. Een pure functie zet een moment in de lus om naar een frame.",
  },
  diagram3: {
    en: "A component without state draws that frame, and a small client island only keeps the clock. That split makes every scene testable at any millisecond and every still reproducible.",
    nl: "Een component zonder state tekent dat frame, en een klein client-eiland houdt alleen de klok bij. Door die splitsing is elke scene op elke milliseconde te testen en elk stilstaand beeld te reproduceren.",
  },
  assistantTitle: {
    en: "Where would an assistant fit?",
    nl: "Waar past een assistent?",
  },
  assistant1: {
    en: "This answer is design only. The README forbids claiming what was not built, and nothing of an assistant is coded.",
    nl: "Dit antwoord is alleen ontwerp. De README verbiedt te claimen wat niet gebouwd is, en er is niets van een assistent gecodeerd.",
  },
  decisionTitle: {
    en: "Decision 7",
    nl: "Besluit 7",
  },
  decisionBody: {
    en: "The seventh decision in the repository reads: No AI or model call anywhere. Everything below about an assistant is a design, not code in the repository.",
    nl: "Het zevende besluit in de repository luidt: No AI or model call anywhere. Alles hieronder over een assistent is een ontwerp, geen code in de repository.",
  },
  assistant2: {
    en: "What exists is the pattern it would follow. Every port lives in the application layer, most with an in-memory adapter and one Azure product adapter. Hosts register in-memory first, the Azure registration overrides when configured, and the last registration wins. IDayAheadPrices is the exception with three adapters: synthetic, Energy-Charts and ENTSO-E.",
    nl: "Wat bestaat, is het patroon dat het zou volgen. Elke poort woont in de applicatielaag, de meeste met een in-memory adapter en een adapter voor een Azure-product. Hosts registreren eerst in-memory, de Azure-registratie gaat erover als die is ingesteld, en de laatste registratie wint. IDayAheadPrices is de uitzondering met drie adapters: synthetisch, Energy-Charts en ENTSO-E.",
  },
  assistantFilename: {
    en: "not in the repository",
    nl: "niet in de repository",
  },
  assistant3: {
    en: "The port would be IAssistant or IPlanExplainer in Application/Planning, with NoAssistant as the in-memory adapter and a model adapter registered only when configured. The model would explain a plan. It never steers. In the drawing the assistant is the dotted port with no adapter.",
    nl: "De poort zou IAssistant of IPlanExplainer in Application/Planning zijn, met NoAssistant als in-memory adapter en een modeladapter die alleen geregistreerd wordt als die is ingesteld. Het model zou een plan uitleggen. Het stuurt nooit. In de tekening is de assistent de gestippelde poort zonder adapter.",
  },
  scaleTitle: {
    en: "How does it scale?",
    nl: "Hoe schaalt het?",
  },
  scale1: {
    en: "The levers go in three directions, plus the parts that would not scale as they are. None of them is a measurement. The replica count in the scale scene is the lever, not a result.",
    nl: "De knoppen gaan drie kanten op, plus de delen die zoals ze zijn niet schalen. Geen ervan is een meting. Het aantal replica's in de schaalscene is de knop, geen resultaat.",
  },
  scaleOut: {
    en: "Out: the gateway is stateless, KEDA scales it on queue length, and sessions per asset keep the command order per device.",
    nl: "Uit: de gateway heeft geen state, KEDA schaalt hem op de lengte van de wachtrij, en sessies per asset houden de volgorde van commando's per apparaat vast.",
  },
  scaleUp: {
    en: "Up: IoT Hub tiers, Service Bus Premium, a larger PostgreSQL tier, hypertable chunks and retention.",
    nl: "Op: tiers van IoT Hub, Service Bus Premium, een grotere tier voor PostgreSQL, chunks van de hypertable en retentie.",
  },
  scaleDown: {
    en: "Down: every app has a minimum of zero replicas, and the jobs run once and exit.",
    nl: "Af: elke app heeft minimaal nul replica's, en de jobs draaien een keer en stoppen.",
  },
  scaleNot: {
    en: "Not as it is: the planner loop over a single site, the rollup recompute in the application, and in-memory caches with more than one replica.",
    nl: "Niet zoals het is: de plannerlus over een enkele site, het herberekenen van de rollup in de applicatie, en caches in het geheugen bij meer dan een replica.",
  },
  scale2: {
    en: "Terraform caps the gateway, the api and the dashboard at one replica today, and a Terraform test holds that cap. Raising it means changing that test on purpose.",
    nl: "Terraform houdt de gateway, de api en het dashboard vandaag op een replica, en een Terraform-test bewaakt die grens. Hem verhogen betekent die test bewust aanpassen.",
  },
  dataTitle: {
    en: "How the data stays consistent",
    nl: "Hoe de data consistent blijft",
  },
  data1: {
    en: "Nobody asked this one. I added it because the drawing shows data moving and the question that follows is what keeps it right. The data lives in PostgreSQL with TimescaleDB, or in memory on a laptop. Every store sits behind one port with both adapters. The Postgres adapters are scoped and wrap each write in one transaction. The in-memory adapters are singletons, and the telemetry, command, plan, price and switch stores take a lock statement around each read and write.",
    nl: "Dit vroeg niemand. Ik voegde het toe omdat de tekening data laat bewegen en de vraag die dan volgt is wat die data juist houdt. De data staat in PostgreSQL met TimescaleDB, of in het geheugen op een laptop. Elke store zit achter een poort met beide adapters. De Postgres-adapters zijn scoped en zetten elke schrijfactie in een transactie. De in-memory adapters zijn singletons, en de stores voor telemetrie, commando's, plannen, prijzen en de schakelaar nemen een lock statement rond elke lees- en schrijfactie.",
  },
  data2: {
    en: "Which one runs depends on the host. The api picks Postgres when a connection string exists and in-memory otherwise. The gateway, the planner and the steering job register in-memory first and Postgres when configured. Retention runs on Postgres only, and the persistence tests run against a real database in Testcontainers. Six mechanisms keep the data right, in the order of the drawing.",
    nl: "Welke draait, hangt af van de host. De api kiest Postgres als er een connection string is en anders in-memory. De gateway, de planner en de stuurjob registreren eerst in-memory en Postgres als die is ingesteld. Retentie draait alleen op Postgres, en de persistence-tests draaien tegen een echte database in Testcontainers. Zes mechanismen houden de data juist, in de volgorde van de tekening.",
  },
  duplicate1: {
    en: "The same reading can arrive twice. The primary key of telemetry_readings is the asset and the measured moment, and the insert does nothing on a conflict. The store counts what came back to know how many were duplicates.",
    nl: "Dezelfde meting kan twee keer binnenkomen. De primaire sleutel van telemetry_readings is de asset met het meetmoment, en de insert doet niets bij een conflict. De store telt wat terugkomt en weet zo hoeveel dubbel waren.",
  },
  late1: {
    en: "An older reading can arrive after a newer one. The current state upsert only moves forward, so a late reading lands in the history and never moves the current state back.",
    nl: "Een oudere meting kan na een nieuwere binnenkomen. De upsert van de actuele stand gaat alleen vooruit, dus een late meting komt in de historie en zet de actuele stand nooit terug.",
  },
  idempotency1: {
    en: "The steering job can run twice for one period. Its idempotency key is the asset, the period start in UTC and the plan version. A unique index holds the key, the insert does nothing on a conflict, and the store reads the row back by key. When the stored command is not the one just built, the use case returns AlreadyIssued.",
    nl: "De stuurjob kan twee keer draaien voor een periode. De idempotency key is de asset, het begin van de periode in UTC en de planversie. Een unieke index bewaakt de sleutel, de insert doet niets bij een conflict, en de store leest de rij terug op sleutel. Is het opgeslagen commando niet het commando dat net gebouwd is, dan geeft de use case AlreadyIssued terug.",
  },
  compare1: {
    en: "Two transitions can race on one command. The update carries the state the command was in, so only the transition whose expected state still holds changes a row. The other changes zero rows, throws and writes no audit row. Before any store is called, the domain already refuses a move the state machine does not allow.",
    nl: "Twee overgangen kunnen racen op een commando. De update neemt de status mee waarin het commando stond, dus alleen de overgang waarvan de verwachte status nog klopt, wijzigt een rij. De andere wijzigt nul rijen, gooit een fout en schrijft geen auditrij. Voordat een store wordt aangeroepen, weigert het domein al een stap die de toestandsmachine niet toestaat.",
  },
  sessions1: {
    en: "Commands travel on a Service Bus queue with sessions. The session id is the asset, so each asset has its own lane, and the receiver handles one message per session at a time, up to eight sessions at once. The message id is the idempotency key, so the queue drops a duplicate inside a 30 minute window. A message lives for one period, and an expired one goes to the dead letter queue. The queue exists only in the pro environment, which has never been applied. On the laptop an in-memory command channel stands in.",
    nl: "Commando's reizen over een Service Bus-wachtrij met sessies. Het session id is de asset, dus elke asset heeft een eigen rij, en de ontvanger handelt per sessie een bericht tegelijk af, tot acht sessies tegelijk. Het message id is de idempotency key, dus de wachtrij laat een dubbel bericht binnen een venster van 30 minuten vallen. Een bericht leeft een periode, en een verlopen bericht gaat naar de dead letter queue. De wachtrij bestaat alleen in de pro-omgeving, en die is nooit uitgerold. Op de laptop neemt een in-memory commandokanaal de plaats in.",
  },
  migration1: {
    en: "Several hosts migrate the schema when they start. Each one takes a PostgreSQL advisory lock first and releases it when it is done, so a second host waits until the first has migrated and then finds the schema current.",
    nl: "Meerdere hosts migreren het schema als ze starten. Elke host neemt eerst een advisory lock in PostgreSQL en geeft die vrij als hij klaar is, dus een tweede host wacht tot de eerste gemigreerd heeft en vindt dan een bijgewerkt schema.",
  },
  audit1: {
    en: "Every state change of a command writes its audit row in the same transaction as the change. A new command gets its creation row only when this call inserted it. The state machine has seven states and nine allowed transitions.",
    nl: "Elke statuswijziging van een commando schrijft zijn auditrij in dezelfde transactie als de wijziging. Een nieuw commando krijgt zijn aanmaakrij alleen als deze aanroep het invoegde. De toestandsmachine heeft zeven statussen en negen toegestane overgangen.",
  },
  statesAria: {
    en: "State diagram of a steering command with seven states and nine transitions",
    nl: "Toestandsdiagram van een stuurcommando met zeven statussen en negen overgangen",
  },
  statesCaption: {
    en: "The main path runs from Created to Confirmed. The dashed lines are the side exits to Rejected, Failed and Expired.",
    nl: "Het hoofdpad loopt van Created naar Confirmed. De gestippelde lijnen zijn de zijuitgangen naar Rejected, Failed en Expired.",
  },
  locks1: {
    en: "In the data path the code takes a lock in three places only: the lock statement in the in-memory telemetry, command, plan, price and switch stores, the Service Bus session lock per asset and the migration advisory lock. Compare-and-set and the unique keys are not locks. A losing transition changes zero rows and stops. A duplicate insert does nothing.",
    nl: "In het datapad neemt de code op drie plekken een lock: het lock statement in de in-memory stores voor telemetrie, commando's, plannen, prijzen en de schakelaar, de sessielock per asset in Service Bus en de advisory lock voor de migratie. Compare-and-set en de unieke sleutels zijn geen locks. Een verliezende overgang wijzigt nul rijen en stopt. Een dubbele insert doet niets.",
  },
  adaptersTitle: {
    en: "Database or memory, one port",
    nl: "Database of geheugen, een poort",
  },
  adaptersBody: {
    en: "The same use case runs on both adapters, and only the registration differs. The in-memory stores let the whole flow run on a laptop without a database. The Postgres stores carry the keys, conditions and transactions above into a shared database.",
    nl: "Dezelfde use case draait op beide adapters, alleen de registratie verschilt. Met de in-memory stores draait de hele flow op een laptop zonder database. De Postgres-stores brengen de sleutels, voorwaarden en transacties hierboven naar een gedeelde database.",
  },
  securityTitle: {
    en: "What keeps it clean of known vulnerabilities",
    nl: "Wat het vrij houdt van bekende kwetsbaarheden",
  },
  security1: {
    en: "This question was not asked either. I added it. Known advisories are gated: NuGet audit for the backend packages, Grype on every container image in CI, Semgrep on the code, Gitleaks over the history, Trivy on the Terraform, terraform test for the invariants and Dependabot for the updates.",
    nl: "Ook deze vraag werd niet gesteld. Ik voegde hem toe. Bekende advisories worden bewaakt door gates: NuGet audit voor de backendpakketten, Grype op elk container-image in CI, Semgrep op de code, Gitleaks over de historie, Trivy op de Terraform, terraform test voor de invarianten en Dependabot voor de updates.",
  },
  security2: {
    en: "Along the flow most hops have a control, and three findings stay accepted, as the sweep below shows. Each device has its own SAS key in the vault. The asset identity comes from the hub's connection device id and never from the message body. The parser never throws, its input is bounded, and readings are accepted within a window of 5 minutes ahead and 1 day back by default. Statements are parameterised, with one transaction per batch. The api runs on internal ingress, checks a bearer or Entra JWT, resolves the organisation once per request and caps raw reads at 86 400 rows. The dashboard holds a token bucket and a nonce CSP and signs in with PKCE. In the Terraform the queue accepts Entra identities only, and that has not been applied.",
    nl: "Langs de flow hebben de meeste stappen een controle, en drie bevindingen blijven geaccepteerd, zoals de sweep hieronder laat zien. Elk apparaat heeft een eigen SAS-sleutel in de kluis. De identiteit van de asset komt van het connection device id van de hub en nooit uit de berichtbody. De parser gooit nooit een fout, de invoer is begrensd, en metingen worden standaard geaccepteerd binnen een venster van 5 minuten vooruit en 1 dag terug. Statements zijn geparametriseerd, met een transactie per batch. De api draait op interne ingress, controleert een bearer of Entra JWT, bepaalt de organisatie een keer per verzoek en begrenst ruwe reads op 86 400 rijen. Het dashboard heeft een token bucket en een nonce CSP en meldt aan met PKCE. In de Terraform accepteert de wachtrij alleen Entra-identiteiten, en dat is nooit uitgerold.",
  },
  sweepIntro: {
    en: "On 2 October 2026 I swept the repository and this site for findings, S1 to S16. Each one has a final state.",
    nl: "Op 2 oktober 2026 liep ik de repository en deze site na op bevindingen, S1 tot en met S16. Elke bevinding heeft een eindstatus.",
  },
  sweepS1: {
    en: "S1, a device's self-declared asset kind trusted over the catalogue: fixed and proven in CI.",
    nl: "S1, een zelf opgegeven soort asset van een apparaat die boven de catalogus ging: opgelost en bewezen in CI.",
  },
  sweepS2: {
    en: "S2, this site on Next 16.3.4 with GHSA-vcvr-r3jv-pc5j in next/og: fixed in the site.",
    nl: "S2, deze site op Next 16.3.4 met GHSA-vcvr-r3jv-pc5j in next/og: opgelost in de site.",
  },
  sweepS3: {
    en: "S3, Next 16.3.6 and 16.3.4 with GHSA-cjq9-62q9-8jv4 and five moderate advisories: fixed in both on 16.3.8.",
    nl: "S3, Next 16.3.6 en 16.3.4 met GHSA-cjq9-62q9-8jv4 en vijf gemiddelde advisories: in beide opgelost op 16.3.8.",
  },
  sweepS4: {
    en: "S4, the laptop and CI database image 2.24.0 with CVE-2026-29089 and PostgreSQL 17.7: fixed on 2.30.2 with PostgreSQL 17.11, pinned by digest and proven in CI. Azure offers only 2.24.0, which stays a backlog row.",
    nl: "S4, het database-image 2.24.0 op laptop en in CI met CVE-2026-29089 en PostgreSQL 17.7: opgelost op 2.30.2 met PostgreSQL 17.11, vastgezet op digest en bewezen in CI. Azure biedt alleen 2.24.0, dat blijft een backlogregel.",
  },
  sweepS5: {
    en: "S5, brace-expansion advisories under eslint on this site: fixed in the site.",
    nl: "S5, advisories voor brace-expansion onder eslint op deze site: opgelost in de site.",
  },
  sweepS6: {
    en: "S6, the Terraform job red on AZU-0012 and AZU-0013, which hid new findings: fixed with a reason per ignored rule. The networks stay open until a pending decision.",
    nl: "S6, de Terraform-job rood op AZU-0012 en AZU-0013, waardoor nieuwe bevindingen verborgen bleven: opgelost met een reden per genegeerde regel. De netwerken blijven open tot een openstaand besluit.",
  },
  sweepS9: {
    en: "S9, pnpm 10.34.5 with GHSA-xcpc-8h2w-3j85: fixed on 10.34.6.",
    nl: "S9, pnpm 10.34.5 met GHSA-xcpc-8h2w-3j85: opgelost op 10.34.6.",
  },
  sweepS10: {
    en: "S10, no body limit on PUT /api/steering and the api's default of 30 MB: fixed with 1 KB on the route and 64 KB in Kestrel. The Next proxy may still buffer up to 10 MB, which is a backlog row.",
    nl: "S10, geen limiet op de body van PUT /api/steering en de standaard van 30 MB in de api: opgelost met 1 KB op de route en 64 KB in Kestrel. De Next-proxy kan nog tot 10 MB bufferen, dat is een backlogregel.",
  },
  sweepS11: {
    en: "S11, this site's CI on mutable action tags, Node 22, no Dependabot and no audit: fixed in the site.",
    nl: "S11, de CI van deze site op verplaatsbare action-tags, Node 22, zonder Dependabot en zonder audit: opgelost in de site.",
  },
  sweepS12: {
    en: "S12, Terraform 1.13.3, compose.yaml outside Dependabot and Semgrep 1.178.0: fixed and proven in CI.",
    nl: "S12, Terraform 1.13.3, compose.yaml buiten Dependabot en Semgrep 1.178.0: opgelost en bewezen in CI.",
  },
  sweepS13: {
    en: "S13, a deploy credential without a branch pin, no environment protection, no SECURITY.md and an SSL mode without a host name check: fixed in code with VerifyFull and a SECURITY.md. VerifyFull is proven at the next apply. The repository settings are mine to change.",
    nl: "S13, een deploy-credential zonder vaste branch, geen omgevingsbescherming, geen SECURITY.md en een SSL-modus zonder controle op de hostnaam: opgelost in code met VerifyFull en een SECURITY.md. VerifyFull is bewezen bij de volgende uitrol. De repository-instellingen zijn aan mij.",
  },
  sweepS14: {
    en: "S14, no diagnostic settings on PostgreSQL or Service Bus, and device strings unbounded in warning logs: fixed, with device strings bounded to 64 characters and the diagnostic settings added. Residual: Service Bus Standard has no login audit per attempt, and a login flood can fill the daily log cap.",
    nl: "S14, geen diagnostische instellingen op PostgreSQL of Service Bus, en onbegrensde apparaatteksten in waarschuwingslogs: opgelost, met apparaatteksten begrensd op 64 tekens en de diagnostische instellingen toegevoegd. Rest: Service Bus Standard heeft geen login-audit per poging, en een stroom aanmeldingen kan de dagelijkse loglimiet vullen.",
  },
  sweepS15: {
    en: "S15, the threat model and the version notes behind the repository: fixed.",
    nl: "S15, het threat model en de versienotities achter op de repository: opgelost.",
  },
  sweepAccepted: {
    en: "S7, S8 and S16 are accepted, as the next paragraph explains.",
    nl: "S7, S8 en S16 zijn geaccepteerd, zoals de volgende alinea uitlegt.",
  },
  accepted1: {
    en: "S7 means the database is reachable from every Azure tenant, logs in with a password and treats every app as its administrator. S8 means the gateway's events key also carries ServiceConnect, so a leaked events connection string can steer devices. The threat model names that key a steering credential. S16 is a list of smaller items, among them a sliding session without an absolute cap and a command that stays Created after a failed send. Each has its reason in the sweep, and the structural fixes for S7 and S8 are backlog rows.",
    nl: "S7 betekent dat de database bereikbaar is vanuit elke Azure-tenant, met een wachtwoord inlogt en elke app als beheerder ziet. S8 betekent dat de events-sleutel van de gateway ook ServiceConnect draagt, dus een gelekte events connection string kan apparaten sturen. Het threat model noemt die sleutel een stuurcredential. S16 is een lijst kleinere punten, waaronder een sliding session zonder absolute grens en een commando dat op Created blijft staan na een mislukte verzending. Elk punt heeft zijn reden in de sweep, en de structurele oplossingen voor S7 en S8 zijn backlogregels.",
  },
  bumps1: {
    en: "The dependency work of 20 October 2026 closed these advisories. In the dashboard sharp went to 0.35.5 against GHSA-wq5f-xc86-pv6w (CVE-2026-96889) and source-map-js to 1.2.2 against GHSA-68fv-2mgg-jv7q. In the backend System.Security.Cryptography.Xml and Pkcs are pinned to 10.0.13 against GHSA-c399-9853-6jmj, GHSA-r955-8q5j-3h83, GHSA-846f-f764-76mx and GHSA-2fmv-rv2c-59x7. The dashboard runtime image got a new zlib against CVE-2026-85091.",
    nl: "Het werk aan de dependencies van 20 oktober 2026 sloot deze advisories. In het dashboard ging sharp naar 0.35.5 tegen GHSA-wq5f-xc86-pv6w (CVE-2026-96889) en source-map-js naar 1.2.2 tegen GHSA-68fv-2mgg-jv7q. In de backend staan System.Security.Cryptography.Xml en Pkcs vast op 10.0.13 tegen GHSA-c399-9853-6jmj, GHSA-r955-8q5j-3h83, GHSA-846f-f764-76mx en GHSA-2fmv-rv2c-59x7. Het runtime-image van het dashboard kreeg een nieuwe zlib tegen CVE-2026-85091.",
  },
  bumps2: {
    en: "One advisory stays open, and only in development: GHSA-vfj7-8cjw-p6xm on braces 3.0.3 through eslint-config-next, which has no patched release yet. The production audit does not include it.",
    nl: "Een advisory blijft open, en alleen in development: GHSA-vfj7-8cjw-p6xm op braces 3.0.3 via eslint-config-next, waarvoor nog geen gepatchte release bestaat. De productie-audit bevat hem niet.",
  },
  cleanTitle: {
    en: "What clean means here",
    nl: "Wat schoon hier betekent",
  },
  cleanBody: {
    en: "The dashboard audit fails the build on high severity and above, and Grype checks every container image in CI. An advisory without a fix stays visible until one exists, like the one dev-only advisory above. That is the claim, and no more.",
    nl: "De dashboard-audit laat de build falen vanaf ernst high, en Grype controleert elk container-image in CI. Een advisory zonder oplossing blijft zichtbaar tot er een is, zoals de ene advisory hierboven die alleen in development zit. Dat is de claim, en niet meer.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "The answers share one habit. Each part sits behind a port, so the question of how to change it becomes which adapter to add. The data stays right through keys and conditions the database checks, and a lock appears only where a second writer has to wait.",
    nl: "De antwoorden delen een gewoonte. Elk deel zit achter een poort, dus de vraag hoe je het verandert, wordt welke adapter je toevoegt. De data blijft juist door sleutels en voorwaarden die de database controleert, en een lock verschijnt alleen waar een tweede schrijver moet wachten.",
  },
  close2: {
    en: "It is a proof of concept I built myself, and it never ran at a client. What it shows is how I reason about a platform like this, and that reasoning comes with me to the next one.",
    nl: "Het is een proof of concept dat ik zelf bouwde, en het heeft nooit bij een klant gedraaid. Het laat zien hoe ik over een platform als dit nadenk, en dat denken neem ik mee naar het volgende.",
  },
  quote: {
    en: "A port is a question you can answer later without rewriting what calls it.",
    nl: "Een poort is een vraag die je later beantwoordt zonder te herschrijven wat hem aanroept.",
  },
  nodeGateway: { en: "Gateway", nl: "Gateway" },
  nodeGatewaySub: { en: "one transaction per batch", nl: "een transactie per batch" },
  nodeHypertable: { en: "telemetry_readings", nl: "telemetry_readings" },
  nodeHypertableSub: { en: "hypertable, every reading", nl: "hypertable, elke meting" },
  nodeRollup: { en: "telemetry_15m", nl: "telemetry_15m" },
  nodeRollupSub: { en: "rollup written on ingest", nl: "rollup bij binnenkomst" },
  nodeCurrentState: { en: "asset_current_state", nl: "asset_current_state" },
  nodeCurrentStateSub: { en: "newest reading per asset", nl: "nieuwste meting per asset" },
  nodeApi: { en: "API", nl: "API" },
  nodeApiSub: { en: "weak ETag, 304", nl: "zwakke ETag, 304" },
  nodeRoutes: { en: "Dashboard routes", nl: "Dashboardroutes" },
  nodeRoutesSub: { en: "ETag passed on, 5 s cache", nl: "ETag doorgegeven, 5 s cache" },
  nodeBrowser: { en: "Browser", nl: "Browser" },
  nodeBrowserSub: { en: "polls every 10 s", nl: "pollt elke 10 s" },
  stateCreated: { en: "Created", nl: "Created" },
  stateSent: { en: "Sent", nl: "Sent" },
  stateAcknowledged: { en: "Acknowledged", nl: "Acknowledged" },
  stateConfirmed: { en: "Confirmed", nl: "Confirmed" },
  stateRejected: { en: "Rejected", nl: "Rejected" },
  stateFailed: { en: "Failed", nl: "Failed" },
  stateExpired: { en: "Expired", nl: "Expired" },
} as const;
