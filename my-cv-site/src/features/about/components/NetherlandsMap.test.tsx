import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NetherlandsMap } from "./NetherlandsMap";
import { MAP_VIEWBOX } from "../netherlandsMapData";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const emptyProvinceCollection = { type: "FeatureCollection", features: [] };

const netherlandsOutline = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "outline",
      properties: { statnaam: "Noord-Holland" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [3.36, 50.75],
            [7.23, 50.75],
            [7.23, 53.55],
            [3.36, 53.55],
            [3.36, 50.75],
          ],
        ],
      },
    },
  ],
};

const centreOf = (dot: HTMLElement) => ({
  x: Number(dot.getAttribute("cx")),
  y: Number(dot.getAttribute("cy")),
});

const cityNames = [
  "Zandvoort",
  "Amsterdam",
  "Apeldoorn",
  "Hilversum",
  "Hoorn",
  "Utrecht",
  "Zoetermeer",
  "Almere",
  "Rotterdam",
];

const getChip = (name: string) =>
  screen
    .getAllByRole("button", { name })
    .find((element) => element.tagName.toLowerCase() === "button")!;

const findDot = (name: string) =>
  waitFor(() => {
    const dot = screen
      .getAllByRole("button", { name })
      .find((element) => element.tagName.toLowerCase() === "circle");
    if (!dot) throw new Error(`dot not drawn yet for ${name}`);
    return dot;
  });

const orderedBlockOf = (element: Element) => {
  let current: Element | null = element;
  while (current) {
    if (/(^|\s)order-\d(\s|$)/.test(current.getAttribute("class") ?? "")) return current;
    current = current.parentElement;
  }
  throw new Error("no block with an order class above this element");
};

const followsInDocument = (first: Element, second: Element) =>
  Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("NetherlandsMap city hit targets", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(emptyProvinceCollection),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exposes every city dot as a named, keyboard-reachable button", async () => {
    render(<NetherlandsMap />);
    for (const name of cityNames) {
      const dot = await findDot(name);
      expect(dot).toHaveAttribute("tabindex", "0");
    }
  });

  it("selects a city when Enter is pressed on its hit target", async () => {
    render(<NetherlandsMap />);
    const amsterdam = await findDot("Amsterdam");
    fireEvent.keyDown(amsterdam, { key: "Enter" });
    expect(await screen.findByText("Randstad")).toBeInTheDocument();
  });

  it("selects a city when Space is pressed on its hit target", async () => {
    render(<NetherlandsMap />);
    const rotterdam = await findDot("Rotterdam");
    fireEvent.keyDown(rotterdam, { key: " " });
    expect(await screen.findByText("Opinity")).toBeInTheDocument();
  });

  it("selects a city on click, matching the existing pointer behaviour", async () => {
    render(<NetherlandsMap />);
    const almere = await findDot("Almere");
    fireEvent.click(almere);
    expect(await screen.findByText("Athlon")).toBeInTheDocument();
  });

  it("ignores keys other than Enter and Space", async () => {
    render(<NetherlandsMap />);
    const hoorn = await findDot("Hoorn");
    fireEvent.keyDown(hoorn, { key: "Tab" });
    expect(screen.queryByText("Niped")).not.toBeInTheDocument();
  });

  it("fits the provinces to the drawing box, so every dot lands inside it whatever the screen width", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(netherlandsOutline),
      })
    );
    render(<NetherlandsMap />);
    const amsterdam = centreOf(await findDot("Amsterdam"));
    const zandvoort = centreOf(await findDot("Zandvoort"));
    const hoorn = centreOf(await findDot("Hoorn"));
    for (const dot of [amsterdam, zandvoort, hoorn]) {
      expect(dot.x).toBeGreaterThan(0);
      expect(dot.x).toBeLessThan(MAP_VIEWBOX.width);
      expect(dot.y).toBeGreaterThan(0);
      expect(dot.y).toBeLessThan(MAP_VIEWBOX.height);
    }
    expect(zandvoort.x).toBeLessThan(amsterdam.x);
    expect(hoorn.y).toBeLessThan(amsterdam.y);
  });

  it("renders a chip button for every city on the map", () => {
    render(<NetherlandsMap />);
    for (const name of cityNames) {
      expect(getChip(name)).toBeInTheDocument();
    }
  });

  it("selects a city when its chip is clicked, matching the dot behaviour", async () => {
    render(<NetherlandsMap />);
    fireEvent.click(getChip("Almere"));
    expect(await screen.findByText("Athlon")).toBeInTheDocument();
  });

  it("marks only the selected chip as pressed", async () => {
    render(<NetherlandsMap />);
    fireEvent.click(getChip("Almere"));
    expect(await screen.findByText("Athlon")).toBeInTheDocument();
    expect(getChip("Almere")).toHaveAttribute("aria-pressed", "true");
    expect(getChip("Amsterdam")).toHaveAttribute("aria-pressed", "false");
  });

  it("activates a chip from the keyboard with no extra handling, unlike the dot", async () => {
    const user = userEvent.setup();
    render(<NetherlandsMap />);
    getChip("Rotterdam").focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Opinity")).toBeInTheDocument();
  });

  it("puts the chips first, the detail panel second and the map card last on a phone", () => {
    render(<NetherlandsMap />);
    const chips = orderedBlockOf(getChip("Amsterdam"));
    const panel = orderedBlockOf(screen.getByText("tapLocation"));
    const mapCard = orderedBlockOf(screen.getByLabelText("mapAriaLabel"));
    expect(chips.getAttribute("class")).toContain("order-1");
    expect(panel.getAttribute("class")).toContain("order-2");
    expect(mapCard.getAttribute("class")).toContain("order-3");
    expect(followsInDocument(chips, panel)).toBe(true);
    expect(followsInDocument(panel, mapCard)).toBe(true);
  });

  it("names the selected city in a level three heading", async () => {
    render(<NetherlandsMap />);
    fireEvent.click(getChip("Almere"));
    expect(await screen.findByRole("heading", { level: 3, name: "Almere" })).toBeInTheDocument();
  });

  it("names the selected city in a level three heading when the city links to its region", async () => {
    render(<NetherlandsMap />);
    fireEvent.click(getChip("Utrecht"));
    expect(await screen.findByRole("heading", { level: 3, name: "Utrecht" })).toBeInTheDocument();
  });

  it("prints the full client names the work history carries", async () => {
    render(<NetherlandsMap />);
    fireEvent.click(getChip("Utrecht"));
    expect(await screen.findByText("Bluefield Smart Access")).toBeInTheDocument();
    fireEvent.click(getChip("Amsterdam"));
    expect(await screen.findByText("Nationale Postcode Loterij")).toBeInTheDocument();
  });
});
