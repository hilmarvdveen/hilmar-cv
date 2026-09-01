import { useSyncExternalStore } from "react";

export const ANALYTICS_CONSENT_KEY = "analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "analytics-consent";

export const readStoredConsent = (): boolean | null => {
  try {
    const stored = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (stored === "granted") return true;
    if (stored === "denied") return false;
    return null;
  } catch {
    return null;
  }
};

export const storeConsent = (granted: boolean) => {
  localStorage.setItem(ANALYTICS_CONSENT_KEY, granted ? "granted" : "denied");
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: granted }));
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
  return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
};

const serverSnapshot = () => null;

export const useAnalyticsConsent = () =>
  useSyncExternalStore(subscribe, readStoredConsent, serverSnapshot);
