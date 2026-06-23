'use client';

import { useMemo, useState } from 'react';
import { Eye, Palette, Star } from 'lucide-react';
import Image from 'next/image';

import {
  type AtlasMap,
  type AtlasSpot,
  getAtlasImagePath,
} from './atlas-data';

export function MapSpotsExplorer({
  map,
  spots,
}: {
  map: AtlasMap;
  spots: AtlasSpot[];
}) {
  const [activeSpotId, setActiveSpotId] = useState(spots[0]?.id ?? '');
  const activeSpot = useMemo(
    () => spots.find((spot) => spot.id === activeSpotId) ?? spots[0],
    [activeSpotId, spots]
  );

  if (!activeSpot) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <div className="overflow-hidden rounded-md border border-[#ded6c4] bg-[#151512]">
        <div className="relative aspect-video">
          <Image
            src={getAtlasImagePath(activeSpot.screenshot)}
            alt={`${activeSpot.name} hiding spot on ${map.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
          />
          <div className="absolute left-4 top-4 rounded-md bg-black/70 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
            {activeSpot.name}
          </div>
        </div>
      </div>

      <aside className="rounded-md border border-[#ded6c4] bg-white p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-[#287c63]">
              Selected spot
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight">
              {activeSpot.name}
            </h2>
          </div>
          <Eye className="h-6 w-6 shrink-0 text-[#287c63]" />
        </div>

        <p className="text-sm leading-6 text-[#5d584b]">{activeSpot.tip}</p>

        <div className="mt-6 grid gap-3">
          <div className="rounded-md border border-[#e0d8c8] bg-[#f6f3ea] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Palette className="h-4 w-4 text-[#c45b38]" />
              Paint colors
            </div>
            <div className="flex flex-wrap gap-3">
              <ColorChip label="Primary" value={activeSpot.rgb} />
              <ColorChip label="Secondary" value={activeSpot.secondary_rgb} />
            </div>
          </div>

          <div className="rounded-md border border-[#e0d8c8] bg-[#f6f3ea] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-[#c45b38]" />
              Difficulty
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < activeSpot.difficulty
                      ? 'h-3 w-8 rounded-full bg-[#c45b38]'
                      : 'h-3 w-8 rounded-full bg-[#ded6c4]'
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {spots.map((spot, index) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActiveSpotId(spot.id)}
              className={`overflow-hidden rounded-md border bg-white text-left transition ${
                activeSpot.id === spot.id
                  ? 'border-[#287c63] ring-2 ring-[#287c63]/25'
                  : 'border-[#ded6c4] hover:border-[#287c63]'
              }`}
            >
              <div className="relative aspect-video bg-[#151512]">
                <Image
                  src={getAtlasImagePath(spot.screenshot)}
                  alt={`${spot.name} thumbnail`}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  {index + 1}
                </span>
              </div>
              <div className="min-h-[76px] p-3">
                <div className="line-clamp-2 text-sm font-semibold leading-5">
                  {spot.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="h-8 w-8 shrink-0 rounded-md border border-black/10"
        style={{ backgroundColor: value }}
      />
      <span className="min-w-0">
        <span className="block text-xs text-[#5d584b]">{label}</span>
        <span className="block text-sm font-semibold">{value}</span>
      </span>
    </div>
  );
}
