import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

// Minimal next-intl mock: translation keys echo back, interests come from raw().
vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => string[];
    };
    t.raw = () => ["React", "TypeScript"];
    return t;
  },
}));

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

    await user.type(screen.getByLabelText("form.name"), "Jane Doe");
    await user.type(screen.getByLabelText("form.email"), "jane@example.com");
    await user.type(screen.getByLabelText("form.message"), "Hello!");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("/api/contact");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello!",
      company_website: "", // honeypot present and empty for a real user
    });
    expect(typeof body.formStartedAt).toBe("number");
    expect(Array.isArray(body.interests)).toBe(true);
  });

  it("toggles interest tags on and off", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const tag = screen.getByRole("button", { name: "React" });
    await user.click(tag); // select
    expect(tag).toHaveAttribute("aria-pressed", "true");
    await user.click(tag); // deselect (covers both filter branches)
    expect(tag).toHaveAttribute("aria-pressed", "false");
  });

  it("falls back to the generic error message on a non-Error rejection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw "boom"; // non-Error rejection
      })
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText("form.name"), "Jane");
    await user.type(screen.getByLabelText("form.email"), "jane@example.com");
    await user.type(screen.getByLabelText("form.message"), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));
    await waitFor(() =>
      expect(screen.getByText("form.serverError")).toBeInTheDocument()
    );
  });

  it("shows a success message after submitting", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("form.name"), "Jane");
    await user.type(screen.getByLabelText("form.email"), "jane@example.com");
    await user.type(screen.getByLabelText("form.message"), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() =>
      expect(screen.getByText("form.successMessage")).toBeInTheDocument()
    );
  });

  it("surfaces the API error message when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 }))
    );
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("form.name"), "Jane");
    await user.type(screen.getByLabelText("form.email"), "jane@example.com");
    await user.type(screen.getByLabelText("form.message"), "Hi");
    await user.click(screen.getByRole("button", { name: /form\.submit/ }));

    await waitFor(() =>
      expect(screen.getByText("Too many requests")).toBeInTheDocument()
    );
  });
});
