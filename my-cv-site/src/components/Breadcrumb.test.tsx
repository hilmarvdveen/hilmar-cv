import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("labels the navigation landmark with the translated aria-label", () => {
    state.path = "/en/services/frontend";
    render(<Breadcrumb />);
    expect(screen.getByRole("navigation", { name: "label" })).toBeInTheDocument();
  });

  it.each([
    "/en/services/frontend",
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
    "/en/terms/policy",
    "/en/cookies/policy",
    "/en/disclaimer/policy",
    "/en/search/results",
    "/en/experience/bol-com",
  ])("renders breadcrumb items for %s", (path) => {
    state.path = path;
    const { container } = render(<Breadcrumb />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });

  it("capitalises and dehyphenates an unmapped segment as the fallback label", () => {
    state.path = "/en/services/some-unknown-segment";
    render(<Breadcrumb />);
    expect(screen.getByText("Some unknown segment")).toBeInTheDocument();
  });
});

describe("Breadcrumb with a current label", () => {
  it("shows the given label for the last segment and keeps the parent link", () => {
    state.path = "/en/experience/postcode-loterij";
    render(<Breadcrumb currentLabel="Nationale Postcode Loterij" />);
    expect(screen.getByText("Nationale Postcode Loterij")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "experience" })).toHaveAttribute("href", "/en/experience");
  });
});
