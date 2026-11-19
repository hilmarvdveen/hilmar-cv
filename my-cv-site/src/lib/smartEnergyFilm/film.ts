import { easeInOut, progressBetween } from "@/lib/smartEnergyExplainer/frame";
import {
  ARROWS,
  BLOCKS,
  FOCUS_LAYOUTS,
  LEGEND_KINDS,
  SAFETY_MECHANISMS,
  type ArrowId,
  type BlockId,
  type ChipId,
  type FocusLayoutId,
  type Hop,
  type LineKind,
  type SafetyMechanism,
} from "./layout";

export type TabId = "overview" | "reading" | "command" | "customer" | "safety" | "scale" | "cloud";

export const FILM_TABS: readonly TabId[] = ["overview", "reading", "command", "customer", "safety", "scale", "cloud"];

export const BEAT_IDS = {
  overview: ["orient", "readingsIn", "commandsOut", "householdWatches"],
  reading: ["orient", "focus", "deviceToHub", "checkpoint", "validation", "transaction"],
  command: ["orient", "focus", "plan", "expire", "store", "send", "deliver", "acknowledge", "confirm"],
  customer: ["orient", "focus", "firstView", "polling", "routeHandler", "apiRead", "notModified"],
  safety: ["orient", "focus", "duplicate", "race", "lock", "audit"],
  scale: ["orient", "out", "up", "down", "next", "levers"],
  cloud: ["orient", "apps", "identities", "controls", "gates"],
} as const;

export type BeatIdOf<Tab extends TabId> = (typeof BEAT_IDS)[Tab][number];

export type BeatId = BeatIdOf<TabId>;

export type BeatKind = "orient" | "focus" | "step";

export type ScaleStep = "out" | "up" | "down" | "next" | "levers";

export type BeatDurations = { enterMilliseconds: number; hopMilliseconds: number; holdMilliseconds: number };

export type Beat<Tab extends TabId = TabId> = {
  id: BeatIdOf<Tab>;
  kind: BeatKind;
  layout: FocusLayoutId;
  visible: ReadonlySet<BlockId>;
  emphasised: ReadonlySet<BlockId>;
  hops: readonly Hop[];
  chips: readonly ChipId[];
  legend: readonly LineKind[];
  safety?: SafetyMechanism;
  scale?: ScaleStep;
  durations: BeatDurations;
};

export type BeatTable = { [Tab in TabId]: readonly Beat<Tab>[] };

type StepSpec = {
  id: string;
  emphasised: readonly BlockId[];
  hops?: readonly Hop[];
  chips?: readonly ChipId[];
  safety?: SafetyMechanism;
  scale?: ScaleStep;
};

type TabSpec = {
  chain: readonly BlockId[];
  orientEmphasised?: readonly BlockId[];
  layout: FocusLayoutId;
  focus: boolean;
  animated?: boolean;
  steps: readonly StepSpec[];
};

const ORIENT_DURATIONS: BeatDurations = { enterMilliseconds: 800, hopMilliseconds: 0, holdMilliseconds: 3000 };

const FOCUS_DURATIONS: BeatDurations = { enterMilliseconds: 1000, hopMilliseconds: 0, holdMilliseconds: 2400 };

const STEP_DURATIONS: BeatDurations = { enterMilliseconds: 300, hopMilliseconds: 800, holdMilliseconds: 2600 };

const ANIMATED_DURATIONS: BeatDurations = { enterMilliseconds: 300, hopMilliseconds: 0, holdMilliseconds: 4200 };

const ALL_BLOCKS: readonly BlockId[] = BLOCKS.map((block) => block.id);

const READING_CHAIN: readonly BlockId[] = ["battery", "iotHub", "gateway", "database"];

const COMMAND_CHAIN: readonly BlockId[] = ["prices", "planner", "database", "steering", "serviceBus", "gateway", "iotHub", "battery"];

const CUSTOMER_CHAIN: readonly BlockId[] = ["browser", "dashboard", "api", "database"];

const SAFETY_CHAIN: readonly BlockId[] = ["gateway", "steering", "database"];

const AZURE_SIDE: readonly BlockId[] = ["iotHub", "serviceBus", "gateway", "api", "planner", "steering", "dashboard", "database"];

const COMPUTE_SIDE: readonly BlockId[] = ["gateway", "api", "planner", "steering", "dashboard"];

const arrowById = (id: ArrowId) => ARROWS.find((arrow) => arrow.id === id) as (typeof ARROWS)[number];

const kindsOf = (arrows: Iterable<ArrowId>): readonly LineKind[] => {
  const kinds = new Set([...arrows].map((id) => arrowById(id).kind));
  return LEGEND_KINDS.filter((kind) => kinds.has(kind));
};

const hopArrows = (beats: readonly Pick<Beat, "hops">[]): Set<ArrowId> => new Set(beats.flatMap((beat) => beat.hops.map((hop) => hop.arrow)));

const arrowsAtFullStrengthOf = (beats: readonly Beat[], beatIndex: number): ReadonlySet<ArrowId> => {
  const beat = beats[beatIndex];
  const drawn = FOCUS_LAYOUTS[beat.layout].landscape.arrows;
  const tabArrows = hopArrows(beats);
  if (tabArrows.size === 0) {
    return new Set(ARROWS.filter((arrow) => drawn[arrow.id] && arrow.ends.every((end) => beat.emphasised.has(end))).map((arrow) => arrow.id));
  }
  return beat.kind === "step" ? hopArrows(beats.slice(0, beatIndex + 1)) : tabArrows;
};

const buildTab = (spec: TabSpec): readonly Beat[] => {
  const stepLayout = spec.layout;
  const raw: Beat[] = [
    {
      id: "orient",
      kind: "orient",
      layout: "whole",
      visible: new Set(ALL_BLOCKS),
      emphasised: new Set(spec.orientEmphasised ?? spec.chain),
      hops: [],
      chips: [],
      legend: [],
      durations: ORIENT_DURATIONS,
    },
    ...(spec.focus
      ? [
          {
            id: "focus",
            kind: "focus",
            layout: stepLayout,
            visible: new Set(spec.chain),
            emphasised: new Set(spec.chain),
            hops: [],
            chips: [],
            legend: [],
            durations: FOCUS_DURATIONS,
          },
        ]
      : []),
    ...spec.steps.map((step) => ({
      id: step.id,
      kind: "step",
      layout: stepLayout,
      visible: new Set(spec.chain),
      emphasised: new Set(step.emphasised),
      hops: step.hops ?? [],
      chips: step.chips ?? [],
      legend: [],
      ...(step.safety ? { safety: step.safety } : {}),
      ...(step.scale ? { scale: step.scale } : {}),
      durations: spec.animated ? ANIMATED_DURATIONS : STEP_DURATIONS,
    })),
  ] as Beat[];
  return raw.map((beat, index) => ({
    ...beat,
    legend: beat.kind === "step" && beat.hops.length > 0 ? kindsOf(beat.hops.map((hop) => hop.arrow)) : kindsOf(arrowsAtFullStrengthOf(raw, index)),
  }));
};

const hop = (arrow: ArrowId, reverse = false): Hop => (reverse ? { arrow, reverse } : { arrow });

export const BEATS = {
  overview: buildTab({
    chain: ALL_BLOCKS,
    layout: "whole",
    focus: false,
    steps: [
      {
        id: "readingsIn",
        emphasised: READING_CHAIN,
        hops: [hop("batteryToHub"), hop("hubToGateway"), hop("gatewayToDatabase")],
      },
      {
        id: "commandsOut",
        emphasised: ["database", "steering", "serviceBus", "gateway", "iotHub", "battery"],
        hops: [hop("databaseToSteering"), hop("steeringToQueue"), hop("queueToGateway"), hop("gatewayToHub"), hop("hubToBattery")],
        chips: ["queueProOnly"],
      },
      {
        id: "householdWatches",
        emphasised: CUSTOMER_CHAIN,
        hops: [hop("browserToDashboard"), hop("dashboardToApi"), hop("apiToDatabase")],
      },
    ],
  }),
  reading: buildTab({
    chain: READING_CHAIN,
    layout: "reading",
    focus: true,
    steps: [
      { id: "deviceToHub", emphasised: ["battery", "iotHub"], hops: [hop("batteryToHub")] },
      { id: "checkpoint", emphasised: ["iotHub", "gateway"], hops: [hop("hubToGateway")], chips: ["blobCheckpoints"] },
      { id: "validation", emphasised: ["gateway"] },
      { id: "transaction", emphasised: ["gateway", "database"], hops: [hop("gatewayToDatabase")] },
    ],
  }),
  command: buildTab({
    chain: COMMAND_CHAIN,
    layout: "command",
    focus: true,
    steps: [
      { id: "plan", emphasised: ["prices", "planner", "database"], hops: [hop("pricesToPlanner"), hop("plannerToDatabase")] },
      { id: "expire", emphasised: ["database", "steering"], hops: [hop("databaseToSteering")] },
      { id: "store", emphasised: ["steering", "database"], hops: [hop("databaseToSteering", true)], chips: ["idempotencyKey"] },
      { id: "send", emphasised: ["steering", "serviceBus"], hops: [hop("steeringToQueue")], chips: ["queueProOnly", "kedaProOnly"] },
      {
        id: "deliver",
        emphasised: ["serviceBus", "gateway", "iotHub", "battery"],
        hops: [hop("queueToGateway"), hop("gatewayToHub"), hop("hubToBattery")],
      },
      { id: "acknowledge", emphasised: ["iotHub", "gateway"], hops: [hop("gatewayToHub", true)] },
      { id: "confirm", emphasised: ["gateway", "database"], hops: [hop("gatewayToDatabase")] },
    ],
  }),
  customer: buildTab({
    chain: CUSTOMER_CHAIN,
    layout: "customer",
    focus: true,
    steps: [
      { id: "firstView", emphasised: ["browser", "dashboard"], hops: [hop("browserToDashboard", true)] },
      { id: "polling", emphasised: ["browser", "dashboard"], hops: [hop("browserToDashboard")] },
      { id: "routeHandler", emphasised: ["dashboard", "api"], hops: [hop("dashboardToApi")], chips: ["token", "internalIngress"] },
      { id: "apiRead", emphasised: ["api", "database"], hops: [hop("apiToDatabase"), hop("apiToDatabase", true)] },
      {
        id: "notModified",
        emphasised: ["browser", "dashboard", "api"],
        hops: [hop("dashboardToApi", true), hop("browserToDashboard", true)],
      },
    ],
  }),
  safety: buildTab({
    chain: SAFETY_CHAIN,
    layout: "safety",
    focus: true,
    animated: true,
    steps: SAFETY_MECHANISMS.map((mechanism) => ({
      id: mechanism,
      emphasised: mechanism === "race" ? ["steering", "database"] : mechanism === "duplicate" ? ["gateway", "database"] : ["database"],
      safety: mechanism,
    })),
  }),
  scale: buildTab({
    chain: ALL_BLOCKS,
    layout: "whole",
    focus: false,
    animated: true,
    steps: [
      { id: "out", emphasised: ["gateway", "serviceBus"], scale: "out", chips: ["replicasLever", "queueLengthLever", "queueProOnly"] },
      { id: "up", emphasised: ["iotHub", "serviceBus", "database"], scale: "up", chips: ["iotHubTier", "serviceBusPremium", "databaseTier"] },
      { id: "down", emphasised: ["gateway", "api", "dashboard"], scale: "down" },
      { id: "next", emphasised: ["planner", "gateway", "dashboard"], scale: "next" },
      {
        id: "levers",
        emphasised: ["gateway", "serviceBus", "iotHub", "database"],
        scale: "levers",
        chips: ["replicasLever", "queueLengthLever", "iotHubTier", "serviceBusPremium", "databaseTier"],
      },
    ],
  }),
  cloud: buildTab({
    chain: ALL_BLOCKS,
    orientEmphasised: AZURE_SIDE,
    layout: "cloud",
    focus: false,
    steps: [
      { id: "apps", emphasised: COMPUTE_SIDE },
      { id: "identities", emphasised: COMPUTE_SIDE, chips: ["keyVault"] },
      {
        id: "controls",
        emphasised: ALL_BLOCKS,
        chips: ["deviceKey", "hubIdentity", "parameterised", "contentPolicy", "token", "internalIngress", "entraQueue"],
      },
      { id: "gates", emphasised: ALL_BLOCKS },
    ],
  }),
} as unknown as BeatTable;

export const RECOMMENDED_STILL: { [Tab in TabId]: BeatIdOf<Tab> } = {
  overview: "orient",
  reading: "transaction",
  command: "confirm",
  customer: "notModified",
  safety: "audit",
  scale: "levers",
  cloud: "gates",
};

export type Packet = { arrow: ArrowId; fraction: number };

export type BeatRenderState = {
  tab: TabId;
  beatIndex: number;
  beatCount: number;
  beat: Beat;
  fromLayout: FocusLayoutId;
  layoutShare: number;
  hopsShown: number;
  activeHop: number | null;
  packet: Packet | null;
  chips: readonly ChipId[];
  legend: readonly LineKind[];
  safety: { mechanism: SafetyMechanism; progress: number; finished: readonly SafetyMechanism[] } | null;
  scale: { step: ScaleStep; progress: number } | null;
  progress: number;
  elapsedInBeat: number;
};

export type FilmRenderState = BeatRenderState & { tabIndex: number; tabProgress: number };

const beatsOf = (tab: TabId): readonly Beat[] => BEATS[tab] as readonly Beat[];

export const beatLengthMilliseconds = (beat: Beat): number =>
  beat.durations.enterMilliseconds + beat.hops.length * beat.durations.hopMilliseconds + beat.durations.holdMilliseconds;

export const beatIndexOf = <Tab extends TabId>(tab: Tab, beat: BeatIdOf<Tab>): number =>
  beatsOf(tab).findIndex((candidate) => candidate.id === beat);

export const arrowsAtFullStrength = (tab: TabId, beatIndex: number): ReadonlySet<ArrowId> => arrowsAtFullStrengthOf(beatsOf(tab), beatIndex);

export type HopNumber = { arrow: ArrowId; reverse: boolean; number: number; current: boolean; indexInBeat: number };

export const hopNumbers = (tab: TabId, beatIndex: number): readonly HopNumber[] => {
  const beats = beatsOf(tab);
  const first = tab === "overview" ? beatIndex : 0;
  let count = 0;
  return beats.slice(first, beatIndex + 1).flatMap((beat, offset) =>
    beat.hops.map((item, indexInBeat) => {
      count += 1;
      return { arrow: item.arrow, reverse: Boolean(item.reverse), number: count, current: first + offset === beatIndex, indexInBeat };
    }),
  );
};

const layoutBefore = (tab: TabId, beatIndex: number): FocusLayoutId => {
  if (beatIndex > 0) {
    return beatsOf(tab)[beatIndex - 1].layout;
  }
  const tabIndex = FILM_TABS.indexOf(tab);
  return tabIndex === 0 ? beatsOf(tab)[0].layout : (beatsOf(FILM_TABS[tabIndex - 1]).at(-1) as Beat).layout;
};

const SAFETY_SHARE = 0.85;

const SCALE_SHARE = 0.7;

export const beatRenderState = (tab: TabId, beatIndex: number, progress: number): BeatRenderState => {
  const beats = beatsOf(tab);
  const index = Math.min(beats.length - 1, Math.max(0, beatIndex));
  const beat = beats[index];
  const clamped = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const length = beatLengthMilliseconds(beat);
  const elapsed = clamped * length;
  const { enterMilliseconds, hopMilliseconds } = beat.durations;
  const fromLayout = layoutBefore(tab, index);
  const layoutShare = fromLayout === beat.layout ? 1 : easeInOut(progressBetween(elapsed, 0, enterMilliseconds));
  const travel = elapsed - enterMilliseconds;
  const hopCount = beat.hops.length;
  const activeHop = hopCount === 0 || travel < 0 ? null : Math.min(hopCount - 1, Math.floor(travel / hopMilliseconds));
  const running = activeHop !== null && travel < hopCount * hopMilliseconds;
  const current = activeHop === null ? null : beat.hops[activeHop];
  const share = activeHop === null ? 0 : easeInOut(progressBetween(travel - activeHop * hopMilliseconds, 0, hopMilliseconds * 0.85));
  const animatedLength = length - enterMilliseconds;
  const mechanismIndex = beat.safety ? SAFETY_MECHANISMS.indexOf(beat.safety) : -1;
  return {
    tab,
    beatIndex: index,
    beatCount: beats.length,
    beat,
    fromLayout,
    layoutShare,
    hopsShown: activeHop === null ? 0 : activeHop + 1,
    activeHop,
    packet: running && current ? { arrow: current.arrow, fraction: current.reverse ? 1 - share : share } : null,
    chips: beat.chips,
    legend: beat.legend,
    safety: beat.safety
      ? {
          mechanism: beat.safety,
          progress: progressBetween(elapsed, enterMilliseconds, enterMilliseconds + animatedLength * SAFETY_SHARE),
          finished: SAFETY_MECHANISMS.slice(0, mechanismIndex),
        }
      : null,
    scale: beat.scale ? { step: beat.scale, progress: progressBetween(elapsed, enterMilliseconds, enterMilliseconds + animatedLength * SCALE_SHARE) } : null,
    progress: clamped,
    elapsedInBeat: elapsed,
  };
};

export const beatEndState = (tab: TabId, beatIndex: number): BeatRenderState => beatRenderState(tab, beatIndex, 1);

type FilmEntry = { tab: TabId; beatIndex: number; startMilliseconds: number; lengthMilliseconds: number };

const FILM_ENTRIES: readonly FilmEntry[] = FILM_TABS.flatMap((tab) => beatsOf(tab).map((beat, beatIndex) => ({ tab, beatIndex, beat }))).reduce<FilmEntry[]>(
  (entries, { tab, beatIndex, beat }) => {
    const previous = entries.at(-1);
    const startMilliseconds = previous ? previous.startMilliseconds + previous.lengthMilliseconds : 0;
    return [...entries, { tab, beatIndex, startMilliseconds, lengthMilliseconds: beatLengthMilliseconds(beat) }];
  },
  [],
);

export const FILM_PASS_MILLISECONDS = FILM_ENTRIES.reduce((total, entry) => total + entry.lengthMilliseconds, 0);

const tabSpan = (tab: TabId): { start: number; length: number } => {
  const entries = FILM_ENTRIES.filter((entry) => entry.tab === tab);
  return { start: entries[0].startMilliseconds, length: entries.reduce((total, entry) => total + entry.lengthMilliseconds, 0) };
};

export const filmRenderStateAtMilliseconds = (elapsed: number): FilmRenderState => {
  const clamped = Number.isFinite(elapsed) ? Math.min(FILM_PASS_MILLISECONDS, Math.max(0, elapsed)) : 0;
  const found = FILM_ENTRIES.findLastIndex((entry) => entry.startMilliseconds <= clamped);
  const entry = FILM_ENTRIES[found];
  const span = tabSpan(entry.tab);
  return {
    ...beatRenderState(entry.tab, entry.beatIndex, (clamped - entry.startMilliseconds) / entry.lengthMilliseconds),
    tabIndex: FILM_TABS.indexOf(entry.tab),
    tabProgress: Math.min(1, (clamped - span.start) / span.length),
  };
};

export const FILM_FRAMES_PER_SECOND = 30;

export const filmFrameCount = Math.floor((FILM_PASS_MILLISECONDS * FILM_FRAMES_PER_SECOND) / 1000);

export const filmMillisecondsForFrame = (frame: number): number => (frame * 1000) / FILM_FRAMES_PER_SECOND;
