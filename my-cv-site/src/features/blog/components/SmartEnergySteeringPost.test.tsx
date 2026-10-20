import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta, smartEnergyExplainerLabels } from "./SmartEnergySteeringPost";

vi.mock("@/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
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
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("renders the English body with eight sections, three images, three buttons and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(8);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getAllByRole("button")).toHaveLength(3);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(8);
    expect(within(contents).getByRole("link", { name: "How does another asset kind get in?" })).toHaveAttribute(
      "href",
      "#how-does-another-asset-kind-get-in"
    );
    expect(within(contents).getByRole("link", { name: "How the data stays consistent" })).toBeInTheDocument();
    expect(within(contents).getByRole("link", { name: "What to take away" })).toBeInTheDocument();
  });

  it("carries both captions and the explainer status in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText("Writes prepare the reads. The api adds an ETag, the dashboard routes pass it on or cache for 5 seconds, and the browser polls with If-None-Match.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("The main path runs from Created to Confirmed. The dashed lines are the side exits to Rejected, Failed and Expired.")
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("One drawing, five questions.");
  });

  it("states what it never claims and quotes decision 7", () => {
    render(<Body locale="en" />);

    expect(screen.getByText("What this never claims")).toBeInTheDocument();
    expect(screen.getByText(/it never ran at a client\. No client of mine/)).toBeInTheDocument();
    expect(screen.getByText(/No AI or model call anywhere/)).toBeInTheDocument();
  });

  it("names the advisory ids of the closed dependency findings", () => {
    const { container } = render(<Body locale="en" />);
    const prose = container.textContent ?? "";
    for (const advisory of CLOSED_ADVISORIES) {
      expect(prose).toContain(advisory);
    }
  });

  it("renders the Dutch body with eight sections, three images and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(8);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(8);
    expect(within(contents).getByRole("link", { name: "Hoe de data consistent blijft" })).toBeInTheDocument();
    expect(screen.getByText("Wat dit nooit claimt")).toBeInTheDocument();
    expect(
      screen.getByText("Het hoofdpad loopt van Created naar Confirmed. De gestippelde lijnen zijn de zijuitgangen naar Rejected, Failed en Expired.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Volgende scene" })).toBeInTheDocument();
  });

  it("keeps out claims the snapshot does not record and every measured number", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const prose = container.textContent ?? "";
      expect(prose).not.toMatch(/\d+\s?%/);
      expect(prose).not.toMatch(/CVE proof/i);
      expect(prose).not.toMatch(/unhackable/i);
      expect(prose).not.toMatch(/SELECT FOR UPDATE/i);
      expect(prose).not.toMatch(/outbox pattern/i);
      expect(prose).not.toMatch(/cannot be hacked/i);
      unmount();
    }
  });

  it("mirrors every English label in Dutch", () => {
    const english = smartEnergyExplainerLabels("en");
    const dutch = smartEnergyExplainerLabels("nl");
    expect(Object.keys(dutch.scenes)).toEqual(Object.keys(english.scenes));
    expect(Object.keys(dutch.consistency)).toEqual(Object.keys(english.consistency));
    expect(dutch.title.questions).toHaveLength(english.title.questions.length);
    expect(dutch.security.gates).toEqual(english.security.gates);
    expect(dutch.scenes.consistency.title).toBe("Hoe de data consistent blijft");
    expect(english.closing.url).toBe("www.hilmarvanderveen.com");
  });
});
