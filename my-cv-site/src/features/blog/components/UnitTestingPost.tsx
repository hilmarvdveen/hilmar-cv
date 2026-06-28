import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "unit-testing-react-the-right-way",
  category: "testing",
  publishedDate: "2026-06-20",
  updatedDate: "2026-06-28",
  readingTimeMin: 16,
  title: {
    en: "Testing React the Right Way: behaviour, components and testable design",
    nl: "React testen op de juiste manier: gedrag, componenten en testbaar ontwerp",
  },
  description: {
    en: "What's worth testing in a React app, what to mock, and how to design components so they stay testable — with a real Vitest, Testing Library and MSW setup.",
    nl: "Wat de moeite waard is om te testen in een React-app, wat je mockt, en hoe je componenten ontwerpt zodat ze testbaar blijven — met een echte Vitest-, Testing Library- en MSW-setup.",
  },
  excerpt: {
    en: "Tests exist to let you change code safely, not to chase a coverage number. Test behaviour, mock only real boundaries, and design components to be testable.",
    nl: "Tests bestaan om code veilig te kunnen wijzigen, niet om een coverage-getal te halen. Test gedrag, mock alleen echte grenzen en ontwerp componenten om testbaar te zijn.",
  },
  keywords: [
    "react testing library",
    "vitest setup jsdom",
    "test behaviour not implementation",
    "testable components",
    "msw setupserver",
    "react component testing",
  ],
};

const trophyNodes = [
  flowNode("e2e", "End-to-end", { x: 0, y: 0 }, { tone: "rose", sub: "few · slow · high confidence", dir: "TB", width: 240 }),
  flowNode("int", "Integration", { x: 0, y: 100 }, { tone: "emerald", sub: "most of your value", dir: "TB", width: 300 }),
  flowNode("unit", "Unit", { x: 0, y: 200 }, { tone: "blue", sub: "pure logic · many · fast", dir: "TB", width: 240 }),
  flowNode("static", "Static (types + lint)", { x: 0, y: 300 }, { tone: "slate", sub: "free, always-on", dir: "TB", width: 280 }),
];
const trophyEdges = [
  flowEdge("e2e", "int", { dashed: true }),
  flowEdge("int", "unit", { dashed: true }),
  flowEdge("unit", "static", { dashed: true }),
];

// Stacked downward: Test → Component, then Component fans out to its real
// children and the mocked network boundary.
const mockNodes = [
  flowNode("test", "Test", { x: 210, y: 0 }, { tone: "violet", sub: "renders + asserts", dir: "TB", width: 180 }),
  flowNode("comp", "Component", { x: 210, y: 140 }, { tone: "blue", sub: "REAL", dir: "TB", width: 180 }),
  flowNode("child", "Child components", { x: 0, y: 300 }, { tone: "emerald", sub: "REAL — do not mock", dir: "TB", width: 200 }),
  flowNode("net", "Network / API", { x: 430, y: 300 }, { tone: "amber", sub: "MOCK here (MSW)", dir: "TB", width: 190 }),
];
const mockEdges = [
  flowEdge("test", "comp", { label: "renders" }),
  flowEdge("comp", "child", { label: "composes" }),
  flowEdge("comp", "net", { label: "fetches", dashed: true }),
];

export function Body({ locale }: { locale: Locale }) {
  const c = COPY;
  return (
    <>
      <Lead>{c.lead[locale]}</Lead>
      <P>{c.intro1[locale]}</P>
      <P>{c.intro2[locale]}</P>
      <Quote>{c.quote[locale]}</Quote>

      <H2>{c.trophyTitle[locale]}</H2>
      <P>{c.trophy1[locale]}</P>
      <FlowDiagram
        nodes={trophyNodes}
        edges={trophyEdges}
        height={420}
        ariaLabel={c.trophyAria[locale]}
        caption={c.trophyCaption[locale]}
      />
      <P>{c.trophy2[locale]}</P>

      <H2>{c.queryTitle[locale]}</H2>
      <P>{c.query1[locale]}</P>
      <Callout variant="warning" title={c.queryWarnTitle[locale]}>
        {c.queryWarnBody[locale]}
      </Callout>
      <P>{c.query2[locale]}</P>
      <CodeBlock lang="tsx" filename="Counter.test.tsx" code={c.counterCode[locale]} />
      <P>{c.query3[locale]}</P>

      <H2>{c.setupTitle[locale]}</H2>
      <P>{c.setup1[locale]}</P>
      <CodeBlock lang="ts" filename="vitest.config.ts" code={VITEST_CONFIG} />
      <CodeBlock lang="ts" filename="vitest.setup.ts" code={VITEST_SETUP} />

      <H2>{c.pureTitle[locale]}</H2>
      <P>{c.pure1[locale]}</P>
      <CodeBlock lang="ts" filename="money.ts" code={MONEY_CODE} />
      <CodeBlock lang="ts" filename="money.test.ts" code={MONEY_TEST} />
      <P>{c.pure2[locale]}</P>

      <Divider />

      <H2>{c.mockTitle[locale]}</H2>
      <P>{c.mock1[locale]}</P>
      <FlowDiagram
        nodes={mockNodes}
        edges={mockEdges}
        height={420}
        ariaLabel={c.mockAria[locale]}
        caption={c.mockCaption[locale]}
      />
      <P>{c.mock2[locale]}</P>
      <CodeBlock lang="ts" filename="test/handlers.ts" code={c.handlersCode[locale]} />
      <P>{c.mock3[locale]}</P>
      <CodeBlock lang="ts" filename="test/server.ts" code={c.serverCode[locale]} />
      <CodeBlock lang="ts" filename="vitest.setup.ts" code={c.mswSetupCode[locale]} />
      <P>{c.mockNote[locale]}</P>
      <Callout variant="tip" title={c.mockTipTitle[locale]}>
        {c.mockTipBody[locale]}
      </Callout>

      <H2>{c.testableTitle[locale]}</H2>
      <P>{c.testable1[locale]}</P>
      <UL>
        <LI><Strong>{c.r1S[locale]}</Strong> {c.r1[locale]}</LI>
        <LI><Strong>{c.r2S[locale]}</Strong> {c.r2[locale]}</LI>
        <LI><Strong>{c.r3S[locale]}</Strong> {c.r3[locale]}</LI>
        <LI><Strong>{c.r4S[locale]}</Strong> {c.r4[locale]}</LI>
      </UL>
      <CodeBlock lang="tsx" filename="UserGreeting.tsx" code={c.greetingCode[locale]} />

      <H2>{c.asyncTitle[locale]}</H2>
      <P>{c.async1[locale]}</P>
      <CodeBlock lang="tsx" filename="ProductList.test.tsx" code={c.productListCode[locale]} />

      <H2>{c.coverageTitle[locale]}</H2>
      <P>{c.coverage1[locale]}</P>
      <Callout variant="info" title={c.coverageInfoTitle[locale]}>
        {c.coverageInfoBody[locale]}
      </Callout>

      <H2>{c.checklistTitle[locale]}</H2>
      <OL>
        <LI>{c.ck1[locale]}</LI>
        <LI>{c.ck2[locale]}</LI>
        <LI>{c.ck3[locale]}</LI>
        <LI>{c.ck4[locale]}</LI>
        <LI>{c.ck5[locale]}</LI>
      </OL>
      <P>{c.outro1[locale]}</P>
      <P>{c.outro2[locale]}</P>
    </>
  );
}

// ── Comment-free code (shared across locales) ────────────────────────────────
const VITEST_CONFIG = `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});`;

const VITEST_SETUP = `import "@testing-library/jest-dom/vitest";`;

const MONEY_CODE = `export function formatPrice(cents: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}`;

const MONEY_TEST = `import { it, expect } from "vitest";
import { formatPrice } from "./money";

it.each([
  { cents: 1299, locale: "en-US", expected: "€12.99" },
  { cents: 0, locale: "en-US", expected: "€0.00" },
])("formats $cents cents for $locale as $expected", ({ cents, locale, expected }) => {
  expect(formatPrice(cents, locale)).toBe(expected);
});`;

// ── Code with teaching comments (translated per locale) ──────────────────────
const COUNTER_CODE_EN = `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Counter } from "./Counter";

it("increments when the button is clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  // Find the element the way a user (or screen reader) would: by role + name.
  await user.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});`;

const COUNTER_CODE_NL = `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Counter } from "./Counter";

it("increments when the button is clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  // Zoek het element zoals een gebruiker (of screenreader): op rol + naam.
  await user.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});`;

const HANDLERS_CODE_EN = `import { http, HttpResponse } from "msw";

// Mock the network boundary, not your own modules (MSW v2 API).
export const handlers = [
  http.get("https://api.example.com/products", () =>
    HttpResponse.json([{ id: "p1", name: "Keyboard", price: 129 }])
  ),
];`;

const HANDLERS_CODE_NL = `import { http, HttpResponse } from "msw";

// Mock de netwerkgrens, niet je eigen modules (MSW v2 API).
export const handlers = [
  http.get("https://api.example.com/products", () =>
    HttpResponse.json([{ id: "p1", name: "Keyboard", price: 129 }])
  ),
];`;

const SERVER_CODE_EN = `import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// One server for all tests, built from your request handlers.
export const server = setupServer(...handlers);`;

const SERVER_CODE_NL = `import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Eén server voor alle tests, opgebouwd uit je request handlers.
export const server = setupServer(...handlers);`;

const MSW_SETUP_CODE_EN = `// vitest.setup.ts — extend the existing setup
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./test/server";

// Start the network mock once, reset handlers between tests, close at the end.
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`;

const MSW_SETUP_CODE_NL = `// vitest.setup.ts — breid de bestaande setup uit
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./test/server";

// Start de netwerk-mock één keer, reset handlers tussen tests, sluit aan het eind.
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`;

const GREETING_CODE_EN = `// Hard to test: it reads a global and the clock during render.
function Bad() {
  const user = window.currentUser; // hidden global dependency
  const hour = new Date().getHours(); // non-deterministic
  return <p>{hour < 12 ? "Morning" : "Hello"}, {user.name}</p>;
}

// Easy to test: everything it needs arrives as props.
export function UserGreeting({ name, hour }: { name: string; hour: number }) {
  return <p>{hour < 12 ? "Morning" : "Hello"}, {name}</p>;
}`;

const GREETING_CODE_NL = `// Moeilijk te testen: leest een global en de klok tijdens render.
function Bad() {
  const user = window.currentUser; // verborgen globale afhankelijkheid
  const hour = new Date().getHours(); // niet-deterministisch
  return <p>{hour < 12 ? "Morning" : "Hello"}, {user.name}</p>;
}

// Makkelijk te testen: alles wat het nodig heeft komt binnen als props.
export function UserGreeting({ name, hour }: { name: string; hour: number }) {
  return <p>{hour < 12 ? "Morning" : "Hello"}, {name}</p>;
}`;

const PRODUCTLIST_CODE_EN = `import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { ProductList } from "./ProductList";

it("shows products once they load", async () => {
  render(<ProductList />);
  // findBy* retries until the element appears (or times out).
  expect(await screen.findByText("Keyboard")).toBeInTheDocument();
});`;

const PRODUCTLIST_CODE_NL = `import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { ProductList } from "./ProductList";

it("shows products once they load", async () => {
  render(<ProductList />);
  // findBy* probeert opnieuw tot het element verschijnt (of de tijd om is).
  expect(await screen.findByText("Keyboard")).toBeInTheDocument();
});`;

// ── Bilingual copy ────────────────────────────────────────────────────────────
const COPY = {
  lead: {
    en: "Tests don't exist to chase a high coverage number. They help you change code safely later, without breaking existing behaviour.",
    nl: "Tests zijn er niet om alleen een hoog coverage-percentage te halen. Ze helpen je om code later veilig te wijzigen, zonder bestaand gedrag kapot te maken.",
  },
  intro1: {
    en: "A good test looks at behaviour. What does the user see? What happens after a click? Which error appears on invalid input? A bad test focuses on internal details — state, hooks, exact render counts — and breaks on a normal refactor, even when the app still works exactly the same.",
    nl: "Een goede test kijkt naar gedrag. Wat ziet de gebruiker? Wat gebeurt er na een klik? Welke foutmelding verschijnt bij ongeldige input? Een slechte test kijkt vooral naar interne details — state, hooks, exacte render-aantallen — en breekt bij een normale refactor, ook als de applicatie nog precies hetzelfde werkt.",
  },
  intro2: {
    en: "This article looks at three questions: what is worth testing, what should you mock, and how do you design React components so they stay testable?",
    nl: "In dit artikel kijken we naar drie vragen: wat is de moeite waard om te testen, wat moet je mocken, en hoe ontwerp je React-componenten zodat ze goed testbaar blijven?",
  },
  quote: {
    en: "If a refactor keeps behaviour the same but breaks your test, you're probably testing too many implementation details.",
    nl: "Als een refactor het gedrag niet verandert maar wel je test breekt, test je waarschijnlijk te veel implementatiedetails.",
  },
  trophyTitle: { en: "Use the testing trophy as a guideline", nl: "Gebruik de testing trophy als richtlijn" },
  trophy1: {
    en: "The test pyramid often emphasizes many small tests. The testing trophy — a well-known heuristic, not an official React standard — shifts the focus to confidence: write enough unit tests for pure logic, but test UI behaviour mostly at the component or integration level.",
    nl: "De testpiramide legt vaak de nadruk op veel kleine tests. De testing trophy — een bekende heuristiek, geen officiële React-standaard — verschuift de aandacht naar vertrouwen: schrijf genoeg unit-tests voor pure logica, maar test UI-gedrag vooral op component- of integratieniveau.",
  },
  trophyAria: {
    en: "Testing trophy from bottom to top: static checks, unit, integration (largest), end-to-end",
    nl: "Testing-trophy van onder naar boven: statische checks, unit, integratie (grootst), end-to-end",
  },
  trophyCaption: {
    en: "The integration layer tends to give the most confidence per test. Spend your effort there.",
    nl: "De integratielaag geeft meestal het meeste vertrouwen per test. Steek je inspanning daarin.",
  },
  trophy2: {
    en: "In practice, most React tests render a component with Testing Library, interact with it, and assert on what the user sees — not on internal state or function calls. Many are really component or integration tests, even if we loosely call them 'unit tests'.",
    nl: "In de praktijk renderen de meeste React-tests een component met Testing Library, interacteren ermee en asserten op wat de gebruiker ziet — niet op interne state of functieaanroepen. Veel ervan zijn eigenlijk component- of integratietests, ook al noemen we ze losjes 'unit-tests'.",
  },
  queryTitle: { en: "Find elements the way users do", nl: "Zoek elementen zoals gebruikers ze vinden" },
  query1: {
    en: "React Testing Library deliberately makes it hard to test internal details. You find elements by their role and accessible name. That is similar to how screen readers and other assistive tech understand the page. So good tests also push you toward better markup.",
    nl: "React Testing Library maakt het bewust lastig om interne details te testen. Je zoekt elementen meestal op rol en toegankelijke naam. Dat lijkt op hoe screenreaders en andere hulptechnologie de pagina begrijpen. Daardoor dwingen goede tests je ook richting betere markup.",
  },
  queryWarnTitle: { en: "Use data-testid only as a fallback", nl: "Gebruik data-testid alleen als fallback" },
  queryWarnBody: {
    en: "data-testid is a fallback, not a default. Reaching for it usually means the element has no accessible name — fix the markup (a label, a heading, button text) and query by role instead. Your users benefit too.",
    nl: "data-testid is een fallback, geen standaard. Ernaar grijpen betekent meestal dat het element geen toegankelijke naam heeft — repareer de markup (een label, een kop, knoptekst) en zoek op rol. Je gebruikers profiteren ook.",
  },
  query2: {
    en: "A behaviour test reads like a user story: render, act, assert on the visible result. Create one user per test with userEvent.setup().",
    nl: "Een gedragstest leest als een user story: render, handel, assert op het zichtbare resultaat. Maak per test één user met userEvent.setup().",
  },
  query3: {
    en: "Notice what this test does not do: it never inspects state, never checks that a specific hook ran, never counts renders. Rewrite Counter with useReducer instead of useState and the test still passes — the behaviour did not change.",
    nl: "Let op wat deze test níét doet: hij inspecteert nooit state, controleert nooit of een specifieke hook draaide, telt nooit renders. Herschrijf Counter met useReducer in plaats van useState en de test slaagt nog steeds — het gedrag veranderde niet.",
  },
  setupTitle: { en: "Set up Vitest and Testing Library", nl: "Stel Vitest en Testing Library in" },
  setup1: {
    en: "Two things make the examples above run. First, toBeInTheDocument comes from @testing-library/jest-dom, not Vitest itself, so you import its matchers in a setup file. Second, React Testing Library needs a DOM: Vitest defaults to node, so pick jsdom (or happy-dom). Set globals: true if you don't want to import it, expect and vi in every test.",
    nl: "Twee dingen laten de voorbeelden hierboven draaien. Ten eerste komt toBeInTheDocument uit @testing-library/jest-dom, niet uit Vitest zelf, dus importeer je de matchers in een setup-bestand. Ten tweede heeft React Testing Library een DOM nodig: Vitest gebruikt standaard node, dus kies jsdom (of happy-dom). Zet globals: true als je it, expect en vi niet in elke test wilt importeren.",
  },
  pureTitle: { en: "Test pure logic separately from React", nl: "Test pure logica los van React" },
  pure1: {
    en: "Not everything belongs in a component. Pull formatting, calculations, parsing and validation into plain functions with no React, no DOM, no I/O. These are the cheapest, fastest and most valuable tests you will write — and they are easy, because the function is pure: same input, same output.",
    nl: "Niet alles hoort in een component. Trek formatteren, berekeningen, parsen en validatie in gewone functies zonder React, zonder DOM, zonder I/O. Dit zijn de goedkoopste, snelste en waardevolste tests die je schrijft — en ze zijn eenvoudig, want de functie is puur: zelfde input, zelfde output.",
  },
  pure2: {
    en: "A few table-driven cases pin down the behaviour. When a currency bug shows up in production, you reproduce it as one more row here, not by clicking through the UI.",
    nl: "Een paar tabelgedreven cases leggen het gedrag vast. Verschijnt er een valutabug in productie, dan reproduceer je die als nog een rij hier, niet door door de UI te klikken.",
  },
  mockTitle: { en: "Mock only real system boundaries", nl: "Mock alleen echte systeemgrenzen" },
  mock1: {
    en: "The most common testing mistake is mocking too much. If you mock a component's own child or an internal module, you no longer test the real interaction between your code — you mostly test whether your mock behaves as you expect. Mock only the true boundaries of your system: the network, time, and randomness.",
    nl: "De meest voorkomende testfout is te veel mocken. Als je een eigen child component of interne module mockt, test je niet meer de echte samenwerking tussen je code — je test vooral of je mock zich gedraagt zoals je verwacht. Mock alleen de echte grenzen van je systeem: het netwerk, tijd en willekeur.",
  },
  mockAria: {
    en: "Diagram: the test renders the real component with real children; only the network boundary is mocked",
    nl: "Diagram: de test rendert de echte component met echte kinderen; alleen de netwerkgrens wordt gemockt",
  },
  mockCaption: {
    en: "Keep the component and its children real. Replace only the network — ideally with MSW.",
    nl: "Houd de component en haar kinderen echt. Vervang alleen het netwerk — bij voorkeur met MSW.",
  },
  mock2: {
    en: "Mock Service Worker (MSW) intercepts real fetch calls at the network layer. Your component runs its normal data code but gets controlled test responses back. No fetch stubbing, no patched modules — the code under test is the code that ships.",
    nl: "Mock Service Worker (MSW) onderschept echte fetch-aanroepen op de netwerklaag. Daardoor draait je component de normale datacode, maar krijgt hij gecontroleerde testresponses terug. Geen fetch-stubbing, geen gepatchte modules — de geteste code is de code die live gaat.",
  },
  mock3: {
    en: "Handlers alone aren't enough. In Vitest (Node) you build a server from the handlers, then start it, reset handlers between tests, and close it afterwards.",
    nl: "Handlers alleen zijn niet genoeg. In Vitest (Node) bouw je een server uit de handlers, en daarna start je hem, reset je de handlers tussen tests en sluit je hem af.",
  },
  mockNote: {
    en: "One gotcha: in Node tests there is no location.href to resolve relative URLs against, so give MSW absolute URLs (as above) or configure a base URL.",
    nl: "Eén valkuil: in Node-tests is er geen location.href om relatieve URL’s tegen op te lossen, dus geef MSW absolute URL’s (zoals hierboven) of stel een base URL in.",
  },
  mockTipTitle: { en: "Time and randomness are boundaries too", nl: "Tijd en willekeur zijn ook grenzen" },
  mockTipBody: {
    en: "Use fake timers mainly for code that really depends on setTimeout, setInterval or the clock. For DOM updates and async loading, prefer findBy*/waitFor. When you combine userEvent with fake timers, set advanceTimers in userEvent.setup().",
    nl: "Gebruik fake timers vooral voor code die echt afhankelijk is van setTimeout, setInterval of de klok. Gebruik voor DOM-updates en async laden liever findBy*/waitFor. Combineer je userEvent met fake timers, stel dan advanceTimers in bij userEvent.setup().",
  },
  testableTitle: { en: "Make components testable by design", nl: "Maak componenten testbaar door ontwerp" },
  testable1: {
    en: "A component that is hard to test is usually hard to reuse and reason about too. Four habits make components much easier to test:",
    nl: "Een component die moeilijk te testen is, is meestal ook moeilijk te hergebruiken en te doorgronden. Vier gewoonten maken componenten veel makkelijker te testen:",
  },
  r1S: { en: "Data in via props.", nl: "Data erin via props." },
  r1: {
    en: "Prefer explicit props over reading globals or context deep inside; then every state is reachable from a test.",
    nl: "Verkies expliciete props boven het diep van binnen lezen van globals of context; dan is elke state bereikbaar vanuit een test.",
  },
  r2S: { en: "Keep render pure.", nl: "Houd render puur." },
  r2: {
    en: "No Date.now(), Math.random() or direct network calls in the render path. Fetch data through your framework, a router loader or a data library, and use an Effect only when you genuinely need to sync with an external system.",
    nl: "Geen Date.now(), Math.random() of directe netwerkcalls in het renderpad. Haal data op via je framework, een router-loader of een data-library, en gebruik een Effect alleen als je echt met een extern systeem moet synchroniseren.",
  },
  r3S: { en: "One job per component.", nl: "Eén taak per component." },
  r3: {
    en: "A component that fetches, transforms and renders is three tests tangled into one. Split it.",
    nl: "Een component die fetcht, transformeert én rendert zijn drie tests verstrikt in één. Splits het.",
  },
  r4S: { en: "Accessible markup.", nl: "Toegankelijke markup." },
  r4: {
    en: "Real labels, headings and button text give you stable query targets and better UX at once.",
    nl: "Echte labels, koppen en knopteksten geven je stabiele zoekdoelen én betere UX tegelijk.",
  },
  asyncTitle: { en: "Wait for async without fixed timeouts", nl: "Wacht op async gedrag zonder vaste timeouts" },
  async1: {
    en: "Don't use fixed timeouts to wait for async behaviour. Testing Library's findBy* queries and waitFor retry until the DOM settles, so tests stay fast on a quick machine and reliable on a slow CI runner.",
    nl: "Gebruik geen vaste timeouts om async gedrag af te wachten. De findBy*-queries en waitFor van Testing Library proberen opnieuw tot de DOM tot rust komt, zodat tests snel blijven op een snelle machine en betrouwbaar op een trage CI-runner.",
  },
  coverageTitle: { en: "Use coverage gates with judgment", nl: "Gebruik coverage-gates met beleid" },
  coverage1: {
    en: "A coverage gate stops untested code from slipping in. But 100% as a blunt rule pushes people to write meaningless tests for trivial code. 100% is a team choice, not a universal best practice. A healthy version is a high bar plus a short, documented exclusion list for genuinely browser-only or end-to-end-appropriate files.",
    nl: "Een coverage-gate houdt ongeteste code buiten. Maar 100% als botte regel duwt mensen tot betekenisloze tests voor triviale code. 100% is een teamkeuze, geen algemene best practice. De gezonde variant is een hoge lat plus een korte, gedocumenteerde uitsluitingslijst voor echt browser-only of end-to-end-geschikte bestanden.",
  },
  coverageInfoTitle: { en: "An example from a real codebase", nl: "Een voorbeeld uit een echte codebase" },
  coverageInfoBody: {
    en: "This site enforces 100% lines/functions/statements (and 90% branches) over lib, hooks and every component, with a handful of explicitly excluded browser-only files (a d3 canvas, a multi-step wizard) covered by other means. A high bar with honest, written exceptions.",
    nl: "Deze site dwingt 100% regels/functies/statements (en 90% branches) af over lib, hooks en elke component, met een handvol expliciet uitgesloten browser-only bestanden (een d3-canvas, een wizard met meerdere stappen) die op andere wijze gedekt zijn. Een hoge lat met eerlijke, opgeschreven uitzonderingen.",
  },
  checklistTitle: { en: "Checklist for good React tests", nl: "Checklist voor goede React-tests" },
  ck1: {
    en: "Does the test survive a behaviour-preserving refactor (e.g. useState → useReducer)?",
    nl: "Overleeft de test een gedrag-behoudende refactor (bijv. useState → useReducer)?",
  },
  ck2: {
    en: "Are you querying by role/label rather than test ids or class names?",
    nl: "Zoek je op rol/label in plaats van test-ids of classnamen?",
  },
  ck3: {
    en: "Is the only mock at a true boundary (network, time, randomness)?",
    nl: "Zit de enige mock op een echte grens (netwerk, tijd, willekeur)?",
  },
  ck4: {
    en: "Is pure logic extracted and tested directly, away from the DOM?",
    nl: "Is pure logica geëxtraheerd en direct getest, los van de DOM?",
  },
  ck5: {
    en: "Does async use findBy*/waitFor instead of fixed timeouts?",
    nl: "Gebruikt async findBy*/waitFor in plaats van vaste timeouts?",
  },
  outro1: {
    en: "Good React tests give you confidence without making refactors harder than they should be. Test visible behaviour, not the internal structure of your component. Put pure logic in separate functions and test it directly. Render components with their real children, and mock only real boundaries like network, time and randomness.",
    nl: "Goede React-tests geven vertrouwen zonder je refactors onnodig moeilijk te maken. Test vooral zichtbaar gedrag, niet de interne opbouw van je component. Zet pure logica in losse functies en test die direct. Render componenten met hun echte children, en mock alleen echte grenzen zoals netwerk, tijd en willekeur.",
  },
  outro2: {
    en: "Coverage helps you find gaps, but it is not a goal in itself. A strong suite combines clear behaviour tests, small unit tests for pure logic, a few critical end-to-end tests, and deliberate exceptions where another test layer fits better.",
    nl: "Coverage helpt om gaten te vinden, maar het is geen doel op zichzelf. Een sterke suite combineert duidelijke gedragstests, kleine unit-tests voor pure logica, een paar kritieke end-to-end-tests en bewuste uitzonderingen waar een andere testlaag beter past.",
  },
  // Code samples keyed by locale
  counterCode: { en: COUNTER_CODE_EN, nl: COUNTER_CODE_NL },
  handlersCode: { en: HANDLERS_CODE_EN, nl: HANDLERS_CODE_NL },
  serverCode: { en: SERVER_CODE_EN, nl: SERVER_CODE_NL },
  mswSetupCode: { en: MSW_SETUP_CODE_EN, nl: MSW_SETUP_CODE_NL },
  greetingCode: { en: GREETING_CODE_EN, nl: GREETING_CODE_NL },
  productListCode: { en: PRODUCTLIST_CODE_EN, nl: PRODUCTLIST_CODE_NL },
} as const;
