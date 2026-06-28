import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout, type CalloutVariant } from "./Callout";

describe("Callout", () => {
  it("renders every variant with a title", () => {
    const variants: CalloutVariant[] = ["info", "tip", "warning", "success"];
    for (const variant of variants) {
      const { unmount } = render(
        <Callout variant={variant} title={`title-${variant}`}>
          body-{variant}
        </Callout>
      );
      expect(screen.getByText(`title-${variant}`)).toBeInTheDocument();
      expect(screen.getByText(`body-${variant}`)).toBeInTheDocument();
      unmount();
    }
  });

  it("defaults to the info variant and renders without a title", () => {
    render(<Callout>untitled note</Callout>);
    expect(screen.getByText("untitled note")).toBeInTheDocument();
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
