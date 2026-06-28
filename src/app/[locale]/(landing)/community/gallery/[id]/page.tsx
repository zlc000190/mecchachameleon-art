import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { CommunityGalleryDetailClient } from '@/shared/blocks/meccha/community-gallery-detail-client';
import {
  challengesWithDemo,
  type CommunityChallenge,
} from '@/shared/blocks/meccha/community-challenges';
import { readCommunityChallenges } from '@/shared/blocks/meccha/community-store';
import { envConfigs } from '@/config';
import { locales as allLocales } from '@/config/locale';

export const revalidate = 0;

async function loadChallenge(id: string): Promise<CommunityChallenge | null> {
  try {
    const stored = await readCommunityChallenges();
    const match = challengesWithDemo(stored).find((challenge) => challenge.id === id);
    if (!match) return null;
    const { ownerToken: _omitted, ...rest } = match;
    return rest;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const challenge = await loadChallenge(id);
  if (!challenge) {
    return {
      title: 'Challenge not found | Meccha Chameleon',
      // 404 challenges stay noindex (don't want Google to index errors).
      robots: { index: false, follow: false },
    };
  }
  const title = `${challenge.title} — 30-Minute Hiding Challenge`;
  const description = challenge.description.slice(0, 200);
  // Single canonical URL: all locale-prefixed /<locale>/community/gallery/<id>
  // requests are 301'd by the proxy to /community/gallery/<id>. hreflang
  // alternates below tell Google about every locale variant even though
  // they all serve the same English page.
  const canonical = `${envConfigs.app_url}/community/gallery/${id}`;
  const languages: Record<string, string> = {};
  for (const loc of allLocales) {
    languages[loc] = `${envConfigs.app_url}/community/gallery/${id}`;
  }
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [challenge.screenshotUrl],
    },
  };
}

export default async function CommunityGalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const challenge = await loadChallenge(id);
  if (!challenge) {
    notFound();
  }

  const galleryPath = getLocalizedPath(locale, '/community/gallery');

  return (
    <main className="container py-12">
      <header className="mb-6">
        <Link
          href={galleryPath}
          className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-3 py-2 text-sm font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
        >
          ← Back to gallery
        </Link>
      </header>
      <CommunityGalleryDetailClient initialChallenge={challenge} galleryPath={galleryPath} />
    </main>
  );
}