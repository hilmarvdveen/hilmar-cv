import type { ReactNode } from "react";

type RawValues = Record<string, unknown>;

type TranslationFunction = ((key: string) => string) & { raw: (key: string) => unknown };

function makeTranslation(rawValues: RawValues): TranslationFunction {
  const translate = ((key: string) => key) as TranslationFunction;
  translate.raw = (key: string) => rawValues[key] ?? [];
  return translate;
}

export function intlMock(options: { raw?: RawValues } = {}) {
  const rawValues = options.raw ?? {};
  return {
    useTranslations: () => makeTranslation(rawValues),
    useLocale: () => "en",
    useMessages: () => ({}),
    useFormatter: () => ({}),
    NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
  };
}
