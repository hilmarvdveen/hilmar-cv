import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, H3, P, Lead, UL, OL, LI, Strong, InlineCode, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FileTree, type FileNode } from "./FileTree";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "modern-react-architecture-vite-router-vitest-storybook",
  category: "architecture",
  publishedDate: "2026-06-16",
  updatedDate: "2026-06-28",
  readingTimeMin: 10,
  title: {
    en: "A Modern React Architecture: Vite, Router, Vitest, Storybook",
    nl: "Moderne React-architectuur: Vite, Router, Vitest, Storybook",
  },
  description: {
    en: "A 2026 baseline for React apps: build with Vite, load data with React Router, test with Vitest and build components in Storybook, wired as one whole.",
    nl: "Een 2026-basis voor React-apps: bouwen met Vite, data laden via React Router, testen met Vitest en componenten bouwen in Storybook, als één geheel.",
  },
  excerpt: {
    en: "Vite, React Router, Vitest and Storybook each own one concern and hand off to the next. Here is how they fit into one architecture, with config, routes, a loader and a story.",
    nl: "Vite, React Router, Vitest en Storybook hebben elk één taak en sluiten op elkaar aan. Zo passen ze in één architectuur, met config, routes, een loader en een story.",
  },
  keywords: [
    "modern react architecture 2026",
    "vite 8 rolldown oxc",
    "react router v8 data mode",
    "vitest",
    "storybook react-vite csf3",
    "react project setup",
  ],
};

const stackNodes = [
  flowNode("vite", "Vite", { x: 0, y: 0 }, { tone: "violet", subtitle: "dev server + build", direction: "TB", width: 180 }),
  flowNode("react", "React 19", { x: 0, y: 110 }, { tone: "blue", subtitle: "UI runtime", direction: "TB", width: 180 }),
  flowNode("router", "React Router", { x: 0, y: 220 }, { tone: "emerald", subtitle: "routes · loaders · actions", direction: "TB", width: 220 }),
  flowNode("vitest", "Vitest", { x: -170, y: 330 }, { tone: "amber", subtitle: "unit + component", direction: "TB", width: 170 }),
  flowNode("sb", "Storybook", { x: 180, y: 330 }, { tone: "rose", subtitle: "isolated components", direction: "TB", width: 170 }),
];
const stackEdges = [
  flowEdge("vite", "react", { label: "bundles" }),
  flowEdge("react", "router"),
  flowEdge("router", "vitest", { dashed: true, label: "verified by" }),
  flowEdge("router", "sb", { dashed: true, label: "documented by" }),
];

const dataNodes = [
  flowNode("url", "URL change", { x: 0, y: 0 }, { tone: "slate", direction: "TB", width: 180 }),
  flowNode("loader", "loader()", { x: 0, y: 140 }, { tone: "emerald", subtitle: "reads data", direction: "TB", width: 180 }),
  flowNode("comp", "ProductList", { x: 0, y: 280 }, { tone: "blue", subtitle: "useLoaderData()", direction: "TB", width: 180 }),
  flowNode("submit", "<Form> submit", { x: 340, y: 0 }, { tone: "slate", direction: "TB", width: 180 }),
  flowNode("action", "action()", { x: 340, y: 140 }, { tone: "amber", subtitle: "writes data", direction: "TB", width: 180 }),
  flowNode("revalidate", "revalidate", { x: 340, y: 280 }, { tone: "violet", subtitle: "loaders re-run", direction: "TB", width: 180 }),
];
const dataEdges = [
  flowEdge("url", "loader", { label: "navigation" }),
  flowEdge("loader", "comp", { label: "data" }),
  flowEdge("submit", "action", { label: "form submit" }),
  flowEdge("action", "revalidate", { label: "after mutation" }),
];

function buildTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    {
      name: "src",
      children: [
        { name: "main.tsx", comment: copy.treeMain[locale] },
        { name: "router.tsx", comment: copy.treeRouter[locale] },
        {
          name: "features",
          children: [
            {
              name: "products",
              children: [
                { name: "ProductList.tsx" },
                { name: "ProductList.stories.tsx", comment: copy.treeStories[locale] },
                { name: "ProductList.test.tsx", comment: copy.treeTest[locale] },
                { name: "products.loader.ts", comment: copy.treeLoader[locale] },
                { name: "api.ts" },
              ],
            },
          ],
        },
        { name: "components", comment: copy.treeComponents[locale] },
        { name: "test", comment: copy.treeTestDir[locale] },
      ],
    },
    { name: "vite.config.ts" },
    {
      name: ".storybook",
      comment: copy.treeStorybook[locale],
      children: [{ name: "main.ts" }, { name: "preview.ts" }],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versionNote[locale]}</P>

      <FlowDiagram
        nodes={stackNodes}
        edges={stackEdges}
        height={460}
        ariaLabel={copy.stackAria[locale]}
        caption={copy.stackCaption[locale]}
      />
      <Quote>{copy.quote[locale]}</Quote>

      <H2>{copy.viteTitle[locale]}</H2>
      <P>{copy.vite1[locale]}</P>
      <UL>
        <LI><Strong>{copy.viteB1S[locale]}</Strong> {copy.viteB1[locale]}</LI>
        <LI><Strong>{copy.viteB2S[locale]}</Strong> {copy.viteB2[locale]}</LI>
        <LI><Strong>{copy.viteB3S[locale]}</Strong> {copy.viteB3[locale]}</LI>
      </UL>
      <CodeBlock lang="ts" filename="vite.config.ts" code={VITE_CONFIG} />

      <H2>{copy.routerTitle[locale]}</H2>
      <P>{copy.router1[locale]}</P>
      <P>{copy.router2[locale]}</P>
      <P>{copy.router3[locale]}</P>
      <CodeBlock lang="tsx" filename="src/router.tsx" code={copy.routerCode[locale]} />
      <CodeBlock lang="tsx" filename="src/main.tsx" code={MAIN_CODE} />
      <P>{copy.router4[locale]}</P>
      <CodeBlock lang="ts" filename="src/features/products/products.loader.ts" code={copy.loaderCode[locale]} />
      <CodeBlock lang="ts" filename="src/features/products/api.ts" code={copy.apiCode[locale]} />
      <CodeBlock lang="tsx" filename="src/features/products/ProductList.tsx" code={copy.productListCode[locale]} />

      <H3>{copy.dataTitle[locale]}</H3>
      <P>{copy.data1[locale]}</P>
      <FlowDiagram
        nodes={dataNodes}
        edges={dataEdges}
        height={420}
        ariaLabel={copy.dataAria[locale]}
        caption={copy.dataCaption[locale]}
      />
      <Callout variant="tip" title={copy.queryTitle[locale]}>
        {copy.queryBody[locale]}
      </Callout>

      <Divider />

      <H2>{copy.sbTitle[locale]}</H2>
      <P>{copy.sb1[locale]}</P>
      <P>{copy.sb2[locale]}</P>
      <CodeBlock lang="tsx" filename="src/components/Button.stories.tsx" code={copy.storiesCode[locale]} />
      <Callout variant="info" title={copy.sbTestTitle[locale]}>
        {copy.sbTestBody[locale]}
      </Callout>

      <H2>{copy.testTitle[locale]}</H2>
      <P>{copy.test1[locale]}</P>
      <CodeBlock lang="tsx" filename="src/components/Button.test.tsx" code={copy.testCode[locale]} />
      <P>{copy.test2[locale]}</P>

      <H2>{copy.togetherTitle[locale]}</H2>
      <P>{copy.together1[locale]}</P>
      <FileTree tree={buildTree(locale)} caption={copy.treeCaption[locale]} />

      <H2>{copy.takeawayTitle[locale]}</H2>
      <OL>
        <LI><Strong>{copy.t1S[locale]}</Strong> {copy.t1[locale]}</LI>
        <LI><Strong>{copy.t2S[locale]}</Strong> {copy.t2[locale]}</LI>
        <LI><Strong>{copy.t3S[locale]}</Strong> {copy.t3[locale]}</LI>
        <LI><Strong>{copy.t4S[locale]}</Strong> {copy.t4[locale]}</LI>
      </OL>
      <P>{copy.outro1[locale]}</P>
      <P>
        {copy.outro2[locale]} <InlineCode>npm create vite@latest</InlineCode>.
      </P>
    </>
  );
}

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});`;

const MAIN_CODE = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);`;

const ROUTER_CODE_EN = `import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { ProductList } from "./features/products/ProductList";
import { productsLoader } from "./features/products/products.loader";

// Data Mode: the route config lives outside the render tree.
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout, // renders an <Outlet/> for its children
    children: [
      {
        index: true,
        Component: ProductList,
        loader: productsLoader, // runs before ProductList renders
      },
    ],
  },
]);`;

const ROUTER_CODE_NL = `import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { ProductList } from "./features/products/ProductList";
import { productsLoader } from "./features/products/products.loader";

// Data Mode: de route-config staat buiten de renderboom.
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout, // rendert een <Outlet/> voor zijn kinderen
    children: [
      {
        index: true,
        Component: ProductList,
        loader: productsLoader, // draait vóór ProductList rendert
      },
    ],
  },
]);`;

const LOADER_CODE_EN = `import { fetchProducts } from "./api";

// A loader returns plain data; the route renders once it resolves.
export async function productsLoader() {
  const products = await fetchProducts();
  return { products };
}`;

const LOADER_CODE_NL = `import { fetchProducts } from "./api";

// Een loader geeft gewone data terug; de route rendert zodra die klaar is.
export async function productsLoader() {
  const products = await fetchProducts();
  return { products };
}`;

const API_CODE_EN = `export type Product = { id: string; name: string; price: number };

const DUMMY: Product[] = [
  { id: "p1", name: "Mechanical Keyboard", price: 129 },
  { id: "p2", name: "4K Monitor", price: 379 },
  { id: "p3", name: "Standing Desk", price: 549 },
];

// Dummy data for now. Replace with fetch('/api/products') later.
export async function fetchProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 150));
  return DUMMY;
}`;

const API_CODE_NL = `export type Product = { id: string; name: string; price: number };

const DUMMY: Product[] = [
  { id: "p1", name: "Mechanical Keyboard", price: 129 },
  { id: "p2", name: "4K Monitor", price: 379 },
  { id: "p3", name: "Standing Desk", price: 549 },
];

// Voorlopig dummydata. Vervang later door fetch('/api/products').
export async function fetchProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 150));
  return DUMMY;
}`;

const PRODUCTLIST_CODE_EN = `import { useLoaderData } from "react-router";
import type { Product } from "./api";

// useLoaderData reads the data the loader returned for this route.
export function ProductList() {
  const { products } = useLoaderData() as { products: Product[] };

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name}: €{product.price}
        </li>
      ))}
    </ul>
  );
}`;

const PRODUCTLIST_CODE_NL = `import { useLoaderData } from "react-router";
import type { Product } from "./api";

// useLoaderData leest de data die de loader voor deze route teruggaf.
export function ProductList() {
  const { products } = useLoaderData() as { products: Product[] };

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name}: €{product.price}
        </li>
      ))}
    </ul>
  );
}`;

const STORIES_CODE_EN = `import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

// CSF3 with \`satisfies\` for better type inference.
const meta = {
  component: Button,
  args: { children: "Click me" },
  tags: ["autodocs"], // generates a docs page automatically
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Disabled: Story = { args: { disabled: true } };`;

const STORIES_CODE_NL = `import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

// CSF3 met \`satisfies\` voor betere type-inferentie.
const meta = {
  component: Button,
  args: { children: "Click me" },
  tags: ["autodocs"], // genereert automatisch een docs-pagina
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Disabled: Story = { args: { disabled: true } };`;

const TEST_CODE_EN = `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    // Query by role + name, like a user would.
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});`;

const TEST_CODE_NL = `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    // Zoek op rol + naam, zoals een gebruiker zou doen.
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});`;

const COPY = {
  lead: {
    en: "The quality of a React app depends on more than React itself. The tools around it matter just as much: the build tool, the router, the test environment, and where you develop components in isolation.",
    nl: "De kwaliteit van een React-app hangt niet alleen af van React zelf. Minstens zo belangrijk zijn de tools eromheen: de buildtool, de router, de testomgeving en de plek waar je componenten apart ontwikkelt.",
  },
  intro1: {
    en: "For many modern React apps, Vite, React Router, Vitest and Storybook form a strong baseline together. Vite gives fast development and builds. React Router connects routes to data. Vitest lets you test inside the same toolchain. Storybook makes components visible and testable outside the full app.",
    nl: "Voor veel moderne React-apps vormen Vite, React Router, Vitest en Storybook samen een sterke basis. Vite zorgt voor snelle development en builds. React Router koppelt routes aan data. Vitest laat je testen binnen dezelfde toolchain. Storybook maakt componenten zichtbaar en testbaar buiten de volledige app.",
  },
  intro2: {
    en: "This article shows how these tools fit together, not as separate choices but as one architecture for a React app that is still pleasant to work on after year two.",
    nl: "In dit artikel laat ik zien hoe deze tools op elkaar aansluiten. Niet als losse keuzes, maar als één architectuur voor een React-app die ook na jaar twee nog prettig blijft om aan te werken.",
  },
  versionNote: {
    en: "The versions in this article, Vite 8 and React Router 8, were checked on 7 September 2026.",
    nl: "De versies in dit artikel, Vite 8 en React Router 8, zijn gecontroleerd op 7 september 2026.",
  },
  stackAria: {
    en: "Diagram of the stack: Vite bundles React, which runs React Router, verified by Vitest and documented by Storybook",
    nl: "Diagram van de stack: Vite bundelt React, dat React Router draait, geverifieerd door Vitest en gedocumenteerd door Storybook",
  },
  stackCaption: {
    en: "Four layers, one direction of responsibility: build → run → route → verify/document.",
    nl: "Vier lagen, één richting van verantwoordelijkheid: bouwen → draaien → routeren → verifiëren/documenteren.",
  },
  quote: {
    en: "Tooling is part of your architecture. The defaults you accept on day one become the constraints you live with for years.",
    nl: "Tooling is onderdeel van je architectuur. De defaults die je op dag één accepteert, worden de beperkingen waarmee je jaren leeft.",
  },
  viteTitle: { en: "Vite: build and develop", nl: "Vite: bouwen en ontwikkelen" },
  vite1: {
    en: "In many modern React projects, Vite has become the default choice, mainly for its fast developer experience. In development it serves your source on demand over native ES modules, so the dev server starts quickly and hot-module replacement stays fast, even when the app grows. In Vite 8 the toolchain uses Rolldown and Oxc to bring development and production closer together.",
    nl: "In veel moderne React-projecten is Vite de standaardkeuze geworden, vooral door de snelle developer experience. In development serveert Vite je broncode on demand via native ES modules, zodat de dev-server snel start en hot-module-replacement snel blijft, ook wanneer de app groeit. In Vite 8 gebruikt de toolchain Rolldown en Oxc om development en productie dichter bij elkaar te brengen.",
  },
  viteB1S: { en: "Instant startup.", nl: "Directe start." },
  viteB1: {
    en: "No bundling on boot, so the dev server is ready in milliseconds.",
    nl: "Geen bundeling bij het opstarten, dus de dev-server is in milliseconden klaar.",
  },
  viteB2S: { en: "TypeScript & JSX, transpile-only.", nl: "TypeScript & JSX, alleen transpiling." },
  viteB2: {
    en: "Vite transpiles TypeScript (with Oxc) but does not type-check. Run tsc --noEmit separately, or use a checker plugin.",
    nl: "Vite transpileert TypeScript (met Oxc), maar doet geen typechecking. Draai tsc --noEmit apart, of gebruik een checker-plugin.",
  },
  viteB3S: { en: "Shared config.", nl: "Gedeelde config." },
  viteB3: {
    en: "the same vite.config.ts powers the dev server, the build, and Vitest.",
    nl: "dezelfde vite.config.ts voedt de dev-server, de build én Vitest.",
  },
  routerTitle: { en: "React Router: routes and data", nl: "React Router: routes en data" },
  router1: {
    en: "Modern React Router became a framework layer in v7 through the merge with Remix. React Router 8 is the current major, a non-breaking upgrade with higher baselines: Node 22+, React 19+ and ESM-only. The data APIs from v7 are the foundation: loaders, actions, route objects and automatic revalidation.",
    nl: "Moderne React Router werd in v7 ook een frameworklaag, door de samenvoeging met Remix. React Router 8 is de actuele major, een non-breaking upgrade met hogere baselines: Node 22+, React 19+ en ESM-only. De data-API’s uit v7 blijven de basis: loaders, actions, route objects en automatische revalidatie.",
  },
  router2: {
    en: "React Router has three modes: Declarative, Data and Framework. This article uses Data Mode with createBrowserRouter: loaders, actions and pending states without the full build integration. The same concepts exist in Framework Mode, which adds the Vite plugin, route types and code splitting.",
    nl: "React Router kent drie modes: Declarative, Data en Framework. Dit artikel gebruikt Data Mode met createBrowserRouter: loaders, actions en pending states zonder de volledige build-integratie. Dezelfde concepten bestaan in Framework Mode, die daar de Vite-plugin, route-types en code splitting aan toevoegt.",
  },
  router3: {
    en: "Define the route tree once. The Component + loader pairing means the data is ready before the component renders. RootLayout is a parent route, so it must render an <Outlet /> where the matched child appears.",
    nl: "Definieer de routeboom één keer. De Component + loader-koppeling betekent dat de data klaar is vóór de component rendert. RootLayout is een parent route, dus die moet een <Outlet /> renderen waar het gematchte kind verschijnt.",
  },
  router4: {
    en: "The loader is plain async code. Here it returns dummy data. Later you can replace it with a real endpoint without changing how the component uses it. The component reads the result with useLoaderData.",
    nl: "De loader is gewone async-code. Hier geeft hij dummydata terug. Later kun je die vervangen door een echt endpoint, zonder de component anders te laten werken. De component leest het resultaat met useLoaderData.",
  },
  dataTitle: { en: "Loaders, actions and revalidation", nl: "Loaders, actions en revalidatie" },
  data1: {
    en: "Reads and writes use separate doors. A navigation triggers loaders and a form submission triggers an action. After an action, React Router revalidates the loader data on the page automatically, so the UI usually stays in sync without manual cache management.",
    nl: "Lezen en schrijven hebben aparte deuren. Een navigatie triggert loaders en een formulierverzending triggert een action. Na een action revalideert React Router de loader-data op de pagina automatisch, zodat de UI meestal synchroon blijft zonder handmatig cachebeheer.",
  },
  dataAria: {
    en: "Two columns: the read path (navigation → loader → component) on the left, and the write path (form submit → action → revalidate) on the right",
    nl: "Twee kolommen: het leespad (navigatie → loader → component) links, en het schrijfpad (formulierverzending → action → revalidatie) rechts",
  },
  dataCaption: {
    en: "Read path on the left, write path on the right. After an action, React Router re-runs the loaders, so the read path produces fresh data and the UI stays in sync.",
    nl: "Leespad links, schrijfpad rechts. Na een action draait React Router de loaders opnieuw, zodat het leespad verse data oplevert en de UI synchroon blijft.",
  },
  queryTitle: { en: "When TanStack Query still fits", nl: "Wanneer TanStack Query alsnog past" },
  queryBody: {
    en: "Loaders work well for data that belongs directly to a route, so for much route data you don't need a separate cache layer. When a query library is still useful, for cross-route caching, background refetching or optimistic updates beyond one route, add something like TanStack Query on top. Start with loaders and add it only when you feel the need.",
    nl: "Loaders werken goed voor data die direct bij een route hoort, dus voor veel routedata heb je geen aparte cachelaag nodig. Wanneer een query-library alsnog nuttig is, voor caching over routes heen, achtergrond-refetching of optimistische updates buiten één route, leg je er iets als TanStack Query bovenop. Begin met loaders en voeg het pas toe als je de behoefte voelt.",
  },
  sbTitle: { en: "Storybook: develop components in isolation", nl: "Storybook: componenten apart ontwikkelen" },
  sb1: {
    en: "Storybook runs your components outside the app, one state at a time. You build a Button against every variant (primary, disabled, loading) without first clicking through three screens to reach it. The modern format is CSF3: stories are plain objects with args. For React + Vite, use the @storybook/react-vite framework.",
    nl: "Storybook draait je componenten buiten de app, één staat tegelijk. Je bouwt een Button tegen elke variant (primary, disabled, loading) zonder eerst door drie schermen te klikken om er te komen. Het moderne formaat is CSF3: stories zijn gewone objecten met args. Voor React + Vite gebruik je het framework @storybook/react-vite.",
  },
  sb2: {
    en: "Add the autodocs tag and Storybook generates a documentation page from your component's props and stories: a living component catalogue your whole team can browse.",
    nl: "Voeg de autodocs-tag toe en Storybook genereert een documentatiepagina uit de props en stories van je component: een levende componentcatalogus die je hele team kan doorbladeren.",
  },
  sbTestTitle: { en: "Stories can also work as tests", nl: "Stories kunnen ook als tests werken" },
  sbTestBody: {
    en: "With a play function you can test interactions inside a story, visible in the Interactions panel. Via the Vitest addon you can run those tests in the terminal and CI too.",
    nl: "Met een play function kun je interacties in een story testen, zichtbaar in het Interactions-panel. Via de Vitest-addon kun je die tests ook in de terminal en CI draaien.",
  },
  testTitle: { en: "Vitest: tests in the same toolchain", nl: "Vitest: tests in dezelfde toolchain" },
  test1: {
    en: "Vitest is the Vite-native test runner. Because it reuses vite.config.ts, your aliases and transforms work the same in tests and at runtime. There is no second toolchain to keep in sync. Pair it with React Testing Library and you test components the way users use them: by role and by behaviour.",
    nl: "Vitest is de Vite-native testrunner. Omdat het vite.config.ts hergebruikt, werken je aliassen en transforms identiek in tests en runtime. Er is geen tweede toolchain om gesynchroniseerd te houden. Combineer het met React Testing Library en je test componenten zoals gebruikers ze gebruiken: op rol en op gedrag.",
  },
  test2: {
    en: "For components that depend on real browser APIs, Vitest Browser Mode can help. It runs tests in a browser, but needs extra configuration and isn't automatically a replacement for all end-to-end tests. We go deeper on testing strategy in a dedicated post.",
    nl: "Voor componenten die afhankelijk zijn van echte browser-API’s kan Vitest Browser Mode helpen. Het draait tests in een browser, maar vraagt extra configuratie en is niet automatisch een vervanging voor alle end-to-end-tests. We gaan in een aparte post dieper in op teststrategie.",
  },
  togetherTitle: { en: "A practical feature structure", nl: "Een praktische featurestructuur" },
  together1: {
    en: "A feature folder holds everything for a slice of the product: its component, its story, its test, its loader and its data access, colocated so the whole feature moves as a unit.",
    nl: "Een featuremap bevat alles voor een stuk van het product: de component, de story, de test, de loader en de datatoegang, gecolokeerd zodat de hele feature als één geheel meebeweegt.",
  },
  treeCaption: {
    en: "Each feature colocates component, story, test and data. Vite, Router, Vitest and Storybook all point here.",
    nl: "Elke feature colokeert component, story, test en data. Vite, Router, Vitest en Storybook wijzen allemaal hierheen.",
  },
  takeawayTitle: { en: "Four choices for a stable baseline", nl: "Vier keuzes voor een stabiele basis" },
  t1S: { en: "Build with Vite.", nl: "Bouw met Vite." },
  t1: {
    en: "Fast dev server, one config shared with your tests.",
    nl: "Snelle dev-server, één config gedeeld met je tests.",
  },
  t2S: { en: "Load data with the router.", nl: "Laad data via de router." },
  t2: {
    en: "Loaders and actions remove fetch-in-effect waterfalls and give you automatic revalidation.",
    nl: "Loaders en actions verwijderen fetch-in-effect-watervallen en geven je automatische revalidatie.",
  },
  t3S: { en: "Test with Vitest + RTL.", nl: "Test met Vitest + RTL." },
  t3: {
    en: "Behaviour-first tests that run in the same toolchain as your app.",
    nl: "Gedrag-eerst-tests die in dezelfde toolchain als je app draaien.",
  },
  t4S: { en: "Develop with Storybook.", nl: "Ontwikkel met Storybook." },
  t4: {
    en: "Isolated component development plus a living, testable catalogue.",
    nl: "Geïsoleerde componentontwikkeling plus een levende, testbare catalogus.",
  },
  outro1: {
    en: "This stack isn't exciting because it's new or exotic. It's strong because each tool has a clear job. Vite builds and serves the app. React Router connects routes to data and mutations. Vitest tests behaviour in the same toolchain. Storybook makes components visible, documented and testable on their own.",
    nl: "Deze stack is niet spannend omdat hij nieuw of exotisch is. Hij is sterk omdat elke tool een duidelijke taak heeft. Vite bouwt en serveert de app. React Router koppelt routes aan data en mutaties. Vitest test gedrag in dezelfde toolchain. Storybook maakt componenten apart zichtbaar, documenteerbaar en testbaar.",
  },
  outro2: {
    en: "Together these choices give you a calm baseline for a serious React app: less duplicate configuration, features kept close together, and room to extend later. Start simple with these four layers and add more tools only when your project really needs them. Start a new app with",
    nl: "Samen geven deze keuzes je een rustige basis voor een serieuze React-app: minder dubbele configuratie, features dicht bij elkaar en ruimte om later uit te breiden. Begin eenvoudig met deze vier lagen en voeg extra tools pas toe wanneer je project daar echt om vraagt. Begin een nieuwe app met",
  },
  treeMain: { en: "app entry: createRoot + RouterProvider", nl: "app-entry: createRoot + RouterProvider" },
  treeRouter: { en: "route tree (createBrowserRouter)", nl: "routeboom (createBrowserRouter)" },
  treeStories: { en: "Storybook story", nl: "Storybook-story" },
  treeTest: { en: "Vitest + RTL test", nl: "Vitest + RTL-test" },
  treeLoader: { en: "data loading", nl: "data laden" },
  treeComponents: { en: "shared UI (Button, Card…)", nl: "gedeelde UI (Button, Card…)" },
  treeTestDir: { en: "setup.ts, MSW handlers", nl: "setup.ts, MSW-handlers" },
  treeStorybook: { en: "Storybook config", nl: "Storybook-config" },
  routerCode: { en: ROUTER_CODE_EN, nl: ROUTER_CODE_NL },
  loaderCode: { en: LOADER_CODE_EN, nl: LOADER_CODE_NL },
  apiCode: { en: API_CODE_EN, nl: API_CODE_NL },
  productListCode: { en: PRODUCTLIST_CODE_EN, nl: PRODUCTLIST_CODE_NL },
  storiesCode: { en: STORIES_CODE_EN, nl: STORIES_CODE_NL },
  testCode: { en: TEST_CODE_EN, nl: TEST_CODE_NL },
} as const;
