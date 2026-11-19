import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./SmartEnergySteeringPost";

vi.mock("./SmartEnergyPosterExplainer", () => ({
  SmartEnergyPosterExplainer: ({ locale }: { locale: string }) => <figure aria-label={`poster explainer ${locale}`} />,
}));

const CLOSED_ADVISORIES = [
  "GHSA-vcvr-r3jv-pc5j",
  "GHSA-cjq9-62q9-8jv4",
  "CVE-2026-29089",
  "GHSA-xcpc-8h2w-3j85",
  "GHSA-wq5f-xc86-pv6w",
  "GHSA-68fv-2mgg-jv7q",
  "GHSA-c399-9853-6jmj",
  "GHSA-r955-8q5j-3h83",
  "GHSA-846f-f764-76mx",
  "GHSA-2fmv-rv2c-59x7",
  "CVE-2026-85091",
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
    expect(meta.title.en).toBe("One drawing, five questions about a steering platform");
    expect(meta.title.nl).toBe("Een tekening, vijf vragen over een stuurplatform");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.description.en).toMatch(/^My own proof of concept that plans a battery/);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("opens the English body with the poster explainer and keeps eight sections without a contents box", () => {
    render(<Body locale="en" />);

    expect(screen.getByRole("figure", { name: "poster explainer en" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(8);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.queryByRole("navigation", { name: "In this article" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("carries both diagram captions in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText("Writes prepare the reads. The api adds an ETag, the dashboard routes pass it on or cache for 5 seconds, and the browser polls with If-None-Match.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("The main path runs from Created to Confirmed. The dashed lines are the side exits to Rejected, Failed and Expired.")
    ).toBeInTheDocument();
  });

  it("states the scope once, gives the proof and quotes decision 7 in the text", () => {
    render(<Body locale="en" />);

    expect(screen.getByText(/^It never ran at a client, and no client system appears in it\./)).toBeInTheDocument();
    expect(screen.getByText(/904 backend tests, 439 dashboard tests and two Playwright journeys/)).toBeInTheDocument();
    expect(screen.getByText(/The seventh decision in the repository reads: No AI or model call anywhere\./)).toBeInTheDocument();
    expect(screen.getByText("Database or memory, one port")).toBeInTheDocument();
  });

  it("names the advisory ids of the closed dependency findings", () => {
    const prose = proseOf("en");
    for (const advisory of CLOSED_ADVISORIES) {
      expect(prose).toContain(advisory);
    }
  });

  it("renders the Dutch body with the poster explainer, the scope line and the captions", () => {
    render(<Body locale="nl" />);

    expect(screen.getByRole("figure", { name: "poster explainer nl" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(8);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByText(/^Het heeft nooit bij een klant gedraaid/)).toBeInTheDocument();
    expect(screen.getByText(/904 backendtests, 439 dashboardtests/)).toBeInTheDocument();
    expect(
      screen.getByText("Het hoofdpad loopt van Created naar Confirmed. De gestippelde lijnen zijn de zijuitgangen naar Rejected, Failed en Expired.")
    ).toBeInTheDocument();
  });

  it("drops the asked framing, the honesty line and the repeated not measured remark", () => {
    const english = proseOf("en");
    expect(english).not.toMatch(/\basked\b/);
    expect(english).not.toMatch(/and no more/);
    expect(english).not.toMatch(/None of (it|them) is (measured|a measurement)/);
    expect(english.match(/measured, so no number/g)).toHaveLength(1);

    const dutch = proseOf("nl");
    expect(dutch).not.toMatch(/\bgesteld\b/);
    expect(dutch).not.toMatch(/vroeg niemand/);
    expect(dutch).not.toMatch(/en niet meer/);
    expect(dutch).not.toMatch(/Niets daarvan is gemeten|Geen ervan is een meting/);
    expect(dutch.match(/niets gemeten/g)).toHaveLength(1);
  });

  it("keeps out claims the snapshot does not record and every measured number", () => {
    for (const locale of ["en", "nl"] as const) {
      const prose = proseOf(locale);
      expect(prose).not.toMatch(/\d+\s?%/);
      expect(prose).not.toMatch(/CVE proof/i);
      expect(prose).not.toMatch(/unhackable/i);
      expect(prose).not.toMatch(/SELECT FOR UPDATE/i);
      expect(prose).not.toMatch(/outbox pattern/i);
      expect(prose).not.toMatch(/cannot be hacked/i);
    }
  });
});
