import { FILM_TABS, type BeatId, type FilmRenderState } from "@/lib/smartEnergyFilm/film";
import { STAGE_VIEWBOX } from "@/lib/smartEnergyFilm/layout";
import { LINE_STYLES, dashPattern } from "@/lib/smartEnergyFilm/tokens";
import type { SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

type SmartEnergyCaptureFrameProps = { state: FilmRenderState; labels: SmartEnergyFilmLabels };

const LEGEND_STROKE_WIDTH = 5;

function Tabs({ state, labels }: SmartEnergyCaptureFrameProps) {
  return (
    <div className="flex h-[104px] items-center justify-between gap-1 border-b border-gray-200 px-4">
      {FILM_TABS.map((tab, index) => {
        const active = index === state.tabIndex;
        const done = index < state.tabIndex;
        return (
          <p
            key={tab}
            className={`relative overflow-hidden rounded-full px-3 py-2 text-3xl font-semibold ${
              active ? "bg-brand-navy text-white" : done ? "text-brand-navy" : "text-gray-500"
            }`}
          >
            {labels.tabs[tab]}
            {active && <span className="absolute bottom-0 left-0 h-1.5 bg-emerald-400" style={{ width: `${state.tabProgress * 100}%` }} />}
          </p>
        );
      })}
    </div>
  );
}

function Legend({ state, labels }: SmartEnergyCaptureFrameProps) {
  return (
    <span className="flex items-center gap-6 text-3xl text-gray-600">
      {state.legend.map((kind) => (
        <span key={kind} className="inline-flex items-center gap-2">
          <svg width="56" height="14" aria-hidden="true">
            <path
              d="M4 7 H52"
              stroke={LINE_STYLES[kind].colour}
              strokeWidth={LEGEND_STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={dashPattern(kind, LEGEND_STROKE_WIDTH)}
            />
          </svg>
          {labels.legend[kind]}
        </span>
      ))}
    </span>
  );
}

export function SmartEnergyCaptureFrame({ state, labels }: SmartEnergyCaptureFrameProps) {
  const caption = (labels.captions[state.tab] as Record<BeatId, SmartEnergyFilmLabels["captions"]["overview"]["orient"]>)[state.beat.id];
  const beatIndicator = labels.beatIndicator.replace("{current}", String(state.beatIndex + 1)).replace("{total}", String(state.beatCount));
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <Tabs state={state} labels={labels} />
      <div className="w-full border-b border-gray-200" style={{ height: STAGE_VIEWBOX.landscape.height }}>
        <SmartEnergyFilmPoster state={state} labels={labels} orientation="landscape" still />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 px-12">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-semibold text-gray-600">{beatIndicator}</p>
          <Legend state={state} labels={labels} />
        </div>
        <p className="text-5xl font-extrabold text-brand-navy">{caption.headline}</p>
        <p className="text-3xl text-gray-700">{caption.detail}</p>
        <p className="text-3xl text-gray-600">{caption.why}</p>
        {state.tab === "cloud" && state.beat.id === "gates" && <p className="text-2xl text-gray-600">{labels.gatesLine}</p>}
      </div>
    </div>
  );
}
