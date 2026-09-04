import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactChannels } from "./ContactChannels";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

describe("ContactChannels", () => {
  it("renders an accessible heading for the channel list", () => {
    render(<ContactChannels />);
    expect(
      screen.getByRole("heading", { level: 2, name: "direct.title" })
    ).toBeInTheDocument();
  });

  it("links to email, phone and WhatsApp with the right hrefs", () => {
    render(<ContactChannels />);
    expect(
      screen.getByRole("link", { name: "hilmar@hilmarvanderveen.com" })
    ).toHaveAttribute("href", "mailto:hilmar@hilmarvanderveen.com");
    expect(screen.getByRole("link", { name: "+31 6 8014 9947" })).toHaveAttribute(
      "href",
      "tel:+31680149947"
    );
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/31680149947"
    );
  });

  it("opens WhatsApp in a new tab", () => {
    render(<ContactChannels />);
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "target",
      "_blank"
    );
  });
});
