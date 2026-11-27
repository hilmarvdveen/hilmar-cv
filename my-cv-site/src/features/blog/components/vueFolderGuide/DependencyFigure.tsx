import type { Locale } from "@/lib/seo";
import { Box, CONTENT_WIDTH, Connector, FigureFrame, MARGIN, boxHeight } from "../smartEnergyGuide/primitives";

const PREFIX = "vue-dependency";

const GAP = 12;

const ARROW_LENGTH = 56;

const FEATURE_WIDTH = (CONTENT_WIDTH - GAP) / 2;

const LABELS = {
  rateTable: { en: "rate-table", nl: "rate-table" },
  paymentCalculator: { en: "payment-calculator", nl: "payment-calculator" },
  featureNote: { en: "components, store, api", nl: "components, store, api" },
  designSystem: { en: "design-system", nl: "design-system" },
  designSystemNote: { en: "tokens, styles, theme, elements, patterns, templates", nl: "tokens, styles, thema, elementen, patronen, templates" },
  never: { en: "never imports a feature, never fetches data", nl: "importeert nooit een feature, haalt nooit data op" },
  caption: {
    en: "Both features depend on the design system. The design system never imports a feature and never fetches data.",
    nl: "Beide features hangen af van het design system. Het design system importeert nooit een feature en haalt nooit data op.",
  },
  stepsLabel: { en: "Steps in the figure", nl: "Stappen in de figuur" },
  stepFeatures: {
    en: "Two feature packages, rate-table and payment-calculator, each with components, a store and an api client.",
    nl: "Twee featurepackages, rate-table en payment-calculator, elk met components, een store en een api-client.",
  },
  stepArrows: {
    en: "An arrow from each feature points down to the design system: the features depend on it.",
    nl: "Een pijl van elke feature wijst naar het design system: de features hangen ervan af.",
  },
  stepDesignSystem: {
    en: "The design system holds tokens, styles, the theme, elements, patterns and templates, and never imports a feature or fetches data.",
    nl: "Het design system bevat tokens, styles, het thema, elementen, patronen en templates, en importeert nooit een feature en haalt nooit data op.",
  },
} as const;

export function DependencyFigure({ locale }: { locale: Locale }) {
  const featureContent = (title: string) => ({ title, notes: [LABELS.featureNote[locale]] });
  const featureHeight = Math.max(boxHeight(FEATURE_WIDTH, featureContent(LABELS.rateTable[locale])), boxHeight(FEATURE_WIDTH, featureContent(LABELS.paymentCalculator[locale])));
  const designSystemContent = { title: LABELS.designSystem[locale], notes: [LABELS.designSystemNote[locale]], highlights: [LABELS.never[locale]] };
  const designSystemTop = MARGIN + featureHeight + ARROW_LENGTH;
  const height = designSystemTop + boxHeight(CONTENT_WIDTH, designSystemContent) + MARGIN;
  const leftCentre = MARGIN + FEATURE_WIDTH / 2;
  const rightCentre = MARGIN + FEATURE_WIDTH + GAP + FEATURE_WIDTH / 2;
  const arrowTop = MARGIN + featureHeight;
  return (
    <FigureFrame
      prefix={PREFIX}
      height={height}
      caption={LABELS.caption[locale]}
      stepsLabel={LABELS.stepsLabel[locale]}
      steps={[LABELS.stepFeatures[locale], LABELS.stepArrows[locale], LABELS.stepDesignSystem[locale]]}
    >
      <Box x={MARGIN} y={MARGIN} width={FEATURE_WIDTH} height={featureHeight} {...featureContent(LABELS.rateTable[locale])} />
      <Box x={MARGIN + FEATURE_WIDTH + GAP} y={MARGIN} width={FEATURE_WIDTH} height={featureHeight} {...featureContent(LABELS.paymentCalculator[locale])} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: leftCentre, y: arrowTop }, { x: leftCentre, y: designSystemTop }]} />
      <Connector prefix={PREFIX} tone="emerald" points={[{ x: rightCentre, y: arrowTop }, { x: rightCentre, y: designSystemTop }]} />
      <Box x={MARGIN} y={designSystemTop} width={CONTENT_WIDTH} store emphasised {...designSystemContent} />
    </FigureFrame>
  );
}
