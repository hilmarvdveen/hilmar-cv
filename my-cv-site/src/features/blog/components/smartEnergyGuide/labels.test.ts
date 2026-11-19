import { CONCURRENCY_LABELS, FLOW_LABELS, FRONTEND_LABELS, HEXAGON_LABELS, PIPELINE_LABELS, pick, pickAll, type Pair } from "./labels";

const collectPairs = (value: unknown): Pair[] => {
  if (typeof value !== "object" || value === null) {
    return [];
  }
  if ("en" in value && "nl" in value) {
    return [value as Pair];
  }
  return Object.values(value).flatMap(collectPairs);
};

const ALL = [HEXAGON_LABELS, FLOW_LABELS, CONCURRENCY_LABELS, FRONTEND_LABELS, PIPELINE_LABELS].flatMap(collectPairs);

describe("labels", () => {
  it("picks a text per locale", () => {
    const pair = { en: "one", nl: "een" };
    expect(pick(pair, "nl")).toBe("een");
    expect(pickAll([pair, pair], "en")).toEqual(["one", "one"]);
  });

  it("has an English and a Dutch text for every label", () => {
    expect(ALL.length).toBeGreaterThan(100);
    for (const pair of ALL) {
      expect(pair.en.length).toBeGreaterThan(0);
      expect(pair.nl.length).toBeGreaterThan(0);
    }
  });

  it("follows the copy style, with no dash connector and no semicolon", () => {
    for (const pair of ALL) {
      for (const text of [pair.en, pair.nl]) {
        expect(text).not.toMatch(/ - |–|—|;/);
      }
    }
  });
});
