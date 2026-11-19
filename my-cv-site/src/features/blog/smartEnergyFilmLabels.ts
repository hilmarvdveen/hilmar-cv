import type { Locale } from "@/lib/seo";
import type { BeatIdOf, TabId } from "@/lib/smartEnergyFilm/film";
import type { BlockId, ChipId, FrameId, LineKind } from "@/lib/smartEnergyFilm/layout";
import type { LocalizedText } from "./types";

export type BeatCaption = { headline: string; detail: string; why: string };

export type SmartEnergyFilmLabels = {
  blocks: Record<BlockId, { title: readonly string[]; note: string }>;
  frames: Record<FrameId, string>;
  cloudFrames: Record<FrameId, string>;
  legend: Record<LineKind, string>;
  legendLabel: string;
  chips: Record<ChipId, string>;
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
  tabs: Record<TabId, string>;
  tablistLabel: string;
  captions: { [Tab in TabId]: Record<BeatIdOf<Tab>, BeatCaption> };
  beatIndicator: string;
  previous: string;
  next: string;
  play: string;
  pause: string;
  textVersion: string;
  zero: string;
};

type Localized<Shape> = Shape extends string
  ? LocalizedText
  : Shape extends readonly string[]
    ? readonly LocalizedText[]
    : { [Key in keyof Shape]: Localized<Shape[Key]> };

const same = (text: string): LocalizedText => ({ en: text, nl: text });

const both = (en: string, nl: string): LocalizedText => ({ en, nl });

const caption = (headline: LocalizedText, detail: LocalizedText, why: LocalizedText) => ({ headline, detail, why });

const NO_NOTE = same("");

const PRO_ONLY_NOTE = both("pro only", "alleen pro");

const COPY: Localized<Omit<SmartEnergyFilmLabels, "gatesLine">> = {
  blocks: {
    battery: { title: [both("Battery", "Batterij")], note: NO_NOTE },
    prices: { title: [same("Day-ahead"), both("prices", "prijzen")], note: NO_NOTE },
    iotHub: { title: [same("IoT Hub")], note: NO_NOTE },
    serviceBus: { title: [same("Service Bus")], note: both("pro only", "alleen pro") },
    gateway: { title: [same("Gateway")], note: NO_NOTE },
    api: { title: [same("API")], note: NO_NOTE },
    planner: { title: [same("Planner")], note: NO_NOTE },
    steering: { title: [both("Steering", "Sturing")], note: NO_NOTE },
    dashboard: { title: [same("Dashboard")], note: NO_NOTE },
    database: { title: [same("PostgreSQL")], note: same("TimescaleDB") },
    browser: { title: [same("Browser")], note: both("household", "huishouden") },
  },
  frames: {
    azure: same("Azure"),
    containerApps: same("Container Apps"),
  },
  cloudFrames: {
    azure: both("Azure, pro never applied", "Azure, pro nooit toegepast"),
    containerApps: both("Container Apps, 0 to 1 replica", "Container Apps, 0 tot 1 replica"),
  },
  legend: {
    telemetry: both("telemetry", "telemetrie"),
    commands: same("commands"),
    reads: both("reads", "lezen"),
    control: same("plan"),
  },
  legendLabel: both("Line kinds", "Lijnsoorten"),
  chips: {
    keyVault: same("Key Vault"),
    blobCheckpoints: same("checkpoints"),
    idempotencyKey: same("idempotency key"),
    queueProOnly: PRO_ONLY_NOTE,
    kedaProOnly: PRO_ONLY_NOTE,
    deviceKey: both("SAS key", "SAS-sleutel"),
    hubIdentity: both("hub identity", "hub-identiteit"),
    parameterised: both("parameterised", "geparametriseerd"),
    contentPolicy: same("CSP, PKCE"),
    token: both("api token", "api-token"),
    internalIngress: both("internal only", "alleen intern"),
    entraQueue: both("Entra only, pro", "alleen Entra, pro"),
    replicasLever: both("1 today", "vandaag 1"),
    queueLengthLever: both("queue length", "wachtrijlengte"),
    iotHubTier: both("higher tier", "hogere tier"),
    serviceBusPremium: same("Premium"),
    databaseTier: both("larger tier", "grotere tier"),
  },
  gates: [same("NuGet audit"), same("Grype"), same("Semgrep"), same("Gitleaks"), same("Trivy"), same("terraform test"), same("Dependabot")],
  safety: {
    title: both("PostgreSQL keeps the data right", "PostgreSQL houdt de data juist"),
    duplicateKey: [same("asset_id,"), same("measured_at")],
    duplicateResult: same("DO NOTHING"),
    raceWinner: both("Sent to Acknowledged: 1 row", "Sent naar Acknowledged: 1 rij"),
    raceLoser: both("Sent to Expired: 0 rows", "Sent naar Expired: 0 rijen"),
    lockName: same("advisory lock"),
    lockFirst: same("host 1"),
    lockSecond: same("host 2"),
    lockWaits: both("waits", "wacht"),
    lockDone: both("schema current", "schema bij"),
    auditChange: both("state change", "statuswijziging"),
    auditRow: both("audit row", "auditrij"),
    auditTransaction: both("one transaction", "een transactie"),
    mechanisms: [both("duplicate", "dubbel"), both("race", "race"), both("migration", "migratie"), both("audit", "audit")],
  },
  tabs: {
    overview: both("Overview", "Overzicht"),
    reading: both("Reading", "Meting"),
    command: both("Command", "Commando"),
    customer: both("Household", "Huishouden"),
    safety: both("Consistency", "Consistentie"),
    scale: both("Scale", "Schalen"),
    cloud: same("Cloud"),
  },
  tablistLabel: both("Parts of the platform", "Onderdelen van het platform"),
  captions: {
    overview: {
      orient: caption(
        both("The whole platform at a glance", "Het hele platform in een oogopslag"),
        both("Readings come in, commands go out and a household watches. Plans stay in PostgreSQL.", "Metingen komen binnen, commands gaan eruit en een huishouden kijkt mee. Plannen blijven in PostgreSQL."),
        both("One picture first, then each path on its own.", "Eerst een plaat, daarna elk pad apart."),
      ),
      readingsIn: caption(
        both("Readings come in", "Metingen komen binnen"),
        both("Devices send telemetry over MQTT to IoT Hub. The gateway stores it in PostgreSQL.", "Apparaten sturen telemetrie via MQTT naar IoT Hub. De gateway slaat het op in PostgreSQL."),
        both("Everything the platform knows about the battery arrives as a reading.", "Alles wat het platform van de batterij weet, komt binnen als meting."),
      ),
      commandsOut: caption(
        both("Commands go out", "Commands gaan eruit"),
        both("Steering reads the plan and stores a command in PostgreSQL, then sends it. In pro it goes through a queue.", "Sturing leest het plan en slaat een command op in PostgreSQL en stuurt het daarna. In pro gaat het via een queue."),
        both("The battery gets one checked setpoint per period, not the plan.", "De batterij krijgt per periode een gecontroleerd setpoint, niet het plan."),
      ),
      householdWatches: caption(
        both("A household watches", "Een huishouden kijkt mee"),
        both("The dashboard polls its own origin and reads the current state through the api.", "Het dashboard pollt de eigen origin en leest de actuele stand via de api."),
        both("The browser never talks to the api directly.", "De browser praat nooit rechtstreeks met de api."),
      ),
    },
    reading: {
      orient: caption(
        both("A reading travels to PostgreSQL", "Een meting reist naar PostgreSQL"),
        both("Battery, IoT Hub, gateway and PostgreSQL carry every reading.", "Batterij, IoT Hub, gateway en PostgreSQL dragen elke meting."),
        both("The path stores only readings that passed the checks.", "Het pad slaat alleen metingen op die de controles halen."),
      ),
      focus: caption(
        both("The reading path, up close", "Het meetpad van dichtbij"),
        both("Only the parts a reading touches stay on screen.", "Alleen de onderdelen die een meting raakt blijven in beeld."),
        both("Less on screen, so each hop reads clearly.", "Minder in beeld, zodat elke hop duidelijk leest."),
      ),
      deviceToHub: caption(
        both("The device sends over MQTT to IoT Hub", "Het apparaat stuurt via MQTT naar IoT Hub"),
        both("Each asset has its own device identity. The hub names the device, the body never does.", "Elke asset heeft een eigen apparaatidentiteit. De hub noemt het apparaat, de body nooit."),
        both("The asset identity comes from the hub, so a body cannot claim another device.", "De assetidentiteit komt van de hub, dus een body kan geen ander apparaat claimen."),
      ),
      checkpoint: caption(
        both("The gateway reads and checkpoints", "De gateway leest en zet checkpoints"),
        both("It reads the built-in Event Hubs endpoint and keeps its checkpoints in Blob.", "Hij leest het ingebouwde Event Hubs-endpoint en bewaart zijn checkpoints in Blob."),
        both("After a restart it resumes where it stopped, without a gap.", "Na een herstart gaat hij verder waar hij stopte, zonder gat."),
      ),
      validation: caption(
        both("Validation before storage", "Validatie voor opslag"),
        both("By default 5 minutes ahead and 1 day back. Kind and catalogue must match. Failures are refused before storage.", "Standaard 5 minuten vooruit en 1 dag terug. Soort en catalogus moeten kloppen. Afwijzingen vallen voor opslag af."),
        both("A device cannot declare its own kind, the catalogue decides.", "Een apparaat kan zijn eigen soort niet opgeven, de catalogus beslist."),
      ),
      transaction: caption(
        both("One transaction stores it", "Een transactie slaat het op"),
        both("The raw reading, the current state and the 15 minute rollup commit together.", "De ruwe meting, de actuele stand en de rollup per 15 minuten gaan samen weg."),
        both("All three are written or none is.", "Alle drie worden geschreven of geen."),
      ),
    },
    command: {
      orient: caption(
        both("From prices to a confirmed command", "Van prijzen naar een bevestigd command"),
        both("Planner, steering, gateway, hub and battery. PostgreSQL holds the plans and the commands.", "Planner, sturing, gateway, hub en batterij. PostgreSQL bewaart de plannen en de commands."),
        both("Every step records its state, so a command is never a guess.", "Elke stap legt zijn status vast, dus een command is nooit een gok."),
      ),
      focus: caption(
        both("The command path, up close", "Het commandpad van dichtbij"),
        both("Only the parts a command touches stay on screen.", "Alleen de onderdelen die een command raakt blijven in beeld."),
        both("Plans stay in PostgreSQL. Only commands go out.", "Plannen blijven in PostgreSQL. Alleen commands gaan eruit."),
      ),
      plan: caption(
        both("The planner saves plan version n+1", "De planner slaat planversie n+1 op"),
        both("It reads day-ahead prices and saves the next plan version. A unique index stops a double save.", "Hij leest day-ahead prijzen en slaat de volgende planversie op. Een unieke index stopt dubbel opslaan."),
        both("A plan is versioned, so each command points at one exact plan.", "Een plan heeft een versie, dus elk command wijst naar precies een plan."),
      ),
      expire: caption(
        both("Steering expires old commands", "Sturing laat oude commands verlopen"),
        both("Every 15 minutes it expires old commands first, then checks the steering switch.", "Elke 15 minuten laat het eerst oude commands verlopen en controleert dan de stuurschakelaar."),
        both("Old commands are cleared before a new one is built.", "Oude commands zijn weg voordat een nieuw command wordt gebouwd."),
      ),
      store: caption(
        both("Created is stored before anything sends", "Created staat opgeslagen voor het versturen"),
        both("Steering builds the idempotency key and stores the command as Created, with an audit row.", "Sturing bouwt de idempotency key en slaat het command op als Created, met een auditrij."),
        both("A command exists in PostgreSQL before it can leave.", "Een command bestaat in PostgreSQL voordat het kan vertrekken."),
      ),
      send: caption(
        both("The command goes out after the commit", "Het command gaat eruit na de commit"),
        both("It is sent on the session queue in pro, or on an in-memory channel on a laptop.", "Het gaat via de sessiequeue in pro, of via een in-memory kanaal op een laptop."),
        both("The queue only carries a command that is already stored.", "De queue draagt alleen een command dat al is opgeslagen."),
      ),
      deliver: caption(
        both("The gateway delivers to the device", "De gateway levert af bij het apparaat"),
        both("It delivers cloud to device through IoT Hub, only if the command is still Created and not expired.", "Hij levert cloud naar apparaat via IoT Hub, alleen als het command nog Created en niet verlopen is."),
        both("A late or repeated message cannot send an old command.", "Een late of herhaalde melding kan geen oud command sturen."),
      ),
      acknowledge: caption(
        both("The hub answers, Sent becomes Acknowledged", "De hub antwoordt, Sent wordt Acknowledged"),
        both("Acknowledged is the hub's delivery feedback to the gateway. It is not the battery answering.", "Acknowledged is de afleverfeedback van de hub aan de gateway. Het is niet de batterij die antwoordt."),
        both("Delivery and effect are separate events, so each has its own state.", "Aflevering en effect zijn aparte gebeurtenissen, dus elk heeft een eigen status."),
      ),
      confirm: caption(
        both("A later reading confirms the command", "Een latere meting bevestigt het command"),
        both("The gateway compares a later reading in PostgreSQL with the setpoint, within max(1 kW, 10 percent of the setpoint). Otherwise the command is Expired at the next steering run.", "De gateway vergelijkt een latere meting in PostgreSQL met het setpoint, binnen max(1 kW, 10 procent van het setpoint). Anders wordt het command Expired bij de volgende stuurrun."),
        both("Only what the battery then reads back counts as confirmed.", "Alleen wat de batterij daarna terugmeldt telt als bevestigd."),
      ),
    },
    customer: {
      orient: caption(
        both("A household watches the dashboard", "Een huishouden bekijkt het dashboard"),
        both("Browser, dashboard, api and PostgreSQL. The first view arrives server rendered.", "Browser, dashboard, api en PostgreSQL. De eerste weergave komt server rendered binnen."),
        both("Reading goes through the dashboard, never straight to the api.", "Lezen loopt via het dashboard, nooit rechtstreeks naar de api."),
      ),
      focus: caption(
        both("The household path, up close", "Het huishoudpad van dichtbij"),
        both("Only the parts a page view touches stay on screen.", "Alleen de onderdelen die een paginaweergave raakt blijven in beeld."),
        both("Fewer parts on screen, so the chain reads in one line.", "Minder onderdelen in beeld, zodat de keten in een lijn leest."),
      ),
      firstView: caption(
        both("The first view is server rendered", "De eerste weergave is server rendered"),
        both("The page arrives with data in it. The browser then polls its own origin.", "De pagina komt binnen met data erin. Daarna pollt de browser de eigen origin."),
        both("The page shows data before any script polls.", "De pagina toont data voordat een script pollt."),
      ),
      polling: caption(
        both("The browser polls every 10 seconds", "De browser pollt elke 10 seconden"),
        both("It sends If-None-Match while the tab is visible. After a failure it backs off, doubling to 60 s.", "Hij stuurt If-None-Match zolang het tabblad zichtbaar is. Na een fout wacht hij langer, verdubbelend tot 60 s."),
        both("Polling stops when nobody looks and slows down when something fails.", "Pollen stopt als niemand kijkt en gaat trager als iets faalt."),
      ),
      routeHandler: caption(
        both("The route handler guards the api", "De route handler beschermt de api"),
        both("A token bucket, and a session when sign-in is on. It then calls the internal api with a server-side token.", "Een token bucket, en een sessie als inloggen aan staat. Daarna roept hij de interne api aan met een server-side token."),
        both("The browser never holds the api token.", "De browser heeft nooit het api-token."),
      ),
      apiRead: caption(
        both("The api reads the current state", "De api leest de actuele stand"),
        both("It reads the current state of one organisation and builds a weak ETag from the newest measured moment.", "Hij leest de actuele stand van een organisatie en bouwt een zwakke ETag uit het nieuwste meetmoment."),
        both("Every query carries the organisation, so another one finds nothing.", "Elke query draagt de organisatie, dus een andere vindt niets."),
      ),
      notModified: caption(
        both("Unchanged means 304, no body sent", "Ongewijzigd betekent 304, geen body verstuurd"),
        both("On a match the answer is 304 Not Modified. The state is still read for the ETag, but no body is sent.", "Bij een match is het antwoord 304 Not Modified. De stand wordt nog gelezen voor de ETag, maar er gaat geen body mee."),
        both("A page that has not changed gets a header only.", "Een pagina die niet veranderd is krijgt alleen een header."),
      ),
    },
    safety: {
      orient: caption(
        both("Six mechanisms keep the data right", "Zes mechanismen houden de data juist"),
        both("Duplicate reading, late reading, duplicate command, race, migration lock and audit. The film shows four.", "Dubbele meting, late meting, dubbel command, race, migratielock en audit. De film toont er vier."),
        both("In the Postgres path they live in the database writes.", "In het Postgres-pad zitten ze in de schrijfacties naar de database."),
      ),
      focus: caption(
        both("Consistency, up close", "Consistentie van dichtbij"),
        both("PostgreSQL and the parts that write to it stay on screen.", "PostgreSQL en de onderdelen die erin schrijven blijven in beeld."),
        both("Every mechanism lives where the data is written.", "Elk mechanisme zit waar de data wordt geschreven."),
      ),
      duplicate: caption(
        both("The same reading twice is stored once", "Dezelfde meting twee keer wordt een keer opgeslagen"),
        both("The key is asset and measured moment. ON CONFLICT DO NOTHING keeps the first. A late, older reading never moves the current state back.", "De sleutel is asset en meetmoment. ON CONFLICT DO NOTHING houdt de eerste. Een late, oudere meting zet de actuele stand nooit terug."),
        both("A device that resends cannot create a double.", "Een apparaat dat opnieuw stuurt kan geen dubbele maken."),
      ),
      race: caption(
        both("A stale update changes nothing", "Een verouderde update verandert niets"),
        both("UPDATE ... WHERE state = expected. The loser updates 0 rows, so it stops and writes no audit row.", "UPDATE ... WHERE state = verwacht. De verliezer past 0 rijen aan, stopt en schrijft geen auditrij."),
        both("Two writers on one command cannot both win.", "Twee schrijvers op een command kunnen niet allebei winnen."),
      ),
      lock: caption(
        both("One host migrates, the other waits", "Een host migreert, de ander wacht"),
        both("In the Postgres path an advisory lock guards the migration. The second host waits until the schema is current.", "In het Postgres-pad bewaakt een advisory lock de migratie. De tweede host wacht tot het schema bij is."),
        both("Hosts can start together without migrating twice.", "Hosts kunnen samen starten zonder twee keer te migreren."),
      ),
      audit: caption(
        both("Every state change leaves a trace", "Elke statuswijziging laat een spoor na"),
        both("The audit row is written in the same transaction as the change.", "De auditrij wordt in dezelfde transactie geschreven als de wijziging."),
        both("A change cannot commit without its row.", "Een wijziging kan niet committen zonder zijn rij."),
      ),
    },
    scale: {
      orient: caption(
        both("Scale is a set of levers", "Schalen is een set hefbomen"),
        both("Out, up and down are levers in Terraform. The gateway, api and dashboard run 1 replica today.", "Uit, op en af zijn hefbomen in Terraform. De gateway, api en dashboard draaien vandaag 1 replica."),
        both("Each lever has a known place to pull.", "Elke hefboom heeft een bekende plek."),
      ),
      out: caption(
        both("Out: more gateways, 1 today", "Uit: meer gateways, vandaag 1"),
        both("The gateway is stateless. KEDA scaling on queue length is pro only and never applied. The gateway is capped at 1 replica.", "De gateway is stateless. KEDA-schaling op wachtrijlengte is alleen pro en nooit toegepast. De gateway is begrensd op 1 replica."),
        both("Sessions per asset keep command order per device.", "Sessies per asset houden de commandvolgorde per apparaat."),
      ),
      up: caption(
        both("Up: bigger tiers, a lever", "Op: grotere tiers, een hefboom"),
        both("IoT Hub tiers, Service Bus Premium and a larger PostgreSQL tier, with chunks and retention.", "IoT Hub-tiers, Service Bus Premium en een grotere PostgreSQL-tier, met chunks en retentie."),
        both("Each tier sits where the load lands first.", "Elke tier zit waar de last het eerst landt."),
      ),
      down: caption(
        both("Down: apps scale to zero", "Af: apps schalen naar nul"),
        both("Every app has a minimum of 0 replicas. The jobs run once and exit.", "Elke app heeft minimaal 0 replica's. De jobs draaien een keer en stoppen."),
        both("Idle parts stop running.", "Wat stilstaat, draait niet door."),
      ),
      next: caption(
        both("What changes first as it grows", "Wat als eerste verandert bij groei"),
        both("The single-site planner loop, the rollup recompute in the app and in-memory caches with more than one replica.", "De plannerlus per site, het herberekenen van de rollup in de app en in-memory caches bij meer dan een replica."),
        both("These three need work before the levers help.", "Deze drie vragen werk voordat de hefbomen helpen."),
      ),
      levers: caption(
        both("Every step is a lever", "Elke stap is een hefboom"),
        both("Replicas, queue length and three tiers. The gateway holds 1 replica today.", "Replica's, wachtrijlengte en drie tiers. De gateway houdt vandaag 1 replica."),
        both("n is a lever, not a measurement.", "n is een hefboom, geen meting."),
      ),
    },
    cloud: {
      orient: caption(
        both("The platform on Azure", "Het platform op Azure"),
        both("Apps and jobs run on Container Apps. The dev environment ran live on Azure for a demo.", "Apps en jobs draaien op Container Apps. De dev-omgeving draaide live op Azure voor een demo."),
        both("Terraform describes both environments, dev and pro.", "Terraform beschrijft beide omgevingen, dev en pro."),
      ),
      apps: caption(
        both("Three apps and four jobs", "Drie apps en vier jobs"),
        both("The api, gateway and dashboard are Container Apps. Planner, steering, retention and simulator are jobs.", "De api, gateway en dashboard zijn Container Apps. Planner, steering, retention en simulator zijn jobs."),
        both("Jobs run once and exit, apps scale between 0 and 1 replica.", "Jobs draaien een keer en stoppen, apps schalen tussen 0 en 1 replica."),
      ),
      identities: caption(
        both("Seven identities, secrets in Key Vault", "Zeven identiteiten, secrets in Key Vault"),
        both("Each workload has its own user-assigned identity. Secrets are Key Vault references.", "Elke workload heeft een eigen user-assigned identity. Secrets zijn Key Vault-verwijzingen."),
        both("A workload reaches only what its own identity allows.", "Een workload bereikt alleen wat zijn eigen identiteit toestaat."),
      ),
      controls: caption(
        both("A control on the edge it protects", "Een controle op de rand die hij beschermt"),
        both("Device key, hub identity, parameterised queries, content policy, token, internal ingress and an Entra-only queue.", "Apparaatsleutel, hub-identiteit, geparametriseerde queries, content policy, token, interne ingress en een queue alleen voor Entra."),
        both("Each control sits where the risk is.", "Elke controle zit waar het risico zit."),
      ),
      gates: caption(
        both("Gates before every change", "Gates voor elke wijziging"),
        both("NuGet audit, Grype, Semgrep, Gitleaks, Trivy, terraform test and Dependabot.", "NuGet audit, Grype, Semgrep, Gitleaks, Trivy, terraform test en Dependabot."),
        both("Known advisories are checked by these gates.", "Bekende advisories worden door deze gates gecontroleerd."),
      ),
    },
  },
  beatIndicator: both("Beat {current} of {total}", "Stap {current} van {total}"),
  previous: both("Previous", "Vorige"),
  next: both("Next", "Volgende"),
  play: both("Play", "Afspelen"),
  pause: both("Pause", "Pauzeer"),
  textVersion: both("Text version", "Tekstversie"),
  zero: same("0"),
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
  const resolved = resolve(COPY, locale) as Omit<SmartEnergyFilmLabels, "gatesLine">;
  return { ...resolved, gatesLine: resolved.gates.join(", ") };
}
