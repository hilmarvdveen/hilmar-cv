import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { CertificationsSection } from "./CertificationSection";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

describe("CertificationsSection", () => {
  it("renders the certifications", () => {
    const { container } = render(<CertificationsSection />);
    expect(container.firstChild).toBeTruthy();
  });
});
