import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) => {
    const translate = ((key: string) => `${namespace}.${key}`) as ((key: string) => string) & {
      raw: (key: string) => unknown;
    };
    translate.raw = () => [];
    return translate;
  },
}));

vi.mock("@/lib/seo", () => ({
  SEOFactory: { services: () => ({ metadata: {}, structuredData: "{}" }) },
}));

vi.mock("@/features/services", () => ({
  ServicesHero: () => null,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
    ...rest
  }: {
    children: ReactNode;
    href: string;
    className?: string;
  } & Record<string, unknown>) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

import ServicesPage from "./page";

describe("ServicesPage overview cards", () => {
  it("gives each service card's learn-more link a distinct accessible name", async () => {
    render(await ServicesPage({ params: Promise.resolve({ locale: "en" }) }));
    const links = screen.getAllByRole("link", {
      name: /^services\.main\.learnMore:/,
    });
    expect(links).toHaveLength(4);
    const names = new Set(links.map((link) => link.getAttribute("aria-label")));
    expect(names.size).toBe(4);
  });

  it("keeps the shared visible label on every learn-more link", async () => {
    render(await ServicesPage({ params: Promise.resolve({ locale: "en" }) }));
    const links = screen.getAllByRole("link", {
      name: /^services\.main\.learnMore:/,
    });
    for (const link of links) {
      expect(within(link).getByText("services.main.learnMore")).toBeInTheDocument();
    }
  });

  it("links each card to its service route", async () => {
    render(await ServicesPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(
      screen.getByRole("link", { name: /^services\.main\.learnMore:.*frontend\.title$/ })
    ).toHaveAttribute("href", "/services/frontend");
    expect(
      screen.getByRole("link", { name: /^services\.main\.learnMore:.*fullstack\.title$/ })
    ).toHaveAttribute("href", "/services/fullstack");
    expect(
      screen.getByRole("link", { name: /^services\.main\.learnMore:.*designSystems\.title$/ })
    ).toHaveAttribute("href", "/services/design-systems");
    expect(
      screen.getByRole("link", { name: /^services\.main\.learnMore:.*consulting\.title$/ })
    ).toHaveAttribute("href", "/services/consulting");
  });
});
