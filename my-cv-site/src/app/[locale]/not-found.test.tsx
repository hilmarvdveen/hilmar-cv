import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the translated title, description and both ways out", async () => {
    render(await NotFound());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "notFound.title"
    );
    expect(screen.getByText("notFound.description")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "notFound.backHome" })
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "search.title" })
    ).toHaveAttribute("href", "/search");
  });

  it("links to every main page", async () => {
    render(await NotFound());
    expect(
      screen.getByRole("link", { name: "common.nav.services" })
    ).toHaveAttribute("href", "/services");
    expect(
      screen.getByRole("link", { name: "common.nav.experience" })
    ).toHaveAttribute("href", "/experience");
    expect(
      screen.getByRole("link", { name: "common.nav.projects" })
    ).toHaveAttribute("href", "/projects");
    expect(
      screen.getByRole("link", { name: "common.nav.blog" })
    ).toHaveAttribute("href", "/blog");
    expect(
      screen.getByRole("link", { name: "common.nav.contact" })
    ).toHaveAttribute("href", "/contact");
  });
});
