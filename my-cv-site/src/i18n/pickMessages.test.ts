import { describe, expect, it } from "vitest";
import { CLIENT_MESSAGE_KEYS, pickMessages } from "./pickMessages";
import en from "./messages/en.json";

describe("pickMessages", () => {
  const messages = {
    common: { nav: { home: "Home" } },
    home: { hero: { title: "Hero" }, results: { title: "Results" } },
    work: { bol: { company: "bol.com" } },
  };

  it("keeps whole namespaces and nested paths, and drops everything else", () => {
    expect(pickMessages(messages, ["common", "home.hero"])).toEqual({
      common: { nav: { home: "Home" } },
      home: { hero: { title: "Hero" } },
    });
  });

  it("ignores keys that do not exist and leaves the source untouched", () => {
    const copy = structuredClone(messages);
    expect(pickMessages(messages, ["missing", "home.absent"])).toEqual({});
    expect(messages).toEqual(copy);
  });

  it("finds every client key in the real English message file", () => {
    const picked = pickMessages(en, CLIENT_MESSAGE_KEYS);
    for (const key of CLIENT_MESSAGE_KEYS) {
      const [namespace, child] = key.split(".");
      const value = child
        ? (picked[namespace] as Record<string, unknown>)[child]
        : picked[namespace];
      expect(value, key).toBeDefined();
    }
    expect(picked).not.toHaveProperty("work");
    expect(JSON.stringify(picked).length).toBeLessThan(JSON.stringify(en).length / 2);
  });
});
