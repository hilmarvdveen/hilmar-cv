import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, H3, P, Lead, UL, OL, LI, Strong, InlineCode, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FileTree, type FileNode } from "./FileTree";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "react-router-remix-routes-loaders-actions-folder-structure",
  category: "routing",
  publishedDate: "2026-06-26",
  updatedDate: "2026-06-28",
  readingTimeMin: 16,
  title: {
    en: "React Router as a Framework: routes, loaders, actions and folder structure",
    nl: "React Router als framework: routes, loaders, actions en mappenstructuur",
  },
  description: {
    en: "React Router is now a full framework: v7 brought Remix's ideas in and v8 continues the line. Learn nested routes, loaders, actions and a folder structure to copy — with real examples.",
    nl: "React Router is nu een volwaardig framework: v7 bracht de Remix-ideeën binnen en v8 zet die lijn door. Leer geneste routes, loaders, actions en een mappenstructuur — met echte voorbeelden.",
  },
  excerpt: {
    en: "Nested routes create nested UI, loaders fetch before render, actions handle writes. A clear, example-driven tour of React Router as a framework — and where v7 and v8 fit.",
    nl: "Geneste routes maken geneste UI, loaders laden vóór render, actions verwerken mutaties. Een heldere, voorbeeldgedreven rondleiding door React Router als framework — en waar v7 en v8 passen.",
  },
  keywords: [
    "react router v7",
    "react router v8",
    "remix",
    "nested routes",
    "loaders and actions",
    "framework mode",
    "react router folder structure",
  ],
};

// Stacked downward: root → dashboard, then dashboard renders its children.
const nestNodes = [
  flowNode("root", "root.tsx", { x: 215, y: 0 }, { tone: "slate", sub: "<html> + <Outlet/>", dir: "TB", width: 190 }),
  flowNode("dash", "dashboard.tsx", { x: 215, y: 140 }, { tone: "blue", sub: "layout + <Outlet/>", dir: "TB", width: 200 }),
  flowNode("products", "products", { x: 0, y: 300 }, { tone: "emerald", sub: "/dashboard/products", dir: "TB", width: 220 }),
  flowNode("settings", "settings", { x: 440, y: 300 }, { tone: "emerald", sub: "/dashboard/settings", dir: "TB", width: 220 }),
];
const nestEdges = [
  flowEdge("root", "dash", { label: "Outlet" }),
  flowEdge("dash", "products", { label: "Outlet" }),
  flowEdge("dash", "settings"),
];

// Stacked downward: request → match → loaders → render → hydrate.
const lifecycleNodes = [
  flowNode("req", "Request", { x: 0, y: 0 }, { tone: "slate", sub: "GET /dashboard/products", dir: "TB", width: 250 }),
  flowNode("match", "Match routes", { x: 0, y: 115 }, { tone: "violet", sub: "root → dashboard → products", dir: "TB", width: 250 }),
  flowNode("loaders", "Run loaders", { x: 0, y: 230 }, { tone: "emerald", sub: "in parallel", dir: "TB", width: 250 }),
  flowNode("render", "Render HTML", { x: 0, y: 345 }, { tone: "blue", sub: "server", dir: "TB", width: 250 }),
  flowNode("hydrate", "Hydrate", { x: 0, y: 460 }, { tone: "amber", sub: "client takes over", dir: "TB", width: 250 }),
];
const lifecycleEdges = [
  flowEdge("req", "match"),
  flowEdge("match", "loaders"),
  flowEdge("loaders", "render", { label: "data ready" }),
  flowEdge("render", "hydrate"),
];

function buildTree(locale: Locale): FileNode[] {
  const c = COPY;
  return [
    {
      name: "app",
      children: [
        { name: "root.tsx", comment: c.treeRoot[locale] },
        { name: "routes.ts", comment: c.treeRoutesTs[locale] },
        {
          name: "routes",
          children: [
            { name: "home.tsx", comment: c.treeHome[locale] },
            { name: "dashboard.tsx", comment: c.treeDashboard[locale] },
            { name: "dashboard.products.tsx", comment: c.treeProducts[locale] },
            { name: "dashboard.products.$id.tsx", comment: c.treeParam[locale] },
            { name: "dashboard.settings.tsx" },
          ],
        },
        { name: "products.server.ts", comment: c.treeServer[locale] },
      ],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const c = COPY;
  return (
    <>
      <Lead>{c.lead[locale]}</Lead>
      <P>{c.intro[locale]}</P>
      <Quote>{c.quote[locale]}</Quote>

      <H2>{c.historyTitle[locale]}</H2>
      <P>{c.history1[locale]}</P>
      <P>{c.history2[locale]}</P>
      <Callout variant="info" title={c.modesTitle[locale]}>
        {c.modesBody[locale]}
      </Callout>

      <H2>{c.nestTitle[locale]}</H2>
      <P>{c.nest1[locale]}</P>
      <FlowDiagram
        nodes={nestNodes}
        edges={nestEdges}
        height={420}
        ariaLabel={c.nestAria[locale]}
        caption={c.nestCaption[locale]}
      />
      <P>{c.nest2[locale]}</P>
      <P>{c.nest3[locale]}</P>
      <CodeBlock lang="ts" filename="app/routes.ts" code={c.routesCode[locale]} />
      <P>{c.nest4[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/dashboard.tsx" code={c.layoutCode[locale]} />

      <H2>{c.loaderTitle[locale]}</H2>
      <P>{c.loader1[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/dashboard.products.tsx" code={c.productsCode[locale]} />
      <P>{c.loader2[locale]}</P>

      <H3>{c.lifecycleTitle[locale]}</H3>
      <P>{c.lifecycle1[locale]}</P>
      <FlowDiagram
        nodes={lifecycleNodes}
        edges={lifecycleEdges}
        height={520}
        ariaLabel={c.lifecycleAria[locale]}
        caption={c.lifecycleCaption[locale]}
      />
      <Callout variant="tip" title={c.lifecycleTipTitle[locale]}>
        {c.lifecycleTipBody[locale]}
      </Callout>

      <Divider />

      <H2>{c.paramsTitle[locale]}</H2>
      <P>{c.params1[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/dashboard.products.$id.tsx" code={c.paramCode[locale]} />

      <H2>{c.errorTitle[locale]}</H2>
      <P>{c.error1[locale]}</P>
      <CodeBlock lang="tsx" filename="app/routes/dashboard.products.$id.tsx" code={c.errorCode[locale]} />
      <Callout variant="warning" title={c.errorWarnTitle[locale]}>
        {c.errorWarnBody[locale]}
      </Callout>

      <H2>{c.folderTitle[locale]}</H2>
      <P>{c.folder1[locale]}</P>
      <FileTree tree={buildTree(locale)} caption={c.treeCaption[locale]} />
      <P>{c.folder2[locale]}</P>
      <UL>
        <LI><Strong>{c.f1S[locale]}</Strong> {c.f1[locale]}</LI>
        <LI><Strong>{c.f2S[locale]}</Strong> {c.f2[locale]}</LI>
        <LI><Strong>{c.f3S[locale]}</Strong> {c.f3[locale]}</LI>
      </UL>

      <H2>{c.takeawayTitle[locale]}</H2>
      <OL>
        <LI>{c.t1[locale]}</LI>
        <LI>{c.t2[locale]}</LI>
        <LI>{c.t3[locale]}</LI>
        <LI>{c.t4[locale]}</LI>
      </OL>
      <P>
        {c.outro[locale]} <InlineCode>npx create-react-router@latest</InlineCode>.
      </P>
    </>
  );
}

// ── Code samples (identical per locale; only the comments are translated) ─────
const ROUTES_CODE_EN = `import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"), // "/"

  // "dashboard" adds the URL segment and wraps its children.
  // Child paths are relative, so "products" becomes /dashboard/products.
  route("dashboard", "./routes/dashboard.tsx", [
    index("./routes/dashboard._index.tsx"),
    route("products", "./routes/dashboard.products.tsx"),
    route("products/:id", "./routes/dashboard.products.$id.tsx"),
    route("settings", "./routes/dashboard.settings.tsx"),
  ]),
] satisfies RouteConfig;`;

const ROUTES_CODE_NL = `import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"), // "/"

  // "dashboard" voegt het URL-segment toe en omhult zijn kinderen.
  // Child-paden zijn relatief, dus "products" wordt /dashboard/products.
  route("dashboard", "./routes/dashboard.tsx", [
    index("./routes/dashboard._index.tsx"),
    route("products", "./routes/dashboard.products.tsx"),
    route("products/:id", "./routes/dashboard.products.$id.tsx"),
    route("settings", "./routes/dashboard.settings.tsx"),
  ]),
] satisfies RouteConfig;`;

const LAYOUT_CODE_EN = `import { Outlet, NavLink } from "react-router";

// The dashboard route renders shared chrome plus an <Outlet/> for its children.
export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <NavLink to="/dashboard/products">Products</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet /> {/* the active child route renders here */}
      </main>
    </div>
  );
}`;

const LAYOUT_CODE_NL = `import { Outlet, NavLink } from "react-router";

// De dashboard-route rendert gedeelde UI plus een <Outlet/> voor zijn kinderen.
export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <NavLink to="/dashboard/products">Products</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet /> {/* hier rendert de actieve child-route */}
      </main>
    </div>
  );
}`;

const PRODUCTS_CODE_EN = `import { Form } from "react-router";
import type { Route } from "./+types/dashboard.products";
import { fetchProducts, createProduct } from "../products.server";

// A loader fetches data on the server before the route renders.
// The component receives it as loaderData.
export async function loader() {
  return { products: await fetchProducts() };
}

// An action handles the form POST below. After it runs, React Router
// re-runs the page's loaders, so the list refreshes automatically.
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Name is required" };
  await createProduct({ name });
  return { ok: true };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <ul>
        {loaderData.products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <Form method="post">
        <input name="name" aria-label="Product name" />
        <button type="submit">Add product</button>
      </Form>
    </section>
  );
}`;

const PRODUCTS_CODE_NL = `import { Form } from "react-router";
import type { Route } from "./+types/dashboard.products";
import { fetchProducts, createProduct } from "../products.server";

// Een loader haalt data op de server op vóór de route rendert.
// De component krijgt die binnen via loaderData.
export async function loader() {
  return { products: await fetchProducts() };
}

// Een action verwerkt de form-POST hieronder. Daarna draait React Router
// de loaders van de pagina opnieuw, zodat de lijst automatisch ververst.
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Naam is verplicht" };
  await createProduct({ name });
  return { ok: true };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <ul>
        {loaderData.products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <Form method="post">
        <input name="name" aria-label="Productnaam" />
        <button type="submit">Product toevoegen</button>
      </Form>
    </section>
  );
}`;

const PARAM_CODE_EN = `import type { Route } from "./+types/dashboard.products.$id";
import { fetchProduct } from "../products.server";

// params.id comes from the ":id" segment in routes.ts and is typed.
export async function loader({ params }: Route.LoaderArgs) {
  const product = await fetchProduct(params.id);
  if (!product) throw new Response("Not found", { status: 404 });
  return { product };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.product.name}</h1>;
}`;

const PARAM_CODE_NL = `import type { Route } from "./+types/dashboard.products.$id";
import { fetchProduct } from "../products.server";

// params.id komt uit het ":id"-segment in routes.ts en is getypeerd.
export async function loader({ params }: Route.LoaderArgs) {
  const product = await fetchProduct(params.id);
  if (!product) throw new Response("Not found", { status: 404 });
  return { product };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.product.name}</h1>;
}`;

const ERROR_CODE_EN = `import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/dashboard.products.$id";

// Co-located with the route: a thrown error or Response lands here.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <p>That product does not exist.</p>;
  }
  return <p>Something went wrong.</p>;
}`;

const ERROR_CODE_NL = `import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/dashboard.products.$id";

// Naast de route geplaatst: een gegooide fout of Response komt hier terecht.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <p>Dit product bestaat niet.</p>;
  }
  return <p>Er ging iets mis.</p>;
}`;

// ── Bilingual copy ────────────────────────────────────────────────────────────
const COPY = {
  lead: {
    en: "React Router used to be mostly a way to map URLs to components: /products shows the products page, /settings the settings. Today the router does much more.",
    nl: "Vroeger gebruikte je React Router vooral om URL’s aan componenten te koppelen: /products toont de productpagina, /settings de instellingen. Inmiddels doet de router veel meer.",
  },
  intro: {
    en: "It also manages which data a route needs (loaders), how mutations run (actions), and how you handle errors. That makes your route structure a central part of your app. We build it up step by step, into a folder structure you can copy.",
    nl: "Hij beheert ook welke data een route nodig heeft (loaders), hoe mutaties verlopen (actions) en hoe je fouten afhandelt. Daardoor wordt je route-structuur een centraal onderdeel van je app. We bouwen het stap voor stap op, tot een mappenstructuur die je zo kunt overnemen.",
  },
  quote: {
    en: "The URL is the source of truth: it decides which route is active, which data is needed and what the user sees.",
    nl: "De URL is de bron van waarheid: hij bepaalt welke route actief is, welke data nodig is en wat de gebruiker ziet.",
  },
  historyTitle: {
    en: "What changed with Remix and React Router?",
    nl: "Wat veranderde er met Remix en React Router?",
  },
  history1: {
    en: "For a long time, React Router and Remix were separate projects from the same team. React Router was the routing library for React. Remix was a framework on top of it, with loaders, actions, server rendering and route modules.",
    nl: "React Router en Remix waren lange tijd aparte projecten van hetzelfde team. React Router was de routing-library voor React. Remix was een framework daarbovenop, met loaders, actions, server-rendering en route-modules.",
  },
  history2: {
    en: "React Router v7 brought many of those Remix ideas into React Router itself, so you can now use React Router as a framework. React Router v8 has since shipped and continues that line, but v7 stays important: it is where this merge began. Remix v2 is end-of-life, and Remix 3 is heading in a different direction.",
    nl: "Met React Router v7 kwamen veel van die Remix-ideeën naar React Router zelf. Daardoor kun je React Router nu ook als framework gebruiken. Inmiddels is React Router v8 uitgebracht, die deze lijn voortzet, maar v7 blijft belangrijk: dáár begon deze samenvoeging. Remix v2 is einde-leven en Remix 3 gaat een andere richting op.",
  },
  modesTitle: { en: "Three ways to use it", nl: "Drie manieren om het te gebruiken" },
  modesBody: {
    en: "React Router has three modes. Declarative mode is the classic router built around <BrowserRouter> and <Routes>. Data mode moves the route config out of the render tree and adds loaders, actions and pending states. Framework mode builds on that with the Vite plugin, route modules, type generation, automatic code splitting and optional SSR, SPA or static rendering. This post uses Framework mode.",
    nl: "React Router kent drie modes. In de Declarative mode gebruik je vooral <BrowserRouter> en <Routes>. In de Data mode haal je de route-config uit de renderboom en voeg je loaders, actions en pending states toe. In de Framework mode bouw je daarop verder met de Vite-plugin, route-modules, type-generatie, automatische code splitting en optionele SSR, SPA of static rendering. Deze post gebruikt de Framework mode.",
  },
  nestTitle: { en: "Nested routes create nested UI", nl: "Geneste routes maken geneste UI mogelijk" },
  nest1: {
    en: "The route /dashboard/products has several layers. The root route renders the app shell. The dashboard route renders the dashboard layout. The products route renders the product list inside that layout's <Outlet />.",
    nl: "De route /dashboard/products bestaat uit meerdere lagen. De root-route rendert de basis van de app. De dashboard-route rendert de dashboard-layout. De products-route rendert de productlijst in de <Outlet /> van die layout.",
  },
  nestAria: {
    en: "Diagram: root renders dashboard in its Outlet; dashboard renders products or settings in its Outlet",
    nl: "Diagram: root rendert dashboard in zijn Outlet; dashboard rendert products of settings in zijn Outlet",
  },
  nestCaption: {
    en: "Each route renders its child in an <Outlet/>. The shared layout stays in place when you navigate between children.",
    nl: "Elke route rendert zijn kind in een <Outlet/>. De gedeelde layout blijft staan als je tussen kinderen navigeert.",
  },
  nest2: {
    en: "So the route tree and the component tree have the same shape. Shared layout lives in the parent and does not re-mount on child navigation.",
    nl: "Zo hebben de routeboom en de componentboom dezelfde vorm. Gedeelde layout staat in de ouder en re-mount niet bij navigatie tussen kinderen.",
  },
  nest3: {
    en: "You declare that structure once in app/routes.ts. route() adds a URL segment and can nest children; index() attaches the default page for a segment.",
    nl: "Je legt die structuur één keer vast in app/routes.ts. route() voegt een URL-segment toe en kan kinderen nesten; index() koppelt de standaardpagina van een segment.",
  },
  nest4: {
    en: "The dashboard route renders the shared layout and places an <Outlet /> where the active child route appears. Switching between products and settings changes only the Outlet — the navigation stays put.",
    nl: "De dashboard-route rendert de gedeelde layout en plaatst een <Outlet /> waar de actieve child-route verschijnt. Wissel je tussen products en settings, dan verandert alleen de Outlet — de navigatie blijft staan.",
  },
  loaderTitle: { en: "Loaders and actions: load and mutate data", nl: "Loaders en actions: data laden en muteren" },
  loader1: {
    en: "A loader fetches data before a route renders. An action handles a mutation, for example a form that saves a new product. Every route module can export both.",
    nl: "Een loader haalt data op voordat een route rendert. Een action verwerkt een mutatie, bijvoorbeeld een formulier dat een nieuw product opslaat. Elke route-module kan beide exporteren.",
  },
  loader2: {
    en: "The component receives the data through loaderData, fully typed. For the normal view the data is already there, so you usually don't need a separate loading state. The <Form> posts to the action; afterwards React Router re-runs the page's loaders, so the list refreshes automatically — with no cache code of your own.",
    nl: "De component krijgt de data via loaderData, volledig getypeerd. Voor de standaardweergave is de data dus al beschikbaar en hoef je geen aparte loading-state te tonen. Het <Form> post naar de action. Daarna draait React Router de loaders van de pagina opnieuw, zodat de lijst automatisch ververst — zonder eigen cachecode.",
  },
  lifecycleTitle: { en: "What happens on a request?", nl: "Wat gebeurt er bij een request?" },
  lifecycle1: {
    en: "On a request, the router matches the URL to a chain of routes. It starts all their loaders at the same time, renders HTML on the server with the data in place, and sends it back. The client then takes over (hydration) for later navigations.",
    nl: "Bij een request matcht de router de URL met een keten van routes. Hij start alle bijbehorende loaders tegelijk, rendert HTML op de server met de data erin, en stuurt die terug. Daarna neemt de client het over (hydratie) voor volgende navigaties.",
  },
  lifecycleAria: {
    en: "Diagram: request, match routes, run loaders in parallel, render HTML, hydrate on the client",
    nl: "Diagram: request, routes matchen, loaders parallel draaien, HTML renderen, hydrateren op de client",
  },
  lifecycleCaption: {
    en: "The loaders for all matched routes start together — nesting doesn't mean sequential loading.",
    nl: "De loaders van alle gematchte routes starten tegelijk — nesting betekent geen sequentieel laden.",
  },
  lifecycleTipTitle: { en: "Loaders run in parallel by default", nl: "Loaders draaien standaard parallel" },
  lifecycleTipBody: {
    en: "The router knows which routes are active before rendering, and therefore which loaders it needs, so it starts them together. This avoids slow data loading: without loaders, each component often fetches its own data in useEffect, where one request waits on the next.",
    nl: "De router weet vóór het renderen welke routes actief zijn, en dus welke loaders nodig zijn. Die start hij tegelijk. Zo voorkom je trage dataloading: zonder loaders haalt vaak elke component zijn eigen data op in useEffect, waarbij de ene request op de andere wacht.",
  },
  paramsTitle: { en: "Dynamic params, with types", nl: "Dynamische params met types" },
  params1: {
    en: "A segment like :id in routes.ts becomes a URL parameter. In Framework mode React Router generates types per route, so params.id and loaderData are fully typed. Throw a Response to jump straight to an error boundary.",
    nl: "Een segment als :id in routes.ts wordt een URL-parameter. In de Framework mode genereert React Router types per route, dus params.id en loaderData zijn volledig getypeerd. Gooi een Response om meteen naar een error boundary te springen.",
  },
  errorTitle: { en: "Error boundaries per route", nl: "Error boundaries per route" },
  error1: {
    en: "Every route module can export its own ErrorBoundary. If a loader throws an error — or a Response like the 404 above — React Router finds the nearest ErrorBoundary. Only that part of the UI shows an error; the rest of the layout stays visible.",
    nl: "Elke route-module kan een eigen ErrorBoundary exporteren. Gooit een loader een fout — of een Response zoals de 404 hierboven — dan zoekt React Router de dichtstbijzijnde ErrorBoundary. Alleen dat deel van de UI toont een foutmelding; de rest van de layout blijft zichtbaar.",
  },
  errorWarnTitle: { en: "Throw errors, don't return them as data", nl: "Gooi fouten, geef ze niet terug als data" },
  errorWarnBody: {
    en: "Don't return an error as normal loader data — then every component has to check for an error itself. Throw the error instead, and React Router routes it to the right ErrorBoundary automatically.",
    nl: "Geef een fout niet terug als gewone loader-data, want dan moet elke component zelf controleren of er een fout is. Gooi de fout met throw. React Router stuurt die dan automatisch naar de juiste ErrorBoundary.",
  },
  folderTitle: { en: "A folder structure that scales", nl: "Een mappenstructuur die logisch blijft groeien" },
  folder1: {
    en: "In Framework mode, app/routes.ts is the source of truth: it maps URL patterns to route modules. The route config decides the URL, not the filename. Many teams still name files to resemble the URL because it reads more easily. If you use file-route conventions, those names gain meaning: a dot stands for a URL segment and a $ for a dynamic parameter.",
    nl: "In de Framework mode is app/routes.ts de bron van waarheid: daar koppel je URL-patronen aan route-modules. De route-config bepaalt de URL, niet de bestandsnaam. Veel teams geven de bestanden wel namen die op de URL lijken, omdat dat makkelijker leest. Gebruik je file-route conventions, dan krijgen die namen extra betekenis: een punt staat dan voor een URL-segment en een $ voor een dynamische parameter.",
  },
  treeCaption: {
    en: "routes.ts maps URLs to modules; .server.ts stays on the server; filenames mirror the URL for readability.",
    nl: "routes.ts koppelt URL’s aan modules; .server.ts blijft op de server; bestandsnamen spiegelen de URL voor leesbaarheid.",
  },
  folder2: {
    en: "Three things keep a large route folder readable:",
    nl: "Drie dingen houden een grote route-map leesbaar:",
  },
  f1S: { en: "routes.ts decides the URL.", nl: "routes.ts bepaalt de URL." },
  f1: {
    en: "It maps each URL pattern to a route module. Start here when you want to know which URL maps to which file.",
    nl: "Hier koppel je elk URL-patroon aan een route-module. Begin hier als je wilt weten welke URL bij welk bestand hoort.",
  },
  f2S: { en: "Filenames mirror the URL.", nl: "Bestandsnamen spiegelen de URL." },
  f2: {
    en: "A name like dashboard.products.$id.tsx clearly belongs to /dashboard/products/:id, which keeps related routes together. With file-route conventions, the dot and $ directly define the segments and params.",
    nl: "Een naam als dashboard.products.$id.tsx hoort logisch bij /dashboard/products/:id, wat verwante routes bij elkaar houdt. Met file-route conventions worden de punt en $ betekenisdragend.",
  },
  f3S: { en: ".server.ts stays on the server.", nl: ".server.ts blijft op de server." },
  f3: {
    en: "Put database code, secrets and server-only logic in a .server.ts file; it doesn't belong in the client bundle. Don't make route modules themselves .server.tsx — they must exist in both the server and client graphs.",
    nl: "Zet databasecode, secrets en server-only logica in een .server.ts-bestand; dat hoort niet in de client-bundle. Maak route-modules zelf niet .server.tsx — die moeten in zowel de server- als clientgraph bekend zijn.",
  },
  takeawayTitle: { en: "What to remember", nl: "Wat te onthouden" },
  t1: {
    en: "Nested routes create nested UI. A parent renders shared layout and shows the active child through <Outlet />.",
    nl: "Geneste routes maken geneste UI mogelijk. Een parent rendert gedeelde layout en toont het actieve kind via <Outlet />.",
  },
  t2: {
    en: "Loaders fetch data before a route renders. Actions handle mutations. After an action, React Router can re-run the loaders.",
    nl: "Loaders halen data op voordat een route rendert. Actions verwerken mutaties. Na een action kan React Router de loaders opnieuw draaien.",
  },
  t3: {
    en: "Error boundaries keep failures local. An error in one route need not break your whole app.",
    nl: "Error boundaries houden fouten lokaal. Een fout in één route hoeft niet je hele app te breken.",
  },
  t4: {
    en: "routes.ts decides the URL; keep server-only code in .server.ts files.",
    nl: "routes.ts bepaalt de URL; zet server-only code in .server.ts-bestanden.",
  },
  outro: {
    en: "Start with your routes; the folder structure follows from there, and you need less extra state code — fewer manual useEffect fetches, loading states and cache logic. Start a project with",
    nl: "Begin bij je routes. Daarna volgt de mappenstructuur vanzelf, en heb je minder losse state-code nodig: minder handmatige useEffect-fetches, loading-states en cachelogica. Start een project met",
  },
  // File-tree comments (localized)
  treeRoot: {
    en: "document shell + <Outlet/> + ErrorBoundary",
    nl: "document-shell + <Outlet/> + ErrorBoundary",
  },
  treeRoutesTs: {
    en: "the route config (maps URL → module)",
    nl: "de route-config (koppelt URL → module)",
  },
  treeHome: { en: "index route '/'", nl: "index-route '/'" },
  treeDashboard: { en: "layout for /dashboard/*", nl: "layout voor /dashboard/*" },
  treeProducts: { en: "/dashboard/products (loader + action)", nl: "/dashboard/products (loader + action)" },
  treeParam: { en: "dynamic param :id", nl: "dynamische param :id" },
  treeServer: {
    en: "server-only data access (not in the client bundle)",
    nl: "server-only datatoegang (niet in de client-bundle)",
  },
  // Code samples keyed by locale
  routesCode: { en: ROUTES_CODE_EN, nl: ROUTES_CODE_NL },
  layoutCode: { en: LAYOUT_CODE_EN, nl: LAYOUT_CODE_NL },
  productsCode: { en: PRODUCTS_CODE_EN, nl: PRODUCTS_CODE_NL },
  paramCode: { en: PARAM_CODE_EN, nl: PARAM_CODE_NL },
  errorCode: { en: ERROR_CODE_EN, nl: ERROR_CODE_NL },
} as const;
