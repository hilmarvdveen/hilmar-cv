import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  clearBookingDraft,
  readBookingDraft,
  writeBookingDraft,
} from "./draftStorage";

const STORAGE_KEY = "hilmar-booking-form-state";

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("readBookingDraft", () => {
  it("hands the stored draft to the callback", () => {
    localStorage.setItem(STORAGE_KEY, "{\"step\":2}");
    const received: (string | null)[] = [];

    readBookingDraft((raw) => received.push(raw));

    expect(received).toEqual(["{\"step\":2}"]);
  });

  it("hands null to the callback when nothing is stored", () => {
    const received: (string | null)[] = [];

    readBookingDraft((raw) => received.push(raw));

    expect(received).toEqual([null]);
  });

  it("warns once and hands null to the callback when storage refuses the read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    const received: (string | null)[] = [];

    readBookingDraft((raw) => received.push(raw));

    expect(received).toEqual([null]);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});

describe("writeBookingDraft", () => {
  it("stores the draft", () => {
    writeBookingDraft("{\"step\":3}");

    expect(localStorage.getItem(STORAGE_KEY)).toBe("{\"step\":3}");
  });

  it("warns and keeps going when storage refuses the write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() => writeBookingDraft("{}")).not.toThrow();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});

describe("clearBookingDraft", () => {
  it("removes the draft", () => {
    localStorage.setItem(STORAGE_KEY, "{}");

    clearBookingDraft();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("warns and keeps going when storage refuses the removal", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    expect(() => clearBookingDraft()).not.toThrow();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
