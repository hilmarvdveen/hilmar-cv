import type { FilmFrame } from "@/lib/smartEnergyFilm/film";
import type { SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

type SmartEnergyCaptureFrameProps = { frame: FilmFrame; labels: SmartEnergyFilmLabels };

export function SmartEnergyCaptureFrame({ frame, labels }: SmartEnergyCaptureFrameProps) {
  const scene = labels.scenes[frame.sceneId];
  const caption = frame.beatIndex === null ? scene.caption : scene.beats[frame.beatIndex];
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="aspect-square w-full border-b border-gray-200">
        <SmartEnergyFilmPoster frame={frame} labels={labels} />
      </div>
      <div className="flex flex-1 flex-col justify-between px-12 py-7">
        <div>
          <p className="text-3xl font-bold text-textMain">
            <span className="mr-4 text-primary">{scene.step}</span>
            {scene.title}
          </p>
          <p className="mt-3 text-2xl text-gray-700">{caption}</p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-lg font-semibold text-primary" style={{ opacity: frame.closingOpacity }}>
            {labels.closing}
          </p>
          <p className="text-lg font-semibold text-gray-600">{labels.url}</p>
        </div>
      </div>
    </div>
  );
}
