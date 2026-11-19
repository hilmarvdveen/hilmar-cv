import { MINIMUM_RENDERED_SIZE, VIEW_WIDTH, renderedSize } from "./primitives";

export const renderedFontSizes = (container: HTMLElement, viewBoxWidth: number = VIEW_WIDTH): number[] =>
  Array.from(container.querySelectorAll("text")).map((node) => renderedSize(Number(node.getAttribute("font-size")), viewBoxWidth));

export const smallestRenderedFontSize = (container: HTMLElement, viewBoxWidth: number = VIEW_WIDTH): number =>
  Math.min(...renderedFontSizes(container, viewBoxWidth));

export { MINIMUM_RENDERED_SIZE };
