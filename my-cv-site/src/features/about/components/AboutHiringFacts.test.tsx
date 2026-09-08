import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutHiringFacts } from "./AboutHiringFacts";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

const facts = [
  { label: "Available", value: "From 1 October 2026", detail: "Earlier by arrangement" },
  { label: "Working arrangement", value: "The Randstad", detail: "One to two days on site" },
  { label: "Company", value: "{company}", detail: "KVK {kvk}, {city}" },
  { label: "Contract", value: "Freelance, ZZP", detail: "32 to 40 hours a week" },
  { label: "Languages", value: "Dutch and English", detail: "Native and fluent" },
  { label: "Education", value: "BSc Physics and Astronomy" },
];

vi.mock("next-intl", () => {
  const t = ((key: string, values?: Record<string, string>) => {
    const path = key.split(".");
    const fact = facts[Number(path[2])] as Record<string, string | undefined>;
    const text = fact[path[3]] ?? "";
    return values
      ? text.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match)
      : text;
  }) as ((key: string) => string) & { raw: (key: string) => unknown };
  t.raw = (key: string) => (key === "hiring.facts" ? facts : []);
  return { useTranslations: () => t };
});

describe("AboutHiringFacts", () => {
  it("renders one term and one definition per fact, in order", () => {
    render(<AboutHiringFacts />);
    const terms = screen.getAllByRole("term");
    const definitions = screen.getAllByRole("definition");
    expect(terms).toHaveLength(facts.length);
    expect(definitions).toHaveLength(facts.length);
    expect(terms.map((term) => term.textContent)).toEqual(
      facts.map((fact) => fact.label)
    );
  });

  it("fills the company placeholders from the business profile", () => {
    render(<AboutHiringFacts />);
    expect(
      screen.getByText(BUSINESS_PROFILE.REGISTRATION.LEGAL_NAME)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `KVK ${BUSINESS_PROFILE.REGISTRATION.KVK}, ${BUSINESS_PROFILE.REGISTERED_ADDRESS.CITY}`
      )
    ).toBeInTheDocument();
  });

  it("adds the detail line only to the facts that carry one", () => {
    render(<AboutHiringFacts />);
    expect(screen.getByText("Earlier by arrangement")).toBeInTheDocument();
    const definitions = screen.getAllByRole("definition");
    expect(definitions[0].textContent).toBe(
      "From 1 October 2026Earlier by arrangement"
    );
    expect(definitions[5].textContent).toBe("BSc Physics and Astronomy");
  });
});
