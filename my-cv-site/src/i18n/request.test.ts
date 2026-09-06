import { describe, expect, it, vi, beforeEach } from "vitest";
import en from "./messages/en.json";
import nl from "./messages/nl.json";

const rootLocale = vi.fn<() => Promise<string | undefined>>();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next-intl/server", () => ({
  getRequestConfig: (create: unknown) => create,
}));

vi.mock("next/root-params", () => ({
  locale: () => rootLocale(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

import requestConfig from "./request";

type RequestConfigFactory = (params: { locale?: string }) => Promise<{ locale: string; messages: unknown }>;

const createConfig = requestConfig as unknown as RequestConfigFactory;

describe("request config", () => {
  beforeEach(() => {
    rootLocale.mockReset();
    notFound.mockClear();
  });

  it("serves English messages when the root locale segment is English", async () => {
    rootLocale.mockResolvedValue("en");
    const config = await createConfig({});
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual(en);
  });

  it("serves Dutch messages when the root locale segment is Dutch", async () => {
    rootLocale.mockResolvedValue("nl");
    const config = await createConfig({});
    expect(config.locale).toBe("nl");
    expect(config.messages).toEqual(nl);
  });

  it("prefers an explicit locale over the root segment", async () => {
    rootLocale.mockResolvedValue("nl");
    const config = await createConfig({ locale: "en" });
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual(en);
    expect(rootLocale).not.toHaveBeenCalled();
  });

  it("answers an unknown segment with a not-found", async () => {
    rootLocale.mockResolvedValue("fr");
    await expect(createConfig({})).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("answers a missing segment with a not-found, also when the root params API is unavailable", async () => {
    rootLocale.mockRejectedValue(new Error("no root params here"));
    await expect(createConfig({})).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
