import type { Locale } from "@/lib/seo";
import { FLOW_LABELS as LABELS, pick, pickAll } from "./labels";
import { Box, CONTENT_WIDTH, Connector, FigureFrame, Label, MARGIN, boxHeight } from "./primitives";

const PREFIX = "flow";
const COLUMN_GAP = 28;
const COLUMN_WIDTH = (CONTENT_WIDTH - COLUMN_GAP) / 2;
const RIGHT_COLUMN = MARGIN + COLUMN_WIDTH + COLUMN_GAP;
const ROW_GAP = 52;
const LEFT_LINE = MARGIN + 22;
const RIGHT_LINE = MARGIN + CONTENT_WIDTH - 22;
const LABEL_OFFSET = 8;

export function FlowFigure({ locale }: { locale: Locale }) {
  const devices = { title: pick(LABELS.devices, locale), notes: [pick(LABELS.devicesNote, locale)], highlights: [pick(LABELS.devicesConfirm, locale)] };
  const hub = { title: pick(LABELS.hub, locale), notes: [pick(LABELS.hubNote, locale)] };
  const gateway = { title: pick(LABELS.gateway, locale), notes: [pick(LABELS.gatewayNote, locale)] };
  const queue = { title: pick(LABELS.queue, locale), notes: [pick(LABELS.queueNote, locale)] };
  const database = { title: pick(LABELS.database, locale), notes: pickAll(LABELS.databaseNotes, locale) };
  const steering = { title: pick(LABELS.steering, locale), notes: pickAll(LABELS.steeringNotes, locale) };
  const planner = { title: pick(LABELS.planner, locale), notes: pickAll(LABELS.plannerNotes, locale) };

  const devicesTop = MARGIN;
  const devicesHeight = boxHeight(CONTENT_WIDTH, devices);
  const hubTop = devicesTop + devicesHeight + ROW_GAP;
  const hubHeight = boxHeight(CONTENT_WIDTH, hub);
  const gatewayTop = hubTop + hubHeight + ROW_GAP;
  const gatewayRowHeight = Math.max(boxHeight(COLUMN_WIDTH, gateway), boxHeight(COLUMN_WIDTH, queue));
  const databaseTop = gatewayTop + gatewayRowHeight + ROW_GAP;
  const databaseRowHeight = Math.max(boxHeight(COLUMN_WIDTH, database), boxHeight(COLUMN_WIDTH, steering));
  const plannerTop = databaseTop + databaseRowHeight + ROW_GAP;
  const plannerHeight = boxHeight(COLUMN_WIDTH, planner);
  const height = plannerTop + plannerHeight + MARGIN;
  const leftEdge = MARGIN + COLUMN_WIDTH;
  const queueLine = RIGHT_COLUMN + COLUMN_WIDTH / 2;
  const steps = pickAll(LABELS.steps, locale);

  const gapMiddle = (above: number) => above + ROW_GAP / 2;
  return (
    <FigureFrame prefix={PREFIX} height={height} caption={pick(LABELS.caption, locale)} steps={steps}>
      <Box x={MARGIN} y={devicesTop} width={CONTENT_WIDTH} height={devicesHeight} store {...devices} />
      <Box x={MARGIN} y={hubTop} width={CONTENT_WIDTH} height={hubHeight} {...hub} />
      <Box x={MARGIN} y={gatewayTop} width={COLUMN_WIDTH} height={gatewayRowHeight} {...gateway} />
      <Box x={RIGHT_COLUMN} y={gatewayTop} width={COLUMN_WIDTH} height={gatewayRowHeight} dashed {...queue} />
      <Box x={MARGIN} y={databaseTop} width={COLUMN_WIDTH} height={databaseRowHeight} store {...database} />
      <Box x={RIGHT_COLUMN} y={databaseTop} width={COLUMN_WIDTH} height={databaseRowHeight} {...steering} />
      <Box x={MARGIN} y={plannerTop} width={COLUMN_WIDTH} height={plannerHeight} {...planner} />

      <Connector prefix={PREFIX} points={[{ x: LEFT_LINE, y: devicesTop + devicesHeight }, { x: LEFT_LINE, y: hubTop }]} />
      <Label x={LEFT_LINE + LABEL_OFFSET} y={gapMiddle(devicesTop + devicesHeight)} text={pick(LABELS.readingArrow, locale)} maxWidth={150} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: RIGHT_LINE, y: hubTop }, { x: RIGHT_LINE, y: devicesTop + devicesHeight }]} />
      <Label x={RIGHT_LINE - LABEL_OFFSET} y={gapMiddle(devicesTop + devicesHeight)} text={pick(LABELS.commandArrow, locale)} maxWidth={150} anchor="end" emphasised />

      <Connector prefix={PREFIX} points={[{ x: LEFT_LINE, y: hubTop + hubHeight }, { x: LEFT_LINE, y: gatewayTop }]} />
      <Label x={LEFT_LINE + LABEL_OFFSET} y={gapMiddle(hubTop + hubHeight)} text={pick(LABELS.endpointArrow, locale)} maxWidth={100} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: leftEdge - 22, y: gatewayTop }, { x: leftEdge - 22, y: hubTop + hubHeight }]} />
      <Label x={leftEdge - 22 + LABEL_OFFSET} y={gapMiddle(hubTop + hubHeight)} text={pick(LABELS.sendArrow, locale)} maxWidth={180} emphasised />

      <Connector prefix={PREFIX} tone="emerald" points={[{ x: RIGHT_COLUMN, y: gatewayTop + gatewayRowHeight / 2 }, { x: leftEdge, y: gatewayTop + gatewayRowHeight / 2 }]} />

      <Connector prefix={PREFIX} points={[{ x: LEFT_LINE, y: gatewayTop + gatewayRowHeight }, { x: LEFT_LINE, y: databaseTop }]} />
      <Label x={LEFT_LINE + LABEL_OFFSET} y={gapMiddle(gatewayTop + gatewayRowHeight)} text={pick(LABELS.transactionArrow, locale)} maxWidth={130} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: queueLine, y: databaseTop }, { x: queueLine, y: gatewayTop + gatewayRowHeight }]} />
      <Label x={queueLine + LABEL_OFFSET} y={gapMiddle(gatewayTop + gatewayRowHeight)} text={pick(LABELS.commandSmallArrow, locale)} maxWidth={70} emphasised />

      <Connector prefix={PREFIX} points={[{ x: leftEdge, y: databaseTop + databaseRowHeight / 2 }, { x: RIGHT_COLUMN, y: databaseTop + databaseRowHeight / 2 }]} />

      <Connector prefix={PREFIX} points={[{ x: LEFT_LINE, y: plannerTop }, { x: LEFT_LINE, y: databaseTop + databaseRowHeight }]} />
      <Label x={LEFT_LINE + LABEL_OFFSET} y={gapMiddle(databaseTop + databaseRowHeight)} text={pick(LABELS.planArrow, locale)} maxWidth={130} />
    </FigureFrame>
  );
}
