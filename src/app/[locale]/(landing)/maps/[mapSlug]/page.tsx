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
import { getCanonicalUrl } from '@/shared/lib/seo';

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
  params: Promise<{ locale: string; mapSlug: string }>;
}): Promise<Metadata> {
  const { locale, mapSlug } = await params;
  const map = getAtlasMapBySlug(mapSlug);

  if (!map) {
    return {};
  }

  const spots = getSpotsByMapId(map.id);
  const title = `${map.name} Hiding Spots — Meccha Chameleon Atlas`;
  const description = `${map.name} community atlas: ${spots.length} charted spots with paint RGB and hider tips. Fan-made, not the official lemorion build.`;
  const canonicalUrl = await getCanonicalUrl(`/maps/${mapSlug}`, locale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [getAtlasImagePath(map.thumb)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
    <main className="min-h-screen bg-[#F6F0EA] text-[#29211D]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-[#d8cfbd] bg-[#fff7c8] text-[#29211D]">
        <div className="container py-3 text-center text-xs font-semibold md:text-sm">
          ⚠️ Community fan-made atlas · not affiliated with the developer lemorion_1224 · spot counts are community estimates and may differ from the official build (current: v1.8.1)
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA] text-[#29211D]">
        <div className="container grid gap-8 pt-16 pb-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-center">
          <div>
            <a
              href={getLocalizedPath(locale, '/#atlas')}
              className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-3 py-2 text-sm font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to atlas
            </a>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
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
                <MapPinned className="h-4 w-4 text-[#7D6D69]" />
                {spots.length} hiding spots
              </div>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd] bg-white px-3 py-2 text-sm font-semibold">
                <Palette className="h-4 w-4 text-[#AA776E]" />
                {map.difficulty} difficulty
              </div>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd] bg-white px-3 py-2 text-sm font-semibold">
                <span className="text-[#7D6D69]">🗓</span>
                {map.added_in}
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

          <div className="overflow-hidden rounded-md border border-[#efc8d3] bg-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
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

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container py-12">
          <MapSpotsExplorer map={map} spots={spots} />
        </div>
      </section>

      <section className="bg-[#F6F0EA]">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ready for the real match?</h2>
            <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
              Keep this atlas open while you queue up, compare map colors, and
              pick your next hiding route.
            </p>
          </div>
          <a
            href={steamUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#7D6D69] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5C4F4C]"
          >
            Steam page
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
