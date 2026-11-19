"use client";

import { useEffect, useId, useMemo, useReducer, useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Locale } from "@/lib/seo";
import { BEATS, FILM_TABS, beatEndState, beatLengthMilliseconds, beatRenderState, type TabId } from "@/lib/smartEnergyFilm/film";
import { FOCUS_LAYOUTS, type Orientation } from "@/lib/smartEnergyFilm/layout";
import { LINE_STYLES, dashPattern } from "@/lib/smartEnergyFilm/tokens";
import { useElementInView } from "../hooks/useElementInView";
import { smartEnergyFilmLabels, type BeatCaption, type SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

const LONGEST_STEP_MILLISECONDS = 100;

const IN_VIEW_SHARE = 0.5;

const WIDE_QUERY = "(min-width: 640px)";

const LEGEND_STROKE_WIDTH = 2.5;

const FOCUS_CLASSES = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

const TAB_FOCUS_CLASSES = "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-emerald-600";

const TAB_CLASSES = `relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 aria-selected:border-emerald-600 aria-selected:text-gray-900 ${TAB_FOCUS_CLASSES}`;

const BUTTON_CLASSES = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:border-emerald-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-600 disabled:opacity-60 ${FOCUS_CLASSES}`;

type Position = { tabIndex: number; beatIndex: number };

type Announcement = "none" | "tab" | "step" | "crossing";

type State = Position & { elapsed: number; stopped: boolean; announcement: Announcement };

type Action =
  | { type: "tick"; step: number }
  | { type: "goto"; position: Position; kind: "tab" | "step" }
  | { type: "pause" }
  | { type: "play" };

const LAST_TAB_INDEX = FILM_TABS.length - 1;

const beatsOf = (tabIndex: number) => BEATS[FILM_TABS[tabIndex]];

const lastBeatIndex = (tabIndex: number): number => beatsOf(tabIndex).length - 1;

const lengthAt = (position: Position): number => beatLengthMilliseconds(beatsOf(position.tabIndex)[position.beatIndex]);

const isFirst = (position: Position): boolean => position.tabIndex === 0 && position.beatIndex === 0;

const isLast = (position: Position): boolean =>
  position.tabIndex === LAST_TAB_INDEX && position.beatIndex === lastBeatIndex(LAST_TAB_INDEX);

const stepFrom = (position: Position, delta: 1 | -1): Position => {
  const beatIndex = position.beatIndex + delta;
  if (beatIndex > lastBeatIndex(position.tabIndex)) {
    return { tabIndex: position.tabIndex + 1, beatIndex: 0 };
  }
  if (beatIndex < 0) {
    return { tabIndex: position.tabIndex - 1, beatIndex: lastBeatIndex(position.tabIndex - 1) };
  }
  return { tabIndex: position.tabIndex, beatIndex };
};

const INITIAL_STATE: State = { tabIndex: 0, beatIndex: 0, elapsed: 0, stopped: false, announcement: "none" };

const reduce = (state: State, action: Action): State => {
  switch (action.type) {
    case "tick": {
      const elapsed = state.elapsed + action.step;
      if (elapsed < lengthAt(state)) {
        return { ...state, elapsed };
      }
      if (isLast(state)) {
        return { ...state, elapsed: lengthAt(state), stopped: true };
      }
      return { ...state, ...stepFrom(state, 1), elapsed: 0 };
    }
    case "goto": {
      const crossing = action.position.tabIndex !== state.tabIndex;
      const announcement: Announcement = action.kind === "tab" ? "tab" : crossing ? "crossing" : "step";
      return { ...action.position, elapsed: lengthAt(action.position), stopped: true, announcement };
    }
    case "pause":
      return { ...state, stopped: true };
    case "play":
      if (isLast(state) && state.elapsed >= lengthAt(state)) {
        return { ...INITIAL_STATE };
      }
      return { ...state, stopped: false, announcement: "none" };
  }
};

const subscribeToWidth = (listener: () => void): (() => void) => {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};

const widthIsWide = (): boolean => window.matchMedia(WIDE_QUERY).matches;

const wideOnTheServer = (): boolean => true;

const useOrientation = (): Orientation =>
  useSyncExternalStore(subscribeToWidth, widthIsWide, wideOnTheServer) ? "landscape" : "portrait";

const captionOf = (labels: SmartEnergyFilmLabels, tab: TabId, beat: string): BeatCaption =>
  (labels.captions[tab] as Record<string, BeatCaption>)[beat];

const captionText = (labels: SmartEnergyFilmLabels, tab: TabId, beat: string): string => {
  const entry = captionOf(labels, tab, beat);
  const gates = tab === "cloud" && beat === "gates" ? ` ${labels.gatesLine}` : "";
  return `${entry.headline}. ${entry.detail} ${entry.why}${gates}`;
};

const announcementOf = (labels: SmartEnergyFilmLabels, state: State): string => {
  const tab = FILM_TABS[state.tabIndex];
  const beat = beatsOf(state.tabIndex)[state.beatIndex].id;
  switch (state.announcement) {
    case "none":
      return "";
    case "tab":
      return `${labels.tabs[tab]}. ${captionOf(labels, tab, beat).headline}`;
    case "crossing":
      return `${labels.tabs[tab]}. ${captionText(labels, tab, beat)}`;
    case "step":
      return captionText(labels, tab, beat);
  }
};

const fillIn = (template: string, current: number, total: number): string =>
  template.replace("{current}", String(current)).replace("{total}", String(total));

type SmartEnergyPosterExplainerProps = { locale: Locale };

export function SmartEnergyPosterExplainer({ locale }: SmartEnergyPosterExplainerProps) {
  const labels = useMemo(() => smartEnergyFilmLabels(locale), [locale]);
  const reducedMotion = usePrefersReducedMotion();
  const orientation = useOrientation();
  const figureReference = useRef<HTMLElement>(null);
  const tabReferences = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistReference = useRef<HTMLDivElement>(null);
  const previousReference = useRef<HTMLButtonElement>(null);
  const nextReference = useRef<HTMLButtonElement>(null);
  const inView = useElementInView(figureReference, IN_VIEW_SHARE);
  const [state, dispatch] = useReducer(reduce, INITIAL_STATE);
  const baseIdentifier = useId();
  const panelIdentifier = `${baseIdentifier}-panel`;
  const textVersionIdentifier = `${baseIdentifier}-text-version`;
  const tabIdentifier = (index: number) => `${baseIdentifier}-tab-${index}`;

  const { tabIndex, beatIndex } = state;
  const tab: TabId = FILM_TABS[tabIndex];
  const beats = beatsOf(tabIndex);
  const autoplaying = !state.stopped && !reducedMotion;
  const running = autoplaying && inView;

  useEffect(() => {
    if (!running) {
      return;
    }
    let previousTimestamp: number | null = null;
    let handle = 0;
    const tick = (timestamp: number) => {
      if (previousTimestamp !== null) {
        const step = Math.min(timestamp - previousTimestamp, LONGEST_STEP_MILLISECONDS);
        dispatch({ type: "tick", step });
      }
      previousTimestamp = timestamp;
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [running]);

  useEffect(() => {
    const list = tablistReference.current;
    const element = tabReferences.current[tabIndex];
    if (!list || !element || list.contains(document.activeElement)) {
      return;
    }
    list.scrollLeft = Math.max(0, element.offsetLeft - (list.clientWidth - element.offsetWidth) / 2);
  }, [tabIndex]);

  const length = lengthAt(state);
  const settled = reducedMotion || state.elapsed >= length;
  const renderState = settled ? beatEndState(tab, beatIndex) : beatRenderState(tab, beatIndex, state.elapsed / length);
  const beatProgress = settled ? 1 : state.elapsed / length;
  const tabProgress = (beatIndex + beatProgress) / beats.length;
  const viewBox = FOCUS_LAYOUTS.whole[orientation].viewBox;

  const selectTab = (index: number, moveFocus: boolean) => {
    dispatch({ type: "goto", position: { tabIndex: index, beatIndex: 0 }, kind: "tab" });
    if (moveFocus) {
      tabReferences.current[index]?.focus();
    }
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const targets: Record<string, number> = {
      ArrowRight: tabIndex === LAST_TAB_INDEX ? 0 : tabIndex + 1,
      ArrowLeft: tabIndex === 0 ? LAST_TAB_INDEX : tabIndex - 1,
      Home: 0,
      End: LAST_TAB_INDEX,
    };
    const target = targets[event.key];
    if (target === undefined) {
      return;
    }
    event.preventDefault();
    selectTab(target, true);
  };

  const stepBeat = (delta: 1 | -1) => {
    const target = stepFrom(state, delta);
    dispatch({ type: "goto", position: target, kind: "step" });
    if (delta === 1 && isLast(target)) {
      previousReference.current?.focus();
    }
    if (delta === -1 && isFirst(target)) {
      nextReference.current?.focus();
    }
  };

  const togglePlayback = () => {
    dispatch({ type: autoplaying ? "pause" : "play" });
  };

  const legend = renderState.legend;

  return (
    <figure ref={figureReference} className="my-8 flex flex-col">
      <div ref={tablistReference} role="tablist" aria-label={labels.tablistLabel} className="flex overflow-x-auto border-b border-gray-200">
        {FILM_TABS.map((entry, index) => {
          const selected = index === tabIndex;
          return (
            <button
              key={entry}
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
              {labels.tabs[entry]}
              {selected && !reducedMotion && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-emerald-800 motion-reduce:hidden"
                  style={{ transform: `scaleX(${tabProgress})` }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={panelIdentifier}
        aria-labelledby={tabIdentifier(tabIndex)}
        tabIndex={0}
        className={`mt-4 ${FOCUS_CLASSES}`}
      >
        <div className="w-full bg-gray-50" style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}>
          <SmartEnergyFilmPoster state={renderState} labels={labels} orientation={orientation} reducedMotion={reducedMotion} />
        </div>
        <div className="sr-only">
          <p id={textVersionIdentifier}>{labels.textVersion}</p>
          <ol aria-labelledby={textVersionIdentifier}>
            {beats.map((beat, index) => (
              <li key={beat.id} aria-current={index === beatIndex ? "step" : undefined}>
                {captionText(labels, tab, beat.id)}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {announcementOf(labels, state)}
      </div>
      <div className="order-2">
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3">
          <button
            ref={previousReference}
            type="button"
            className={BUTTON_CLASSES}
            disabled={isFirst(state)}
            onClick={() => stepBeat(-1)}
          >
            {labels.previous}
          </button>
          {!reducedMotion && (
            <button type="button" className={BUTTON_CLASSES} onClick={togglePlayback}>
              {autoplaying ? labels.pause : labels.play}
            </button>
          )}
          <button ref={nextReference} type="button" className={BUTTON_CLASSES} disabled={isLast(state)} onClick={() => stepBeat(1)}>
            {labels.next}
          </button>
        </div>
        <div className="mt-4 min-h-6">
          {legend.length > 0 && (
            <ul aria-label={labels.legendLabel} className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0">
              {legend.map((kind) => (
                <li key={kind} className="flex items-center gap-2 text-xs text-gray-600">
                  <svg aria-hidden="true" width="28" height="8" viewBox="0 0 28 8">
                    <line
                      x1="2"
                      y1="4"
                      x2="26"
                      y2="4"
                      stroke={LINE_STYLES[kind].colour}
                      strokeWidth={LEGEND_STROKE_WIDTH}
                      strokeLinecap="round"
                      strokeDasharray={dashPattern(kind, LEGEND_STROKE_WIDTH)}
                    />
                  </svg>
                  {labels.legend[kind]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <figcaption className="order-1 mt-4">
        <p className="text-sm font-semibold text-gray-600">{fillIn(labels.beatIndicator, beatIndex + 1, beats.length)}</p>
        <div aria-hidden="true" className="mt-2 grid">
          {FILM_TABS.flatMap((entryTab, entryTabIndex) =>
            BEATS[entryTab].map((beat, entryBeatIndex) => {
              const entry = captionOf(labels, entryTab, beat.id);
              const active = entryTabIndex === tabIndex && entryBeatIndex === beatIndex;
              return (
                <div
                  key={`${entryTab}-${beat.id}`}
                  className={`col-start-1 row-start-1 ${active ? "" : "invisible"}`}
                >
                  <p className="text-lg font-bold text-textMain">{entry.headline}</p>
                  <p className="mt-1 text-base text-gray-700">{entry.detail}</p>
                  <p className="mt-1 text-base text-gray-700">{entry.why}</p>
                  {entryTab === "cloud" && beat.id === "gates" && <p className="mt-1 text-sm text-gray-600">{labels.gatesLine}</p>}
                </div>
              );
            }),
          )}
        </div>
      </figcaption>
    </figure>
  );
}
