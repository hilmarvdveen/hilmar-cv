"use client";

import { useEffect, useState, type FocusEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { explainerFrameAtMilliseconds } from "@/lib/smartEnergyExplainer/frame";
import {
  SCENES,
  lastFrameMillisecondsOfScene,
  sceneIndexAtMilliseconds,
  wrapElapsed,
} from "@/lib/smartEnergyExplainer/timeline";
import { SmartEnergyFlowDrawing, type SmartEnergyExplainerLabels } from "./SmartEnergyFlowDrawing";

type SmartEnergyFlowExplainerProps = {
  labels: SmartEnergyExplainerLabels;
  frameAtMilliseconds?: number;
};

const BUTTON_CLASSES =
  "mr-2 mt-3 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 aria-pressed:border-emerald-600 aria-pressed:bg-emerald-50";

export function SmartEnergyFlowExplainer({ labels, frameAtMilliseconds }: SmartEnergyFlowExplainerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [elapsed, setElapsed] = useState(() => wrapElapsed(frameAtMilliseconds ?? 0));
  const [pausedByVisitor, setPausedByVisitor] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusedWithin, setFocusedWithin] = useState(false);

  const fixedFrame = frameAtMilliseconds !== undefined;
  const animating = !fixedFrame && !prefersReducedMotion && !pausedByVisitor && !hovered && !focusedWithin;

  useEffect(() => {
    if (!animating) {
      return;
    }
    let previousTimestamp: number | null = null;
    let handle = 0;
    const tick = (timestamp: number) => {
      if (previousTimestamp !== null) {
        const delta = timestamp - previousTimestamp;
        setElapsed((current) => wrapElapsed(current + delta));
      }
      previousTimestamp = timestamp;
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [animating]);

  const sceneIndex = sceneIndexAtMilliseconds(elapsed);
  const scene = SCENES[sceneIndex];
  const shownMilliseconds = prefersReducedMotion && !fixedFrame ? lastFrameMillisecondsOfScene(scene.id) : elapsed;
  const frame = explainerFrameAtMilliseconds(shownMilliseconds);
  const sceneLabels = labels.scenes[scene.id];

  const jumpBy = (offset: number) => {
    const target = SCENES[(sceneIndex + offset + SCENES.length) % SCENES.length];
    setElapsed(target.startMilliseconds);
  };

  const togglePause = () => {
    if (pausedByVisitor) {
      setHovered(false);
      setFocusedWithin(false);
    }
    setPausedByVisitor(!pausedByVisitor);
  };

  const leaveFocus = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusedWithin(false);
    }
  };

  return (
    <figure
      className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-4"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocusedWithin(true)}
      onBlur={leaveFocus}
    >
      <SmartEnergyFlowDrawing frame={frame} labels={labels} />
      <p role="status" aria-live="polite" className="mt-3 text-sm text-gray-700">
        {`${sceneLabels.title}. ${sceneLabels.caption}`}
      </p>
      <p className="mt-2 text-xs font-semibold text-gray-600">
        {labels.sceneCounter.replace("{current}", String(sceneIndex + 1)).replace("{total}", String(SCENES.length))}
      </p>
      <button type="button" className={BUTTON_CLASSES} onClick={() => jumpBy(-1)}>
        {labels.previous}
      </button>
      <button type="button" className={BUTTON_CLASSES} aria-pressed={pausedByVisitor} onClick={togglePause}>
        {labels.pause}
      </button>
      <button type="button" className={BUTTON_CLASSES} onClick={() => jumpBy(1)}>
        {labels.next}
      </button>
    </figure>
  );
}
