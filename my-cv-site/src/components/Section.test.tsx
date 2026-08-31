import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders children inside a section element", () => {
    const { container } = render(
      <Section>
        <p>Content</p>
      </Section>
    );
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section?.textContent).toBe("Content");
  });

  it("applies the white background and default padding by default", () => {
    const { container } = render(<Section>x</Section>);
    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-white");
    expect(section).toHaveClass("py-16");
  });

  it("applies the navy background variant", () => {
    const { container } = render(<Section background="navy">x</Section>);
    expect(container.querySelector("section")).toHaveClass("bg-brand-navy");
  });

  it("applies the light background and compact padding variants", () => {
    const { container } = render(
      <Section background="light" padding="compact">
        x
      </Section>
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-bgLight");
    expect(section).toHaveClass("py-12");
  });

  it("applies the spacious padding variant", () => {
    const { container } = render(<Section padding="spacious">x</Section>);
    expect(container.querySelector("section")).toHaveClass("py-20");
  });

  it("forwards id, aria-labelledby and extra classes", () => {
    const { container } = render(
      <Section id="proof" aria-labelledby="proof-heading" className="border-t">
        x
      </Section>
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "proof");
    expect(section).toHaveAttribute("aria-labelledby", "proof-heading");
    expect(section).toHaveClass("border-t");
  });
});
