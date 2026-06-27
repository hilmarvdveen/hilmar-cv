/**
 * Shared next-intl mock for component tests. Translation keys echo back and
 * `.raw()` returns an empty array by default (callers that need specific arrays
 * mock next-intl themselves). Use via:
 *
 *   vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
 */
import type { ReactNode } from "react";

type TFn = ((key: string) => string) & { raw: (key: string) => unknown };

function makeT(): TFn {
  const t = ((key: string) => key) as TFn;
  t.raw = () => [];
  return t;
}

export function intlMock() {
  return {
    useTranslations: () => makeT(),
    useLocale: () => "en",
    useMessages: () => ({}),
    useFormatter: () => ({}),
    NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
  };
}
