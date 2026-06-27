import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Footer } from "./Footer";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Footer", () => {
  it("renders all footer sections", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeTruthy();
    expect(container.querySelectorAll("a").length).toBeGreaterThan(0);
  });
});
