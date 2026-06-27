import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ContactHero } from "./ContactHero";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ContactHero", () => {
  it("renders", () => {
    const { container } = render(<ContactHero />);
    expect(container.firstChild).toBeTruthy();
  });
});
