import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ServicesHero } from "./ServicesHero";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ServicesHero", () => {
  it("renders the service cards", () => {
    const { container } = render(<ServicesHero />);
    expect(container.firstChild).toBeTruthy();
  });
});
