import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { TechStackSection } from "./TechStackSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

describe("TechStackSection", () => {
  it("renders the tech stack", () => {
    const { container } = render(<TechStackSection />);
    expect(container.firstChild).toBeTruthy();
  });
});
