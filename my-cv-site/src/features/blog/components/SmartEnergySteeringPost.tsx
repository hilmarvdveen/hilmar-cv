import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, InlineCode } from "./prose";
import { ProseDetails } from "./ProseDetails";
import { FileTree, type FileNode } from "./FileTree";
import { SmartEnergyPosterExplainer } from "./SmartEnergyPosterExplainer";
import { ApiFigure, HexagonFigure, PipelineFigure, StaticBeat } from "./smartEnergyGuide";

export const meta: BlogPostMeta = {
  slug: "smart-energy-steering-architecture",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-10-02",
  updatedDate: "2026-11-19",
  readingTimeMin: 16,
  title: {
    en: "How to build an energy steering platform on Azure",
    nl: "Een energiestuurplatform bouwen op Azure",
  },
  description: {
    en: "A hexagonal .NET core, IoT Hub, PostgreSQL, a React dashboard, Terraform tests and GitHub Actions: how an energy steering platform is built and why.",
    nl: "Een hexagonale .NET-kern, IoT Hub, PostgreSQL, een React-dashboard, Terraform-tests en GitHub Actions: hoe een energiestuurplatform gebouwd is en waarom.",
  },
  excerpt: {
    en: "A guide through my own proof of concept that steers a battery on Azure: the hexagonal core and its adapters, how readings and commands flow, what happens when everything runs at once, the React frontend, security, Terraform and the pipelines.",
    nl: "Een gids door mijn eigen proof of concept dat een batterij stuurt op Azure: de hexagonale kern en zijn adapters, hoe metingen en commando's stromen, wat er gebeurt als alles tegelijk draait, de React-frontend, beveiliging, Terraform en de pipelines.",
  },
  keywords: [
    "energy steering architecture",
    "hexagonal architecture",
    "ports and adapters",
    "Azure IoT Hub",
    "Azure Container Apps",
    "TimescaleDB",
    "Next.js dashboard",
    "terraform test",
    "GitHub Actions OIDC",
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
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <SmartEnergyPosterExplainer locale={locale} />

      <H2>{copy.shapeTitle[locale]}</H2>
      <P>{copy.shape1[locale]}</P>
      <P>{copy.shape2[locale]}</P>
      <HexagonFigure locale={locale} />
      <P>{copy.shape3[locale]}</P>
      <P>{copy.shape4[locale]}</P>
      <P>{copy.kind1[locale]}</P>
      <FileTree tree={buildTouchPoints(locale)} caption={copy.kindTreeCaption[locale]} />
      <P>{copy.kind2[locale]}</P>
      <ProseDetails summary={copy.termsSummary[locale]}>
        <UL>
          {TERMS.map((entry) => (
            <LI key={entry.term.en}>
              {entry.term[locale]}: {entry.meaning[locale]}
            </LI>
          ))}
        </UL>
      </ProseDetails>

      <H2>{copy.flowTitle[locale]}</H2>
      <P>{copy.flow1[locale]}</P>
      <P>{copy.flow2[locale]}</P>
      <P>{copy.flow3[locale]}</P>
      <StaticBeat locale={locale} tab="reading" beat="transaction" />
      <P>{copy.flow4[locale]}</P>
      <P>{copy.planner1[locale]}</P>
      <P>{copy.flow5[locale]}</P>
      <StaticBeat locale={locale} tab="command" beat="confirm" />
      <P>{copy.flow6[locale]}</P>
      <P>{copy.failure1[locale]}</P>
      <P>{copy.failure2[locale]}</P>

      <H2>{copy.onceTitle[locale]}</H2>
      <P>{copy.once1[locale]}</P>
      <StaticBeat locale={locale} tab="safety" beat="audit" />
      <P>{copy.once2[locale]}</P>
      <P>{copy.once3[locale]}</P>
      <OL>
        {MECHANISMS.map((mechanism) => (
          <LI key={mechanism.copy}>
            {copy[mechanism.copy][locale]} <InlineCode>{mechanism.code}</InlineCode>
          </LI>
        ))}
      </OL>
      <P>{copy.once4[locale]}</P>
      <P>{copy.once5[locale]}</P>

      <H2>{copy.apiTitle[locale]}</H2>
      <P>{copy.api1[locale]}</P>
      <ApiFigure locale={locale} />
      <P>{copy.api2[locale]}</P>
      <P>{copy.api3[locale]}</P>

      <H2>{copy.frontTitle[locale]}</H2>
      <P>{copy.front1[locale]}</P>
      <P>{copy.front2[locale]}</P>
      <StaticBeat locale={locale} tab="customer" beat="notModified" />
      <P>{copy.front3[locale]}</P>
      <P>{copy.front4[locale]}</P>

      <H2>{copy.securityTitle[locale]}</H2>
      <P>{copy.security1[locale]}</P>
      <P>{copy.security2[locale]}</P>
      <P>{copy.security3[locale]}</P>
      <P>{copy.security4[locale]}</P>
      <StaticBeat locale={locale} tab="cloud" beat="gates" />
      <P>{copy.security5[locale]}</P>
      <P>{copy.security6[locale]}</P>

      <H2>{copy.terraformTitle[locale]}</H2>
      <P>{copy.terraform1[locale]}</P>
      <P>{copy.terraform2[locale]}</P>
      <UL>
        <LI>{copy.invariantIngress[locale]}</LI>
        <LI>{copy.invariantReplicas[locale]}</LI>
        <LI>{copy.invariantQueue[locale]}</LI>
        <LI>{copy.invariantPro[locale]}</LI>
        <LI>{copy.invariantSteering[locale]}</LI>
        <LI>{copy.invariantBudget[locale]}</LI>
      </UL>
      <P>{copy.terraform3[locale]}</P>
      <P>{copy.terraform4[locale]}</P>

      <H2>{copy.pipelineTitle[locale]}</H2>
      <P>{copy.pipeline1[locale]}</P>
      <P>{copy.pipeline2[locale]}</P>
      <PipelineFigure locale={locale} />
      <P>{copy.pipeline3[locale]}</P>

      <H2>{copy.containersTitle[locale]}</H2>
      <P>{copy.containers1[locale]}</P>
      <P>{copy.containers2[locale]}</P>
      <P>{copy.scale1[locale]}</P>
      <UL>
        <LI>{copy.scaleOut[locale]}</LI>
        <LI>{copy.scaleUp[locale]}</LI>
        <LI>{copy.scaleDown[locale]}</LI>
        <LI>{copy.scaleNot[locale]}</LI>
      </UL>
      <StaticBeat locale={locale} tab="scale" beat="levers" />

      <H2>{copy.observeTitle[locale]}</H2>
      <P>{copy.observe1[locale]}</P>
      <P>{copy.observe2[locale]}</P>
      <P>{copy.testing1[locale]}</P>
      <P>{copy.testing2[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
    </>
  );
}


const COPY = {
  lead: {
    en: "A platform that reads simulated energy devices, plans a battery against tomorrow's electricity prices and sends it a command every 15 minutes. I built it in two weeks as my own proof of concept on Azure, with Claude Code under my direction and review, and it ran live on Azure Container Apps for a demo. This guide walks through how it is built and why, from the device to the browser and from a push to a running container.",
    nl: "Een platform dat gesimuleerde energieapparaten uitleest, een batterij plant op de stroomprijzen van morgen en die elke 15 minuten een commando stuurt. Ik bouwde het in twee weken als eigen proof of concept op Azure, met Claude Code onder mijn regie en review, en het draaide live op Azure Container Apps voor een demo. Deze gids loopt door hoe het gebouwd is en waarom, van het apparaat tot de browser en van een push tot een draaiende container.",
  },
  shapeTitle: {
    en: "A hexagonal core with ports and adapters",
    nl: "Een hexagonale kern met poorten en adapters",
  },
  shape1: {
    en: "The middle holds two projects. Domain has the rules: assets, telemetry, plans, prices and the state machine of a command. Application has the use cases and 18 ports, the interfaces the core needs from the outside world, such as ITelemetryStore, ICommandSender and IDayAheadPrices. Neither project knows anything about Azure, PostgreSQL or HTTP.",
    nl: "Het midden bestaat uit twee projecten. Domain bevat de regels: assets, telemetrie, plannen, prijzen en de toestandsmachine van een commando. Application bevat de use cases en 18 poorten, de interfaces die de kern van de buitenwereld nodig heeft, zoals ITelemetryStore, ICommandSender en IDayAheadPrices. Geen van beide projecten weet iets van Azure, PostgreSQL of HTTP.",
  },
  shape2: {
    en: "Around that core sit the adapters. Almost every port has two: one in memory and one for Azure or PostgreSQL. The telemetry store is InMemoryTelemetryStore or PostgresTelemetryStore. Commands travel over InMemoryCommandChannel or a Service Bus sender and receiver. Prices come from a synthetic source, Energy-Charts or ENTSO-E. Five small hosts, Api, Gateway, Planner, Steering and Retention, connect the adapters to the use cases.",
    nl: "Rond die kern zitten de adapters. Bijna elke poort heeft er twee: een in het geheugen en een voor Azure of PostgreSQL. De telemetriestore is InMemoryTelemetryStore of PostgresTelemetryStore. Commando's reizen over InMemoryCommandChannel of over een Service Bus-sender en -receiver. Prijzen komen uit een synthetische bron, Energy-Charts of ENTSO-E. Vijf kleine hosts, Api, Gateway, Planner, Steering en Retention, verbinden de adapters met de use cases.",
  },
  shape3: {
    en: "Why this shape. A host registers the in-memory adapter first and the Azure or Postgres adapter only when it is configured, and the last registration wins. So the whole flow runs on a laptop without a database or a cloud account, and the same use case runs against PostgreSQL in Azure by configuration alone. Changing or scaling a part means adding an adapter, not rewriting a use case.",
    nl: "Waarom deze vorm. Een host registreert eerst de in-memory adapter en de Azure- of Postgres-adapter alleen als die is ingesteld, en de laatste registratie wint. Zo draait de hele flow op een laptop zonder database of cloudaccount, en draait dezelfde use case op PostgreSQL in Azure door alleen configuratie. Een deel wijzigen of schalen betekent een adapter toevoegen, geen use case herschrijven.",
  },
  shape4: {
    en: "Two rules keep the shape intact. Architecture tests fail the build when an adapter references another adapter, a host or the simulator, and when a host references another host. And each host registers only the groups of use cases it needs, never one shared bundle. A shared bundle once hid missing registrations and broke four of the five hosts at startup, which is why that rule exists.",
    nl: "Twee regels houden de vorm intact. Architectuurtests laten de build falen als een adapter naar een andere adapter, een host of de simulator verwijst, en als een host naar een andere host verwijst. En elke host registreert alleen de groepen use cases die hij nodig heeft, nooit een gedeelde bundel. Een gedeelde bundel verborg ooit ontbrekende registraties en liet vier van de vijf hosts falen bij het starten, en daarom bestaat die regel.",
  },
  termsSummary: {
    en: "Terms used in this guide",
    nl: "Begrippen in deze gids",
  },
  flowTitle: {
    en: "How the data flows",
    nl: "Hoe de data stroomt",
  },
  flow1: {
    en: "Each simulated device, a battery, an EV charger, a PV inverter or a heat pump, has its own identity in IoT Hub and sends its readings over MQTT. The identities are not in Terraform. A script registers them and stores each device key in Key Vault.",
    nl: "Elk gesimuleerd apparaat, een batterij, een laadpaal, een PV-omvormer of een warmtepomp, heeft een eigen identiteit in IoT Hub en stuurt zijn metingen over MQTT. De identiteiten staan niet in Terraform. Een script registreert ze en bewaart elke apparaatsleutel in Key Vault.",
  },
  flow2: {
    en: "The gateway reads the built-in endpoint of the hub with an event processor, keeps its place with checkpoints in Blob storage and hands batches to a bounded channel, so a slow database slows the reader down instead of filling memory. Before anything is stored, the batch is checked. The device id comes from the hub, never from the message body. The catalogue decides the asset kind. A reading more than 5 minutes ahead or older than a day is refused.",
    nl: "De gateway leest het ingebouwde endpoint van de hub met een event processor, houdt zijn plek bij met checkpoints in Blob storage en geeft batches door aan een begrensd kanaal, zodat een trage database de lezer afremt in plaats van het geheugen te vullen. Voordat er iets wordt opgeslagen, wordt de batch gecontroleerd. Het device id komt van de hub, nooit uit de berichtbody. De catalogus bepaalt de soort asset. Een meting die meer dan 5 minuten vooruitloopt of ouder is dan een dag, wordt geweigerd.",
  },
  flow3: {
    en: "One transaction then writes three things: the raw reading into a TimescaleDB hypertable, the newest reading per asset into a current state table, and the touched 15 minute bucket of the rollup. Charts read the rollup and tiles read the current state, so neither has to scan history.",
    nl: "Een transactie schrijft dan drie dingen: de ruwe meting in een hypertable van TimescaleDB, de nieuwste meting per asset in een tabel met de actuele stand, en de geraakte bucket van 15 minuten in de rollup. Grafieken lezen de rollup en tegels lezen de actuele stand, dus geen van beide hoeft door de historie te zoeken.",
  },
  flow4: {
    en: "Every hour the planner reads the day-ahead prices and stores a new version of the battery plan. Every 15 minutes the steering job turns the current period of that plan into one command, with an idempotency key made of the asset, the period and the plan version, and stores it as Created with an audit row before anything is sent. A switch per site can turn steering off.",
    nl: "Elk uur leest de planner de day-ahead prijzen en slaat een nieuwe versie van het batterijplan op. Elke 15 minuten maakt de stuurjob van de huidige periode van dat plan een commando, met een idempotency key van de asset, de periode en de planversie, en slaat het op als Created met een auditrij voordat er iets verstuurd wordt. Een schakelaar per site kan de sturing uitzetten.",
  },
  flow5: {
    en: "In pro the command travels over a Service Bus queue with one session per asset, so commands for one battery stay in order. Pro was never applied, and in dev and on a laptop an in-memory channel takes its place. The gateway sends only commands that are still Created and not expired, cloud to device through IoT Hub, and the command becomes Sent. The hub reports the delivery back to the gateway, which moves it to Acknowledged. A later reading confirms it in the gateway when the power of the battery lands within a tolerance of the setpoint, the larger of 1 kW and 10 percent.",
    nl: "In pro reist het commando over een Service Bus-wachtrij met een sessie per asset, zodat commando's voor een batterij op volgorde blijven. Pro is nooit uitgerold, en in dev en op een laptop neemt een in-memory kanaal de plaats in. De gateway verstuurt alleen commando's die nog Created zijn en niet verlopen, cloud to device via IoT Hub, en het commando wordt Sent. De hub meldt de aflevering terug aan de gateway, die het naar Acknowledged zet. Een latere meting bevestigt het in de gateway als het vermogen van de batterij binnen een marge van de setpoint valt, de grootste van 1 kW en 10 procent.",
  },
  flow6: {
    en: "A command moves from Created through Sent and Acknowledged to Confirmed, or ends as Rejected, Failed or Expired. That is seven states and nine allowed transitions, and every change writes its audit row in the same transaction as the change.",
    nl: "Een commando gaat van Created via Sent en Acknowledged naar Confirmed, of eindigt als Rejected, Failed of Expired. Dat zijn zeven statussen en negen toegestane overgangen, en elke wijziging schrijft zijn auditrij in dezelfde transactie als de wijziging.",
  },
  onceTitle: {
    en: "When everything runs at once",
    nl: "Als alles tegelijk draait",
  },
  once1: {
    en: "Picture a busy quarter of an hour. The batteries are charging, a heat pump is on, every device keeps sending readings, the steering job issues its commands and a household has the dashboard open. Every part reads and writes the same database. Three things keep that calm.",
    nl: "Stel je een druk kwartier voor. De batterijen laden, een warmtepomp staat aan, elk apparaat blijft metingen sturen, de stuurjob geeft zijn commando's uit en een huishouden heeft het dashboard open. Elk deel leest en schrijft in dezelfde database. Drie dingen houden dat rustig.",
  },
  once2: {
    en: "First, readers and writers pass each other. The dashboard reads one row per asset from the current state and a few buckets from the rollup. The gateway appends raw readings and updates those rows inside its batch transaction. PostgreSQL keeps versions of a row, so a reader sees the last committed state and never waits for a writer, and a writer never waits for a reader. The reads are plain queries without explicit locks.",
    nl: "Ten eerste lopen lezers en schrijvers langs elkaar. Het dashboard leest een rij per asset uit de actuele stand en een paar buckets uit de rollup. De gateway voegt ruwe metingen toe en werkt die rijen bij binnen zijn batchtransactie. PostgreSQL houdt versies van een rij bij, dus een lezer ziet de laatst vastgelegde stand en wacht nooit op een schrijver, en een schrijver wacht nooit op een lezer. De leesacties zijn gewone queries zonder expliciete locks.",
  },
  once3: {
    en: "Second, in the Postgres path the database settles duplicates and races, not locks in the code. Six cases come up, each with the failure first:",
    nl: "Ten tweede beslecht de database in het Postgres-pad dubbelingen en races, niet locks in de code. Er zijn zes gevallen, elk met de fout eerst:",
  },
  once4: {
    en: "Third, an unchanged answer stays small. The api builds a weak ETag from the newest measured moment, and the dashboard sends it back with every poll. While nothing changed, the answer is a 304 without a body. The plan, commands and savings routes of the dashboard also keep a 5 second answer cache per caller and share one backend call between requests that arrive together.",
    nl: "Ten derde blijft een ongewijzigd antwoord klein. De api maakt een zwakke ETag van het nieuwste meetmoment, en het dashboard stuurt die bij elke poll terug. Zolang er niets veranderde, is het antwoord een 304 zonder body. De routes voor plan, commando's en besparing van het dashboard houden ook per aanroeper een antwoordcache van 5 seconden en delen een backendaanroep tussen verzoeken die tegelijk binnenkomen.",
  },
  once5: {
    en: "The repository names where it would strain first: a chart over a full day of raw readings. That is why charts read the rollup, and why continuous aggregates in TimescaleDB and push instead of poll are the next steps.",
    nl: "De repository noemt waar het als eerste zou knellen: een grafiek over een hele dag ruwe metingen. Daarom lezen grafieken de rollup, en daarom zijn continuous aggregates in TimescaleDB en push in plaats van poll de volgende stappen.",
  },
  apiTitle: {
    en: "The api",
    nl: "De api",
  },
  api1: {
    en: "The api is a small REST surface under /v1: sites, asset state and telemetry, prices, plans, plan runs and savings, commands, and the steering switch. It runs on internal ingress only, so nothing outside the Container Apps environment reaches it. Health lives on /health/live and /health/ready, and readiness checks the database when the host uses one.",
    nl: "De api is een klein REST-oppervlak onder /v1: sites, de stand en telemetrie van een asset, prijzen, plannen, planruns en besparing, commando's en de stuurschakelaar. Hij draait alleen op interne ingress, dus niets buiten de Container Apps-omgeving bereikt hem. Health staat op /health/live en /health/ready, en readiness controleert de database als de host er een gebruikt.",
  },
  api2: {
    en: "The api runs in one of two authentication modes. With a static bearer token, compared in constant time, every caller belongs to one fixed organisation. With Entra ID, an access token needs the api scope, and the organisation of the caller is resolved once per request from its object id. Either way every query is scoped to one organisation, and a query for the site of another organisation finds nothing.",
    nl: "De api draait in een van twee authenticatiemodi. Met een vast bearer token, vergeleken in constante tijd, hoort elke aanroeper bij een vaste organisatie. Met Entra ID heeft een access token de api-scope nodig, en wordt de organisatie van de aanroeper een keer per verzoek bepaald uit zijn object id. In beide gevallen hoort elke query bij een organisatie, en een query naar de site van een andere organisatie vindt niets.",
  },
  api3: {
    en: "Limits protect the database and the process. A raw telemetry read stops at 86 400 rows. Kestrel accepts at most 64 KB per body. The site and the asset state carry a weak ETag and answer 304 when nothing changed. The telemetry series carries none.",
    nl: "Limieten beschermen de database en het proces. Een ruwe telemetrieread stopt bij 86 400 rijen. Kestrel accepteert hoogstens 64 KB per body. De site en de stand van een asset dragen een zwakke ETag en antwoorden 304 als er niets veranderde. De telemetriereeks draagt er geen.",
  },
  frontTitle: {
    en: "The React frontend",
    nl: "De React-frontend",
  },
  front1: {
    en: "The dashboard is a Next.js app on the App Router. The first view is rendered on the server: it loads the site and 24 hours of 15 minute data per asset in parallel, so the household sees the charts on the first paint.",
    nl: "Het dashboard is een Next.js-app op de App Router. Het eerste beeld wordt op de server gerenderd: het laadt de site en 24 uur aan data per 15 minuten per asset tegelijk, zodat het huishouden de grafieken bij het eerste beeld ziet.",
  },
  front2: {
    en: "After that, a small hook called usePolledJson keeps the screen current. It polls every 10 seconds while the tab is visible, doubles the wait after a failure up to 60 seconds, and sends If-None-Match with the last ETag. The live tiles poll every 10 seconds, the plan chart and the command timeline every 60.",
    nl: "Daarna houdt een kleine hook, usePolledJson, het scherm actueel. Hij pollt elke 10 seconden zolang het tabblad zichtbaar is, verdubbelt de wachttijd na een fout tot 60 seconden, en stuurt If-None-Match met de laatste ETag. De live tegels pollen elke 10 seconden, de plangrafiek en de tijdlijn van commando's elke 60.",
  },
  front3: {
    en: "The browser never talks to the api. It calls route handlers on its own origin, /api/site, /api/plan, /api/commands, /api/savings and /api/steering, and those call the internal api on the server. Tokens stay on the server, the api stays internal, and the route handler is the one place for rate limits and caching.",
    nl: "De browser praat nooit met de api. Hij roept route handlers op de eigen origin aan, /api/site, /api/plan, /api/commands, /api/savings en /api/steering, en die roepen de interne api op de server aan. Tokens blijven op de server, de api blijft intern, en de route handler is de ene plek voor rate limits en caching.",
  },
  front4: {
    en: "The screens follow the data. Live tiles show the current state of each asset. PowerChart and PlanChart use Recharts, each with a table for screen readers beside it. The steering panel has four states, idle, confirming, updating and failed, and asks for a confirmation before it sends the switch. The code is organised by feature: app for the routes, components for the shared building blocks, features for the account, sign-in and the site, and lib for the api, auth, charts and rate limiting.",
    nl: "De schermen volgen de data. Live tegels tonen de actuele stand van elke asset. PowerChart en PlanChart gebruiken Recharts, elk met een tabel voor schermlezers ernaast. Het stuurpaneel heeft vier statussen, idle, confirming, updating en failed, en vraagt om een bevestiging voordat het de schakelaar verstuurt. De code is per feature georganiseerd: app voor de routes, components voor de gedeelde bouwstenen, features voor het account, het aanmelden en de site, en lib voor de api, auth, grafieken en rate limiting.",
  },
  securityTitle: {
    en: "Security from device to browser",
    nl: "Beveiliging van apparaat tot browser",
  },
  security1: {
    en: "At the device. Each device has its own key, stored in Key Vault. The gateway takes the device id from the hub and never from the message. An event carries at most 12 readings and 2 buckets of 15 minutes, and a reading outside the time window is refused. An unknown asset, or a kind or site that does not match the catalogue, rejects the whole batch.",
    nl: "Bij het apparaat. Elk apparaat heeft een eigen sleutel, bewaard in Key Vault. De gateway neemt het device id van de hub en nooit uit het bericht. Een event draagt hoogstens 12 metingen en 2 buckets van 15 minuten, en een meting buiten het tijdvenster wordt geweigerd. Een onbekende asset, of een soort of site die niet met de catalogus klopt, weigert de hele batch.",
  },
  security2: {
    en: "In the api. Internal ingress, a bearer token compared in constant time or an Entra token with one organisation per request, parameterised SQL everywhere, a row cap and a body limit.",
    nl: "In de api. Interne ingress, een bearer token vergeleken in constante tijd of een Entra-token met een organisatie per verzoek, geparametriseerde SQL overal, een limiet op rijen en een limiet op de body.",
  },
  security3: {
    en: "In the dashboard. A content security policy with a fresh nonce per request and strict-dynamic, no framing, sign-in with PKCE and state, a session of 8 hours, HSTS and the other security headers, and a token bucket on every api route. A steering write needs a feature switch, an Origin header that matches the host and a body of at most 1 KB.",
    nl: "In het dashboard. Een content security policy met een nieuwe nonce per verzoek en strict-dynamic, geen framing, aanmelden met PKCE en state, een sessie van 8 uur, HSTS en de andere security headers, en een token bucket op elke api-route. Een stuuractie heeft een feature switch nodig, een Origin-header die bij de host past en een body van hoogstens 1 KB.",
  },
  security4: {
    en: "Between the services. One user-assigned managed identity per workload, with access to its own secrets only. App settings are Key Vault references, so no secret sits in a container definition. Storage has shared keys switched off. The command queue accepts Entra identities only.",
    nl: "Tussen de diensten. Een user-assigned managed identity per workload, met toegang tot alleen de eigen secrets. App-instellingen zijn Key Vault-referenties, dus er staat geen secret in een containerdefinitie. Storage heeft shared keys uitgezet. De commandowachtrij accepteert alleen Entra-identiteiten.",
  },
  security5: {
    en: "Two trade-offs stay open on purpose, each with a backlog row. The database is reachable from Azure services with a password login, because there is no virtual network yet. And the key of the gateway for the events endpoint can also send to devices, because the built-in endpoint accepts no Entra identity. The threat model names that key a steering credential.",
    nl: "Twee afwegingen blijven bewust open, elk met een backlogregel. De database is bereikbaar vanuit Azure-diensten met een wachtwoord als login, omdat er nog geen virtueel netwerk is. En de sleutel van de gateway voor het events-endpoint kan ook naar apparaten sturen, omdat het ingebouwde endpoint geen Entra-identiteit accepteert. Het threat model noemt die sleutel een stuurcredential.",
  },
  security6: {
    en: "Scanners run on every push: NuGet audit for the backend packages, pnpm audit for the dashboard, Grype on every container image, Semgrep on the code, Gitleaks over the full history, Trivy on the Terraform and Dependabot for the updates.",
    nl: "Scanners draaien bij elke push: NuGet audit voor de backendpakketten, pnpm audit voor het dashboard, Grype op elk container-image, Semgrep op de code, Gitleaks over de hele historie, Trivy op de Terraform en Dependabot voor de updates.",
  },
  terraformTitle: {
    en: "Keeping Terraform safe",
    nl: "Terraform veilig houden",
  },
  terraform1: {
    en: "The infrastructure is one flat Terraform root module with a file per concern: the container apps and jobs, the database, IoT Hub, Service Bus, identities, Key Vault, storage, observability and a budget. Two variable files describe dev and pro. State lives in Azure Storage with Entra authentication, with one state key per environment.",
    nl: "De infrastructuur is een platte Terraform-rootmodule met een bestand per onderwerp: de container apps en jobs, de database, IoT Hub, Service Bus, identiteiten, Key Vault, storage, observability en een budget. Twee variabelenbestanden beschrijven dev en pro. De state staat in Azure Storage met Entra-authenticatie, met een state key per omgeving.",
  },
  terraform2: {
    en: "Tests run before anything reaches Azure. terraform test runs 57 cases against mocked providers, and an invariants test runs once against each variable file. It checks that:",
    nl: "Tests draaien voordat er iets Azure bereikt. terraform test draait 57 gevallen tegen gemockte providers, en een invariantentest draait een keer tegen elk variabelenbestand. Die controleert dat:",
  },
  invariantIngress: {
    en: "the api never gets external ingress",
    nl: "de api nooit externe ingress krijgt",
  },
  invariantReplicas: {
    en: "every app has at most one replica and every job runs one at a time",
    nl: "elke app hoogstens een replica heeft en elke job een tegelijk draait",
  },
  invariantQueue: {
    en: "the queue and its KEDA rule always come together",
    nl: "de wachtrij en zijn KEDA-regel altijd samen komen",
  },
  invariantPro: {
    en: "pro locks the vault and the database, with purge protection",
    nl: "pro de kluis en de database vergrendelt, met purge protection",
  },
  invariantSteering: {
    en: "steering writes need sign-in",
    nl: "stuuracties aanmelden vereisen",
  },
  invariantBudget: {
    en: "tags are present and the budget alerts at 50 and 90 percent",
    nl: "tags aanwezig zijn en het budget waarschuwt bij 50 en 90 procent",
  },
  terraform3: {
    en: "Trivy scans the Terraform for high and critical findings, and an ignored rule needs a written reason. The deploy workflow refuses to destroy pro, an empty list of operator addresses fails closed, and a concurrency group allows one Terraform run per environment at a time.",
    nl: "Trivy scant de Terraform op bevindingen van ernst high en critical, en een genegeerde regel heeft een geschreven reden nodig. De deploy-workflow weigert pro af te breken, een lege lijst met operatoradressen faalt dicht, en een concurrency group staat een Terraform-run per omgeving tegelijk toe.",
  },
  terraform4: {
    en: "One lesson came from the first real apply: it found three things that no plan had shown. A plan proves that the configuration is consistent. Only an apply proves that Azure accepts it.",
    nl: "Een les kwam uit de eerste echte apply: die vond drie dingen die geen plan had laten zien. Een plan bewijst dat de configuratie klopt. Alleen een apply bewijst dat Azure hem accepteert.",
  },
  pipelineTitle: {
    en: "Pipelines on GitHub Actions",
    nl: "Pipelines op GitHub Actions",
  },
  pipeline1: {
    en: "CI runs on every push to main, every pull request, once a week and on demand, on GitHub-hosted ubuntu runners. Every action is pinned to a commit SHA with its version beside it, and no checkout keeps its credentials.",
    nl: "CI draait bij elke push naar main, elke pull request, een keer per week en op verzoek, op runners van GitHub met ubuntu. Elke action staat vast op een commit-SHA met de versie ernaast, en geen checkout bewaart zijn credentials.",
  },
  pipeline2: {
    en: "The jobs run side by side. Backend restores behind the vulnerable package gate, builds with warnings as errors and runs the tests. Dashboard runs pnpm audit, lint, the tests with a coverage gate, the type check, the build and the Playwright journeys against a stub api and a stub sign-in. Terraform formats, validates, tests and scans. Semgrep and Gitleaks run on their own.",
    nl: "De jobs draaien naast elkaar. Backend herstelt achter de gate voor kwetsbare pakketten, bouwt met warnings als errors en draait de tests. Dashboard draait pnpm audit, lint, de tests met een coverage-gate, de typecheck, de build en de Playwright-journeys tegen een stub-api en een stub-aanmelding. Terraform formatteert, valideert, test en scant. Semgrep en Gitleaks draaien apart.",
  },
  pipeline3: {
    en: "On main, seven container images are built, scanned by Grype and pushed to the GitHub registry. The deploy workflow logs in to Azure with OIDC, through a federated credential per GitHub environment, so no Azure secret is stored anywhere. It resolves every image tag to its digest, saves the Terraform plan and applies exactly that plan. A drift check runs every Monday.",
    nl: "Op main worden zeven container-images gebouwd, gescand door Grype en naar de GitHub-registry gepusht. De deploy-workflow meldt aan bij Azure met OIDC, via een federated credential per GitHub-omgeving, dus er staat nergens een Azure-secret. Hij zet elke image-tag om naar zijn digest, bewaart het Terraform-plan en past precies dat plan toe. Elke maandag draait een driftcontrole.",
  },
  containersTitle: {
    en: "Container Apps and how it scales",
    nl: "Container Apps en hoe het schaalt",
  },
  containers1: {
    en: "The parts that keep running are container apps: the api, the dashboard and the gateway. Work that runs and stops is a Container Apps job on a schedule: the planner at five past every hour, steering every 15 minutes and retention every night, each one at a time with one retry. The environment runs on the consumption plan and logs to Log Analytics.",
    nl: "De delen die blijven draaien zijn container apps: de api, het dashboard en de gateway. Werk dat draait en stopt is een Container Apps-job op een schema: de planner om vijf over elk uur, de sturing elke 15 minuten en retentie elke nacht, elk een tegelijk met een nieuwe poging. De omgeving draait op het consumption plan en logt naar Log Analytics.",
  },
  containers2: {
    en: "Every app runs at most one replica today, and a Terraform test holds that cap. Raising it means changing that test on purpose. Secrets reach the apps as Key Vault references through their managed identities.",
    nl: "Elke app draait vandaag hoogstens een replica, en een Terraform-test bewaakt die grens. Hem verhogen betekent die test bewust aanpassen. Secrets bereiken de apps als Key Vault-referenties via hun managed identities.",
  },
  scale1: {
    en: "Growing has three directions, plus the parts that change first.",
    nl: "Groeien kan drie kanten op, plus de delen die als eerste veranderen.",
  },
  planner1: {
    en: "The planner itself is a pure function in the domain, GreedyBatteryPlanner. It takes the prices and the limits of the battery and returns a plan, clipped at the bounds of the state of charge, for one battery on one site. Because it needs no database and no clock, every case is a plain unit test. Each run saves the next version of the plan, and a unique index on the site, the day and the version stops a double save.",
    nl: "De planner zelf is een pure functie in het domein, GreedyBatteryPlanner. Hij neemt de prijzen en de grenzen van de batterij en geeft een plan terug, begrensd op de laadtoestand, voor een batterij op een site. Omdat hij geen database en geen klok nodig heeft, is elk geval een gewone unittest. Elke run slaat de volgende versie van het plan op, en een unieke index op de site, de dag en de versie voorkomt een dubbele opslag.",
  },
  failure1: {
    en: "Not every command lands. A send error moves it to Failed. A command whose period ends without a confirming reading becomes Expired at the next steering run. The command is sent after its row is committed and there is no outbox, so a send that fails after the commit leaves the command Created until it expires. That is an accepted trade-off, and the expiry pass closes it.",
    nl: "Niet elk commando komt aan. Een fout bij het versturen zet het op Failed. Een commando waarvan de periode eindigt zonder bevestigende meting wordt Expired bij de volgende stuurrun. Het commando wordt verstuurd nadat de rij is vastgelegd en er is geen outbox, dus een verzending die na de commit faalt, laat het commando op Created staan tot het verloopt. Dat is een geaccepteerde afweging, en de verloopronde sluit hem af.",
  },
  failure2: {
    en: "On the queue in pro, a message is delivered at most five times with a lock of one minute, a message past its time to live goes to the dead letter queue, and an alert watches the depth of that queue.",
    nl: "Op de wachtrij in pro wordt een bericht hoogstens vijf keer afgeleverd met een lock van een minuut, gaat een bericht voorbij zijn time to live naar de dead letter queue, en bewaakt een alert de diepte van die wachtrij.",
  },
  observeTitle: {
    en: "Observing and testing it",
    nl: "Het observeren en testen",
  },
  observe1: {
    en: "The gateway counts what it does with OpenTelemetry: readings ingested, readings rejected and duplicate batches. Every container app and job logs to Log Analytics, with Application Insights beside it. Alerts fire when an app keeps restarting, when retention did not run and when commands stay unconfirmed. Each environment also has a budget, so a mistake in the infrastructure shows up as a cost alert before it shows up on an invoice.",
    nl: "De gateway telt met OpenTelemetry wat hij doet: opgenomen metingen, geweigerde metingen en dubbele batches. Elke container app en job logt naar Log Analytics, met Application Insights ernaast. Alerts gaan af als een app blijft herstarten, als retentie niet draaide en als commando's onbevestigd blijven. Elke omgeving heeft ook een budget, zodat een fout in de infrastructuur als kostenalert verschijnt voordat hij op een factuur verschijnt.",
  },
  observe2: {
    en: "Retention deletes raw readings older than 30 days in batches. The rollup stays, so the charts keep their history while the hypertable stays small.",
    nl: "Retentie verwijdert ruwe metingen ouder dan 30 dagen in batches. De rollup blijft, dus de grafieken houden hun historie terwijl de hypertable klein blijft.",
  },
  testing1: {
    en: "Each layer has its own tests. Domain and Application run without any infrastructure, so the planner, the state machine and every use case are fast unit tests against the in-memory adapters. The Postgres adapters run against a real TimescaleDB in Testcontainers, the same engine as in Azure. That choice came from a lesson: a retention query once deleted rows from the wrong chunk of a hypertable, and only the production engine showed it.",
    nl: "Elke laag heeft zijn eigen tests. Domain en Application draaien zonder infrastructuur, dus de planner, de toestandsmachine en elke use case zijn snelle unittests tegen de in-memory adapters. De Postgres-adapters draaien tegen een echte TimescaleDB in Testcontainers, dezelfde engine als in Azure. Die keuze kwam uit een les: een retentiequery verwijderde ooit rijen uit de verkeerde chunk van een hypertable, en alleen de productie-engine liet dat zien.",
  },
  testing2: {
    en: "The persistence tests prove the safety rules from the busy quarter of an hour: a second create under the same key gives the first row back with one audit row, a transition from a stale state is refused, a late reading leaves the current state alone, and three hosts migrating an empty database at once all succeed. Every host also has a startup test, so a missing registration fails in CI instead of at deploy.",
    nl: "De persistence-tests bewijzen de veiligheidsregels uit het drukke kwartier: een tweede create onder dezelfde sleutel geeft de eerste rij terug met een auditrij, een overgang vanuit een verouderde status wordt geweigerd, een late meting laat de actuele stand met rust, en drie hosts die tegelijk een lege database migreren slagen allemaal. Elke host heeft ook een starttest, zodat een ontbrekende registratie in CI faalt in plaats van bij de deploy.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close2: {
    en: "The same approach carries over to any platform that reads devices and acts on them: a core that knows nothing about the cloud, adapters you can swap, a database that settles conflicts, and a pipeline that proves the infrastructure before it touches Azure.",
    nl: "Dezelfde aanpak past op elk platform dat apparaten uitleest en erop handelt: een kern die niets van de cloud weet, adapters die je kunt wisselen, een database die conflicten beslecht, en een pipeline die de infrastructuur bewijst voordat die Azure raakt.",
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
  close1: {
    en: "Everything here follows one habit. Each part sits behind a port, so the question of how to change it becomes which adapter to add. The data stays right through keys and conditions the database checks, and a lock appears only where a second writer has to wait. A port is a question you can answer later without rewriting what calls it.",
    nl: "Alles hier volgt een gewoonte. Elk deel zit achter een poort, dus de vraag hoe je het verandert, wordt welke adapter je toevoegt. De data blijft juist door sleutels en voorwaarden die de database controleert, en een lock verschijnt alleen waar een tweede schrijver moet wachten. Een poort is een vraag die je later beantwoordt zonder te herschrijven wat hem aanroept.",
  },
} as const;
