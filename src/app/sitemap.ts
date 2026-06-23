import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';
import { atlasMaps } from '@/shared/blocks/meccha/atlas-data';

const STATIC_PATHS = [
  '',
  '/new-player',
  '/#atlas',
  '/#how-to-play',
  '/#updates',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = envConfigs.app_url.replace(/\/$/, '');
  const now = new Date();

  // Home + locale alternates
  const homeEntries: MetadataRoute.Sitemap = locales.flatMap((loc) => {
    const url = loc === defaultLocale ? `${base}/` : `${base}/${loc}/`;
    const alternates: Record<string, string> = {};
    for (const l of locales) {
      alternates[l] = l === defaultLocale ? `${base}/` : `${base}/${l}/`;
    }
    alternates['x-default'] = `${base}/`;
    return [
      {
        url,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1.0,
        alternates: { languages: alternates },
      },
    ];
  });

  // /new-player + locale alternates
  const newPlayerEntries: MetadataRoute.Sitemap = locales.map((loc) => {
    const url = loc === defaultLocale ? `${base}/new-player` : `${base}/${loc}/new-player`;
    const alternates: Record<string, string> = {};
    for (const l of locales) {
      alternates[l] = l === defaultLocale ? `${base}/new-player` : `${base}/${l}/new-player`;
    }
    alternates['x-default'] = `${base}/new-player`;
    return {
      url,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: alternates },
    };
  });

  // /maps/[mapSlug] for each of the 5 maps, with locale alternates
  const mapEntries: MetadataRoute.Sitemap = atlasMaps.flatMap((map) =>
    locales.map((loc) => {
      const url = loc === defaultLocale
        ? `${base}/maps/${map.slug}`
        : `${base}/${loc}/maps/${map.slug}`;
      const alternates: Record<string, string> = {};
      for (const l of locales) {
        alternates[l] = l === defaultLocale
          ? `${base}/maps/${map.slug}`
          : `${base}/${l}/maps/${map.slug}`;
      }
      alternates['x-default'] = `${base}/maps/${map.slug}`;
      return {
        url,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: alternates },
      };
    })
  );

  return [...homeEntries, ...newPlayerEntries, ...mapEntries];
}
