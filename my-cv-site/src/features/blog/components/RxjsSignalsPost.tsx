import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "rxjs-versus-signals-in-angular",
  category: "architecture",
  track: "frontend",
  publishedDate: "2026-09-06",
  readingTimeMin: 18,
  title: {
    en: "Signals or RxJS in Angular: when each one wins",
    nl: "Signals of RxJS in Angular: wanneer je wat kiest",
  },
  description: {
    en: "Signals and RxJS both belong in an Angular 22 app. Where a signal fits, where switchMap and shareReplay still win, and how toSignal joins the two halves.",
    nl: "Signals en RxJS horen allebei in een Angular 22-app. Waar een signal past, waar switchMap en shareReplay winnen, en hoe toSignal de twee helften verbindt.",
  },
  excerpt: {
    en: "A signal is a value you read now. A stream is a sequence you react to over time. Here is the line between them in Angular 22 and RxJS 7.8, with the seam that lets one screen hold both, and a migration path that adds to the code you have.",
    nl: "Een signal is een waarde die je nu leest. Een stream is een reeks waar je in de tijd op reageert. Dit is de grens tussen die twee in Angular 22 en RxJS 7.8, met de naad die één scherm allebei laat dragen en een migratiepad dat toevoegt.",
  },
  keywords: [
    "angular signals versus rxjs",
    "tosignal toobservable interop",
    "httpresource angular 22",
    "linkedsignal angular",
    "switchmap typeahead angular",
    "zoneless change detection angular",
    "rxjs 7.8 angular",
  ],
};

function buildComparison(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("quantity", copy.nodeQuantity[locale], { x: 0, y: 0 }, { tone: "emerald", subtitle: "signal(1)", direction: "TB", width: 230 }),
    flowNode("subtotal", copy.nodeSubtotal[locale], { x: 0, y: 140 }, { tone: "emerald", subtitle: "computed()", direction: "TB", width: 230 }),
    flowNode("template", copy.nodeTemplate[locale], { x: 0, y: 280 }, { tone: "slate", subtitle: "{{ total() }}", direction: "TB", width: 230 }),
    flowNode("keystrokes", copy.nodeKeystrokes[locale], { x: 320, y: 0 }, { tone: "blue", subtitle: "valueChanges", direction: "TB", width: 250 }),
    flowNode("debounce", "debounceTime(250)", { x: 320, y: 140 }, { tone: "blue", subtitle: copy.nodeDebounceSub[locale], direction: "TB", width: 250 }),
    flowNode("switch", "switchMap", { x: 320, y: 280 }, { tone: "blue", subtitle: copy.nodeSwitchSub[locale], direction: "TB", width: 250 }),
    flowNode("subscriber", copy.nodeSubscriber[locale], { x: 320, y: 420 }, { tone: "slate", subtitle: copy.nodeSubscriberSub[locale], direction: "TB", width: 250 }),
  ];
  const edges = [
    flowEdge("quantity", "subtotal", { label: copy.edgeRecomputes[locale] }),
    flowEdge("subtotal", "template", { label: copy.edgeReads[locale] }),
    flowEdge("keystrokes", "debounce"),
    flowEdge("debounce", "switch", { label: copy.edgeAfterPause[locale] }),
    flowEdge("switch", "subscriber", { label: copy.edgeEmits[locale] }),
  ];
  return { nodes, edges };
}

function buildSeam(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("source", copy.seamSource[locale], { x: 0, y: 0 }, { tone: "emerald", subtitle: "signal('')", direction: "TB", width: 290 }),
    flowNode("open", "toObservable()", { x: 0, y: 125 }, { tone: "violet", subtitle: "@angular/core/rxjs-interop", direction: "TB", width: 290 }),
    flowNode("operators", "debounceTime · switchMap", { x: 0, y: 255 }, { tone: "blue", subtitle: copy.seamOperatorsSub[locale], direction: "TB", width: 290 }),
    flowNode("close", "toSignal()", { x: 0, y: 385 }, { tone: "violet", subtitle: "initialValue: []", direction: "TB", width: 290 }),
    flowNode("result", copy.seamResult[locale], { x: 0, y: 510 }, { tone: "emerald", subtitle: copy.seamResultSub[locale], direction: "TB", width: 290 }),
  ];
  const edges = [
    flowEdge("source", "open", { label: copy.edgeOpens[locale] }),
    flowEdge("open", "operators"),
    flowEdge("operators", "close", { label: copy.edgeCloses[locale] }),
    flowEdge("close", "result"),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const comparison = buildComparison(locale);
  const seam = buildSeam(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versionNote[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.twoAnswersTitle[locale],
          copy.whatSignalTitle[locale],
          copy.whatStreamTitle[locale],
          copy.fourQuestionsTitle[locale],
          copy.readingTitle[locale],
          copy.seamTitle[locale],
          copy.resourceTitle[locale],
          copy.linkedTitle[locale],
          copy.zonelessTitle[locale],
          copy.migrationTitle[locale],
          copy.keepTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.twoAnswersTitle[locale]}</H2>
      <P>{copy.twoAnswers1[locale]}</P>
      <P>{copy.twoAnswers2[locale]}</P>

      <H2>{copy.whatSignalTitle[locale]}</H2>
      <P>{copy.whatSignal1[locale]}</P>
      <P>{copy.whatSignal2[locale]}</P>
      <CodeBlock lang="ts" filename="order-total.component.ts" code={SIGNAL_COMPONENT_CODE} />
      <P>{copy.whatSignal3[locale]}</P>
      <P>{copy.whatSignal4[locale]}</P>
      <Callout variant="warning" title={copy.allowWritesTitle[locale]}>
        {copy.allowWritesBody[locale]}
      </Callout>

      <H2>{copy.whatStreamTitle[locale]}</H2>
      <P>{copy.whatStream1[locale]}</P>
      <UL>
        <LI><Strong>{copy.cancellationLabel[locale]}</Strong> {copy.cancellationBody[locale]}</LI>
        <LI><Strong>{copy.retryLabel[locale]}</Strong> {copy.retryBody[locale]}</LI>
        <LI><Strong>{copy.pushLabel[locale]}</Strong> {copy.pushBody[locale]}</LI>
        <LI><Strong>{copy.multicastLabel[locale]}</Strong> {copy.multicastBody[locale]}</LI>
        <LI><Strong>{copy.concurrencyLabel[locale]}</Strong> {copy.concurrencyBody[locale]}</LI>
      </UL>
      <P>{copy.whatStream2[locale]}</P>

      <H2>{copy.fourQuestionsTitle[locale]}</H2>
      <P>{copy.fourQuestions1[locale]}</P>
      <OL>
        <LI>{copy.question1[locale]}</LI>
        <LI>{copy.question2[locale]}</LI>
        <LI>{copy.question3[locale]}</LI>
        <LI>{copy.question4[locale]}</LI>
      </OL>
      <P>{copy.fourQuestions2[locale]}</P>

      <H2>{copy.readingTitle[locale]}</H2>
      <P>{copy.reading1[locale]}</P>
      <FlowDiagram
        nodes={comparison.nodes}
        edges={comparison.edges}
        height={520}
        ariaLabel={copy.comparisonAria[locale]}
        caption={copy.comparisonCaption[locale]}
      />
      <P>{copy.reading2[locale]}</P>
      <CodeBlock lang="ts" filename="order-total-with-subjects.component.ts" code={SUBJECT_COMPONENT_CODE} />
      <P>{copy.reading3[locale]}</P>
      <P>{copy.reading4[locale]}</P>

      <H2>{copy.seamTitle[locale]}</H2>
      <P>{copy.seam1[locale]}</P>
      <CodeBlock lang="ts" filename="vehicle-search.component.ts" code={TYPEAHEAD_CODE} />
      <P>{copy.seam2[locale]}</P>
      <CodeBlock lang="ts" filename="vehicle-search-signals.component.ts" code={TYPEAHEAD_INTEROP_CODE} />
      <FlowDiagram
        nodes={seam.nodes}
        edges={seam.edges}
        height={560}
        ariaLabel={copy.seamAria[locale]}
        caption={copy.seamCaption[locale]}
      />
      <P>{copy.seam3[locale]}</P>
      <P>{copy.seam4[locale]}</P>
      <P>{copy.seam5[locale]}</P>

      <H2>{copy.resourceTitle[locale]}</H2>
      <P>{copy.resource1[locale]}</P>
      <P>{copy.resource2[locale]}</P>
      <CodeBlock lang="ts" filename="contract-detail.component.ts" code={RESOURCE_CODE} />
      <P>{copy.resource3[locale]}</P>
      <Callout variant="info" title={copy.stableTitle[locale]}>
        {copy.stableBody[locale]}
      </Callout>

      <H2>{copy.linkedTitle[locale]}</H2>
      <P>{copy.linked1[locale]}</P>
      <P>{copy.linked2[locale]}</P>
      <P>{copy.linked3[locale]}</P>

      <H2>{copy.zonelessTitle[locale]}</H2>
      <P>{copy.zoneless1[locale]}</P>
      <P>{copy.zoneless2[locale]}</P>
      <P>{copy.zoneless3[locale]}</P>

      <Divider />

      <H2>{copy.migrationTitle[locale]}</H2>
      <P>{copy.migration1[locale]}</P>
      <CodeBlock lang="ts" filename="vehicle.service.ts" code={LEGACY_SERVICE_CODE} />
      <P>{copy.migration2[locale]}</P>
      <CodeBlock lang="ts" filename="vehicle.facade.ts" code={FACADE_CODE} />
      <OL>
        <LI>{copy.step1[locale]}</LI>
        <LI>{copy.step2[locale]}</LI>
        <LI>{copy.step3[locale]}</LI>
        <LI>{copy.step4[locale]}</LI>
        <LI>{copy.step5[locale]}</LI>
      </OL>
      <P>{copy.migration3[locale]}</P>

      <H2>{copy.keepTitle[locale]}</H2>
      <UL>
        <LI><Strong>{copy.keepPipelineLabel[locale]}</Strong> {copy.keepPipelineBody[locale]}</LI>
        <LI><Strong>{copy.keepCacheLabel[locale]}</Strong> {copy.keepCacheBody[locale]}</LI>
        <LI><Strong>{copy.keepSocketLabel[locale]}</Strong> {copy.keepSocketBody[locale]}</LI>
        <LI><Strong>{copy.keepHttpLabel[locale]}</Strong> {copy.keepHttpBody[locale]}</LI>
        <LI><Strong>{copy.keepFormsLabel[locale]}</Strong> {copy.keepFormsBody[locale]}</LI>
      </UL>
      <P>{copy.keep1[locale]}</P>

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <P>{copy.closing2[locale]}</P>
    </>
  );
}

const SIGNAL_COMPONENT_CODE = `import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";

@Component({
  selector: "app-order-total",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>{{ subtotal() }}</p>
    <p>{{ total() }}</p>
    <button type="button" (click)="addItem()">Add one</button>
  \`,
})
export class OrderTotalComponent {
  readonly unitPrice = input.required<number>();
  readonly shippingCost = input(0);

  protected readonly quantity = signal(1);
  protected readonly subtotal = computed(() => this.quantity() * this.unitPrice());
  protected readonly total = computed(() => this.subtotal() + this.shippingCost());

  protected addItem(): void {
    this.quantity.update((current) => current + 1);
  }
}`;

const SUBJECT_COMPONENT_CODE = `import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { BehaviorSubject, combineLatest, map } from "rxjs";

@Component({
  selector: "app-order-total",
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>{{ subtotal$ | async }}</p>
    <p>{{ total$ | async }}</p>
    <button type="button" (click)="addItem()">Add one</button>
  \`,
})
export class OrderTotalComponent implements OnChanges {
  @Input({ required: true }) unitPrice = 0;
  @Input() shippingCost = 0;

  private readonly quantityChanges = new BehaviorSubject(1);
  private readonly unitPriceChanges = new BehaviorSubject(0);
  private readonly shippingCostChanges = new BehaviorSubject(0);

  readonly subtotal$ = combineLatest([this.quantityChanges, this.unitPriceChanges]).pipe(
    map(([quantity, unitPrice]) => quantity * unitPrice)
  );

  readonly total$ = combineLatest([this.subtotal$, this.shippingCostChanges]).pipe(
    map(([subtotal, shippingCost]) => subtotal + shippingCost)
  );

  ngOnChanges(): void {
    this.unitPriceChanges.next(this.unitPrice);
    this.shippingCostChanges.next(this.shippingCost);
  }

  addItem(): void {
    this.quantityChanges.next(this.quantityChanges.value + 1);
  }
}`;

const TYPEAHEAD_CODE = `import { AsyncPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from "rxjs";

type Vehicle = { id: string; label: string };

@Component({
  selector: "app-vehicle-search",
  imports: [AsyncPipe, ReactiveFormsModule],
  template: \`
    <input type="search" [formControl]="searchTerm" />
    @for (vehicle of (matches$ | async) ?? []; track vehicle.id) {
      <p>{{ vehicle.label }}</p>
    }
  \`,
})
export class VehicleSearchComponent {
  private readonly httpClient = inject(HttpClient);

  readonly searchTerm = new FormControl("", { nonNullable: true });

  readonly matches$ = this.searchTerm.valueChanges.pipe(
    map((term) => term.trim()),
    filter((term) => term.length > 2),
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((term) => this.httpClient.get<Vehicle[]>("/api/vehicles", { params: { term } }))
  );
}`;

const TYPEAHEAD_INTEROP_CODE = `import { HttpClient } from "@angular/common/http";
import { Component, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, map, of, switchMap } from "rxjs";

type Vehicle = { id: string; label: string };

@Component({
  selector: "app-vehicle-search",
  template: \`
    <input type="search" (input)="updateTerm($event)" />
    @for (vehicle of matches(); track vehicle.id) {
      <p>{{ vehicle.label }}</p>
    }
  \`,
})
export class VehicleSearchComponent {
  private readonly httpClient = inject(HttpClient);

  protected readonly searchTerm = signal("");

  protected readonly matches = toSignal(
    toObservable(this.searchTerm).pipe(
      map((term) => term.trim()),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((term) =>
        term.length > 2
          ? this.httpClient.get<Vehicle[]>("/api/vehicles", { params: { term } })
          : of<Vehicle[]>([])
      )
    ),
    { initialValue: [] as Vehicle[] }
  );

  protected readonly hasMatches = computed(() => this.matches().length > 0);

  protected updateTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}`;

const RESOURCE_CODE = `import { HttpClient, httpResource } from "@angular/common/http";
import { Component, DestroyRef, inject, linkedSignal, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

type Contract = { id: string; holder: string; status: "draft" | "active" | "ended" };

@Component({
  selector: "app-contract-detail",
  template: \`
    @if (contract.isLoading()) {
      <p>Loading the contract</p>
    } @else if (contract.error()) {
      <p>This contract could not be loaded</p>
    } @else {
      <p>{{ contract.value()?.holder }}</p>
      <p>{{ status() }}</p>
      <button type="button" (click)="endContract()">End this contract</button>
    }
  \`,
})
export class ContractDetailComponent {
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly contractId = signal("C-1024");

  protected readonly contract = httpResource<Contract>(
    () => \`/api/contracts/\${this.contractId()}\`
  );

  protected readonly status = linkedSignal({
    source: () => this.contract.value(),
    computation: (loaded, previous) => loaded?.status ?? previous?.value ?? "draft",
  });

  protected endContract(): void {
    this.httpClient
      .post(\`/api/contracts/\${this.contractId()}/end\`, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.contract.reload());
  }
}`;

const LEGACY_SERVICE_CODE = `import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, shareReplay, switchMap } from "rxjs/operators";

export type Vehicle = {
  id: string;
  label: string;
  fuel: string;
};

@Injectable({ providedIn: "root" })
export class VehicleService {
  private readonly selectedId = new BehaviorSubject<string | null>(null);

  readonly selected$: Observable<Vehicle>;

  constructor(private readonly httpClient: HttpClient) {
    this.selected$ = this.selectedId.pipe(
      filter((id): id is string => id !== null),
      switchMap((id) => this.httpClient.get<Vehicle>("/api/vehicles/" + id)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  select(id: string): void {
    this.selectedId.next(id);
  }
}`;

const FACADE_CODE = `import { Injectable, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { VehicleService } from "./vehicle.service";

@Injectable({ providedIn: "root" })
export class VehicleFacade {
  private readonly vehicles = inject(VehicleService);

  readonly selected = toSignal(this.vehicles.selected$, { initialValue: null });
  readonly isElectric = computed(() => this.selected()?.fuel === "electric");

  select(id: string): void {
    this.vehicles.select(id);
  }
}`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "Signals and RxJS are not two answers to the same question. One holds a value you read right now. The other describes events that arrive over time, in an order you do not control. Almost every argument about which of the two wins turns out to be an argument about which of the two you are holding.",
    nl: "Signals en RxJS zijn geen twee antwoorden op dezelfde vraag. Het ene bewaart een waarde die je nu uitleest. Het andere beschrijft gebeurtenissen die in de tijd binnenkomen, in een volgorde die jij niet bepaalt. Bijna elke discussie over welke van de twee wint, blijkt een discussie over welke van de twee je in handen hebt.",
  },
  intro1: {
    en: "I have been writing Angular since the version numbers still had a dot in them. At Athlon I led the migration of a self-service application from Angular 1.6 to Angular 12 and designed the frontend architecture around RxJS and reactive data streams. At Transdev I built a traveller portal in Angular with components in TypeScript and RxJS. At Ortec the planning updates arrived through observables, so a change in the planning appeared on screen without anyone refreshing.",
    nl: "Ik schrijf Angular sinds de versienummers nog een punt hadden. Bij Athlon leidde ik de migratie van een selfserviceapplicatie van Angular 1.6 naar Angular 12 en ontwierp ik de frontendarchitectuur rond RxJS en reactieve datastromen. Bij Transdev bouwde ik een reizigersportaal in Angular met componenten in TypeScript en RxJS. Bij Ortec kwamen de planningsupdates binnen via observables, zodat een wijziging in de planning in beeld stond zonder dat iemand ververste.",
  },
  intro2: {
    en: "At the Belastingdienst, the Dutch tax administration, I tutored a senior developer who knew JavaScript and Vue but no Angular. I took him by the hand through RxJS and streams, which was the hardest part for him, and through the proper use of services. The place where he got stuck is the place where nearly everyone gets stuck, and it is not the syntax. It is the question of what should happen when a second request starts before the first one has answered. Signals do not answer that question. That is the whole reason both libraries are still in the box.",
    nl: "Bij de Belastingdienst begeleidde ik een senior ontwikkelaar die JavaScript en Vue kende, maar geen Angular. Ik nam hem bij de hand door RxJS en streams, voor hem het lastigste onderdeel, en door het juiste gebruik van services. De plek waar hij vastliep, is de plek waar bijna iedereen vastloopt, en dat is niet de syntax. Het is de vraag wat er moet gebeuren als een tweede verzoek begint voordat het eerste antwoord heeft gegeven. Signals beantwoorden die vraag niet. Precies daarom zitten beide bibliotheken nog in de doos.",
  },
  versionNote: {
    en: "The samples below target Angular 22 and RxJS 7.8, the pairing Angular 22 declares in its peer dependencies, checked on 6 September 2026. RxJS 8 never shipped as a release, and RxJS 9 sits on the beta tag as an ESM-only rewrite that Angular does not accept, so nothing here anticipates it.",
    nl: "De voorbeelden hieronder zijn geschreven voor Angular 22 en RxJS 7.8, de combinatie die Angular 22 in zijn peer dependencies vastlegt, gecontroleerd op 6 september 2026. RxJS 8 is nooit als release verschenen en RxJS 9 staat als bèta klaar, een ESM-only herschrijving die Angular niet accepteert, dus geen enkel voorbeeld hier loopt daarop vooruit.",
  },
  quote: {
    en: "A signal answers what is true now. A stream answers what happened, in what order, and what to do about the one that arrived while you were still busy.",
    nl: "Een signal beantwoordt wat er nu waar is. Een stream beantwoordt wat er gebeurde, in welke volgorde, en wat je doet met het antwoord dat binnenkwam terwijl je nog bezig was.",
  },
  twoAnswersTitle: {
    en: "Two answers to the same question",
    nl: "Twee antwoorden op dezelfde vraag",
  },
  twoAnswers1: {
    en: "Go looking for guidance and one sentence comes back from every direction. Signals manage state, RxJS manages streams. It is a fair summary and it is community framing. I went looking for the page behind it in the documentation that ships with Angular 22 and there is none. Angular documents the interop between the two and leaves the choice to the team. So the recommendation in this article is mine, and it is open to being argued with on the merits.",
    nl: "Zoek je naar houvast, dan komt van alle kanten dezelfde zin terug. Signals doen state, RxJS doet streams. Het is een redelijke samenvatting en het is een formulering uit de community. Ik heb de pagina erachter gezocht in de documentatie die met Angular 22 meekomt en die bestaat niet. Angular documenteert de koppeling tussen beide en laat de keuze aan het team. De aanbeveling in dit artikel is dus van mij, en je mag er inhoudelijk met me over van mening verschillen.",
  },
  twoAnswers2: {
    en: "The two failure shapes are easy to recognise in a review. A screen written entirely in signals runs into trouble the first time two requests are in flight and the slower one answers last. A screen written entirely in RxJS carries subscription bookkeeping for values that never changed on their own, and the template fills up with async pipes for numbers that were only ever a multiplication. Neither shape is wrong about the library it picked. Both are wrong about the value in front of them.",
    nl: "De twee manieren waarop het misgaat, herken je zo in een review. Een scherm dat volledig in signals is geschreven, loopt vast zodra twee verzoeken tegelijk lopen en de traagste als laatste antwoordt. Een scherm dat volledig in RxJS is geschreven, houdt abonnementen bij op waarden die uit zichzelf nooit veranderen, en de template vult zich met async-pipes voor getallen die alleen maar een vermenigvuldiging waren. Geen van beide zit fout in de bibliotheek die het koos. Allebei zitten ze fout in de waarde die voor hun neus ligt.",
  },
  whatSignalTitle: {
    en: "What a signal is, and what it is not",
    nl: "Wat een signal is, en wat het niet is",
  },
  whatSignal1: {
    en: "A signal is a value with a dependency graph attached. You read it by calling it. Read it inside something reactive, a computed, an effect or a template, and that reader becomes a dependent, so it is told when the value changes. A computed is lazy and it caches its answer, so a derived value nobody reads is never calculated.",
    nl: "Een signal is een waarde met een afhankelijkheidsgraaf eraan vast. Je leest hem uit door hem aan te roepen. Doe je dat binnen iets reactiefs, een computed, een effect of een template, dan wordt die lezer een afhankelijke en krijgt hij bericht als de waarde verandert. Een computed is lui en onthoudt zijn antwoord, dus een afgeleide waarde die niemand leest, wordt nooit berekend.",
  },
  whatSignal2: {
    en: "The pieces arrived over several releases, which is worth knowing when you read an older article. The signal and computed functions have been stable since v17. The input, model and output functions and the signal queries followed in v19. The effect, linkedSignal, toSignal, toObservable and untracked functions became stable in v20. The resource, rxResource and httpResource functions became stable in v22.",
    nl: "De onderdelen kwamen verspreid over meerdere releases binnen, handig om te weten als je een ouder artikel leest. De functies signal en computed zijn stabiel sinds v17. De functies input, model en output en de signal queries volgden in v19. De functies effect, linkedSignal, toSignal, toObservable en untracked werden stabiel in v20. De functies resource, rxResource en httpResource werden stabiel in v22.",
  },
  whatSignal3: {
    en: "Two things in there are worth naming. The inputs are signals, so a binding from the parent joins the same graph as the local state with no bridging code in between. And nothing in this component subscribes to anything, because there is nothing to subscribe to. The subtotal is not an event. It is a multiplication that always has an answer.",
    nl: "Twee dingen daarin verdienen een naam. De inputs zijn signals, dus een binding van de ouder komt in dezelfde graaf terecht als de lokale state, zonder tussenlaag. En niets in dit component abonneert zich ergens op, want er is niets om je op te abonneren. Het subtotaal is geen gebeurtenis. Het is een vermenigvuldiging die altijd een antwoord heeft.",
  },
  whatSignal4: {
    en: "A signal has no history, no completion and no error channel. It cannot tell you that two values arrived in quick succession, because it never held both. It cannot cancel anything, because it never started anything. It always has a value, which is what makes it right for a template and unsuited to describing a request that may still fail.",
    nl: "Een signal heeft geen historie, geen afsluiting en geen foutkanaal. Het kan je niet vertellen dat er twee waarden vlak na elkaar binnenkwamen, want het heeft er nooit twee tegelijk vastgehouden. Het kan niets afbreken, want het is nooit ergens aan begonnen. Het heeft altijd een waarde, en juist daardoor past het in een template en niet bij een verzoek dat nog kan mislukken.",
  },
  allowWritesTitle: {
    en: "allowSignalWrites was not removed",
    nl: "allowSignalWrites is niet verdwenen",
  },
  allowWritesBody: {
    en: "Older articles say that writing to a signal inside an effect needs allowSignalWrites. The option is still there on CreateEffectOptions. It has been deprecated and does nothing since v19, and signal writes in effects are allowed by default. An old codebase that still passes it compiles fine, so you can take it out on your own schedule.",
    nl: "Oudere artikelen schrijven dat je allowSignalWrites nodig hebt om binnen een effect naar een signal te schrijven. De optie staat nog steeds op CreateEffectOptions. Hij is deprecated en doet sinds v19 niets meer, en schrijven naar een signal in een effect mag standaard. Een oude codebase die hem nog meegeeft, compileert gewoon, dus je haalt hem weg wanneer het jou uitkomt.",
  },
  whatStreamTitle: {
    en: "What RxJS still does that signals do not",
    nl: "Wat RxJS nog steeds doet en signals niet",
  },
  whatStream1: {
    en: "This is the list I keep coming back to. Every item is something a dependency graph does not model, and together they are the reason RxJS stays in an Angular application that is otherwise full of signals.",
    nl: "Dit is de lijst waar ik telkens op terugkom. Elk punt is iets wat een afhankelijkheidsgraaf niet beschrijft, en samen zijn ze de reden dat RxJS blijft in een Angular-applicatie die verder vol signals zit.",
  },
  cancellationLabel: { en: "Cancellation and race handling.", nl: "Afbreken en volgorde bewaken." },
  cancellationBody: {
    en: "The switchMap operator unsubscribes from the request in flight the moment a new value arrives. The answer to the third keystroke can never land on top of the answer to the fourth. A signal has no equivalent, because a signal has no in flight.",
    nl: "De operator switchMap zegt het lopende verzoek op zodra er een nieuwe waarde binnenkomt. Het antwoord op de derde toetsaanslag kan nooit over het antwoord op de vierde heen vallen. Een signal heeft daar geen tegenhanger voor, want een signal kent geen lopend verzoek.",
  },
  retryLabel: { en: "Retry with backoff.", nl: "Opnieuw proberen met oplopende wachttijd." },
  retryBody: {
    en: "The retry operator takes a count and a delay, which turns a failed request into a schedule. A graph of values has no notion of trying the same thing again a second later.",
    nl: "De operator retry neemt een aantal pogingen en een wachttijd, waarmee een mislukt verzoek een schema wordt. Een graaf van waarden kent het idee niet om hetzelfde een seconde later nog eens te proberen.",
  },
  pushLabel: { en: "Push connections.", nl: "Verbindingen die zelf duwen." },
  pushBody: {
    en: "WebSockets and server sent events keep emitting. In v22 they can be handed to resource through its stream loader, which gives you a signal at the end of it. The plain loader is documented as one shot, so it does not model a socket. Everything else about the connection stays RxJS.",
    nl: "WebSockets en server sent events blijven waarden sturen. In v22 kun je ze via de stream-loader aan resource geven, waarmee je er alsnog een signal aan overhoudt. De gewone loader is gedocumenteerd als eenmalig, dus die beschrijft geen socket. De rest van de verbinding blijft RxJS.",
  },
  multicastLabel: { en: "Multicasting.", nl: "Eén uitvoering delen." },
  multicastBody: {
    en: "The shareReplay operator gives many subscribers one execution and the last value. Two components that ask the same service for the same thing make one request between them.",
    nl: "De operator shareReplay geeft meerdere afnemers één uitvoering en de laatste waarde. Twee componenten die dezelfde service hetzelfde vragen, doen samen één verzoek.",
  },
  concurrencyLabel: { en: "The concurrency operators.", nl: "De operators voor gelijktijdigheid." },
  concurrencyBody: {
    en: "The mergeMap operator runs them all at once, concatMap queues them in order, and exhaustMap ignores new work while it is busy, which is the double submit solved in one word. These three have no signal equivalent at all.",
    nl: "De operator mergeMap laat ze allemaal tegelijk lopen, concatMap zet ze op volgorde in de rij en exhaustMap negeert nieuw werk zolang hij bezig is, waarmee de dubbele verzending in één woord is opgelost. Voor deze drie bestaat helemaal geen signal-variant.",
  },
  whatStream2: {
    en: "One item on that list is moving across the line. Debouncing arrived in v22 as a debounced function, marked experimental, so it is a thing to keep an eye on and not a thing to migrate to this quarter.",
    nl: "Eén punt van die lijst schuift over de grens. Debouncen kwam in v22 binnen als de functie debounced, gemarkeerd als experimenteel, dus iets om in de gaten te houden en niet iets om dit kwartaal naartoe te migreren.",
  },
  fourQuestionsTitle: {
    en: "The four questions that decide it",
    nl: "De vier vragen die de keuze bepalen",
  },
  fourQuestions1: {
    en: "I ask four questions per value. Not per application and not per component, per value, which is why one screen usually holds both kinds.",
    nl: "Ik stel vier vragen per waarde. Niet per applicatie en niet per component, maar per waarde, en daarom draagt één scherm meestal allebei de soorten.",
  },
  question1: {
    en: "Does it always have an answer? A quantity, a total, a selected row and a filter string all do. A response that has not come back yet does not, and neither does a click.",
    nl: "Heeft het altijd een antwoord? Een aantal, een totaal, een geselecteerde rij en een filterterm wel. Een antwoord dat nog niet terug is niet, en een klik ook niet.",
  },
  question2: {
    en: "Does the template read it? Anything the template reads is easiest as a signal, because the template reads it by calling it and change detection is told without a pipe and without a subscription.",
    nl: "Leest de template het? Alles wat de template leest, gaat het makkelijkst als signal, want de template leest het door het aan te roepen en change detection krijgt bericht zonder pipe en zonder abonnement.",
  },
  question3: {
    en: "Can two of them be under way at the same time? Once the answer is yes, you need cancellation, ordering or both, and that is an operator.",
    nl: "Kunnen er twee tegelijk onderweg zijn? Zodra het antwoord ja is, heb je afbreken nodig, of volgorde, of allebei, en dat is een operator.",
  },
  question4: {
    en: "Who ends it? Something that has to be torn down, retried or shared between subscribers is a stream with a lifetime. A value that lives exactly as long as its component is a signal.",
    nl: "Wie beëindigt het? Iets wat opgeruimd, opnieuw geprobeerd of tussen afnemers gedeeld moet worden, is een stream met een levensduur. Een waarde die precies zo lang leeft als zijn component, is een signal.",
  },
  fourQuestions2: {
    en: "Most screens answer signal to the first two questions and stream to the third. That is why the seam between the two matters more than the winner.",
    nl: "De meeste schermen antwoorden signal op de eerste twee vragen en stream op de derde. Daarom is de naad tussen die twee belangrijker dan de winnaar.",
  },
  readingTitle: {
    en: "Reading a signal, subscribing to a stream",
    nl: "Een signal lees je, op een stream abonneer je je",
  },
  reading1: {
    en: "The mechanics differ in one way that decides most of the rest. A signal is pulled, so the reader asks for the current value at the moment it needs it. A stream is pushed, so a subscriber waits and is handed each value as it arrives.",
    nl: "De werking verschilt op één punt dat de rest grotendeels bepaalt. Een signal haal je op, dus de lezer vraagt om de huidige waarde op het moment dat hij die nodig heeft. Een stream duwt, dus een afnemer wacht en krijgt elke waarde aangereikt zodra die binnenkomt.",
  },
  comparisonAria: {
    en: "Diagram: on the left a quantity signal feeds a computed subtotal that the template reads, on the right keystrokes flow through debounceTime and switchMap to a subscriber",
    nl: "Diagram: links voedt een aantal-signal een berekend subtotaal dat de template leest, rechts lopen toetsaanslagen via debounceTime en switchMap naar een afnemer",
  },
  comparisonCaption: {
    en: "A signal is a value you read now. A stream is a sequence you react to over time.",
    nl: "Een signal is een waarde die je nu leest. Een stream is een reeks waar je in de tijd op reageert.",
  },
  reading2: {
    en: "Here is the same order screen written without signals, in current Angular. This is not a straw man. It is the shape a well written Angular application had for years, and a great many of them are in production right now.",
    nl: "Hier is hetzelfde bestelscherm zonder signals, in het Angular van nu. Dit is geen stroman. Zo zag een goed geschreven Angular-applicatie er jarenlang uit, en daar draaien er op dit moment heel veel van in productie.",
  },
  reading3: {
    en: "The logic is identical and the mechanics are not. The inputs are plain values, so they have to be pushed into subjects before the pipeline can see them, which is the only job ngOnChanges has here. Every derived value is a pipe with a map inside it. The template reads two async pipes, and each one subscribes on its own.",
    nl: "De logica is gelijk en de werking niet. De inputs zijn gewone waarden, dus ze moeten eerst in subjects worden geduwd voordat de pijplijn ze ziet, en dat is hier het enige werk van ngOnChanges. Elke afgeleide waarde is een pipe met een map erin. De template leest twee async-pipes en elk daarvan abonneert zich apart.",
  },
  reading4: {
    en: "The async pipe was never the leak, by the way. It subscribes and unsubscribes along with the view. The leak was the manual subscribe in ngOnInit that nobody ever ended, and takeUntilDestroyed from the interop package is the one line that closes that hole in current Angular.",
    nl: "De async-pipe was trouwens nooit het lek. Die abonneert en zegt op samen met de view. Het lek was de handmatige subscribe in ngOnInit die niemand afsloot, en takeUntilDestroyed uit het interop-pakket is de ene regel die dat gat in het huidige Angular dicht.",
  },
  seamTitle: {
    en: "toSignal and toObservable, the seam between them",
    nl: "toSignal en toObservable, de naad ertussen",
  },
  seam1: {
    en: "A typeahead is the shortest example of work a signal does not cover. The user types, you want one request per pause in the typing, and you want the answer to the last request only. That is timing, and timing is what the operators are for.",
    nl: "Een typeahead is het kortste voorbeeld van werk dat een signal niet dekt. De gebruiker typt, je wilt één verzoek per pauze in het typen, en je wilt alleen het antwoord op het laatste verzoek. Dat is timing, en daar zijn de operators voor.",
  },
  seam2: {
    en: "Now put a signal on both ends of that pipeline. The component holds a writable signal, the operators do the timing work in the middle, and the result comes back as something the template can call.",
    nl: "Zet nu aan beide kanten van die pijplijn een signal. Het component houdt een schrijfbaar signal vast, de operators doen in het midden het timingwerk, en het resultaat komt terug als iets wat de template kan aanroepen.",
  },
  seamAria: {
    en: "Diagram: a search term signal goes through toObservable into debounceTime and switchMap, and toSignal turns the result back into a signal the template reads",
    nl: "Diagram: een zoekterm-signal gaat via toObservable naar debounceTime en switchMap, en toSignal maakt van het resultaat weer een signal dat de template leest",
  },
  seamCaption: {
    en: "toObservable opens the stream, the operators do the timing work, toSignal closes it again for the template.",
    nl: "toObservable opent de stream, de operators doen het timingwerk, toSignal sluit hem weer voor de template.",
  },
  seam3: {
    en: "Two details make or break this seam. The toSignal function subscribes right away and unsubscribes when the injection context it was created in is destroyed, so there is no teardown left for you to write. It takes an initialValue, and without one the type of the signal includes undefined, which is the compiler telling you the truth about the first frame.",
    nl: "Twee details maken of breken deze naad. De functie toSignal abonneert meteen en zegt op zodra de injectiecontext waarin hij is gemaakt wordt opgeruimd, dus er blijft geen opruimwerk voor je over. Hij neemt een initialValue, en zonder die waarde bevat het type van het signal undefined, wat de compiler is die je de waarheid vertelt over het eerste beeld.",
  },
  seam4: {
    en: "The toObservable function goes the other way and it is not a mirror of every write. It reports the value the signal settles on, so a burst of writes inside one tick does not become a burst of emissions. When you need every intermediate value delivered, that source was an event all along and it belongs in a subject.",
    nl: "De functie toObservable gaat de andere kant op en is geen spiegel van elke schrijfactie. Hij meldt de waarde waar het signal op uitkomt, dus een reeks schrijfacties binnen één tick wordt geen reeks emissies. Heb je elke tussenwaarde echt nodig, dan was die bron altijd al een gebeurtenis en hoort hij in een subject.",
  },
  seam5: {
    en: "The interop package is small and worth reading end to end. It holds toSignal, toObservable, rxResource, takeUntilDestroyed and outputFromObservable, which turns a stream into a component output.",
    nl: "Het interop-pakket is klein en de moeite waard om helemaal door te lezen. Er zitten toSignal, toObservable, rxResource, takeUntilDestroyed en outputFromObservable in, waarmee een stream een output van een component wordt.",
  },
  resourceTitle: {
    en: "resource and httpResource, async as a signal you only read",
    nl: "resource en httpResource, async als signal dat je alleen leest",
  },
  resource1: {
    en: "Version 22 is where the asynchronous side got an API shaped like a signal. The resource, rxResource and httpResource functions all became stable in that release, which is worth stating plainly, because a lot of writing about them was published while they were still a preview.",
    nl: "In versie 22 kreeg de asynchrone kant een API in de vorm van een signal. De functies resource, rxResource en httpResource werden alle drie stabiel in die release, en dat is het benoemen waard, want veel van wat erover geschreven is, verscheen toen ze nog preview waren.",
  },
  resource2: {
    en: "The httpResource function wraps HttpClient. You give it a function that builds a request out of signals. It requests eagerly, it requests again when a dependency changes, and it cancels the pending request when that happens. What it hands back is a signal for the value, one for the loading state and one for the error.",
    nl: "De functie httpResource zit om HttpClient heen. Je geeft hem een functie die uit signals een verzoek samenstelt. Hij vraagt meteen op, hij vraagt opnieuw op zodra een afhankelijkheid verandert, en hij breekt het lopende verzoek daarbij af. Wat je terugkrijgt is een signal voor de waarde, een voor de laadstatus en een voor de fout.",
  },
  resource3: {
    en: "The part people trip over is that a resource is documented as read only. Its value is derived from a request, so there is no setter waiting for your edit. That is a good constraint and it has a consequence. Every change to server state goes through HttpClient, which still returns an Observable in v22. Send the change, then reload the resource.",
    nl: "Waar mensen over struikelen, is dat een resource gedocumenteerd staat als alleen-lezen. De waarde is afgeleid van een verzoek, dus er is geen setter die op jouw wijziging wacht. Dat is een goede beperking en die heeft een gevolg. Elke wijziging van serverstate gaat via HttpClient, die in v22 nog steeds een Observable teruggeeft. Stuur de wijziging en laad de resource daarna opnieuw.",
  },
  stableTitle: {
    en: "Check the version a snippet was written for",
    nl: "Kijk voor welke versie een voorbeeld is geschreven",
  },
  stableBody: {
    en: "The resource family spent several releases behind a preview label and its shape changed while it was there. A snippet from that period can compile against a signature that no longer exists. The stable surface is the one in v22.",
    nl: "De resource-familie stond een aantal releases achter een previewlabel en veranderde in die tijd van vorm. Een voorbeeld uit die periode kan geschreven zijn voor een signatuur die niet meer bestaat. De stabiele versie is die van v22.",
  },
  linkedTitle: {
    en: "linkedSignal, state that follows other state",
    nl: "linkedSignal, state die andere state volgt",
  },
  linked1: {
    en: "The other half of that sample is linkedSignal, stable since v20, and it fills the gap a read-only resource leaves. You want a value that starts from loaded data, stays writable, and resets when the data it came from changes.",
    nl: "De andere helft van dat voorbeeld is linkedSignal, stabiel sinds v20, en die vult het gat dat een alleen-lezen resource laat vallen. Je wilt een waarde die begint bij geladen gegevens, schrijfbaar blijft, en opnieuw begint zodra de gegevens waar hij vandaan komt veranderen.",
  },
  linked2: {
    en: "The everyday version of this is a select box. The status of a contract comes from the server, the user changes it in the form, and then the user opens a different contract. A computed cannot do it, because a computed is not writable. A signal plus an effect can do it, and that is the shape I keep flagging in review, because the effect writes state on a schedule the reader cannot see. A linkedSignal says the same thing in one declaration: here is my source, here is how I compute a value from it, and the previous value is available while I do.",
    nl: "De alledaagse vorm hiervan is een keuzelijst. De status van een contract komt van de server, de gebruiker wijzigt hem in het formulier, en daarna opent de gebruiker een ander contract. Een computed kan dit niet, want een computed is niet schrijfbaar. Een signal met een effect kan het wel, en dat is de vorm die ik in reviews blijf aanstrepen, omdat het effect state schrijft op een moment dat de lezer niet ziet. Een linkedSignal zegt hetzelfde in één declaratie: dit is mijn bron, zo bereken ik daar een waarde uit, en de vorige waarde ligt daarbij binnen handbereik.",
  },
  linked3: {
    en: "Read the computation as a reset rule. When the source changes, the value is worked out again. Between those moments it is an ordinary writable signal, and the user's edit survives.",
    nl: "Lees de berekening als een resetregel. Verandert de bron, dan wordt de waarde opnieuw bepaald. Tussen die momenten is het een gewoon schrijfbaar signal en blijft de wijziging van de gebruiker staan.",
  },
  zonelessTitle: {
    en: "Zoneless and OnPush, why this matters more now",
    nl: "Zoneless en OnPush, waarom dit nu zwaarder weegt",
  },
  zoneless1: {
    en: "Two milestones are often quoted as one. Zoneless change detection became stable in v20.2.0. It became the default for new applications in v21. In v22 OnPush became the default for new components, and the Default strategy was renamed Eager, which finally names what it was doing.",
    nl: "Twee mijlpalen worden vaak als één genoemd. Zoneless change detection werd stabiel in v20.2.0. In v21 werd het de standaard voor nieuwe applicaties. In v22 werd OnPush de standaard voor nieuwe componenten en kreeg de strategie Default de naam Eager, waarmee eindelijk staat wat hij deed.",
  },
  zoneless2: {
    en: "This changes what a value in a template has to be. With zone.js in the application, a field mutated inside a setTimeout callback was picked up, because the zone had patched setTimeout and reported that something had happened. Without zone.js the framework learns about a change from the signals a template read, from the event bindings in that template, and from the code that explicitly marks a component for check, which is what the async pipe does when a value arrives.",
    nl: "Dat verandert wat een waarde in een template moet zijn. Met zone.js in de applicatie werd een veld dat in een setTimeout-callback werd gewijzigd alsnog opgepikt, want de zone had setTimeout aangepast en meldde dat er iets was gebeurd. Zonder zone.js hoort het framework over een wijziging via de signals die een template heeft gelezen, via de event bindings in die template, en via code die een component expliciet als te controleren markeert, wat de async-pipe doet zodra er een waarde binnenkomt.",
  },
  zoneless3: {
    en: "So a plain class field written from a callback is the pattern that quietly stops updating the screen. A signal keeps working and the async pipe keeps working. That is the practical reason the seam matters even in an application that intends to stay on RxJS. The template wants a signal or a pipe at the end of the chain.",
    nl: "Een gewoon veld op een klasse dat vanuit een callback wordt geschreven, is dus het patroon dat stilletjes stopt met het scherm bijwerken. Een signal blijft werken en de async-pipe blijft werken. Dat is de praktische reden dat de naad ook telt in een applicatie die bij RxJS wil blijven. De template wil aan het eind van de keten een signal of een pipe.",
  },
  migrationTitle: {
    en: "A migration path for an Angular 12 codebase",
    nl: "Een migratiepad voor een Angular 12-codebase",
  },
  migration1: {
    en: "The application I would most like to help is the one that came off AngularJS a few years ago, runs on Angular 12, and has a service layer full of subjects that does its job. There is no case for a rewrite and there is a good case for keeping the runtime current, because the versions in support have moved on. Here is a service from that era, written with the APIs Angular 12 had: constructor injection, a BehaviorSubject and operators from the rxjs/operators path.",
    nl: "De applicatie die ik het liefst help, is de applicatie die een paar jaar geleden van AngularJS af kwam, op Angular 12 draait en een servicelaag vol subjects heeft die gewoon zijn werk doet. Er is geen reden voor een herbouw en er is een goede reden om de runtime bij te houden, want de ondersteunde versies zijn verder gegaan. Dit is een service uit die tijd, geschreven met de API's die Angular 12 had: injectie via de constructor, een BehaviorSubject en operators uit het pad rxjs/operators.",
  },
  migration2: {
    en: "The step I would take is additive. Leave that service where it is. Put a facade beside it that speaks signals, and let new components and touched components read the facade. This second sample uses the current APIs, inject, toSignal and computed, so it belongs to the end state and not to the codebase you are starting from.",
    nl: "De stap die ik zou zetten, is een toevoeging. Laat die service staan. Zet er een facade naast die signals spreekt, en laat nieuwe componenten en componenten die je toch aanraakt de facade lezen. Dit tweede voorbeeld gebruikt de huidige API's, inject, toSignal en computed, en hoort dus bij de eindsituatie en niet bij de codebase waar je begint.",
  },
  step1: {
    en: "Bring the runtime up first, one major at a time with the update tool. Nothing below this line is available until the version is.",
    nl: "Breng eerst de runtime bij, één major per keer met het updategereedschap. Niets van wat hieronder staat, is beschikbaar zolang de versie dat niet is.",
  },
  step2: {
    en: "Convert what the template reads. The input function and computed replace decorated inputs and getters without changing a single timing.",
    nl: "Zet om wat de template leest. De functie input en computed vervangen inputs met een decorator en getters zonder dat er ook maar iets aan de timing verandert.",
  },
  step3: {
    en: "Add the facade beside the service. Nothing that works today changes, so nothing that works today can break.",
    nl: "Zet de facade naast de service. Er verandert niets aan wat vandaag werkt, dus er kan niets stukgaan aan wat vandaag werkt.",
  },
  step4: {
    en: "Move components one at a time, and delete one manual subscribe every time you move one.",
    nl: "Verplaats componenten één voor één en haal bij elke verplaatsing één handmatige subscribe weg.",
  },
  step5: {
    en: "Leave the pipelines alone. They keep doing the work they were written for, and the facade is where they turn into signals.",
    nl: "Laat de pijplijnen met rust. Ze blijven het werk doen waarvoor ze zijn geschreven, en in de facade worden ze signals.",
  },
  migration3: {
    en: "Every step compiles, ships and reverts on its own. That is the same discipline I use when a live page moves to a new stack. Keep the old path alive until the new one has proven itself, and keep the switch small enough to flip back.",
    nl: "Elke stap compileert, gaat live en is los terug te draaien. Dat is dezelfde discipline die ik gebruik als een live pagina naar een nieuwe stack verhuist. Houd het oude pad in leven tot het nieuwe zich heeft bewezen en houd de schakelaar klein genoeg om terug te zetten.",
  },
  keepTitle: {
    en: "What I would not migrate",
    nl: "Wat ik niet zou migreren",
  },
  keepPipelineLabel: { en: "A working operator pipeline.", nl: "Een werkende pijplijn met operators." },
  keepPipelineBody: {
    en: "If it contains switchMap, concatMap or exhaustMap, it encodes a decision about what happens when two of something overlap. Rewriting it in signals means taking that decision again in a language that cannot express it.",
    nl: "Zit er switchMap, concatMap of exhaustMap in, dan legt hij een beslissing vast over wat er gebeurt als twee dingen elkaar overlappen. Hem in signals herschrijven betekent die beslissing opnieuw nemen in een taal die haar niet kan uitdrukken.",
  },
  keepCacheLabel: { en: "A shared cache.", nl: "Een gedeelde cache." },
  keepCacheBody: {
    en: "A stream with shareReplay serving several subscribers is doing multicasting. That is not state, that is one execution shared, and the graph has no word for it.",
    nl: "Een stream met shareReplay die meerdere afnemers bedient, deelt één uitvoering. Dat is geen state, dat is delen, en de graaf heeft daar geen woord voor.",
  },
  keepSocketLabel: { en: "A socket or an event feed.", nl: "Een socket of een gebeurtenisstroom." },
  keepSocketBody: {
    en: "Push connections belong to the library that models them. Give the template a signal at the end of the chain and leave the rest as it is.",
    nl: "Verbindingen die zelf duwen, horen bij de bibliotheek die ze beschrijft. Geef de template aan het eind van de keten een signal en laat de rest staan.",
  },
  keepHttpLabel: { en: "The HttpClient boundary.", nl: "De grens bij HttpClient." },
  keepHttpBody: {
    en: "Interceptors, retries and error handling are written against Observables in v22, and HttpClient is what a resource is built on. A call that already carries retry and error handling is working code, and moving it for the sake of symmetry is a rewrite with no case behind it.",
    nl: "Interceptors, retries en foutafhandeling zijn in v22 op Observables geschreven, en een resource is op HttpClient gebouwd. Een aanroep met retry en foutafhandeling eromheen is werkende code, en hem verplaatsen voor de symmetrie is een herschrijving zonder onderbouwing.",
  },
  keepFormsLabel: { en: "Router events and form values.", nl: "Routergebeurtenissen en formulierwaarden." },
  keepFormsBody: {
    en: "Both are Observables in v22. Read them through toSignal where a template needs them and leave the source where it is.",
    nl: "Beide zijn in v22 Observables. Lees ze via toSignal waar een template ze nodig heeft en laat de bron staan waar hij staat.",
  },
  keep1: {
    en: "And the general one. Code that works, that nobody has had to open in a year, and that no new feature touches, is not a migration candidate. A rewrite needs a reason that survives the sentence about the new API being nicer.",
    nl: "En de algemene regel. Code die werkt, die niemand in een jaar heeft hoeven openen en die geen enkele nieuwe functie raakt, is geen kandidaat voor migratie. Een herschrijving heeft een reden nodig die de zin overleeft dat de nieuwe API prettiger is.",
  },
  closingTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  closing1: {
    en: "Signals are the value the template reads. RxJS is the timing, the ordering and the cancellation around how that value arrived. The seam between them is two functions and it costs nothing to cross, which is exactly why the question is asked per value and not per application.",
    nl: "Signals zijn de waarde die de template leest. RxJS is de timing, de volgorde en het afbreken rond de manier waarop die waarde binnenkwam. De naad ertussen is twee functies en die oversteek kost niets, en juist daarom stel je de vraag per waarde en niet per applicatie.",
  },
  closing2: {
    en: "The developer I took through streams got stuck exactly where the two meet. Not on map, and not on the pipe syntax. On what should happen when the second request starts before the first has answered. That question has the same answer today as it had then. Decide it with an operator, and let the template read the result as a signal.",
    nl: "De ontwikkelaar die ik door streams heen loodste, liep precies vast op de plek waar die twee elkaar raken. Niet op map en niet op de syntax van pipe. Op wat er moet gebeuren als het tweede verzoek begint voordat het eerste heeft geantwoord. Die vraag heeft vandaag hetzelfde antwoord als toen. Beslis hem met een operator en laat de template het resultaat als signal lezen.",
  },
  nodeQuantity: { en: "quantity", nl: "aantal" },
  nodeSubtotal: { en: "subtotal", nl: "subtotaal" },
  nodeTemplate: { en: "Template", nl: "Template" },
  nodeKeystrokes: { en: "Keystrokes", nl: "Toetsaanslagen" },
  nodeDebounceSub: { en: "waits for a pause", nl: "wacht op een pauze" },
  nodeSwitchSub: { en: "cancels the previous request", nl: "breekt het vorige verzoek af" },
  nodeSubscriber: { en: "Subscriber", nl: "Afnemer" },
  nodeSubscriberSub: { en: "async pipe", nl: "async-pipe" },
  edgeRecomputes: { en: "recomputes", nl: "herberekent" },
  edgeReads: { en: "reads", nl: "leest" },
  edgeAfterPause: { en: "after 250ms", nl: "na 250ms" },
  edgeEmits: { en: "emits over time", nl: "geeft door in de tijd" },
  seamSource: { en: "searchTerm", nl: "zoekterm" },
  seamOperatorsSub: { en: "timing and cancellation", nl: "timing en afbreken" },
  seamResult: { en: "matches", nl: "resultaten" },
  seamResultSub: { en: "read in the template", nl: "gelezen in de template" },
  edgeOpens: { en: "opens", nl: "opent" },
  edgeCloses: { en: "closes", nl: "sluit" },
} as const;
