'use client';

import { useState } from 'react';
import { ExternalLink, Gamepad2, Sparkles } from 'lucide-react';

import { getHomeCopy, getLocalizedPath, isZh } from './meccha-i18n';

type RelatedGame = {
  id: string;
  title: string;
  note: string;
  href: string;
  external: boolean;
  tag: 'paint' | 'lobby' | 'fps' | 'tactics' | 'tools' | 'companion';
};

const INTERNAL_GAMES: RelatedGame[] = [
  {
    id: 'play-with-friends',
    title: 'Play Meccha Chameleon with friends',
    note: 'Private rooms, room codes, server tags, and the friend-room setup checklist.',
    href: '/play-with-friends',
    external: false,
    tag: 'lobby',
  },
  {
    id: 'fps-boost',
    title: 'Meccha Chameleon FPS boost guide',
    note: 'Low-end PC graphics settings, Windows Game Mode, GPU tweaks, and risky booster warnings.',
    href: '/fps-boost',
    external: false,
    tag: 'fps',
  },
  {
    id: 'public-lobby-guide',
    title: 'Meccha Chameleon public lobby survival',
    note: 'Kicks, random shooting, spectator callouts, and the private-room rules that fix them.',
    href: '/public-lobby-guide',
    external: false,
    tag: 'lobby',
  },
  {
    id: 'color-matching',
    title: 'Meccha Chameleon color matching guide',
    note: 'Eyedropper tips, shadow and highlight compensation, and pose discipline for hiders.',
    href: '/color-matching',
    external: false,
    tag: 'paint',
  },
  {
    id: 'new-player',
    title: 'Meccha Chameleon new player walkthrough',
    note: 'Controls, paint tool, role basics, first-match checklist, and the eight rookie mistakes.',
    href: '/new-player',
    external: false,
    tag: 'tactics',
  },
  {
    id: 'tools',
    title: 'Meccha Chameleon tools page',
    note: 'Browser play, route cards, second-screen guides, and the tools radar.',
    href: '/tools',
    external: false,
    tag: 'tools',
  },
];

const EXTERNAL_GAMES: RelatedGame[] = [
  {
    id: 'crazygames-hide-n-seek',
    title: 'Hide N Seek on CrazyGames',
    note: 'CrazyGames browser hide-and-seek, useful as a low-stakes camo practice room.',
    href: 'https://www.crazygames.com/game/hide-n-seek',
    external: true,
    tag: 'companion',
  },
  {
    id: 'gamedistribution-sneaky-friends',
    title: 'Sneaky Friends on GameDistribution',
    note: 'Friend-focused hide-and-seek browser game, mobile and desktop ready.',
    href: 'https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/',
    external: true,
    tag: 'companion',
  },
  {
    id: 'chameleon-game-portal',
    title: 'Chameleon Game browser portal',
    note: 'Browser-built camo sandbox with paint, pose, and a single-room queue.',
    href: 'https://chameleon-game.com/',
    external: true,
    tag: 'companion',
  },
  {
    id: 'meccha-steam',
    title: 'Meccha Chameleon on Steam',
    note: 'Official Steam page: latest patch notes, workshop maps, and the real PC build.',
    href: 'https://store.steampowered.com/app/4704690/MECHA_CHAMELEON/',
    external: true,
    tag: 'tools',
  },
];

const TAG_LABEL_EN: Record<RelatedGame['tag'], string> = {
  paint: 'Paint',
  lobby: 'Lobby',
  fps: 'FPS',
  tactics: 'Tactics',
  tools: 'Tools',
  companion: 'Companion',
};

const TAG_LABEL_ZH: Record<RelatedGame['tag'], string> = {
  paint: '涂装',
  lobby: '联机',
  fps: 'FPS',
  tactics: '玩法',
  tools: '工具',
  companion: '同类',
};

const INITIAL_VISIBLE = 6;

function pickPool(locale: string): RelatedGame[] {
  // Alternate internal / external so the strip looks balanced and both
  // link types get crawled quickly.
  const items: RelatedGame[] = [];
  const ien = INTERNAL_GAMES.length;
  const een = EXTERNAL_GAMES.length;
  for (let i = 0; i < Math.max(ien, een); i += 1) {
    if (i < ien) items.push(INTERNAL_GAMES[i]);
    if (i < een) items.push(EXTERNAL_GAMES[i]);
  }
  return items.map((item) => ({
    ...item,
    note: item.note,
    title: item.title,
    href: item.external
      ? item.href
      : getLocalizedPath(locale, item.href),
    external: item.external,
  }));
}

export function RelatedGames({ locale }: { locale: string }) {
  const copy = getHomeCopy(locale);
  const pool = pickPool(locale);
  const [visible, setVisible] = useState(Math.min(INITIAL_VISIBLE, pool.length));

  if (pool.length === 0) {
    return (
      <section
        id="related-games"
        className="border-b border-[#D8CFC6] bg-[#fff7f1]"
      >
        <div className="container py-12">
          <h2 className="text-2xl font-bold tracking-normal text-[#29211D] md:text-3xl">
            {copy.relatedGamesTitle}
          </h2>
          <p className="mt-3 text-sm text-[#4C3B35]">
            {copy.relatedGamesEmpty}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="related-games"
      className="border-b border-[#D8CFC6] bg-[#fff7f1]"
    >
      <div className="container py-14">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              {copy.relatedGamesEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl">
              {copy.relatedGamesTitle}
            </h2>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pool.slice(0, visible).map((item) => (
            <li
              key={item.id}
              className="h-full rounded-lg border border-[#D8CFC6] bg-white p-5 shadow-sm transition hover:border-[#ff6f9a] hover:shadow-md"
            >
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'nofollow ugc noopener noreferrer' : undefined}
                className="flex h-full flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#7D6D69]">
                  <Gamepad2 className="h-4 w-4" />
                  <span>{isZh(locale) ? TAG_LABEL_ZH[item.tag] : TAG_LABEL_EN[item.tag]}</span>
                  {item.external ? (
                    <ExternalLink className="h-3.5 w-3.5 text-[#7D6D69]" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-[#7D6D69]" />
                  )}
                </div>
                <h3 className="text-lg font-semibold leading-snug text-[#29211D]">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-[#4C3B35]">{item.note}</p>
                <span className="mt-auto text-xs font-semibold text-[#ff6f9a]">
                  {isZh(locale) ? '查看 →' : 'Open →'}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {visible < pool.length ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible(pool.length)}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 text-sm font-semibold text-[#29211D] transition hover:border-[#ff6f9a] hover:bg-[#fff7c8]"
            >
              {isZh(locale) ? '查看更多' : 'Show more'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
