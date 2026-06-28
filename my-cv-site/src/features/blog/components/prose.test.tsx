import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { slugify, H2, H3, Lead, P, UL, OL, LI, Strong, InlineCode, A, Divider, Quote } from "./prose";

describe("prose primitives", () => {
  it("slugify normalizes heading text", () => {
    expect(slugify("Hello, World!  Foo")).toBe("hello-world-foo");
    expect(slugify("  Trim & Symbols *** ")).toBe("trim-symbols");
  });

  it("renders every primitive and derives heading ids", () => {
    render(
      <div>
        <H2>Heading Two</H2>
        <H2 id="custom">Explicit Id</H2>
        <H2>
          <span>Non String</span>
        </H2>
        <H3>Heading Three</H3>
        <Lead>lead text</Lead>
        <P>paragraph text</P>
        <UL>
          <LI>list one</LI>
        </UL>
        <OL>
          <LI>list two</LI>
        </OL>
        <P>
          <Strong>bold</Strong> <InlineCode>code()</InlineCode>
        </P>
        <A href="/internal">internal link</A>
        <A href="https://example.com">external link</A>
        <Quote>a quote</Quote>
        <Divider />
      </div>
    );

    expect(screen.getByText("Heading Two").id).toBe("heading-two");
    expect(screen.getByText("Explicit Id").id).toBe("custom");
    // non-string heading child → no derived id
    expect(screen.getByText("Non String").closest("h2")?.id).toBe("");
    expect(screen.getByText("external link").getAttribute("target")).toBe("_blank");
    expect(screen.getByText("internal link").getAttribute("target")).toBeNull();
    expect(screen.getByText("code()")).toBeInTheDocument();
  });
});
