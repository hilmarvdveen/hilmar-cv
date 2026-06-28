import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, H3, P, Lead, UL, OL, LI, Strong, InlineCode, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FileTree, type FileNode } from "./FileTree";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "react-folder-structure",
  category: "fundamentals",
  publishedDate: "2026-06-10",
  updatedDate: "2026-06-28",
  readingTimeMin: 12,
  title: {
    en: "React Folder Structure That Scales: From Type-Based to Feature-First",
    nl: "Een React-mappenstructuur die meeschaalt: van type-gebaseerd naar feature-first",
  },
  description: {
    en: "How to organize a modern React project so it stays easy to navigate as it grows: feature folders, clear shared boundaries, small barrels, path aliases, and colocated tests.",
    nl: "Hoe je een modern React-project organiseert zodat het overzichtelijk blijft naarmate het groeit: featuremappen, duidelijke gedeelde grenzen, kleine barrels, path-aliassen en gecolokeerde tests.",
  },
  excerpt: {
    en: "Folder layout decides how fast you find, change and delete code. A practical move from type-based folders to a feature-first structure that scales.",
    nl: "De mappenindeling bepaalt hoe snel je code vindt, wijzigt en verwijdert. Een praktische stap van type-gebaseerde mappen naar een feature-first structuur die meeschaalt.",
  },
  keywords: [
    "react folder structure",
    "feature-first architecture",
    "next.js app router structure",
    "vite react path aliases",
    "colocation tests",
    "barrel files",
  ],
};

const dependencyNodes = [
  flowNode("pages", "app/ (routes)", { x: 0, y: 0 }, { tone: "blue", sub: "thin pages", dir: "TB", width: 200 }),
  flowNode("features", "features/", { x: 0, y: 110 }, { tone: "emerald", sub: "domain logic + UI", dir: "TB", width: 200 }),
  flowNode("shared", "components/ · hooks/", { x: -120, y: 230 }, { tone: "violet", sub: "shared UI", dir: "TB", width: 200 }),
  flowNode("lib", "lib/ · utils/", { x: 140, y: 230 }, { tone: "amber", sub: "pure logic", dir: "TB", width: 180 }),
];
const dependencyEdges = [
  flowEdge("pages", "features", { label: "imports" }),
  flowEdge("features", "shared"),
  flowEdge("features", "lib"),
];

// Feature on top fanning down into the type folders, so the arrows point down.
const byTypeNodes = [
  flowNode("feat", "one feature", { x: 200, y: 0 }, { tone: "slate", sub: "scattered across folders", dir: "TB", width: 200 }),
  flowNode("c1", "components/", { x: 0, y: 160 }, { tone: "rose", dir: "TB", width: 160 }),
  flowNode("h1", "hooks/", { x: 210, y: 160 }, { tone: "rose", dir: "TB", width: 160 }),
  flowNode("u1", "utils/", { x: 420, y: 160 }, { tone: "rose", dir: "TB", width: 160 }),
];
const byTypeEdges = [
  flowEdge("feat", "c1", { dashed: true }),
  flowEdge("feat", "h1", { dashed: true }),
  flowEdge("feat", "u1", { dashed: true }),
];

function buildTree(locale: Locale): FileNode[] {
  const c = COPY;
  return [
    {
      name: "src",
      children: [
        {
          name: "app",
          comment: c.treeApp[locale],
          children: [{ name: "[locale]", children: [{ name: "checkout", children: [{ name: "page.tsx" }] }] }],
        },
        {
          name: "features",
          comment: c.treeFeatures[locale],
          children: [
            {
              name: "checkout",
              children: [
                { name: "components", children: [{ name: "CartSummary.tsx" }, { name: "PaymentForm.tsx" }] },
                { name: "hooks", children: [{ name: "useCart.ts" }] },
                { name: "api.ts", comment: c.treeApi[locale] },
                { name: "types.ts" },
                { name: "index.ts", comment: c.treeBarrel[locale] },
              ],
            },
            { name: "catalog", comment: c.treeCatalog[locale] },
          ],
        },
        { name: "components", comment: c.treeShared[locale], children: [{ name: "Button.tsx" }, { name: "Modal.tsx" }] },
        { name: "hooks", comment: c.treeSharedHooks[locale] },
        { name: "lib", comment: c.treeLib[locale], children: [{ name: "money.ts" }, { name: "http.ts" }] },
      ],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const c = COPY;
  return (
    <>
      <Lead>{c.lead[locale]}</Lead>
      <P>{c.intro1[locale]}</P>
      <P>{c.intro2[locale]}</P>
      <Quote>{c.quote[locale]}</Quote>

      <H2>{c.byTypeTitle[locale]}</H2>
      <P>{c.byType1[locale]}</P>
      <FlowDiagram
        nodes={byTypeNodes}
        edges={byTypeEdges}
        height={320}
        ariaLabel={c.byTypeAria[locale]}
        caption={c.byTypeCaption[locale]}
      />
      <P>{c.byType2[locale]}</P>
      <Callout variant="warning" title={c.byTypeWarnTitle[locale]}>
        {c.byTypeWarnBody[locale]}
      </Callout>

      <H2>{c.featureTitle[locale]}</H2>
      <P>{c.feature1[locale]}</P>
      <P>{c.feature2[locale]}</P>
      <P>{c.feature3[locale]}</P>
      <FileTree tree={buildTree(locale)} caption={c.featureTreeCaption[locale]} />

      <H3>{c.coloc[locale]}</H3>
      <P>{c.coloc1[locale]}</P>
      <CodeBlock lang="text" filename="features/checkout/components/" code={c.colocationCode[locale]} />
      <P>{c.coloc2[locale]}</P>

      <Divider />

      <H2>{c.boundaryTitle[locale]}</H2>
      <P>{c.boundary1[locale]}</P>
      <FlowDiagram
        nodes={dependencyNodes}
        edges={dependencyEdges}
        height={420}
        ariaLabel={c.boundaryAria[locale]}
        caption={c.boundaryCaption[locale]}
      />
      <P>{c.boundary2[locale]}</P>
      <UL>
        <LI><Strong>{c.rule1Strong[locale]}</Strong> {c.rule1[locale]}</LI>
        <LI><Strong>{c.rule2Strong[locale]}</Strong> {c.rule2[locale]}</LI>
        <LI><Strong>{c.rule3Strong[locale]}</Strong> {c.rule3[locale]}</LI>
      </UL>
      <Callout variant="warning" title={c.sharedWarnTitle[locale]}>
        {c.sharedWarnBody[locale]}
      </Callout>

      <H2>{c.barrelTitle[locale]}</H2>
      <P>{c.barrel1[locale]}</P>
      <CodeBlock lang="tsx" filename="features/checkout/index.ts" code={c.barrelCode[locale]} />
      <CodeBlock lang="tsx" filename="app/[locale]/checkout/page.tsx" code={c.pageCode[locale]} />
      <Callout variant="tip" title={c.barrelTipTitle[locale]}>
        {c.barrelTipBody[locale]}
      </Callout>

      <H2>{c.aliasTitle[locale]}</H2>
      <P>{c.alias1[locale]}</P>
      <CodeBlock lang="json" filename="tsconfig.json" code={TSCONFIG_CODE} />
      <P>{c.alias2[locale]}</P>
      <CodeBlock lang="ts" filename="vite.config.ts" code={VITE_CONFIG} />
      <P>
        {c.alias3[locale]} <InlineCode>@/features/checkout</InlineCode>.
      </P>

      <H2>{c.checklistTitle[locale]}</H2>
      <P>{c.checklist1[locale]}</P>
      <OL>
        <LI>{c.check1[locale]}</LI>
        <LI>{c.check2[locale]}</LI>
        <LI>{c.check3[locale]}</LI>
        <LI>{c.check4[locale]}</LI>
        <LI>{c.check5[locale]}</LI>
      </OL>
      <P>{c.outro1[locale]}</P>
      <P>{c.outro2[locale]}</P>
      <P>{c.outro3[locale]}</P>
    </>
  );
}

// ── Comment-free code (shared) ───────────────────────────────────────────────
const TSCONFIG_CODE = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`;

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});`;

// ── Code with teaching comments (translated per locale) ──────────────────────
const COLOCATION_CODE_EN = `PaymentForm.tsx          # the component
PaymentForm.test.tsx     # its unit test
PaymentForm.stories.tsx  # its Storybook story`;

const COLOCATION_CODE_NL = `PaymentForm.tsx          # de component
PaymentForm.test.tsx     # de unit-test
PaymentForm.stories.tsx  # de Storybook-story`;

const BARREL_CODE_EN = `// The feature's public API. Pages import from here, never from deep paths.
export { CartSummary } from "./components/CartSummary";
export { PaymentForm } from "./components/PaymentForm";
export { useCart } from "./hooks/useCart";
export type { CartLine } from "./types";`;

const BARREL_CODE_NL = `// De publieke API van de feature. Pagina's importeren hiervandaan, nooit via diepe paden.
export { CartSummary } from "./components/CartSummary";
export { PaymentForm } from "./components/PaymentForm";
export { useCart } from "./hooks/useCart";
export type { CartLine } from "./types";`;

const PAGE_CODE_EN = `// Next.js App Router-style page; the folder defines the route segment.
// One import surface — internals can move freely behind the barrel.
import { CartSummary, PaymentForm } from "@/features/checkout";

export default function CheckoutPage() {
  return (
    <>
      <CartSummary />
      <PaymentForm />
    </>
  );
}`;

const PAGE_CODE_NL = `// Next.js App Router-pagina; de map bepaalt het route-segment.
// Eén import-oppervlak — interne code kan vrij bewegen achter de barrel.
import { CartSummary, PaymentForm } from "@/features/checkout";

export default function CheckoutPage() {
  return (
    <>
      <CartSummary />
      <PaymentForm />
    </>
  );
}`;

// ── Bilingual copy ────────────────────────────────────────────────────────────
const COPY = {
  lead: {
    en: "Folder structure is one of the cheapest architecture decisions to make early, and one of the most painful to change later. It affects how quickly developers can find code, how safely they can change it, and how confidently they can remove it.",
    nl: "De mappenstructuur is een van de goedkoopste architectuurkeuzes om vroeg te maken, en een van de pijnlijkste om later te wijzigen. Ze bepaalt hoe snel developers code vinden, hoe veilig ze die wijzigen en hoe zelfverzekerd ze die verwijderen.",
  },
  intro1: {
    en: "A small React app can survive almost any layout. The problems usually start when the codebase grows. A single product feature, such as checkout or catalog, may be spread across components, hooks, utils and services. At that point, every change requires extra searching.",
    nl: "Een kleine React-app overleeft vrijwel elke indeling. De problemen beginnen meestal wanneer de codebase groeit. Eén productfeature, zoals checkout of catalog, kan uitgesmeerd raken over components, hooks, utils en services. Vanaf dat moment vraagt elke wijziging extra zoekwerk.",
  },
  intro2: {
    en: "React itself has no opinion about folder structure — the docs mention grouping by feature/route and grouping by file type as common options. This post shows a practical, opinionated move from type-based folders to a feature-first structure. The examples use a Next.js App Router-style project, but the same principles work in Vite, React Router or other React setups. The goal: related code lives close together, shared code has clear boundaries, and imports stay predictable.",
    nl: "React zelf heeft geen mening over mappenstructuur — de docs noemen groeperen per feature/route en groeperen per bestandstype als gangbare opties. Deze post laat een praktische, gekozen stap zien van type-gebaseerde mappen naar een feature-first structuur. De voorbeelden gebruiken een Next.js App Router-project, maar dezelfde principes werken in Vite, React Router of andere React-setups. Het doel: verwante code staat dicht bij elkaar, gedeelde code heeft duidelijke grenzen, en imports blijven voorspelbaar.",
  },
  quote: {
    en: "Your top-level folders should make the product clear, not only the framework behind it.",
    nl: "Je top-level mappen moeten het product duidelijk maken, niet alleen het framework erachter.",
  },
  byTypeTitle: { en: "Why type-based folders break down", nl: "Waarom type-gebaseerde mappen stuklopen" },
  byType1: {
    en: "The default tutorial layout groups files by what they are: every component in components/, every hook in hooks/, every helper in utils/. It looks tidy on day one because each folder is small. But a single feature, such as checkout, ends up spread across all of them.",
    nl: "De standaard tutorial-indeling groepeert bestanden op wát ze zijn: elke component in components/, elke hook in hooks/, elke helper in utils/. Op dag één oogt het netjes omdat elke map klein is. Maar één feature, zoals checkout, raakt over al die mappen verspreid.",
  },
  byTypeAria: {
    en: "Diagram: one feature fans out into separate components, hooks and utils folders",
    nl: "Diagram: één feature waaiert uit naar losse mappen components, hooks en utils",
  },
  byTypeCaption: {
    en: "Type-based: one feature touches many folders, and no folder tells you what the app does.",
    nl: "Type-gebaseerd: één feature raakt veel mappen, en geen enkele map vertelt je wat de app doet.",
  },
  byType2: {
    en: "To change checkout, you open four folders. To delete it, you have to search for leftover files. Worse, nothing in the tree communicates intent. components/ tells a newcomer the project uses components — which they already knew.",
    nl: "Om checkout te wijzigen, open je vier mappen. Om het te verwijderen, moet je zoeken naar achtergebleven bestanden. Erger nog: niets in de boom communiceert intentie. components/ vertelt een nieuwkomer dat het project componenten gebruikt — wat ze al wisten.",
  },
  byTypeWarnTitle: { en: "The smell to watch for", nl: "Het signaal om op te letten" },
  byTypeWarnBody: {
    en: "If implementing one user-facing change means editing files in three or more top-level folders that are named after technical roles (components, hooks, utils, services), your structure is working against your product.",
    nl: "Als één wijziging voor de gebruiker betekent dat je bestanden bewerkt in drie of meer top-level mappen die vernoemd zijn naar technische rollen (components, hooks, utils, services), dan werkt je structuur je product tegen.",
  },
  featureTitle: { en: "Feature-first: group files by product area", nl: "Feature-first: groepeer bestanden per productgebied" },
  feature1: {
    en: "Change the way you group files. Group by feature (a slice of the product) instead of by file type. Everything checkout needs — components, hooks, data access, types — lives in features/checkout/. The folder name is a domain term a product manager would recognize.",
    nl: "Verander hoe je bestanden groepeert. Groepeer per feature (een stuk van het product) in plaats van per bestandstype. Alles wat checkout nodig heeft — componenten, hooks, datatoegang, types — leeft in features/checkout/. De mapnaam is een domeinterm die een productmanager zou herkennen.",
  },
  feature2: {
    en: "Cross-cutting building blocks that several features reuse — a Button, a Modal, a useDebounce hook, money math — stay in a small set of shared folders. The important part is deciding what belongs to one feature and what is truly shared.",
    nl: "Overkoepelende bouwblokken die meerdere features hergebruiken — een Button, een Modal, een useDebounce-hook, geldberekeningen — blijven in een kleine set gedeelde mappen. Het belangrijke is bepalen wat bij één feature hoort en wat echt gedeeld is.",
  },
  feature3: {
    en: "The tree below is one example, not a universal standard. It uses a Next.js App Router-style project; in a Vite or React Router app the same idea applies, but the route folder may be called routes, pages or app depending on your setup.",
    nl: "De boom hieronder is één voorbeeld, geen universele standaard. Hij gebruikt een Next.js App Router-project; in een Vite- of React Router-app geldt hetzelfde idee, maar de route-map heet misschien routes, pages of app, afhankelijk van je setup.",
  },
  featureTreeCaption: {
    en: "Feature-first: each domain is self-contained; shared/lib hold only what is genuinely reused.",
    nl: "Feature-first: elk domein is zelfstandig; shared/lib bevatten alleen wat echt hergebruikt wordt.",
  },
  coloc: { en: "Colocation: keep related files close", nl: "Colocatie: houd verwante bestanden dicht bij elkaar" },
  coloc1: {
    en: "A component's test and Storybook story are part of the component. Put them in the same folder, not in a distant __tests__/ mirror. When you move or delete the component, its test and story move with it. This reduces forgotten test files and outdated stories.",
    nl: "De test en Storybook-story van een component horen bij de component. Zet ze in dezelfde map, niet in een verre __tests__/-spiegel. Verplaats of verwijder je de component, dan gaan de test en story mee. Dit vermindert vergeten testbestanden en verouderde stories.",
  },
  coloc2: {
    en: "I use the same pattern in this site: each component sits next to its test file, and coverage checks help keep that habit consistent.",
    nl: "Ik gebruik hetzelfde patroon in deze site: elke component staat naast zijn testbestand, en coverage-checks helpen die gewoonte consistent te houden.",
  },
  boundaryTitle: { en: "Dependency direction: keep imports predictable", nl: "Afhankelijkheidsrichting: houd imports voorspelbaar" },
  boundary1: {
    en: "Feature folders only help if dependencies flow one way. Pages depend on features; features depend on shared UI and framework-free lib code. Lower-level folders should not import from higher-level folders.",
    nl: "Featuremappen helpen alleen als afhankelijkheden één kant op stromen. Pagina's hangen af van features; features hangen af van gedeelde UI en framework-vrije lib-code. Lagere mappen mogen niet importeren uit hogere mappen.",
  },
  boundaryAria: {
    en: "Layered diagram: routes depend on features, features depend on shared UI and pure lib code",
    nl: "Gelaagd diagram: routes hangen af van features, features hangen af van gedeelde UI en pure lib-code",
  },
  boundaryCaption: {
    en: "Allowed dependency direction: pages → features → shared/lib. Nothing points back up.",
    nl: "Toegestane afhankelijkheidsrichting: pagina's → features → shared/lib. Niets wijst terug omhoog.",
  },
  boundary2: {
    en: "Three concrete rules fall out of that picture:",
    nl: "Uit dat plaatje volgen drie concrete regels:",
  },
  rule1Strong: { en: "Avoid direct feature-to-feature imports.", nl: "Vermijd directe feature-naar-feature-imports." },
  rule1: {
    en: "If two features need the same code, move it to a shared domain module or lib — not into shared just because it is convenient once.",
    nl: "Hebben twee features dezelfde code nodig, verplaats die dan naar een gedeelde domeinmodule of lib — niet naar shared alleen omdat het één keer handig is.",
  },
  rule2Strong: { en: "Shared code stays domain-agnostic.", nl: "Gedeelde code blijft domein-agnostisch." },
  rule2: {
    en: "A Button that knows about checkout is no longer shared. Keep shared code unaware of the domains that use it.",
    nl: "Een Button die van checkout weet, is niet langer gedeeld. Houd gedeelde code onwetend van de domeinen die haar gebruiken.",
  },
  rule3Strong: { en: "Pages stay thin.", nl: "Pagina's blijven dun." },
  rule3: {
    en: "A route file wires features together and reads data; it does not contain business logic. If a page grows past a screen of code, push the logic into a feature.",
    nl: "Een route-bestand knoopt features aan elkaar en leest data; het bevat geen businesslogica. Groeit een pagina voorbij één scherm code, duw de logica dan een feature in.",
  },
  sharedWarnTitle: { en: "Watch the shared folder", nl: "Let op de shared-map" },
  sharedWarnBody: {
    en: "Moving code to shared just because two places use it turns shared into a vague dumping ground. Move code there when it is genuinely cross-cutting and domain-agnostic, not only when it is convenient.",
    nl: "Code naar shared verplaatsen alleen omdat twee plekken het gebruiken, maakt shared een vage stortplaats. Verplaats code daarheen wanneer die echt overkoepelend en domein-agnostisch is, niet alleen wanneer het uitkomt.",
  },
  barrelTitle: { en: "Barrels: expose a small public API", nl: "Barrels: stel een kleine publieke API beschikbaar" },
  barrel1: {
    en: "Each feature exposes a single public API through an index.ts barrel. Consumers import from the front door; the internals behind it can be rearranged without touching a single caller.",
    nl: "Elke feature stelt één publieke API beschikbaar via een index.ts-barrel. Consumenten importeren via de voordeur; de interne code erachter kun je herinrichten zonder ook maar één aanroeper aan te raken.",
  },
  barrelTipTitle: { en: "Keep barrels small and explicit", nl: "Houd barrels klein en expliciet" },
  barrelTipBody: {
    en: "Re-export only a feature's public API. Large barrels, export *, and side-effectful modules can make the dependency graph harder to follow and may reduce tree-shaking effectiveness, depending on your bundler. A barrel should be a small public API, not a list of every file in the folder.",
    nl: "Her-exporteer alleen de publieke API van een feature. Grote barrels, export * en side-effect-modules kunnen de afhankelijkheidsgraaf lastiger te volgen maken en de tree-shaking minder effectief, afhankelijk van je bundler. Een barrel hoort een kleine publieke API te zijn, geen lijst van elk bestand in de map.",
  },
  aliasTitle: { en: "Path aliases: avoid long relative imports", nl: "Path-aliassen: vermijd lange relatieve imports" },
  alias1: {
    en: "Relative import chains break the moment you move a file. Configure an @/ alias to your src root so imports are absolute and refactor-friendly.",
    nl: "Relatieve importketens breken zodra je een bestand verplaatst. Configureer een @/-alias naar je src-root zodat imports absoluut en refactor-vriendelijk zijn.",
  },
  alias2: {
    en: "In Next.js, this tsconfig.json is enough. In Vite, also configure resolve.alias in vite.config.ts (or use a plugin that reads TypeScript paths).",
    nl: "In Next.js is deze tsconfig.json genoeg. In Vite configureer je ook resolve.alias in vite.config.ts (of gebruik je een plugin die de TypeScript-paths leest).",
  },
  alias3: {
    en: "With stable aliases, many refactors become smaller, because imports do not depend on the current file's depth. The same path means the same thing from anywhere:",
    nl: "Met stabiele aliassen worden veel refactors kleiner, omdat imports niet afhangen van de diepte van het huidige bestand. Hetzelfde pad betekent overal hetzelfde:",
  },
  checklistTitle: { en: "Checklist before you merge", nl: "Checklist voordat je merget" },
  checklist1: {
    en: "Before merging, run the layout past five questions:",
    nl: "Loop de indeling vóór het mergen langs vijf vragen:",
  },
  check1: {
    en: "Can a newcomer name what the app does from the top-level folders alone?",
    nl: "Kan een nieuwkomer benoemen wat de app doet, alleen op basis van de top-level mappen?",
  },
  check2: {
    en: "Does one product change live in one folder?",
    nl: "Leeft één productwijziging in één map?",
  },
  check3: {
    en: "Do dependencies flow one way (pages → features → shared/lib), with no feature importing another?",
    nl: "Stromen afhankelijkheden één kant op (pagina's → features → shared/lib), zonder dat een feature een andere importeert?",
  },
  check4: {
    en: "Does every feature expose a small barrel, and do consumers import only from it?",
    nl: "Stelt elke feature een kleine barrel beschikbaar, en importeren consumenten alleen daaruit?",
  },
  check5: {
    en: "Are tests and stories colocated with the code they cover?",
    nl: "Staan tests en stories gecolokeerd bij de code die ze dekken?",
  },
  outro1: {
    en: "A scalable folder structure does not need many rules. It needs a few rules that the team follows consistently.",
    nl: "Een schaalbare mappenstructuur heeft niet veel regels nodig. Ze heeft een paar regels nodig die het team consistent volgt.",
  },
  outro2: {
    en: "Group product code by feature. Keep truly shared code in clear shared folders. Colocate tests and stories with the code they cover. Make dependency direction explicit, and expose each feature through a small public API.",
    nl: "Groepeer productcode per feature. Houd echt gedeelde code in duidelijke gedeelde mappen. Coloceer tests en stories bij de code die ze dekken. Maak de afhankelijkheidsrichting expliciet, en stel elke feature beschikbaar via een kleine publieke API.",
  },
  outro3: {
    en: "When this works, the codebase becomes easier to navigate. New files have an obvious home, old features are easier to remove, and imports stay readable as the project grows.",
    nl: "Als dit werkt, wordt de codebase makkelijker te navigeren. Nieuwe bestanden hebben een vanzelfsprekende plek, oude features zijn makkelijker te verwijderen, en imports blijven leesbaar naarmate het project groeit.",
  },
  // File-tree comments (localized)
  treeApp: { en: "routes only — thin pages", nl: "alleen routes — dunne pagina's" },
  treeFeatures: { en: "one folder per domain", nl: "één map per domein" },
  treeApi: { en: "data access", nl: "datatoegang" },
  treeBarrel: { en: "public API (barrel)", nl: "publieke API (barrel)" },
  treeCatalog: { en: "same shape", nl: "zelfde vorm" },
  treeShared: { en: "SHARED ui only", nl: "alleen GEDEELDE ui" },
  treeSharedHooks: { en: "shared hooks", nl: "gedeelde hooks" },
  treeLib: { en: "framework-free logic", nl: "framework-vrije logica" },
  // Code samples keyed by locale
  colocationCode: { en: COLOCATION_CODE_EN, nl: COLOCATION_CODE_NL },
  barrelCode: { en: BARREL_CODE_EN, nl: BARREL_CODE_NL },
  pageCode: { en: PAGE_CODE_EN, nl: PAGE_CODE_NL },
} as const;
