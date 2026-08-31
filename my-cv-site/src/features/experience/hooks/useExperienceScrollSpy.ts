import { useCallback, useEffect, useRef, useState } from "react";
import { centeredScrollLeft, pickActiveSectionId } from "@/lib/scrollSpy";

const LINE_OFFSET = 16;
const FALLBACK_LINE = 140;
const LOCK_DURATION = 1500;

type ScrollLock = {
  id: string;
  expiresAt: number;
};

type ChipRefCallback = (element: HTMLLIElement | null) => void;

export function useExperienceScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState("");
  const listRef = useRef<HTMLUListElement | null>(null);
  const chipElements = useRef(new Map<string, HTMLLIElement>());
  const chipRefCallbacks = useRef(new Map<string, ChipRefCallback>());
  const lockRef = useRef<ScrollLock | null>(null);
  const frameRef = useRef(0);

  const registerChip = useCallback((id: string): ChipRefCallback => {
    const existing = chipRefCallbacks.current.get(id);
    if (existing) return existing;
    const callback: ChipRefCallback = (element) => {
      if (element) chipElements.current.set(id, element);
      else chipElements.current.delete(id);
    };
    chipRefCallbacks.current.set(id, callback);
    return callback;
  }, []);

  const activateFromClick = useCallback((id: string) => {
    lockRef.current = { id, expiresAt: Date.now() + LOCK_DURATION };
    setActiveId(id);
  }, []);

  useEffect(() => {
    const hashId = window.location.hash.replace("#experience-", "");
    if (sectionIds.includes(hashId)) {
      lockRef.current = { id: hashId, expiresAt: Date.now() + LOCK_DURATION };
      setActiveId(hashId);
    }
  }, [sectionIds]);

  useEffect(() => {
    const readPositions = () =>
      sectionIds.flatMap((id) => {
        const element = document.getElementById(`experience-${id}`);
        return element ? [{ id, top: element.getBoundingClientRect().top }] : [];
      });

    const readActivationLine = () => {
      const navigation = listRef.current?.closest("nav");
      return navigation
        ? navigation.getBoundingClientRect().bottom + LINE_OFFSET
        : FALLBACK_LINE;
    };

    const update = () => {
      const positions = readPositions();
      const activationLine = readActivationLine();
      const atDocumentBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const picked = pickActiveSectionId(positions, activationLine, atDocumentBottom);
      const lock = lockRef.current;
      if (lock) {
        const target = positions.find((position) => position.id === lock.id);
        const stranded =
          target !== undefined &&
          atDocumentBottom &&
          target.top < window.innerHeight;
        if (picked === lock.id || stranded) {
          lockRef.current = null;
          setActiveId(lock.id);
          return;
        }
        if (Date.now() < lock.expiresAt) return;
        lockRef.current = null;
      }
      setActiveId(picked);
    };

    const handleScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };

    const releaseLock = () => {
      lockRef.current = null;
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScroll);
    window.addEventListener("wheel", releaseLock, { passive: true });
    window.addEventListener("touchmove", releaseLock, { passive: true });
    handleScroll();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScroll);
      window.removeEventListener("wheel", releaseLock);
      window.removeEventListener("touchmove", releaseLock);
    };
  }, [sectionIds]);

  useEffect(() => {
    if (activeId === "") return;
    const list = listRef.current;
    const chip = chipElements.current.get(activeId);
    if (!list || !chip) return;
    if (list.scrollWidth <= list.clientWidth) return;
    if (typeof list.scrollTo !== "function") return;
    const listRect = list.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const chipLeft = list.scrollLeft + chipRect.left - listRect.left;
    const left = centeredScrollLeft(
      chipLeft,
      chipRect.width,
      list.clientWidth,
      list.scrollWidth - list.clientWidth
    );
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeId]);

  return { activeId, listRef, registerChip, activateFromClick };
}
