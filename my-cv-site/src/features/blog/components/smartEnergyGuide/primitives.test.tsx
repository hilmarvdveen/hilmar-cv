import { render, screen, within } from "@testing-library/react";
import {
  Box,
  Connector,
  FigureFrame,
  Frame,
  Label,
  LINE_HEIGHT,
  MINIMUM_RENDERED_SIZE,
  PHONE_WIDTH,
  SMALL_SIZE,
  TITLE_SIZE,
  VIEW_WIDTH,
  boxHeight,
  frameHeader,
  minimumFontUnits,
  renderedSize,
  textWidth,
  wrapText,
} from "./primitives";

const inDrawing = (node: React.ReactNode) => render(<svg>{node}</svg>);

describe("rendered size arithmetic", () => {
  it("scales font units by the rendered width over the viewBox width", () => {
    expect(renderedSize(12, 360, 358)).toBeCloseTo(11.933, 3);
    expect(renderedSize(12, 360, 720)).toBe(24);
    expect(renderedSize(12, 360)).toBeCloseTo(renderedSize(12, 360, PHONE_WIDTH), 10);
  });

  it("finds the smallest font units that still render at 11 pixels on a phone", () => {
    expect(minimumFontUnits(360)).toBeCloseTo(11.061, 3);
    expect(renderedSize(minimumFontUnits(480), 480)).toBeCloseTo(MINIMUM_RENDERED_SIZE, 10);
  });

  it("keeps both text sizes of the figures at 11 pixels or more on a phone", () => {
    expect(renderedSize(SMALL_SIZE, VIEW_WIDTH)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
    expect(renderedSize(TITLE_SIZE, VIEW_WIDTH)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
  });
});

describe("wrapText", () => {
  it("keeps a short text on one line", () => {
    expect(wrapText("one two", 500, 12)).toEqual(["one two"]);
  });

  it("breaks before a word that does not fit", () => {
    expect(wrapText("one two three", textWidth("one two", 12), 12)).toEqual(["one two", "three"]);
  });

  it("never splits a word that is wider than the line", () => {
    expect(wrapText("extraordinary", 10, 12)).toEqual(["extraordinary"]);
  });
});

describe("Box", () => {
  it("draws the title, the notes and the highlights, and sizes itself to them", () => {
    inDrawing(<Box x={0} y={0} width={200} title="Title" notes={["note"]} highlights={["highlight"]} />);
    for (const text of ["Title", "note", "highlight"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(boxHeight(200, { title: "Title", notes: ["note"], highlights: ["highlight"] })).toBe(3 * LINE_HEIGHT + 20);
  });

  it("draws a box with notes only and honours an explicit height", () => {
    const { container } = inDrawing(<Box x={0} y={0} width={200} height={80} notes={["only a note"]} store dashed emphasised />);
    expect(screen.getByText("only a note")).toBeInTheDocument();
    expect(container.querySelector("rect")).toHaveAttribute("height", "80");
    expect(container.querySelector("rect")).toHaveAttribute("stroke-dasharray");
  });
});

describe("Frame", () => {
  it("draws its title and reserves a header above its content", () => {
    inDrawing(<Frame x={0} y={0} width={300} height={100} title="Frame title" dashed />);
    expect(screen.getByText("Frame title")).toBeInTheDocument();
    expect(frameHeader(300, "Frame title")).toBe(LINE_HEIGHT + 20);
  });

  it("draws a solid frame by default", () => {
    const { container } = inDrawing(<Frame x={0} y={0} width={300} height={100} title="Solid" />);
    expect(container.querySelector("rect")).not.toHaveAttribute("stroke-dasharray");
  });
});

describe("Connector", () => {
  it("ends in an arrowhead on the target edge by default", () => {
    const { container } = inDrawing(<Connector prefix="test" points={[{ x: 0, y: 0 }, { x: 0, y: 40 }]} />);
    expect(container.querySelector("path")).toHaveAttribute("d", "M0 0 L0 40");
    expect(container.querySelector("path")).toHaveAttribute("marker-end", "url(#test-arrow-slate)");
  });

  it("can be emerald, dashed and without an arrowhead", () => {
    const { container } = inDrawing(<Connector prefix="test" tone="emerald" arrow={false} dashed points={[{ x: 0, y: 0 }, { x: 40, y: 0 }]} />);
    expect(container.querySelector("path")).not.toHaveAttribute("marker-end");
    expect(container.querySelector("path")).toHaveAttribute("stroke", "#059669");
    expect(container.querySelector("path")).toHaveAttribute("stroke-dasharray");
  });
});

describe("Label", () => {
  it.each(["start", "middle", "end"] as const)("places a label with anchor %s and wraps long text", (anchor) => {
    const { container } = inDrawing(<Label x={100} y={50} text="a label that is long enough to wrap" maxWidth={90} anchor={anchor} emphasised />);
    expect(container.querySelectorAll("text").length).toBeGreaterThan(1);
    expect(container.querySelector("text")).toHaveAttribute("text-anchor", anchor);
  });

  it("draws a plain label in gray", () => {
    const { container } = inDrawing(<Label x={0} y={0} text="plain" maxWidth={100} />);
    expect(container.querySelector("text")).toHaveAttribute("fill", "#374151");
  });
});

describe("FigureFrame", () => {
  it("renders the drawing hidden, the caption as text and the steps as an ordered list", () => {
    const { container } = render(
      <FigureFrame prefix="test" height={100} caption="A caption" steps={["First step", "Second step"]}>
        <rect width={10} height={10} />
      </FigureFrame>,
    );
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText("A caption")).toBeInTheDocument();
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 360 100");
  });
});
