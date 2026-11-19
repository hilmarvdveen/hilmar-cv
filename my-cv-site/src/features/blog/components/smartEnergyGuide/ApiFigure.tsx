import type { Locale } from "@/lib/seo";
import { API_LABELS as LABELS, FIGURE_LABELS, pick, pickAll } from "./labels";
import { Box, Connector, FigureFrame, Frame, Label, MARGIN, boxHeight, frameHeader } from "./primitives";

export type ApiFigureProps = { locale: Locale };

export const API_VIEW_WIDTH = 300;

const PREFIX = "api";
const CONTENT_WIDTH = API_VIEW_WIDTH - MARGIN * 2;
const MIDDLE = MARGIN + CONTENT_WIDTH / 2;
const FRAME_PADDING = 12;
const INNER_LEFT = MARGIN + FRAME_PADDING;
const INNER_WIDTH = CONTENT_WIDTH - FRAME_PADDING * 2;
const CELL_GAP = 12;
const CELL_WIDTH = (INNER_WIDTH - CELL_GAP) / 2;
const ROW_GAP = 14;
const SHORT_GAP = 30;
const LABEL_WIDTH = 120;

export function ApiFigure({ locale }: ApiFigureProps) {
  const caller = { title: pick(LABELS.caller, locale), notes: pickAll(LABELS.callerNotes, locale) };
  const bearer = { title: pick(LABELS.bearer, locale), notes: [pick(LABELS.bearerNote, locale)] };
  const entra = { title: pick(LABELS.entra, locale), notes: [pick(LABELS.entraNote, locale)] };
  const endpoints = { title: pick(LABELS.endpoints, locale), notes: pickAll(LABELS.endpointNotes, locale) };
  const organisation = { title: pick(LABELS.organisation, locale), highlights: [pick(LABELS.organisationNote, locale)] };
  const limits = { title: pick(LABELS.limits, locale), notes: pickAll(LABELS.limitNotes, locale) };
  const etag = { title: pick(LABELS.etag, locale), notes: pickAll(LABELS.etagNotes, locale), highlights: [pick(LABELS.etagResult, locale)] };
  const other = { title: pick(LABELS.other, locale), notes: [pick(LABELS.otherNote, locale)], highlights: [pick(LABELS.otherResult, locale)] };

  const callerTop = MARGIN;
  const callerHeight = boxHeight(CONTENT_WIDTH, caller);

  const apiTop = callerTop + callerHeight + SHORT_GAP;
  const apiTitle = pick(LABELS.api, locale);
  const apiHeader = frameHeader(CONTENT_WIDTH, apiTitle);
  const modesTop = apiTop + apiHeader;
  const modesHeight = Math.max(boxHeight(CELL_WIDTH, bearer), boxHeight(CELL_WIDTH, entra));
  const endpointsTop = modesTop + modesHeight + ROW_GAP;
  const endpointsHeight = boxHeight(INNER_WIDTH, endpoints);
  const organisationTop = endpointsTop + endpointsHeight + ROW_GAP;
  const organisationHeight = boxHeight(INNER_WIDTH, organisation);
  const limitsTop = organisationTop + organisationHeight + ROW_GAP;
  const limitsHeight = boxHeight(INNER_WIDTH, limits);
  const etagTop = limitsTop + limitsHeight + ROW_GAP;
  const etagHeight = boxHeight(INNER_WIDTH, etag);
  const apiHeight = etagTop + etagHeight + FRAME_PADDING - apiTop;

  const otherTop = apiTop + apiHeight + SHORT_GAP;
  const otherHeight = boxHeight(CONTENT_WIDTH, other);
  const height = otherTop + otherHeight + MARGIN;

  return (
    <FigureFrame prefix={PREFIX} height={height} width={API_VIEW_WIDTH} caption={pick(LABELS.caption, locale)} steps={pickAll(LABELS.steps, locale)} stepsLabel={pick(FIGURE_LABELS.steps, locale)}>
      <Box x={MARGIN} y={callerTop} width={CONTENT_WIDTH} height={callerHeight} store {...caller} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: MIDDLE, y: callerTop + callerHeight }, { x: MIDDLE, y: apiTop }]} />
      <Label x={MIDDLE + 10} y={callerTop + callerHeight + SHORT_GAP / 2} maxWidth={LABEL_WIDTH} text={pick(LABELS.ingress, locale)} emphasised />

      <Frame x={MARGIN} y={apiTop} width={CONTENT_WIDTH} height={apiHeight} title={apiTitle} />
      <Box x={INNER_LEFT} y={modesTop} width={CELL_WIDTH} height={modesHeight} {...bearer} />
      <Box x={INNER_LEFT + CELL_WIDTH + CELL_GAP} y={modesTop} width={CELL_WIDTH} height={modesHeight} {...entra} />
      <Box x={INNER_LEFT} y={endpointsTop} width={INNER_WIDTH} height={endpointsHeight} {...endpoints} />
      <Box x={INNER_LEFT} y={organisationTop} width={INNER_WIDTH} height={organisationHeight} emphasised {...organisation} />
      <Box x={INNER_LEFT} y={limitsTop} width={INNER_WIDTH} height={limitsHeight} {...limits} />
      <Box x={INNER_LEFT} y={etagTop} width={INNER_WIDTH} height={etagHeight} store {...etag} />

      <Connector prefix={PREFIX} dashed points={[{ x: MIDDLE, y: otherTop }, { x: MIDDLE, y: apiTop + apiHeight }]} />
      <Box x={MARGIN} y={otherTop} width={CONTENT_WIDTH} height={otherHeight} dashed store {...other} />
    </FigureFrame>
  );
}
