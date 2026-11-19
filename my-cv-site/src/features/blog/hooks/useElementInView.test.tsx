import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useElementInView } from "./useElementInView";

type Callback = (entries: { isIntersecting: boolean }[]) => void;

let callback: Callback = () => undefined;
let options: IntersectionObserverInit | undefined;
const disconnect = vi.fn();
const observe = vi.fn();

class FakeObserver {
  constructor(handler: Callback, init?: IntersectionObserverInit) {
    callback = handler;
    options = init;
  }
  observe = observe;
  disconnect = disconnect;
}

function Probe() {
  const reference = useRef<HTMLDivElement>(null);
  const inView = useElementInView(reference, 0.5);
  return <div ref={reference}>{inView ? "visible" : "hidden"}</div>;
}

function Detached() {
  const reference = useRef<HTMLDivElement>(null);
  return <p>{String(useElementInView(reference, 0.5))}</p>;
}

describe("useElementInView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("follows the intersection state and passes the threshold", () => {
    render(<Probe />);
    expect(screen.getByText("hidden")).toBeInTheDocument();
    expect(options).toEqual({ threshold: 0.5 });
    expect(observe).toHaveBeenCalledTimes(1);
    act(() => callback([{ isIntersecting: true }]));
    expect(screen.getByText("visible")).toBeInTheDocument();
    act(() => callback([{ isIntersecting: true }, { isIntersecting: false }]));
    expect(screen.getByText("hidden")).toBeInTheDocument();
  });

  it("disconnects on unmount", () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("stays false without an element", () => {
    render(<Detached />);
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(observe).not.toHaveBeenCalled();
  });
});
