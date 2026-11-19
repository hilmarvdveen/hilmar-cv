"use client";

import { useEffect, useState, type RefObject } from "react";

export const useElementInView = (target: RefObject<Element | null>, threshold: number): boolean => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = target.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const latest = entries[entries.length - 1];
        setInView(latest.isIntersecting);
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [target, threshold]);

  return inView;
};
