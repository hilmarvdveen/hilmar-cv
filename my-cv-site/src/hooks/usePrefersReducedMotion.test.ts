import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type ChangeListener = () => void;

const installMatchMedia = (initial: boolean) => {
  const listeners = new Set<ChangeListener>();
  let matches = initial;
  const matchMedia = vi.fn((media: string) => ({
    media,
    get matches() {
      return matches;
    },
    addEventListener: (event: string, listener: ChangeListener) => {
      listeners.add(listener);
    },
    removeEventListener: (event: string, listener: ChangeListener) => {
      listeners.delete(listener);
    },
  }));
  vi.stubGlobal("matchMedia", matchMedia);
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
  return {
    matchMedia,
    listenerCount: () => listeners.size,
    change: (next: boolean) => {
      matches = next;
      for (const listener of listeners) listener();
    },
  };
};

const ReducedMotionProbe = () => String(usePrefersReducedMotion());

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("usePrefersReducedMotion", () => {
  it("says the visitor accepts motion when the query does not match", () => {
    installMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("says the visitor asked for less motion when the query matches", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("follows the setting while the page stays open", () => {
    const media = installMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());

    act(() => media.change(true));
    expect(result.current).toBe(true);

    act(() => media.change(false));
    expect(result.current).toBe(false);
  });

  it("lets go of the media query on unmount", () => {
    const media = installMatchMedia(false);
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    expect(media.listenerCount()).toBe(1);

    unmount();
    expect(media.listenerCount()).toBe(0);
  });

  it("assumes motion on the server, where no media query exists", () => {
    expect(renderToStaticMarkup(createElement(ReducedMotionProbe))).toBe("false");
  });
});
