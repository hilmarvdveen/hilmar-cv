import {
  BEATS,
  BEAT_IDS,
  FILM_FRAMES_PER_SECOND,
  FILM_PASS_MILLISECONDS,
  FILM_TABS,
  RECOMMENDED_STILL,
  arrowsAtFullStrength,
  beatEndState,
  beatIndexOf,
  beatLengthMilliseconds,
  beatRenderState,
  filmFrameCount,
  filmMillisecondsForFrame,
  filmRenderStateAtMilliseconds,
  hopNumbers,
  type TabId,
} from "./film";
import { FOCUS_LAYOUTS, SAFETY_MECHANISMS } from "./layout";

const orientations = ["landscape", "portrait"] as const;

describe("beat table", () => {
  it("holds the frozen beat ids per tab in order", () => {
    for (const tab of FILM_TABS) {
      expect(BEATS[tab].map((beat) => beat.id)).toEqual(BEAT_IDS[tab]);
    }
    expect(FILM_TABS).toEqual(["overview", "reading", "command", "customer", "safety", "scale", "cloud"]);
  });

  it("starts every tab with an orient beat on the whole drawing and gives only four tabs a focus beat", () => {
    for (const tab of FILM_TABS) {
      expect(BEATS[tab][0].kind).toBe("orient");
      expect(BEATS[tab][0].layout).toBe("whole");
      expect(BEATS[tab].some((beat) => beat.kind === "focus")).toBe(["reading", "command", "customer", "safety"].includes(tab));
    }
    expect(BEATS.overview.every((beat) => beat.layout === "whole")).toBe(true);
    expect(BEATS.scale.every((beat) => beat.layout === "whole")).toBe(true);
  });

  it("emphasises only visible blocks and draws every visible block and every hop in the layout of its beat", () => {
    for (const tab of FILM_TABS) {
      for (const beat of BEATS[tab]) {
        for (const orientation of orientations) {
          const placement = FOCUS_LAYOUTS[beat.layout][orientation];
          for (const id of beat.visible) {
            expect(placement.blocks[id], `${tab} ${beat.id} ${orientation} ${id}`).toBeDefined();
          }
          for (const hop of beat.hops) {
            expect(placement.arrows[hop.arrow], `${tab} ${beat.id} ${orientation} ${hop.arrow}`).toBeDefined();
          }
        }
        for (const id of beat.emphasised) {
          expect(beat.visible.has(id)).toBe(true);
        }
      }
    }
  });

  it("keeps portrait chains of the single flow layouts between three and five blocks", () => {
    for (const layout of Object.values(FOCUS_LAYOUTS)) {
      expect(layout.landscape.viewBox).toEqual({ x: 0, y: 0, width: 1080, height: 860 });
      expect(layout.portrait.viewBox).toEqual({ x: 0, y: 0, width: 320, height: 480 });
    }
    for (const id of ["reading", "customer", "safety"] as const) {
      const count = Object.keys(FOCUS_LAYOUTS[id].portrait.blocks).length;
      expect(count).toBeGreaterThanOrEqual(3);
      expect(count).toBeLessThanOrEqual(5);
    }
  });

  it("follows the corrected command storyboard", () => {
    const hopsOf = (id: (typeof BEAT_IDS.command)[number]) => BEATS.command[beatIndexOf("command", id)].hops;
    expect(hopsOf("plan")).toEqual([{ arrow: "pricesToPlanner" }, { arrow: "plannerToDatabase" }]);
    expect(hopsOf("expire")).toEqual([{ arrow: "databaseToSteering" }]);
    expect(hopsOf("store")).toEqual([{ arrow: "databaseToSteering", reverse: true }]);
    expect(BEATS.command[beatIndexOf("command", "store")].chips).toEqual(["idempotencyKey"]);
    expect(hopsOf("send")).toEqual([{ arrow: "steeringToQueue" }]);
    expect(BEATS.command[beatIndexOf("command", "send")].chips).toEqual(["queueProOnly", "kedaProOnly"]);
    expect(hopsOf("deliver").map((hop) => hop.arrow)).toEqual(["queueToGateway", "gatewayToHub", "hubToBattery"]);
    expect(hopsOf("acknowledge")).toEqual([{ arrow: "gatewayToHub", reverse: true }]);
    expect(hopsOf("confirm")).toEqual([{ arrow: "gatewayToDatabase" }]);
  });

  it("follows the corrected reading, household, consistency, scale and cloud storyboards", () => {
    expect(BEATS.reading.map((beat) => beat.hops.length)).toEqual([0, 0, 1, 1, 0, 1]);
    expect(BEATS.reading[beatIndexOf("reading", "checkpoint")].chips).toEqual(["blobCheckpoints"]);
    expect(BEATS.reading[beatIndexOf("reading", "validation")].emphasised).toEqual(new Set(["gateway"]));
    expect(BEATS.customer[beatIndexOf("customer", "routeHandler")].chips).toEqual(["token", "internalIngress"]);
    expect(BEATS.safety.filter((beat) => beat.safety).map((beat) => beat.safety)).toEqual(SAFETY_MECHANISMS);
    expect(BEATS.scale.filter((beat) => beat.scale).map((beat) => beat.scale)).toEqual(["out", "up", "down", "next", "levers"]);
    expect(BEATS.scale[beatIndexOf("scale", "levers")].chips).toHaveLength(5);
    expect(BEATS.cloud[beatIndexOf("cloud", "identities")].chips).toEqual(["keyVault"]);
    expect(BEATS.cloud[beatIndexOf("cloud", "controls")].chips).toHaveLength(7);
    expect(BEATS.cloud[beatIndexOf("cloud", "gates")].chips).toEqual([]);
  });

  it("lists only the line kinds a beat draws", () => {
    expect(BEATS.reading[beatIndexOf("reading", "deviceToHub")].legend).toEqual(["telemetry"]);
    expect(BEATS.command[beatIndexOf("command", "send")].legend).toEqual(["commands"]);
    expect(BEATS.command[beatIndexOf("command", "plan")].legend).toEqual(["control"]);
    expect(BEATS.customer[beatIndexOf("customer", "firstView")].legend).toEqual(["reads"]);
    expect(BEATS.command[0].legend).toEqual(["telemetry", "commands", "control"]);
    expect(BEATS.safety[beatIndexOf("safety", "race")].legend).toEqual([]);
  });

  it("recommends a still that exists in every tab", () => {
    for (const tab of FILM_TABS) {
      expect(beatIndexOf(tab, RECOMMENDED_STILL[tab] as never)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("hop numbers and full strength arrows", () => {
  it("numbers a story across its beats and marks the current beat", () => {
    const numbers = hopNumbers("command", beatIndexOf("command", "send"));
    expect(numbers.map((item) => item.number)).toEqual([1, 2, 3, 4, 5]);
    expect(numbers.filter((item) => item.current).map((item) => item.arrow)).toEqual(["steeringToQueue"]);
    expect(numbers[3].reverse).toBe(true);
  });

  it("restarts the numbering in each overview beat and has none in the orient beat", () => {
    expect(hopNumbers("overview", 2).map((item) => item.number)).toEqual([1, 2, 3, 4, 5]);
    expect(hopNumbers("overview", 0)).toEqual([]);
    expect(hopNumbers("overview", 3).map((item) => item.arrow)).toEqual(["browserToDashboard", "dashboardToApi", "apiToDatabase"]);
  });

  it("draws the arrows of the beats so far at full strength and the whole story in orient and focus", () => {
    expect([...arrowsAtFullStrength("reading", 0)].sort()).toEqual(["batteryToHub", "gatewayToDatabase", "hubToGateway"]);
    expect([...arrowsAtFullStrength("reading", 1)]).toHaveLength(3);
    expect([...arrowsAtFullStrength("reading", beatIndexOf("reading", "checkpoint"))].sort()).toEqual(["batteryToHub", "hubToGateway"]);
  });

  it("falls back to the arrows between emphasised blocks when a tab has no hops", () => {
    expect([...arrowsAtFullStrength("scale", beatIndexOf("scale", "out"))]).toEqual(["queueToGateway"]);
    expect(arrowsAtFullStrength("safety", beatIndexOf("safety", "race")).size).toBe(0);
  });
});

describe("beat render state", () => {
  const checkpoint = beatIndexOf("reading", "checkpoint");

  it("measures a beat as enter plus hops plus hold", () => {
    const beat = BEATS.reading[checkpoint];
    expect(beatLengthMilliseconds(beat)).toBe(beat.durations.enterMilliseconds + beat.durations.hopMilliseconds + beat.durations.holdMilliseconds);
  });

  it("enters first with no hop, then runs the packet, then holds with the hop still shown", () => {
    const beat = BEATS.reading[checkpoint];
    const length = beatLengthMilliseconds(beat);
    const entering = beatRenderState("reading", checkpoint, 0.01);
    expect(entering.hopsShown).toBe(0);
    expect(entering.activeHop).toBeNull();
    expect(entering.packet).toBeNull();
    const running = beatRenderState("reading", checkpoint, (beat.durations.enterMilliseconds + beat.durations.hopMilliseconds * 0.4) / length);
    expect(running.activeHop).toBe(0);
    expect(running.packet?.arrow).toBe("hubToGateway");
    expect(running.packet?.fraction).toBeGreaterThan(0);
    const holding = beatRenderState("reading", checkpoint, 0.99);
    expect(holding.hopsShown).toBe(1);
    expect(holding.packet).toBeNull();
    expect(holding.chips).toEqual(["blobCheckpoints"]);
  });

  it("runs a reverse hop from its end to its start", () => {
    const index = beatIndexOf("command", "store");
    const beat = BEATS.command[index];
    const length = beatLengthMilliseconds(beat);
    const early = beatRenderState("command", index, (beat.durations.enterMilliseconds + 20) / length);
    const late = beatRenderState("command", index, (beat.durations.enterMilliseconds + beat.durations.hopMilliseconds * 0.8) / length);
    expect(early.packet?.fraction).toBeGreaterThan(0.95);
    expect(late.packet?.fraction).toBeLessThan(early.packet?.fraction ?? 0);
  });

  it("moves through several hops in order", () => {
    const index = beatIndexOf("command", "deliver");
    const beat = BEATS.command[index];
    const length = beatLengthMilliseconds(beat);
    const second = beatRenderState("command", index, (beat.durations.enterMilliseconds + beat.durations.hopMilliseconds * 1.2) / length);
    expect(second.activeHop).toBe(1);
    expect(second.hopsShown).toBe(2);
    expect(second.packet?.arrow).toBe("gatewayToHub");
  });

  it("blends from the layout of the previous beat while the beat enters and settles at one", () => {
    const focus = beatIndexOf("command", "focus");
    expect(beatRenderState("command", focus, 0).fromLayout).toBe("whole");
    expect(beatRenderState("command", focus, 0).layoutShare).toBe(0);
    expect(beatRenderState("command", focus, 1).layoutShare).toBe(1);
    const plan = beatRenderState("command", beatIndexOf("command", "plan"), 0);
    expect(plan.fromLayout).toBe("command");
    expect(plan.layoutShare).toBe(1);
  });

  it("takes the layout before the first beat of a tab from the end of the previous tab", () => {
    expect(beatRenderState("reading", 0, 0).fromLayout).toBe("whole");
    expect(beatRenderState("safety", 0, 0).fromLayout).toBe("customer");
    expect(beatRenderState("overview", 0, 0).fromLayout).toBe("whole");
    expect(beatRenderState("overview", 0, 0).layoutShare).toBe(1);
  });

  it("reports safety progress with the finished mechanisms and scale progress", () => {
    const lock = beatRenderState("safety", beatIndexOf("safety", "lock"), 1);
    expect(lock.safety).toEqual({ mechanism: "lock", progress: 1, finished: ["duplicate", "race"] });
    expect(beatRenderState("safety", beatIndexOf("safety", "focus"), 1).safety).toBeNull();
    const down = beatRenderState("scale", beatIndexOf("scale", "down"), 1);
    expect(down.scale).toEqual({ step: "down", progress: 1 });
    expect(beatRenderState("scale", 0, 1).scale).toBeNull();
  });

  it("clamps progress and beat index and treats a missing number as the start", () => {
    expect(beatRenderState("reading", 99, 2).beatIndex).toBe(BEATS.reading.length - 1);
    expect(beatRenderState("reading", -4, -1).beatIndex).toBe(0);
    expect(beatRenderState("reading", 0, Number.NaN).progress).toBe(0);
    expect(beatRenderState("reading", 0, 0.5).beatCount).toBe(6);
  });

  it("ends every beat with all hops shown and no packet", () => {
    for (const tab of FILM_TABS) {
      BEATS[tab].forEach((beat, index) => {
        const end = beatEndState(tab as TabId, index);
        expect(end.hopsShown).toBe(beat.hops.length);
        expect(end.packet).toBeNull();
        expect(end.activeHop).toBe(beat.hops.length === 0 ? null : beat.hops.length - 1);
        expect(end.progress).toBe(1);
      });
    }
  });
});

describe("film timeline", () => {
  it("is one linear pass over every beat with a whole number of frames", () => {
    const total = FILM_TABS.flatMap((tab) => BEATS[tab]).reduce((sum, beat) => sum + beatLengthMilliseconds(beat), 0);
    expect(FILM_PASS_MILLISECONDS).toBe(total);
    expect(FILM_FRAMES_PER_SECOND).toBe(30);
    expect(Number.isInteger(filmFrameCount)).toBe(true);
    expect(filmFrameCount).toBe((FILM_PASS_MILLISECONDS * 30) / 1000);
    expect(filmMillisecondsForFrame(0)).toBe(0);
    expect(filmMillisecondsForFrame(30)).toBe(1000);
  });

  it("opens on the overview orient beat and closes on the last cloud beat", () => {
    const first = filmRenderStateAtMilliseconds(0);
    expect(first.tab).toBe("overview");
    expect(first.beat.id).toBe("orient");
    expect(first.tabIndex).toBe(0);
    expect(first.tabProgress).toBe(0);
    const last = filmRenderStateAtMilliseconds(FILM_PASS_MILLISECONDS);
    expect(last.tab).toBe("cloud");
    expect(last.beat.id).toBe("gates");
    expect(last.tabProgress).toBe(1);
    expect(filmRenderStateAtMilliseconds(Number.NaN).beatIndex).toBe(0);
    expect(filmRenderStateAtMilliseconds(-5).tab).toBe("overview");
    expect(filmRenderStateAtMilliseconds(FILM_PASS_MILLISECONDS * 3).tab).toBe("cloud");
  });

  it("visits every tab in order as the time runs", () => {
    const seen = new Set<TabId>();
    for (let frame = 0; frame < filmFrameCount; frame += 15) {
      seen.add(filmRenderStateAtMilliseconds(filmMillisecondsForFrame(frame)).tab);
    }
    expect([...seen]).toEqual(FILM_TABS);
  });
});
