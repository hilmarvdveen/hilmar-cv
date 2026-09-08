"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { pushSiteEvent } from "@/lib/analytics/events";

const UNLABELLED_PLACEMENT = "unlabelled";

export function SiteEvents() {
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const placement = anchor.getAttribute("data-placement") ?? UNLABELLED_PLACEMENT;

      if (href.endsWith("/book")) {
        pushSiteEvent("cta_click", { placement, path: pathname });
        return;
      }
      if (href.endsWith("/contact")) {
        pushSiteEvent("contact_click", { placement, path: pathname });
        return;
      }
      if (anchor.hasAttribute("data-placement")) {
        pushSiteEvent("link_click", { placement, destination: href, path: pathname });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    const trackedElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-track-section]")
    );
    if (trackedElements.length === 0) return;

    const seenSections = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = entry.target.getAttribute("data-track-section");
        if (!section || seenSections.has(section)) continue;
        seenSections.add(section);
        pushSiteEvent("section_view", { section });
        observer.unobserve(entry.target);
      }
    });

    trackedElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
