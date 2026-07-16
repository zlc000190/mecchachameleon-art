import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getLocalizedPath } from '@/shared/blocks/meccha/meccha-i18n';
import {
  getRelatedGameBySlug,
  relatedGames,
} from '@/shared/blocks/meccha/related-game-data';
import { getCanonicalUrl } from '@/shared/lib/seo';
import { getLocalPage } from '@/shared/models/post';

export const revalidate = 3600;

// Pre-render every related-game slug for faster Google indexing.
export async function generateStaticParams() {
  // Locale-aware: emit a static entry per supported locale + per game slug.
  const locales = ['en', 'zh'];
  return locales.flatMap((locale) =>
    relatedGames.map((game) => ({ locale, slug: [game.slug] }))
  );
}

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

    const fallbackDescription =
      relatedGame.description ??
      `${relatedGame.title} is a free browser-playable hide-and-seek game available right here on mecchachameleon.art. ${relatedGame.note} The embedded iframe loads the full game from ${relatedGame.source}, no install or login required. Click play inside the frame to start a round, and use the controls table below as a quick reference while you learn the mechanics.`;

    const highlightItems =
      relatedGame.highlights && relatedGame.highlights.length > 0
        ? relatedGame.highlights
        : [
            `${relatedGame.source} embedded, instant browser play`,
            'No install or signup — click play and start a round',
            'Full screen and controller support inside the iframe',
            'Works on desktop and mobile browsers',
          ];

    const controlItems =
      relatedGame.controls && relatedGame.controls.length > 0
        ? relatedGame.controls
        : [
            { keys: 'Click play', action: `Start ${relatedGame.title}` },
            { keys: 'WASD / Arrows', action: 'Move around the map' },
            { keys: 'Shift', action: 'Sprint / move quietly (game-specific)' },
            { keys: 'F', action: 'Fullscreen inside the iframe' },
          ];

    const gamepixCdn = (() => {
      const m = relatedGame.iframeSrc.match(/([a-f0-9]{32})/i);
      if (!m) return null;
      return `https://img.gamepix.com/games/h/${m[1]}.jpg`;
    })();

    return (
      <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
        <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
          <div className="container pt-32 pb-12 lg:pt-40">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
                  {relatedGame.source} ·{' '}
                  {locale === 'zh' ? '浏览器小游戏' : 'Browser mini-game'}
                </p>
                <h1 className="max-w-4xl text-4xl leading-tight font-bold tracking-normal md:text-6xl">
                  {relatedGame.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
                  {relatedGame.note}
                </p>
                <p className="mt-4 max-w-3xl rounded-md border border-[#d6b7c0] bg-white/85 px-4 py-3 text-sm leading-6 text-[#4C3B35]">
                  Independent fan-made directory. Embedded titles remain the
                  property of their named providers. This website is not the
                  official MECCHA CHAMELEON website and is not affiliated with
                  lemorion_1224.
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
          <div className="container py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <article className="space-y-6">
                <header>
                  <h2 className="text-2xl font-bold tracking-normal md:text-3xl">
                    {locale === 'zh'
                      ? '怎么玩 / 有什么特色'
                      : 'How to play & what makes it fun'}
                  </h2>
                </header>
                <p className="text-base leading-7 text-[#29211D] md:text-lg">
                  {fallbackDescription}
                </p>

                <div className="grid gap-6 sm:grid-cols-3">
                  <figure className="overflow-hidden rounded-lg border border-[#D8CFC6] bg-white shadow-sm">
                    <div className="relative aspect-[4/3] bg-[#f5e6e0]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relatedGame.image}
                        alt={`${relatedGame.title} gameplay thumbnail`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="bg-white px-3 py-2 text-xs font-semibold text-[#4C3B35]">
                      {locale === 'zh' ? '封面截图' : 'Cover artwork'}
                    </figcaption>
                  </figure>
                  <figure className="overflow-hidden rounded-lg border border-[#D8CFC6] bg-white shadow-sm">
                    <div className="relative aspect-[4/3] bg-[#1f1230]">
                      <div className="absolute inset-0 flex items-center justify-center text-center text-xs font-semibold text-white/80">
                        <div className="px-3">
                          <div className="mb-1 text-[10px] tracking-normal text-[#ff6f9a] uppercase">
                            {locale === 'zh' ? '实时画面' : 'Live gameplay'}
                          </div>
                          <div>
                            {locale === 'zh'
                              ? '上方 iframe = 正在运行的本游戏'
                              : 'The play frame above is this game running live'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <figcaption className="bg-white px-3 py-2 text-xs font-semibold text-[#4C3B35]">
                      {locale === 'zh'
                        ? '实机画面（iframe 上方）'
                        : 'Live frame (above)'}
                    </figcaption>
                  </figure>
                  <figure className="overflow-hidden rounded-lg border border-[#D8CFC6] bg-white shadow-sm">
                    <div className="relative aspect-[4/3] bg-[#f5e6e0]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gamepixCdn ?? relatedGame.image}
                        alt={`${relatedGame.title} source preview`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="bg-white px-3 py-2 text-xs font-semibold text-[#4C3B35]">
                      {locale === 'zh'
                        ? '源站预览'
                        : `${relatedGame.source} preview`}
                    </figcaption>
                  </figure>
                </div>
              </article>

              <aside className="space-y-6">
                <div className="rounded-lg border border-[#D8CFC6] bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold tracking-normal">
                    {locale === 'zh' ? '为什么好玩' : 'Why it’s fun'}
                  </h3>
                  <ul className="space-y-2 text-sm leading-6 text-[#29211D]">
                    {highlightItems.map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-[#ff6f9a]" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-[#D8CFC6] bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold tracking-normal">
                    {locale === 'zh' ? '操作' : 'Controls'}
                  </h3>
                  <ul className="space-y-2 text-sm leading-6 text-[#29211D]">
                    {controlItems.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <kbd className="min-w-[64px] shrink-0 rounded-md bg-[#fff7c8] px-2 py-0.5 text-center text-xs font-bold text-[#29211D]">
                          {c.keys}
                        </kbd>
                        <span>{c.action}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={relatedGame.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
                    >
                      {locale === 'zh'
                        ? '在源站全屏'
                        : `Open on ${relatedGame.source}`}
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-b border-[#D8CFC6] bg-[#fff7f1]">
          <div className="container py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
                  {locale === 'zh' ? '更多浏览器游戏' : 'More browser games'}
                </p>
                <h2 className="text-3xl font-bold tracking-normal">
                  {locale === 'zh' ? '你可能也喜欢' : 'You may also like'}
                </h2>
              </div>
              <a
                href={getLocalizedPath(locale, '/')}
                className="inline-flex min-h-9 items-center rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
              >
                {locale === 'zh' ? '看全部' : 'See all'}
              </a>
            </div>
            <div className="flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
              {alsoLike.map((game) => (
                <a
                  key={game.id}
                  href={getLocalizedPath(locale, `/${game.slug}`)}
                  className="group max-w-[230px] min-w-[230px] snap-start overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[#e0d8c8] transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#ff6f9a]"
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
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pt-10 pb-3">
                      <h3 className="line-clamp-2 text-sm leading-tight font-black text-white drop-shadow">
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
