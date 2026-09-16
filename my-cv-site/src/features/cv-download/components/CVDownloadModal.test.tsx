import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CVDownloadModal, cvDocumentPath } from "./CVDownloadModal";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const pushSiteEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics/events", () => ({ pushSiteEvent }));

const ENGLISH_CV = "/data/cv/hilmar_van_der_veen_cv_en.pdf";
const DUTCH_CV = "/data/cv/hilmar_van_der_veen_cv_nl.pdf";

const purposeSelect = () => screen.getByRole("combobox", { name: /fields\.purpose/ });

const submitButton = () => screen.getByRole("button", { name: /buttons\.download/ });

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: /fields\.name/ }), "Jane");
  await user.type(screen.getByRole("textbox", { name: /fields\.email/ }), "jane@example.com");
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await fillRequiredFields(user);
  await user.selectOptions(purposeSelect(), screen.getByRole("option", { name: "purposes.recruitment" }));
}

const postedBody = () => JSON.parse((fetch as unknown as Mock).mock.calls[0][1].body);

describe("CVDownloadModal", () => {
  let onClose: Mock;
  let openSpy: Mock;

  beforeEach(() => {
    onClose = vi.fn();
    openSpy = vi.fn();
    pushSiteEvent.mockClear();
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
    await user.click(submitButton());

    expect(await screen.findByText("validation.nameRequired")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("clears a field's error once the visitor types in that field", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await user.click(submitButton());
    expect(await screen.findByText("validation.nameRequired")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: /fields\.name/ }), "J");

    expect(screen.queryByText("validation.nameRequired")).not.toBeInTheDocument();
    expect(screen.getByText("validation.emailRequired")).toBeInTheDocument();
  });

  it("blocks an invalid email, then submits after it is corrected", async () => {
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    const email = screen.getByRole("textbox", { name: /fields\.email/ });

    fireEvent.change(screen.getByRole("textbox", { name: /fields\.name/ }), {
      target: { value: "Jane" },
    });
    fireEvent.change(email, { target: { value: "jane@example" } });
    fireEvent.click(submitButton());

    expect(await screen.findByText("validation.emailInvalid")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();

    fireEvent.change(email, { target: { value: "jane@example.com" } });
    fireEvent.click(submitButton());
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("offers only the two buyer reasons plus something else", () => {
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    const optionNames = screen
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(optionNames).toEqual([
      "placeholders.purpose",
      "purposes.recruitment",
      "purposes.projectInquiry",
      "purposes.other",
    ]);
  });

  it("marks the reason as optional rather than required", () => {
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    expect(purposeSelect()).toHaveAccessibleName("fields.purpose (fields.optional)");
  });

  it("downloads and posts an empty reason when the visitor skips it", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillRequiredFields(user);
    await user.click(submitButton());

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(postedBody()).toMatchObject({ name: "Jane", purpose: "" });
    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(ENGLISH_CV, "_blank"));
    expect(onClose).toHaveBeenCalled();
  });

  it("posts the buyer reason the visitor picks", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillRequiredFields(user);
    await user.selectOptions(
      purposeSelect(),
      screen.getByRole("option", { name: "purposes.projectInquiry" })
    );
    await user.click(submitButton());

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(postedBody()).toMatchObject({ purpose: "project_inquiry" });
  });

  it("posts the lead with the chosen language, opens that CV and closes on success", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(submitButton());

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const body = postedBody();
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

  it("pushes the download event with the chosen language once the document opens", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(submitButton());

    await waitFor(() => expect(openSpy).toHaveBeenCalled());
    expect(pushSiteEvent).toHaveBeenCalledWith("cv_download", { language: "en" });
  });

  it("does not push the download event when opening the document throws", async () => {
    openSpy.mockImplementation(() => {
      throw new Error("popup blocked");
    });
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(submitButton());

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(pushSiteEvent).not.toHaveBeenCalled();
  });

  it("lets an English page visitor pick the Dutch CV", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await user.click(screen.getByRole("radio", { name: "language.nl" }));
    await fillValid(user);
    await user.click(submitButton());

    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(DUTCH_CV, "_blank"));
    expect(postedBody().cvLanguage).toBe("nl");
  });

  it("still downloads even when the tracking API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 }))
    );
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await fillValid(user);
    await user.click(submitButton());

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
    await user.click(submitButton());

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
    await user.click(submitButton());

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
    await user.click(submitButton());

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("exposes dialog semantics with the heading as its accessible name", () => {
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    const dialog = screen.getByRole("dialog", { name: "title" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("moves focus to the heading when it opens", () => {
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "title" }));
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("does not close on a key other than Escape", async () => {
    const user = userEvent.setup();
    render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    await user.keyboard("{Tab}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("locks page scroll while open and restores it once closed", () => {
    const { unmount } = render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("returns focus to the element that opened it, once closed", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const { unmount } = render(<CVDownloadModal isOpen onClose={onClose} locale="en" />);
    unmount();
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });
});
