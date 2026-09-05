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
