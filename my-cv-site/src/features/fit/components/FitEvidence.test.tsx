import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FitEvidence } from "./FitEvidence";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

describe("FitEvidence", () => {
  it("links a client engagement to its own page, under one label", () => {
    render(
      <FitEvidence
        engagements={[
          { id: "bol", company: "bol.com" },
          { id: "athlon", company: "Athlon" },
        ]}
        placement="fit-evidence"
      />
    );
    expect(screen.getByText("evidenceLabel")).toBeInTheDocument();
    const engagement = screen.getByRole("link", { name: "bol.com" });
    expect(engagement).toHaveAttribute("href", "/experience/bol");
    expect(engagement).toHaveAttribute("data-placement", "fit-evidence");
    expect(screen.getByRole("link", { name: "Athlon" })).toHaveAttribute(
      "href",
      "/experience/athlon"
    );
  });

  it("names own work as text with its own label and no link", () => {
    render(
      <FitEvidence
        engagements={[{ id: "vacancy-fit", company: "Vacancy check" }]}
        placement="fit-evidence"
      />
    );
    expect(screen.getByText("ownWork.vacancy-fit")).toBeInTheDocument();
    expect(screen.getByText("ownWorkLabel")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders nothing when the list is empty", () => {
    const { container } = render(<FitEvidence engagements={[]} placement="fit-evidence" />);
    expect(container).toBeEmptyDOMElement();
  });
});
