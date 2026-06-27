import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CVDownloadModal } from "./CVDownloadModal";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const CV_PATH = "/data/cv/hilmar_van_der_veen_cv.pdf";

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("placeholders.name"), "Jane");
  await user.type(screen.getByPlaceholderText("placeholders.email"), "jane@example.com");
  await user.selectOptions(screen.getByRole("combobox"), "recruitment");
}

describe("CVDownloadModal", () => {
  let onClose: ReturnType<typeof vi.fn>;
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 }))
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("renders nothing when closed", () => {
    const { container } = render(
      <CVDownloadModal isOpen={false} onClose={onClose} locale="en" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows validation errors and does not submit when empty", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    expect(await screen.findByText("validation.nameRequired")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("blocks an invalid email, then submits after it is corrected", async () => {
    const { container } = render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    const email = screen.getByPlaceholderText("placeholders.email");
    const form = container.querySelector("form")!;

    fireEvent.change(screen.getByPlaceholderText("placeholders.name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(email, { target: { value: "not-an-email" } }); // non-empty, invalid
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "recruitment" } });
    fireEvent.submit(form);

    // Invalid-email path executed (line 44); nothing submitted.
    expect(fetch).not.toHaveBeenCalled();

    // Correcting the email clears the field error (error-clear path) and submits.
    fireEvent.change(email, { target: { value: "jane@example.com" } });
    fireEvent.submit(form);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("posts lead with honeypot fields, opens the CV and closes on success", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const body = JSON.parse((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body).toMatchObject({
      name: "Jane",
      email: "jane@example.com",
      purpose: "recruitment",
      locale: "en",
      company_website: "",
    });
    expect(typeof body.formStartedAt).toBe("number");

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(CV_PATH, "_blank"));
    expect(onClose).toHaveBeenCalled();
  });

  it("still downloads even when the tracking API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 }))
    );
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(CV_PATH, "_blank"));
    expect(onClose).toHaveBeenCalled();
  });

  it("still downloads when the request throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      })
    );
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(CV_PATH, "_blank"));
  });
});
