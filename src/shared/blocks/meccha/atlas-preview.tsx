import { ArrowRight, MapPinned, Palette } from 'lucide-react';
import Image from 'next/image';

import {
  getAtlasImagePath,
  getAtlasMapsWithSpots,
  getLocalizedPath,
} from './atlas-data';

export function AtlasPreview({ locale }: { locale: string }) {
  const maps = getAtlasMapsWithSpots();

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {maps.map((map, index) => (
        <a
          key={map.id}
          href={getLocalizedPath(locale, `/maps/${map.slug}`)}
          className="group overflow-hidden rounded-md border border-[#ded6c4] bg-[#f6f3ea] transition hover:-translate-y-0.5 hover:border-[#287c63]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#151512]">
            <Image
              src={getAtlasImagePath(map.thumb)}
              alt={`${map.name} Meccha Chameleon hiding spots map preview`}
              fill
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#287c63] text-sm font-bold text-white shadow-sm">
              {index + 1}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-5">{map.name}</h3>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#287c63] transition group-hover:translate-x-0.5" />
            </div>
            <p className="line-clamp-3 text-xs leading-5 text-[#5d584b]">
              {map.desc}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#5d584b]">
              <span className="inline-flex items-center gap-1.5">
                <MapPinned className="h-3.5 w-3.5 text-[#287c63]" />
                {map.spotCount} spots
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-[#c45b38]" />
                {map.difficulty}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
