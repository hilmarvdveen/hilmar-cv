import type { Locale } from "@/lib/seo";
import { beatEndState, beatIndexOf, type BeatIdOf, type TabId } from "@/lib/smartEnergyFilm/film";
import { ARROWS, BLOCKS, FOCUS_LAYOUTS, type BlockId, type Orientation } from "@/lib/smartEnergyFilm/layout";
import { smartEnergyFilmLabels, type SmartEnergyFilmLabels } from "../../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "../SmartEnergyFilmPoster";
import { STILL_LABELS, pick } from "./labels";

export type StaticBeatProps<Tab extends TabId = TabId> = { locale: Locale; tab: Tab; beat: BeatIdOf<Tab> };

const ORIENTATION_CLASSES: Record<Orientation, string> = {
  landscape: "hidden sm:block",
  portrait: "sm:hidden",
};

const blockTitle = (labels: SmartEnergyFilmLabels, block: BlockId): string => labels.blocks[block].title.join(" ");

export function StaticBeat<Tab extends TabId>({ locale, tab, beat }: StaticBeatProps<Tab>) {
  const labels = smartEnergyFilmLabels(locale);
  const state = beatEndState(tab, beatIndexOf(tab, beat));
  const caption = labels.captions[tab][beat];
  const visibleBlocks = BLOCKS.filter((block) => state.beat.visible.has(block.id)).map((block) => blockTitle(labels, block.id));
  const to = pick(STILL_LABELS.to, locale);
  const hops = state.beat.hops.map((hop) => {
    const [from, target] = ARROWS.filter((arrow) => arrow.id === hop.arrow)[0].ends;
    const ends = hop.reverse ? [target, from] : [from, target];
    return `${blockTitle(labels, ends[0])} ${to} ${blockTitle(labels, ends[1])}`;
  });
  return (
    <figure className="my-10">
      {(Object.keys(ORIENTATION_CLASSES) as Orientation[]).map((orientation) => {
        const { width, height } = FOCUS_LAYOUTS[state.beat.layout][orientation].viewBox;
        return (
          <div key={orientation} className={`w-full bg-gray-50 ${ORIENTATION_CLASSES[orientation]}`} style={{ aspectRatio: `${width} / ${height}` }}>
            <SmartEnergyFilmPoster state={state} labels={labels} orientation={orientation} still />
          </div>
        );
      })}
      <figcaption className="mt-4 text-left text-sm text-gray-600">
        <span className="block text-sm font-semibold text-gray-700">{labels.tabs[tab]}</span>
        {caption.headline}. {caption.detail} {caption.why}
      </figcaption>
      <ul aria-label={pick(STILL_LABELS.list, locale)} className="sr-only">
        <li>
          {pick(STILL_LABELS.blocks, locale)}: {visibleBlocks.join(", ")}
        </li>
        {hops.map((hop, index) => (
          <li key={`${hop}-${index}`}>
            {pick(STILL_LABELS.hop, locale)} {index + 1}: {hop}
          </li>
        ))}
      </ul>
    </figure>
  );
}
