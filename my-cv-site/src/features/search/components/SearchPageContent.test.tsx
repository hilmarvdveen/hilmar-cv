import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchPageContent } from "./SearchPageContent";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SearchPageContent", () => {
  it("shows matching results and filters as the user types (en)", async () => {
    const user = userEvent.setup();
    render(<SearchPageContent locale="en" initialQuery="frontend" />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByText("Frontend development")).toBeInTheDocument();

    const input = screen.getByLabelText("inputLabel");
    await user.clear(input);
    await user.type(input, "zzz-no-match");
    expect(screen.queryByText("Frontend development")).not.toBeInTheDocument();
    expect(screen.getByText("empty")).toBeInTheDocument();
  });

  it("selects Dutch entry titles for the nl locale", () => {
    render(<SearchPageContent locale="nl" initialQuery="frontend" />);
    expect(screen.getByText("Frontend-ontwikkeling")).toBeInTheDocument();
    expect(screen.queryByText("Frontend development")).not.toBeInTheDocument();
  });

  it("renders the results count text", () => {
    render(<SearchPageContent locale="en" initialQuery="frontend" />);
    expect(screen.getByText("resultsCount")).toBeInTheDocument();
  });
});
