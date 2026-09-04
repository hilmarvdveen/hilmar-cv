"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { usePathname } from "@/i18n/navigation";

export const StickyCallToActionBar = () => {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [observedPathname, setObservedPathname] = useState(pathname);
  const barRef = useRef<HTMLDivElement>(null);

  if (pathname !== observedPathname) {
    setObservedPathname(pathname);
    setPastHero(false);
  }

  useEffect(() => {
    if (pathname === "/book") return;
    const hero = document.querySelector("main section");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) =>
      setPastHero(!entry.isIntersecting)
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) {
      document.documentElement.style.removeProperty("--bottom-bar-offset");
      return;
    }
    const applyMeasuredOffset = () => {
      document.documentElement.style.setProperty(
        "--bottom-bar-offset",
        `${bar.getBoundingClientRect().height}px`
      );
    };
    applyMeasuredOffset();
    const observer = new ResizeObserver(applyMeasuredOffset);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--bottom-bar-offset");
    };
  }, [pastHero]);

  if (pathname === "/book" || !pastHero) return null;

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden"
    >
      <Button href="/book" variant="primary" size="sm" className="w-full" data-placement="sticky-bar">
        {t("nav.book")}
      </Button>
    </div>
  );
};
