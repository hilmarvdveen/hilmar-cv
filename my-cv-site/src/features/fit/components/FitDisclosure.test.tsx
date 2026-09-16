import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FitDisclosure } from "./FitDisclosure";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    "data-placement"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("FitDisclosure", () => {
  it("states what the assistant does and what happens to the text", () => {
    render(<FitDisclosure />);
    expect(screen.getByText("disclosure.title")).toBeInTheDocument();
    expect(screen.getByText("disclosure.assistant")).toBeInTheDocument();
    expect(screen.getByText("disclosure.processing")).toBeInTheDocument();
  });

  it("offers the call as a text link with its own placement", () => {
    render(<FitDisclosure />);
    const link = screen.getByRole("link", { name: "hero.noteLink" });
    expect(link).toHaveAttribute("href", "/book");
    expect(link).toHaveAttribute("data-placement", "fit-hero");
  });
});
