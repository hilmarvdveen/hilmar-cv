import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the translated title, description and both ways out", async () => {
    render(await NotFound());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("title");
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "backHome" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute("href", "/contact");
  });
});
