import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';

import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { CommunityGalleryListClient } from '@/shared/blocks/meccha/community-gallery-list-client';
import {
  challengesWithDemo,
  type CommunityChallenge,
} from '@/shared/blocks/meccha/community-challenges';
import { envConfigs } from '@/config';
import { locales as allLocales } from '@/config/locale';

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const title = '30-Minute Hiding Challenges Gallery | Meccha Chameleon';
  const description =
    'Browse every Meccha Chameleon 30-minute hiding challenge screenshot. Like, dislike, or send an emoji prompt to ask the author for the full story.';
  // Single canonical URL: all locale-prefixed /<locale>/community/gallery
  // requests are 301'd by the proxy to /community/gallery. hreflang
  // alternates below tell Google about every locale variant even though
  // they all serve the same English page.
  const canonical = `${envConfigs.app_url}/community/gallery`;
  const languages: Record<string, string> = {};
  for (const loc of allLocales) {
    languages[loc] = `${envConfigs.app_url}/community/gallery`;
  }
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: { title, description, type: 'website' },
  };
}

async function loadChallenges(): Promise<{
  challenges: CommunityChallenge[];
  runtime: { kvConfigured: boolean; r2Configured: boolean } | null;
}> {
  try {
    const { readCommunityChallenges, getCommunityRuntimeStatus } = await import(
      '@/shared/blocks/meccha/community-store'
    );
    const stored = await readCommunityChallenges();
    return {
      challenges: challengesWithDemo(stored).map((challenge) => {
        const { ownerToken: _omitted, ...rest } = challenge;
        return rest;
      }),
      runtime: getCommunityRuntimeStatus(),
    };
  } catch {
    return { challenges: challengesWithDemo([]), runtime: null };
  }
}

export default async function CommunityGalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { challenges, runtime } = await loadChallenges();
  const backToCommunity = getLocalizedPath(locale, '/community');
  const detailPathBase = getLocalizedPath(locale, '/community/gallery');

  return (
    <main className="container py-12">
      <header className="mb-8 max-w-3xl">
        <Link
          href={backToCommunity}
          className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-3 py-2 text-sm font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
        >
          ← Back to community
        </Link>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AA776E]">Gallery</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#29211D] md:text-5xl">
          30 Minutes Challenges Gallery
        </h1>
        <p className="mt-3 text-base leading-7 text-[#4C3B35]">
          Every approved 30-minute hiding challenge submitted by the Meccha Chameleon community. Tap a card to see
          the full image set, react with a like or dislike, ask the author for the full story with an emoji prompt,
          or — if you submitted it — log in to edit your story and upload more screenshots.
        </p>
      </header>
      <CommunityGalleryListClient
        initialChallenges={challenges}
        detailPathBase={detailPathBase}
        submitPath={backToCommunity}
        runtime={runtime}
      />
    </main>
  );
}