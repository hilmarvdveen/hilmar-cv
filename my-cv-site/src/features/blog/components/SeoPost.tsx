import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, H3, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "100-percent-seo-score-and-what-actually-ranks",
  category: "seo",
  publishedDate: "2026-06-24",
  updatedDate: "2026-06-28",
  readingTimeMin: 15,
  title: {
    en: "Technical SEO in Next.js: from a 100% Lighthouse score to better Search",
    nl: "Technische SEO in Next.js: van 100% Lighthouse-score naar betere Search",
  },
  description: {
    en: "How to set up the Lighthouse SEO basics with Next.js metadata, robots and sitemaps. Then improve the page further with structured data, hreflang and Core Web Vitals.",
    nl: "Hoe je de Lighthouse SEO-basis goed zet met Next.js-metadata, robots en sitemaps. Daarna verbeter je je pagina verder met structured data, hreflang en Core Web Vitals.",
  },
  excerpt: {
    en: "A 100% Lighthouse SEO score is a technical baseline, not a ranking guarantee. Here is how to pass it in Next.js, then go further with structured data, hreflang and Core Web Vitals.",
    nl: "Een 100% Lighthouse SEO-score is een technische basis, geen rankinggarantie. Zo haal je hem in Next.js, en ga je daarna verder met structured data, hreflang en Core Web Vitals.",
  },
  keywords: [
    "lighthouse seo score",
    "next.js metadata api",
    "structured data json-ld",
    "hreflang multilingual seo",
    "core web vitals page experience",
    "technical seo checklist",
  ],
};

// A clean linear chain, stacked top-to-bottom so it stays readable on narrow
// screens. Structured data and Core Web Vitals are side factors described in
// the caption rather than drawn as crossing side-inputs.
const pipelineNodes = [
  flowNode("sitemap", "sitemap.xml", { x: 0, y: 0 }, { tone: "violet", sub: "discovery", dir: "TB", width: 190 }),
  flowNode("crawl", "Crawl", { x: 0, y: 110 }, { tone: "blue", dir: "TB", width: 190 }),
  flowNode("render", "Render", { x: 0, y: 220 }, { tone: "blue", sub: "JS executed", dir: "TB", width: 190 }),
  flowNode("index", "Index", { x: 0, y: 330 }, { tone: "emerald", dir: "TB", width: 190 }),
  flowNode("rank", "Rank", { x: 0, y: 440 }, { tone: "amber", sub: "results page", dir: "TB", width: 190 }),
];
const pipelineEdges = [
  flowEdge("sitemap", "crawl"),
  flowEdge("crawl", "render"),
  flowEdge("render", "index"),
  flowEdge("index", "rank"),
];

const sourcesNodes = [
  flowNode("meta", "generateMetadata()", { x: 0, y: 0 }, { tone: "blue", sub: "title · description · canonical", dir: "TB", width: 240 }),
  flowNode("jsonld", "JSON-LD", { x: -200, y: 120 }, { tone: "rose", sub: "BlogPosting, Person…", dir: "TB", width: 180 }),
  flowNode("robots", "robots.txt", { x: 0, y: 120 }, { tone: "violet", sub: "crawl rules", dir: "TB", width: 160 }),
  flowNode("alt", "hreflang", { x: 190, y: 120 }, { tone: "emerald", sub: "nl ⇄ en", dir: "TB", width: 160 }),
  flowNode("serp", "Search result", { x: 0, y: 240 }, { tone: "amber", sub: "title, snippet, rich result", dir: "TB", width: 240 }),
];
const sourcesEdges = [
  flowEdge("meta", "serp"),
  flowEdge("jsonld", "serp", { dashed: true }),
  flowEdge("robots", "serp", { dashed: true }),
  flowEdge("alt", "serp", { dashed: true }),
];

export function Body({ locale }: { locale: Locale }) {
  const c = COPY;
  return (
    <>
      <Lead>{c.lead[locale]}</Lead>
      <P>{c.intro1[locale]}</P>
      <P>{c.intro2[locale]}</P>
      <Quote>{c.quote[locale]}</Quote>

      <H2>{c.lhTitle[locale]}</H2>
      <P>{c.lh1[locale]}</P>
      <UL>
        <LI>{c.lhi1[locale]}</LI>
        <LI>{c.lhi2[locale]}</LI>
        <LI>{c.lhi3[locale]}</LI>
        <LI>{c.lhi4[locale]}</LI>
      </UL>
      <Callout variant="info" title={c.fontNoteTitle[locale]}>
        {c.fontNoteBody[locale]}
      </Callout>
      <P>{c.lh2[locale]}</P>
      <CodeBlock lang="tsx" filename="app/[locale]/blog/[slug]/page.tsx" code={c.metadataCode[locale]} />
      <Callout variant="success" title={c.lhDoneTitle[locale]}>
        {c.lhDoneBody[locale]}
      </Callout>

      <H2>{c.beyondTitle[locale]}</H2>
      <P>{c.beyond1[locale]}</P>
      <FlowDiagram
        nodes={pipelineNodes}
        edges={pipelineEdges}
        height={520}
        ariaLabel={c.pipelineAria[locale]}
        caption={c.pipelineCaption[locale]}
      />
      <P>{c.beyond2[locale]}</P>

      <H2>{c.semanticTitle[locale]}</H2>
      <P>{c.semantic1[locale]}</P>
      <CodeBlock lang="html" code={c.semanticCode[locale]} />
      <Callout variant="warning" title={c.semanticWarnTitle[locale]}>
        {c.semanticWarnBody[locale]}
      </Callout>

      <H2>{c.crawlTitle[locale]}</H2>
      <P>{c.crawl1[locale]}</P>
      <CodeBlock lang="text" filename="robots.txt" code={ROBOTS_CODE} />
      <P>{c.crawl2[locale]}</P>
      <CodeBlock lang="xml" filename="sitemap.xml" code={SITEMAP_CODE} />

      <Divider />

      <H2>{c.sdTitle[locale]}</H2>
      <P>{c.sd1[locale]}</P>
      <FlowDiagram
        nodes={sourcesNodes}
        edges={sourcesEdges}
        height={360}
        ariaLabel={c.sourcesAria[locale]}
        caption={c.sourcesCaption[locale]}
      />
      <P>{c.sd2[locale]}</P>
      <CodeBlock lang="json" filename="JSON-LD: BlogPosting" code={JSONLD_CODE} />
      <Callout variant="info" title={c.sdInfoTitle[locale]}>
        {c.sdInfoBody[locale]}
      </Callout>

      <H3>{c.hreflangTitle[locale]}</H3>
      <P>{c.hreflang1[locale]}</P>
      <CodeBlock lang="html" code={HREFLANG_CODE} />
      <Callout variant="tip" title={c.hreflangTipTitle[locale]}>
        {c.hreflangTipBody[locale]}
      </Callout>

      <H2>{c.cwvTitle[locale]}</H2>
      <P>{c.cwv1[locale]}</P>
      <UL>
        <LI><Strong>LCP</Strong> {c.cwvLcp[locale]}</LI>
        <LI><Strong>INP</Strong> {c.cwvInp[locale]}</LI>
        <LI><Strong>CLS</Strong> {c.cwvCls[locale]}</LI>
      </UL>

      <H2>{c.checklistTitle[locale]}</H2>
      <OL>
        <LI>{c.ck1[locale]}</LI>
        <LI>{c.ck2[locale]}</LI>
        <LI>{c.ck3[locale]}</LI>
        <LI>{c.ck4[locale]}</LI>
        <LI>{c.ck5[locale]}</LI>
        <LI>{c.ck6[locale]}</LI>
      </OL>
      <P>{c.outro1[locale]}</P>
      <P>{c.outro2[locale]}</P>
    </>
  );
}

// ── Code samples ─────────────────────────────────────────────────────────────
// Metadata + semantic markup carry teaching comments, so they are translated.
const METADATA_CODE_EN = `import type { Metadata } from "next";

// Page metadata only. robots.txt and sitemap.xml are separate file
// conventions: app/robots.ts and app/sitemap.ts.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "React Folder Structure That Scales",
    description:
      "How to organize a React project so it stays navigable at 10 files and at 1,000.",
    alternates: {
      canonical: "https://example.com/en/blog/react-folder-structure",
      languages: {
        en: "https://example.com/en/blog/react-folder-structure",
        nl: "https://example.com/nl/blog/react-folder-structure",
      },
    },
    robots: { index: true, follow: true },
  };
}`;

const METADATA_CODE_NL = `import type { Metadata } from "next";

// Alleen pagina-metadata. robots.txt en sitemap.xml zijn aparte file
// conventions: app/robots.ts en app/sitemap.ts.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "React Folder Structure That Scales",
    description:
      "How to organize a React project so it stays navigable at 10 files and at 1,000.",
    alternates: {
      canonical: "https://example.com/en/blog/react-folder-structure",
      languages: {
        en: "https://example.com/en/blog/react-folder-structure",
        nl: "https://example.com/nl/blog/react-folder-structure",
      },
    },
    robots: { index: true, follow: true },
  };
}`;

const SEMANTIC_CODE_EN = `<!-- One h1 per page; headings nest and never skip a level. -->
<main>
  <h1>React Folder Structure That Scales</h1>
  <article>
    <h2>Why organizing by type breaks down</h2>
    <h3>The smell to watch for</h3>
    <h2>Feature-first</h2>
  </article>
</main>`;

const SEMANTIC_CODE_NL = `<!-- Eén h1 per pagina; koppen nesten en slaan nooit een niveau over. -->
<main>
  <h1>React Folder Structure That Scales</h1>
  <article>
    <h2>Why organizing by type breaks down</h2>
    <h3>The smell to watch for</h3>
    <h2>Feature-first</h2>
  </article>
</main>`;

// robots/sitemap/JSON-LD/hreflang are language-neutral (the prose explains them).
const ROBOTS_CODE = `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`;

const SITEMAP_CODE = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/en/blog/react-folder-structure</loc>
    <lastmod>2026-06-10</lastmod>
    <xhtml:link rel="alternate" hreflang="en"
      href="https://example.com/en/blog/react-folder-structure" />
    <xhtml:link rel="alternate" hreflang="nl"
      href="https://example.com/nl/blog/react-folder-structure" />
  </url>
  <url>
    <loc>https://example.com/nl/blog/react-folder-structure</loc>
    <lastmod>2026-06-10</lastmod>
    <xhtml:link rel="alternate" hreflang="en"
      href="https://example.com/en/blog/react-folder-structure" />
    <xhtml:link rel="alternate" hreflang="nl"
      href="https://example.com/nl/blog/react-folder-structure" />
  </url>
</urlset>`;

const JSONLD_CODE = `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "React Folder Structure That Scales",
  "image": "https://example.com/images/og/react-folder-structure.png",
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-12",
  "inLanguage": "en",
  "author": { "@type": "Person", "name": "Hilmar van der Veen" },
  "publisher": {
    "@type": "Organization",
    "name": "Hilmar van der Veen",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/images/logo.png"
    }
  },
  "mainEntityOfPage": "https://example.com/en/blog/react-folder-structure"
}`;

const HREFLANG_CODE = `<link rel="alternate" hreflang="en" href="https://example.com/en/blog/x" />
<link rel="alternate" hreflang="nl" href="https://example.com/nl/blog/x" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/x" />`;

// ── Bilingual copy ────────────────────────────────────────────────────────────
const COPY = {
  lead: {
    en: "A 100% Lighthouse SEO score is useful, but limited. Lighthouse mainly checks whether your page is technically easy to crawl, index and understand: a good title, a meta description, crawlable links, robots rules, canonical links and hreflang.",
    nl: "Een 100% Lighthouse SEO-score is nuttig, maar beperkt. Lighthouse controleert vooral of je pagina technisch goed te crawlen, te indexeren en te begrijpen is: een goede title, een meta description, crawlbare links, robots-regels, canonical en hreflang.",
  },
  intro1: {
    en: "That is an important baseline, but it does not automatically mean your page will rank well. For that, Google also needs to understand your content, your language versions need to be correct, and the page needs to be fast and stable on real devices.",
    nl: "Dat is een belangrijke basis, maar het betekent niet automatisch dat je pagina hoog rankt. Daarvoor moet Google je content goed begrijpen, moeten je taalversies kloppen en moet de pagina snel en stabiel werken op echte apparaten.",
  },
  intro2: {
    en: "In this post, you first set up the Lighthouse SEO basics in a Next.js App Router project. After that, you go further with structured data, hreflang, sitemaps and Core Web Vitals: the parts that make your page stronger in Search.",
    nl: "In deze post zet je eerst de Lighthouse SEO-basis goed in een Next.js App Router-project. Daarna ga je verder met structured data, hreflang, sitemaps en Core Web Vitals: onderdelen die je pagina sterker maken in Search.",
  },
  quote: {
    en: "A green audit is the starting point, not the final goal.",
    nl: "Een groene audit is het beginpunt, niet het einddoel.",
  },
  lhTitle: { en: "What Lighthouse SEO checks", nl: "Wat Lighthouse SEO controleert" },
  lh1: {
    en: "The audit is a set of technical baseline checks. The exact set changes between Lighthouse versions, but the important ones are stable:",
    nl: "De audit is een set technische basischecks. De exacte set verandert per Lighthouse-versie, maar de belangrijkste blijven gelijk:",
  },
  lhi1: {
    en: "A non-empty, unique <title> and a meta description on every page.",
    nl: "Een niet-lege, unieke <title> en een meta description op elke pagina.",
  },
  lhi2: {
    en: "A valid, non-blocking robots.txt and an HTTP 200 status.",
    nl: "Een geldige, niet-blokkerende robots.txt en een HTTP 200-status.",
  },
  lhi3: {
    en: "Crawlable links: real href anchors, not click handlers on divs.",
    nl: "Crawlbare links: echte href-ankers, geen click-handlers op divs.",
  },
  lhi4: {
    en: "A valid hreflang and a rel=canonical.",
    nl: "Een geldige hreflang en een rel=canonical.",
  },
  fontNoteTitle: { en: "Not an SEO check anymore", nl: "Niet meer een SEO-check" },
  fontNoteBody: {
    en: "Older guides list legible font sizes and tap-target sizes here. Recent Lighthouse versions removed the font-size SEO audit and handle tap targets separately. They still matter — but for UX and accessibility, not the SEO score.",
    nl: "Oudere gidsen noemen hier leesbare lettergroottes en tikdoelen. Recente Lighthouse-versies hebben de font-size SEO-audit verwijderd en behandelen tikdoelen apart. Ze blijven belangrijk — maar voor UX en toegankelijkheid, niet voor de SEO-score.",
  },
  lh2: {
    en: "In a Next.js App Router project, you manage much of the page metadata through the Metadata API. A single generateMetadata export covers title, description, canonical and language alternates. For robots.txt and sitemap.xml you use separate file conventions like app/robots.ts and app/sitemap.ts.",
    nl: "In een Next.js App Router-project regel je veel pagina-metadata via de Metadata API. Eén generateMetadata-export dekt title, description, canonical en taalalternatieven. Voor robots.txt en sitemap.xml gebruik je aparte file conventions zoals app/robots.ts en app/sitemap.ts.",
  },
  lhDoneTitle: { en: "An important part of the baseline", nl: "Een belangrijk deel van de basis" },
  lhDoneBody: {
    en: "With this, you cover an important part of technical SEO. Then check the rest: crawlable links, robots rules, canonical, hreflang and the final Lighthouse output.",
    nl: "Daarmee dek je een belangrijk deel van de technische SEO-basis. Controleer daarna de rest: crawlbare links, robots-regels, canonical, hreflang en de uiteindelijke Lighthouse-output.",
  },
  beyondTitle: {
    en: "Beyond Lighthouse: how Google processes your page",
    nl: "Voorbij Lighthouse: hoe Google je pagina verwerkt",
  },
  beyond1: {
    en: "Ranking starts with a technical chain. A crawler discovers your URL (ideally from a sitemap), renders it — running your JavaScript — indexes the result, and only then ranks it. Structured data helps Google understand the page better. Core Web Vitals show how well the page performs for users.",
    nl: "Ranking begint met een technische keten. Een crawler ontdekt je URL (idealiter uit een sitemap), rendert die — jouw JavaScript draaiend — indexeert het resultaat en rankt het pas daarna. Structured data helpt Google de pagina beter te begrijpen. Core Web Vitals laten zien hoe goed de pagina presteert voor gebruikers.",
  },
  pipelineAria: {
    en: "Pipeline diagram: sitemap, then crawl, render, index and rank",
    nl: "Pijplijn-diagram: sitemap, dan crawl, render, index en rank",
  },
  pipelineCaption: {
    en: "Something can go wrong at each step. A sitemap helps discovery; structured data adds context; Core Web Vitals reflect page experience.",
    nl: "In elke stap kan iets misgaan. Een sitemap helpt ontdekking; structured data geeft context; Core Web Vitals weerspiegelen de page experience.",
  },
  beyond2: {
    en: "Because Google renders JavaScript, a client-only React app can be indexed — but rendering can be queued, so it may take longer. Server-rendered or static HTML is faster to crawl and prevents many bugs where content only becomes visible after JavaScript runs. This blog is server-rendered for that reason.",
    nl: "Omdat Google JavaScript rendert, kan een client-only React-app geïndexeerd worden — maar rendering kan in de wachtrij komen, dus het kan langer duren. Server-gerenderde of statische HTML is sneller te crawlen en voorkomt veel bugs waarbij content pas zichtbaar wordt na JavaScript-uitvoering. Deze blog is om die reden server-gerenderd.",
  },
  semanticTitle: { en: "Semantic HTML and clear headings", nl: "Semantische HTML en duidelijke koppen" },
  semantic1: {
    en: "Crawlers read structure, not just text. Use one h1 that states the page topic, then nest h2/h3 without skipping levels. Wrap the main content in <main>, articles in <article>, navigation in <nav>. Accessible markup helps users and search engines understand the page better.",
    nl: "Crawlers lezen structuur, niet alleen tekst. Gebruik één h1 die het paginaonderwerp benoemt, en nest daarna h2/h3 zonder niveaus over te slaan. Verpak de hoofdinhoud in <main>, artikelen in <article>, navigatie in <nav>. Toegankelijke markup helpt gebruikers én zoekmachines de pagina beter begrijpen.",
  },
  semanticWarnTitle: { en: "The most common heading bug", nl: "De meest voorkomende kopbug" },
  semanticWarnBody: {
    en: "Multiple h1s, or jumping from h1 to h3 because h3 'looked the right size'. Style with classes; structure with heading levels — never the other way around.",
    nl: "Meerdere h1's, of springen van h1 naar h3 omdat h3 'de juiste grootte leek'. Stijl met classes; structureer met kopniveaus — nooit andersom.",
  },
  crawlTitle: { en: "Crawlability with robots.txt and sitemaps", nl: "Crawlbaarheid met robots.txt en sitemaps" },
  crawl1: {
    en: "Tell crawlers which parts they may visit and where your sitemap is located. A robots.txt that allows everything and points to your sitemap is enough for most sites. In Next.js, app/robots.ts generates this file.",
    nl: "Vertel crawlers welke delen ze mogen bezoeken en waar je sitemap staat. Een robots.txt die alles toestaat en naar je sitemap verwijst, is genoeg voor de meeste sites. In Next.js genereert app/robots.ts dit bestand.",
  },
  crawl2: {
    en: "The sitemap lists every canonical URL and declares its language alternates, so Google groups the nl and en versions instead of treating them as duplicates. Each language URL gets its own <url> entry that lists all alternates, including itself. Add a <lastmod> only when it reflects a real, significant update — Google trusts it only if it is consistently accurate.",
    nl: "De sitemap somt elke canonieke URL op en declareert de taalalternatieven, zodat Google de nl- en en-versies groepeert in plaats van ze als duplicaten te zien. Elke taal-URL krijgt een eigen <url>-entry die alle alternatieven opsomt, inclusief zichzelf. Voeg een <lastmod> alleen toe als die een echte, belangrijke wijziging weergeeft — Google vertrouwt die alleen als hij consistent klopt.",
  },
  sdTitle: { en: "Structured data: give Google extra context", nl: "Structured data: geef Google extra context" },
  sd1: {
    en: "Your title, description, canonical, robots rules and language alternates all shape one search result. Structured data (JSON-LD) adds machine-readable context — author, dates, breadcrumbs — that can make a richer result possible.",
    nl: "Je title, description, canonical, robots-regels en taalalternatieven vormen samen één zoekresultaat. Structured data (JSON-LD) voegt machineleesbare context toe — auteur, datums, broodkruimels — die een rijker resultaat mogelijk kan maken.",
  },
  sourcesAria: {
    en: "Diagram: generateMetadata, JSON-LD, robots and hreflang all feed the search result",
    nl: "Diagram: generateMetadata, JSON-LD, robots en hreflang voeden allemaal het zoekresultaat",
  },
  sourcesCaption: {
    en: "Four independent signals shape one search result. JSON-LD can make rich results possible.",
    nl: "Vier onafhankelijke signalen vormen één zoekresultaat. JSON-LD kan rich results mogelijk maken.",
  },
  sd2: {
    en: "For an article, the BlogPosting type tells Google the headline, author, publisher, dates and image. Add as many relevant properties as you can — especially image, author, datePublished and dateModified. This site generates it from a typed SEO engine, and a test suite keeps it valid.",
    nl: "Voor een artikel vertelt het BlogPosting-type Google de kop, auteur, uitgever, datums en afbeelding. Voeg zoveel mogelijk relevante properties toe — vooral image, author, datePublished en dateModified. Deze site genereert het uit een getypte SEO-engine, en een testsuite houdt het geldig.",
  },
  sdInfoTitle: { en: "Validate, don't guess", nl: "Valideer, gok niet" },
  sdInfoBody: {
    en: "Run every JSON-LD block through Google's Rich Results Test and the Schema.org validator. Invalid structured data can be ignored or become ineligible for rich results — and it fails silently.",
    nl: "Haal elk JSON-LD-blok door Google's Rich Results Test en de Schema.org-validator. Ongeldige structured data kan worden genegeerd of niet in aanmerking komen voor rich results — en dat gebeurt stilletjes.",
  },
  hreflangTitle: { en: "hreflang for Dutch and English pages", nl: "hreflang voor Nederlandse en Engelse pagina’s" },
  hreflang1: {
    en: "When the same content exists in Dutch and English, hreflang tells Google they are translations, not duplicates, and which to show to whom. Make the tags reciprocal: every version points to every other, including itself. Add an x-default when you have a clear fallback or language-selector page.",
    nl: "Wanneer dezelfde content in het Nederlands en Engels bestaat, vertelt hreflang Google dat het vertalingen zijn, geen duplicaten, en welke aan wie te tonen. Maak de tags wederkerig: elke versie verwijst naar elke andere, inclusief zichzelf. Voeg een x-default toe als je een duidelijke fallback- of taalselectiepagina hebt.",
  },
  hreflangTipTitle: { en: "Pick one hreflang method", nl: "Kies één hreflang-methode" },
  hreflangTipBody: {
    en: "Google treats HTML tags, HTTP headers and sitemap entries as equivalent ways to declare hreflang. Pick one. Using all three at once gives no extra Search benefit and is harder to maintain.",
    nl: "Google ziet HTML-tags, HTTP-headers en sitemap-entries als gelijkwaardige manieren om hreflang te declareren. Kies er één. Alle drie tegelijk gebruiken geeft geen extra Search-voordeel en maakt het onderhoud lastiger.",
  },
  cwvTitle: { en: "Core Web Vitals and page experience", nl: "Core Web Vitals en page experience" },
  cwv1: {
    en: "Speed and stability are part of Google's page-experience signals, which align with its ranking systems. They are not a magic ranking lever, but a slow or unstable page works against you. Three metrics matter:",
    nl: "Snelheid en stabiliteit horen bij Google's page-experience-signalen, die aansluiten op de ranking-systemen. Het is geen magische rankingknop, maar een trage of onstabiele pagina werkt tegen je. Drie metrieken tellen:",
  },
  cwvLcp: {
    en: "(Largest Contentful Paint) — the main content is visible within 2.5s. Optimize images and server response.",
    nl: "(Largest Contentful Paint) — de hoofdinhoud is zichtbaar binnen 2,5s. Optimaliseer afbeeldingen en serverrespons.",
  },
  cwvInp: {
    en: "(Interaction to Next Paint) — the page responds to input within 200ms. Keep the main thread free.",
    nl: "(Interaction to Next Paint) — de pagina reageert op input binnen 200ms. Houd de main thread vrij.",
  },
  cwvCls: {
    en: "(Cumulative Layout Shift) — nothing jumps while loading. Reserve space for images, fonts and embeds.",
    nl: "(Cumulative Layout Shift) — niets springt tijdens het laden. Reserveer ruimte voor afbeeldingen, fonts en embeds.",
  },
  checklistTitle: { en: "Checklist for technical SEO in Next.js", nl: "Checklist voor technische SEO in Next.js" },
  ck1: {
    en: "Unique title + meta description per page, via generateMetadata.",
    nl: "Unieke title + meta description per pagina, via generateMetadata.",
  },
  ck2: {
    en: "One h1, correctly nested headings, semantic landmarks.",
    nl: "Eén h1, correct geneste koppen, semantische landmarks.",
  },
  ck3: {
    en: "robots.txt + sitemap.xml (app/robots.ts, app/sitemap.ts) with hreflang alternates.",
    nl: "robots.txt + sitemap.xml (app/robots.ts, app/sitemap.ts) met hreflang-alternatieven.",
  },
  ck4: {
    en: "Valid JSON-LD (BlogPosting/Person/Breadcrumb), checked in the Rich Results Test.",
    nl: "Geldige JSON-LD (BlogPosting/Person/Breadcrumb), gecontroleerd in de Rich Results Test.",
  },
  ck5: {
    en: "Reciprocal hreflang, one declaration method, x-default only where it fits.",
    nl: "Wederkerige hreflang, één declaratiemethode, x-default alleen waar het past.",
  },
  ck6: {
    en: "Good Core Web Vitals (LCP, INP, CLS) on real user data.",
    nl: "Goede Core Web Vitals (LCP, INP, CLS) op echte gebruikersdata.",
  },
  outro1: {
    en: "A green Lighthouse SEO score is a good first step: it shows your page has no obvious technical SEO blockers. But it is not a ranking guarantee.",
    nl: "Een groene Lighthouse SEO-score is een goede eerste stap: hij laat zien dat je pagina geen duidelijke technische SEO-blokkades heeft. Maar het is geen rankinggarantie.",
  },
  outro2: {
    en: "The real value comes from the combination: clear metadata, crawlable HTML, a reliable sitemap, correct hreflang, valid structured data and good Core Web Vitals on real user data. Use Lighthouse as the gate check, then use Search Console, the Rich Results Test and performance data to keep improving.",
    nl: "De echte waarde zit in de combinatie: duidelijke metadata, crawlbare HTML, een betrouwbare sitemap, correcte hreflang, geldige structured data en goede Core Web Vitals op echte gebruikersdata. Gebruik Lighthouse als check aan de poort, en daarna Search Console, de Rich Results Test en performance-data om te blijven verbeteren.",
  },
  // Code samples keyed by locale
  metadataCode: { en: METADATA_CODE_EN, nl: METADATA_CODE_NL },
  semanticCode: { en: SEMANTIC_CODE_EN, nl: SEMANTIC_CODE_NL },
} as const;
