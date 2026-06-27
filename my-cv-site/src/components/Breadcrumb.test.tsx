import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Breadcrumb } from "./Breadcrumb";

const state = vi.hoisted(() => ({ path: "/" }));

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/navigation", () => ({ usePathname: () => state.path }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Breadcrumb", () => {
  it("renders nothing for a top-level path", () => {
    state.path = "/en/about";
    const { container } = render(<Breadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  // Exercise each translated switch case plus the default capitalization branch.
  it.each([
    "/en/services/frontend",
    "/en/services/backend",
    "/en/services/fullstack",
    "/en/services/design-systems",
    "/en/services/consulting",
    "/en/projects/case-study",
    "/en/about/team",
    "/en/contact/sales",
    "/en/book/slot",
    "/en/faq/general",
    "/en/privacy/policy",
    "/en/blog/post",
  ])("renders breadcrumb items for %s", (path) => {
    state.path = path;
    const { container } = render(<Breadcrumb />);
    expect(container.querySelector("nav")).toBeTruthy();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });
});
