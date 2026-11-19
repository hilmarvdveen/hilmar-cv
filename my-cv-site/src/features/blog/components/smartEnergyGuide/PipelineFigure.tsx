import type { Locale } from "@/lib/seo";
import { FIGURE_LABELS, PIPELINE_LABELS as LABELS, pick, pickAll } from "./labels";
import { Box, CONTENT_WIDTH, Connector, FigureFrame, Frame, MARGIN, boxHeight, frameHeader } from "./primitives";

const PREFIX = "pipeline";
const MIDDLE = MARGIN + CONTENT_WIDTH / 2;
const PUSH_WIDTH = 200;
const FRAME_PADDING = 12;
const INNER_LEFT = MARGIN + FRAME_PADDING;
const INNER_WIDTH = CONTENT_WIDTH - FRAME_PADDING * 2;
const CELL_GAP = 12;
const CELL_WIDTH = (INNER_WIDTH - CELL_GAP) / 2;
const SHORT_GAP = 28;
const STEP_GAP = 18;
const TARGET_WIDTH = 200;
const DRIFT_WIDTH = 132;
const TARGET_LINE = MARGIN + TARGET_WIDTH / 2;

export function PipelineFigure({ locale }: { locale: Locale }) {
  const push = { title: pick(LABELS.push, locale) };
  const backend = { title: pick(LABELS.backend, locale), notes: [pick(LABELS.backendNote, locale)] };
  const dashboard = { title: pick(LABELS.dashboard, locale), notes: [pick(LABELS.dashboardNote, locale)] };
  const terraform = { title: pick(LABELS.terraform, locale), notes: [pick(LABELS.terraformNote, locale)] };
  const semgrep = { title: pick(LABELS.semgrep, locale) };
  const gitleaks = { title: pick(LABELS.gitleaks, locale) };
  const main = { title: pick(LABELS.main, locale), notes: pickAll(LABELS.mainNotes, locale) };
  const target = { title: pick(LABELS.target, locale), notes: [pick(LABELS.targetNote, locale)] };
  const drift = { title: pick(LABELS.drift, locale), notes: [pick(LABELS.driftNote, locale)] };
  const deploySteps = [LABELS.login, LABELS.digests, LABELS.plan, LABELS.apply].map((step) => ({ title: pick(step, locale) }));

  const pushTop = MARGIN;
  const pushHeight = boxHeight(PUSH_WIDTH, push);

  const ciTop = pushTop + pushHeight + SHORT_GAP;
  const ciTitle = pick(LABELS.ci, locale);
  const ciHeader = frameHeader(CONTENT_WIDTH, ciTitle);
  const firstRowTop = ciTop + ciHeader;
  const firstRowHeight = Math.max(boxHeight(CELL_WIDTH, backend), boxHeight(CELL_WIDTH, dashboard));
  const secondRowTop = firstRowTop + firstRowHeight + CELL_GAP;
  const secondRowHeight = boxHeight(INNER_WIDTH, terraform);
  const thirdRowTop = secondRowTop + secondRowHeight + CELL_GAP;
  const thirdRowHeight = Math.max(boxHeight(CELL_WIDTH, semgrep), boxHeight(CELL_WIDTH, gitleaks));
  const ciHeight = thirdRowTop + thirdRowHeight + FRAME_PADDING - ciTop;

  const mainTop = ciTop + ciHeight + SHORT_GAP;
  const mainHeight = boxHeight(CONTENT_WIDTH, main);

  const deployTop = mainTop + mainHeight + SHORT_GAP;
  const deployTitle = pick(LABELS.deploy, locale);
  const deployHeader = frameHeader(CONTENT_WIDTH, deployTitle);
  const stepHeight = boxHeight(INNER_WIDTH, deploySteps[0]);
  const stepTop = (index: number) => deployTop + deployHeader + index * (stepHeight + STEP_GAP);
  const deployHeight = stepTop(deploySteps.length) - STEP_GAP + FRAME_PADDING - deployTop;

  const targetTop = deployTop + deployHeight + SHORT_GAP;
  const targetHeight = Math.max(boxHeight(TARGET_WIDTH, target), boxHeight(DRIFT_WIDTH, drift));
  const height = targetTop + targetHeight + MARGIN;
  const driftLeft = MARGIN + CONTENT_WIDTH - DRIFT_WIDTH;

  return (
    <FigureFrame prefix={PREFIX} height={height} caption={pick(LABELS.caption, locale)} steps={pickAll(LABELS.steps, locale)} stepsLabel={pick(FIGURE_LABELS.steps, locale)}>
      <Box x={MIDDLE - PUSH_WIDTH / 2} y={pushTop} width={PUSH_WIDTH} height={pushHeight} store {...push} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: MIDDLE, y: pushTop + pushHeight }, { x: MIDDLE, y: ciTop }]} />

      <Frame x={MARGIN} y={ciTop} width={CONTENT_WIDTH} height={ciHeight} title={ciTitle} />
      <Box x={INNER_LEFT} y={firstRowTop} width={CELL_WIDTH} height={firstRowHeight} {...backend} />
      <Box x={INNER_LEFT + CELL_WIDTH + CELL_GAP} y={firstRowTop} width={CELL_WIDTH} height={firstRowHeight} {...dashboard} />
      <Box x={INNER_LEFT} y={secondRowTop} width={INNER_WIDTH} height={secondRowHeight} {...terraform} />
      <Box x={INNER_LEFT} y={thirdRowTop} width={CELL_WIDTH} height={thirdRowHeight} {...semgrep} />
      <Box x={INNER_LEFT + CELL_WIDTH + CELL_GAP} y={thirdRowTop} width={CELL_WIDTH} height={thirdRowHeight} {...gitleaks} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: MIDDLE, y: ciTop + ciHeight }, { x: MIDDLE, y: mainTop }]} />

      <Box x={MARGIN} y={mainTop} width={CONTENT_WIDTH} height={mainHeight} {...main} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: MIDDLE, y: mainTop + mainHeight }, { x: MIDDLE, y: deployTop }]} />

      <Frame x={MARGIN} y={deployTop} width={CONTENT_WIDTH} height={deployHeight} title={deployTitle} />
      {deploySteps.map((step, index) => (
        <g key={step.title}>
          <Box x={INNER_LEFT} y={stepTop(index)} width={INNER_WIDTH} height={stepHeight} {...step} />
          {index < deploySteps.length - 1 && (
            <Connector prefix={PREFIX} tone="emerald" points={[{ x: MIDDLE, y: stepTop(index) + stepHeight }, { x: MIDDLE, y: stepTop(index + 1) }]} />
          )}
        </g>
      ))}
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: TARGET_LINE, y: deployTop + deployHeight }, { x: TARGET_LINE, y: targetTop }]} />

      <Box x={MARGIN} y={targetTop} width={TARGET_WIDTH} height={targetHeight} emphasised {...target} />
      <Box x={driftLeft} y={targetTop} width={DRIFT_WIDTH} height={targetHeight} dashed store {...drift} />
      <Connector prefix={PREFIX} arrow={false} dashed points={[{ x: driftLeft, y: targetTop + targetHeight / 2 }, { x: MARGIN + TARGET_WIDTH, y: targetTop + targetHeight / 2 }]} />
    </FigureFrame>
  );
}
