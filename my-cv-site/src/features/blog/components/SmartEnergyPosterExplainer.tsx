"use client";

import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Locale } from "@/lib/seo";
import { FILM_SCENES, FILM_TABS, filmFrameAtMilliseconds } from "@/lib/smartEnergyFilm/film";
import { useElementInView } from "../hooks/useElementInView";
import { smartEnergyFilmLabels, type TabId } from "../smartEnergyFilmLabels";
import type { LocalizedText } from "../types";
import { LINE_STYLES, SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

const TEXT = {
  tablistLabel: { en: "Steps of the platform", nl: "Stappen van het platform" },
  play: { en: "Play", nl: "Afspelen" },
  pause: { en: "Pause", nl: "Pauzeer" },
  legendLabel: { en: "Line types", nl: "Soorten lijnen" },
  data: { en: "data", nl: "data" },
  commands: { en: "commands", nl: "commands" },
  plan: { en: "plan", nl: "plan" },
  textVersion: { en: "Text version of this step", nl: "Tekstversie van deze stap" },
  step: { en: "Step", nl: "Stap" },
  of: { en: "of", nl: "van" },
} satisfies Record<string, LocalizedText>;

const LEGEND_ITEMS = [
  { word: TEXT.data, colour: LINE_STYLES.telemetry.colour, dash: undefined },
  { word: TEXT.commands, colour: LINE_STYLES.commands.colour, dash: "7 7" },
  { word: TEXT.plan, colour: LINE_STYLES.control.colour, dash: "1 6" },
];

const TAB_SCENES = FILM_SCENES.filter((scene) => FILM_TABS.includes(scene.id));

const TAB_START = TAB_SCENES[0].startMilliseconds;

const LAST_TAB_SCENE = TAB_SCENES[TAB_SCENES.length - 1];

const TAB_END = LAST_TAB_SCENE.startMilliseconds + LAST_TAB_SCENE.lengthMilliseconds;

const LONGEST_STEP_MILLISECONDS = 100;

const IN_VIEW_SHARE = 0.5;

const FOCUS_CLASSES = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

const TAB_CLASSES = `relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 aria-selected:text-gray-900 ${FOCUS_CLASSES}`;

const BUTTON_CLASSES = `inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:border-emerald-600 ${FOCUS_CLASSES}`;

const loopedElapsed = (elapsed: number): number => (elapsed >= TAB_END ? TAB_START + (elapsed - TAB_END) : elapsed);

type SmartEnergyPosterExplainerProps = { locale: Locale };

export function SmartEnergyPosterExplainer({ locale }: SmartEnergyPosterExplainerProps) {
  const labels = useMemo(() => smartEnergyFilmLabels(locale), [locale]);
  const reducedMotion = usePrefersReducedMotion();
  const figureReference = useRef<HTMLElement>(null);
  const tabReferences = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistReference = useRef<HTMLDivElement>(null);
  const inView = useElementInView(figureReference, IN_VIEW_SHARE);
  const [elapsed, setElapsed] = useState(TAB_START);
  const [pausedByVisitor, setPausedByVisitor] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusedWithin, setFocusedWithin] = useState(false);
  const baseIdentifier = useId();
  const panelIdentifier = `${baseIdentifier}-panel`;
  const textVersionIdentifier = `${baseIdentifier}-text-version`;
  const tabIdentifier = (index: number) => `${baseIdentifier}-tab-${index}`;

  const running = inView && !pausedByVisitor && !hovered && !focusedWithin && !reducedMotion;

  useEffect(() => {
    if (!running) {
      return;
    }
    let previousTimestamp: number | null = null;
    let handle = 0;
    const tick = (timestamp: number) => {
      if (previousTimestamp !== null) {
        const step = Math.min(timestamp - previousTimestamp, LONGEST_STEP_MILLISECONDS);
        setElapsed((current) => loopedElapsed(current + step));
      }
      previousTimestamp = timestamp;
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [running]);

  const playingFrame = filmFrameAtMilliseconds(elapsed);
  const activeIndex = playingFrame.tabIndex ?? 0;
  const activeScene = TAB_SCENES[activeIndex];
  const shownFrame = reducedMotion
    ? filmFrameAtMilliseconds(activeScene.startMilliseconds + activeScene.lengthMilliseconds - 1)
    : playingFrame;
  const captions = labels.captions[activeScene.id];
  const caption = captions[shownFrame.captionIndex ?? 0];

  const selectTab = (index: number, moveFocus: boolean) => {
    setElapsed(TAB_SCENES[index].startMilliseconds);
    if (moveFocus) {
      tabReferences.current[index]?.focus();
    }
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = FILM_TABS.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) {
      return;
    }
    event.preventDefault();
    selectTab(target, true);
  };

  const togglePlayback = () => {
    if (running) {
      setPausedByVisitor(true);
      return;
    }
    setHovered(false);
    setFocusedWithin(false);
    setPausedByVisitor(false);
  };

  useEffect(() => {
    const list = tablistReference.current;
    const tab = tabReferences.current[activeIndex];
    if (!list || !tab || list.contains(document.activeElement)) {
      return;
    }
    list.scrollLeft = Math.max(0, tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2);
  }, [activeIndex]);

  const leaveFocus = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusedWithin(false);
    }
  };

  const progress = Math.min(1, Math.max(0, playingFrame.sceneProgress));

  return (
    <figure
      ref={figureReference}
      className="my-8"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocusedWithin(true)}
      onBlur={leaveFocus}
    >
      <div ref={tablistReference} role="tablist" aria-label={TEXT.tablistLabel[locale]} className="flex overflow-x-auto border-b border-gray-200">
        {FILM_TABS.map((tab, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={tab}
              ref={(element) => {
                tabReferences.current[index] = element;
              }}
              id={tabIdentifier(index)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={selected ? panelIdentifier : undefined}
              tabIndex={selected ? 0 : -1}
              className={TAB_CLASSES}
              onClick={() => selectTab(index, false)}
              onKeyDown={handleTabKey}
            >
              {labels.tabs[tab as TabId]}
              {selected && !reducedMotion && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left bg-emerald-600 motion-reduce:hidden"
                  style={{ transform: `scaleX(${progress})` }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={panelIdentifier}
        aria-labelledby={tabIdentifier(activeIndex)}
        tabIndex={0}
        className={`mt-4 ${FOCUS_CLASSES}`}
      >
        <div className="aspect-[1080/860] w-full bg-gray-50">
          <SmartEnergyFilmPoster frame={shownFrame} labels={labels} chrome="stage" />
        </div>
        <div className="sr-only">
          <p id={textVersionIdentifier}>{TEXT.textVersion[locale]}</p>
          <ol aria-labelledby={textVersionIdentifier}>
            {captions.map((entry) => (
              <li key={entry.headline}>
                {entry.headline}. {entry.detail}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-4">
        <p className="text-xs font-semibold text-gray-600">
          <span aria-hidden="true">{`${activeIndex + 1} / ${FILM_TABS.length}`}</span>
          <span className="sr-only">{`${TEXT.step[locale]} ${activeIndex + 1} ${TEXT.of[locale]} ${FILM_TABS.length}`}</span>
        </p>
        <p className="mt-1 text-lg font-bold text-textMain">{caption.headline}</p>
        <p className="mt-1 text-base text-gray-700">{caption.detail}</p>
        {FILM_TABS[activeIndex] === "cloud" && <p className="mt-1 text-sm text-gray-600">{labels.gatesLine}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ul aria-label={TEXT.legendLabel[locale]} className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0">
            {LEGEND_ITEMS.map((item) => (
              <li key={item.word.en} className="flex items-center gap-2 text-xs text-gray-600">
                <svg aria-hidden="true" width="28" height="8" viewBox="0 0 28 8">
                  <line
                    x1="2"
                    y1="4"
                    x2="26"
                    y2="4"
                    stroke={item.colour}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={item.dash}
                  />
                </svg>
                {item.word[locale]}
              </li>
            ))}
          </ul>
          {!reducedMotion && (
            <button type="button" className={BUTTON_CLASSES} onClick={togglePlayback}>
              {running ? TEXT.pause[locale] : TEXT.play[locale]}
            </button>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
