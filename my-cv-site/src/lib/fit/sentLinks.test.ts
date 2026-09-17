import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetSentResultLinks,
  hasSentResultLink,
  rememberSentResultLink,
} from "./sentLinks";

beforeEach(() => {
  __resetSentResultLinks();
});

describe("the pairs a link was already sent to", () => {
  it("remembers one session and address pair, whatever the casing", () => {
    expect(hasSentResultLink("session-id-value-1", "jane@example.com")).toBe(false);
    rememberSentResultLink("session-id-value-1", "jane@example.com");
    expect(hasSentResultLink("session-id-value-1", "JANE@Example.com ")).toBe(true);
  });

  it("keeps the same session open for another address", () => {
    rememberSentResultLink("session-id-value-1", "jane@example.com");
    expect(hasSentResultLink("session-id-value-1", "other@example.com")).toBe(false);
  });

  it("stays bounded and forgets the oldest pair", () => {
    for (let index = 0; index < 520; index += 1) {
      rememberSentResultLink(`session-${index}`, "jane@example.com");
    }
    expect(hasSentResultLink("session-0", "jane@example.com")).toBe(false);
    expect(hasSentResultLink("session-519", "jane@example.com")).toBe(true);
  });
});
