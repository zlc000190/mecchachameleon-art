import {
  ArrowLeft,
  CheckCircle2,
  Gamepad2,
  Globe,
  MousePointerClick,
  School,
  Shield,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const pagePath = '/unblocked';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Play Meccha Chameleon Unblocked - Free Browser Game',
    description:
      'Play Meccha Chameleon unblocked in your browser. No download, no VPN, no install - works at school, work, or anywhere games are restricted.',
  },
  zh: {
    title: 'Meccha Chameleon 无限制版 - 免费浏览器游戏',
    description: '在浏览器中无限制畅玩 Meccha Chameleon。无需下载、无需 VPN、无需安装 - 在学校、公司或任何受限网络都能玩。',
  },
  ru: {
    title: 'Meccha Chameleon Без Блокировки - Бесплатная Браузерная Игра',
    description:
      'Играйте в Meccha Chameleon без блокировки прямо в браузере. Без скачивания, без VPN, без установки - работает в школе, на работе и везде, где заблокированы игры.',
  },
  es: {
    title: 'Jugar Meccha Chameleon Sin Bloqueos - Juego de Navegador Gratis',
    description:
      'Juega a Meccha Chameleon sin bloqueos en tu navegador. Sin descarga, sin VPN, sin instalación - funciona en la escuela, el trabajo o donde sea.',
  },
  fr: {
    title: 'Jouer à Meccha Chameleon Sans Blocage - Jeu Navigateur Gratuit',
    description:
      "Jouez à Meccha Chameleon sans blocage dans votre navigateur. Sans téléchargement, sans VPN, sans installation - fonctionne à l'école, au travail ou partout.",
  },
  ar: {
    title: 'العب ميتشا تشامليون بدون قيود - لعبة متصفح مجانية',
    description:
      'العب ميتشا تشامليون بدون قيود في متصفحك. بدون تنزيل، بدون VPN، بدون تثبيت - تعمل في المدرسة، العمل أو أي مكان محظور.',
  },
  pt: {
    title: 'Jogar Meccha Chameleon Sem Bloqueio - Jogo de Navegador Grátis',
    description:
      'Jogue Meccha Chameleon sem bloqueio no seu navegador. Sem download, sem VPN, sem instalação - funciona na escola, trabalho ou qualquer lugar.',
  },
  de: {
    title: 'Meccha Chameleon Ungesperrt Spielen - Kostenloses Browserspiel',
    description:
      'Spiele Meccha Chameleon ungesperrt in deinem Browser. Kein Download, kein VPN, keine Installation - funktioniert in der Schule, bei der Arbeit und überall.',
  },
  it: {
    title: 'Gioca a Meccha Chameleon Senza Blocchi - Gioco Browser Gratuito',
    description:
      'Gioca a Meccha Chameleon senza blocchi nel tuo browser. Senza download, senza VPN, senza installazione - funziona a scuola, al lavoro o ovunque.',
  },
  nl: {
    title: 'Meccha Chameleon Gedeblokkeerd Spelen - Gratis Browserspel',
    description:
      'Speel Meccha Chameleon gedeblokkeerd in je browser. Geen download, geen VPN, geen installatie - werkt op school, werk of overal.',
  },
  ja: {
    title: 'めっちゃカメレオン ブロック解除 - 無料ブラウザゲーム',
    description:
      'ブラウザでめっちゃカメレオンをブロック解除でプレイ。ダウンロード不要、VPN不要、インストール不要 - 学校、職場、どこでも遊べます。',
  },
  ko: {
    title: 'Meccha Chameleon 차단 해제 - 무료 브라우저 게임',
    description:
      '브라우저에서 Meccha Chameleon을 차단 해제하고 플레이하세요. 다운로드, VPN, 설치 필요 없음 - 학교, 직장, 어디서나 작동합니다.',
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

const benefits = [
  {
    icon: School,
    title: 'Works at school',
    body: 'Browser-based gameplay runs on regular school networks without triggering most game-block filters. No download, no admin install required.',
  },
  {
    icon: Shield,
    title: 'No VPN, no proxy',
    body: 'Skip the slowdown of a school or work VPN. The game opens directly in your browser tab through standard HTTPS traffic.',
  },
  {
    icon: Globe,
    title: 'Works on any device',
    body: 'Play on a school Chromebook, library PC, work laptop, or personal phone. If it has a browser, it can run the hide-and-seek loop.',
  },
];

const steps = [
  'Open this page in your browser (Chrome, Edge, Safari, or Firefox).',
  'Click the Play button to start a hide-and-seek round inside the game frame.',
  'Use Easy mode if your school or office network is slower than usual.',
  'Bookmark this URL so you can come back during breaks and free periods.',
];

const faqs = [
  {
    q: 'Is Meccha Chameleon really unblocked?',
    a: 'It runs in a normal browser tab over HTTPS, so it works on most networks where standard websites load. Network filters vary, but browser-based play is the most reliable unblocked option we know of.',
  },
  {
    q: 'Do I need a VPN or proxy to play?',
    a: 'No. The game opens directly in your browser without a VPN, proxy, or download. If your network blocks browser games specifically, you may need to wait until you are on an open network.',
  },
  {
    q: 'Can I play on a school Chromebook?',
    a: 'Yes. Open the URL in the Chrome browser, click Play, and you are in a round within a few seconds. No extension or admin permission is needed.',
  },
];

export default async function UnblockedPage({
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
          { name: 'Meccha Chameleon Unblocked', item: pageUrl },
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
              Unblocked browser game
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Play Meccha Chameleon Unblocked
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
              Open this page in any browser and start a Meccha Chameleon round in seconds - no download, no VPN, no admin install. Works on school, work, and library networks where most game sites are blocked.
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
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{benefit.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA]">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">How to start</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">Open the page, click play, hide.</h2>
            <p className="mt-4 text-sm leading-6 text-[#4C3B35]">
              This unblocked version is built for people searching "Meccha Chameleon unblocked" or "chameleon unblocked games" from a school or work computer. There is nothing to install.
            </p>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-md border border-[#D8CFC6] bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#ff6f9a] text-sm font-bold text-white">{index + 1}</span>
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Unblocked play FAQ</p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">Free unblocked play FAQ</h2>
            </div>
            <a
              href={getLocalizedPath(locale, '/meccha-chameleon-online')}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]"
            >
              <MousePointerClick className="h-4 w-4" />
              Play online version
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
                  <h3 className="font-semibold">Hide & seek on the same page</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">Looking for the paint-and-hide version? The hide and seek mode is built into the same browser tab.</p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/hide-and-seek')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Users className="h-4 w-4" />
                  Hide and seek
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Try the free demo first</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">Want to test a short round before bringing friends in? The demo is the same browser play, just on a single map.</p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/demo')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Gamepad2 className="h-4 w-4" />
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
