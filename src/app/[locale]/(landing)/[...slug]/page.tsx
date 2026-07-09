import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getLocalizedPath } from '@/shared/blocks/meccha/meccha-i18n';
import {
  getRelatedGameBySlug,
  relatedGames,
} from '@/shared/blocks/meccha/related-game-data';
import { getLocalPage } from '@/shared/models/post';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

// dynamic page metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // metadata values
  let title = '';
  let description = '';
  let canonicalUrl = '';

  // 1. try to get static page metadata from
  // content/pages/**/*.mdx

  // static page slug
  const staticPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/') || '';

  // filter invalid slug (files with extensions or dev server paths like @vite/client)
  if (staticPageSlug.includes('.') || staticPageSlug.startsWith('@')) {
    return;
  }

  // build canonical url
  canonicalUrl = await getCanonicalUrl(`/${staticPageSlug}`, locale);

  const relatedGame = getRelatedGameBySlug(staticPageSlug);
  if (relatedGame) {
    title = `${relatedGame.title} - Play Online`;
    description = relatedGame.note;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        images: [relatedGame.image],
      },
    };
  }

  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  // return static page metadata
  if (staticPage) {
    title = staticPage.title || '';
    description = staticPage.description || '';

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // 2. static page not found, try to get dynamic page metadata from
  // src/config/locale/messages/{locale}/pages/**/*.json

  // dynamic page slug
  const dynamicPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('.') || '';

  const messageKey = `pages.${dynamicPageSlug}`;
  const t = await getTranslations({ locale, namespace: messageKey });

  // return dynamic page metadata
  if (t.has('metadata')) {
    title = t.raw('metadata.title');
    description = t.raw('metadata.description');

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // 3. return common metadata
  const tc = await getTranslations('common.metadata');

  title = tc('title');
  description = tc('description');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // 1. try to get static page from
  // content/pages/**/*.mdx

  // static page slug
  const staticPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/') || '';

  // filter invalid slug (files with extensions or dev server paths like @vite/client)
  if (staticPageSlug.includes('.') || staticPageSlug.startsWith('@')) {
    return notFound();
  }

  const relatedGame = getRelatedGameBySlug(staticPageSlug);
  if (relatedGame) {
    const alsoLike = relatedGames
      .filter((game) => game.slug !== relatedGame.slug)
      .slice(0, 12);

    return (
      <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
        <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
          <div className="container pt-32 pb-12 lg:pt-40">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
                  {relatedGame.source}
                </p>
                <h1 className="max-w-4xl text-4xl leading-tight font-bold tracking-normal md:text-6xl">
                  {relatedGame.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
                  {relatedGame.note}
                </p>
              </div>
              <a
                href={getLocalizedPath(locale, '/')}
                className="inline-flex min-h-11 w-fit items-center rounded-md border border-[#efc8d3] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
              >
                {locale === 'zh' ? '返回首页' : 'Back home'}
              </a>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-[#1f1230] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
              <div className="border-b border-white/15 bg-white/90 px-4 py-3 text-sm font-semibold text-[#29211D]">
                {relatedGame.title} · {relatedGame.source}
              </div>
              <div className="relative aspect-[16/9] min-h-[650px] w-full bg-black">
                <iframe
                  title={`${relatedGame.title} browser game`}
                  src={relatedGame.iframeSrc}
                  className="absolute inset-0 h-full w-full"
                  loading="eager"
                  allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
                  allowFullScreen
                  scrolling="no"
                  referrerPolicy="origin"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#D8CFC6] bg-[#fff7f1]">
          <div className="container py-12">
            <h2 className="mb-6 text-3xl font-bold tracking-normal">
              {locale === 'zh' ? '你可能也喜欢' : 'You may also like'}
            </h2>
            <div className="flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
              {alsoLike.map((game) => (
                <a
                  key={game.id}
                  href={getLocalizedPath(locale, `/${game.slug}`)}
                  className="group min-w-[230px] max-w-[230px] snap-start overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[#e0d8c8] transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#ff6f9a]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f5e6e0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={game.image}
                      alt={game.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10">
                      <h3 className="line-clamp-2 text-sm font-black leading-tight text-white drop-shadow">
                        {game.title}
                      </h3>
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

  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  // return static page
  if (staticPage) {
    const Page = await getThemePage('static-page');

    return <Page locale={locale} post={staticPage} />;
  }

  // 2. static page not found
  // try to get dynamic page content from
  // src/config/locale/messages/{locale}/pages/**/*.json

  // dynamic page slug
  const dynamicPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('.') || '';

  const messageKey = `pages.${dynamicPageSlug}`;

  try {
    const t = await getTranslations({ locale, namespace: messageKey });

    // return dynamic page
    if (t.has('page')) {
      const Page = await getThemePage('dynamic-page');
      return <Page locale={locale} page={t.raw('page')} />;
    }
  } catch (error) {
    // ignore error if translation not found
    return notFound();
  }

  // 3. page not found
  return notFound();
}
