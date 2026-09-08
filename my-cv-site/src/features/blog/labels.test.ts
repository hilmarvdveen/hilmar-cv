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
    expect(labels.category.accessibility).toBe("t:category.accessibility");
    expect(labels.category.api).toBe("t:category.api");
    expect(labels.track.backend).toBe("t:track.backend");
    expect(labels.group.fullstack).toBe("t:group.fullstack");
    expect(labels.ctaButton).toBe("t:cta.button");
    expect(labels.writtenBy).toBe("t:writtenBy");
    expect(labels.breadcrumbLabel).toBe("t:breadcrumbLabel");
    expect(labels.homeLabel).toBe("t:homeLabel");
  });
});
