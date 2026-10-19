import { CONFIGURED_PORTS, PORTS } from "./drawing";
import { CONSISTENCY_BEATS, easeInOut, explainerFrameAtMilliseconds, progressBetween } from "./frame";
import { TOTAL_DURATION_MILLISECONDS, sceneStartMilliseconds, type SceneId } from "./timeline";

const frameIn = (scene: SceneId, offset: number) => explainerFrameAtMilliseconds(sceneStartMilliseconds(scene) + offset);

describe("easing helpers", () => {
  it("eases in and out between clamped edges", () => {
    expect(easeInOut(-1)).toBe(0);
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(0.25)).toBeCloseTo(0.125);
    expect(easeInOut(0.5)).toBe(0.5);
    expect(easeInOut(0.75)).toBeCloseTo(0.875);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(2)).toBe(1);
  });

  it("measures progress between two times", () => {
    expect(progressBetween(50, 100, 200)).toBe(0);
    expect(progressBetween(150, 100, 200)).toBe(0.5);
    expect(progressBetween(250, 100, 200)).toBe(1);
  });
});

describe("explainerFrameAtMilliseconds", () => {
  it("equals frame zero at the total", () => {
    expect(explainerFrameAtMilliseconds(TOTAL_DURATION_MILLISECONDS)).toEqual(explainerFrameAtMilliseconds(0));
  });

  it("builds the title with the claim and the five questions one by one", () => {
    expect(frameIn("title", 0)).toMatchObject({ stage: "title", sceneIndex: 0, title: { claimOpacity: 0, questionsShown: 0 } });
    expect(frameIn("title", 1000).title.questionsShown).toBe(1);
    expect(frameIn("title", 2900).title).toEqual({ claimOpacity: 1, questionsShown: 5 });
  });

  it("fades in one layer per 800 milliseconds in the layers scene", () => {
    expect(frameIn("layers", 400).layerOpacity).toMatchObject({ devices: 0.5, hub: 0, planning: 0 });
    expect(frameIn("layers", 1200).layerOpacity).toMatchObject({ devices: 1, hub: 0.5, gateway: 0 });
    expect(Object.values(frameIn("layers", 5900).layerOpacity)).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(frameIn("telemetry", 0).layerOpacity.planning).toBe(1);
  });

  it("moves the packet over six hops with its badges", () => {
    const hops = [0, 1100, 2200, 3300, 4400, 5500].map((start) => frameIn("telemetry", start + 550).packet);
    expect(hops.map((packet) => packet?.edge)).toEqual([
      "simulatorToHub",
      "hubToGateway",
      "gatewayToDatabase",
      "databaseToApi",
      "apiToDashboard",
      "dashboardToBrowser",
    ]);
    expect(hops.every((packet) => packet?.fraction === 0.5)).toBe(true);
    expect(frameIn("telemetry", 1000).telemetryBadges).toEqual([]);
    expect(frameIn("telemetry", 2200).telemetryBadges).toEqual(["checkpoint"]);
    expect(frameIn("telemetry", 3800).telemetryBadges).toEqual(["checkpoint", "hypertable", "currentState", "rollup"]);
    expect(frameIn("telemetry", 7000)).toMatchObject({
      packet: null,
      telemetryBadges: ["checkpoint", "hypertable", "currentState", "rollup", "etag", "cache", "notModified"],
    });
  });

  it("walks the command from Created to Confirmed with terminal states only in the hold", () => {
    expect(frameIn("command", 500)).toMatchObject({ command: { edge: "plannerToDatabase", fraction: 0.5 }, commandState: null });
    expect(frameIn("command", 1500)).toMatchObject({ command: { edge: "databaseToSteering" }, commandState: "created" });
    expect(frameIn("command", 2500)).toMatchObject({ command: { edge: "steeringToQueue" }, idempotencyKeyShown: true });
    expect(frameIn("command", 3500)).toMatchObject({ command: { edge: "queueToGateway" }, idempotencyKeyShown: true });
    expect(frameIn("command", 4500)).toMatchObject({ command: { edge: "gatewayToHub" }, commandState: "created", idempotencyKeyShown: false });
    expect(frameIn("command", 5500)).toMatchObject({ command: { edge: "hubToBattery" }, commandState: "sent" });
    expect(frameIn("command", 6250)).toMatchObject({ command: { edge: "hubToBattery" }, commandState: "sent" });
    expect(frameIn("command", 6250).command?.fraction).toBeGreaterThan(0.5);
    expect(frameIn("command", 7500)).toMatchObject({ command: null, packet: { edge: "simulatorToHub", fraction: 0.5 }, commandState: "acknowledged" });
    expect(frameIn("command", 7999).terminalStates).toEqual([]);
    expect(frameIn("command", 8100)).toMatchObject({ commandState: "confirmed", terminalStates: [], packet: null });
    expect(frameIn("command", 9900).terminalStates).toEqual(["failed", "expired", "rejected"]);
  });

  it("attaches no adapter, then in-memory, then the configured ones with the clock left in-memory", () => {
    const empty = frameIn("ports", 1000);
    expect(empty.stage).toBe("ports");
    expect(Object.values(empty.ports.adapters).every((side) => side === "none")).toBe(true);
    expect(Object.values(frameIn("ports", 3500).ports.adapters).every((side) => side === "inMemory")).toBe(true);
    const configured = frameIn("ports", 7900).ports;
    for (const port of CONFIGURED_PORTS) {
      expect(configured.adapters[port]).toBe("configured");
    }
    expect(configured.adapters.clock).toBe("inMemory");
    expect(PORTS).toHaveLength(10);
    expect(frameIn("ports", 6000).ports.assistantOpacity).toBe(0);
    expect(configured.assistantOpacity).toBe(1);
  });

  it("brackets each store write with a transaction and a lock while a second thread waits", () => {
    expect(frameIn("stores", 100).stores).toMatchObject({ activeStore: null, transactionOpen: false, lockHolder: null });
    expect(frameIn("stores", 400).stores).toMatchObject({ activeStore: "telemetry", transactionOpen: true, lockHolder: 1, waitingThreads: 1 });
    expect(frameIn("stores", 1000).stores).toMatchObject({ activeStore: "telemetry", transactionOpen: true, lockHolder: 2, waitingThreads: 0 });
    expect(frameIn("stores", 1150).stores).toMatchObject({ activeStore: "telemetry", transactionOpen: false, lockHolder: null });
    expect([300, 1200, 2100, 3000, 3900].map((start) => frameIn("stores", start + 300).stores.activeStore)).toEqual([
      "telemetry",
      "commands",
      "plans",
      "prices",
      "switch",
    ]);
    expect(frameIn("stores", 4900).stores.activeStore).toBeNull();
  });

  it("lights the host row in order", () => {
    expect(frameIn("stores", 4900).stores.hostsLit).toBe(0);
    expect(frameIn("stores", 5000).stores.hostsLit).toBe(1);
    expect(frameIn("stores", 5600).stores.hostsLit).toBe(2);
    expect(frameIn("stores", 8900).stores.hostsLit).toBe(6);
  });

  it("bounces the duplicate reading off the key", () => {
    const arriving = frameIn("consistency", 200).consistency;
    expect(arriving).toMatchObject({ beat: "duplicate", beatsShown: 1, auditOpacity: 0 });
    expect(arriving.duplicate?.secondFraction).toBeNull();
    expect(frameIn("consistency", 1100).consistency.duplicate).toMatchObject({ firstFraction: 1, bounced: false });
    const bounced = frameIn("consistency", 1900).consistency.duplicate;
    expect(bounced?.bounced).toBe(true);
    expect(bounced?.secondFraction).toBeLessThan(1);
  });

  it("keeps the current state where it is when an older reading arrives late", () => {
    const late = frameIn("consistency", 3700).consistency;
    expect(late.beat).toBe("lateReading");
    expect(late.lateReading).toEqual({ lateFraction: 1, arrived: true, currentStateMovesBack: false });
    expect(late.duplicate).toBeNull();
  });

  it("returns already issued when steering runs twice for one period", () => {
    expect(frameIn("consistency", 4200).consistency.idempotency).toEqual({ firstRunIssued: false, secondRunAlreadyIssued: false });
    expect(frameIn("consistency", 5900).consistency.idempotency).toEqual({ firstRunIssued: true, secondRunAlreadyIssued: true });
  });

  it("lets one transition win and the other change zero rows", () => {
    expect(frameIn("consistency", 6200).consistency.compareAndSet).toEqual({ racing: true, winnerRowsChanged: null, loserRowsChanged: null });
    expect(frameIn("consistency", 7500).consistency.compareAndSet).toEqual({ racing: false, winnerRowsChanged: 1, loserRowsChanged: 0 });
  });

  it("runs two session lanes, drops the duplicate and dead letters the expired message", () => {
    const early = frameIn("consistency", 8200).consistency.sessions;
    expect(early).toMatchObject({ duplicateDropped: false, deadLettered: false });
    expect(early?.laneFractions[1]).toBe(0);
    expect(frameIn("consistency", 9900).consistency.sessions).toMatchObject({ laneFractions: [1, 1], duplicateDropped: true, deadLettered: true });
  });

  it("lets one host hold the advisory lock while the other waits for the current schema", () => {
    expect(frameIn("consistency", 10700).consistency.migrationLock).toEqual({ firstHostHoldsLock: true, secondHostWaiting: true, schemaCurrent: false });
    expect(frameIn("consistency", 11900).consistency.migrationLock).toEqual({ firstHostHoldsLock: false, secondHostWaiting: false, schemaCurrent: true });
  });

  it("holds on the audit row with all six beats shown", () => {
    const hold = frameIn("consistency", 13900).consistency;
    expect(hold).toMatchObject({ beat: "hold", beatsShown: CONSISTENCY_BEATS.length, auditOpacity: 1, sessions: null });
    expect(frameIn("consistency", 12000).consistency.auditOpacity).toBe(0);
  });

  it("lights a fifth asset and then each touch point at its beat", () => {
    expect(frameIn("assetKind", 500).assetKind).toEqual({ fifthAssetOpacity: 0.5, touchPointsLit: 0, activeTouchPoint: null });
    expect(frameIn("assetKind", 1000).assetKind).toMatchObject({ touchPointsLit: 1, activeTouchPoint: 0 });
    expect(frameIn("assetKind", 5900).assetKind).toMatchObject({ touchPointsLit: 7, activeTouchPoint: 6 });
    expect(frameIn("assetKind", 7000).assetKind).toMatchObject({ touchPointsLit: 7, activeTouchPoint: null });
  });

  it("scales replicas 0, 1, 3 with the hub tier from F1 to S1, chunks and run-once badges", () => {
    expect(frameIn("command", 0).scale).toBeNull();
    expect(frameIn("scale", 1000).scale).toMatchObject({ replicas: 0, hubTier: "F1", chunks: 0, runOnceOpacity: 0 });
    expect(frameIn("scale", 4000).scale).toMatchObject({ replicas: 1, hubTier: "F1" });
    expect(frameIn("scale", 5200).scale).toMatchObject({ replicas: 3, hubTier: "F1" });
    expect(frameIn("scale", 6000).scale).toMatchObject({ hubTier: "S1", chunks: 1 });
    expect(frameIn("scale", 9900).scale).toEqual({ queueDepth: 1, replicas: 3, hubTier: "S1", chunks: 4, runOnceOpacity: 1 });
  });

  it("lights each security shield at its beat and the gate row only after 8000 milliseconds", () => {
    expect(frameIn("security", 0).security).toEqual({ shieldsLit: 1, activeShield: 0, gateOpacity: 0 });
    expect(frameIn("security", 1400).security).toMatchObject({ shieldsLit: 3, activeShield: 2 });
    expect(frameIn("security", 7999).security).toEqual({ shieldsLit: 11, activeShield: null, gateOpacity: 0 });
    expect(frameIn("security", 9900).security.gateOpacity).toBe(1);
  });

  it("fades in the closing", () => {
    expect(frameIn("closing", 300)).toMatchObject({ stage: "closing", closingOpacity: 0.5 });
  });
});
