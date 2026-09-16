export const ANALYTICS_CONSENT_KEY = "analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "analytics-consent";
export const STORAGE_EVENT = "storage";

export type ConsentChoice = boolean | null;

type ConsentStorage = {
  getItem: (key: string) => string | null;
};

type ConsentChangeListener = () => void;

type ConsentEventTarget = {
  addEventListener: (eventName: string, listener: ConsentChangeListener) => void;
  removeEventListener: (eventName: string, listener: ConsentChangeListener) => void;
};

type ConsentAnnouncer = {
  dispatchEvent: (event: Event) => boolean;
};

export const readConsentChoice = (storage: ConsentStorage | undefined): ConsentChoice => {
  try {
    const storedValue = storage?.getItem(ANALYTICS_CONSENT_KEY);
    if (storedValue === "granted") return true;
    if (storedValue === "denied") return false;
    return null;
  } catch {
    return null;
  }
};

export const consentChoiceOnServer = (): ConsentChoice => null;

export const consentBannerWaitsForAnswer = (
  tagManagerId: string | undefined,
  choice: ConsentChoice
) => Boolean(tagManagerId) && choice === null;

export const subscribeToConsentChoice = (
  target: ConsentEventTarget,
  onChange: ConsentChangeListener
) => {
  target.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
  target.addEventListener(STORAGE_EVENT, onChange);
  return () => {
    target.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    target.removeEventListener(STORAGE_EVENT, onChange);
  };
};

export const announceConsentChoice = (target: ConsentAnnouncer, granted: boolean) => {
  target.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: granted }));
};
