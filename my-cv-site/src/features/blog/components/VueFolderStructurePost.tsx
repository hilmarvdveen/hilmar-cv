import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, LI, A, InlineCode } from "./prose";
import { CodeBlock } from "./CodeBlock";
import { FileTree, type FileNode } from "./FileTree";
import { DependencyFigure } from "./vueFolderGuide/DependencyFigure";

export const meta: BlogPostMeta = {
  slug: "vue-folder-structure-dotnet-backend",
  category: "architecture",
  publishedDate: "2026-11-27",
  readingTimeMin: 8,
  title: {
    en: "A Vue folder structure with a .NET backend",
    nl: "Een Vue-mappenstructuur met een .NET-backend",
  },
  description: {
    en: "How I lay out Vue frontends next to an ASP.NET Core backend, folder by folder: a design system, one package per feature, a gateway, services and contracts.",
    nl: "Hoe ik Vue-frontends naast een ASP.NET Core-backend indeel, map voor map: een design system, een package per feature, een gateway, services en contracten.",
  },
  excerpt: {
    en: "The Vue and .NET companion to the React folder post: two Vue tools as custom elements, a design system they share, a gateway and two services, with the reason for every boundary.",
    nl: "De Vue- en .NET-tegenhanger van het artikel over React-mappen: twee Vue-tools als custom elements, een gedeeld design system, een gateway en twee services, met de reden voor elke grens.",
  },
  keywords: [
    "vue folder structure",
    "vue 3 project structure",
    "pinia setup store per feature",
    "vue custom elements",
    "asp.net core gateway yarp",
    "openapi-typescript",
    "design system folder structure",
  ],
};

const MAIN_CODE = `import { primeVueOptions } from "@lab/design-system";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import { defineCustomElement } from "vue";
import RateTable from "./components/RateTable/RateTable.vue";

export const elementName = "rates-rate-table";

export const RateTableElement = defineCustomElement(RateTable, {
  shadowRoot: false,
  configureApp: (application) => {
    application.config.idPrefix = elementName;
    application.use(PrimeVue, primeVueOptions);
    application.use(createPinia());
  },
});

if (!customElements.get(elementName)) {
  customElements.define(elementName, RateTableElement);
}`;

const STORE_CODE = `export const useRatesStore = defineStore("rates", () => {
  const selectedProduct = ref("");
  const selectedDate = ref(todayAsIsoDate());
  const rates = ref<Rate[]>([]);
  const status = ref<RatesStatus>("loadingProducts");

  let latestRequest = 0;

  const loadRates = async () => {
    const request = ++latestRequest;
    status.value = "loadingRates";
    try {
      const loaded = await fetchRates(selectedProduct.value, selectedDate.value);
      if (request === latestRequest) {
        rates.value = loaded;
        status.value = "ready";
      }
    } catch {
      if (request === latestRequest) {
        status.value = "failed";
      }
    }
  };

  watch([selectedProduct, selectedDate], loadRates);
  return { selectedProduct, selectedDate, rates, status };
});`;

const GATEWAY_CODE = `"ReverseProxy": {
  "Routes": {
    "rates": {
      "ClusterId": "rates",
      "Match": { "Path": "/services/rates/{**rest}" },
      "Transforms": [ { "PathRemovePrefix": "/services/rates" } ]
    }
  },
  "Clusters": {
    "rates": {
      "Destinations": { "rateService": { "Address": "http://localhost:8096/" } }
    }
  }
}`;

const GENERATE_CODE = `"scripts": {
  "generate-types": "openapi-typescript ../../contracts/rate-service.json -o src/api/generated/rate-service.d.ts"
}`;

const directory = (name: string, children: FileNode[], comment?: string): FileNode => ({ name, type: "dir", children, comment });

const file = (name: string, comment?: string): FileNode => ({ name, type: "file", comment });

const componentFolder = (name: string, comment?: string): FileNode =>
  directory(name, [file(`${name}.vue`), file(`${name}.scss`), file(`${name}.test.ts`)], comment);

function buildRepositoryTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    directory("frontends", [
      directory("design-system", [], copy.treeDesignSystem[locale]),
      directory("rate-table", [], copy.treeRateTable[locale]),
      directory("payment-calculator", [], copy.treePaymentCalculator[locale]),
      directory("host", [], copy.treeHost[locale]),
      directory("living-docs", [], copy.treeLivingDocs[locale]),
    ]),
    directory("contracts", [file("rate-service.json"), file("calculation-service.json")], copy.treeContracts[locale]),
    directory("src", [
      directory("Gateway", [], copy.treeGateway[locale]),
      directory("RateService", [], copy.treeRateService[locale]),
      directory("CalculationService", [], copy.treeCalculationService[locale]),
      directory("Contracts", [], copy.treeSharedContracts[locale]),
      directory("Messaging", [], copy.treeMessaging[locale]),
    ]),
    directory("tests", [], copy.treeTests[locale]),
    directory("end-to-end", [], copy.treeEndToEnd[locale]),
  ];
}

function buildDesignSystemTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    directory("frontends/design-system/src", [
      directory("elements", [componentFolder("TextField")], copy.dsElements[locale]),
      directory("patterns", [componentFolder("ErrorSummary")], copy.dsPatterns[locale]),
      directory("templates", [directory("RatesAndPayment", [])], copy.dsTemplates[locale]),
      directory("tokens", [], copy.dsTokens[locale]),
      directory("styles", [], copy.dsStyles[locale]),
      directory("theme", [], copy.dsTheme[locale]),
      directory("composables", [file("useDelayedFlag.ts")], copy.dsComposables[locale]),
      directory("accessibility", [], copy.dsAccessibility[locale]),
      directory("types", [], copy.dsTypes[locale]),
      directory("testing", [file("axe.ts"), file("stylesheetRules.ts")], copy.dsTesting[locale]),
    ]),
  ];
}

function buildFeatureTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    directory("frontends/rate-table/src", [
      directory(
        "components",
        [componentFolder("RateTable", copy.featureContainer[locale]), componentFolder("RateFilter", copy.featureFilter[locale]), componentFolder("RateResults", copy.featureResults[locale])],
      ),
      directory("stores", [file("ratesStore.ts", copy.featureStore[locale]), file("ratesStore.test.ts")]),
      directory("api", [file("rateApi.ts", copy.featureApi[locale]), directory("generated", [file("rate-service.d.ts")], copy.featureGenerated[locale])]),
      directory("formatting", [file("rateFormatting.ts")]),
      directory("directives", [file("tableCaption.ts")]),
      file("main.ts", copy.featureMain[locale]),
    ]),
  ];
}

function buildBackendTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    directory("src", [
      directory("Gateway", [file("Program.cs"), file("FrontendFiles.cs"), file("appsettings.json")], copy.backendGateway[locale]),
      directory("RateService", [
        directory("Api", [file("RateEndpoints.cs")]),
        directory("Application", [file("RateCatalogue.cs")]),
        directory("Domain", [file("Rate.cs"), file("RateSheet.cs")]),
        directory("Persistence", [file("RateDatabase.cs")], copy.backendPersistence[locale]),
      ]),
      directory("CalculationService", [
        directory("Api", [file("PaymentEndpoints.cs")]),
        directory("Application", [file("RateCache.cs")]),
        directory("Domain", [file("MonthlyPayment.cs")]),
        directory("Messaging", [file("RateChangedConsumer.cs")], copy.backendMessaging[locale]),
      ]),
      directory("Contracts", [file("RateChanged.cs")], copy.backendContracts[locale]),
      directory("Messaging", [file("TransportMigration.cs")], copy.backendTransport[locale]),
    ]),
  ];
}

function buildTestTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    directory("tests", [
      directory("RateService.Tests", [], copy.testsRate[locale]),
      directory("CalculationService.Tests", [directory("Features", [], copy.testsFeatures[locale])]),
      directory("Gateway.Tests", [], copy.testsGateway[locale]),
    ]),
    directory("end-to-end/tests", [file("keyboard.spec.ts"), file("accessibility.spec.ts"), file("responsive.spec.ts"), file("resilience.spec.ts")], copy.testsEndToEnd[locale]),
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>
        {copy.intro1Before[locale]}
        <A href={`/${locale}/blog/react-folder-structure`}>{copy.reactPostLink[locale]}</A>
        {copy.intro1After[locale]}
      </P>
      <P>{copy.intro2[locale]}</P>

      <H2>{copy.wholeTitle[locale]}</H2>
      <P>{copy.whole1[locale]}</P>
      <FileTree tree={buildRepositoryTree(locale)} caption={copy.wholeCaption[locale]} />
      <P>{copy.whole2[locale]}</P>

      <H2>{copy.designSystemTitle[locale]}</H2>
      <P>{copy.designSystem1[locale]}</P>
      <DependencyFigure locale={locale} />
      <P>{copy.designSystem2[locale]}</P>
      <FileTree tree={buildDesignSystemTree(locale)} caption={copy.designSystemCaption[locale]} />
      <P>{copy.designSystem3[locale]}</P>

      <H2>{copy.featureTitle[locale]}</H2>
      <P>{copy.feature1[locale]}</P>
      <FileTree tree={buildFeatureTree(locale)} caption={copy.featureCaption[locale]} />
      <P>{copy.feature2[locale]}</P>
      <P>{copy.feature3[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/rate-table/src/main.ts" code={MAIN_CODE} />
      <P>{copy.feature4[locale]}</P>
      <CodeBlock lang="ts" filename="frontends/rate-table/src/stores/ratesStore.ts" code={STORE_CODE} />
      <P>
        {copy.feature5Before[locale]}
        <A href={`/${locale}/blog/state-without-a-store-react-router-angular-graphql`}>{copy.storePostLink[locale]}</A>
        {copy.feature5After[locale]}
      </P>

      <H2>{copy.moveTitle[locale]}</H2>
      <P>{copy.move1[locale]}</P>
      <UL>
        <LI>{copy.moveComposable[locale]}</LI>
        <LI>{copy.moveTesting[locale]}</LI>
        <LI>{copy.moveStays[locale]}</LI>
      </UL>

      <H2>{copy.backendTitle[locale]}</H2>
      <P>{copy.backend1[locale]}</P>
      <CodeBlock lang="json" filename="src/Gateway/appsettings.json" code={GATEWAY_CODE} />
      <P>{copy.backend2[locale]}</P>
      <FileTree tree={buildBackendTree(locale)} caption={copy.backendCaption[locale]} />
      <P>
        {copy.backend3Before[locale]}
        <A href={`/${locale}/blog/hexagonal-architecture-csharp-dotnet`}>{copy.hexagonalPostLink[locale]}</A>
        {copy.backend3After[locale]}
      </P>
      <P>{copy.backend4[locale]}</P>

      <H2>{copy.contractsTitle[locale]}</H2>
      <P>{copy.contracts1[locale]}</P>
      <CodeBlock lang="json" filename="frontends/rate-table/package.json" code={GENERATE_CODE} />
      <P>{copy.contracts2[locale]}</P>

      <H2>{copy.testsTitle[locale]}</H2>
      <P>{copy.tests1[locale]}</P>
      <FileTree tree={buildTestTree(locale)} caption={copy.testsCaption[locale]} />
      <P>{copy.tests2[locale]}</P>

      <H2>{copy.checklistTitle[locale]}</H2>
      <UL>
        <LI>{copy.check1[locale]}</LI>
        <LI>{copy.check2[locale]}</LI>
        <LI>{copy.check3[locale]}</LI>
        <LI>{copy.check4[locale]}</LI>
        <LI>{copy.check5[locale]}</LI>
        <LI>{copy.check6[locale]}</LI>
      </UL>
      <P>
        {copy.closingBefore[locale]}
        <InlineCode>main.ts</InlineCode>
        {copy.closingAfter[locale]}
      </P>
    </>
  );
}

const COPY = {
  lead: {
    en: "Where a file lives decides how fast someone finds it, changes it and deletes it. This is how I lay out Vue frontends next to an ASP.NET Core backend, folder by folder, with the reason for every boundary.",
    nl: "Waar een bestand staat, bepaalt hoe snel iemand het vindt, wijzigt en verwijdert. Zo deel ik Vue-frontends naast een ASP.NET Core-backend in, map voor map, met de reden voor elke grens.",
  },
  intro1Before: {
    en: "It is the Vue and .NET companion to ",
    nl: "Het is de Vue- en .NET-tegenhanger van ",
  },
  reactPostLink: {
    en: "the React folder structure post",
    nl: "het artikel over React-mappenstructuur",
  },
  intro1After: {
    en: ". That one explains the general idea of feature-first folders. This one shows it with Vue 3, Pinia and two .NET services. I worked with Vue before as a migration specialist, keeping an application in service while I took its frontend to VueJS step by step, and the layout below is what I would set up from day one.",
    nl: ". Dat artikel legt het algemene idee van feature-first mappen uit. Dit artikel laat het zien met Vue 3, Pinia en twee .NET-services. Ik werkte eerder met Vue als migratiespecialist, waar ik een applicatie in beheer hield terwijl ik de frontend stap voor stap naar VueJS bracht, en de indeling hieronder zet ik vanaf dag een op.",
  },
  intro2: {
    en: "The example is a practice project with rates and a payment calculator: two Vue tools as custom elements, a design system they share, a gateway and two services. The names in the trees are shortened from the practice project. Every other path is as it is in the repository.",
    nl: "Het voorbeeld is een oefenproject met tarieven en een betalingscalculator: twee Vue-tools als custom elements, een gedeeld design system, een gateway en twee services. De namen in de bomen zijn ingekort ten opzichte van het oefenproject. Elk ander pad staat zo in de repository.",
  },
  wholeTitle: {
    en: "The whole tree on one screen",
    nl: "De hele boom op een scherm",
  },
  whole1: {
    en: "The frontends sit next to the backend, and the contracts sit between them. A reader who opens the repository sees the shape of the system before reading any code.",
    nl: "De frontends staan naast de backend, en de contracten staan ertussen. Wie de repository opent, ziet de vorm van het systeem al voor de eerste regel code.",
  },
  wholeCaption: {
    en: "The repository at the top level: frontends, contracts, services and tests.",
    nl: "De repository op het hoogste niveau: frontends, contracten, services en tests.",
  },
  treeDesignSystem: { en: "look and accessible behaviour", nl: "uiterlijk en toegankelijk gedrag" },
  treeRateTable: { en: "feature: the rate table", nl: "feature: de tarieventabel" },
  treePaymentCalculator: { en: "feature: the payment calculator", nl: "feature: de betalingscalculator" },
  treeHost: { en: "a plain HTML page that hosts both tools", nl: "een gewone HTML-pagina die beide tools host" },
  treeLivingDocs: { en: "living documentation of the design system", nl: "levende documentatie van het design system" },
  treeContracts: { en: "OpenAPI documents written by dotnet build", nl: "OpenAPI-documenten geschreven door dotnet build" },
  treeGateway: { en: "the one origin the browser talks to", nl: "de ene origin waar de browser mee praat" },
  treeRateService: { en: "owns the rates, the only writer", nl: "bezit de tarieven, de enige schrijver" },
  treeCalculationService: { en: "owns the arithmetic", nl: "bezit de berekening" },
  treeSharedContracts: { en: "the event both services reference", nl: "het event waar beide services naar verwijzen" },
  treeMessaging: { en: "the transport setup both services share", nl: "de transportinrichting die beide services delen" },
  treeTests: { en: "a test project per service", nl: "een testproject per service" },
  treeEndToEnd: { en: "Playwright through the gateway", nl: "Playwright via de gateway" },
  whole2: {
    en: "Two frontends instead of one has a reason. A custom element is the contract between a content page and a tool: one tag, one script and one stylesheet. A tool can release a new bundle without a release of the page, and a page can show one tool, both or none. On a site that is one application owned by one team, one Vue app with a router would be the simpler choice.",
    nl: "Twee frontends in plaats van een heeft een reden. Een custom element is het contract tussen een contentpagina en een tool: een tag, een script en een stylesheet. Een tool kan een nieuwe bundle uitbrengen zonder release van de pagina, en een pagina kan een tool tonen, beide of geen. Op een site die een applicatie van een team is, zou een Vue-app met een router de eenvoudigere keuze zijn.",
  },
  designSystemTitle: {
    en: "The design system holds look and behaviour only",
    nl: "Het design system bevat alleen uiterlijk en gedrag",
  },
  designSystem1: {
    en: "The design system gives one look and one accessible behaviour: tokens, styles, the theme, elements, generic patterns and page templates. It never fetches data, never knows a service and holds no domain logic. Features depend on it, never the other way round.",
    nl: "Het design system geeft een uiterlijk en een toegankelijk gedrag: tokens, styles, het thema, elementen, generieke patronen en paginatemplates. Het haalt nooit data op, kent nooit een service en bevat geen domeinlogica. Features hangen ervan af, nooit andersom.",
  },
  designSystem2: {
    en: "Inside it every component gets its own folder named after it, holding the .vue file, its .scss and its test. The same rule holds in the features, so a developer never guesses where the styles or the test of a component are.",
    nl: "Daarin krijgt elk component een eigen map met zijn naam, met het .vue-bestand, de .scss en de test. Dezelfde regel geldt in de features, dus een ontwikkelaar hoeft nooit te raden waar de styles of de test van een component staan.",
  },
  designSystemCaption: {
    en: "The design system: elements, patterns and templates, plus what makes them consistent.",
    nl: "Het design system: elementen, patronen en templates, plus wat ze consistent maakt.",
  },
  dsElements: { en: "one folder per element", nl: "een map per element" },
  dsPatterns: { en: "generic patterns", nl: "generieke patronen" },
  dsTemplates: { en: "page layouts with slots, never a feature import", nl: "paginalayouts met slots, nooit een feature-import" },
  dsTokens: { en: "the token source and its generated outputs", nl: "de tokenbron en de gegenereerde uitvoer" },
  dsStyles: { en: "spacing mixins and shared style functions", nl: "spacing-mixins en gedeelde stijlfuncties" },
  dsTheme: { en: "maps PrimeVue onto the tokens", nl: "legt PrimeVue op de tokens" },
  dsComposables: { en: "UI behaviour more than one feature uses", nl: "UI-gedrag dat meer dan een feature gebruikt" },
  dsAccessibility: { en: "helpers for ids and aria-describedby", nl: "helpers voor ids en aria-describedby" },
  dsTypes: { en: "types shared by several components", nl: "types die meerdere componenten delen" },
  dsTesting: { en: "the axe check and the stylesheet rules", nl: "de axe-check en de stylesheetregels" },
  designSystem3: {
    en: "The theme folder is where PrimeVue meets the tokens. The features use PrimeVue components, such as the DataTable in the rate table, but they get their colours and spacing from the design system, so a token change reaches every tool in one build.",
    nl: "De map theme is waar PrimeVue de tokens raakt. De features gebruiken PrimeVue-componenten, zoals de DataTable in de tarieventabel, maar halen hun kleuren en spacing uit het design system, dus een tokenwijziging bereikt elke tool in een build.",
  },
  featureTitle: {
    en: "One package per feature, sorted by kind",
    nl: "Een package per feature, gesorteerd op soort",
  },
  feature1: {
    en: "Each feature is its own package with the common layout of a Vue app: components, stores, api, formatting, validation, types and directives. main.ts stays at the root of src. A folder exists only when it has files: the rate table has directives and no validation, the payment calculator has validation and types and no directives.",
    nl: "Elke feature is een eigen package met de gebruikelijke indeling van een Vue-app: components, stores, api, formatting, validation, types en directives. main.ts blijft in de root van src. Een map bestaat alleen als er bestanden in staan: de tarieventabel heeft directives en geen validation, de betalingscalculator heeft validation en types en geen directives.",
  },
  featureCaption: {
    en: "One feature package, the rate table. The payment calculator has the same shape.",
    nl: "Een featurepackage, de tarieventabel. De betalingscalculator heeft dezelfde vorm.",
  },
  featureContainer: { en: "the container, starts the first load", nl: "de container, start het eerste laden" },
  featureFilter: { en: "reads and writes the store", nl: "leest en schrijft de store" },
  featureResults: { en: "props only, reusable", nl: "alleen props, herbruikbaar" },
  featureStore: { en: "one Pinia setup store", nl: "een Pinia setup store" },
  featureApi: { en: "the only place that calls the service", nl: "de enige plek die de service aanroept" },
  featureGenerated: { en: "types generated from OpenAPI", nl: "types gegenereerd uit OpenAPI" },
  featureMain: { en: "defines the custom element", nl: "definieert het custom element" },
  feature2: {
    en: "The three components show three roles. RateTable is the container: it starts the first load and passes plain data down. RateFilter reads and writes the store directly, which removed most props and v-models. RateResults keeps its props because it only shows data, so it stays reusable and trivial to test.",
    nl: "De drie componenten laten drie rollen zien. RateTable is de container: die start het eerste laden en geeft gewone data door. RateFilter leest en schrijft de store direct, wat de meeste props en v-models weghaalde. RateResults houdt zijn props omdat hij alleen data toont, dus hij blijft herbruikbaar en eenvoudig te testen.",
  },
  feature3: {
    en: "main.ts is the entry of the library build, the same role it has in any Vue app. It defines the custom element in the light DOM, sets an id prefix so two tools on one page never clash on ids, and installs a fresh Pinia. Every element gets its own store, so the two tools never share state.",
    nl: "main.ts is de entry van de library-build, dezelfde rol die het in elke Vue-app heeft. Het definieert het custom element in de light DOM, zet een id-prefix zodat twee tools op een pagina nooit botsen op ids, en installeert een nieuwe Pinia. Elk element krijgt een eigen store, dus de twee tools delen nooit state.",
  },
  feature4: {
    en: "Each feature has one small setup store. It is the only place that calls the api client, and it lets the latest request win, so a slow answer for an old filter never overwrites the answer for the new one.",
    nl: "Elke feature heeft een kleine setup store. Die is de enige plek die de api-client aanroept, en laat het laatste verzoek winnen, zodat een traag antwoord voor een oud filter nooit het antwoord voor het nieuwe overschrijft.",
  },
  feature5Before: {
    en: "One store per feature is enough because the state is small and local to the tool. When a store earns its place at all is the subject of ",
    nl: "Een store per feature is genoeg omdat de state klein is en bij de tool hoort. Wanneer een store zijn plek verdient, staat in ",
  },
  storePostLink: {
    en: "the post on state without a store",
    nl: "het artikel over state zonder store",
  },
  feature5After: {
    en: ". Component tests use createTestingPinia from @pinia/testing with an initial state, so a component test never needs the network.",
    nl: ". Componenttests gebruiken createTestingPinia uit @pinia/testing met een begintoestand, dus een componenttest heeft nooit het netwerk nodig.",
  },
  moveTitle: {
    en: "When code moves into the design system",
    nl: "Wanneer code naar het design system verhuist",
  },
  move1: {
    en: "Code moves into the design system only when it is about look or accessible behaviour and a second feature needs it. One feature using something is not enough. Two examples moved, and one kind of code never does.",
    nl: "Code verhuist alleen naar het design system als het over uiterlijk of toegankelijk gedrag gaat en een tweede feature het nodig heeft. Een feature die iets gebruikt, is niet genoeg. Twee voorbeelden verhuisden, en een soort code verhuist nooit.",
  },
  moveComposable: {
    en: "useDelayedFlag turns a loading flag into a notice that only appears after a short delay, so a fast answer never makes the screen flicker. Both tools needed it, so it lives in composables.",
    nl: "useDelayedFlag maakt van een laadvlag een melding die pas na een korte vertraging verschijnt, zodat een snel antwoord het scherm nooit laat knipperen. Beide tools hadden het nodig, dus het staat in composables.",
  },
  moveTesting: {
    en: "The axe check and the stylesheet rules are exported as a testing entry of the design system, so every feature tests its styles the same way with one import in its componentStylesheets test.",
    nl: "De axe-check en de stylesheetregels worden geëxporteerd als een testing-entry van het design system, zodat elke feature zijn styles op dezelfde manier test met een import in zijn componentStylesheets-test.",
  },
  moveStays: {
    en: "Formatting a rate, validating a form field or calling a service stays in the feature, even when it looks generic. It belongs to what the tool means, not to how it looks.",
    nl: "Een tarief opmaken, een formulierveld valideren of een service aanroepen blijft in de feature, ook als het generiek lijkt. Het hoort bij wat de tool betekent, niet bij hoe hij eruitziet.",
  },
  backendTitle: {
    en: "The .NET side: a gateway and two services",
    nl: "De .NET-kant: een gateway en twee services",
  },
  backend1: {
    en: "The browser only talks to the gateway, an ASP.NET Core app with YARP. It serves the host page, the two bundles and their CSS files, and passes every call under /services/ to the right service with that prefix removed. That gives one origin, so there is no CORS, no service address inside a bundle and one place for security headers.",
    nl: "De browser praat alleen met de gateway, een ASP.NET Core-app met YARP. Die levert de hostpagina, de twee bundles en hun CSS-bestanden, en geeft elke aanroep onder /services/ door aan de juiste service met dat voorvoegsel eraf. Dat geeft een origin, dus geen CORS, geen serviceadres in een bundle en een plek voor security headers.",
  },
  backend2: {
    en: "The frontends call relative paths such as /services/rates/rates. Moving a service means changing one destination in the gateway configuration, not rebuilding a bundle. Each service is then split into the same layers.",
    nl: "De frontends roepen relatieve paden aan zoals /services/rates/rates. Een service verplaatsen betekent een bestemming in de gatewayconfiguratie wijzigen, geen bundle opnieuw bouwen. Elke service is daarna in dezelfde lagen verdeeld.",
  },
  backendCaption: {
    en: "The backend: the gateway, two services with their layers, and what they share.",
    nl: "De backend: de gateway, twee services met hun lagen, en wat ze delen.",
  },
  backendGateway: { en: "static files and the reverse proxy", nl: "statische bestanden en de reverse proxy" },
  backendPersistence: { en: "the database and the outbox", nl: "de database en de outbox" },
  backendMessaging: { en: "empties the cache on RateChanged", nl: "leegt de cache bij RateChanged" },
  backendContracts: { en: "the event both services reference", nl: "het event waar beide services naar verwijzen" },
  backendTransport: { en: "the transport both services share", nl: "het transport dat beide services delen" },
  backend3Before: {
    en: "Api holds the minimal API endpoints, Application the use cases, Domain the rules and values. The rate service adds Persistence for its database, the calculation service adds Messaging for the event it consumes. It is the same split as in ",
    nl: "Api bevat de minimal API-endpoints, Application de use cases, Domain de regels en waarden. De tarievenservice voegt Persistence toe voor zijn database, de calculatieservice voegt Messaging toe voor het event dat hij ontvangt. Het is dezelfde verdeling als in ",
  },
  hexagonalPostLink: {
    en: "the post on hexagonal architecture in C#",
    nl: "het artikel over hexagonale architectuur in C#",
  },
  backend3After: {
    en: ", kept small because each service is small.",
    nl: ", klein gehouden omdat elke service klein is.",
  },
  backend4: {
    en: "Two services show the two ways services talk. The rate service owns the rates and is the only one that writes them. A new rate is a new row from a date, never an update, so a past calculation can always be explained, and it writes the RateChanged message in the same transaction through an outbox. The calculation service asks for rates over HTTP when it needs an answer now, keeps them in a cache, and empties the cache for a product as soon as RateChanged arrives.",
    nl: "Twee services laten de twee manieren zien waarop services praten. De tarievenservice bezit de tarieven en is de enige die ze schrijft. Een nieuw tarief is een nieuwe rij vanaf een datum, nooit een update, dus een eerdere berekening is altijd uit te leggen, en hij schrijft het RateChanged-bericht in dezelfde transactie via een outbox. De calculatieservice vraagt tarieven op via HTTP als hij nu een antwoord nodig heeft, houdt ze in een cache, en leegt de cache voor een product zodra RateChanged binnenkomt.",
  },
  contractsTitle: {
    en: "Where the contracts come from",
    nl: "Waar de contracten vandaan komen",
  },
  contracts1: {
    en: "Each service writes its OpenAPI document to contracts/ when dotnet build runs. The feature that calls the service turns that document into TypeScript types with openapi-typescript, into its own api/generated folder.",
    nl: "Elke service schrijft zijn OpenAPI-document naar contracts/ als dotnet build draait. De feature die de service aanroept, maakt van dat document TypeScript-types met openapi-typescript, in zijn eigen map api/generated.",
  },
  contracts2: {
    en: "So a changed response shape in .NET breaks the typecheck of the frontend that uses it, before anything ships. Money crosses every contract as cents or as a decimal string, never as a float, so the browser never does binding arithmetic with a floating point number.",
    nl: "Zo breekt een gewijzigde responsevorm in .NET de typecheck van de frontend die hem gebruikt, voordat er iets live gaat. Geld gaat over elk contract als centen of als decimale string, nooit als float, dus de browser rekent nooit bindend met een floating point-getal.",
  },
  testsTitle: {
    en: "Tests sit next to what they test",
    nl: "Tests staan naast wat ze testen",
  },
  tests1: {
    en: "In the frontends the test sits in the component folder: Vitest with Testing Library, queried by role and accessible name, with axe on every state. In the backend each service has its own test project, and the calculation service has a feature file in Dutch for the payment table.",
    nl: "In de frontends staat de test in de map van het component: Vitest met Testing Library, gezocht op rol en toegankelijke naam, met axe op elke toestand. In de backend heeft elke service een eigen testproject, en de calculatieservice heeft een featurebestand in het Nederlands voor de betalingstabel.",
  },
  testsCaption: {
    en: "The .NET test projects and the end to end tests.",
    nl: "De .NET-testprojecten en de end-to-end-tests.",
  },
  testsRate: { en: "API tests against a database per test class", nl: "API-tests tegen een database per testklasse" },
  testsFeatures: { en: "a Reqnroll feature in Dutch", nl: "een Reqnroll-feature in het Nederlands" },
  testsGateway: { en: "forwarding against a real destination", nl: "doorsturen naar een echte bestemming" },
  testsEndToEnd: { en: "keyboard only, 320 pixels wide, axe scans", nl: "alleen toetsenbord, 320 pixels breed, axe-scans" },
  tests2: {
    en: "End to end, Playwright runs through the gateway against the real services, on keyboard only paths and at 320 pixels wide, with both tools on one page. That last part proves the tools really do not share state.",
    nl: "End-to-end draait Playwright via de gateway tegen de echte services, op paden met alleen het toetsenbord en op 320 pixels breed, met beide tools op een pagina. Dat laatste bewijst dat de tools echt geen state delen.",
  },
  checklistTitle: {
    en: "A checklist to take away",
    nl: "Een checklist om mee te nemen",
  },
  check1: {
    en: "Frontends, contracts and services side by side at the top level.",
    nl: "Frontends, contracten en services naast elkaar op het hoogste niveau.",
  },
  check2: {
    en: "A design system for look and accessible behaviour only, never data.",
    nl: "Een design system voor alleen uiterlijk en toegankelijk gedrag, nooit data.",
  },
  check3: {
    en: "One package per feature, sorted by kind, with a folder only when it has files.",
    nl: "Een package per feature, gesorteerd op soort, met een map alleen als er bestanden in staan.",
  },
  check4: {
    en: "One folder per component with its .vue, .scss and test.",
    nl: "Een map per component met zijn .vue, .scss en test.",
  },
  check5: {
    en: "One origin through a gateway, and services split into the same layers.",
    nl: "Een origin via een gateway, en services verdeeld in dezelfde lagen.",
  },
  check6: {
    en: "Frontend types generated from the backend contracts, so a change breaks the build.",
    nl: "Frontendtypes gegenereerd uit de backendcontracten, zodat een wijziging de build breekt.",
  },
  closingBefore: {
    en: "Start a new feature by copying the shape, not the code: a package, a ",
    nl: "Begin een nieuwe feature door de vorm te kopiëren, niet de code: een package, een ",
  },
  closingAfter: {
    en: " that defines the element, one store and a components folder. Add the other folders when the first file needs them.",
    nl: " die het element definieert, een store en een map components. Voeg de andere mappen toe als het eerste bestand ze nodig heeft.",
  },
} as const;
