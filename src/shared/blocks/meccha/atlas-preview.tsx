import { ArrowRight, MapPinned, Palette } from 'lucide-react';
import Image from 'next/image';

import {
  getAtlasImagePath,
  getAtlasMapsWithSpots,
  getLocalizedPath,
} from './atlas-data';

// Renders the home-page Map Atlas section. Each map card shows the
// map thumbnail plus all 10 spot thumbnails as a 5x2 grid, so the page
// surfaces 50+ hiding spots at a glance instead of hiding them behind
// per-map pages.
export function AtlasPreview({ locale }: { locale: string }) {
  const maps = getAtlasMapsWithSpots();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {maps.map((map, index) => (
        <a
          key={map.id}
          href={getLocalizedPath(locale, `/maps/${map.slug}`)}
          className="group overflow-hidden rounded-md border border-[#D8CFC6] bg-[#F6F0EA] transition hover:-translate-y-0.5 hover:border-[#7D6D69]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#29211D]">
            <Image
              src={getAtlasImagePath(map.thumb)}
              alt={`${map.name} Meccha Chameleon hiding spots map preview`}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#7D6D69] text-sm font-bold text-white shadow-sm">
              {index + 1}
            </div>
            <div className="absolute right-3 top-3 flex h-9 items-center gap-1 rounded-md bg-black/60 px-2 text-xs font-semibold text-white shadow-sm backdrop-blur">
              {map.spots.length} spots
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-5">{map.name}</h3>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#7D6D69] transition group-hover:translate-x-0.5" />
            </div>
            <p className="line-clamp-2 text-xs leading-5 text-[#4C3B35]">
              {map.desc}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#4C3B35]">
              <span className="inline-flex items-center gap-1.5">
                <MapPinned className="h-3.5 w-3.5 text-[#7D6D69]" />
                {map.spotCount} spots
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-[#AA776E]" />
                {map.difficulty}
              </span>
            </div>

            {/* 10 spot thumbnails: 5 cols x 2 rows */}
            <div className="mt-4 grid grid-cols-5 gap-1.5">
              {map.spots.map((spot, sIdx) => (
                <div
                  key={spot.id}
                  className="relative aspect-square overflow-hidden rounded-sm border border-[#D8CFC6] bg-[#29211D]"
                  title={`${sIdx + 1}. ${spot.name}`}
                >
                  <Image
                    src={getAtlasImagePath(spot.screenshot)}
                    alt={spot.name}
                    fill
                    sizes="60px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
