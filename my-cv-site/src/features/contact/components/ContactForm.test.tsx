import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => string[];
    };
    t.raw = () => ["React", "TypeScript"];
    return t;
  },
  useLocale: () => "en",
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/en" }));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 }))
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the form data plus honeypot fields to /api/contact", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^form\.name/), "Jane Doe");
    await user.type(screen.getByLabelText(/^form\.email/), "jane@example.com");
    await user.type(screen.getByLabelText(/^form\.company/), "Acme BV");
    await user.type(screen.getByLabelText(/^form\.start/), "1 October 2026");
    await user.type(screen.getByLabelText(/^form\.message/), "Hello!");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [url, init] = (fetch as unknown as Mock).mock.calls[0];
    expect(url).toBe("/api/contact");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      company: "Acme BV",
      start: "1 October 2026",
      message: "Hello!",
      locale: "en",
      company_website: "",
    });
    expect(typeof body.formStartedAt).toBe("number");
    expect(Array.isArray(body.interests)).toBe(true);
  });

  it("posts empty company and start values when the visitor leaves them blank", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^form\.name/), "Jane Doe");
    await user.type(screen.getByLabelText(/^form\.email/), "jane@example.com");
    await user.type(screen.getByLabelText(/^form\.message/), "Hello!");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [, init] = (fetch as unknown as Mock).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({ company: "", start: "" });
  });

  it("toggles interest tags on and off", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const tag = screen.getByRole("button", { name: "React" });
    await user.click(tag);
    expect(tag).toHaveAttribute("aria-pressed", "true");
    await user.click(tag);
    expect(tag).toHaveAttribute("aria-pressed", "false");
  });

  it("falls back to the generic error message on a non-Error rejection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw "boom";
      })
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^form\.name/), "Jane");
    await user.type(screen.getByLabelText(/^form\.email/), "jane@example.com");
    await user.type(screen.getByLabelText(/^form\.message/), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));
    await waitFor(() =>
      expect(screen.getByText("form.serverError")).toBeInTheDocument()
    );
  });

  it("shows a success message and a booking link after submitting", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^form\.name/), "Jane");
    await user.type(screen.getByLabelText(/^form\.email/), "jane@example.com");
    await user.type(screen.getByLabelText(/^form\.message/), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() =>
      expect(screen.getByText("form.successMessage")).toBeInTheDocument()
    );
    expect(screen.getByRole("link", { name: "cta.button" })).toHaveAttribute(
      "href",
      "/book"
    );
  });

  it("offers no booking link before the form has been submitted", () => {
    render(<ContactForm />);
    expect(
      screen.queryByRole("link", { name: "cta.button" })
    ).not.toBeInTheDocument();
  });

  it("shows the localized rate-limit message on a 429, never the raw API text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 }))
    );
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^form\.name/), "Jane");
    await user.type(screen.getByLabelText(/^form\.email/), "jane@example.com");
    await user.type(screen.getByLabelText(/^form\.message/), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() =>
      expect(screen.getByText("form.tooManyRequests")).toBeInTheDocument()
    );
    expect(screen.queryByText("Too many requests")).not.toBeInTheDocument();
  });

  it("shows the localized server-error message on a 500, never the raw API text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 }))
    );
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^form\.name/), "Jane");
    await user.type(screen.getByLabelText(/^form\.email/), "jane@example.com");
    await user.type(screen.getByLabelText(/^form\.message/), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() =>
      expect(screen.getByText("form.serverError")).toBeInTheDocument()
    );
    expect(screen.queryByText("Internal Server Error")).not.toBeInTheDocument();
  });
});
