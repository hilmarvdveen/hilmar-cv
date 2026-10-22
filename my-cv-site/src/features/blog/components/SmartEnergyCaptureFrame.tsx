import type { ReactNode } from "react";
import { FILM_TABS, type FilmFrame } from "@/lib/smartEnergyFilm/film";
import { LINE_KINDS } from "@/lib/smartEnergyFilm/layout";
import type { SmartEnergyFilmLabels, TabId } from "../smartEnergyFilmLabels";
import { LINE_STYLES, SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

type SmartEnergyCaptureFrameProps = { frame: FilmFrame; labels: SmartEnergyFilmLabels };

function Tabs({ frame, labels }: SmartEnergyCaptureFrameProps) {
  return (
    <div className="flex h-[104px] items-center justify-between gap-1 border-b border-gray-200 px-4">
      {FILM_TABS.map((tab, index) => {
        const active = index === frame.tabIndex;
        const done = frame.tabIndex !== null && index < frame.tabIndex;
        return (
          <p
            key={tab}
            className={`relative overflow-hidden rounded-full px-3 py-2 text-3xl font-semibold ${
              active ? "bg-brand-navy text-white" : done ? "text-brand-navy" : "text-gray-500"
            }`}
          >
            {labels.tabs[tab as TabId]}
            {active && <span className="absolute bottom-0 left-0 h-1.5 bg-emerald-400" style={{ width: `${frame.sceneProgress * 100}%` }} />}
          </p>
        );
      })}
    </div>
  );
}

function Legend({ labels }: { labels: SmartEnergyFilmLabels }) {
  return (
    <span className="flex items-center gap-6 text-3xl text-gray-600">
      {LINE_KINDS.map((kind) => (
        <span key={kind} className="inline-flex items-center gap-2">
          <svg width="44" height="14" aria-hidden="true">
            <path d="M4 7 H40" stroke={LINE_STYLES[kind].colour} strokeWidth={5} strokeLinecap="round" strokeDasharray={LINE_STYLES[kind].dash} />
          </svg>
          {labels.legend[kind]}
        </span>
      ))}
    </span>
  );
}

function Card({ opacity, children }: { opacity: number; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center bg-white/40 px-10" style={{ opacity }}>
      <div className="flex w-full flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-12 shadow-2xl">{children}</div>
    </div>
  );
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-3xl font-semibold uppercase tracking-widest text-primary">{children}</p>
);

export function SmartEnergyCaptureFrame({ frame, labels }: SmartEnergyCaptureFrameProps) {
  const split = labels.endCard.link.lastIndexOf("/") + 1;
  const caption = frame.captionIndex === null ? null : labels.captions[frame.sceneId][frame.captionIndex];
  const step =
    frame.tabIndex === null
      ? null
      : labels.stepEyebrow.replace("{current}", String(frame.tabIndex + 1)).replace("{total}", String(FILM_TABS.length));
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <Tabs frame={frame} labels={labels} />
      <div className="h-[960px] w-full border-b border-gray-200">
        <SmartEnergyFilmPoster frame={frame} labels={labels} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 px-12">
        <div className="flex items-center justify-between">
          {step && <Eyebrow>{step}</Eyebrow>}
          <Legend labels={labels} />
        </div>
        {caption && (
          <>
            <p className="text-5xl font-extrabold text-brand-navy">{caption.headline}</p>
            <p className="text-3xl text-gray-700">{caption.detail}</p>
          </>
        )}
      </div>
      {frame.titleCardOpacity > 0 && (
        <Card opacity={frame.titleCardOpacity}>
          <Eyebrow>{labels.titleCard.eyebrow}</Eyebrow>
          <p className="text-balance text-5xl font-extrabold text-brand-navy">{labels.titleCard.headline}</p>
          <p className="text-3xl text-gray-700">{labels.titleCard.support}</p>
          <div className="mt-4 border-t border-gray-200 pt-6">
            <p className="text-4xl font-bold text-textMain">{labels.name}</p>
            <p className="mt-1 text-3xl font-semibold text-primary">{labels.role}</p>
          </div>
        </Card>
      )}
      {frame.endCardOpacity > 0 && (
        <Card opacity={frame.endCardOpacity}>
          <div>
            <p className="text-5xl font-extrabold text-brand-navy">{labels.name}</p>
            <p className="mt-2 text-4xl font-semibold text-primary">{labels.role}</p>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-3xl text-gray-700">{labels.endCard.read}</p>
            <p className="mt-2 text-3xl font-bold text-textMain">
              {labels.endCard.link.slice(0, split)}
              <br />
              {labels.endCard.link.slice(split)}
            </p>
          </div>
          <p className="text-3xl font-semibold text-gray-700">{labels.endCard.ownWork}</p>
        </Card>
      )}
    </div>
  );
}
