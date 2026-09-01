import { describe, expect, it } from "vitest";
import en from "./messages/en.json";
import nl from "./messages/nl.json";

type Leaf = string | number | boolean | null;
type Flattened = Record<string, Leaf>;

const flatten = (value: unknown, path: string, out: Flattened): Flattened => {
  if (Array.isArray(value)) {
    out[`${path}#length`] = value.length;
    value.forEach((item, index) => flatten(item, `${path}[${index}]`, out));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, path ? `${path}.${key}` : key, out);
    }
  } else {
    out[path] = value as Leaf;
  }
  return out;
};

const english = flatten(en, "", {});
const dutch = flatten(nl, "", {});

describe("message files", () => {
  it("carry the same namespaces", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(nl).sort());
  });

  it("carry every key in both languages", () => {
    const missingInDutch = Object.keys(english).filter((key) => !(key in dutch));
    const missingInEnglish = Object.keys(dutch).filter((key) => !(key in english));
    expect(missingInDutch).toEqual([]);
    expect(missingInEnglish).toEqual([]);
  });

  it("agree on the type and array length of every value", () => {
    const mismatches = Object.keys(english).filter(
      (key) => typeof english[key] !== typeof dutch[key]
    );
    expect(mismatches).toEqual([]);
  });
});
