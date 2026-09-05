import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactChannels } from "./ContactChannels";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const linkByHref = (href: string) =>
  screen.getAllByRole("link").find((link) => link.getAttribute("href") === href);

describe("ContactChannels", () => {
  it("renders an accessible heading for the channel list", () => {
    render(<ContactChannels />);
    expect(
      screen.getByRole("heading", { level: 2, name: "direct.title" })
    ).toBeInTheDocument();
  });

  it("links to email, phone and WhatsApp with the right hrefs and shows the value on each card", () => {
    render(<ContactChannels />);
    expect(linkByHref("mailto:hilmar@hilmarvanderveen.com")).toHaveTextContent(
      "hilmar@hilmarvanderveen.com"
    );
    expect(linkByHref("tel:+31680149947")).toHaveTextContent("+31 6 8014 9947");
    expect(linkByHref("https://wa.me/31680149947")).toHaveTextContent("+31 6 8014 9947");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("opens WhatsApp in a new tab and keeps the other two in place", () => {
    render(<ContactChannels />);
    expect(linkByHref("https://wa.me/31680149947")).toHaveAttribute("target", "_blank");
    expect(linkByHref("mailto:hilmar@hilmarvanderveen.com")).not.toHaveAttribute("target");
  });
});
