import { ArrowLeft, MapPinned, Palette } from 'lucide-react';
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
import { mapLabels } from '@/shared/blocks/meccha/meccha-i18n';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

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
  const map = getAtlasMapBySlug(mapSlug, locale);

  if (!map) {
    return {};
  }

  const labels = locale === 'zh' ? mapLabels.zh : mapLabels.en;
  const title = `${map.name} ${labels.titleSuffix}`;
  const description = `${map.name} ${labels.descriptionSuffix}`;
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

  const map = getAtlasMapBySlug(mapSlug, locale);
  if (!map) {
    notFound();
  }

  const spots = getSpotsByMapId(map.id, locale);
  const labels = locale === 'zh' ? mapLabels.zh : mapLabels.en;
  const homeUrl = await getCanonicalUrl('/', locale);
  const mapsUrl = await getCanonicalUrl('/maps', locale);
  const mapUrl = await getCanonicalUrl(`/maps/${mapSlug}`, locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${map.name} ${locale === 'zh' ? '超级变色龙隐藏点' : 'Meccha Chameleon hiding spots'}`,
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
      <BreadcrumbJsonLd
        items={[
          { name: locale === 'zh' ? '首页' : 'Home', item: homeUrl },
          { name: locale === 'zh' ? '地图攻略' : 'Maps', item: mapsUrl },
          { name: map.name, item: mapUrl },
        ]}
      />

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA] text-[#29211D]">
        <div className="container grid gap-8 pt-16 pb-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-center">
          <div>
            <a
              href={getLocalizedPath(locale, '/#atlas')}
              className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-3 py-2 text-sm font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
            >
              <ArrowLeft className="h-4 w-4" />
              {labels.back}
            </a>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
              {labels.guide}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              {map.name} {labels.hidingSpots}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f4b42]">
              {map.desc}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd] bg-white px-3 py-2 text-sm font-semibold">
                <MapPinned className="h-4 w-4 text-[#7D6D69]" />
                {spots.length} {locale === 'zh' ? labels.spots : 'hiding spots'}
              </div>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd] bg-white px-3 py-2 text-sm font-semibold">
                <Palette className="h-4 w-4 text-[#AA776E]" />
                {map.difficulty} {labels.difficulty}
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
              alt={`${map.name} ${labels.altPreview}`}
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
          <MapSpotsExplorer map={map} spots={spots} locale={locale} />
        </div>
      </section>

      <section className="bg-[#F6F0EA]">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{labels.ready}</h2>
            <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
              {labels.readyBody}
            </p>
          </div>
          <a
            href={locale === 'en' ? '/#play' : `/${locale}/#play`}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
          >
            {labels.play}
          </a>
        </div>
      </section>
    </main>
  );
}
