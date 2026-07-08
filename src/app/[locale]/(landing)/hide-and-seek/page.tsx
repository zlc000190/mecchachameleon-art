import {
  ArrowLeft,
  Brush,
  CheckCircle2,
  EyeOff,
  MapPinned,
  MousePointerClick,
  Search,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const pagePath = '/hide-and-seek';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Meccha Chameleon Hide and Seek - Free Camo Game Online',
    description:
      'Play Meccha Chameleon hide and seek free in your browser. Paint to match surfaces, blend into walls, and outsmart the seeker across 6 official maps.',
  },
  zh: {
    title: 'Meccha Chameleon 捉迷藏 - 免费在线伪装游戏',
    description: '在浏览器中免费玩 Meccha Chameleon 捉迷藏。涂色融入环境、与墙面融合，在 6 张官方地图上智胜搜索者。',
  },
  ru: {
    title: 'Meccha Chameleon Прятки - Бесплатная Игра Камуфляж Онлайн',
    description:
      'Играйте в Meccha Chameleon прятки бесплатно в браузере. Красьтесь под поверхности, сливайтесь со стенами и перехитрите Искателя на 6 официальных картах.',
  },
  es: {
    title: 'Meccha Chameleon Escondite - Juego de Camuflaje Gratis Online',
    description:
      'Juega al escondite de Meccha Chameleon gratis en tu navegador. Píntate para imitar superficies, fusiona con las paredes y vence al Buscador en 6 mapas oficiales.',
  },
  fr: {
    title: 'Meccha Chameleon Cache-Cache - Jeu de Camouflage Gratuit en Ligne',
    description:
      "Jouez à Meccha Chameleon cache-cache gratuitement dans votre navigateur. Peignez-vous pour imiter les surfaces, fondez-vous dans les murs et déjouez le Chercheur sur 6 cartes officielles.",
  },
  ar: {
    title: 'ميتشا تشامليون الغميضة - لعبة تمويه مجانية أونلاين',
    description:
      'العب ميتشا تشامليون لعبة الغميضة مجاناً في متصفحك. لوّن نفسك لتتناسب مع الأسطح، اندمج مع الجدران وتغلب على الباحث في 6 خرائط رسمية.',
  },
  pt: {
    title: 'Meccha Chameleon Esconde-Esconde - Jogo de Camuflagem Grátis Online',
    description:
      'Jogue esconde-esconde do Meccha Chameleon grátis no seu navegador. Pinte-se para combinar com superfícies, misture-se com paredes e vença o Buscador em 6 mapas oficiais.',
  },
  de: {
    title: 'Meccha Chameleon Versteckspiel - Kostenloses Tarn-Spiel Online',
    description:
      'Spiele Meccha Chameleon Versteckspiel kostenlos in deinem Browser. Male dich passend zu Oberflächen, verschmelze mit Wänden und überliste den Sucher auf 6 offiziellen Karten.',
  },
  it: {
    title: 'Meccha Chameleon Nascondino - Gioco di Mimetizzazione Gratuito Online',
    description:
      'Gioca a nascondino di Meccha Chameleon gratis nel tuo browser. Dipingiti per imitare le superfici, confondi con i muri e batti il Cercatore in 6 mappe ufficiali.',
  },
  nl: {
    title: 'Meccha Chameleon Verstopspel - Gratis Camouflagespel Online',
    description:
      'Speel Meccha Chameleon verstopspel gratis in je browser. Verf je om oppervlakken na te bootsen, smelt samen met muren en versla de Zoeker op 6 officiële kaarten.',
  },
  ja: {
    title: 'めっちゃカメレオン かくれんぼ - 無料オンライン カモフラージュゲーム',
    description:
      'ブラウザで「めっちゃカメレオン」かくれんぼを無料でプレイ。色を塗って背景に溶け込み、6つの公式マップで鬼を出し抜こう。',
  },
  ko: {
    title: 'Meccha Chameleon 숨바꼭질 - 무료 온라인 위장 게임',
    description:
      '브라우저에서 Meccha Chameleon 숨바꼭질을 무료로 플레이하세요. 표면에 맞춰 칠하고 벽에 녹아들어 6개의 공식 맵에서 술래를 이기세요.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = metaByLocale[locale] ?? metaByLocale.en;
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);

  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: m.title, description: m.description, url: canonicalUrl },
    twitter: { card: 'summary_large_image', title: m.title, description: m.description },
  };
}

const basics = [
  {
    icon: Users,
    title: 'Two roles per round',
    body: 'Players split into Hiders and Seekers. Hiders paint their body to match the surrounding surface, then freeze. Seekers scan the map and tag the ones they spot.',
  },
  {
    icon: Brush,
    title: 'Paint to match, not to hide',
    body: 'Your edge is the giveaway. Pick a colour close to the wall, floor, or prop behind you, then break the silhouette by matching the patterns around the object.',
  },
  {
    icon: MapPinned,
    title: '6 official maps',
    body: 'Mansion library, indoor country, sewer, Osaka, penguin hotel, and backrooms - each with different surfaces, lighting, and hiding logic.',
  },
];

const tips = [
  'Pick a surface with visual noise (books, posters, wood grain, brick) - blank walls are the first place a Seeker looks.',
  'Match the secondary colour, not just the dominant one. A red brick wall has grey mortar - paint both.',
  'Crouch or lean so your silhouette becomes part of the prop. A standing chameleon on a wall is obvious.',
  'Watch the lighting. If the wall is in shadow, your paint also needs shadow - otherwise you glow in the dark.',
  'Pre-pick your hiding spot during the free-paint phase. Last-second moves are the most spotted.',
  'Listen to footsteps. The Seeker walks slower near suspicious spots - if they slow down, stay frozen.',
  'A good hiding spot answers three questions: similar color, credible posture, and a place the Seeker has no reason to look twice.',
  'Use props. Standing inside a tall bookshelf or behind a stack of boxes gives you a head start even with imperfect camo.',
];

const faqs = [
  {
    q: 'Is hide and seek the same as the main game?',
    a: 'Yes. Hide and seek is the core loop of Meccha Chameleon - you paint, hide, and either survive the round or tag the hiders as the seeker.',
  },
  {
    q: 'How long is one hide and seek round?',
    a: 'Most rounds last 2-3 minutes: a short paint phase, then a seeker hunt. Easy mode gives a longer paint window for new players.',
  },
  {
    q: 'Can I play hide and seek with friends?',
    a: 'Yes. Use the friend room from the in-game menu and share the room code. Free-for-all rounds and seeker-only rounds both work.',
  },
];

export default async function HideAndSeekPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const pageUrl = await getCanonicalUrl(pagePath, locale);
  const backHref = getLocalizedPath(locale, '/#play');

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: homeUrl },
          { name: 'Meccha Chameleon Hide and Seek', item: pageUrl },
        ]}
      />

      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-28 pb-10 lg:pt-36">
          <a
            href={backHref}
            className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home game
          </a>

          <div className="mb-6 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
              Hide and seek, browser version
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Meccha Chameleon Hide and Seek
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
              Paint, hide, and survive the seeker. The hide and seek version of Meccha Chameleon runs in your browser - no download, free to play, and built for paint-and-hide matches across 6 official maps.
            </p>
          </div>

          <DemoFrame locale={locale} />
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container py-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">How the round works</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">The hide and seek loop, in three steps</h2>
            <p className="mt-4 text-sm leading-6 text-[#4C3B35]">
              Meccha Chameleon is a paint-and-hide game. Each round runs the same way whether you play solo, with friends, or in a public room.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {basics.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
                  <Icon className="mb-4 h-5 w-5 text-[#AA776E]" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA]">
        <div className="container py-14">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Hider tips</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">8 tips to out-camo the seeker</h2>
            <p className="mt-4 text-sm leading-6 text-[#4C3B35]">
              Hiding is about colour, posture, and noise - not just dark corners. These tips come from rounds where the seeker walked past three times.
            </p>
          </div>

          <ol className="grid gap-3 md:grid-cols-2">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 rounded-md border border-[#D8CFC6] bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#ff6f9a] text-xs font-bold text-white">{idx + 1}</span>
                <p className="pt-0.5 text-sm leading-6 text-[#4C3B35]">{tip}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Hide and seek FAQ</p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">Hide and seek, answered</h2>
            </div>
            <a
              href={getLocalizedPath(locale, '/maps')}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]"
            >
              <MousePointerClick className="h-4 w-4" />
              Open map guide
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5">
                <CheckCircle2 className="mb-4 h-5 w-5 text-[#61a8ff]" />
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Need the unblocked version?</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">The same hide and seek loop, opened in a normal browser tab without a VPN. Works on school and work networks.</p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/unblocked')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <EyeOff className="h-4 w-4" />
                  Unblocked
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Want a quick single-map test?</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">Try the free demo first. Same hide and seek mechanics, just on one map with a shorter round.</p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/demo')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Search className="h-4 w-4" />
                  Free demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
