import { describe, expect, it, vi } from "vitest";
import en from "./messages/en.json";
import nl from "./messages/nl.json";

vi.mock("next-intl/server", () => ({
  getRequestConfig: (create: unknown) => create,
}));

import requestConfig, { resolveLocale } from "./request";

type RequestConfigFactory = (params: {
  locale?: string;
  requestLocale: Promise<string | undefined>;
}) => Promise<{ locale: string; messages: unknown }>;

const createConfig = requestConfig as unknown as RequestConfigFactory;

describe("resolveLocale", () => {
  it("keeps a supported locale", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("nl")).toBe("nl");
  });

  it("falls back to Dutch for an unknown or missing value", () => {
    expect(resolveLocale("de")).toBe("nl");
    expect(resolveLocale(undefined)).toBe("nl");
  });
});

describe("request config", () => {
  it("serves English messages for an English request segment", async () => {
    const config = await createConfig({ requestLocale: Promise.resolve("en") });
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual(en);
  });

  it("serves Dutch messages for a Dutch request segment", async () => {
    const config = await createConfig({ requestLocale: Promise.resolve("nl") });
    expect(config.locale).toBe("nl");
    expect(config.messages).toEqual(nl);
  });

  it("prefers an explicit locale over the request segment", async () => {
    const config = await createConfig({
      locale: "en",
      requestLocale: Promise.resolve("nl"),
    });
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual(en);
  });

  it("falls back to Dutch for an unknown segment", async () => {
    const config = await createConfig({ requestLocale: Promise.resolve("fr") });
    expect(config.locale).toBe("nl");
    expect(config.messages).toEqual(nl);
  });
});
