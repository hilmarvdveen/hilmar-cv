import { describe, it, expect } from "vitest";
import { buildBlogLabels } from "./labels";

describe("buildBlogLabels", () => {
  it("maps every label key through the translation function", () => {
    const labels = buildBlogLabels((key) => `t:${key}`);
    expect(labels.eyebrow).toBe("t:eyebrow");
    expect(labels.indexTitle).toBe("t:index.title");
    expect(labels.minRead).toBe("t:minRead");
    expect(labels.category.architecture).toBe("t:category.architecture");
    expect(labels.category.fundamentals).toBe("t:category.fundamentals");
    expect(labels.ctaButton).toBe("t:cta.button");
    expect(labels.writtenBy).toBe("t:writtenBy");
  });
});
