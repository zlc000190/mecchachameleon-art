import type { Metadata } from 'next';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Gamepad2,
  MapPinned,
  MousePointerClick,
  Users,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const pagePath = '/meccha-chameleon-online';

// 12 locale metadata (Batch 1+ 强化) - title/description localized to match locale intent
const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Meccha Chameleon Online - Play Free, No Download',
    description:
      'Play Meccha Chameleon online for free in your browser. No download, no install, quick start hide-and-seek gameplay with maps, tips, and friend-room help.',
  },
  zh: {
    title: 'Meccha Chameleon 在线玩 - 免费浏览器游戏',
    description:
      '在浏览器中免费玩 Meccha Chameleon。无需下载、无需安装、快速开始捉迷藏游戏，包含地图、技巧和好友房间。',
  },
  ru: {
    title: 'Meccha Chameleon Онлайн - Бесплатная Браузерная Игра',
    description:
      'Играйте в Meccha Chameleon онлайн бесплатно в браузере. Без скачивания, без установки, быстрый старт игры в прятки с картами, советами и комнатами с друзьями.',
  },
  es: {
    title: 'Meccha Chameleon Online - Juega Gratis Sin Descargar',
    description:
      'Juega a Meccha Chameleon online gratis en tu navegador. Sin descarga, sin instalación, inicio rápido del escondite con mapas, consejos y salas con amigos.',
  },
  fr: {
    title: 'Meccha Chameleon en Ligne - Gratuit Sans Téléchargement',
    description:
      'Jouez à Meccha Chameleon en ligne gratuitement dans votre navigateur. Sans téléchargement, sans installation, démarrage rapide du cache-cache avec cartes, astuces et salles entre amis.',
  },
  ar: {
    title: 'ميتشا تشامليون أونلاين - العب مجاناً بدون تنزيل',
    description:
      'العب ميتشا تشامليون أونلاين مجاناً في متصفحك. بدون تنزيل، بدون تثبيت، بداية سريعة للعبة الغميضة مع الخرائط والنصائح وغرف الأصدقاء.',
  },
  pt: {
    title: 'Meccha Chameleon Online - Jogue Grátis Sem Download',
    description:
      'Jogue Meccha Chameleon online grátis no seu navegador. Sem download, sem instalação, início rápido do esconde-esconde com mapas, dicas e salas com amigos.',
  },
  de: {
    title: 'Meccha Chameleon Online - Kostenlos Ohne Download',
    description:
      'Spiele Meccha Chameleon online kostenlos in deinem Browser. Kein Download, keine Installation, schneller Start ins Versteckspiel mit Karten, Tipps und Freundesräumen.',
  },
  it: {
    title: 'Meccha Chameleon Online - Gioca Gratis Senza Download',
    description:
      'Gioca a Meccha Chameleon online gratis nel tuo browser. Senza download, senza installazione, avvio rapido del nascondino con mappe, consigli e stanze con amici.',
  },
  nl: {
    title: 'Meccha Chameleon Online - Gratis Spelen Zonder Download',
    description:
      'Speel Meccha Chameleon online gratis in je browser. Geen download, geen installatie, snelle start van het verstopspel met kaarten, tips en vriendenkamers.',
  },
  ja: {
    title: 'めっちゃカメレオン オンライン - 無料ダウンロード不要',
    description:
      'ブラウザで「めっちゃカメレオン」を無料でオンラインプレイ。ダウンロード不要、インストール不要、マップ・コツ・フレンドルーム付きのかくれんぼ。',
  },
  ko: {
    title: 'Meccha Chameleon 온라인 - 무료 다운로드 불필요',
    description:
      '브라우저에서 Meccha Chameleon을 무료로 온라인 플레이하세요. 다운로드, 설치 필요 없음, 지도, 팁, 친구 방이 있는 숨바꼭질 게임 빠른 시작.',
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
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
  };
}

const benefits = [
  {
    icon: Gamepad2,
    title: 'Clearly labeled browser option',
    body: 'The browser title is a separate fan-made game. Its provider and unofficial status are displayed before you play.',
  },
  {
    icon: Download,
    title: 'Official PC game stays separate',
    body: 'The official MECCHA CHAMELEON by lemorion_1224 is a paid Windows PC game distributed through Steam.',
  },
  {
    icon: MapPinned,
    title: 'Maps and hiding help nearby',
    body: 'Keep the map atlas, hiding-spot notes, and beginner guide one click away while you test camo spots and learn the flow.',
  },
];

const steps = [
  'Press the Play button or click inside the game frame.',
  'Use Easy mode first if you want the fastest browser start.',
  'Open the map atlas after a round to find better hiding spots.',
  'Share the page with friends when you want a low-friction group start.',
];

const faqs = [
  {
    q: 'Can I play the official MECCHA CHAMELEON online for free?',
    a: 'No official free browser edition is currently listed by the developer. The official game is the paid Windows PC release on Steam. The browser title on this page is separate and fan-made.',
  },
  {
    q: 'Do I need to download Meccha Chameleon?',
    a: 'The official game is installed through Steam. A separate fan-made browser title can be tried without downloading, but it is not the official game.',
  },
  {
    q: 'Is this the official Meccha Chameleon game?',
    a: 'No. This is an independent fan guide. The browser title comes from chameleon-game.com and is not affiliated with lemorion_1224.',
  },
];

export default async function MecchaChameleonOnlinePage({
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
          { name: 'Meccha Chameleon Online', item: pageUrl },
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
            <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              Official-versus-fan-made guide
            </p>
            <h1 className="text-4xl leading-tight font-bold tracking-normal md:text-6xl">
              MECCHA CHAMELEON: official PC game and browser alternatives
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
              The official MECCHA CHAMELEON is a paid Windows PC game by
              lemorion_1224 on Steam. The play frame below is a separate,
              fan-made browser title from chameleon-game.com. It is provided as
              an attributed alternative, not as the official game.
            </p>
          </div>

          <DemoFrame locale={locale} />
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container grid gap-4 py-12 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5"
              >
                <Icon className="mb-4 h-5 w-5 text-[#AA776E]" />
                <h2 className="text-lg font-semibold">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                  {benefit.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA]">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              Quick start
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              Start playing before the bounce happens.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#4C3B35]">
              This page is built for players who searched for meccha chameleon
              online, mecha chameleon game, or play Meccha Chameleon free and
              want the game first.
            </p>
          </div>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-md border border-[#D8CFC6] bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#ff6f9a] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-[#4C3B35]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
                Player answers
              </p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                Free online play FAQ
              </h2>
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
              <div
                key={faq.q}
                className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5"
              >
                <CheckCircle2 className="mb-4 h-5 w-5 text-[#61a8ff]" />
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold">
                  Want a smoother friend-room start?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                  Use the beginner guide, map atlas, and Play Kit after your
                  first online round so friends spend less time setting up and
                  more time hiding.
                </p>
              </div>
              <a
                href={getLocalizedPath(locale, '/new-player')}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
              >
                <Users className="h-4 w-4" />
                New player guide
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related play pages - SEO internal linking (Batch 1+ addition) */}
      <section className="border-t border-[#D8CFC6] bg-[#FFF9F5]">
        <div className="container py-12">
          <div className="mb-6 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              More ways to play
            </p>
            <h2 className="text-2xl font-bold tracking-normal md:text-3xl">
              Related play pages
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href={getLocalizedPath(locale, '/unblocked')}
              className="rounded-md border border-[#D8CFC6] bg-white p-5 transition hover:bg-[#fff7c8]"
            >
              <h3 className="font-semibold">Play Meccha Chameleon Unblocked</h3>
              <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                The same game, opened in a normal browser tab without a VPN.
                Works on school, work, and library networks.
              </p>
            </a>
            <a
              href={getLocalizedPath(locale, '/hide-and-seek')}
              className="rounded-md border border-[#D8CFC6] bg-white p-5 transition hover:bg-[#fff7c8]"
            >
              <h3 className="font-semibold">Meccha Chameleon Hide and Seek</h3>
              <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                Paint, hide, and survive the seeker across 6 official maps. Pro
                tips, map guides, and 8 hider strategies.
              </p>
            </a>
            <a
              href={getLocalizedPath(locale, '/demo')}
              className="rounded-md border border-[#D8CFC6] bg-white p-5 transition hover:bg-[#fff7c8]"
            >
              <h3 className="font-semibold">Meccha Chameleon Free Demo</h3>
              <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                Try the paint-and-hide loop in your browser before bringing
                friends in. One map, full mechanics, no signup.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
