import { ArrowLeft, ExternalLink, MapPinned, Palette } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import {
  atlasMaps,
  getAtlasImagePath,
  getAtlasMapBySlug,
  getLocalizedPath,
  getSpotsByMapId,
} from '@/shared/blocks/meccha/atlas-data';
import { MapSpotsExplorer } from '@/shared/blocks/meccha/map-spots-explorer';

const steamUrl = 'https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/';

export const revalidate = 3600;

export function generateStaticParams() {
  return atlasMaps.flatMap((map) =>
    ['en', 'zh'].map((locale) => ({
      locale,
      mapSlug: map.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mapSlug: string }>;
}): Promise<Metadata> {
  const { mapSlug } = await params;
  const map = getAtlasMapBySlug(mapSlug);

  if (!map) {
    return {};
  }

  return {
    metadataBase: new URL('https://mecchachameleon.art'),
    title: `${map.name} Hiding Spots | Meccha Chameleon Art Lab`,
    description: `${map.name} Meccha Chameleon hiding spot atlas with screenshots, paint colors, difficulty ratings, and hider tips.`,
    openGraph: {
      title: `${map.name} Hiding Spots`,
      description: map.desc,
      images: [getAtlasImagePath(map.thumb)],
    },
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string; mapSlug: string }>;
}) {
  const { locale, mapSlug } = await params;
  setRequestLocale(locale);

  const map = getAtlasMapBySlug(mapSlug);
  if (!map) {
    notFound();
  }

  const spots = getSpotsByMapId(map.id);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${map.name} Meccha Chameleon hiding spots`,
    description: map.desc,
    numberOfItems: spots.length,
    itemListElement: spots.map((spot, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: spot.name,
      image: getAtlasImagePath(spot.screenshot),
      description: spot.tip,
    })),
  };

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#151512]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-[#ded6c4] bg-[#f6f3ea] text-[#151512]">
        <div className="container grid gap-8 pt-16 pb-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-center">
          <div>
            <a
              href={getLocalizedPath(locale, '/#atlas')}
              className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-3 py-2 text-sm font-semibold text-[#151512] transition hover:bg-[#ece5d8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to atlas
            </a>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#287c63]">
              Meccha Chameleon map guide
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              {map.name} Hiding Spots
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f4b42]">
              {map.desc}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd] bg-white px-3 py-2 text-sm font-semibold">
                <MapPinned className="h-4 w-4 text-[#287c63]" />
                {spots.length} hiding spots
              </div>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd] bg-white px-3 py-2 text-sm font-semibold">
                <Palette className="h-4 w-4 text-[#c45b38]" />
                {map.difficulty} difficulty
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {map.palette.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8cfbd] bg-white px-3 py-1 text-xs font-semibold"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-white/15 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-video">
              <Image
              src={getAtlasImagePath(map.thumb)}
              alt={`${map.name} Meccha Chameleon map preview`}
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ded6c4] bg-white">
        <div className="container py-12">
          <MapSpotsExplorer map={map} spots={spots} />
        </div>
      </section>

      <section className="bg-[#f6f3ea]">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ready for the real match?</h2>
            <p className="mt-2 text-sm leading-6 text-[#5d584b]">
              This atlas is an unofficial second-screen guide. The official game
              remains the Steam PC release.
            </p>
          </div>
          <a
            href={steamUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#287c63] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f664f]"
          >
            Official Steam page
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
