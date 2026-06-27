import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchPageContent } from "./SearchPageContent";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SearchPageContent", () => {
  it("shows matching results and filters as the user types (en)", async () => {
    const user = userEvent.setup();
    render(<SearchPageContent locale="en" initialQuery="frontend" />);

    expect(screen.getByRole("heading", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("Frontend development")).toBeInTheDocument();

    const input = screen.getByRole("searchbox");
    await user.clear(input);
    await user.type(input, "zzz-no-match");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("renders Dutch labels for the nl locale", () => {
    render(<SearchPageContent locale="nl" initialQuery="" />);
    expect(screen.getByRole("heading", { name: "Zoeken" })).toBeInTheDocument();
    // Empty query lists all entries.
    expect(screen.getByText(/resultaten/)).toBeInTheDocument();
  });
});
