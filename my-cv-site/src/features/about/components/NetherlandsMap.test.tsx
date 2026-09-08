import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NetherlandsMap } from "./NetherlandsMap";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const emptyProvinceCollection = { type: "FeatureCollection", features: [] };

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

  it("exposes every city dot as a named, keyboard-reachable button", async () => {
    render(<NetherlandsMap />);
    for (const name of cityNames) {
      const button = await screen.findByRole("button", { name });
      expect(button).toHaveAttribute("tabindex", "0");
    }
  });

  it("selects a city when Enter is pressed on its hit target", async () => {
    render(<NetherlandsMap />);
    const amsterdam = await screen.findByRole("button", { name: "Amsterdam" });
    fireEvent.keyDown(amsterdam, { key: "Enter" });
    expect(await screen.findByText("Randstad")).toBeInTheDocument();
  });

  it("selects a city when Space is pressed on its hit target", async () => {
    render(<NetherlandsMap />);
    const rotterdam = await screen.findByRole("button", { name: "Rotterdam" });
    fireEvent.keyDown(rotterdam, { key: " " });
    expect(await screen.findByText("Opinity")).toBeInTheDocument();
  });

  it("selects a city on click, matching the existing pointer behaviour", async () => {
    render(<NetherlandsMap />);
    const almere = await screen.findByRole("button", { name: "Almere" });
    fireEvent.click(almere);
    expect(await screen.findByText("Athlon")).toBeInTheDocument();
  });

  it("ignores keys other than Enter and Space", async () => {
    render(<NetherlandsMap />);
    const hoorn = await screen.findByRole("button", { name: "Hoorn" });
    fireEvent.keyDown(hoorn, { key: "Tab" });
    expect(screen.queryByText("Niped")).not.toBeInTheDocument();
  });
});
