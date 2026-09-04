import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CVDownloadModal, cvDocumentPath } from "./CVDownloadModal";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const ENGLISH_CV = "/data/cv/hilmar_van_der_veen_cv_en.pdf";
const DUTCH_CV = "/data/cv/hilmar_van_der_veen_cv_nl.pdf";

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

  it("maps a language to its document", () => {
    expect(cvDocumentPath("nl")).toBe(DUTCH_CV);
    expect(cvDocumentPath("en")).toBe(ENGLISH_CV);
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <CVDownloadModal isOpen={false} onClose={onClose} locale="en" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("preselects the CV language from the page language", () => {
    render(<CVDownloadModal isOpen onClose={onClose} locale="nl" />);
    expect(screen.getByRole("radio", { name: "language.nl" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "language.en" })).not.toBeChecked();
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
    fireEvent.change(email, { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "recruitment" } });
    fireEvent.submit(form);

    expect(fetch).not.toHaveBeenCalled();

    fireEvent.change(email, { target: { value: "jane@example.com" } });
    fireEvent.submit(form);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("posts the lead with the chosen language, opens that CV and closes on success", async () => {
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
      cvLanguage: "en",
      company_website: "",
    });
    expect(typeof body.formStartedAt).toBe("number");

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(ENGLISH_CV, "_blank"));
    expect(onClose).toHaveBeenCalled();
  });

  it("lets an English page visitor pick the Dutch CV", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await user.click(screen.getByRole("radio", { name: "language.nl" }));
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(DUTCH_CV, "_blank"));
    const body = JSON.parse((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.cvLanguage).toBe("nl");
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

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(ENGLISH_CV, "_blank"));
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

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(ENGLISH_CV, "_blank"));
  });

  it("opens the document before the lead request resolves, then posts the lead and closes", async () => {
    const callOrder: string[] = [];
    openSpy.mockImplementation(() => {
      callOrder.push("open");
      return null;
    });
    let resolveFetch: (response: Response) => void = () => {};
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        callOrder.push("fetch");
        return new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        });
      })
    );
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    expect(callOrder).toEqual(["open", "fetch"]);
    expect(onClose).not.toHaveBeenCalled();

    resolveFetch(new Response(JSON.stringify({ success: true }), { status: 200 }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("still posts the lead and closes when opening the document throws", async () => {
    openSpy.mockImplementation(() => {
      throw new Error("popup blocked");
    });
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /buttons\.download/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
