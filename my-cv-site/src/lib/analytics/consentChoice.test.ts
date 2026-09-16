import { describe, it, expect, vi } from "vitest";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  STORAGE_EVENT,
  announceConsentChoice,
  consentBannerWaitsForAnswer,
  consentChoiceOnServer,
  readConsentChoice,
  subscribeToConsentChoice,
} from "./consentChoice";

const storageHolding = (storedValue: string | null) => ({
  getItem: vi.fn(() => storedValue),
});

describe("readConsentChoice", () => {
  it("reads a granted choice as true", () => {
    const storage = storageHolding("granted");
    expect(readConsentChoice(storage)).toBe(true);
    expect(storage.getItem).toHaveBeenCalledWith(ANALYTICS_CONSENT_KEY);
  });

  it("reads a denied choice as false", () => {
    expect(readConsentChoice(storageHolding("denied"))).toBe(false);
  });

  it("reports no choice when nothing is stored", () => {
    expect(readConsentChoice(storageHolding(null))).toBeNull();
  });

  it("reports no choice for a value it does not recognise", () => {
    expect(readConsentChoice(storageHolding("maybe"))).toBeNull();
  });

  it("reports no choice when the page has no storage at all", () => {
    expect(readConsentChoice(undefined)).toBeNull();
  });

  it("reports no choice when the browser blocks storage", () => {
    const blockedStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readConsentChoice(blockedStorage)).toBeNull();
  });
});

describe("consentChoiceOnServer", () => {
  it("reports no choice, so the server and the first client render agree", () => {
    expect(consentChoiceOnServer()).toBeNull();
  });
});

describe("consentBannerWaitsForAnswer", () => {
  it("waits while a tag manager id is configured and no choice is stored", () => {
    expect(consentBannerWaitsForAnswer("GTM-EXAMPLE", null)).toBe(true);
  });

  it("stops waiting once the visitor has accepted", () => {
    expect(consentBannerWaitsForAnswer("GTM-EXAMPLE", true)).toBe(false);
  });

  it("stops waiting once the visitor has declined", () => {
    expect(consentBannerWaitsForAnswer("GTM-EXAMPLE", false)).toBe(false);
  });

  it("never waits without a tag manager id, because no banner renders there", () => {
    expect(consentBannerWaitsForAnswer(undefined, null)).toBe(false);
  });

  it("treats an empty tag manager id as no banner", () => {
    expect(consentBannerWaitsForAnswer("", null)).toBe(false);
  });
});

describe("subscribeToConsentChoice", () => {
  it("listens to the same tab signal and to storage written by another tab", () => {
    const target = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const onChange = vi.fn();

    subscribeToConsentChoice(target, onChange);

    expect(target.addEventListener).toHaveBeenCalledWith(ANALYTICS_CONSENT_EVENT, onChange);
    expect(target.addEventListener).toHaveBeenCalledWith(STORAGE_EVENT, onChange);
  });

  it("removes both listeners when the subscription ends", () => {
    const target = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const onChange = vi.fn();

    subscribeToConsentChoice(target, onChange)();

    expect(target.removeEventListener).toHaveBeenCalledWith(ANALYTICS_CONSENT_EVENT, onChange);
    expect(target.removeEventListener).toHaveBeenCalledWith(STORAGE_EVENT, onChange);
  });

  it("calls back on a real window when a choice is announced", () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeToConsentChoice(window, onChange);

    announceConsentChoice(window, true);
    expect(onChange).toHaveBeenCalledTimes(1);

    unsubscribe();
    announceConsentChoice(window, false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe("announceConsentChoice", () => {
  it("dispatches the named event carrying the choice", () => {
    const target = { dispatchEvent: vi.fn(() => true) };

    announceConsentChoice(target, true);

    const announced = target.dispatchEvent.mock.calls[0][0] as CustomEvent<boolean>;
    expect(announced.type).toBe(ANALYTICS_CONSENT_EVENT);
    expect(announced.detail).toBe(true);
  });

  it("carries a refusal as well", () => {
    const target = { dispatchEvent: vi.fn(() => true) };

    announceConsentChoice(target, false);

    expect((target.dispatchEvent.mock.calls[0][0] as CustomEvent<boolean>).detail).toBe(false);
  });
});
