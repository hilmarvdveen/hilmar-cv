import { useSyncExternalStore } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  announceConsentChoice,
  consentBannerWaitsForAnswer,
  consentChoiceOnServer,
  readConsentChoice,
  subscribeToConsentChoice,
  type ConsentChoice,
} from "@/lib/analytics/consentChoice";
import { configuredTagManagerId } from "./tagManagerId";

export { ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_KEY, configuredTagManagerId };
export type { ConsentChoice };

const browserStorage = () => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

export const readStoredConsent = (): ConsentChoice => readConsentChoice(browserStorage());

export const storeConsent = (granted: boolean) => {
  localStorage.setItem(ANALYTICS_CONSENT_KEY, granted ? "granted" : "denied");
  announceConsentChoice(window, granted);
};

const subscribe = (onChange: () => void) => subscribeToConsentChoice(window, onChange);

export const useAnalyticsConsent = () =>
  useSyncExternalStore(subscribe, readStoredConsent, consentChoiceOnServer);

export const useConsentBannerWaitingForAnswer = () =>
  consentBannerWaitsForAnswer(configuredTagManagerId(), useAnalyticsConsent());
