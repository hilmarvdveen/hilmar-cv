import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "reversible-cut-over-legacy-to-new",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-09-06",
  readingTimeMin: 13,
  title: {
    en: "Moving live traffic off a legacy system, one step at a time",
    nl: "Live verkeer van een legacysysteem halen, stap voor stap",
  },
  description: {
    en: "The method behind a cut-over with no customer-facing outage: read the old system, ship behind a switch, ramp by share, keep the way back to one action.",
    nl: "De methode achter een cut-over zonder onderbreking voor klanten: oude systeem lezen, live achter een schakelaar, per stap opschalen, terug in een handeling.",
  },
  excerpt: {
    en: "Rebuilding a page is the part you can review. Putting live customers on it is the part that needs a method. This is the one I used to move three account pages at bol.com onto a new platform, with the old system serving until the last visitor had moved.",
    nl: "Een pagina herbouwen is het deel dat je kunt reviewen. Er echte klanten op zetten is het deel dat een methode vraagt. Dit is de methode waarmee ik bij bol.com drie accountpagina's naar een nieuw platform bracht, met het oude systeem in de lucht tot de laatste bezoeker over was.",
  },
  keywords: [
    "reversible cut-over",
    "legacy to react migration",
    "traffic ramp by percentage",
    "stable bucketing per visitor",
    "strangler pattern frontend",
    "release behind a feature switch",
    "rollback in one step",
  ],
};

function buildLaneDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("visitors", copy.nodeVisitors[locale], { x: 0, y: 140 }, { tone: "slate", subtitle: copy.nodeVisitorsSub[locale], width: 180 }),
    flowNode("routingLayer", copy.nodeRoutingLayer[locale], { x: 240, y: 140 }, { tone: "violet", subtitle: copy.nodeRoutingLayerSub[locale], width: 250 }),
    flowNode("oldSystem", copy.nodeOldSystem[locale], { x: 560, y: 20 }, { tone: "amber", subtitle: copy.nodeOldSystemSub[locale], width: 230 }),
    flowNode("newPages", copy.nodeNewPages[locale], { x: 560, y: 250 }, { tone: "emerald", subtitle: copy.nodeNewPagesSub[locale], width: 230 }),
    flowNode("ruleBack", copy.nodeRuleBack[locale], { x: 240, y: 370 }, { tone: "rose", subtitle: copy.nodeRuleBackSub[locale], direction: "TB", width: 250 }),
  ];
  const edges = [
    flowEdge("visitors", "routingLayer"),
    flowEdge("routingLayer", "oldSystem", { label: copy.edgeRest[locale] }),
    flowEdge("routingLayer", "newPages", { label: copy.edgeGrowingShare[locale] }),
    flowEdge("routingLayer", "ruleBack", { dashed: true, label: copy.edgeAnyStep[locale] }),
  ];
  return { nodes, edges };
}

function buildBucketDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("firstVisit", copy.nodeFirstVisit[locale], { x: 0, y: 10 }, { tone: "slate", subtitle: copy.nodeSameIdentifier[locale], width: 210 }),
    flowNode("laterVisit", copy.nodeLaterVisit[locale], { x: 0, y: 110 }, { tone: "slate", subtitle: copy.nodeSameIdentifier[locale], width: 210 }),
    flowNode("anyVisit", copy.nodeAnyVisit[locale], { x: 0, y: 210 }, { tone: "slate", subtitle: copy.nodeSameIdentifier[locale], width: 210 }),
    flowNode("hashed", copy.nodeHashed[locale], { x: 300, y: 110 }, { tone: "violet", subtitle: copy.nodeHashedSub[locale], width: 240 }),
    flowNode("group", copy.nodeGroup[locale], { x: 760, y: 110 }, { tone: "emerald", subtitle: copy.nodeGroupSub[locale], width: 230 }),
  ];
  const edges = [
    flowEdge("firstVisit", "hashed"),
    flowEdge("laterVisit", "hashed"),
    flowEdge("anyVisit", "hashed"),
    flowEdge("hashed", "group", { label: copy.edgeSameBucket[locale] }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const lanes = buildLaneDiagram(locale);
  const buckets = buildBucketDiagram(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.riskTitle[locale],
          copy.readTitle[locale],
          copy.confirmTitle[locale],
          copy.switchTitle[locale],
          copy.employeesTitle[locale],
          copy.rampTitle[locale],
          copy.backTitle[locale],
          copy.watchTitle[locale],
          copy.wrongTitle[locale],
          copy.retireTitle[locale],
          copy.checklistTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.riskTitle[locale]}</H2>
      <P>{copy.risk1[locale]}</P>
      <P>{copy.risk2[locale]}</P>
      <P>{copy.risk3[locale]}</P>

      <H2>{copy.readTitle[locale]}</H2>
      <P>{copy.read1[locale]}</P>
      <P>{copy.read2[locale]}</P>
      <P>{copy.read3[locale]}</P>
      <CodeBlock lang="ts" filename="migration/account-overview.ts" code={PAGE_BEHAVIOUR_CODE} />
      <P>{copy.read4[locale]}</P>

      <H2>{copy.confirmTitle[locale]}</H2>
      <P>{copy.confirm1[locale]}</P>
      <P>{copy.confirm2[locale]}</P>
      <P>{copy.confirm3[locale]}</P>

      <H2>{copy.switchTitle[locale]}</H2>
      <P>{copy.switch1[locale]}</P>
      <FlowDiagram
        nodes={lanes.nodes}
        edges={lanes.edges}
        height={440}
        ariaLabel={copy.laneAria[locale]}
        caption={copy.laneCaption[locale]}
      />
      <P>{copy.switch2[locale]}</P>
      <CodeBlock lang="yaml" filename="routing/account-pages.yaml" code={ROUTING_RULE_CODE} />
      <P>{copy.switch3[locale]}</P>
      <P>{copy.switch4[locale]}</P>

      <H2>{copy.employeesTitle[locale]}</H2>
      <P>{copy.employees1[locale]}</P>
      <P>{copy.employees2[locale]}</P>
      <P>{copy.employees3[locale]}</P>

      <H2>{copy.rampTitle[locale]}</H2>
      <P>{copy.ramp1[locale]}</P>
      <P>{copy.ramp2[locale]}</P>
      <FlowDiagram
        nodes={buckets.nodes}
        edges={buckets.edges}
        height={320}
        ariaLabel={copy.bucketAria[locale]}
        caption={copy.bucketCaption[locale]}
      />
      <P>{copy.ramp3[locale]}</P>
      <CodeBlock lang="ts" filename="rollout/bucket.ts" code={BUCKET_CODE} />
      <P>{copy.ramp4[locale]}</P>

      <H2>{copy.backTitle[locale]}</H2>
      <P>{copy.back1[locale]}</P>
      <P>{copy.back2[locale]}</P>
      <Callout variant="tip" title={copy.stepNoteTitle[locale]}>
        {copy.stepNoteBody[locale]}
      </Callout>
      <P>{copy.back3[locale]}</P>

      <H2>{copy.watchTitle[locale]}</H2>
      <P>{copy.watch1[locale]}</P>
      <P>{copy.watch2[locale]}</P>
      <CodeBlock lang="tsx" filename="app/PageBoundary.tsx" code={PAGE_BOUNDARY_CODE} />
      <P>{copy.watch3[locale]}</P>
      <UL>
        <LI><Strong>{copy.errorRateLabel[locale]}</Strong> {copy.errorRateBody[locale]}</LI>
        <LI><Strong>{copy.analyticsLabel[locale]}</Strong> {copy.analyticsBody[locale]}</LI>
        <LI><Strong>{copy.dataPathLabel[locale]}</Strong> {copy.dataPathBody[locale]}</LI>
      </UL>
      <P>{copy.watch4[locale]}</P>

      <Divider />

      <H2>{copy.wrongTitle[locale]}</H2>
      <P>{copy.wrong1[locale]}</P>
      <P>{copy.wrong2[locale]}</P>
      <Callout variant="warning" title={copy.orderNoteTitle[locale]}>
        {copy.orderNoteBody[locale]}
      </Callout>
      <P>{copy.wrong3[locale]}</P>

      <H2>{copy.retireTitle[locale]}</H2>
      <P>{copy.retire1[locale]}</P>
      <P>{copy.retire2[locale]}</P>
      <P>{copy.retire3[locale]}</P>

      <H2>{copy.checklistTitle[locale]}</H2>
      <P>{copy.checklistIntro[locale]}</P>
      <OL>
        <LI>{copy.checkOne[locale]}</LI>
        <LI>{copy.checkTwo[locale]}</LI>
        <LI>{copy.checkThree[locale]}</LI>
        <LI>{copy.checkFour[locale]}</LI>
        <LI>{copy.checkFive[locale]}</LI>
        <LI>{copy.checkSix[locale]}</LI>
        <LI>{copy.checkSeven[locale]}</LI>
        <LI>{copy.checkEight[locale]}</LI>
        <LI>{copy.checkNine[locale]}</LI>
        <LI>{copy.checkTen[locale]}</LI>
      </OL>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
    </>
  );
}

const PAGE_BEHAVIOUR_CODE = `export type BehaviourRule = {
  situation: string;
  shows: string;
  textKey: string;
};

export type PageBehaviour = {
  address: string;
  analyticsName: string;
  services: string[];
  rules: BehaviourRule[];
};

export const accountOverview: PageBehaviour = {
  address: "/account/overview",
  analyticsName: "account_overview",
  services: ["subscription service", "membership service"],
  rules: [
    {
      situation: "no subscription",
      shows: "the offer block",
      textKey: "account.overview.offer",
    },
    {
      situation: "an active subscription",
      shows: "the management block with the renewal date",
      textKey: "account.overview.manage",
    },
    {
      situation: "a cancellation requested",
      shows: "the date the subscription ends",
      textKey: "account.overview.ends",
    },
    {
      situation: "managed by another provider",
      shows: "a link out to that provider",
      textKey: "account.overview.external",
    },
  ],
};`;

const ROUTING_RULE_CODE = `routes:
  - path: /account/overview
    backend: legacy-storefront
    rollout:
      backend: new-account-application
      employees: enabled
      customerShare: account-overview-share
      disabled: false

  - path: /account
    backend: legacy-storefront`;

const BUCKET_CODE = `const HASH_OFFSET = 2166136261;
const HASH_PRIME = 16777619;
const BUCKET_COUNT = 100;

function hashToNumber(value: string): number {
  let hash = HASH_OFFSET;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, HASH_PRIME);
  }
  return hash >>> 0;
}

export function bucketFor(visitorIdentifier: string, rolloutKey: string): number {
  return hashToNumber(rolloutKey + ":" + visitorIdentifier) % BUCKET_COUNT;
}

export function servedByTheNewPages(
  visitorIdentifier: string,
  rolloutKey: string,
  shareOfVisitors: number
): boolean {
  return bucketFor(visitorIdentifier, rolloutKey) < shareOfVisitors;
}`;

const PAGE_BOUNDARY_CODE = `import { Component, type ErrorInfo, type ReactNode } from "react";
import { captureException } from "@sentry/react";

type PageBoundaryProps = {
  pageName: string;
  fallback: ReactNode;
  children: ReactNode;
};

type PageBoundaryState = {
  failed: boolean;
};

export class PageBoundary extends Component<PageBoundaryProps, PageBoundaryState> {
  state: PageBoundaryState = { failed: false };

  static getDerivedStateFromError(): PageBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error, {
      tags: { page: this.props.pageName, servedBy: "new-account-application" },
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "The part of a migration you can review is the new page. The part that decides how it goes is the minute a real customer is served by it for the first time.",
    nl: "Het deel van een migratie dat je kunt reviewen, is de nieuwe pagina. Het deel dat bepaalt hoe het loopt, is de minuut waarin een echte klant hem voor het eerst voor zich krijgt.",
  },
  intro1: {
    en: "At bol.com I moved three live account pages off a legacy Java storefront onto a server-rendered React platform. Those are the pages where customers manage what they pay for, so they are open at every hour of the day. Customers moved across with no customer-facing outage.",
    nl: "Bij bol.com haalde ik drie live accountpagina's weg bij een verouderde Java-webshop en zette ik ze op een server-rendered React-platform. Op die pagina's regelen klanten waar ze voor betalen, dus ze staan op elk uur van de dag open. Ze gingen mee over zonder onderbreking voor klanten.",
  },
  intro2: {
    en: "What made that possible was the order of the steps around the rebuild. This article writes that order down, in the form I would hand to a team with the same job in front of them. The examples come from a frontend. The method itself has nothing to do with frameworks.",
    nl: "Wat dat mogelijk maakte, was de volgorde van de stappen rondom de herbouw. Dit artikel legt die volgorde vast, in de vorm waarin ik hem zou geven aan een team dat dezelfde klus voor zich heeft. De voorbeelden komen uit een frontend. De methode zelf staat los van frameworks.",
  },
  quote: {
    en: "A cut-over is not a moment you get through. It is a series of small steps, each one reversible, and the last one is the dullest of them all.",
    nl: "Een cut-over is geen moment dat je doorstaat. Het is een reeks kleine stappen die je stuk voor stuk kunt terugdraaien, en de laatste is de saaiste van allemaal.",
  },
  riskTitle: {
    en: "Why the risky part is not the code",
    nl: "Waarom het risico niet in de code zit",
  },
  risk1: {
    en: "A rebuilt page can be reviewed, tested, mocked and demonstrated. Colleagues read it, Storybook shows every state, and the test suite proves the states it can reach. All of that happens under conditions you picked yourself.",
    nl: "Een herbouwde pagina kun je reviewen, testen, mocken en demonstreren. Collega's lezen hem, Storybook toont elke toestand en de testsuite bewijst de toestanden die hij kan bereiken. Dat gebeurt allemaal onder omstandigheden die je zelf hebt gekozen.",
  },
  risk2: {
    en: "Live traffic brings the conditions nobody picked. Sessions that started an hour ago. Accounts in a state nobody wrote a story for. A bookmark somebody saved three years ago that still points at an address with a trailing slash. Browsers you have never opened.",
    nl: "Live verkeer brengt de omstandigheden die niemand koos. Sessies die een uur geleden begonnen. Accounts in een toestand waar niemand een story voor bedacht. Een bladwijzer die iemand drie jaar geleden bewaarde en die nog steeds naar een adres met een slash aan het eind wijst. Browsers die je nooit hebt geopend.",
  },
  risk3: {
    en: "A release that hands everything over at once packs all of that into one event, at one moment, watched by whoever happens to be online. The same release split into steps turns it into a series of small questions with a short answer each time. Does this group get what it used to get? Yes, so the next group moves. No, so the rule goes back and the reports get read.",
    nl: "Een release die alles in een keer overzet, propt dat allemaal in een gebeurtenis, op een moment, bekeken door wie er toevallig online is. Dezelfde release in stappen maakt er een reeks kleine vragen van, met elke keer een kort antwoord. Krijgt deze groep wat ze gewend was? Ja, dan gaat de volgende groep over. Nee, dan gaat de regel terug en lees je de meldingen.",
  },
  readTitle: {
    en: "Read the old system first, and write down what it does",
    nl: "Lees eerst het oude systeem en schrijf op wat het doet",
  },
  read1: {
    en: "The pages I had to move had no written specification. Their behaviour lived in server-side Java and 226 Handlebars templates. I could read that code and I could not change it, which turned out to be the right constraint. Reading it was the assignment.",
    nl: "De pagina's die ik moest verplaatsen hadden geen geschreven specificatie. Hun gedrag zat in server-side Java en 226 Handlebars-templates. Ik kon die code lezen en niet wijzigen, en dat bleek de juiste beperking. Lezen was de opdracht.",
  },
  read2: {
    en: "So I wrote down what each page actually does. The exact addresses it answers on, the text a customer sees, the rules that decide which block appears, and the analytics events it fires. Prose is the wrong shape for that. A table is the right one, because a table has empty cells and an empty cell is a question.",
    nl: "Dus schreef ik op wat elke pagina werkelijk doet. De exacte adressen waarop hij antwoordt, de tekst die een klant ziet, de regels die bepalen welk blok verschijnt en de analytics-events die hij afvuurt. Proza is daar de verkeerde vorm voor. Een tabel is de goede vorm, want een tabel heeft lege cellen en een lege cel is een vraag.",
  },
  read3: {
    en: "This is the shape I keep coming back to. One record per page, with the situations listed as data.",
    nl: "Dit is de vorm waar ik steeds op terugkom. Een record per pagina, met de situaties als data.",
  },
  read4: {
    en: "Written like this, the specification is something you can walk through with a second person, and later something you hold the rebuilt page against, situation by situation. At Athlon the same reading came out of an Angular 1.6 application. Everything that application already did had to keep working, and that becomes a testable statement the moment somebody has written down what it did.",
    nl: "Zo opgeschreven is de specificatie iets wat je met een tweede persoon kunt doorlopen, en later iets waar je de herbouwde pagina situatie voor situatie tegenaan houdt. Bij Athlon kwam dezelfde lezing uit een Angular 1.6-applicatie. Alles wat die applicatie al deed, moest blijven werken, en dat wordt een toetsbare uitspraak zodra iemand heeft opgeschreven wat ze deed.",
  },
  confirmTitle: {
    en: "Check your reading with the people who own it",
    nl: "Toets je lezing bij de mensen die het beheren",
  },
  confirm1: {
    en: "Reading code tells you what a system does. It does not tell you which parts of that are deliberate. A branch can be a rule the business leans on, or a detour somebody added on a Friday afternoon in 2014, and in the code the two look the same.",
    nl: "Code lezen vertelt je wat een systeem doet. Het vertelt je niet welk deel daarvan bedoeld is. Een vertakking kan een regel zijn waar de business op leunt, of een omweg die iemand op een vrijdagmiddag in 2014 toevoegde, en in de code zien die twee er hetzelfde uit.",
  },
  confirm2: {
    en: "So the table goes to the engineers who own the services behind the page. At bol.com I sat down with them, walked through my reading and asked what the new page would need from the API. That conversation costs an afternoon. It moves the surprises to a moment when they are still cheap, and it gives the rebuild a second person who knows why the page works the way it does.",
    nl: "Dus gaat de tabel naar de engineers die de services achter de pagina beheren. Bij bol.com ging ik met ze zitten, liep ik mijn lezing langs en vroeg ik wat de nieuwe pagina van de API nodig zou hebben. Dat gesprek kost een middag. Het verplaatst de verrassingen naar een moment waarop ze nog goedkoop zijn, en het geeft de herbouw een tweede persoon die weet waarom de pagina werkt zoals hij werkt.",
  },
  confirm3: {
    en: "It settles the data contract early as well. Where the schema did not fit a page that reads its own data, the field changed on the backend side. A bare mandate reference became a structured mandate object, and the page stayed simple.",
    nl: "Het legt ook het datacontract vroeg vast. Waar het schema niet paste bij een pagina die zijn eigen data leest, veranderde het veld aan de backendkant. Een kaal mandaatkenmerk werd een gestructureerd mandaatobject, en de pagina bleef eenvoudig.",
  },
  switchTitle: {
    en: "Build the new page behind a switch",
    nl: "Bouw de nieuwe pagina achter een schakelaar",
  },
  switch1: {
    en: "The switch does not live in the new application. It lives one layer above both of them, in the routing layer that decides which backend answers an address. That layer keeps the old system as the default answer and carries one extra rule that can divert a chosen slice of traffic to the new one.",
    nl: "De schakelaar zit niet in de nieuwe applicatie. Hij zit een laag hoger, in de routeringslaag die bepaalt welke backend een adres beantwoordt. Die laag houdt het oude systeem als standaardantwoord en draagt een extra regel die een gekozen deel van het verkeer naar de nieuwe kant kan sturen.",
  },
  switch2: {
    en: "Written out, the rule is short. The address, the backend that serves it today, and the conditions under which a different backend serves it. The order of the entries carries meaning, which is a detail worth remembering for later.",
    nl: "Uitgeschreven is die regel kort. Het adres, de backend die hem vandaag bedient, en de voorwaarden waaronder een andere backend dat doet. De volgorde van de regels draagt betekenis, en dat is een detail om te onthouden voor straks.",
  },
  switch3: {
    en: "Two properties matter more than the syntax. The rule is data, so changing it is a configuration change and not a release. And the old path stays untouched, so the way back is the absence of the rule.",
    nl: "Twee eigenschappen wegen zwaarder dan de syntaxis. De regel is data, dus hem wijzigen is een configuratiewijziging en geen release. En het oude pad blijft ongemoeid, dus de weg terug is het ontbreken van de regel.",
  },
  switch4: {
    en: "At bol.com that layer belongs to the platform team. My work was the routing rules for these addresses, written in their repository and merged by them after review. Working inside somebody else's codebase makes a change slower to land and much better read.",
    nl: "Bij bol.com is die laag van het platformteam. Mijn werk waren de routeringsregels voor deze adressen, geschreven in hun repository en door hen gemerged na review. Werken in de codebase van een ander maakt een wijziging trager en veel beter gelezen.",
  },
  laneAria: {
    en: "Diagram: visitors arrive at the platform's routing layer, which keeps the old system serving everyone not moved yet, sends a growing share to the new pages, and can be set back at any step",
    nl: "Diagram: bezoekers komen bij de routeringslaag van het platform, die het oude systeem laat bedienen voor wie nog niet over is, een groeiend deel naar de nieuwe pagina's stuurt en bij elke stap terug te zetten is",
  },
  laneCaption: {
    en: "The old system keeps serving until the last visitor has moved, so every step has somewhere to go back to.",
    nl: "Het oude systeem blijft bedienen tot de laatste bezoeker over is, zodat elke stap een weg terug heeft.",
  },
  employeesTitle: {
    en: "Employees first",
    nl: "Eerst de medewerkers",
  },
  employees1: {
    en: "The first group to see the new page is the group you can talk to. At bol.com employees were served the new pages before any customer was. Their sessions are real sessions, with real accounts, real data and real browsers, and the person behind one of them can describe what they saw in a sentence.",
    nl: "De eerste groep die de nieuwe pagina ziet, is de groep die je kunt aanspreken. Bij bol.com kregen medewerkers de nieuwe pagina's te zien voordat een klant ze zag. Hun sessies zijn echte sessies, met echte accounts, echte data en echte browsers, en de persoon erachter kan in een zin vertellen wat hij zag.",
  },
  employees2: {
    en: "This step catches a specific class of problem. Not the kind a test would have caught, but the kind that needs a whole environment to appear. A page that renders for an account with two subscriptions and stays blank for an account with none. A link that leaves the new application and lands back on the old one.",
    nl: "Deze stap vangt een specifiek soort probleem. Niet het soort dat een test had gevonden, maar het soort dat een hele omgeving nodig heeft om zich te laten zien. Een pagina die rendert voor een account met twee abonnementen en leeg blijft voor een account zonder abonnement. Een link die de nieuwe applicatie verlaat en weer op de oude uitkomt.",
  },
  employees3: {
    en: "It changes the conversation as well. By the time customers arrive, colleagues have been using the page for days, so the next step is a decision about something people already know.",
    nl: "Het verandert ook het gesprek. Tegen de tijd dat klanten aan de beurt zijn, gebruiken collega's de pagina al dagen, dus de volgende stap gaat over iets wat mensen al kennen.",
  },
  rampTitle: {
    en: "Ramp by percentage, and keep each visitor in one group",
    nl: "Schaal op per percentage en houd elke bezoeker bij dezelfde groep",
  },
  ramp1: {
    en: "After the employees comes a small share of customers, then more, with a check before each next step. How big the steps are is a judgement call that depends on the traffic the page gets and on how quickly a problem would show up in the numbers. What stays the same is the check. Every step is followed by a look at the reports before the next one is taken.",
    nl: "Na de medewerkers komt een klein deel van de klanten, daarna meer, met een controle voor elke volgende stap. Hoe groot die stappen zijn, is een afweging die afhangt van het verkeer op de pagina en van hoe snel een probleem zichtbaar wordt in de cijfers. Wat hetzelfde blijft, is de controle. Na elke stap kijk je naar de meldingen voordat je de volgende zet.",
  },
  ramp2: {
    en: "The property that makes a ramp safe is the one that is easiest to get wrong. A visitor who is served the new page has to keep being served the new page. When the group is drawn fresh on every request, a customer meets the new layout, refreshes the tab and lands back on the old one, halfway through a form.",
    nl: "De eigenschap die het opschalen veilig maakt, is ook de eigenschap die het makkelijkst misgaat. Een bezoeker die de nieuwe pagina krijgt, moet de nieuwe pagina blijven krijgen. Wordt de groep bij elk verzoek opnieuw getrokken, dan ziet een klant de nieuwe indeling, ververst hij zijn tabblad en staat hij halverwege een formulier weer op de oude.",
  },
  ramp3: {
    en: "The fix is to derive the group from something stable about the visitor. Hash an identifier that stays the same across visits and turn that hash into a bucket. The same identifier always lands in the same bucket, so raising the share only ever moves people in one direction.",
    nl: "De oplossing is de groep afleiden uit iets vasts van de bezoeker. Hash een identifier die tussen bezoeken hetzelfde blijft en maak van die hash een bucket. Dezelfde identifier komt altijd in dezelfde bucket, dus het aandeel verhogen verplaatst mensen maar in een richting.",
  },
  ramp4: {
    en: "Salting the hash with a key per rollout keeps two rollouts running next to each other from selecting the same people, which starts to matter the moment the second one begins. The first page I moved went across in five separate steps, each one a small change to the rule, each one checked before the next.",
    nl: "Door de hash te zouten met een sleutel per uitrol selecteren twee uitrollen die naast elkaar lopen niet dezelfde mensen, en dat gaat tellen zodra de tweede begint. De eerste pagina die ik overzette, ging in vijf losse stappen over, elke stap een kleine wijziging in de regel, elke stap gecontroleerd voordat de volgende kwam.",
  },
  bucketAria: {
    en: "Diagram: three visits by the same visitor pass through the same hashed identifier and arrive in the same group every time",
    nl: "Diagram: drie bezoeken van dezelfde bezoeker gaan door dezelfde gehashte identifier en komen elke keer in dezelfde groep uit",
  },
  bucketCaption: {
    en: "Each visitor is assigned once, so nobody sees the old page and the new page in turn.",
    nl: "Elke bezoeker wordt een keer ingedeeld, zodat niemand om beurten de oude en de nieuwe pagina ziet.",
  },
  backTitle: {
    en: "Keep the way back to one action",
    nl: "Houd het terugdraaien op een enkele handeling",
  },
  back1: {
    en: "Every step in the ramp was reversible in one action. That is the sentence to hold on to, because it sets the tone of every step that follows it.",
    nl: "Elke stap in het opschalen was in een handeling terug te draaien. Dat is de zin om vast te houden, want die bepaalt de toon van elke stap die erop volgt.",
  },
  back2: {
    en: "One action means one change to the rule, carried out by the person who is watching, at the moment they see something they do not like. It does not mean a revert commit, a pipeline run and a deploy. It does not mean waking somebody who holds the right permissions. Write the way back down before the step, and make sure the person taking the step can carry it out alone.",
    nl: "Een handeling betekent een wijziging in de regel, uitgevoerd door de persoon die meekijkt, op het moment dat hij iets ziet wat hem niet bevalt. Het betekent geen revert-commit, pipeline en deploy. Het betekent ook niet dat iemand met de juiste rechten uit bed gebeld wordt. Schrijf de weg terug op voordat je de stap zet, en zorg dat degene die de stap zet hem alleen kan uitvoeren.",
  },
  stepNoteTitle: {
    en: "One sentence before every step",
    nl: "Voor elke stap een zin",
  },
  stepNoteBody: {
    en: "Write down what you expect to see, where you will see it, and the single action that puts the traffic back. When that sentence is hard to write, the step is too big.",
    nl: "Schrijf op wat je verwacht te zien, waar je het ziet, en de ene handeling die het verkeer terugzet. Is die zin lastig op te schrijven, dan is de stap te groot.",
  },
  back3: {
    en: "The way back has a second effect, and it shows up in the pace. When going back is a small action, a step is cheap to take. When going back is an incident, every step turns into a meeting.",
    nl: "De weg terug heeft nog een effect, en dat zie je terug in het tempo. Is teruggaan een kleine handeling, dan is een stap goedkoop. Is teruggaan een incident, dan wordt elke stap een vergadering.",
  },
  watchTitle: {
    en: "What to watch while it ramps",
    nl: "Waar je op let tijdens het opschalen",
  },
  watch1: {
    en: "Error reporting comes first. It goes on before the first step, while nothing has happened yet. At bol.com I switched Sentry on end to end for the app, with source maps uploaded so the stack traces are readable and a label per page so a report says where it came from.",
    nl: "Foutmeldingen komen eerst. Die zet je aan voor de eerste stap, terwijl er nog niets gebeurd is. Bij bol.com zette ik Sentry end-to-end aan voor de app, met sourcemaps zodat de stack traces leesbaar zijn en een label per pagina zodat een melding vertelt waar hij vandaan komt.",
  },
  watch2: {
    en: "Around the new page a boundary catches whatever escapes a component, shows the customer something usable, and reports the failure with the page name and the application that served it.",
    nl: "Rond de nieuwe pagina vangt een boundary op wat aan een component ontsnapt, laat de klant iets bruikbaars zien en meldt de fout met de naam van de pagina en de applicatie die hem bediende.",
  },
  watch3: {
    en: "Next to that, three things belong on a screen while a step is running.",
    nl: "Daarnaast horen er drie dingen op een scherm te staan terwijl een stap loopt.",
  },
  errorRateLabel: { en: "The error rate on both sides.", nl: "Het aantal fouten aan beide kanten." },
  errorRateBody: {
    en: "The old system is a control group you were handed for free, so comparing the two is the fastest read available to you.",
    nl: "Het oude systeem is een controlegroep die je cadeau krijgt, dus die twee vergelijken is de snelste aflezing die je hebt.",
  },
  analyticsLabel: { en: "The analytics for the page.", nl: "De analytics van de pagina." },
  analyticsBody: {
    en: "Events have to identify the page correctly, or the funnels quietly stop lining up while every dashboard still looks healthy.",
    nl: "Events moeten de pagina goed benoemen, anders lopen de funnels stilletjes uit elkaar terwijl elk dashboard er nog gezond uitziet.",
  },
  dataPathLabel: { en: "The data path.", nl: "Het datapad." },
  dataPathBody: {
    en: "A partial response from an API is an ordinary event. The page renders what did arrive, and the rest of the story goes to the error reporter.",
    nl: "Een gedeeltelijk antwoord van een API is een gewone gebeurtenis. De pagina toont wat er binnenkwam, en de rest van het verhaal gaat naar de foutmelding.",
  },
  watch4: {
    en: "None of that is exotic. It is what puts the first report of a problem on a dashboard, at a moment when a small action is still enough.",
    nl: "Niets daarvan is bijzonder. Het zorgt ervoor dat de eerste melding van een probleem op een dashboard staat, op een moment waarop een kleine handeling nog genoeg is.",
  },
  wrongTitle: {
    en: "What goes wrong, and what it looks like",
    nl: "Wat er misgaat, en hoe dat eruitziet",
  },
  wrong1: {
    en: "During the ramp of the account pages I found a route-matching order bug. A broader rule was matching before the specific address, so the new rule never got its turn. It surfaced while employees were on the page and it was fixed as part of the same ramp.",
    nl: "Tijdens het opschalen van de accountpagina's vond ik een fout in de routeringsvolgorde. Een bredere regel matchte eerder dan het specifieke adres, waardoor de nieuwe regel nooit aan de beurt kwam. Hij kwam boven water terwijl medewerkers op de pagina zaten en werd binnen dezelfde uitrol opgelost.",
  },
  wrong2: {
    en: "That is the shape most cut-over problems have. Not a crash. Something quietly answering the wrong way, which a test in isolation cannot see because the behaviour only exists once several rules sit next to each other.",
    nl: "Zo zien de meeste cut-overproblemen eruit. Geen crash. Iets wat stilletjes het verkeerde antwoord geeft, en wat een test in isolatie niet ziet, omdat dat gedrag pas bestaat zodra meerdere regels naast elkaar staan.",
  },
  orderNoteTitle: {
    en: "The rule that matches first wins",
    nl: "De regel die als eerste matcht, wint",
  },
  orderNoteBody: {
    en: "Routing rules are read in order, so a rule for a whole section can cover the rule for one address inside it. Check the order that is actually applied, not the order in the file, and prove it with a request.",
    nl: "Routeringsregels worden op volgorde gelezen, dus een regel voor een hele sectie kan de regel voor een adres daarbinnen afdekken. Controleer de volgorde die daadwerkelijk wordt toegepast, niet de volgorde in het bestand, en bewijs hem met een verzoek.",
  },
  wrong3: {
    en: "The rest of the family is just as dull. An address that differs only by a trailing slash. A redirect that puts the visitor back on the old system on the way to the next page. A cache in front of the routing layer holding a decision from before the rule changed. All of them are easy to fix and easy to see, and all of them appear only with traffic on the page. That is exactly why the first traffic belongs to people who work at the company.",
    nl: "De rest van de familie is net zo saai. Een adres dat alleen verschilt door een slash aan het eind. Een redirect die de bezoeker onderweg naar de volgende pagina weer op het oude systeem zet. Een cache voor de routeringslaag die een beslissing vasthoudt van voor de wijziging. Ze zijn allemaal makkelijk op te lossen en makkelijk te zien, en ze laten zich pas zien met verkeer op de pagina. Precies daarom hoort het eerste verkeer bij mensen die bij het bedrijf werken.",
  },
  retireTitle: {
    en: "When the old system finally goes",
    nl: "Wanneer het oude systeem eindelijk weg kan",
  },
  retire1: {
    en: "The old system does not switch off on the day the new one serves everyone. It stays in service, unchanged, for as long as it takes the numbers to look ordinary across a full cycle of the business. A stretch that includes a payday, a weekend and whatever the monthly peak is.",
    nl: "Het oude systeem gaat niet uit op de dag dat het nieuwe iedereen bedient. Het blijft ongewijzigd in de lucht zolang de cijfers nodig hebben om over een hele bedrijfscyclus gewoon te blijven. Een periode met een betaaldag, een weekend en de piek van de maand erin.",
  },
  retire2: {
    en: "After that the clean-up is a small project of its own. First the rollout branch of the rule, then the rule, then the templates and the endpoints behind them. A switch left standing after it is fully on becomes configuration nobody dares to touch a year later, so removing it belongs to the work.",
    nl: "Daarna is het opruimen een eigen klusje. Eerst de uitroltak van de regel, dan de regel, dan de templates en de endpoints erachter. Een schakelaar die blijft staan nadat hij volledig aan is, wordt configuratie waar een jaar later niemand meer aan durft te komen, dus het verwijderen hoort bij het werk.",
  },
  retire3: {
    en: "At Conclusion the same shape ran over a longer stretch. The existing learning platform stayed in service while the front end moved to Vue step by step. Keeping the old system running is not a price you pay for the method. It is what makes the method work.",
    nl: "Bij Conclusion liep dezelfde vorm over een langere periode. Het bestaande leerplatform bleef in de lucht terwijl de front-end stap voor stap naar Vue ging. Het oude systeem draaiende houden is geen prijs die je voor de methode betaalt. Het is wat de methode laat werken.",
  },
  checklistTitle: {
    en: "A checklist you can hand to a team",
    nl: "Een checklist die je aan een team kunt geven",
  },
  checklistIntro: {
    en: "Everything above fits on one page. This is the version I would pin next to the board.",
    nl: "Alles hierboven past op een pagina. Dit is de versie die ik naast het bord zou hangen.",
  },
  checkOne: {
    en: "Write down what the old page does: addresses, text, rules and events, one row per situation.",
    nl: "Schrijf op wat de oude pagina doet: adressen, teksten, regels en events, een rij per situatie.",
  },
  checkTwo: {
    en: "Have that reading confirmed by the engineers who own the services behind the page.",
    nl: "Laat die lezing bevestigen door de engineers die de services achter de pagina beheren.",
  },
  checkThree: {
    en: "Agree the data the new page needs while the specification is still on the table.",
    nl: "Spreek de data af die de nieuwe pagina nodig heeft, terwijl de specificatie nog op tafel ligt.",
  },
  checkFour: {
    en: "Put the rule in the routing layer, with the old system as the default answer.",
    nl: "Zet de regel in de routeringslaag, met het oude systeem als standaardantwoord.",
  },
  checkFive: {
    en: "Derive each visitor's group from a hashed stable identifier, salted per rollout.",
    nl: "Leid de groep van elke bezoeker af uit een gehashte, vaste identifier, gezouten per uitrol.",
  },
  checkSix: {
    en: "Turn on error reporting per page, with readable stack traces, before the first step.",
    nl: "Zet foutmeldingen per pagina aan, met leesbare stack traces, voor de eerste stap.",
  },
  checkSeven: {
    en: "Serve employees first, and give them one place to report what they saw.",
    nl: "Bedien eerst de medewerkers en geef ze een plek om te melden wat ze zagen.",
  },
  checkEight: {
    en: "Raise the share in steps, and read the reports before each next one.",
    nl: "Verhoog het aandeel in stappen en lees de meldingen voor elke volgende.",
  },
  checkNine: {
    en: "Write the single action that puts the traffic back, before the step is taken.",
    nl: "Schrijf de ene handeling op die het verkeer terugzet, voordat de stap gezet wordt.",
  },
  checkTen: {
    en: "Once everyone is across and a full business cycle looks ordinary, remove the rule and then the old page.",
    nl: "Is iedereen over en ziet een hele bedrijfscyclus er gewoon uit, haal dan de regel weg en daarna de oude pagina.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "The method is deliberately boring. Read, write down, confirm, build behind a switch, employees, a small share, more, everyone, then clean up. Each step answers one question and leaves the way back intact.",
    nl: "De methode is met opzet saai. Lezen, opschrijven, toetsen, achter een schakelaar bouwen, medewerkers, een klein deel, meer, iedereen, en dan opruimen. Elke stap beantwoordt een vraag en laat de weg terug intact.",
  },
  close2: {
    en: "What it buys is the sentence that counts on a page customers pay through. It moved, and the people using it did not have to notice. The chain from reading the old code to the last step of the ramp stayed in one pair of hands, which is why the steps lined up.",
    nl: "Wat het oplevert, is de zin die telt bij een pagina waar klanten doorheen betalen. Hij is verhuisd, en de mensen die hem gebruiken hoefden er niets van te merken. De keten van het lezen van de oude code tot de laatste stap van het opschalen bleef in een paar handen, en daardoor sloten de stappen op elkaar aan.",
  },
  nodeVisitors: { en: "Visitors", nl: "Bezoekers" },
  nodeVisitorsSub: { en: "every request", nl: "elk verzoek" },
  nodeRoutingLayer: { en: "The platform's routing layer", nl: "De routeringslaag" },
  nodeRoutingLayerSub: { en: "one rule per address", nl: "een regel per adres" },
  nodeOldSystem: { en: "Old system", nl: "Oud systeem" },
  nodeOldSystemSub: { en: "serves everyone not moved", nl: "bedient wie nog niet over is" },
  nodeNewPages: { en: "New pages", nl: "Nieuwe pagina's" },
  nodeNewPagesSub: { en: "serves the share that moved", nl: "bedient het deel dat over is" },
  nodeRuleBack: { en: "The rule set back", nl: "De regel teruggezet" },
  nodeRuleBackSub: { en: "the old system serves again", nl: "het oude systeem bedient weer" },
  edgeRest: { en: "the rest", nl: "de rest" },
  edgeGrowingShare: { en: "a growing share", nl: "een groeiend deel" },
  edgeAnyStep: { en: "any step", nl: "elke stap" },
  nodeFirstVisit: { en: "First visit", nl: "Eerste bezoek" },
  nodeLaterVisit: { en: "A visit next week", nl: "Bezoek volgende week" },
  nodeAnyVisit: { en: "Every visit after", nl: "Elk bezoek daarna" },
  nodeSameIdentifier: { en: "the same identifier", nl: "dezelfde identifier" },
  nodeHashed: { en: "The identifier hashed", nl: "De identifier gehasht" },
  nodeHashedSub: { en: "the same number every time", nl: "elke keer hetzelfde getal" },
  nodeGroup: { en: "One group, kept", nl: "Een groep, vastgehouden" },
  nodeGroupSub: { en: "the new page every time", nl: "elke keer de nieuwe pagina" },
  edgeSameBucket: { en: "the same bucket", nl: "dezelfde bucket" },
} as const;
