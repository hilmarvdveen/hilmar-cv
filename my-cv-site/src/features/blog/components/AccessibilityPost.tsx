import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "wcag-aa-in-the-component",
  category: "accessibility",
  track: "frontend",
  publishedDate: "2026-09-06",
  readingTimeMin: 16,
  title: {
    en: "WCAG 2.2 AA in the component, not in an audit at the end",
    nl: "WCAG 2.2 AA in het component, niet in een audit achteraf",
  },
  description: {
    en: "Name, role, state, focus, target size and contrast belong in a component while it is built. What axe catches, what it never will, and the pipeline step.",
    nl: "Naam, rol, toestand, focus, klikoppervlak en contrast horen in een component tijdens het bouwen. Wat axe vindt, wat het nooit ziet, en de stap in de pipeline.",
  },
  excerpt: {
    en: "An accessibility finding is cheap while the component is still on your screen. These are the six questions I answer inside a component, the two drawings I use to explain them, and the check that keeps the answers true after the handover.",
    nl: "Een toegankelijkheidsbevinding is goedkoop zolang het component nog op je scherm staat. Dit zijn de zes vragen die ik in een component beantwoord, de twee tekeningen waarmee ik ze uitleg, en de controle die de antwoorden waar houdt na de overdracht.",
  },
  keywords: [
    "wcag 2.2 aa components",
    "accessible name computation",
    "focus visible outline offset",
    "target size minimum 24 pixels",
    "aria live status region",
    "axe testing library component test",
    "accessibility check in the pipeline",
  ],
};

function buildAnnouncementDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("element", "<button>", { x: 0, y: 20 }, { tone: "slate", subtitle: copy.nodeElementSub[locale], width: 200 }),
    flowNode("label", copy.nodeLabel[locale], { x: 0, y: 150 }, { tone: "slate", subtitle: copy.nodeLabelSub[locale], width: 200 }),
    flowNode("attribute", "aria-expanded", { x: 0, y: 280 }, { tone: "slate", subtitle: copy.nodeAttributeSub[locale], width: 200 }),
    flowNode("role", copy.nodeRole[locale], { x: 300, y: 20 }, { tone: "violet", subtitle: copy.nodeRoleSub[locale], width: 220 }),
    flowNode("name", copy.nodeName[locale], { x: 300, y: 150 }, { tone: "emerald", subtitle: copy.nodeNameSub[locale], width: 220 }),
    flowNode("state", copy.nodeState[locale], { x: 300, y: 280 }, { tone: "amber", subtitle: copy.nodeStateSub[locale], width: 220 }),
    flowNode("announced", copy.nodeAnnounced[locale], { x: 620, y: 150 }, { tone: "blue", subtitle: copy.nodeAnnouncedSub[locale], width: 260 }),
  ];
  const edges = [
    flowEdge("element", "role"),
    flowEdge("label", "name"),
    flowEdge("attribute", "state"),
    flowEdge("role", "announced"),
    flowEdge("name", "announced"),
    flowEdge("state", "announced"),
  ];
  return { nodes, edges };
}

function buildFocusOrderDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("nameField", copy.nodeNameField[locale], { x: 0, y: 20 }, { tone: "slate", subtitle: copy.nodeFirstInOrder[locale], width: 190 }),
    flowNode("emailField", copy.nodeEmailField[locale], { x: 240, y: 20 }, { tone: "slate", subtitle: copy.nodeNextInOrder[locale], width: 190 }),
    flowNode("trigger", copy.nodeTrigger[locale], { x: 480, y: 20 }, { tone: "violet", subtitle: copy.nodeTriggerSub[locale], width: 220 }),
    flowNode("dialog", copy.nodeDialog[locale], { x: 760, y: 20 }, { tone: "amber", subtitle: copy.nodeDialogSub[locale], width: 230 }),
    flowNode("escape", copy.nodeEscape[locale], { x: 760, y: 190 }, { tone: "rose", subtitle: copy.nodeEscapeSub[locale], direction: "TB", width: 230 }),
    flowNode("send", copy.nodeSend[locale], { x: 480, y: 190 }, { tone: "emerald", subtitle: copy.nodeSendSub[locale], width: 220 }),
  ];
  const edges = [
    flowEdge("nameField", "emailField"),
    flowEdge("emailField", "trigger"),
    flowEdge("trigger", "dialog", { label: copy.edgeOpens[locale] }),
    flowEdge("dialog", "escape", { dashed: true, label: copy.edgeEscapeKey[locale] }),
    flowEdge("escape", "send", { label: copy.edgeOrderContinues[locale] }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const announcement = buildAnnouncementDiagram(locale);
  const focusOrder = buildFocusOrderDiagram(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.lateTitle[locale],
          copy.asksTitle[locale],
          copy.versionTitle[locale],
          copy.focusTitle[locale],
          copy.namesTitle[locale],
          copy.stateTitle[locale],
          copy.targetTitle[locale],
          copy.contrastTitle[locale],
          copy.testingTitle[locale],
          copy.pipelineTitle[locale],
          copy.handoverTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.lateTitle[locale]}</H2>
      <P>{copy.late1[locale]}</P>
      <P>{copy.late2[locale]}</P>
      <P>{copy.late3[locale]}</P>

      <H2>{copy.asksTitle[locale]}</H2>
      <P>{copy.asks1[locale]}</P>
      <UL>
        <LI><Strong>{copy.askNameLabel[locale]}</Strong> {copy.askNameBody[locale]}</LI>
        <LI><Strong>{copy.askRoleLabel[locale]}</Strong> {copy.askRoleBody[locale]}</LI>
        <LI><Strong>{copy.askStateLabel[locale]}</Strong> {copy.askStateBody[locale]}</LI>
        <LI><Strong>{copy.askFocusLabel[locale]}</Strong> {copy.askFocusBody[locale]}</LI>
        <LI><Strong>{copy.askOperationLabel[locale]}</Strong> {copy.askOperationBody[locale]}</LI>
        <LI><Strong>{copy.askContrastLabel[locale]}</Strong> {copy.askContrastBody[locale]}</LI>
      </UL>
      <P>{copy.asks2[locale]}</P>
      <P>{copy.asks3[locale]}</P>

      <H2>{copy.versionTitle[locale]}</H2>
      <P>{copy.version1[locale]}</P>
      <UL>
        <LI><Strong>{copy.criterionObscuredLabel[locale]}</Strong> {copy.criterionObscuredBody[locale]}</LI>
        <LI><Strong>{copy.criterionDraggingLabel[locale]}</Strong> {copy.criterionDraggingBody[locale]}</LI>
        <LI><Strong>{copy.criterionTargetLabel[locale]}</Strong> {copy.criterionTargetBody[locale]}</LI>
        <LI><Strong>{copy.criterionHelpLabel[locale]}</Strong> {copy.criterionHelpBody[locale]}</LI>
        <LI><Strong>{copy.criterionEntryLabel[locale]}</Strong> {copy.criterionEntryBody[locale]}</LI>
        <LI><Strong>{copy.criterionAuthLabel[locale]}</Strong> {copy.criterionAuthBody[locale]}</LI>
      </UL>
      <P>{copy.version2[locale]}</P>
      <P>{copy.version3[locale]}</P>
      <Callout variant="warning" title={copy.obscuredNoteTitle[locale]}>
        {copy.obscuredNoteBody[locale]}
      </Callout>

      <H2>{copy.focusTitle[locale]}</H2>
      <P>{copy.focus1[locale]}</P>
      <CodeBlock lang="css" filename="styles/focus.css" code={FOCUS_RING_CODE} />
      <P>{copy.focus2[locale]}</P>
      <P>{copy.focus3[locale]}</P>
      <FlowDiagram
        nodes={focusOrder.nodes}
        edges={focusOrder.edges}
        height={380}
        ariaLabel={copy.focusOrderAria[locale]}
        caption={copy.focusOrderCaption[locale]}
      />
      <P>{copy.focus4[locale]}</P>
      <P>{copy.focus5[locale]}</P>

      <H2>{copy.namesTitle[locale]}</H2>
      <P>{copy.names1[locale]}</P>
      <FlowDiagram
        nodes={announcement.nodes}
        edges={announcement.edges}
        height={400}
        ariaLabel={copy.announcementAria[locale]}
        caption={copy.announcementCaption[locale]}
      />
      <P>{copy.names2[locale]}</P>
      <P>{copy.names3[locale]}</P>
      <CodeBlock lang="tsx" filename="components/FilterToggle.tsx" code={WRONG_NAME_CODE} />
      <P>{copy.names4[locale]}</P>
      <CodeBlock lang="tsx" filename="components/FilterToggle.tsx" code={CORRECT_NAME_CODE} />
      <P>{copy.names5[locale]}</P>
      <P>{copy.names6[locale]}</P>

      <H2>{copy.stateTitle[locale]}</H2>
      <P>{copy.state1[locale]}</P>
      <UL>
        <LI><Strong>{copy.stateExpandedLabel[locale]}</Strong> {copy.stateExpandedBody[locale]}</LI>
        <LI><Strong>{copy.stateSelectedLabel[locale]}</Strong> {copy.stateSelectedBody[locale]}</LI>
        <LI><Strong>{copy.stateCurrentLabel[locale]}</Strong> {copy.stateCurrentBody[locale]}</LI>
        <LI><Strong>{copy.stateInvalidLabel[locale]}</Strong> {copy.stateInvalidBody[locale]}</LI>
        <LI><Strong>{copy.stateDisabledLabel[locale]}</Strong> {copy.stateDisabledBody[locale]}</LI>
      </UL>
      <P>{copy.state2[locale]}</P>
      <P>{copy.state3[locale]}</P>
      <CodeBlock lang="tsx" filename="components/SaveStatus.tsx" code={STATUS_REGION_CODE} />
      <P>{copy.state4[locale]}</P>

      <H2>{copy.targetTitle[locale]}</H2>
      <P>{copy.target1[locale]}</P>
      <UL>
        <LI><Strong>{copy.exceptionSpacingLabel[locale]}</Strong> {copy.exceptionSpacingBody[locale]}</LI>
        <LI><Strong>{copy.exceptionInlineLabel[locale]}</Strong> {copy.exceptionInlineBody[locale]}</LI>
        <LI><Strong>{copy.exceptionAgentLabel[locale]}</Strong> {copy.exceptionAgentBody[locale]}</LI>
        <LI><Strong>{copy.exceptionEssentialLabel[locale]}</Strong> {copy.exceptionEssentialBody[locale]}</LI>
      </UL>
      <P>{copy.target2[locale]}</P>
      <P>{copy.target3[locale]}</P>
      <P>{copy.target4[locale]}</P>

      <H2>{copy.contrastTitle[locale]}</H2>
      <P>{copy.contrast1[locale]}</P>
      <P>{copy.contrast2[locale]}</P>
      <P>{copy.contrast3[locale]}</P>

      <Divider />

      <H2>{copy.testingTitle[locale]}</H2>
      <P>{copy.testing1[locale]}</P>
      <P>{copy.testing2[locale]}</P>
      <P>{copy.testing3[locale]}</P>
      <CodeBlock lang="tsx" filename="components/FilterToggle.test.tsx" code={AXE_TEST_CODE} />
      <P>{copy.testing4[locale]}</P>
      <P>{copy.testing5[locale]}</P>

      <H2>{copy.pipelineTitle[locale]}</H2>
      <P>{copy.pipeline1[locale]}</P>
      <CodeBlock lang="yaml" filename=".gitlab-ci.yml" code={PIPELINE_CODE} />
      <P>{copy.pipeline2[locale]}</P>
      <P>{copy.pipeline3[locale]}</P>
      <Callout variant="tip" title={copy.baselineNoteTitle[locale]}>
        {copy.baselineNoteBody[locale]}
      </Callout>

      <H2>{copy.handoverTitle[locale]}</H2>
      <P>{copy.handover1[locale]}</P>
      <P>{copy.handover2[locale]}</P>
      <P>{copy.handover3[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
      <P>{copy.close3[locale]}</P>
    </>
  );
}

const FOCUS_RING_CODE = `:root {
  --focus-ring-color: #047857;
  --focus-ring-color-on-dark: #6ee7b7;
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
}

.filter-toggle:focus-visible,
.field input:focus-visible,
.field select:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: 4px;
}

.hero-band a:focus-visible {
  outline-color: var(--focus-ring-color-on-dark);
}

@media (forced-colors: active) {
  .filter-toggle:focus-visible,
  .field input:focus-visible,
  .field select:focus-visible {
    outline-color: Highlight;
  }
}`;

const WRONG_NAME_CODE = `import { SlidersIcon } from "./icons";

type FilterToggleProps = {
  open: boolean;
  onToggle: () => void;
};

export function FilterToggle({ open, onToggle }: FilterToggleProps) {
  return (
    <div className={open ? "filter-toggle is-open" : "filter-toggle"} onClick={onToggle}>
      <SlidersIcon />
    </div>
  );
}`;

const CORRECT_NAME_CODE = `import { SlidersIcon } from "./icons";

type FilterToggleProps = {
  expanded: boolean;
  controlsId: string;
  label: string;
  onToggle: () => void;
};

export function FilterToggle({ expanded, controlsId, label, onToggle }: FilterToggleProps) {
  return (
    <button
      type="button"
      className="filter-toggle"
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      <SlidersIcon aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}`;

const STATUS_REGION_CODE = `type SaveState = "idle" | "saving" | "saved" | "failed";

type SaveStatusProps = {
  state: SaveState;
  messages: Record<SaveState, string>;
};

export function SaveStatus({ state, messages }: SaveStatusProps) {
  return (
    <p role="status" aria-live="polite" className="save-status">
      {state === "idle" ? "" : messages[state]}
    </p>
  );
}`;

const AXE_TEST_CODE = `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FilterToggle } from "./FilterToggle";

describe("FilterToggle", () => {
  it("carries the visible label as its accessible name", () => {
    render(
      <FilterToggle expanded={false} controlsId="filters" label="Show filters" onToggle={() => {}} />
    );

    const toggle = screen.getByRole("button", { name: "Show filters" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "filters");
  });

  it("reports no violations in either state", async () => {
    const { container, rerender } = render(
      <FilterToggle expanded={false} controlsId="filters" label="Show filters" onToggle={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <FilterToggle expanded controlsId="filters" label="Show filters" onToggle={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});`;

const PIPELINE_CODE = `stages:
  - test

accessibility:
  stage: test
  image: node:22
  script:
    - corepack enable
    - pnpm install --frozen-lockfile
    - pnpm test:accessibility
    - pnpm build
    - pnpm exec playwright test --project=accessibility
  artifacts:
    when: always
    expire_in: 30 days
    paths:
      - reports/accessibility
  rules:
    - if: $CI_MERGE_REQUEST_IID
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "An accessibility audit at the end of a project produces a list. Every item on it is a change to a component that is already finished, already tested and already in use on pages other people own.",
    nl: "Een toegankelijkheidsaudit aan het eind van een project levert een lijst op. Elk punt erop is een wijziging in een component dat al af is, al getest is en al in gebruik is op pagina's van anderen.",
  },
  intro1: {
    en: "Accessibility is part of building a component in my work. At bol.com the components I hand over follow WCAG 2.2 AA. At the Belastingdienst, the Nationale Postcode Loterij and Athlon the level was WCAG 2.1 AA, and at the Belastingdienst it was verified with automated tests in the pipeline.",
    nl: "Toegankelijkheid hoort bij het bouwen van een component. Bij bol.com volgen de componenten die ik overdraag WCAG 2.2 AA. Bij de Belastingdienst, de Nationale Postcode Loterij en Athlon was het niveau WCAG 2.1 AA, en bij de Belastingdienst werd dat geborgd met geautomatiseerde tests in de pipeline.",
  },
  intro2: {
    en: "This article is what I do inside a component to get there. Name, role, state, focus, operation and contrast. Checked on 6 September 2026 against WCAG 2.2, the W3C Recommendation published in October 2023.",
    nl: "Dit artikel beschrijft wat ik daarvoor in een component doe. Naam, rol, toestand, focus, bediening en contrast. Gecontroleerd op 6 september 2026 tegen WCAG 2.2, de W3C-aanbeveling uit oktober 2023.",
  },
  quote: {
    en: "A component that is accessible on the day it is written costs a few extra lines. The same component made accessible a year later costs a regression test on every page that adopted it.",
    nl: "Een component dat toegankelijk is op de dag dat je het schrijft, kost een paar regels extra. Datzelfde component een jaar later toegankelijk maken kost een regressietest op elke pagina die het heeft overgenomen.",
  },
  lateTitle: {
    en: "Why the audit at the end is the expensive way",
    nl: "Waarom een audit achteraf de dure route is",
  },
  late1: {
    en: "The findings are accurate. What makes them expensive is when they arrive. A button with no accessible name is a five-minute change while the button is on your screen. Six months later it sits in every page that adopted it, and two teams have to agree on a release.",
    nl: "De bevindingen kloppen. Wat ze duur maakt is het moment waarop ze binnenkomen. Een knop zonder toegankelijke naam is een wijziging van vijf minuten zolang die knop op je scherm staat. Een halfjaar later zit hij in elke pagina die hem overnam, en moeten twee teams het eens worden over een release.",
  },
  late2: {
    en: "A report is a list of violations, and not a list of decisions. Somebody still has to work out whether a dialog holds focus, where focus goes when it closes, and what the close button is called. Those are design questions.",
    nl: "Een rapport is een lijst met afwijkingen, en geen lijst met beslissingen. Iemand moet nog steeds bepalen of een dialoog de focus vasthoudt, waar de focus heen gaat bij het sluiten, en hoe de sluitknop heet. Dat zijn ontwerpvragen.",
  },
  late3: {
    en: "At the Nationale Postcode Loterij accessibility to WCAG 2.1 AA sits inside the components themselves, so a campaign page inherits it. At Athlon the component library gives every screen the same accessible markup. The level lives in the parts, and a page built from those parts starts there.",
    nl: "Bij de Nationale Postcode Loterij zit toegankelijkheid tot WCAG 2.1 AA in de componenten zelf, dus een campagnepagina neemt het over. Bij Athlon geeft de componentbibliotheek elk scherm dezelfde toegankelijke markup. Het niveau zit in de onderdelen, en een pagina die daaruit is opgebouwd begint daar.",
  },
  asksTitle: {
    en: "What AA actually asks of a component",
    nl: "Wat AA echt van een component vraagt",
  },
  asks1: {
    en: "WCAG is written for a whole page, so most criteria read as statements about a document. A component is not a document. Translate the criteria into questions one component can answer on its own, and six of them cover almost everything a component owns.",
    nl: "WCAG is geschreven voor een hele pagina, dus de meeste criteria lezen als uitspraken over een document. Een component is geen document. Vertaal de criteria naar vragen die een component zelf kan beantwoorden, en zes daarvan dekken bijna alles wat een component in handen heeft.",
  },
  askNameLabel: { en: "Name.", nl: "Naam." },
  askNameBody: {
    en: "Does every control have a name that gets read out, and is that name the visible label?",
    nl: "Heeft elk element een naam die wordt voorgelezen, en is die naam het zichtbare label?",
  },
  askRoleLabel: { en: "Role.", nl: "Rol." },
  askRoleBody: {
    en: "Does the markup say what the thing is, so a button is a button and a heading is a heading?",
    nl: "Zegt de markup wat het ding is, zodat een knop een knop is en een kop een kop?",
  },
  askStateLabel: { en: "State.", nl: "Toestand." },
  askStateBody: {
    en: "Is every state the component can be in expressed in an attribute, and not only in the styling?",
    nl: "Staat elke toestand die het component kan hebben in een attribuut, en niet alleen in de opmaak?",
  },
  askFocusLabel: { en: "Focus.", nl: "Focus." },
  askFocusBody: {
    en: "Can focus reach every control, is it visible when it lands, and can it leave again?",
    nl: "Kan de focus elk element bereiken, is hij zichtbaar als hij landt, en kan hij er weer weg?",
  },
  askOperationLabel: { en: "Operation.", nl: "Bediening." },
  askOperationBody: {
    en: "Does everything a pointer can do have a keyboard path, and does nothing depend on dragging alone?",
    nl: "Heeft alles wat met een muis kan ook een route via het toetsenbord, en hangt niets af van slepen alleen?",
  },
  askContrastLabel: { en: "Contrast.", nl: "Contrast." },
  askContrastBody: {
    en: "Do the text and the parts that carry meaning meet the ratio in every state?",
    nl: "Halen de tekst en de onderdelen die betekenis dragen de verhouding in elke toestand?",
  },
  asks2: {
    en: "The page keeps the rest. Language, page title, landmarks, heading order and skip links live above the component and belong to whoever assembles the page. The written handover is where that gets said.",
    nl: "De pagina houdt de rest. Taal, paginatitel, landmarks, kopvolgorde en skiplinks zitten boven het component en horen bij degene die de pagina samenstelt. De schriftelijke overdracht is de plek waar dat staat.",
  },
  asks3: {
    en: "That split makes the component check cheap. At bol.com every page I build carries unit tests, GraphQL mocks and a Storybook story per scenario. A story per scenario is an accessibility artefact too, because each state with a story is a state somebody can put a keyboard on.",
    nl: "Die verdeling maakt de controle op componentniveau goedkoop. Bij bol.com heeft elke pagina die ik bouw unittests, GraphQL-mocks en een Storybook-story per scenario. Zo'n story is ook een toegankelijkheidsartefact, want elke toestand met een story is een toestand waar iemand een toetsenbord op kan zetten.",
  },
  versionTitle: {
    en: "What changed between 2.1 and 2.2",
    nl: "Wat er veranderde tussen 2.1 en 2.2",
  },
  version1: {
    en: "WCAG 2.2 became a W3C Recommendation in October 2023. It builds on 2.1 and removes one criterion. At level A and AA, six criteria are new.",
    nl: "WCAG 2.2 werd in oktober 2023 een W3C-aanbeveling. De versie bouwt voort op 2.1 en haalt er een criterium uit. Op niveau A en AA zijn zes criteria nieuw.",
  },
  criterionObscuredLabel: { en: "2.4.11 Focus Not Obscured (Minimum), AA.", nl: "2.4.11 Focus Not Obscured (Minimum), AA." },
  criterionObscuredBody: {
    en: "An element with focus is not entirely hidden by content the page put on top of it. Sticky headers and bottom bars are where this shows up.",
    nl: "Een element met focus wordt niet volledig bedekt door inhoud die de pagina eroverheen legt. Vastgezette headers en balken onderaan zijn de plekken waar dit speelt.",
  },
  criterionDraggingLabel: { en: "2.5.7 Dragging Movements, AA.", nl: "2.5.7 Dragging Movements, AA." },
  criterionDraggingBody: {
    en: "Anything you can do by dragging can also be done with a single pointer action.",
    nl: "Alles wat je met slepen kunt doen, kan ook met een enkele aanwijzeractie.",
  },
  criterionTargetLabel: { en: "2.5.8 Target Size (Minimum), AA.", nl: "2.5.8 Target Size (Minimum), AA." },
  criterionTargetBody: {
    en: "A target measures at least 24 by 24 CSS pixels, with exceptions for spacing, for targets inline in a sentence, for targets the user agent draws, and for targets where the size is essential.",
    nl: "Een doel meet minstens 24 bij 24 CSS-pixels, met uitzonderingen voor onderlinge afstand, voor doelen in een lopende zin, voor doelen die de browser zelf tekent, en voor doelen waarbij de grootte essentieel is.",
  },
  criterionHelpLabel: { en: "3.2.6 Consistent Help, A.", nl: "3.2.6 Consistent Help, A." },
  criterionHelpBody: {
    en: "A help mechanism that appears on several pages appears in the same relative place on each.",
    nl: "Een hulpmiddel dat op meerdere pagina's staat, staat op elke pagina op dezelfde relatieve plek.",
  },
  criterionEntryLabel: { en: "3.3.7 Redundant Entry, A.", nl: "3.3.7 Redundant Entry, A." },
  criterionEntryBody: {
    en: "Information the user already entered in a process is available again, prefilled or offered for selection.",
    nl: "Gegevens die iemand eerder in hetzelfde proces invulde, komen opnieuw beschikbaar, vooringevuld of als keuze.",
  },
  criterionAuthLabel: { en: "3.3.8 Accessible Authentication (Minimum), AA.", nl: "3.3.8 Accessible Authentication (Minimum), AA." },
  criterionAuthBody: {
    en: "A login does not require a cognitive function test such as remembering or transcribing, unless an alternative or a supporting mechanism is there. Letting a password manager paste into the field belongs here.",
    nl: "Inloggen vraagt geen cognitieve test zoals onthouden of overtypen, tenzij er een alternatief of hulpmechanisme is. Een wachtwoordmanager in het veld laten plakken hoort hierbij.",
  },
  version2: {
    en: "Two criteria about focus appearance are AAA and sit outside an AA commitment. 2.4.12 Focus Not Obscured (Enhanced) and 2.4.13 Focus Appearance. 4.1.1 Parsing was removed, so duplicate identifiers and unclosed tags stay worth fixing and are no longer a WCAG failure.",
    nl: "Twee criteria over hoe focus eruitziet zijn AAA en vallen buiten een AA-belofte. 2.4.12 Focus Not Obscured (Enhanced) en 2.4.13 Focus Appearance. 4.1.1 Parsing is vervallen, dus dubbele identifiers en niet-gesloten tags blijven het oplossen waard en zijn geen WCAG-afwijking meer.",
  },
  version3: {
    en: "For a component library the weight sits in three of the new criteria. Target size, dragging and focus not being obscured are the ones a component can be built to satisfy. The other three belong to a flow, so they go into the handover as page-level requirements.",
    nl: "Voor een componentbibliotheek zit het gewicht in drie van de nieuwe criteria. Doelgrootte, slepen en focus die niet bedekt wordt zijn de drie waar je een component op kunt bouwen. De andere drie horen bij een flow, dus die gaan als pagina-eisen mee in de overdracht.",
  },
  obscuredNoteTitle: {
    en: "The sticky bar is where 2.4.11 fails",
    nl: "De vastgezette balk is waar 2.4.11 sneuvelt",
  },
  obscuredNoteBody: {
    en: "A fixed header or a fixed bottom bar can cover the element that just received focus, and the component that owns the element cannot see it happening. Check the criterion on the assembled page, and have every fixed element publish its measured height so the page can reserve the space.",
    nl: "Een vastgezette header of een vastgezette balk onderaan kan het element bedekken dat net focus kreeg, en het component zelf merkt daar niets van. Controleer dit criterium op de samengestelde pagina, en laat elk vastgezet element zijn gemeten hoogte publiceren zodat de pagina de ruimte kan vrijhouden.",
  },
  focusTitle: {
    en: "Focus: visible, ordered, and never lost",
    nl: "Focus: zichtbaar, op volgorde en nooit kwijt",
  },
  focus1: {
    en: "Visible is the easiest of the three focus questions and the one most often traded away in a design review. The rule that survives that conversation uses :focus-visible with an outline and an offset. The ring appears for a keyboard user and stays away from a mouse click on a button.",
    nl: "Zichtbaar is de makkelijkste van de drie focusvragen en de vraag die het vaakst sneuvelt in een ontwerpreview. De regel die dat gesprek overleeft gebruikt :focus-visible met een outline en een offset. De ring verschijnt voor wie het toetsenbord gebruikt en blijft weg bij een muisklik op een knop.",
  },
  focus2: {
    en: "A focus indicator carries meaning, so 1.4.11 applies and it needs at least 3:1 against what sits behind it. This site uses one focus style everywhere, with one exception. On the navy hero band the darker green disappears, so links there take a lighter green.",
    nl: "Een focusindicator draagt betekenis, dus 1.4.11 geldt en hij heeft minstens 3:1 nodig ten opzichte van wat erachter ligt. Deze site gebruikt overal dezelfde focusstijl, met een uitzondering. Op de donkerblauwe herobalk verdwijnt de donkergroene ring, dus krijgen links daar een lichtere tint groen.",
  },
  focus3: {
    en: "The focus order is the DOM order until something changes it. Flexbox order, grid placement and absolute positioning move a control visually while it keeps its place in the sequence. Reorder the markup and let the layout follow.",
    nl: "De focusvolgorde is de DOM-volgorde, totdat iets die volgorde verandert. De order-eigenschap in flexbox, plaatsing in een grid en absolute positionering verplaatsen een element visueel terwijl het zijn plek in de reeks houdt. Herorden de markup en laat de opmaak volgen.",
  },
  focus4: {
    en: "The third question is whether focus can get out. A dialog holding focus is doing its job while it is open. What matters is where focus lands when it closes. It goes back to the control that opened it, and that one line decides whether the dialog works.",
    nl: "De derde vraag is of de focus er weer uit kan. Een dialoog die de focus vasthoudt doet zijn werk zolang hij open staat. Wat telt is waar de focus landt bij het sluiten. Hij gaat terug naar het element dat hem opende, en die ene regel bepaalt of de dialoog werkt.",
  },
  focus5: {
    en: "Removing something that has focus has the same shape. Delete a row and the button inside it goes too, so focus falls to the document body. Move it to the next row first. At bol.com keyboard focus management in real flows is part of what I hand over.",
    nl: "Iets weghalen dat focus heeft, heeft dezelfde vorm. Verwijder een rij en de knop erin gaat mee, dus valt de focus terug op de body. Verplaats hem eerst naar de volgende rij. Bij bol.com hoort focusbeheer met het toetsenbord in echte flows bij wat ik overdraag.",
  },
  namesTitle: {
    en: "Names: what a screen reader reads out",
    nl: "Namen: wat een schermlezer voorleest",
  },
  names1: {
    en: "A screen reader announces three things about a control. Its name, its role and its state. Each comes from a different part of the markup, so it is easy to get one right and lose another.",
    nl: "Een schermlezer kondigt drie dingen aan over een element. De naam, de rol en de toestand. Ze komen elk uit een ander deel van de markup, dus het is makkelijk om er een goed te krijgen en ondertussen een andere te verliezen.",
  },
  names2: {
    en: "The name goes wrong most often, because a name is computed and not declared. The browser works through an order of precedence. First aria-labelledby, then aria-label, then the element's own content, then fallbacks such as title. The first non-empty string wins and the rest are ignored.",
    nl: "De naam gaat het vaakst mis, omdat een naam wordt berekend en niet opgegeven. De browser werkt een voorrangsvolgorde af. Eerst aria-labelledby, dan aria-label, dan de eigen inhoud van het element, dan terugvalopties zoals title. De eerste niet-lege tekst wint en de rest wordt genegeerd.",
  },
  names3: {
    en: "That is why an aria-label on a button with visible text deserves a second look. The label wins, so the visible text is no longer the name, and somebody using voice control addresses a name the control does not have. The criterion called Label in Name is why the accessible name should contain the visible label. The component below looks finished and has no name at all.",
    nl: "Daarom verdient een aria-label op een knop met zichtbare tekst een tweede blik. Het label wint, dus de zichtbare tekst is niet langer de naam, en wie met spraakbediening werkt spreekt een naam aan die het element niet heeft. Het criterium Label in Name is de reden dat de toegankelijke naam het zichtbare label moet bevatten. Het component hieronder ziet er af uit en heeft geen naam.",
  },
  names4: {
    en: "Three things are wrong and none shows in a screenshot. A div has no role. A click handler on a div never receives focus. The icon is the only content, so the name computation has nothing to work with.",
    nl: "Er zijn drie dingen mis en geen ervan is te zien op een schermafbeelding. Een div heeft geen rol. Een klikafhandelaar op een div krijgt nooit focus. Het icoon is de enige inhoud, dus de naamberekening heeft niets om mee te werken.",
  },
  names5: {
    en: "Now the visible text is the name, the icon is hidden from the accessibility tree, aria-expanded carries the state and aria-controls names the region. The button element brings the role, the keyboard behaviour and the focus.",
    nl: "Nu is de zichtbare tekst de naam, is het icoon verborgen voor de toegankelijkheidsboom, draagt aria-expanded de toestand en noemt aria-controls het gebied. Het button-element brengt de rol, het toetsenbordgedrag en de focus.",
  },
  names6: {
    en: "At the Belastingdienst the Bold design system shipped as Stencil web components used inside Angular, React and Vue. A name computed in a shared component has to hold in all three. I wrote the wrappers and the documentation that make that explicit.",
    nl: "Bij de Belastingdienst kwam het Bold-designsysteem als Stencil-webcomponenten die in Angular, React en Vue werden gebruikt. Een naam die in een gedeeld component wordt berekend, moet in alle drie standhouden. Ik schreef de wrappers en de documentatie die dat expliciet maken.",
  },
  stateTitle: {
    en: "State: what changes and how it is announced",
    nl: "Toestand: wat verandert en hoe dat wordt aangekondigd",
  },
  state1: {
    en: "A state that only exists in a class name does not exist for a screen reader. Names like is-open and is-invalid are hooks for the styling. The accessibility tree reads attributes, and the mapping is short enough to learn once.",
    nl: "Een toestand die alleen in een klassenaam bestaat, bestaat niet voor een schermlezer. Namen als is-open en is-invalid zijn haakjes voor de opmaak. De toegankelijkheidsboom leest attributen, en die lijst is kort genoeg om een keer te leren.",
  },
  stateExpandedLabel: { en: "aria-expanded", nl: "aria-expanded" },
  stateExpandedBody: {
    en: "sits on the control that opens a region, on the control and never on the region.",
    nl: "staat op het element dat een gebied opent, op het element en nooit op het gebied.",
  },
  stateSelectedLabel: { en: "aria-selected, aria-checked, aria-pressed", nl: "aria-selected, aria-checked, aria-pressed" },
  stateSelectedBody: {
    en: "carry selection in a tab list, the checked state of a checkbox pattern, and the on position of a toggle button.",
    nl: "dragen de selectie in een tablijst, de aangevinkte stand van een checkboxpatroon, en de aan-stand van een schakelknop.",
  },
  stateCurrentLabel: { en: "aria-current", nl: "aria-current" },
  stateCurrentBody: {
    en: "marks the item in a set that is the current page, step or date.",
    nl: "markeert het item in een reeks dat de huidige pagina, stap of datum is.",
  },
  stateInvalidLabel: { en: "aria-invalid with aria-describedby", nl: "aria-invalid met aria-describedby" },
  stateInvalidBody: {
    en: "marks a field that failed validation and points at the message that explains it.",
    nl: "markeert een veld dat de validatie niet haalde en wijst naar de melding die dat uitlegt.",
  },
  stateDisabledLabel: { en: "aria-disabled or the disabled attribute", nl: "aria-disabled of het disabled-attribuut" },
  stateDisabledBody: {
    en: "is a choice, and it is the one worth a paragraph of its own.",
    nl: "is een keuze, en die verdient een eigen alinea.",
  },
  state2: {
    en: "A disabled button leaves the focus order, so somebody tabbing through a form never learns it is there. aria-disabled keeps it reachable and announced as unavailable, and the handler checks the state before it acts. On a submit button that waits for a valid form, that usually reads better.",
    nl: "Een knop met disabled verdwijnt uit de focusvolgorde, dus wie door een formulier tabt ontdekt nooit dat hij er is. Met aria-disabled blijft hij bereikbaar en wordt hij aangekondigd als niet beschikbaar, en de afhandelaar controleert de toestand voordat hij iets doet. Bij een verzendknop die op een geldig formulier wacht leest dat meestal beter.",
  },
  state3: {
    en: "Then there is the state that arrives later. An async result is a change the reader did not cause, so it has to be announced. A live region does that, and it has one rule that catches people out. The region has to exist before the message arrives.",
    nl: "Daarnaast is er de toestand die later binnenkomt. Een asynchroon resultaat is een verandering die de lezer niet zelf veroorzaakte, dus die moet worden aangekondigd. Een live region doet dat, en die heeft een regel waar mensen over struikelen. Het gebied moet er al zijn voordat de melding komt.",
  },
  state4: {
    en: "The role status carries an implicit polite live region, and writing both is harmless and clearer. Polite waits for a pause, assertive interrupts, and interrupting suits a failure that stops the flow. At bol.com the promotion-code flow gives every backend outcome its own message, so a customer never sees a generic error. A reader who hears what went wrong knows what to do next.",
    nl: "De rol status draagt impliciet een polite live region, en ze allebei uitschrijven is onschadelijk en duidelijker. Polite wacht op een pauze, assertive onderbreekt, en onderbreken past bij een fout die de flow stopzet. Bij bol.com krijgt elke uitkomst van de backend in de flow met kortingscodes een eigen melding, zodat een klant nooit een algemene foutmelding ziet. Wie hoort wat er misging, weet wat de volgende stap is.",
  },
  targetTitle: {
    en: "Target size and the things people click with",
    nl: "Klikoppervlak en waar mensen mee klikken",
  },
  target1: {
    en: "2.5.8 Target Size (Minimum) is new in 2.2 and it is the criterion most likely to touch an existing design. A target measures at least 24 by 24 CSS pixels. The exceptions matter as much as the rule.",
    nl: "2.5.8 Target Size (Minimum) is nieuw in 2.2 en het is het criterium dat het vaakst aan een bestaand ontwerp raakt. Een doel meet minstens 24 bij 24 CSS-pixels. De uitzonderingen tellen net zo zwaar als de regel.",
  },
  exceptionSpacingLabel: { en: "Spacing.", nl: "Onderlinge afstand." },
  exceptionSpacingBody: {
    en: "A smaller target passes when a 24 by 24 circle centred on it does not overlap the circle of another target.",
    nl: "Een kleiner doel voldoet als een cirkel van 24 bij 24 met dat doel als middelpunt de cirkel van een ander doel niet overlapt.",
  },
  exceptionInlineLabel: { en: "Inline.", nl: "In de zin." },
  exceptionInlineBody: {
    en: "A link inside a sentence is exempt, because the sentence around it sets its size.",
    nl: "Een link in een lopende zin valt buiten de eis, omdat de zin eromheen de grootte bepaalt.",
  },
  exceptionAgentLabel: { en: "User agent.", nl: "Browser." },
  exceptionAgentBody: {
    en: "A control the browser sizes and the page does not restyle is exempt.",
    nl: "Een element waarvan de browser de grootte bepaalt en dat de pagina niet opnieuw opmaakt, valt buiten de eis.",
  },
  exceptionEssentialLabel: { en: "Essential.", nl: "Essentieel." },
  exceptionEssentialBody: {
    en: "When the exact position is the point, as with a pin on a map, the size can be essential.",
    nl: "Als de precieze positie het doel is, zoals bij een speld op een kaart, kan de grootte essentieel zijn.",
  },
  target2: {
    en: "The pattern that fails most often is a small text link standing on its own. A back link above a form. A change link beside a summary row. Padding on the link with a negative margin of the same size grows the target and leaves the layout where it was.",
    nl: "Het patroon dat het vaakst sneuvelt is een kleine tekstlink die alleen staat. Een teruglink boven een formulier. Een wijziglink naast een samenvattingsregel. Padding op de link met een negatieve marge van dezelfde maat vergroot het doel en laat de opmaak staan.",
  },
  target3: {
    en: "Every standalone text link on this site got that treatment. Two of the three advisories from that pass have since been applied: the resting borders of the day and time buttons in the booking flow now meet 3:1, and the links inside the mobile drawer share the focus ring. The one that stays open is the credentials line under the hero, which meets AA and not AAA, and that is a choice, written down with its reason.",
    nl: "Elke losstaande tekstlink op deze site kreeg die behandeling. Twee van de drie adviespunten uit die ronde zijn inmiddels toegepast: de rustranden van de dag- en tijdknoppen in het boekingsproces halen nu 3:1, en de links binnen het mobiele menu delen de focusring. Wat openstaat is de regel met bedrijfsgegevens onder de hero, die AA haalt en geen AAA, en dat is een keuze, opgeschreven met de reden.",
  },
  target4: {
    en: "Two neighbours belong here. 2.5.7 asks that a drag interaction have a single pointer alternative, so a sortable list needs move up and move down controls and a slider needs the arrow keys. And a control that acts on the press event gives nobody a way to abort.",
    nl: "Twee buren horen hier direct naast. 2.5.7 vraagt dat een sleepinteractie een alternatief met een enkele aanwijzeractie heeft, dus een sorteerbare lijst heeft knoppen voor omhoog en omlaag nodig en een schuifregelaar de pijltoetsen. En een element dat reageert op het indrukken geeft niemand de kans om af te breken.",
  },
  contrastTitle: {
    en: "Colour and contrast without a redesign",
    nl: "Kleur en contrast zonder herontwerp",
  },
  contrast1: {
    en: "Contrast at AA has two numbers. Text needs 4.5:1 against its background. Large text needs 3:1, where large means at least 18pt, or 14pt bold. Non-text elements that carry meaning need 3:1 as well, which is 1.4.11, and that covers input borders, focus indicators and an icon that is the only label.",
    nl: "Contrast op AA heeft twee getallen. Tekst heeft 4,5:1 nodig ten opzichte van de achtergrond. Grote tekst heeft 3:1 nodig, waarbij groot minstens 18pt betekent, of 14pt vet. Niet-tekstuele onderdelen die betekenis dragen hebben ook 3:1 nodig, en dat is 1.4.11. Daaronder vallen randen van invoervelden, focusindicatoren en een icoon dat het enige label is.",
  },
  contrast2: {
    en: "Most failures are one step of grey. A placeholder a couple of shades too light. An input border chosen to be quiet. Moving a grey one step darker in the palette changes every place it is used and leaves the layout untouched, which is the argument that wins with a designer. On this site the placeholder grey and the input border grey both moved.",
    nl: "De meeste afwijkingen zijn een stap grijs. Een placeholder die een paar tinten te licht staat. Een veldrand die rustig moest zijn. Een grijstint in het palet een stap donkerder zetten verandert elke plek waar hij wordt gebruikt en laat de opmaak staan, en dat is het argument dat een ontwerper overtuigt. Op deze site gingen het grijs van de placeholders en dat van de veldranden allebei mee.",
  },
  contrast3: {
    en: "Two things are easy to forget. Every state needs the ratio, hover, focus and selected included. And colour alone may not carry information, so a required field marked only in red needs a second signal. At the Nationale Postcode Loterij colours change per label while the component logic stays the same, which puts the contrast question on the theme.",
    nl: "Twee dingen worden makkelijk vergeten. Elke toestand heeft de verhouding nodig, hover, focus en geselecteerd meegerekend. En kleur alleen mag geen informatie dragen, dus een verplicht veld dat alleen rood is heeft een tweede signaal nodig. Bij de Nationale Postcode Loterij veranderen kleuren per label terwijl de logica van een component hetzelfde blijft, en daarmee verhuist de contrastvraag naar het thema.",
  },
  testingTitle: {
    en: "Testing: what a machine catches and what it never will",
    nl: "Testen: wat een machine vindt en wat nooit",
  },
  testing1: {
    en: "The axe engine checks what a rule can decide from the DOM and the computed styles. Missing names, invalid ARIA values, contrast on solid backgrounds, form fields with no label. It finds a portion of the issues on a page, the same way every time.",
    nl: "De axe-engine controleert wat een regel kan afleiden uit de DOM en de berekende stijlen. Ontbrekende namen, ongeldige ARIA-waarden, contrast op effen achtergronden, invoervelden zonder label. Hij vindt een deel van de problemen op een pagina, elke keer op dezelfde manier.",
  },
  testing2: {
    en: "What it cannot decide is anything that needs to know what the page means. Whether the alternative text describes the image. Whether the focus order matches the reading order. Whether the name on the button describes what the button does.",
    nl: "Wat hij niet kan bepalen is alles waarvoor je moet weten wat de pagina betekent. Of de alternatieve tekst het beeld beschrijft. Of de focusvolgorde overeenkomt met de leesvolgorde. Of de naam op de knop beschrijft wat de knop doet.",
  },
  testing3: {
    en: "So the engine goes in the test and the judgement goes in the review. In a component test it runs against the rendered container, in every state the component has.",
    nl: "Dus de engine gaat de test in en het oordeel gaat de review in. In een componenttest draait hij op de gerenderde container, in elke toestand die het component kent.",
  },
  testing4: {
    en: "The two tests do different jobs. The violations check is the machine's portion. The query by role and name passes only when the accessible name is the one you meant, which is why I query by role. Writing the whole suite that way turns every existing test into a name check.",
    nl: "De twee tests doen verschillend werk. De controle op afwijkingen is het deel van de machine. De zoekopdracht op rol en naam slaagt alleen als de toegankelijke naam is wat je bedoelde, en daarom zoek ik op rol. De hele suite zo schrijven maakt van elke bestaande test een naamcontrole.",
  },
  testing5: {
    en: "The rest is manual and it is short. Tab through the component with the mouse untouched. Turn on a screen reader and listen to one flow. Zoom the browser up and watch for anything that gets cut off. Those minutes reach the problems no rule engine gets to.",
    nl: "De rest is handwerk en het is kort. Tab door het component zonder de muis aan te raken. Zet een schermlezer aan en luister een flow af. Zoom de browser in en let op wat wegvalt. Die paar minuten bereiken de problemen waar geen regel-engine bij komt.",
  },
  pipelineTitle: {
    en: "Putting the check in the pipeline",
    nl: "De controle in de pipeline zetten",
  },
  pipeline1: {
    en: "A check that runs on a laptop is a habit. A check that runs in the pipeline is a property of the repository, and a property survives the person who introduced it. The component tests carry the engine, and a browser suite walks the real flows on a built application.",
    nl: "Een controle die op een laptop draait is een gewoonte. Een controle die in de pipeline draait is een eigenschap van de repository, en een eigenschap overleeft degene die hem invoerde. De componenttests dragen de engine, en een browsersuite loopt de echte flows af op een gebouwde applicatie.",
  },
  pipeline2: {
    en: "Two properties keep the step useful. It runs on the merge request, so a finding arrives while the change is open and the author still has the component in their head. And the report is kept as an artefact.",
    nl: "Twee eigenschappen houden de stap bruikbaar. Hij draait op de merge request, zodat een bevinding binnenkomt terwijl de wijziging open staat en de schrijver het component nog in zijn hoofd heeft. En het rapport wordt bewaard als artefact.",
  },
  pipeline3: {
    en: "At the Belastingdienst the entrepreneur portal and the visual forms editor both stayed at WCAG 2.1 AA, verified with automated tests in a pipeline that ran through GitLab, Jenkins, Tekton and ArgoCD. At the Nationale Postcode Loterij Playwright and Cypress keep watch over the existing campaigns while new ones arrive.",
    nl: "Bij de Belastingdienst bleven het ondernemersportaal en de visuele formulierenbouwer allebei op WCAG 2.1 AA, geborgd met geautomatiseerde tests in een pipeline via GitLab, Jenkins, Tekton en ArgoCD. Bij de Nationale Postcode Loterij houden Playwright en Cypress de bestaande campagnes in de gaten terwijl er nieuwe bij komen.",
  },
  baselineNoteTitle: {
    en: "Start the gate on the new code",
    nl: "Zet de poort op de nieuwe code",
  },
  baselineNoteBody: {
    en: "A build that fails on any violation is sustainable when the repository starts clean. On an existing codebase, record what is there today as the baseline, fail the build on anything new, and bring the baseline down in the normal flow of work.",
    nl: "Een build die op elke afwijking faalt is houdbaar als de repository schoon begint. Op een bestaande codebase leg je vast wat er vandaag staat, laat je de build falen op alles wat nieuw is, en breng je die basislijn omlaag in het gewone werk.",
  },
  handoverTitle: {
    en: "Handing it over so it stays true",
    nl: "Overdragen zodat het zo blijft",
  },
  handover1: {
    en: "A component library holds the level while the teams using it keep the parts intact. Two things undo that. A team that reaches around a component, and a team that does not know what the component already does.",
    nl: "Een componentbibliotheek houdt het niveau vast zolang de teams die hem gebruiken de onderdelen heel laten. Twee dingen maken dat ongedaan. Een team dat om een component heen werkt, en een team dat niet weet wat het component al doet.",
  },
  handover2: {
    en: "The documentation that prevents both is short. Per component: what it supplies on its own, what the consuming code passes in, and which states it announces. A story per state does the rest, because the fastest review of a component is somebody putting a keyboard on every story it has.",
    nl: "De documentatie die allebei voorkomt is kort. Per component: wat het zelf levert, wat de gebruikende code meegeeft, en welke toestanden het aankondigt. Een story per toestand doet de rest, want de snelste review van een component is iemand die een toetsenbord op elke story zet.",
  },
  handover3: {
    en: "At bol.com I work in teams made up mostly of backend developers, so what I hand over has to be maintainable by a team whose strength is the backend. At the Belastingdienst the technical documentation carried per-framework examples, edge cases and limitations, and I worked hands-on with developers across several teams on their implementation. A library nobody has adopted holds no level at all.",
    nl: "Bij bol.com werk ik in teams die grotendeels uit backenddevelopers bestaan, dus wat ik overdraag moet te onderhouden zijn door een team waarvan de kracht in de backend zit. Bij de Belastingdienst droeg de technische documentatie voorbeelden per framework, randgevallen en beperkingen, en werkte ik met developers uit meerdere teams hands-on aan hun implementatie. Een bibliotheek die niemand heeft overgenomen houdt geen niveau vast.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "Six questions, asked while the component is on your screen. Does it have a name, and is that name the visible label. Does the markup say what it is. Does every state appear in an attribute. Can focus reach it, be seen on it and leave it. Does everything a pointer does have a keyboard path. Does every colour that carries meaning meet the ratio.",
    nl: "Zes vragen, gesteld terwijl het component op je scherm staat. Heeft het een naam, en is die naam het zichtbare label. Zegt de markup wat het is. Staat elke toestand in een attribuut. Kan de focus erbij, is hij erop te zien en kan hij er weer weg. Heeft alles wat met een muis kan ook een route via het toetsenbord. Haalt elke kleur die betekenis draagt de verhouding.",
  },
  close2: {
    en: "Then two mechanisms so the answers stay true. The engine inside the component tests, running in the pipeline on every merge request. And a query by role and accessible name in every other test you write.",
    nl: "Daarna twee mechanismen zodat de antwoorden waar blijven. De engine in de componenttests, draaiend in de pipeline op elke merge request. En een zoekopdracht op rol en toegankelijke naam in elke andere test die je schrijft.",
  },
  close3: {
    en: "WCAG 2.2 AA is the level my components follow at bol.com, and WCAG 2.1 AA is the level the engagements before it ran on. In both cases the level is a property of the parts, and a page assembled from parts that answer the six questions arrives there while it is being built.",
    nl: "WCAG 2.2 AA is het niveau dat mijn componenten bij bol.com volgen, en WCAG 2.1 AA is het niveau van de opdrachten daarvoor. In beide gevallen is het niveau een eigenschap van de onderdelen, en een pagina die uit die onderdelen wordt samengesteld komt daar tijdens het bouwen uit.",
  },
  nodeElementSub: { en: "the element you chose", nl: "het element dat je koos" },
  nodeLabel: { en: "The text inside", nl: "De tekst erin" },
  nodeLabelSub: { en: "or aria-labelledby", nl: "of aria-labelledby" },
  nodeAttributeSub: { en: "the attribute you set", nl: "het attribuut dat je zet" },
  nodeRole: { en: "Role: button", nl: "Rol: knop" },
  nodeRoleSub: { en: "from the element", nl: "uit het element" },
  nodeName: { en: "Name: Show filters", nl: "Naam: Toon filters" },
  nodeNameSub: { en: "from the content", nl: "uit de inhoud" },
  nodeState: { en: "State: collapsed", nl: "Toestand: ingeklapt" },
  nodeStateSub: { en: "from the attribute", nl: "uit het attribuut" },
  nodeAnnounced: { en: "What is read out", nl: "Wat wordt voorgelezen" },
  nodeAnnouncedSub: { en: "Show filters, button, collapsed", nl: "Toon filters, knop, ingeklapt" },
  announcementAria: {
    en: "Diagram: the element gives the role, the content gives the name and the attribute gives the state, and the three together are what a screen reader reads out",
    nl: "Diagram: het element geeft de rol, de inhoud geeft de naam en het attribuut geeft de toestand, en die drie samen zijn wat een schermlezer voorleest",
  },
  announcementCaption: {
    en: "A screen reader announces a name, a role and a state, and each of the three comes from a different part of the markup.",
    nl: "Een schermlezer kondigt een naam, een rol en een toestand aan, en die drie komen elk uit een ander deel van de markup.",
  },
  nodeNameField: { en: "Name field", nl: "Veld naam" },
  nodeFirstInOrder: { en: "first in the order", nl: "eerste in de volgorde" },
  nodeEmailField: { en: "Email field", nl: "Veld e-mail" },
  nodeNextInOrder: { en: "next in the order", nl: "volgende in de volgorde" },
  nodeTrigger: { en: "Choose a country", nl: "Kies een land" },
  nodeTriggerSub: { en: "the control that opens it", nl: "de knop die hem opent" },
  nodeDialog: { en: "Inside the dialog", nl: "In de dialoog" },
  nodeDialogSub: { en: "focus stays here while open", nl: "focus blijft hier zolang hij open is" },
  nodeEscape: { en: "Escape, and the trigger has focus", nl: "Escape, en de knop heeft focus" },
  nodeEscapeSub: { en: "the way out", nl: "de weg naar buiten" },
  nodeSend: { en: "Send", nl: "Versturen" },
  nodeSendSub: { en: "last in the order", nl: "laatste in de volgorde" },
  edgeOpens: { en: "opens", nl: "opent" },
  edgeEscapeKey: { en: "Escape", nl: "Escape" },
  edgeOrderContinues: { en: "the order continues", nl: "de volgorde loopt door" },
  focusOrderAria: {
    en: "Diagram: focus moves from the name field to the email field to the control that opens a dialog, stays inside the dialog while it is open, returns to that control on Escape, and continues to the send button",
    nl: "Diagram: de focus gaat van het veld naam naar het veld e-mail naar de knop die een dialoog opent, blijft in de dialoog zolang die open is, keert met Escape terug naar die knop en loopt door naar de verzendknop",
  },
  focusOrderCaption: {
    en: "Focus has to be able to reach every control and to leave again, in an order that matches what the reader sees.",
    nl: "Focus moet elk element kunnen bereiken en er weer weg kunnen, in een volgorde die past bij wat de lezer ziet.",
  },
} as const;
