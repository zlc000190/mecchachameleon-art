'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Sparkles } from 'lucide-react';

import { getHomeCopy, getLocalizedPath, isZh } from './meccha-i18n';
import {
  getFeaturedRelatedGames,
  relatedGames,
  type RelatedGame,
} from './related-game-data';

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

const INITIAL_VISIBLE = 40;

function localizeGame(locale: string, item: RelatedGame): RelatedGame {
  return {
    ...item,
    href: getLocalizedPath(locale, `/${item.slug}`),
  };
}

function pickPool(locale: string, variant: 'section' | 'rail' | 'side') {
  const source =
    variant === 'side' ? getFeaturedRelatedGames() : relatedGames;
  return source.map((item) => localizeGame(locale, item));
}

function selectDemoInPlayFrame(game: RelatedGame) {
  window.dispatchEvent(
    new CustomEvent('meccha:select-demo', {
      detail: {
        demoId: game.demoId ?? game.id,
        title: game.title,
        source: game.source,
        src: game.iframeSrc,
        note: game.note,
        openInNewTab: game.href,
      },
    })
  );
  document
    .getElementById('play')
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function RelatedGames({
  locale,
  variant = 'section',
  start = 0,
  limit,
}: {
  locale: string;
  variant?: 'section' | 'rail' | 'side';
  start?: number;
  limit?: number;
}) {
  const copy = getHomeCopy(locale);
  const pool = pickPool(locale, variant).slice(start);
  const maxVisible = limit ?? pool.length;
  const [visible, setVisible] = useState(
    Math.min(limit ?? INITIAL_VISIBLE, pool.length)
  );
  const visibleItems = pool.slice(0, Math.min(visible, maxVisible));
  const listId = `related-games-${variant}-${start}`;

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

  const content = (
    <>
      {variant === 'side' ? null : (
        <div className={variant === 'rail' ? 'mb-4 text-center' : 'mb-8'}>
          <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
            {copy.relatedGamesEyebrow}
          </p>
          <h2
            className={
              variant === 'rail'
                ? 'text-xl font-bold tracking-normal text-[#29211D] md:text-2xl'
                : 'max-w-3xl text-3xl font-bold tracking-normal text-[#29211D] md:text-4xl'
            }
          >
            {copy.relatedGamesTitle}
          </h2>
        </div>
      )}

      {variant === 'rail' ? (
        <div className="mb-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById(listId)
                ?.scrollBy({ left: -720, behavior: 'smooth' })
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8CFC6] bg-white text-[#29211D] shadow-sm transition hover:border-[#ff6f9a] hover:bg-[#fff7c8]"
            aria-label={isZh(locale) ? '向左查看更多游戏' : 'Scroll left'}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById(listId)
                ?.scrollBy({ left: 720, behavior: 'smooth' })
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8CFC6] bg-white text-[#29211D] shadow-sm transition hover:border-[#ff6f9a] hover:bg-[#fff7c8]"
            aria-label={isZh(locale) ? '向右查看更多游戏' : 'Scroll right'}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <ul
        id={listId}
        className={
          variant === 'side'
            ? 'grid gap-3'
            : 'flex max-w-full snap-x flex-nowrap gap-3 overflow-x-auto overscroll-x-contain pb-4 touch-pan-x [scrollbar-width:thin] sm:gap-4'
        }
      >
        {visibleItems.map((item) => {
          const cardFace = (
            <div
              className={
                variant === 'side'
                  ? 'relative aspect-square overflow-hidden bg-[#f5e6e0]'
                  : 'relative aspect-[4/3] overflow-hidden bg-[#f5e6e0]'
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10">
                <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-normal text-[#29211D]">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {isZh(locale) ? TAG_LABEL_ZH[item.tag] : TAG_LABEL_EN[item.tag]}
                  </span>
                </div>
                <h3
                  className={
                    variant === 'side'
                      ? 'line-clamp-2 text-xs font-black leading-tight text-white drop-shadow'
                      : 'line-clamp-2 text-sm font-black leading-tight text-white drop-shadow'
                  }
                >
                  {item.title}
                </h3>
              </div>
            </div>
          );

          return (
            <li
              key={item.id}
              className={
                variant === 'side'
                  ? 'h-full'
                  : variant === 'rail'
                    ? 'min-w-[168px] snap-start sm:min-w-[210px]'
                    : 'min-w-[190px] max-w-[190px] snap-start sm:min-w-[230px] sm:max-w-[230px]'
              }
            >
              {variant === 'section' ? (
                <a
                  href={item.href}
                  rel={
                    /^https?:\/\//i.test(item.href) ||
                    item.href.startsWith('//')
                      ? 'nofollow noopener noreferrer'
                      : undefined
                  }
                  className="group block h-full overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-[#e0d8c8] transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#ff6f9a]"
                >
                  {cardFace}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => selectDemoInPlayFrame(item)}
                  className="group block h-full w-full overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-[#e0d8c8] transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#ff6f9a]"
                  aria-label={
                    isZh(locale)
                      ? `在中间游戏窗口打开 ${item.title}`
                      : `Open ${item.title} in the play frame`
                  }
                >
                  {cardFace}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {!limit && visible < pool.length ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible(pool.length)}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 text-sm font-semibold text-[#29211D] transition hover:border-[#ff6f9a] hover:bg-[#fff7c8]"
          >
            <Gamepad2 className="h-4 w-4" />
            {isZh(locale) ? '查看更多' : 'Show more'}
          </button>
        </div>
      ) : null}
    </>
  );

  if (variant === 'rail') {
    return (
      <div
        id="related-games-rail"
        className="max-w-full overflow-hidden rounded-lg border border-white/70 bg-white/70 p-3 shadow-[0_18px_60px_rgba(134,103,124,0.16)] backdrop-blur md:p-5"
      >
        {content}
      </div>
    );
  }

  if (variant === 'side') {
    return (
      <aside
        className="hidden rounded-lg border border-white/70 bg-white/65 p-3 shadow-[0_18px_60px_rgba(134,103,124,0.14)] backdrop-blur xl:block"
        aria-label={copy.relatedGamesEyebrow}
      >
        {content}
      </aside>
    );
  }

  return (
    <section
      id="related-games"
      className="border-b border-[#D8CFC6] bg-[#fff7f1]"
    >
      <div className="container py-14">{content}</div>
    </section>
  );
}
