import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ProjectsHero } from "./ProjectsHero";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ProjectsHero", () => {
  it("renders", () => {
    const { container } = render(<ProjectsHero />);
    expect(container.firstChild).toBeTruthy();
  });
});
