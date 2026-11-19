import { MINIMUM_RENDERED_SIZE, VIEW_WIDTH, renderedSize } from "./primitives";

export const renderedFontSizes = (container: HTMLElement): number[] =>
  Array.from(container.querySelectorAll("text")).map((node) => renderedSize(Number(node.getAttribute("font-size")), VIEW_WIDTH));

export const smallestRenderedFontSize = (container: HTMLElement): number => Math.min(...renderedFontSizes(container));

export { MINIMUM_RENDERED_SIZE };
