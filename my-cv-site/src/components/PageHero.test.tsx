import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHero } from "./PageHero";

const DummyIcon = ({ className }: { className?: string }) => (
  <svg className={className} />
);

describe("PageHero", () => {
  it("renders the title as the page heading and labels the section by it", () => {
    render(
      <PageHero
        title="Book a 30-minute call"
        description="No obligation, a clear answer either way."
      />
    );
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Book a 30-minute call",
    });
    expect(heading).toHaveAttribute("id", "page-hero-title");
    const region = screen.getByRole("region", { name: "Book a 30-minute call" });
    expect(region).toContainElement(heading);
  });

  it("uses a custom title id in place of the default", () => {
    render(
      <PageHero
        title="Services"
        description="What I deliver."
        titleId="services-hero-title"
      />
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Services" });
    expect(heading).toHaveAttribute("id", "services-hero-title");
    expect(screen.getByRole("region", { name: "Services" })).toBeInTheDocument();
  });

  it("appends the title accent inside the heading when given", () => {
    render(
      <PageHero
        title="Senior frontend, "
        titleAccent="fully in hand."
        description="Description text."
      />
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Senior frontend, fully in hand.");
  });

  it("omits the accent span when no accent is given", () => {
    render(<PageHero title="Plain title" description="Description text." />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.querySelector("span")).toBeNull();
  });

  it("renders a badge with its icon when both are given", () => {
    render(
      <PageHero
        title="Title"
        description="Description text."
        badge="Available now"
        badgeIcon={DummyIcon}
      />
    );
    const badge = screen.getByText("Available now");
    expect(badge.querySelector("svg")).not.toBeNull();
  });

  it("renders a badge without an icon when none is given", () => {
    render(
      <PageHero title="Title" description="Description text." badge="Available now" />
    );
    const badge = screen.getByText("Available now");
    expect(badge.querySelector("svg")).toBeNull();
  });

  it("omits the badge entirely when none is given", () => {
    const { container } = render(
      <PageHero title="Title" description="Description text." />
    );
    expect(screen.queryByText("Available now")).toBeNull();
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });

  it("renders the breadcrumb before the hero content when given", () => {
    render(
      <PageHero
        title="Title"
        description="Description text."
        breadcrumb={<span>Home / Services</span>}
      />
    );
    expect(screen.getByText("Home / Services")).toBeInTheDocument();
  });

  it("omits the breadcrumb wrapper when none is given", () => {
    render(<PageHero title="Title" description="Description text." />);
    expect(screen.queryByText("Home / Services")).toBeNull();
  });

  it("renders children below the description when given", () => {
    render(
      <PageHero title="Title" description="Description text.">
        <p>Fact chips go here</p>
      </PageHero>
    );
    expect(screen.getByText("Fact chips go here")).toBeInTheDocument();
  });

  it("omits the children wrapper when none is given", () => {
    render(<PageHero title="Title" description="Description text." />);
    expect(screen.queryByText("Fact chips go here")).toBeNull();
  });

  it("renders actions when given", () => {
    render(
      <PageHero
        title="Title"
        description="Description text."
        actions={<button type="button">Book a call</button>}
      />
    );
    expect(
      screen.getByRole("button", { name: "Book a call" })
    ).toBeInTheDocument();
  });

  it("omits the actions wrapper when none is given", () => {
    render(<PageHero title="Title" description="Description text." />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders both columns when an aside is given", () => {
    render(
      <PageHero
        title="Title"
        description="Description text."
        aside={<p>Booking summary</p>}
      />
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Title" })
    ).toBeInTheDocument();
    expect(screen.getByText("Booking summary")).toBeInTheDocument();
  });

  it("omits the aside column when none is given", () => {
    render(<PageHero title="Title" description="Description text." />);
    expect(screen.queryByText("Booking summary")).toBeNull();
  });
});
