import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { PostNeighbours } from "./PostNeighbours";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const older = {
  slug: "unit-testing",
  title: { en: "Unit testing", nl: "Unit testen" },
};

const newer = {
  slug: "reversible-cut-over",
  title: { en: "The reversible cut-over", nl: "De omkeerbare cut-over" },
};

describe("PostNeighbours", () => {
  it("names the navigation and links the newer post as previous and the older one as next", () => {
    render(<PostNeighbours locale="en" previous={newer} next={older} />);

    const navigation = screen.getByRole("navigation", { name: "neighbours.label" });
    const previousLink = within(navigation).getByRole("link", {
      name: "neighbours.previous: The reversible cut-over",
    });
    const nextLink = within(navigation).getByRole("link", {
      name: "neighbours.next: Unit testing",
    });

    expect(previousLink).toHaveAttribute("href", "/blog/reversible-cut-over");
    expect(nextLink).toHaveAttribute("href", "/blog/unit-testing");
  });

  it("reports both links to the measurement with their own placement", () => {
    render(<PostNeighbours locale="en" previous={newer} next={older} />);

    expect(
      screen.getByRole("link", { name: "neighbours.previous: The reversible cut-over" })
    ).toHaveAttribute("data-placement", "post-previous");
    expect(
      screen.getByRole("link", { name: "neighbours.next: Unit testing" })
    ).toHaveAttribute("data-placement", "post-next");
  });

  it("uses the Dutch titles when the locale is nl", () => {
    render(<PostNeighbours locale="nl" previous={newer} next={older} />);

    expect(
      screen.getByRole("link", { name: "neighbours.previous: De omkeerbare cut-over" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "neighbours.next: Unit testen" })
    ).toBeInTheDocument();
  });

  it("shows only the next link on the newest post", () => {
    render(<PostNeighbours locale="en" next={older} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("data-placement", "post-next");
  });

  it("shows only the previous link on the oldest post", () => {
    render(<PostNeighbours locale="en" previous={newer} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("data-placement", "post-previous");
  });

  it("renders nothing when there are no neighbours", () => {
    const { container } = render(<PostNeighbours locale="en" />);
    expect(container).toBeEmptyDOMElement();
  });
});
