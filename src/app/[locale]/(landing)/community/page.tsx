import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { atlasMaps, getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { CommunityChallengeClient } from '@/shared/blocks/meccha/community-challenge-client';
import { getCanonicalUrl } from '@/shared/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Community 30-Minute Hiding Challenges | Meccha Chameleon';
  const description =
    'Meccha Chameleon community hiding challenges. Players who survived 30 minutes undiscovered and earned the most likes.';
  const canonical = await getCanonicalUrl('/community', locale);
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical,
    },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const galleryPath = getLocalizedPath(locale, '/community/gallery');

  return (
    <main className="container py-12">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AA776E]">Demo</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#29211D] md:text-5xl">
          Community 30-Minute Hiding Challenges
        </h1>
        <p className="mt-3 text-base leading-7 text-[#4C3B35]">
          Players submit screenshots after surviving 30 minutes undiscovered on the official Meccha Chameleon hide and
          seek maps. Submissions are public for this demo. The site agent can remove unsuitable entries. Visit the{' '}
          <a href={galleryPath} className="font-bold underline">
            30 minutes challenges gallery
          </a>{' '}
          to browse every entry and react with likes, dislikes, or emoji prompts that ask authors to expand their story.
        </p>
      </header>
      <CommunityChallengeClient maps={atlasMaps} locale={locale} galleryPath={galleryPath} />
    </main>
  );
}
