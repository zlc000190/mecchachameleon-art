'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ChevronDown, Heart, MessageCircleWarning } from 'lucide-react';

import {
  COMMUNITY_R2_PUBLIC_DOMAIN,
  totalPromptCount,
  type CommunityChallenge,
} from '@/shared/blocks/meccha/community-challenges';

type SortKey = 'top' | 'newest' | 'prompts';

type Runtime = { kvConfigured: boolean; r2Configured: boolean } | null;

export function CommunityGalleryListClient({
  initialChallenges,
  detailPathBase,
  submitPath,
  runtime,
}: {
  initialChallenges: CommunityChallenge[];
  detailPathBase: string;
  submitPath: string;
  runtime: Runtime;
}) {
  const [challenges] = useState<CommunityChallenge[]>(initialChallenges);
  const [sort, setSort] = useState<SortKey>('top');
  const [mapFilter, setMapFilter] = useState<string>('all');

  const mapOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const challenge of challenges) {
      if (!seen.has(challenge.mapSlug)) {
        seen.set(challenge.mapSlug, challenge.mapName);
      }
    }
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
  }, [challenges]);

  const visible = useMemo(() => {
    const filtered =
      mapFilter === 'all'
        ? challenges
        : challenges.filter((challenge) => challenge.mapSlug === mapFilter);
    const sorted = [...filtered];
    if (sort === 'newest') {
      sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    } else if (sort === 'prompts') {
      sorted.sort(
        (a, b) =>
          totalPromptCount(b.expansionPrompts) - totalPromptCount(a.expansionPrompts) ||
          b.likes - a.likes,
      );
    } else {
      sorted.sort(
        (a, b) =>
          b.likes - a.likes ||
          totalPromptCount(b.expansionPrompts) - totalPromptCount(a.expansionPrompts),
      );
    }
    return sorted;
  }, [challenges, mapFilter, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8D7CC] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2 font-bold text-[#29211D]">
            Sort
            <span className="relative inline-flex items-center">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="appearance-none rounded-md border border-[#D8CFC6] bg-white py-2 pl-3 pr-9 text-sm font-bold text-[#29211D]"
              >
                <option value="top">Most liked</option>
                <option value="prompts">Most requested stories</option>
                <option value="newest">Newest first</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-[#7D6D69]" />
            </span>
          </label>
          <label className="inline-flex items-center gap-2 font-bold text-[#29211D]">
            Map
            <span className="relative inline-flex items-center">
              <select
                value={mapFilter}
                onChange={(event) => setMapFilter(event.target.value)}
                className="appearance-none rounded-md border border-[#D8CFC6] bg-white py-2 pl-3 pr-9 text-sm font-bold text-[#29211D]"
              >
                <option value="all">All maps</option>
                {mapOptions.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-[#7D6D69]" />
            </span>
          </label>
        </div>
        <Link
          href={submitPath}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#29211D] px-4 py-2 text-sm font-black text-white transition hover:bg-[#4C3B35]"
        >
          Submit your challenge
        </Link>
      </div>

      {runtime && (!runtime.kvConfigured || !runtime.r2Configured) ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
          Runtime needs Cloudflare envs before real uploads work. Until then, gallery contents may only include the
          built-in demo card.
        </p>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8CFC6] bg-white p-8 text-center">
          <p className="text-base font-black text-[#29211D]">No challenges in this filter yet</p>
          <p className="mt-2 text-sm text-[#4C3B35]">
            Be the first to upload a 30-minute hiding win. New entries appear here immediately.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((challenge) => (
            <Link
              key={challenge.id}
              href={`${detailPathBase}/${challenge.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8D7CC] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#29211D]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF7F1]">
                <Image
                  src={challenge.screenshotUrl}
                  alt={challenge.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                />
                {challenge.images.length > 1 ? (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white">
                    +{challenge.images.length - 1} more
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="line-clamp-2 text-lg font-black text-[#29211D]">{challenge.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#4C3B35]">{challenge.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#29211D]">
                  <span>{challenge.mapName}</span>
                  <span>·</span>
                  <span>{challenge.minutesHidden}+ min</span>
                  <span>·</span>
                  <span>by {challenge.playerName}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 text-xs font-bold text-[#29211D]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD7E1] px-3 py-1 text-[#FF6F9A]">
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    {challenge.likes.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1CC] px-3 py-1 text-[#7A5A1A]">
                    <MessageCircleWarning className="h-3.5 w-3.5" />
                    {totalPromptCount(challenge.expansionPrompts)} prompts
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F0FF] px-3 py-1 text-[#1B4E89]">
                    {challenge.dislikes.toLocaleString()} 👎
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="text-[11px] leading-5 text-[#7D6D69]">
        Gallery content is stored in R2 bucket{' '}
        <a className="underline" href={`${COMMUNITY_R2_PUBLIC_DOMAIN}/`} target="_blank" rel="noopener noreferrer">
          mecchachameleon-art-community
        </a>
        .
      </p>
    </div>
  );
}