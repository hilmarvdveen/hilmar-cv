import type { Locale } from "@/lib/seo";
import { FIGURE_LABELS, HEXAGON_LABELS as LABELS, pick, pickAll } from "./labels";
import { Box, CONTENT_WIDTH, Connector, FigureFrame, Frame, MARGIN, boxHeight, frameHeader } from "./primitives";

const PREFIX = "hexagon";
const COLUMN_GAP = 16;
const COLUMN_WIDTH = (CONTENT_WIDTH - COLUMN_GAP) / 2;
const RIGHT_COLUMN = MARGIN + COLUMN_WIDTH + COLUMN_GAP;
const ARROW_GAP = 36;
const FRAME_PADDING = 12;
const DOMAIN_WIDTH = 150;
const DOMAIN_HEIGHT = 56;
const HOST_WIDTH = 100;
const HOST_HEIGHT = 34;
const HOST_GAP = 12;
const HOSTS_TOP_ROW = 3;

export function HexagonFigure({ locale }: { locale: Locale }) {
  const left = { title: pick(LABELS.inMemory, locale), notes: pickAll(LABELS.inMemoryItems, locale) };
  const right = { title: pick(LABELS.azure, locale), notes: pickAll(LABELS.azureItems, locale) };
  const adapterHeight = Math.max(boxHeight(COLUMN_WIDTH, left), boxHeight(COLUMN_WIDTH, right));
  const ringTop = MARGIN + adapterHeight + ARROW_GAP;
  const ringTitle = pick(LABELS.ring, locale);
  const ringHeader = frameHeader(CONTENT_WIDTH, ringTitle);
  const ringHeight = ringHeader + DOMAIN_HEIGHT + FRAME_PADDING;
  const hostsTop = ringTop + ringHeight + ARROW_GAP;
  const hostsTitle = pick(LABELS.hosts, locale);
  const hostsHeader = frameHeader(CONTENT_WIDTH, hostsTitle);
  const hostsHeight = hostsHeader + HOST_HEIGHT * 2 + HOST_GAP + FRAME_PADDING;
  const height = hostsTop + hostsHeight + MARGIN;
  const middle = MARGIN + CONTENT_WIDTH / 2;
  const hostPosition = (index: number) => {
    const row = index < HOSTS_TOP_ROW ? 0 : 1;
    const inRow = row === 0 ? index : index - HOSTS_TOP_ROW;
    const rowCount = row === 0 ? HOSTS_TOP_ROW : LABELS.hostNames.length - HOSTS_TOP_ROW;
    const rowWidth = HOST_WIDTH * rowCount + HOST_GAP * (rowCount - 1);
    return {
      x: middle - rowWidth / 2 + inRow * (HOST_WIDTH + HOST_GAP),
      y: hostsTop + hostsHeader + row * (HOST_HEIGHT + HOST_GAP),
    };
  };
  const steps = pickAll(LABELS.steps, locale);
  return (
    <FigureFrame prefix={PREFIX} height={height} caption={pick(LABELS.caption, locale)} steps={steps} stepsLabel={pick(FIGURE_LABELS.steps, locale)}>
      <Box x={MARGIN} y={MARGIN} width={COLUMN_WIDTH} height={adapterHeight} store {...left} />
      <Box x={RIGHT_COLUMN} y={MARGIN} width={COLUMN_WIDTH} height={adapterHeight} store {...right} />
      <Frame x={MARGIN} y={ringTop} width={CONTENT_WIDTH} height={ringHeight} title={ringTitle} />
      <Box x={middle - DOMAIN_WIDTH / 2} y={ringTop + ringHeader} width={DOMAIN_WIDTH} height={DOMAIN_HEIGHT} title={pick(LABELS.domain, locale)} emphasised />
      <Connector
        prefix={PREFIX}
        tone="emerald"
        points={[
          { x: MARGIN + COLUMN_WIDTH / 2, y: MARGIN + adapterHeight },
          { x: MARGIN + COLUMN_WIDTH / 2, y: ringTop },
        ]}
      />
      <Connector
        prefix={PREFIX}
        tone="emerald"
        points={[
          { x: RIGHT_COLUMN + COLUMN_WIDTH / 2, y: MARGIN + adapterHeight },
          { x: RIGHT_COLUMN + COLUMN_WIDTH / 2, y: ringTop },
        ]}
      />
      <Connector
        prefix={PREFIX}
        arrow={false}
        points={[
          { x: middle, y: ringTop + ringHeight },
          { x: middle, y: hostsTop },
        ]}
      />
      <Frame x={MARGIN} y={hostsTop} width={CONTENT_WIDTH} height={hostsHeight} title={hostsTitle} />
      {LABELS.hostNames.map((name, index) => (
        <Box key={name} {...hostPosition(index)} width={HOST_WIDTH} height={HOST_HEIGHT} title={name} />
      ))}
    </FigureFrame>
  );
}
