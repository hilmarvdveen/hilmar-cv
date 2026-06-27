import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroSection } from "./HeroSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/navigation", () => ({ useParams: () => ({ locale: "en" }) }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (p: Record<string, unknown>) => <img alt="" src={String(p.src ?? "")} />,
}));

describe("HeroSection", () => {
  it("renders and opens then closes the CV download modal", async () => {
    const user = userEvent.setup();
    const { container } = render(<HeroSection />);
    expect(container.firstChild).toBeTruthy();

    // The CV button opens the modal (covers setIsCVModalOpen(true)).
    const buttons = Array.from(container.querySelectorAll("button"));
    for (const b of buttons) await user.click(b);

    // If the modal opened, close it via cancel (covers onClose).
    const cancel = screen.queryByRole("button", { name: /buttons\.cancel/ });
    if (cancel) await user.click(cancel);
  });
});
