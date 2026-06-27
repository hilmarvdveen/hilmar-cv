import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHoneypot } from "./useHoneypot";
import { HONEYPOT_FIELD } from "@/lib/security/honeypot";

describe("useHoneypot", () => {
  it("starts with an empty honeypot value and a numeric formStartedAt in the payload", () => {
    const { result } = renderHook(() => useHoneypot());
    expect(result.current.value).toBe("");
    const payload = result.current.payload();
    expect(payload[HONEYPOT_FIELD]).toBe("");
    expect(typeof payload.formStartedAt).toBe("number");
  });

  it("reflects updates to the honeypot value", () => {
    const { result } = renderHook(() => useHoneypot());
    act(() => result.current.setValue("bot-filled"));
    expect(result.current.value).toBe("bot-filled");
    expect(result.current.payload()[HONEYPOT_FIELD]).toBe("bot-filled");
  });
});
