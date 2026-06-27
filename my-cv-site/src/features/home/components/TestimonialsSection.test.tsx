import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { TestimonialsSection } from "./TestimonialsSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

describe("TestimonialsSection", () => {
  it("renders the testimonials", () => {
    const { container } = render(<TestimonialsSection />);
    expect(container.firstChild).toBeTruthy();
  });
});
