import {
  ASSISTANT_PORT_POSITION,
  DRAWING_LAYERS,
  EDGES,
  HOSTS,
  NODES,
  NODE_HEIGHT,
  NODE_WIDTH,
  PORTS,
  RING_CENTRE,
  SECURITY_CONTROLS,
  STORES,
  VIEW_BOX,
  edgeById,
  nodeById,
  pointAlongPolyline,
  polylinePath,
  portPosition,
  type DrawingLayer,
  type HostId,
  type NodeId,
  type PortId,
  type SecurityControlId,
  type StoreId,
} from "@/lib/smartEnergyExplainer/drawing";
import type {
  CommandStateId,
  ConsistencyBeatId,
  ExplainerFrame,
  Mover,
  TelemetryBadgeId,
  TerminalStateId,
} from "@/lib/smartEnergyExplainer/frame";
import { CONSISTENCY_BEATS } from "@/lib/smartEnergyExplainer/frame";
import type { SceneId } from "@/lib/smartEnergyExplainer/timeline";
import type { Point } from "@/lib/flowLayout";

export type SmartEnergyExplainerLabels = {
  scenes: Record<SceneId, { title: string; caption: string }>;
  previous: string;
  next: string;
  pause: string;
  sceneCounter: string;
  title: { heading: string; claim: string; questions: readonly string[] };
  nodes: Record<NodeId, string>;
  telemetryBadges: Record<TelemetryBadgeId, string>;
  commandStates: Record<CommandStateId | TerminalStateId, string>;
  idempotencyKey: string;
  sideExits: string;
  ports: {
    core: string;
    names: Record<PortId, string>;
    inMemory: string;
    configured: Record<Exclude<PortId, "clock">, string>;
    assistant: string;
    noAdapter: string;
  };
  stores: {
    names: Record<StoreId, string>;
    port: string;
    postgres: string;
    inMemory: string;
    transaction: string;
    lock: string;
    waiting: string;
    readOnly: string;
    hosts: Record<HostId, string>;
  };
  consistency: {
    beats: Record<ConsistencyBeatId, string>;
    readingsKey: string;
    reading: string;
    conflict: string;
    currentState: string;
    lateReading: string;
    forwardOnly: string;
    firstRun: string;
    secondRun: string;
    commandKey: string;
    issued: string;
    alreadyIssued: string;
    firstTransition: string;
    secondTransition: string;
    expectedState: string;
    oneRow: string;
    zeroRows: string;
    firstLane: string;
    secondLane: string;
    duplicateDropped: string;
    deadLetter: string;
    firstHost: string;
    secondHost: string;
    advisoryLock: string;
    hostWaits: string;
    schemaCurrent: string;
    audit: string;
  };
  assetKind: { fifthAsset: string; touchPoints: readonly string[] };
  scale: { queueDepth: string; replicas: string; runsOnce: string; retention: string };
  security: { controls: Record<SecurityControlId, string>; gates: readonly string[] };
  closing: { url: string; claim: string; repository: string };
};

type SmartEnergyFlowDrawingProps = {
  frame: ExplainerFrame;
  labels: SmartEnergyExplainerLabels;
};

const NAVY = "#12314e";
const EMERALD = "#059669";
const EMERALD_TEXT = "#065f46";
const GRAY_TEXT = "#374151";
const GRAY_SUPPORT = "#4b5563";
const GRAY_LINE = "#9ca3af";
const WHITE = "#ffffff";
const SMALL = 12;
const BODY = 14;
const DIMMED = 0.75;

const litOpacity = (lit: boolean): number => (lit ? 1 : DIMMED);

type BadgeProps = { at: Point; text: string; tone?: "emerald" | "navy" | "gray"; opacity?: number };

const BADGE_TONES = {
  emerald: { fill: "#ecfdf5", stroke: EMERALD, color: EMERALD_TEXT },
  navy: { fill: "#f9fafb", stroke: NAVY, color: NAVY },
  gray: { fill: WHITE, stroke: GRAY_LINE, color: GRAY_TEXT },
};

function Badge({ at, text, tone = "emerald", opacity = 1 }: BadgeProps) {
  const style = BADGE_TONES[tone];
  const width = text.length * 7.6 + 18;
  return (
    <g opacity={opacity}>
      <rect x={at.x - width / 2} y={at.y - 11} width={width} height={22} rx={11} fill={style.fill} stroke={style.stroke} />
      <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fontWeight={600} fill={style.color}>
        {text}
      </text>
    </g>
  );
}

type BoxProps = { x: number; y: number; width: number; height: number; text: string; dashed?: boolean; highlighted?: boolean; opacity?: number };

function Box({ x, y, width, height, text, dashed = false, highlighted = false, opacity = 1 }: BoxProps) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={highlighted ? "#ecfdf5" : WHITE}
        stroke={highlighted ? EMERALD : GRAY_LINE}
        strokeWidth={highlighted ? 2 : 1}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fill={GRAY_TEXT}>
        {text}
      </text>
    </g>
  );
}

function Dot({ at, color = EMERALD }: { at: Point; color?: string }) {
  return <circle cx={at.x} cy={at.y} r={7} fill={color} stroke={WHITE} strokeWidth={2} />;
}

const moverPoint = (mover: Mover): Point => pointAlongPolyline(edgeById(mover.edge).points, mover.fraction);

function TitleStage({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <g>
      <text x={480} y={110} textAnchor="middle" fontSize={30} fontWeight={800} fill={NAVY}>
        {labels.title.heading}
      </text>
      <text x={480} y={155} textAnchor="middle" fontSize={16} fill={GRAY_TEXT} opacity={frame.title.claimOpacity}>
        {labels.title.claim}
      </text>
      {labels.title.questions.map((question, index) => (
        <text
          key={question}
          x={480}
          y={215 + index * 40}
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
          fill={GRAY_TEXT}
          opacity={index < frame.title.questionsShown ? 1 : 0}
        >
          {question}
        </text>
      ))}
    </g>
  );
}

const TELEMETRY_BADGE_POSITIONS: Record<TelemetryBadgeId, Point> = {
  checkpoint: { x: 475, y: 106 },
  hypertable: { x: 440, y: 292 },
  currentState: { x: 440, y: 318 },
  rollup: { x: 440, y: 344 },
  etag: { x: 595, y: 305 },
  cache: { x: 685, y: 322 },
  notModified: { x: 590, y: 465 },
};

const edgeOpacity = (frame: ExplainerFrame, source: NodeId, target: NodeId): number =>
  Math.min(frame.layerOpacity[nodeById(source).layer], frame.layerOpacity[nodeById(target).layer]);

function SystemNodes({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <>
      {DRAWING_LAYERS.map((layer: DrawingLayer) => (
        <g key={layer} opacity={frame.layerOpacity[layer]}>
          {NODES.filter((node) => node.layer === layer).map((node) => (
            <g key={node.id}>
              <rect
                x={node.position.x}
                y={node.position.y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={8}
                fill={node.tone.background}
                stroke={node.tone.border}
                strokeWidth={1.5}
              />
              <text
                x={node.position.x + NODE_WIDTH / 2}
                y={node.position.y + NODE_HEIGHT / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={SMALL}
                fontWeight={600}
                fill={node.tone.color}
              >
                {labels.nodes[node.id]}
              </text>
            </g>
          ))}
        </g>
      ))}
    </>
  );
}

function CommandOverlay({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <>
      {frame.commandState && <Badge at={{ x: 420, y: 30 }} text={labels.commandStates[frame.commandState]} tone="navy" />}
      {frame.idempotencyKeyShown && <Badge at={{ x: 590, y: 100 }} text={labels.idempotencyKey} tone="gray" />}
      {frame.terminalStates.length > 0 && (
        <text x={215} y={290} fontSize={SMALL} fill={GRAY_SUPPORT}>
          {labels.sideExits}
        </text>
      )}
      {frame.terminalStates.map((state, index) => (
        <Badge key={state} at={{ x: 265, y: 315 + index * 30 }} text={labels.commandStates[state]} tone="gray" />
      ))}
    </>
  );
}

function AssetKindOverlay({ frame, labels }: SmartEnergyFlowDrawingProps) {
  if (frame.sceneId !== "assetKind") {
    return null;
  }
  return (
    <>
      <Box x={215} y={225} width={NODE_WIDTH} height={NODE_HEIGHT} text={labels.assetKind.fifthAsset} highlighted opacity={frame.assetKind.fifthAssetOpacity} />
      {labels.assetKind.touchPoints.map((touchPoint, index) => (
        <text
          key={touchPoint}
          x={215}
          y={300 + index * 24}
          fontSize={SMALL}
          fontWeight={index === frame.assetKind.activeTouchPoint ? 700 : 400}
          fill={index === frame.assetKind.activeTouchPoint ? EMERALD_TEXT : GRAY_TEXT}
          opacity={litOpacity(index < frame.assetKind.touchPointsLit)}
        >
          {`${index + 1}. ${touchPoint}`}
        </text>
      ))}
    </>
  );
}

function ScaleOverlay({ frame, labels }: SmartEnergyFlowDrawingProps) {
  if (frame.scale === null) {
    return null;
  }
  const queue = nodeById("queue").position;
  return (
    <>
      <rect x={queue.x + 6} y={queue.y + 32} width={(NODE_WIDTH - 12) * frame.scale.queueDepth} height={5} rx={2} fill={EMERALD} />
      <text x={queue.x + NODE_WIDTH + 4} y={queue.y + 38} fontSize={SMALL} fill={GRAY_SUPPORT}>
        {labels.scale.queueDepth}
      </text>
      <Badge at={{ x: 545, y: 190 }} text={labels.scale.replicas.replace("{count}", String(frame.scale.replicas))} tone="navy" />
      <Badge at={{ x: 405, y: 106 }} text={frame.scale.hubTier} tone="navy" />
      {Array.from({ length: frame.scale.chunks }, (_, index) => (
        <rect key={index} x={503 + index * 12} y={253} width={8} height={8} rx={1} fill={EMERALD} />
      ))}
      <g opacity={frame.scale.runOnceOpacity}>
        <Badge at={{ x: 685, y: 292 }} text={labels.scale.runsOnce} />
        <Badge at={{ x: 685, y: 186 }} text={labels.scale.runsOnce} />
        <Badge at={{ x: 405, y: 292 }} text={labels.scale.retention} />
      </g>
    </>
  );
}

function SecurityOverlay({ frame, labels }: SmartEnergyFlowDrawingProps) {
  if (frame.sceneId !== "security") {
    return null;
  }
  const gateWidth = 530 / labels.security.gates.length;
  return (
    <>
      {SECURITY_CONTROLS.map((control, index) => {
        const lit = index < frame.security.shieldsLit;
        const node = control.node === null ? null : nodeById(control.node).position;
        return (
          <g key={control.id}>
            {node && <circle cx={node.x + NODE_WIDTH - 4} cy={node.y + 4} r={7} fill={lit ? EMERALD : GRAY_LINE} stroke={WHITE} strokeWidth={2} />}
            <text
              x={215}
              y={292 + index * 18}
              fontSize={SMALL}
              fontWeight={index === frame.security.activeShield ? 700 : 400}
              fill={index === frame.security.activeShield ? EMERALD_TEXT : GRAY_TEXT}
              opacity={litOpacity(lit)}
            >
              {labels.security.controls[control.id]}
            </text>
          </g>
        );
      })}
      <g opacity={frame.security.gateOpacity}>
        {labels.security.gates.map((gate, index) => (
          <Badge key={gate} at={{ x: 215 + gateWidth * (index + 0.5), y: 518 }} text={gate} tone="gray" />
        ))}
      </g>
    </>
  );
}

function SystemStage({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <g>
      {EDGES.map((edge) => (
        <path
          key={edge.id}
          d={polylinePath(edge.points)}
          fill="none"
          stroke={GRAY_LINE}
          strokeWidth={1.5}
          opacity={edgeOpacity(frame, edge.source, edge.target)}
        />
      ))}
      <SystemNodes frame={frame} labels={labels} />
      {frame.telemetryBadges.map((badge) => (
        <Badge key={badge} at={TELEMETRY_BADGE_POSITIONS[badge]} text={labels.telemetryBadges[badge]} />
      ))}
      <CommandOverlay frame={frame} labels={labels} />
      <AssetKindOverlay frame={frame} labels={labels} />
      <ScaleOverlay frame={frame} labels={labels} />
      <SecurityOverlay frame={frame} labels={labels} />
      {frame.packet && <Dot at={moverPoint(frame.packet)} />}
      {frame.command && <Dot at={moverPoint(frame.command)} color={NAVY} />}
    </g>
  );
}

const PORT_WIDTH = 124;
const PORT_HEIGHT = 36;

function PortsStage({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <g>
      <g opacity={frame.ports.ringOpacity}>
        <circle cx={RING_CENTRE.x} cy={RING_CENTRE.y} r={80} fill="#f9fafb" stroke={NAVY} strokeWidth={1.5} />
        <text x={RING_CENTRE.x} y={RING_CENTRE.y} textAnchor="middle" dominantBaseline="central" fontSize={BODY} fontWeight={700} fill={NAVY}>
          {labels.ports.core}
        </text>
        {PORTS.map((port) => {
          const position = portPosition(port);
          const side = frame.ports.adapters[port];
          const adapterText = side === "configured" ? labels.ports.configured[port as Exclude<PortId, "clock">] : labels.ports.inMemory;
          return (
            <g key={port}>
              <rect
                x={position.x - PORT_WIDTH / 2}
                y={position.y - PORT_HEIGHT / 2}
                width={PORT_WIDTH}
                height={PORT_HEIGHT}
                rx={8}
                fill={side === "configured" ? "#ecfdf5" : WHITE}
                stroke={side === "none" ? GRAY_LINE : EMERALD}
              />
              <text x={position.x} y={position.y - 7} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fontWeight={600} fill={NAVY}>
                {labels.ports.names[port]}
              </text>
              {side !== "none" && (
                <text x={position.x} y={position.y + 9} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fill={GRAY_SUPPORT}>
                  {adapterText}
                </text>
              )}
            </g>
          );
        })}
      </g>
      <g opacity={frame.ports.assistantOpacity}>
        <rect
          x={ASSISTANT_PORT_POSITION.x - PORT_WIDTH / 2}
          y={ASSISTANT_PORT_POSITION.y - PORT_HEIGHT / 2}
          width={PORT_WIDTH}
          height={PORT_HEIGHT}
          rx={8}
          fill={WHITE}
          stroke={GRAY_LINE}
          strokeDasharray="5 4"
        />
        <text x={ASSISTANT_PORT_POSITION.x} y={ASSISTANT_PORT_POSITION.y - 7} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fontWeight={600} fill={NAVY}>
          {labels.ports.assistant}
        </text>
        <text x={ASSISTANT_PORT_POSITION.x} y={ASSISTANT_PORT_POSITION.y + 9} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fill={GRAY_SUPPORT}>
          {labels.ports.noAdapter}
        </text>
      </g>
    </g>
  );
}

const STORE_ROW_TOP = 70;
const STORE_ROW_STEP = 44;
const STORE_ROW_HEIGHT = 34;

function StoreRow({ frame, labels, store, index }: SmartEnergyFlowDrawingProps & { store: StoreId; index: number }) {
  const y = STORE_ROW_TOP + index * STORE_ROW_STEP;
  const active = frame.stores.activeStore === store;
  const readOnly = store === "sites";
  return (
    <g>
      <Box x={215} y={y} width={180} height={STORE_ROW_HEIGHT} text={readOnly ? labels.stores.readOnly : ""} highlighted={active && frame.stores.transactionOpen} />
      <Box x={420} y={y} width={120} height={STORE_ROW_HEIGHT} text={labels.stores.names[store]} highlighted={active} />
      <Box x={565} y={y} width={180} height={STORE_ROW_HEIGHT} text={readOnly ? labels.stores.readOnly : ""} highlighted={active && frame.stores.lockHolder !== null} />
      {active && frame.stores.transactionOpen && (
        <>
          <path d={`M227 ${y + 4} h-6 v${STORE_ROW_HEIGHT - 8} h6 M383 ${y + 4} h6 v${STORE_ROW_HEIGHT - 8} h-6`} fill="none" stroke={EMERALD} strokeWidth={2} />
          <text x={305} y={y + STORE_ROW_HEIGHT / 2} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fontWeight={600} fill={EMERALD_TEXT}>
            {labels.stores.transaction}
          </text>
        </>
      )}
      {active && frame.stores.lockHolder !== null && (
        <>
          <text x={680} y={y + STORE_ROW_HEIGHT / 2} textAnchor="middle" dominantBaseline="central" fontSize={SMALL} fontWeight={600} fill={EMERALD_TEXT}>
            {labels.stores.lock}
          </text>
          <Dot at={{ x: 610, y: y + STORE_ROW_HEIGHT / 2 }} color={frame.stores.lockHolder === 1 ? NAVY : EMERALD} />
          {frame.stores.waitingThreads > 0 && (
            <>
              <Dot at={{ x: 580, y: y + STORE_ROW_HEIGHT / 2 }} />
              <text x={755} y={y + STORE_ROW_HEIGHT / 2} dominantBaseline="central" fontSize={SMALL} fill={GRAY_SUPPORT}>
                {labels.stores.waiting}
              </text>
            </>
          )}
        </>
      )}
    </g>
  );
}

function StoresStage({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <g>
      <text x={305} y={50} textAnchor="middle" fontSize={BODY} fontWeight={700} fill={NAVY}>
        {labels.stores.postgres}
      </text>
      <text x={480} y={50} textAnchor="middle" fontSize={BODY} fontWeight={700} fill={NAVY}>
        {labels.stores.port}
      </text>
      <text x={655} y={50} textAnchor="middle" fontSize={BODY} fontWeight={700} fill={NAVY}>
        {labels.stores.inMemory}
      </text>
      {STORES.map((store, index) => (
        <StoreRow key={store} frame={frame} labels={labels} store={store} index={index} />
      ))}
      {HOSTS.map((host, index) => (
        <text
          key={host}
          x={215}
          y={350 + index * 26}
          fontSize={BODY}
          fill={GRAY_TEXT}
          fontWeight={index === frame.stores.hostsLit - 1 ? 700 : 400}
          opacity={litOpacity(index < frame.stores.hostsLit)}
        >
          {labels.stores.hosts[host]}
        </text>
      ))}
    </g>
  );
}

const PANEL_LEFT = 420;
const TARGET_LEFT = 575;
const TARGET_WIDTH = 170;
const TRAVEL = 160;

function DuplicateBeatView({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const beat = frame.consistency.duplicate;
  if (beat === null) {
    return null;
  }
  return (
    <>
      <Box x={TARGET_LEFT} y={120} width={TARGET_WIDTH} height={50} text={labels.consistency.readingsKey} highlighted={beat.bounced} />
      <text x={PANEL_LEFT} y={110} fontSize={SMALL} fill={GRAY_SUPPORT}>
        {labels.consistency.reading}
      </text>
      <Dot at={{ x: PANEL_LEFT + 10 + TRAVEL * beat.firstFraction, y: 135 }} />
      {beat.secondFraction !== null && <Dot at={{ x: PANEL_LEFT + 10 + TRAVEL * beat.secondFraction, y: 158 }} color={NAVY} />}
      {beat.bounced && <Badge at={{ x: 660, y: 200 }} text={labels.consistency.conflict} tone="navy" />}
    </>
  );
}

function LateReadingBeatView({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const beat = frame.consistency.lateReading;
  if (beat === null) {
    return null;
  }
  return (
    <>
      <Box x={TARGET_LEFT} y={120} width={TARGET_WIDTH} height={50} text={labels.consistency.currentState} highlighted={!beat.currentStateMovesBack} />
      <text x={PANEL_LEFT} y={110} fontSize={SMALL} fill={GRAY_SUPPORT}>
        {labels.consistency.lateReading}
      </text>
      <Dot at={{ x: PANEL_LEFT + 10 + TRAVEL * beat.lateFraction, y: 145 }} color={NAVY} />
      {beat.arrived && <Badge at={{ x: 660, y: 200 }} text={labels.consistency.forwardOnly} tone="navy" />}
    </>
  );
}

function IdempotencyBeatView({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const beat = frame.consistency.idempotency;
  if (beat === null) {
    return null;
  }
  return (
    <>
      <Box x={PANEL_LEFT} y={95} width={140} height={36} text={labels.consistency.firstRun} highlighted={beat.firstRunIssued} />
      <Box x={PANEL_LEFT} y={165} width={140} height={36} text={labels.consistency.secondRun} highlighted={beat.secondRunAlreadyIssued} />
      <Box x={TARGET_LEFT} y={123} width={TARGET_WIDTH} height={50} text={labels.consistency.commandKey} />
      {beat.firstRunIssued && <Badge at={{ x: 490, y: 80 }} text={labels.consistency.issued} />}
      {beat.secondRunAlreadyIssued && <Badge at={{ x: 490, y: 222 }} text={labels.consistency.alreadyIssued} tone="navy" />}
    </>
  );
}

function CompareAndSetBeatView({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const beat = frame.consistency.compareAndSet;
  if (beat === null) {
    return null;
  }
  return (
    <>
      <Box x={PANEL_LEFT} y={95} width={140} height={36} text={labels.consistency.firstTransition} highlighted={beat.winnerRowsChanged === 1} />
      <Box x={PANEL_LEFT} y={165} width={140} height={36} text={labels.consistency.secondTransition} dashed={beat.loserRowsChanged === 0} />
      <Box x={TARGET_LEFT} y={123} width={TARGET_WIDTH} height={50} text={labels.consistency.expectedState} />
      {beat.racing && (
        <>
          <Dot at={{ x: 567, y: 125 }} color={NAVY} />
          <Dot at={{ x: 567, y: 170 }} />
        </>
      )}
      {beat.winnerRowsChanged !== null && <Badge at={{ x: 490, y: 80 }} text={labels.consistency.oneRow} />}
      {beat.loserRowsChanged !== null && <Badge at={{ x: 490, y: 222 }} text={labels.consistency.zeroRows} tone="gray" />}
    </>
  );
}

function SessionsBeatView({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const beat = frame.consistency.sessions;
  if (beat === null) {
    return null;
  }
  const lanes = [labels.consistency.firstLane, labels.consistency.secondLane];
  return (
    <>
      {lanes.map((lane, index) => {
        const y = 110 + index * 70;
        return (
          <g key={lane}>
            <text x={PANEL_LEFT} y={y - 14} fontSize={SMALL} fill={GRAY_SUPPORT}>
              {lane}
            </text>
            <path d={`M${PANEL_LEFT} ${y} H745`} stroke={GRAY_LINE} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
            <Dot at={{ x: PANEL_LEFT + 10 + 250 * beat.laneFractions[index], y }} color={index === 0 ? NAVY : EMERALD} />
          </g>
        );
      })}
      {beat.duplicateDropped && <Badge at={{ x: 612, y: 240 }} text={labels.consistency.duplicateDropped} tone="gray" />}
      {beat.deadLettered && <Badge at={{ x: 612, y: 272 }} text={labels.consistency.deadLetter} tone="navy" />}
    </>
  );
}

function MigrationLockBeatView({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const beat = frame.consistency.migrationLock;
  if (beat === null) {
    return null;
  }
  return (
    <>
      <Box x={PANEL_LEFT} y={95} width={140} height={36} text={labels.consistency.firstHost} highlighted={beat.firstHostHoldsLock} />
      <Box x={PANEL_LEFT} y={165} width={140} height={36} text={labels.consistency.secondHost} dashed={beat.secondHostWaiting} />
      <Box x={TARGET_LEFT} y={123} width={TARGET_WIDTH} height={50} text={labels.consistency.advisoryLock} highlighted={beat.firstHostHoldsLock} />
      {beat.firstHostHoldsLock && <path d={`M${PANEL_LEFT + 140} 113 H${TARGET_LEFT}`} stroke={EMERALD} strokeWidth={2} />}
      {beat.secondHostWaiting && <Badge at={{ x: 490, y: 222 }} text={labels.consistency.hostWaits} tone="gray" />}
      {beat.schemaCurrent && <Badge at={{ x: 660, y: 200 }} text={labels.consistency.schemaCurrent} />}
    </>
  );
}

function ConsistencyStage({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const { consistency } = frame;
  return (
    <g>
      {CONSISTENCY_BEATS.map((beat, index) => (
        <text
          key={beat}
          x={215}
          y={70 + index * 36}
          fontSize={BODY}
          fontWeight={beat === consistency.beat ? 700 : 400}
          fill={beat === consistency.beat ? NAVY : GRAY_TEXT}
          opacity={litOpacity(index < consistency.beatsShown)}
        >
          {`${index + 1}. ${labels.consistency.beats[beat]}`}
        </text>
      ))}
      <DuplicateBeatView frame={frame} labels={labels} />
      <LateReadingBeatView frame={frame} labels={labels} />
      <IdempotencyBeatView frame={frame} labels={labels} />
      <CompareAndSetBeatView frame={frame} labels={labels} />
      <SessionsBeatView frame={frame} labels={labels} />
      <MigrationLockBeatView frame={frame} labels={labels} />
      <Box x={215} y={400} width={530} height={44} text={labels.consistency.audit} highlighted opacity={consistency.auditOpacity} />
    </g>
  );
}

function ClosingStage({ frame, labels }: SmartEnergyFlowDrawingProps) {
  return (
    <g opacity={frame.closingOpacity}>
      <text x={480} y={220} textAnchor="middle" fontSize={30} fontWeight={800} fill={NAVY}>
        {labels.closing.url}
      </text>
      <text x={480} y={270} textAnchor="middle" fontSize={18} fill={GRAY_TEXT}>
        {labels.closing.claim}
      </text>
      <text x={480} y={310} textAnchor="middle" fontSize={16} fill={EMERALD_TEXT}>
        {labels.closing.repository}
      </text>
    </g>
  );
}

const STAGES = {
  title: TitleStage,
  system: SystemStage,
  ports: PortsStage,
  stores: StoresStage,
  consistency: ConsistencyStage,
  closing: ClosingStage,
};

export function SmartEnergyFlowDrawing({ frame, labels }: SmartEnergyFlowDrawingProps) {
  const Stage = STAGES[frame.stage];
  return (
    <svg role="img" aria-label={labels.scenes[frame.sceneId].title} viewBox={VIEW_BOX} className="block h-auto w-full">
      <rect x={0} y={0} width={960} height={540} fill="#f9fafb" />
      <Stage frame={frame} labels={labels} />
    </svg>
  );
}
