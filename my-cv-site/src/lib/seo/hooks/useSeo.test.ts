import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSEO } from "./useSeo";

describe("useSEO", () => {
  it("returns an SEO config for a known page type", () => {
    const { result } = renderHook(() => useSEO("homepage", "en"));
    expect(result.current.seo).toBeTruthy();
    expect(typeof result.current.trackPageView).toBe("function");
  });

  it("maps 'blog-post' to the blog factory", () => {
    const { result } = renderHook(() => useSEO("blog-post", "nl"));
    expect(result.current.seo).toBeTruthy();
  });

  it("passes faqItems through for the faq page type", () => {
    const { result } = renderHook(() =>
      useSEO("faq", "en", { faqItems: [{ question: "Q?", answer: "A" }] })
    );
    expect(result.current.seo).toBeTruthy();
  });

  it("returns no seo for non-page factory methods", () => {
    const { result } = renderHook(() => useSEO("generateSitemapData", "en"));
    expect(result.current.seo).toBeUndefined();
  });

  it("returns no seo for an unknown page type", () => {
    const { result } = renderHook(() => useSEO("does-not-exist", "en"));
    expect(result.current.seo).toBeUndefined();
  });

  it("still returns a config for faq without explicit items", () => {
    const { result } = renderHook(() => useSEO("faq", "en"));
    expect(result.current.seo).toBeTruthy();
  });

  it("exposes a trackPageView callback that runs without throwing", () => {
    const { result } = renderHook(() => useSEO("homepage", "en"));
    expect(() => result.current.trackPageView("Title", "/path")).not.toThrow();
  });
});
