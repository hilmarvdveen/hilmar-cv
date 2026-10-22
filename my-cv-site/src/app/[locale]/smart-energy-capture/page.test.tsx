import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import SmartEnergyCapturePage, { metadata } from "./page";

const props = (locale: string, frame?: string | string[]) => ({
  params: Promise.resolve({ locale }),
  searchParams: Promise.resolve(frame === undefined ? {} : { frame }),
});

describe("smart energy capture route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("answers not found unless capture is enabled", async () => {
    await expect(SmartEnergyCapturePage(props("en", "10"))).rejects.toThrow("NEXT_NOT_FOUND");
    vi.stubEnv("SMART_ENERGY_CAPTURE", "yes");
    await expect(SmartEnergyCapturePage(props("en", "10"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("is never indexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders the requested frame in the requested language", async () => {
    vi.stubEnv("SMART_ENERGY_CAPTURE", "enabled");
    render(await SmartEnergyCapturePage(props("nl", "340")));
    expect(screen.getByText("Een meting verlaat de batterij")).toBeInTheDocument();
  });

  it("falls back to the first frame in English for anything else", async () => {
    vi.stubEnv("SMART_ENERGY_CAPTURE", "enabled");
    for (const frame of [undefined, "-3", "abc", "999999", ["1", "2"]]) {
      const { unmount } = render(await SmartEnergyCapturePage(props("de", frame)));
      expect(screen.getByText("A battery that charges when power is cheap.")).toBeInTheDocument();
      unmount();
    }
  });
});
