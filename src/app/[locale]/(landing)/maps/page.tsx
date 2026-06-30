import { ArrowRight, BookOpen, MapPinned, Search, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';

import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import {
  getAtlasImagePath,
  getAtlasMapsWithSpots,
  getLocalizedPath,
} from '@/shared/blocks/meccha/atlas-data';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Meccha Chameleon Map Index — hiding spots, tips, and atlas links';
  const description =
    'Browse every Meccha Chameleon map in one index: hiding spots, paint colors, difficulty labels, and direct links to each detailed map page.';
  const canonicalUrl = await getCanonicalUrl('/maps', locale);
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function MapsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const mapsUrl = await getCanonicalUrl('/maps', locale);
  const maps = getAtlasMapsWithSpots(locale);
  const detailLocale =
    locale === 'es' ||
    locale === 'de' ||
    locale === 'pt' ||
    locale === 'fr' ||
    locale === 'it' ||
    locale === 'nl' ||
    locale === 'ar'
      ? 'en'
      : locale;
  const keywords = locale === 'zh'
    ? ['地图攻略', '隐藏点', '伪装技巧', '新手入口', '地图索引']
    : ['map guide', 'hiding spots', 'camouflage tips', 'new player guide', 'map index'];

  return (
    <main className="min-h-screen bg-[#F6F0EA] text-[#29211D]">
      <BreadcrumbJsonLd
        items={[
          { name: locale === 'zh' ? '首页' : 'Home', item: homeUrl },
          { name: locale === 'zh' ? '地图索引' : 'Map Index', item: mapsUrl },
        ]}
      />

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7D6D69]">
              {locale === 'zh' ? '地图图鉴' : 'Map atlas'}
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
              {locale === 'zh'
                ? '超级变色龙地图索引'
                : 'Meccha Chameleon Map Index'}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#4C3B35]">
              {locale === 'zh'
                ? '把所有地图、隐藏点页和站内攻略入口放在一页，方便玩家从“地图攻略、隐藏点、颜色匹配、新手指南”这类关键词直接进入正确页面。'
                : 'A single index for every Meccha Chameleon map, hiding spot page, and related guide. It is built to catch searches for map guide, hiding spots, color matching, and new player help, then route readers to the right page fast.'}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {keywords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CFC6] bg-[#F6F0EA] px-3 py-1 text-xs font-semibold text-[#29211D]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#7D6D69]" />
                {word}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <a
              href={getLocalizedPath(locale, '/new-player')}
              className="flex items-center gap-3 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-4 transition hover:border-[#7D6D69] hover:bg-white"
            >
              <BookOpen className="h-5 w-5 shrink-0 text-[#7D6D69]" />
              <span className="text-sm font-semibold">
                {locale === 'zh' ? '新手指南' : 'New player guide'}
              </span>
            </a>
            <a
              href={getLocalizedPath(locale, '/updates')}
              className="flex items-center gap-3 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-4 transition hover:border-[#7D6D69] hover:bg-white"
            >
              <Sparkles className="h-5 w-5 shrink-0 text-[#7D6D69]" />
              <span className="text-sm font-semibold">
                {locale === 'zh' ? '更新记录' : 'Updates'}
              </span>
            </a>
            <a
              href={getLocalizedPath(locale, '/community')}
              className="flex items-center gap-3 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-4 transition hover:border-[#7D6D69] hover:bg-white"
            >
              <Search className="h-5 w-5 shrink-0 text-[#7D6D69]" />
              <span className="text-sm font-semibold">
                {locale === 'zh' ? '社区页' : 'Community'}
              </span>
            </a>
            <a
              href={getLocalizedPath(locale, '/tools')}
              className="flex items-center gap-3 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-4 transition hover:border-[#7D6D69] hover:bg-white"
            >
              <MapPinned className="h-5 w-5 shrink-0 text-[#7D6D69]" />
              <span className="text-sm font-semibold">
                {locale === 'zh' ? '工具页' : 'Tools'}
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA]">
        <div className="container py-14">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7D6D69]">
              {locale === 'zh' ? '全部地图' : 'All maps'}
            </p>
            <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
              {locale === 'zh'
                ? '点进任意地图，就能看到该图的隐藏点和实战提示'
                : 'Open any map and jump straight to its hiding spots and match tips'}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {maps.map((map) => (
              <a
                key={map.id}
                href={getLocalizedPath(detailLocale, `/maps/${map.slug}`)}
                className="group overflow-hidden rounded-md border border-[#D8CFC6] bg-white transition hover:-translate-y-0.5 hover:border-[#7D6D69]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#cdefff]">
                  <Image
                    src={getAtlasImagePath(map.thumb)}
                    alt={`${map.name} map preview`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#29211D]">
                      {map.name}
                    </h3>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#7D6D69]" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#4C3B35]">
                    {map.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#4C3B35]">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CFC6] px-2.5 py-1">
                      <MapPinned className="h-3.5 w-3.5 text-[#7D6D69]" />
                      {map.spotCount} spots
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CFC6] px-2.5 py-1">
                      <Sparkles className="h-3.5 w-3.5 text-[#AA776E]" />
                      {map.difficulty}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
