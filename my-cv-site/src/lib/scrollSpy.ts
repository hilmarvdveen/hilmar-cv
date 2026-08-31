export type SectionPosition = {
  id: string;
  top: number;
};

export const pickActiveSectionId = (
  positions: readonly SectionPosition[],
  activationLine: number,
  atDocumentBottom: boolean
): string => {
  if (positions.length === 0) return "";
  if (atDocumentBottom) return positions[positions.length - 1].id;
  let activeId = "";
  for (const position of positions) {
    if (position.top <= activationLine) activeId = position.id;
  }
  return activeId;
};

export const centeredScrollLeft = (
  chipLeft: number,
  chipWidth: number,
  viewportWidth: number,
  maxScrollLeft: number
): number => {
  const ideal = chipLeft - (viewportWidth - chipWidth) / 2;
  return Math.min(Math.max(ideal, 0), Math.max(maxScrollLeft, 0));
};
