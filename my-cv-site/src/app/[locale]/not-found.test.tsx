import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the translated title and description", async () => {
    render(await NotFound());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "notFound.title"
    );
    expect(screen.getByText("notFound.description")).toBeInTheDocument();
  });

  it("offers the three recovery destinations as cards", async () => {
    render(await NotFound());
    expect(
      screen.getByRole("link", { name: "notFound.backHome" })
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "search.title" })
    ).toHaveAttribute("href", "/search");
    expect(
      screen.getByRole("link", { name: "common.nav.contact" })
    ).toHaveAttribute("href", "/contact");
  });

  it("offers a booking action alongside the recovery destinations", async () => {
    render(await NotFound());
    expect(
      screen.getByRole("link", { name: "home.hero.bookCall" })
    ).toHaveAttribute("href", "/book");
  });
});
