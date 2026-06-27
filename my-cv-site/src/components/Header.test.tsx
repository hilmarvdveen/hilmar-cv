import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => "/services",
  useRouter: () => ({ replace }),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

import { Header } from "./Header";

describe("Header", () => {
  beforeEach(() => replace.mockReset());

  it("renders the primary navigation items", () => {
    render(<Header />);
    expect(screen.getAllByText("nav.home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("nav.services").length).toBeGreaterThan(0);
    expect(screen.getAllByText("nav.projects").length).toBeGreaterThan(0);
    expect(screen.getAllByText("nav.contact").length).toBeGreaterThan(0);
  });

  it("highlights the active route", () => {
    render(<Header />);
    const servicesLink = screen.getAllByText("nav.services")[0].closest("a");
    expect(servicesLink?.className).toContain("text-blue-600");
  });

  it("switches locale via the language switcher", async () => {
    const user = userEvent.setup();
    render(<Header />);
    // The mobile drawer always renders both locale buttons.
    const dutch = screen.getAllByText("Nederlands")[0].closest("button")!;
    await user.click(dutch);
    expect(replace).toHaveBeenCalledWith("/services", { locale: "nl" });
  });

  it("opens the mobile menu and navigates via a drawer link", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByLabelText("Open menu")); // open drawer
    // Drawer nav links close the menu on click (covers that handler).
    const drawerLink = screen.getAllByText("nav.contact")[0].closest("a")!;
    await user.click(drawerLink);
  });

  it("opens the desktop language dropdown and selects English", async () => {
    const user = userEvent.setup();
    render(<Header />);
    // Desktop switcher button shows the current locale label ("English").
    const langButton = screen.getAllByText("English")[0].closest("button")!;
    await user.click(langButton); // opens dropdown (covers setIsLanguageOpen)
    const englishOptions = screen.getAllByText("English");
    await user.click(englishOptions[englishOptions.length - 1].closest("button")!);
    expect(replace).toHaveBeenCalledWith("/services", { locale: "en" });
  });
});
