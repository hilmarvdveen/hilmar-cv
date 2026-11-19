import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, InlineCode } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { ProseTable } from "./ProseTable";
import { ProseDetails } from "./ProseDetails";
import { FlowDiagram } from "./FlowDiagram";
import { FileTree, type FileNode } from "./FileTree";
import { SmartEnergyPosterExplainer } from "./SmartEnergyPosterExplainer";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "smart-energy-steering-architecture",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-10-02",
  updatedDate: "2026-11-19",
  readingTimeMin: 13,
  title: {
    en: "One drawing, five questions about a steering platform",
    nl: "Een tekening, vijf vragen over een stuurplatform",
  },
  description: {
    en: "My own proof of concept that plans a battery against day-ahead prices and steers it every 15 minutes, built on Azure in two weeks. How each part works.",
    nl: "Mijn eigen proof of concept dat een batterij plant op day-ahead prijzen en elke 15 minuten stuurt, in twee weken gebouwd op Azure. Hoe elk deel werkt.",
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

const MECHANISMS = [
  { copy: "duplicate1", code: "ON CONFLICT (asset_id, measured_at) DO NOTHING" },
  { copy: "late1", code: "WHERE excluded.measured_at > asset_current_state.measured_at" },
  { copy: "idempotency1", code: "ON CONFLICT (idempotency_key) DO NOTHING" },
  { copy: "compare1", code: "row.State == stateBeforeTheMove" },
  { copy: "sessions1", code: "SessionId = command.AssetId.Value" },
  { copy: "migration1", code: "SELECT pg_advisory_lock(@key)" },
] as const;

const SWEEP = [
  {
    id: "S1",
    finding: { en: "A device's self-declared asset kind trusted over the catalogue", nl: "Een zelf opgegeven soort asset van een apparaat die boven de catalogus ging" },
    state: { en: "Fixed and proven in CI", nl: "Opgelost en bewezen in CI" },
  },
  {
    id: "S2",
    finding: { en: "This site on Next 16.3.4 with an advisory in next/og", nl: "Deze site op Next 16.3.4 met een advisory in next/og" },
    state: { en: "Fixed in the site", nl: "Opgelost in de site" },
  },
  {
    id: "S3",
    finding: { en: "Next 16.3.6 and 16.3.4 with six advisories", nl: "Next 16.3.6 en 16.3.4 met zes advisories" },
    state: { en: "Fixed in both on 16.3.8", nl: "In beide opgelost op 16.3.8" },
  },
  {
    id: "S4",
    finding: { en: "The laptop and CI database image 2.24.0 with PostgreSQL 17.7", nl: "Het database-image 2.24.0 op laptop en in CI met PostgreSQL 17.7" },
    state: {
      en: "Fixed on 2.30.2 with PostgreSQL 17.11, pinned by digest and proven in CI. Azure offers only 2.24.0, a backlog row",
      nl: "Opgelost op 2.30.2 met PostgreSQL 17.11, vastgezet op digest en bewezen in CI. Azure biedt alleen 2.24.0, een backlogregel",
    },
  },
  {
    id: "S5",
    finding: { en: "Brace-expansion advisories under eslint on this site", nl: "Advisories voor brace-expansion onder eslint op deze site" },
    state: { en: "Fixed in the site", nl: "Opgelost in de site" },
  },
  {
    id: "S6",
    finding: { en: "The Terraform job red on two rules, which hid new findings", nl: "De Terraform-job rood op twee regels, waardoor nieuwe bevindingen verborgen bleven" },
    state: {
      en: "Fixed with a reason per ignored rule. The networks stay open until a pending decision",
      nl: "Opgelost met een reden per genegeerde regel. De netwerken blijven open tot een openstaand besluit",
    },
  },
  {
    id: "S7",
    finding: {
      en: "The database reachable from every Azure tenant, logging in with a password and treating every app as its administrator",
      nl: "De database bereikbaar vanuit elke Azure-tenant, met een wachtwoord als login en elke app als beheerder",
    },
    state: { en: "Accepted. The structural fix is a backlog row", nl: "Geaccepteerd. De structurele oplossing is een backlogregel" },
  },
  {
    id: "S8",
    finding: {
      en: "The gateway's events key also carries ServiceConnect, so a leaked events connection string can steer devices",
      nl: "De events-sleutel van de gateway draagt ook ServiceConnect, dus een gelekte events connection string kan apparaten sturen",
    },
    state: {
      en: "Accepted. The threat model names that key a steering credential, and the structural fix is a backlog row",
      nl: "Geaccepteerd. Het threat model noemt die sleutel een stuurcredential, en de structurele oplossing is een backlogregel",
    },
  },
  {
    id: "S9",
    finding: { en: "pnpm 10.34.5 with an advisory", nl: "pnpm 10.34.5 met een advisory" },
    state: { en: "Fixed on 10.34.6", nl: "Opgelost op 10.34.6" },
  },
  {
    id: "S10",
    finding: { en: "No body limit on PUT /api/steering and the api's default of 30 MB", nl: "Geen limiet op de body van PUT /api/steering en de standaard van 30 MB in de api" },
    state: {
      en: "Fixed with 1 KB on the route and 64 KB in Kestrel. The Next proxy may still buffer up to 10 MB, a backlog row",
      nl: "Opgelost met 1 KB op de route en 64 KB in Kestrel. De Next-proxy kan nog tot 10 MB bufferen, een backlogregel",
    },
  },
  {
    id: "S11",
    finding: { en: "This site's CI on mutable action tags, Node 22, no Dependabot and no audit", nl: "De CI van deze site op verplaatsbare action-tags, Node 22, zonder Dependabot en zonder audit" },
    state: { en: "Fixed in the site", nl: "Opgelost in de site" },
  },
  {
    id: "S12",
    finding: { en: "Terraform 1.13.3, compose.yaml outside Dependabot and Semgrep 1.178.0", nl: "Terraform 1.13.3, compose.yaml buiten Dependabot en Semgrep 1.178.0" },
    state: { en: "Fixed and proven in CI", nl: "Opgelost en bewezen in CI" },
  },
  {
    id: "S13",
    finding: {
      en: "A deploy credential without a branch pin, no environment protection, no SECURITY.md and an SSL mode without a host name check",
      nl: "Een deploy-credential zonder vaste branch, geen omgevingsbescherming, geen SECURITY.md en een SSL-modus zonder controle op de hostnaam",
    },
    state: {
      en: "Fixed in code with VerifyFull and a SECURITY.md. VerifyFull is proven at the next apply. The repository settings are mine to change",
      nl: "Opgelost in code met VerifyFull en een SECURITY.md. VerifyFull is bewezen bij de volgende uitrol. De repository-instellingen zijn aan mij",
    },
  },
  {
    id: "S14",
    finding: {
      en: "No diagnostic settings on PostgreSQL or Service Bus, and device strings unbounded in warning logs",
      nl: "Geen diagnostische instellingen op PostgreSQL of Service Bus, en onbegrensde apparaatteksten in waarschuwingslogs",
    },
    state: {
      en: "Fixed, with device strings bounded to 64 characters and the diagnostic settings added. Residual: Service Bus Standard has no login audit per attempt, and a login flood can fill the daily log cap",
      nl: "Opgelost, met apparaatteksten begrensd op 64 tekens en de diagnostische instellingen toegevoegd. Rest: Service Bus Standard heeft geen login-audit per poging, en een stroom aanmeldingen kan de dagelijkse loglimiet vullen",
    },
  },
  {
    id: "S15",
    finding: { en: "The threat model and the version notes behind the repository", nl: "Het threat model en de versienotities achter op de repository" },
    state: { en: "Fixed", nl: "Opgelost" },
  },
  {
    id: "S16",
    finding: {
      en: "Smaller items, among them a sliding session without an absolute cap and a command that stays Created after a failed send",
      nl: "Kleinere punten, waaronder een sliding session zonder absolute grens en een commando dat op Created blijft staan na een mislukte verzending",
    },
    state: { en: "Accepted, each with its reason in the sweep", nl: "Geaccepteerd, elk met zijn reden in de sweep" },
  },
] as const;

const TERMS = [
  {
    term: { en: "Day-ahead prices", nl: "Day-ahead prijzen" },
    meaning: { en: "tomorrow's electricity prices, known a day ahead. The planner reads them every hour.", nl: "de stroomprijzen van morgen, een dag vooruit bekend. De planner leest ze elk uur." },
  },
  {
    term: { en: "Telemetry", nl: "Telemetrie" },
    meaning: { en: "the readings a device sends, such as the state of a battery.", nl: "de metingen die een apparaat stuurt, zoals de stand van een batterij." },
  },
  {
    term: { en: "Asset", nl: "Asset" },
    meaning: {
      en: "one device. Here a battery, an EV charger, a PV inverter or a heat pump, all simulated.",
      nl: "een apparaat. Hier een batterij, een laadpaal, een PV-omvormer of een warmtepomp, allemaal gesimuleerd.",
    },
  },
  {
    term: { en: "IoT Hub", nl: "IoT Hub" },
    meaning: { en: "the Azure service devices connect to, with one identity per device.", nl: "de Azure-dienst waar apparaten mee verbinden, met een identiteit per apparaat." },
  },
  {
    term: { en: "Hypertable and rollup", nl: "Hypertable en rollup" },
    meaning: {
      en: "the TimescaleDB table for time series, and the readings summed per 15 minutes so a chart does not scan every reading.",
      nl: "de TimescaleDB-tabel voor tijdreeksen, en de metingen opgeteld per 15 minuten zodat een grafiek niet elke meting doorzoekt.",
    },
  },
  {
    term: { en: "ETag and 304", nl: "ETag en 304" },
    meaning: {
      en: "a version tag on an answer. The browser asks whether it changed, and a 304 means nothing changed and nothing is sent.",
      nl: "een versielabel op een antwoord. De browser vraagt of het veranderde, en een 304 betekent dat er niets veranderde en niets verstuurd wordt.",
    },
  },
  {
    term: { en: "Idempotency key", nl: "Idempotency key" },
    meaning: {
      en: "the fingerprint of a command, made of the asset, the period and the plan version, so a second run issues nothing new.",
      nl: "de vingerafdruk van een commando, gemaakt van de asset, de periode en de planversie, zodat een tweede run niets nieuws uitgeeft.",
    },
  },
  {
    term: { en: "Compare-and-set", nl: "Compare-and-set" },
    meaning: { en: "an update that changes a row only while it is still in the expected state.", nl: "een update die een rij alleen wijzigt zolang die nog in de verwachte status staat." },
  },
  {
    term: { en: "Advisory lock", nl: "Advisory lock" },
    meaning: { en: "a named lock in PostgreSQL that makes a second host wait.", nl: "een benoemde lock in PostgreSQL die een tweede host laat wachten." },
  },
  {
    term: { en: "Port and adapter", nl: "Poort en adapter" },
    meaning: {
      en: "an interface the core owns, with an implementation you can swap, in memory or on Azure.",
      nl: "een interface die de kern bezit, met een implementatie die je kunt wisselen, in het geheugen of op Azure.",
    },
  },
  {
    term: { en: "KEDA", nl: "KEDA" },
    meaning: { en: "scales the gateway on the length of the queue.", nl: "schaalt de gateway op de lengte van de wachtrij." },
  },
  {
    term: { en: "Managed identity", nl: "Managed identity" },
    meaning: { en: "an Azure login for a service, without a password in the code.", nl: "een Azure-login voor een dienst, zonder wachtwoord in de code." },
  },
] as const;

const FRAME_FUNCTION_CODE = `
export const filmFrameAtMilliseconds = (elapsed: number): FilmFrame => {
  const wrapped = wrapFilmElapsed(elapsed);
  const sceneIndex = filmSceneIndexAt(wrapped);
  const scene = FILM_SCENES[sceneIndex];
  const sceneElapsed = wrapped - scene.startMilliseconds;
  const previous = FILM_SCENES[(sceneIndex - 1 + FILM_SCENES.length) % FILM_SCENES.length];
  const camera = interpolateCamera(SCENE_CAMERA[previous.id], SCENE_CAMERA[scene.id], sceneElapsed / CAMERA_MOVE_MILLISECONDS);
  ...
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

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const caching = buildCachingDiagram(locale);
  const states = buildStateDiagram(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <SmartEnergyPosterExplainer locale={locale} />
      <P>{copy.scope[locale]}</P>
      <P>{copy.proof[locale]}</P>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>

      <H2>{copy.householdTitle[locale]}</H2>
      <P>{copy.household1[locale]}</P>
      <P>{copy.household2[locale]}</P>
      <ProseDetails summary={copy.termsSummary[locale]}>
        <UL>
          {TERMS.map((entry) => (
            <LI key={entry.term.en}>
              {entry.term[locale]}: {entry.meaning[locale]}
            </LI>
          ))}
        </UL>
      </ProseDetails>

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

      <H2>{copy.diagramTitle[locale]}</H2>
      <P>{copy.diagram1[locale]}</P>
      <P>{copy.diagram2[locale]}</P>
      <CodeBlock lang="ts" filename="src/lib/smartEnergyFilm/film.ts" code={FRAME_FUNCTION_CODE} />
      <P>{copy.diagram3[locale]}</P>

      <H2>{copy.assistantTitle[locale]}</H2>
      <P>{copy.assistant1[locale]}</P>
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

      <H2>{copy.dataTitle[locale]}</H2>
      <P>{copy.data1[locale]}</P>
      <P>{copy.data2[locale]}</P>
      <OL>
        {MECHANISMS.map((mechanism) => (
          <LI key={mechanism.copy}>
            {copy[mechanism.copy][locale]} <InlineCode>{mechanism.code}</InlineCode>
          </LI>
        ))}
      </OL>
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
      <ProseTable
        caption={copy.sweepCaption[locale]}
        columns={[copy.sweepFindingColumn[locale], copy.sweepWhatColumn[locale], copy.sweepStateColumn[locale]]}
        rows={SWEEP.map((row) => ({ term: row.id, cells: [row.finding[locale], row.state[locale]] }))}
      />
      <ProseDetails summary={copy.referencesSummary[locale]}>
        <P>{copy.references[locale]}</P>
        <P>{copy.bumps1[locale]}</P>
        <P>{copy.bumps2[locale]}</P>
      </ProseDetails>
      <P>{copy.clean[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
    </>
  );
}

const COPY = {
  lead: {
    en: "A platform that reads simulated energy devices, plans a battery against tomorrow's electricity prices and sends it a command every 15 minutes. I built it as my own proof of concept in two weeks in September and October 2026, on my own Azure subscription, with Claude Code under my direction and review.",
    nl: "Een platform dat gesimuleerde energieapparaten uitleest, een batterij plant op de stroomprijzen van morgen en die elke 15 minuten een commando stuurt. Ik bouwde het als eigen proof of concept in twee weken in september en oktober 2026, op mijn eigen Azure-abonnement, met Claude Code onder mijn regie en review.",
  },
  scope: {
    en: "It never ran at a client, and no client system appears in it. Nothing in it was measured, so no number here describes speed or load. The infrastructure was applied once to dev on 29 September 2026 and destroyed the same morning. Pro was never applied.",
    nl: "Het heeft nooit bij een klant gedraaid, en er komt geen systeem van een klant in voor. Er is niets gemeten, dus geen getal hier beschrijft snelheid of belasting. De infrastructuur is een keer op dev uitgerold op 29 september 2026 en dezelfde ochtend weer afgebroken. Pro is nooit uitgerold.",
  },
  proof: {
    en: "The repository holds 904 backend tests, 439 dashboard tests and two Playwright journeys, and CI ran green on both commits this post describes.",
    nl: "De repository bevat 904 backendtests, 439 dashboardtests en twee Playwright-journeys, en CI draaide groen op beide commits die dit artikel beschrijft.",
  },
  intro1: {
    en: "The post answers five questions about it in turn. How does another asset kind get in? How do you keep often-read data cheap? How do the diagrams stay customizable? Where would an assistant fit? How does it scale? Two more sections follow: how the data stays consistent, and what keeps the code clean of known vulnerabilities.",
    nl: "Het artikel beantwoordt er vijf vragen over, een voor een. Hoe komt er een andere soort asset bij? Hoe houd je vaak gelezen data goedkoop? Hoe blijven de diagrammen aanpasbaar? Waar past een assistent? Hoe schaalt het? Daarna volgen twee delen: hoe de data consistent blijft, en wat de code vrij houdt van bekende kwetsbaarheden.",
  },
  intro2: {
    en: "The simulator models a battery, an EV charger, a PV inverter and a heat pump, each with its own device identity in IoT Hub. A gateway stores the readings in PostgreSQL with TimescaleDB, an api serves them and a server-rendered dashboard shows them. An hourly planner and a steering job every 15 minutes turn day-ahead prices into commands for the battery.",
    nl: "De simulator modelleert een batterij, een laadpaal, een PV-omvormer en een warmtepomp, elk met een eigen apparaatidentiteit in IoT Hub. Een gateway slaat de metingen op in PostgreSQL met TimescaleDB, een api serveert ze en een server-rendered dashboard toont ze. Een planner die elk uur draait en een stuurjob die elke 15 minuten draait, maken van day-ahead prijzen commando's voor de batterij.",
  },
  householdTitle: {
    en: "What the household sees",
    nl: "Wat het huishouden ziet",
  },
  household1: {
    en: "The household opens a dashboard that the server renders. It shows the site with the current state of each asset, a power chart and a plan chart, the commands with their status, and the savings.",
    nl: "Het huishouden opent een dashboard dat de server rendert. Het toont de site met de actuele stand van elke asset, een vermogensgrafiek en een plangrafiek, de commando's met hun status, en de besparing.",
  },
  household2: {
    en: "Confirmed means the next reading shows the battery carried out the command. A switch behind PUT /api/steering turns steering off.",
    nl: "Confirmed betekent dat de volgende meting laat zien dat de batterij het commando uitvoerde. Een schakelaar achter PUT /api/steering zet de sturing uit.",
  },
  termsSummary: {
    en: "Terms used in this post",
    nl: "Begrippen in dit artikel",
  },
  sweepCaption: {
    en: "Findings and their final state",
    nl: "Bevindingen en hun eindstatus",
  },
  sweepFindingColumn: {
    en: "Finding",
    nl: "Bevinding",
  },
  sweepWhatColumn: {
    en: "What it was",
    nl: "Wat het was",
  },
  sweepStateColumn: {
    en: "Final state",
    nl: "Eindstatus",
  },
  referencesSummary: {
    en: "Advisory references and the dependency work",
    nl: "Advisory-referenties en het dependency-werk",
  },
  references: {
    en: "S2 is GHSA-vcvr-r3jv-pc5j in next/og. S3 is GHSA-cjq9-62q9-8jv4 with five moderate advisories. S4 is CVE-2026-29089. S6 is AZU-0012 and AZU-0013. S9 is GHSA-xcpc-8h2w-3j85.",
    nl: "S2 is GHSA-vcvr-r3jv-pc5j in next/og. S3 is GHSA-cjq9-62q9-8jv4 met vijf gemiddelde advisories. S4 is CVE-2026-29089. S6 is AZU-0012 en AZU-0013. S9 is GHSA-xcpc-8h2w-3j85.",
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
    en: "Beyond that ETag the api caches nothing, because in-memory caches do not scale as they are once there is more than one replica. The next steps, in order of cost: TimescaleDB continuous aggregates, response caching at the ingress or Front Door keyed on the ETag, Azure Cache for Redis once more than one dashboard replica exists, and push instead of poll. The repository lists chart performance on a day of ten-second samples as a risk not yet felt.",
    nl: "Buiten die ETag cachet de api niets, omdat caches in het geheugen niet schalen zoals ze zijn zodra er meer dan een replica is. De volgende stappen, in volgorde van kosten: continuous aggregates in TimescaleDB, response caching bij de ingress of Front Door op basis van de ETag, Azure Cache for Redis zodra er meer dan een dashboardreplica is, en push in plaats van poll. De repository noemt de prestaties van een grafiek over een dag met samples van tien seconden als risico dat nog niet gevoeld is.",
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
    en: "This answer is design only. The seventh decision in the repository reads: No AI or model call anywhere. The README forbids claiming what was not built, and nothing of an assistant is coded.",
    nl: "Dit antwoord is alleen ontwerp. Het zevende besluit in de repository luidt: No AI or model call anywhere. De README verbiedt te claimen wat niet gebouwd is, en er is niets van een assistent gecodeerd.",
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
    en: "The levers go in three directions, plus the parts that would not scale as they are. The replica count in the Scale tab of the drawing is the lever, not a result.",
    nl: "De knoppen gaan drie kanten op, plus de delen die zoals ze zijn niet schalen. Het aantal replica's in het tabblad Schalen van de tekening is de knop, geen resultaat.",
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
    en: "The drawing shows data moving, and the question that follows is what keeps it right. The data lives in PostgreSQL with TimescaleDB, or in memory on a laptop. Every store sits behind one port with both adapters. The Postgres adapters are scoped and wrap each write in one transaction. The in-memory adapters are singletons, and the telemetry, command, plan, price and switch stores take a lock statement around each read and write.",
    nl: "De tekening laat data bewegen, en de vraag die dan volgt is wat die data juist houdt. De data staat in PostgreSQL met TimescaleDB, of in het geheugen op een laptop. Elke store zit achter een poort met beide adapters. De Postgres-adapters zijn scoped en zetten elke schrijfactie in een transactie. De in-memory adapters zijn singletons, en de stores voor telemetrie, commando's, plannen, prijzen en de schakelaar nemen een lock statement rond elke lees- en schrijfactie.",
  },
  data2: {
    en: "Which one runs depends on the host. The api picks Postgres when a connection string exists and in-memory otherwise. The gateway, the planner and the steering job register in-memory first and Postgres when configured. Retention runs on Postgres only, and the persistence tests run against a real database in Testcontainers. Six mechanisms keep the data right.",
    nl: "Welke draait, hangt af van de host. De api kiest Postgres als er een connection string is en anders in-memory. De gateway, de planner en de stuurjob registreren eerst in-memory en Postgres als die is ingesteld. Retentie draait alleen op Postgres, en de persistence-tests draaien tegen een echte database in Testcontainers. Zes mechanismen houden de data juist.",
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
    en: "Commands for one asset must arrive in order, and a duplicate must not arrive twice. Commands travel on a Service Bus queue with sessions. The session id is the asset, so each asset has its own lane, and the receiver handles one message per session at a time, up to eight sessions at once. The message id is the idempotency key, so the queue drops a duplicate inside a 30 minute window. A message lives for one period, and an expired one goes to the dead letter queue. The queue exists only in the pro environment, which has never been applied. On the laptop an in-memory command channel stands in.",
    nl: "Commando's voor een asset moeten op volgorde aankomen, en een dubbel commando mag niet twee keer aankomen. Commando's reizen over een Service Bus-wachtrij met sessies. Het session id is de asset, dus elke asset heeft een eigen rij, en de ontvanger handelt per sessie een bericht tegelijk af, tot acht sessies tegelijk. Het message id is de idempotency key, dus de wachtrij laat een dubbel bericht binnen een venster van 30 minuten vallen. Een bericht leeft een periode, en een verlopen bericht gaat naar de dead letter queue. De wachtrij bestaat alleen in de pro-omgeving, en die is nooit uitgerold. Op de laptop neemt een in-memory commandokanaal de plaats in.",
  },
  migration1: {
    en: "Two hosts can start at once and both try to migrate the schema. Each one takes a PostgreSQL advisory lock first and releases it when it is done, so a second host waits until the first has migrated and then finds the schema current.",
    nl: "Twee hosts kunnen tegelijk starten en allebei het schema willen migreren. Elke host neemt eerst een advisory lock in PostgreSQL en geeft die vrij als hij klaar is, dus een tweede host wacht tot de eerste gemigreerd heeft en vindt dan een bijgewerkt schema.",
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
    en: "Known advisories are gated: NuGet audit for the backend packages, Grype on every container image in CI, Semgrep on the code, Gitleaks over the history, Trivy on the Terraform, terraform test for the invariants and Dependabot for the updates.",
    nl: "Bekende advisories worden bewaakt door gates: NuGet audit voor de backendpakketten, Grype op elk container-image in CI, Semgrep op de code, Gitleaks over de historie, Trivy op de Terraform, terraform test voor de invarianten en Dependabot voor de updates.",
  },
  security2: {
    en: "Along the flow most hops have a control, and three findings stay accepted, as the sweep below shows. Each device has its own SAS key in the vault. The asset identity comes from the hub's connection device id and never from the message body. The parser never throws, its input is bounded, and readings are accepted within a window of 5 minutes ahead and 1 day back by default. Statements are parameterised, with one transaction per batch. The api runs on internal ingress, checks a bearer or Entra JWT, resolves the organisation once per request and caps raw reads at 86 400 rows. The dashboard holds a token bucket and a nonce CSP and signs in with PKCE. In the Terraform the queue accepts Entra identities only, and that has not been applied.",
    nl: "Langs de flow hebben de meeste stappen een controle, en drie bevindingen blijven geaccepteerd, zoals de sweep hieronder laat zien. Elk apparaat heeft een eigen SAS-sleutel in de kluis. De identiteit van de asset komt van het connection device id van de hub en nooit uit de berichtbody. De parser gooit nooit een fout, de invoer is begrensd, en metingen worden standaard geaccepteerd binnen een venster van 5 minuten vooruit en 1 dag terug. Statements zijn geparametriseerd, met een transactie per batch. De api draait op interne ingress, controleert een bearer of Entra JWT, bepaalt de organisatie een keer per verzoek en begrenst ruwe reads op 86 400 rijen. Het dashboard heeft een token bucket en een nonce CSP en meldt aan met PKCE. In de Terraform accepteert de wachtrij alleen Entra-identiteiten, en dat is nooit uitgerold.",
  },
  sweepIntro: {
    en: "On 2 October 2026 I swept the repository and this site for findings, S1 to S16.",
    nl: "Op 2 oktober 2026 liep ik de repository en deze site na op bevindingen, S1 tot en met S16.",
  },
  bumps1: {
    en: "The dependency work of 20 October 2026 closed these advisories. In the dashboard sharp went to 0.35.5 against GHSA-wq5f-xc86-pv6w (CVE-2026-96889) and source-map-js to 1.2.2 against GHSA-68fv-2mgg-jv7q. In the backend System.Security.Cryptography.Xml and Pkcs are pinned to 10.0.13 against GHSA-c399-9853-6jmj, GHSA-r955-8q5j-3h83, GHSA-846f-f764-76mx and GHSA-2fmv-rv2c-59x7. The dashboard runtime image got a new zlib against CVE-2026-85091.",
    nl: "Het werk aan de dependencies van 20 oktober 2026 sloot deze advisories. In het dashboard ging sharp naar 0.35.5 tegen GHSA-wq5f-xc86-pv6w (CVE-2026-96889) en source-map-js naar 1.2.2 tegen GHSA-68fv-2mgg-jv7q. In de backend staan System.Security.Cryptography.Xml en Pkcs vast op 10.0.13 tegen GHSA-c399-9853-6jmj, GHSA-r955-8q5j-3h83, GHSA-846f-f764-76mx en GHSA-2fmv-rv2c-59x7. Het runtime-image van het dashboard kreeg een nieuwe zlib tegen CVE-2026-85091.",
  },
  bumps2: {
    en: "One advisory stayed open on 20 October 2026, only in development: GHSA-vfj7-8cjw-p6xm on braces 3.0.3 through eslint-config-next. GitHub withdrew it on 23 October 2026.",
    nl: "Een advisory bleef op 20 oktober 2026 open, alleen in development: GHSA-vfj7-8cjw-p6xm op braces 3.0.3 via eslint-config-next. GitHub trok hem op 23 oktober 2026 in.",
  },
  clean: {
    en: "The dashboard audit fails the build on high severity and above, and Grype checks every container image in CI. An advisory without a fix stays visible until one exists.",
    nl: "De dashboard-audit laat de build falen vanaf ernst high, en Grype controleert elk container-image in CI. Een advisory zonder oplossing blijft zichtbaar tot er een is.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "The answers share one habit. Each part sits behind a port, so the question of how to change it becomes which adapter to add. The data stays right through keys and conditions the database checks, and a lock appears only where a second writer has to wait. A port is a question you can answer later without rewriting what calls it.",
    nl: "De antwoorden delen een gewoonte. Elk deel zit achter een poort, dus de vraag hoe je het verandert, wordt welke adapter je toevoegt. De data blijft juist door sleutels en voorwaarden die de database controleert, en een lock verschijnt alleen waar een tweede schrijver moet wachten. Een poort is een vraag die je later beantwoordt zonder te herschrijven wat hem aanroept.",
  },
  close2: {
    en: "It is a proof of concept I built myself, and it never ran at a client. What it shows is how I reason about a platform like this, and that reasoning comes with me to the next one.",
    nl: "Het is een proof of concept dat ik zelf bouwde, en het heeft nooit bij een klant gedraaid. Het laat zien hoe ik over een platform als dit nadenk, en dat denken neem ik mee naar het volgende.",
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
