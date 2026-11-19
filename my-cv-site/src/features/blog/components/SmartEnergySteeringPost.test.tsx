import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./SmartEnergySteeringPost";

vi.mock("./SmartEnergyPosterExplainer", () => ({
  SmartEnergyPosterExplainer: ({ locale }: { locale: string }) => <figure aria-label={`poster explainer ${locale}`} />,
}));

vi.mock("./smartEnergyGuide", () => {
  const standIn = (name: string) =>
    function StandIn({ locale }: { locale: string }) {
      return <figure aria-label={`${name} ${locale}`} />;
    };
  return {
    HexagonFigure: standIn("hexagon"),
    ApiFigure: standIn("api"),
    PipelineFigure: standIn("pipeline"),
    StaticBeat: ({ locale, tab, beat }: { locale: string; tab: string; beat: string }) => <figure aria-label={`still ${tab} ${beat} ${locale}`} />,
  };
});

const FIGURES = [
  "poster explainer",
  "hexagon",
  "still reading transaction",
  "still command confirm",
  "still safety audit",
  "api",
  "still customer notModified",
  "still cloud gates",
  "pipeline",
  "still scale levers",
];

const proseOf = (locale: "en" | "nl") => {
  const { container, unmount } = render(<Body locale={locale} />);
  const prose = container.textContent ?? "";
  unmount();
  return prose;
};

describe("SmartEnergySteeringPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("smart-energy-steering-architecture");
    expect(meta.category).toBe("architecture");
    expect(meta.track).toBe("fullstack");
    expect(meta.publishedDate).toBe("2026-10-02");
    expect(meta.title.en).toBe("How to build an energy steering platform on Azure");
    expect(meta.title.nl).toBe("Een energiestuurplatform bouwen op Azure");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("walks through eleven sections with the poster, six stills and three figures in English", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "A hexagonal core with ports and adapters",
      "How the data flows",
      "When everything runs at once",
      "The api",
      "The React frontend",
      "Security from device to browser",
      "Keeping Terraform safe",
      "Pipelines on GitHub Actions",
      "Container Apps and how it scales",
      "Observing and testing it",
      "What to take away",
    ]);
    for (const figure of FIGURES) {
      expect(screen.getByRole("figure", { name: `${figure} en` })).toBeInTheDocument();
    }
    expect(screen.getByRole("region", { name: "The seven touch points of a new asset kind." })).toBeInTheDocument();
    expect(screen.getByText("Terms used in this guide")).toBeInTheDocument();
  });

  it("lists the six consistency cases with the failure first and the key line as code", () => {
    render(<Body locale="en" />);

    const mechanisms = screen.getAllByRole("list").find((list) => list.tagName === "OL");
    expect(mechanisms).toBeDefined();
    const items = within(mechanisms as HTMLElement).getAllByRole("listitem");
    expect(items).toHaveLength(6);
    expect(items[0]).toHaveTextContent(/^The same reading can arrive twice\./);
    expect(items[5]).toHaveTextContent(/^Two hosts can start at once/);
    expect(within(items[2]).getByText("ON CONFLICT (idempotency_key) DO NOTHING")).toBeInTheDocument();
  });

  it("names the Terraform invariants and the pipeline facts", () => {
    render(<Body locale="en" />);

    expect(screen.getByText("the api never gets external ingress")).toBeInTheDocument();
    expect(screen.getByText("pro locks the vault and the database, with purge protection")).toBeInTheDocument();
    expect(screen.getByText(/terraform test runs 57 cases against mocked providers/)).toBeInTheDocument();
    expect(screen.getByText(/logs in to Azure with OIDC, through a federated credential per GitHub environment/)).toBeInTheDocument();
  });

  it("renders the Dutch body with the same sections and figures", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(11);
    expect(screen.getByRole("heading", { level: 2, name: "Als alles tegelijk draait" })).toBeInTheDocument();
    for (const figure of FIGURES) {
      expect(screen.getByRole("figure", { name: `${figure} nl` })).toBeInTheDocument();
    }
    expect(screen.getByText("Begrippen in deze gids")).toBeInTheDocument();
    expect(screen.getByText(/een Origin-header die bij de host past/)).toBeInTheDocument();
  });

  it("says it ran live on Azure for a demo and keeps pro marked as never applied", () => {
    const prose = proseOf("en");
    expect(prose).toMatch(/it ran live on Azure Container Apps for a demo/);
    expect(prose).toMatch(/Pro was never applied/);
    expect(prose).not.toMatch(/Eneco/);
  });

  it("reads as a guide, without the log of the repository", () => {
    for (const locale of ["en", "nl"] as const) {
      const prose = proseOf(locale);
      expect(prose).not.toMatch(/2 October|2 oktober/);
      expect(prose).not.toMatch(/\bS1[0-6]?\b|GHSA-|CVE-/);
      expect(prose).not.toMatch(/904|439 dashboard/);
      expect(prose).not.toMatch(/never ran at a client|nooit bij een klant/);
      expect(prose).not.toMatch(/github\.com\/hilmarvdveen\/smart-energy-poc/);
      expect(prose).not.toMatch(/\basked\b|\bgesteld\b/);
    }
  });

  it("keeps out claims the snapshot does not record and every measured number", () => {
    for (const locale of ["en", "nl"] as const) {
      const prose = proseOf(locale);
      expect(prose).not.toMatch(/\d+\s?%/);
      expect(prose).not.toMatch(/unhackable|cannot be hacked/i);
      expect(prose).not.toMatch(/SELECT FOR UPDATE/i);
      expect(prose).not.toMatch(/outbox pattern/i);
      expect(prose).not.toMatch(/in production|in productie/i);
    }
  });
});
