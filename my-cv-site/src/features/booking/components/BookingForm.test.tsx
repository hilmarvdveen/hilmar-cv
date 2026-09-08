import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";
import { BookingFormProvider } from "../context/BookingFormContext";
import { formatLongDate, firstBookableDay } from "@/lib/booking";

const RAW_ARRAYS: Record<string, string[]> = {
  expectations: ["Thirty minutes, technical and concrete."],
  practical: ["KVK 97564303"],
};

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => RAW_ARRAYS[key] ?? [];
  return { useTranslations: () => t, useLocale: () => "en" };
});

const FIRST_DAY = firstBookableDay(new Date());
const SLOT_ONE = `${FIRST_DAY}T07:00:00.000Z`;
const SLOT_TWO = `${FIRST_DAY}T07:30:00.000Z`;

type JsonBody = Record<string, unknown>;

function jsonResponse(status: number, body: JsonBody) {
  return { ok: status < 400, status, json: async () => body };
}

type FetchOptions = {
  slotsStatus?: number;
  submitStatus?: number;
};

function installFetch({ slotsStatus = 200, submitStatus = 200 }: FetchOptions = {}) {
  const fetchMock = vi.fn(async (input: string) => {
    if (input.startsWith("/api/booking/slots")) {
      if (slotsStatus !== 200) return jsonResponse(slotsStatus, { error: "down" });
      return jsonResponse(200, {
        slots: [
          { value: SLOT_ONE, label: "09:00" },
          { value: SLOT_TWO, label: "09:30" },
        ],
      });
    }
    if (submitStatus !== 200) return jsonResponse(submitStatus, { error: "nope" });
    return jsonResponse(200, { success: true });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderForm() {
  return render(
    <BookingFormProvider>
      <BookingForm />
    </BookingFormProvider>
  );
}

const nextButton = () => screen.getAllByRole("button", { name: /navigation\.next/ })[0];
const confirmButton = () =>
  screen.getAllByRole("button", { name: /navigation\.confirm/ })[0];

async function pickFirstSlotAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "09:00" }));
  await user.click(nextButton());
  await screen.findByRole("heading", { name: "flow.steps.details" });
}

async function fillDetailsAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/flow\.details\.name/), "Jane Doe");
  await user.type(screen.getByLabelText(/flow\.details\.email/), "jane@example.com");
  await user.click(nextButton());
  await screen.findByRole("heading", { name: "flow.steps.confirm" });
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, "error").mockImplementation(() => {});
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("BookingForm: pick a moment", () => {
  it("pre-selects the first working day and shows its times without a click", async () => {
    const fetchMock = installFetch();
    renderForm();
    expect(await screen.findByRole("button", { name: "09:00" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`/api/booking/slots?date=${FIRST_DAY}`);
    expect(
      screen.getByRole("button", { name: formatLongDate(FIRST_DAY, "en"), pressed: true })
    ).toBeInTheDocument();
  });

  it("asks for a time and focuses the first one when Next is pressed too early", async () => {
    installFetch();
    const user = userEvent.setup();
    renderForm();
    const firstSlot = await screen.findByRole("button", { name: "09:00" });

    await user.click(nextButton());

    expect(screen.getByText("flow.moment.pickTime")).toBeInTheDocument();
    expect(firstSlot).toHaveFocus();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "flow.steps.moment" })).toBeInTheDocument();
  });

  it("moves on once a time is chosen and clears the reminder", async () => {
    installFetch();
    const user = userEvent.setup();
    renderForm();
    await user.click(nextButton());
    await pickFirstSlotAndContinue(user);
    expect(screen.queryByText("flow.moment.pickTime")).not.toBeInTheDocument();
  });

  it("offers a retry when the times fail to load, and recovers", async () => {
    const fetchMock = installFetch({ slotsStatus: 500 });
    const user = userEvent.setup();
    renderForm();
    const retry = await screen.findByRole("button", { name: "flow.moment.retry" });
    expect(screen.getByText("errors.loadSlotsFailed")).toBeInTheDocument();

    fetchMock.mockImplementation(async () =>
      jsonResponse(200, { slots: [{ value: SLOT_ONE, label: "09:00" }] })
    );
    await user.click(retry);
    expect(await screen.findByRole("button", { name: "09:00" })).toBeInTheDocument();
  });

  it("offers direct email and call links when the times fail to load", async () => {
    installFetch({ slotsStatus: 500 });
    renderForm();
    await screen.findByRole("button", { name: "flow.moment.retry" });

    expect(screen.getByRole("link", { name: "errors.emailAction" })).toHaveAttribute(
      "href",
      "mailto:hilmar@hilmarvanderveen.com"
    );
    expect(screen.getByRole("link", { name: "errors.callAction" })).toHaveAttribute(
      "href",
      "tel:+31680149947"
    );
  });
});

describe("BookingForm: details with direct feedback", () => {
  it("jumps to the first missing required field and names every error", async () => {
    installFetch();
    const user = userEvent.setup();
    renderForm();
    await pickFirstSlotAndContinue(user);

    await user.click(nextButton());
    expect(screen.getByText("flow.details.errors.nameRequired")).toBeInTheDocument();
    expect(screen.getByText("flow.details.errors.emailRequired")).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/flow\.details\.name/);
    expect(nameInput).toHaveFocus();
    expect(nameInput).toHaveAttribute("aria-invalid", "true");

    await user.type(nameInput, "Jane Doe");
    expect(screen.queryByText("flow.details.errors.nameRequired")).not.toBeInTheDocument();
    await user.click(nextButton());
    expect(screen.getByLabelText(/flow\.details\.email/)).toHaveFocus();

    await user.type(screen.getByLabelText(/flow\.details\.email/), "jane@");
    await user.click(nextButton());
    expect(screen.getByText("flow.details.errors.emailInvalid")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/flow\.details\.email/), "example.com");
    await user.click(nextButton());
    expect(
      await screen.findByRole("heading", { name: "flow.steps.confirm" })
    ).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});

describe("BookingForm: confirm", () => {
  it("posts the chosen slot and shows the success screen", async () => {
    const fetchMock = installFetch();
    const user = userEvent.setup();
    renderForm();
    await pickFirstSlotAndContinue(user);
    await fillDetailsAndContinue(user);

    await user.click(confirmButton());

    expect(await screen.findByRole("heading", { name: "success.title" })).toBeInTheDocument();
    const submitCall = fetchMock.mock.calls.find(([url]) => url === "/api/booking");
    expect(submitCall).toBeDefined();
    const body = JSON.parse((submitCall![1] as RequestInit).body as string);
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      date: SLOT_ONE,
      company: "",
      topic: "",
      locale: "en",
    });
    expect(localStorage.getItem("hilmar-booking-form-state")).toBeNull();
  });

  it("shows the rate-limit message on a 429 and keeps the summary", async () => {
    installFetch({ submitStatus: 429 });
    const user = userEvent.setup();
    renderForm();
    await pickFirstSlotAndContinue(user);
    await fillDetailsAndContinue(user);

    await user.click(confirmButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("errors.tooManyRequests");
    expect(screen.getByRole("heading", { name: "flow.steps.confirm" })).toBeInTheDocument();
  });

  it("lets the visitor change the moment from the summary", async () => {
    installFetch();
    const user = userEvent.setup();
    renderForm();
    await pickFirstSlotAndContinue(user);
    await fillDetailsAndContinue(user);

    await user.click(screen.getAllByRole("button", { name: /flow\.confirm\.edit/ })[0]);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "flow.steps.moment" })).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: /09:00/, pressed: true })).toBeInTheDocument();
  });
});

describe("BookingForm: a stale draft", () => {
  it("returns a saved step 3 draft to step 1 when its time is no longer offered", async () => {
    installFetch();
    localStorage.setItem(
      "hilmar-booking-form-state",
      JSON.stringify({
        details: {
          date: FIRST_DAY,
          time: `${FIRST_DAY}T05:00:00.000Z`,
          name: "Jane Doe",
          email: "jane@example.com",
        },
        step: 3,
        timestamp: Date.now() - 60 * 60 * 1000,
      })
    );
    renderForm();
    expect(await screen.findByRole("button", { name: "09:00" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "flow.steps.confirm" })).toBeNull();
  });
});
