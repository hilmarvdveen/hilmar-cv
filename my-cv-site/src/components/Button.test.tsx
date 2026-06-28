import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, buttonClassName } from "./Button";

// The locale-aware Link is mocked globally in vitest.setup.ts (rendered as <a>).

describe("Button", () => {
  it("renders a <button> with primary styles by default and passes through props", () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" onClick={onClick} disabled>
        Send
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Send" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "submit");
    expect(btn).toBeDisabled();
    // primary: filled emerald that darkens on hover (never lightens)
    expect(btn.className).toContain("bg-emerald-700");
    expect(btn.className).toContain("hover:bg-emerald-800");
  });

  it("renders an internal href as a Link (anchor)", () => {
    render(<Button href="/book">Book</Button>);
    const link = screen.getByRole("link", { name: "Book" });
    expect(link).toHaveAttribute("href", "/book");
  });

  it("renders external/mailto/tel hrefs as a plain <a>", () => {
    render(
      <Button href="mailto:test@example.com" target="_blank">
        Mail
      </Button>
    );
    const link = screen.getByRole("link", { name: "Mail" });
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("applies variant and size classes", () => {
    expect(buttonClassName({ variant: "outline", size: "lg" })).toContain(
      "border-emerald-600"
    );
    expect(buttonClassName({ variant: "white" })).toContain("bg-white");
    expect(buttonClassName({ variant: "outlineOnDark" })).toContain(
      "text-emerald-300"
    );
    expect(buttonClassName({ size: "sm" })).toContain("px-4 py-2.5");
    // custom className is appended
    expect(buttonClassName({ className: "w-full" })).toContain("w-full");
  });
});
