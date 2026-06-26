import mapsJson from './data/maps.json';
import spotsJson from './data/spots.json';
import { localizeMap, localizeSpot } from './meccha-i18n';

export type AtlasMap = {
  id: string;
  name: string;
  slug: string;
  thumb: string;
  palette: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  desc: string;
  added_in: string;
  community_spots_estimate: number;
};

export type AtlasSpot = {
  id: string;
  map_id: string;
  name: string;
  screenshot: string;
  rgb: string;
  secondary_rgb: string;
  difficulty: number;
  tip: string;
};

export type AtlasMapWithSpots = AtlasMap & {
  spotCount: number;
  spots: AtlasSpot[];
};

export const atlasMaps = mapsJson as AtlasMap[];
export const atlasSpots = spotsJson as AtlasSpot[];

export function getAtlasImagePath(path: string) {
  return `/meccha/atlas/${path}`;
}

export function getAtlasMapsWithSpots(locale = 'en'): AtlasMapWithSpots[] {
  return atlasMaps.map((map) => {
    const localizedMap = localizeMap(map, locale);
    const spots = getSpotsByMapId(map.id, locale);

    return {
      ...localizedMap,
      spotCount: spots.length,
      spots,
    };
  });
}

export function getAtlasMapBySlug(slug: string, locale = 'en') {
  const map = atlasMaps.find((map) => map.slug === slug);
  return map ? localizeMap(map, locale) : map;
}

export function getSpotsByMapId(mapId: string, locale = 'en') {
  return atlasSpots.filter((spot) => spot.map_id === mapId).map((spot) => localizeSpot(spot, locale));
}

export function getLocalizedPath(locale: string, path: string) {
  return locale === 'en' ? path : `/${locale}${path}`;
}
