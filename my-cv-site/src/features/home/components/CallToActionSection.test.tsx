import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { CallToActionSection } from "./CallToActionSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("CallToActionSection", () => {
  it("renders", () => {
    const { container } = render(<CallToActionSection />);
    expect(container.firstChild).toBeTruthy();
  });
});
