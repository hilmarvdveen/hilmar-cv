import type { Locale } from "@/lib/seo";
import { FRONTEND_LABELS as LABELS, pick, pickAll } from "./labels";
import { Box, CONTENT_WIDTH, Connector, FigureFrame, Label, MARGIN, boxHeight } from "./primitives";

const PREFIX = "frontend";
const BOX_WIDTH = 200;
const BOX_RIGHT = MARGIN + BOX_WIDTH;
const RETURN_LINE = BOX_RIGHT + 16;
const SIDE_LEFT = RETURN_LINE + 14;
const SIDE_WIDTH = MARGIN + CONTENT_WIDTH - SIDE_LEFT;
const ROW_GAP = 52;
const DOWN_LINE = MARGIN + 30;
const LABEL_OFFSET = 8;

export function FrontendPathFigure({ locale }: { locale: Locale }) {
  const browser = { title: pick(LABELS.browser, locale), notes: pickAll(LABELS.browserNotes, locale) };
  const handler = { title: pick(LABELS.handler, locale), notes: pickAll(LABELS.handlerNotes, locale) };
  const api = { title: pick(LABELS.api, locale), notes: pickAll(LABELS.apiNotes, locale) };
  const database = { title: pick(LABELS.database, locale), notes: [pick(LABELS.databaseNote, locale)] };
  const side = { notes: [pick(LABELS.serverNote, locale)] };

  const browserTop = MARGIN;
  const browserHeight = boxHeight(BOX_WIDTH, browser);
  const handlerTop = browserTop + browserHeight + ROW_GAP;
  const handlerHeight = boxHeight(BOX_WIDTH, handler);
  const apiTop = handlerTop + handlerHeight + ROW_GAP;
  const apiHeight = boxHeight(BOX_WIDTH, api);
  const databaseTop = apiTop + apiHeight + ROW_GAP;
  const databaseHeight = boxHeight(BOX_WIDTH, database);
  const height = databaseTop + databaseHeight + MARGIN;
  const browserMiddle = browserTop + browserHeight / 2;
  const apiMiddle = apiTop + apiHeight / 2;
  const returnLabel = `${pick(LABELS.returnTitle, locale)}, ${pick(LABELS.returnNote, locale)}`;

  return (
    <FigureFrame prefix={PREFIX} height={height} caption={pick(LABELS.caption, locale)} steps={pickAll(LABELS.steps, locale)}>
      <Box x={MARGIN} y={browserTop} width={BOX_WIDTH} height={browserHeight} store {...browser} />
      <Box x={MARGIN} y={handlerTop} width={BOX_WIDTH} height={handlerHeight} {...handler} />
      <Box x={MARGIN} y={apiTop} width={BOX_WIDTH} height={apiHeight} {...api} />
      <Box x={MARGIN} y={databaseTop} width={BOX_WIDTH} height={databaseHeight} store {...database} />
      <Box x={SIDE_LEFT} y={handlerTop} width={SIDE_WIDTH} dashed store {...side} />

      <Connector prefix={PREFIX} points={[{ x: DOWN_LINE, y: browserTop + browserHeight }, { x: DOWN_LINE, y: handlerTop }]} />
      <Label x={DOWN_LINE + LABEL_OFFSET} y={browserTop + browserHeight + ROW_GAP / 2} text={pick(LABELS.requestArrow, locale)} maxWidth={120} />
      <Connector prefix={PREFIX} points={[{ x: DOWN_LINE, y: handlerTop + handlerHeight }, { x: DOWN_LINE, y: apiTop }]} />
      <Label x={DOWN_LINE + LABEL_OFFSET} y={handlerTop + handlerHeight + ROW_GAP / 2} text={pick(LABELS.callArrow, locale)} maxWidth={120} />
      <Connector prefix={PREFIX} points={[{ x: DOWN_LINE, y: apiTop + apiHeight }, { x: DOWN_LINE, y: databaseTop }]} />
      <Label x={DOWN_LINE + LABEL_OFFSET} y={apiTop + apiHeight + ROW_GAP / 2} text={pick(LABELS.readArrow, locale)} maxWidth={150} />

      <Connector
        prefix={PREFIX}
        tone="emerald"
        points={[
          { x: BOX_RIGHT, y: apiMiddle },
          { x: RETURN_LINE, y: apiMiddle },
          { x: RETURN_LINE, y: browserMiddle },
          { x: BOX_RIGHT, y: browserMiddle },
        ]}
      />
      <Label
        x={RETURN_LINE + LABEL_OFFSET}
        y={browserTop + browserHeight + ROW_GAP / 2}
        text={returnLabel}
        maxWidth={MARGIN + CONTENT_WIDTH - RETURN_LINE - LABEL_OFFSET}
        emphasised
      />
    </FigureFrame>
  );
}
