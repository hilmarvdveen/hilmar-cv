import type { ReactNode } from "react";
import type { FilmFrame } from "@/lib/smartEnergyFilm/film";
import { LINE_KINDS } from "@/lib/smartEnergyFilm/layout";
import type { SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { LINE_STYLES, SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

type SmartEnergyCaptureFrameProps = { frame: FilmFrame; labels: SmartEnergyFilmLabels };

function Legend({ labels }: { labels: SmartEnergyFilmLabels }) {
  return (
    <p className="flex flex-wrap items-center gap-x-8 gap-y-2 text-3xl text-gray-700">
      {LINE_KINDS.map((kind) => (
        <span key={kind} className="inline-flex items-center gap-3">
          <svg width="56" height="14" aria-hidden="true">
            <path d="M4 7 H52" stroke={LINE_STYLES[kind].colour} strokeWidth={5} strokeLinecap="round" strokeDasharray={LINE_STYLES[kind].dash} />
          </svg>
          {labels.legend[kind]}
        </span>
      ))}
    </p>
  );
}

function Card({ opacity, children }: { opacity: number; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center bg-white/40 px-10" style={{ opacity }}>
      <div className="flex w-full flex-col gap-8 rounded-3xl border border-gray-200 bg-white p-12 shadow-2xl">{children}</div>
    </div>
  );
}

export function SmartEnergyCaptureFrame({ frame, labels }: SmartEnergyCaptureFrameProps) {
  const split = labels.endCard.link.lastIndexOf("/") + 1;
  const caption = frame.captionIndex === null ? null : labels.captions[frame.sceneId][frame.captionIndex];
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="aspect-square w-full border-b border-gray-200">
        <SmartEnergyFilmPoster frame={frame} labels={labels} />
      </div>
      <div className="flex flex-1 flex-col justify-between px-12 py-6">
        <div>
          {caption && (
            <>
              <p className="text-4xl font-extrabold text-textMain">{caption.headline}</p>
              <p className="mt-2 text-3xl text-gray-700">{caption.detail}</p>
            </>
          )}
        </div>
        <Legend labels={labels} />
      </div>
      {frame.titleCardOpacity > 0 && (
        <Card opacity={frame.titleCardOpacity}>
          {labels.titleCard.map((line) => (
            <p key={line} className="text-5xl font-extrabold text-brand-navy">
              {line}
            </p>
          ))}
          <div>
            <p className="text-4xl font-bold text-textMain">{labels.name}</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{labels.role}</p>
          </div>
        </Card>
      )}
      {frame.endCardOpacity > 0 && (
        <Card opacity={frame.endCardOpacity}>
          <div>
            <p className="text-5xl font-extrabold text-brand-navy">{labels.name}</p>
            <p className="mt-3 text-4xl font-semibold text-primary">{labels.role}</p>
          </div>
          <div>
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
