import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();
const state = vi.hoisted(() => ({ path: "/services", search: "" }));

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
  usePathname: () => state.path,
  useRouter: () => ({ replace }),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(state.search),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...props} />;
  },
}));

import { Header } from "./Header";

describe("Header", () => {
  beforeEach(() => {
    replace.mockReset();
    state.path = "/services";
    state.search = "";
  });

  it("renders the primary navigation items", () => {
    render(<Header />);
    expect(screen.getAllByText("nav.home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("nav.services").length).toBeGreaterThan(0);
    expect(screen.getAllByText("nav.projects").length).toBeGreaterThan(0);
    expect(screen.getAllByText("nav.contact").length).toBeGreaterThan(0);
  });

  it("highlights the active route and marks it with aria-current", () => {
    render(<Header />);
    const servicesLink = screen.getAllByText("nav.services")[0].closest("a");
    expect(servicesLink?.className).toContain("text-textMain");
    expect(servicesLink).toHaveAttribute("aria-current", "page");
  });

  it("switches locale via the language switcher", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const dutch = screen.getAllByText("Nederlands")[0].closest("button")!;
    await user.click(dutch);
    expect(replace).toHaveBeenCalledWith(
      { pathname: "/services", query: {} },
      { locale: "nl" }
    );
  });

  it("keeps the search query when switching locale", async () => {
    state.path = "/search";
    state.search = "q=wcag";
    const user = userEvent.setup();
    render(<Header />);
    const dutch = screen.getAllByText("Nederlands")[0].closest("button")!;
    await user.click(dutch);
    expect(replace).toHaveBeenCalledWith(
      { pathname: "/search", query: { "q": "wcag" } },
      { locale: "nl" }
    );
  });

  it("opens the mobile menu and navigates via a drawer link", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByLabelText("nav.openMenu"));
    const drawerLink = screen.getAllByText("nav.contact")[0].closest("a")!;
    await user.click(drawerLink);
  });

  it("opens the desktop language dropdown and selects English", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const langButton = screen.getAllByText("English")[0].closest("button")!;
    await user.click(langButton);
    const englishOptions = screen.getAllByText("English");
    await user.click(englishOptions[englishOptions.length - 1].closest("button")!);
    expect(replace).toHaveBeenCalledWith(
      { pathname: "/services", query: {} },
      { locale: "en" }
    );
  });

  it("keeps the closed drawer inert and lifts that once it opens", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const drawerNav = screen.getByRole("navigation", { name: "nav.menuLabel" });
    expect(drawerNav.closest("[inert]")).not.toBeNull();

    await user.click(screen.getByLabelText("nav.openMenu"));
    expect(drawerNav.closest("[inert]")).toBeNull();
  });

  it("adds about and FAQ links to the drawer without a second booking link", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByLabelText("nav.openMenu"));

    const drawerNav = screen.getByRole("navigation", { name: "nav.menuLabel" });
    expect(within(drawerNav).getByText("nav.about")).toBeInTheDocument();
    expect(within(drawerNav).getByText("nav.faq")).toBeInTheDocument();
    expect(within(drawerNav).queryByText("nav.book")).not.toBeInTheDocument();
  });

  it("does not list about or FAQ in the desktop row", () => {
    render(<Header />);
    const desktopRow = screen.getAllByText("nav.services")[0].closest("div")!;
    expect(within(desktopRow).queryByText("nav.about")).not.toBeInTheDocument();
    expect(within(desktopRow).queryByText("nav.faq")).not.toBeInTheDocument();
  });

  it("renders both header booking buttons at the medium primary size", () => {
    render(<Header />);
    const bookingLinks = screen
      .getAllByText("nav.book")
      .map((node) => node.closest("a")!);
    expect(bookingLinks).toHaveLength(2);
    bookingLinks.forEach((link) => {
      expect(link.className).toContain("py-2.5");
    });
  });
});
