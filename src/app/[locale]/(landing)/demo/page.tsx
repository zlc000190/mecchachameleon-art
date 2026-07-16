import type { Metadata } from 'next';
import {
  ArrowLeft,
  CheckCircle2,
  Gamepad2,
  Layers,
  MousePointerClick,
  Sparkles,
  Timer,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const pagePath = '/demo';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Meccha Chameleon Free Demo - Try In Browser',
    description:
      'Try the Meccha Chameleon free demo in your browser. One map, full mechanics, no signup, no install - see if the paint-and-hide loop is for you.',
  },
  zh: {
    title: 'Meccha Chameleon 免费试玩 - 浏览器直接玩',
    description:
      '在浏览器中免费试玩 Meccha Chameleon。一张地图、完整机制、无需注册、无需安装 - 先看看这个涂色躲藏游戏适不适合你。',
  },
  ru: {
    title: 'Meccha Chameleon Бесплатная Демо - Попробуйте в Браузере',
    description:
      'Попробуйте бесплатную демо Meccha Chameleon в браузере. Одна карта, полная механика, без регистрации и установки - посмотрите, подходит ли вам петля "крась-прячься".',
  },
  es: {
    title: 'Demo Gratis de Meccha Chameleon - Prueba en el Navegador',
    description:
      'Prueba la demo gratis de Meccha Chameleon en tu navegador. Un mapa, mecánicas completas, sin registro, sin instalación - comprueba si el bucle de pintar y esconderse es para ti.',
  },
  fr: {
    title: 'Démo Gratuite Meccha Chameleon - Essayez dans le Navigateur',
    description:
      'Essayez la démo gratuite de Meccha Chameleon dans votre navigateur. Une carte, mécaniques complètes, sans inscription, sans installation.',
  },
  ar: {
    title: 'تجربة مجانية لميتشا تشامليون - جرب في المتصفح',
    description:
      'جرب النسخة التجريبية المجانية من ميتشا تشامليون في متصفحك. خريطة واحدة، آليات كاملة، بدون تسجيل، بدون تثبيت.',
  },
  pt: {
    title: 'Demo Grátis do Meccha Chameleon - Teste no Navegador',
    description:
      'Teste a demo grátis do Meccha Chameleon no seu navegador. Um mapa, mecânicas completas, sem cadastro, sem instalação.',
  },
  de: {
    title: 'Meccha Chameleon Kostenlose Demo - Im Browser Testen',
    description:
      'Teste die kostenlose Demo von Meccha Chameleon in deinem Browser. Eine Karte, volle Mechanik, keine Anmeldung, keine Installation.',
  },
  it: {
    title: 'Demo Gratuita Meccha Chameleon - Prova nel Browser',
    description:
      'Prova la demo gratuita di Meccha Chameleon nel tuo browser. Una mappa, meccaniche complete, senza registrazione, senza installazione.',
  },
  nl: {
    title: 'Meccha Chameleon Gratis Demo - Probeer in Browser',
    description:
      'Probeer de gratis demo van Meccha Chameleon in je browser. Eén kaart, volledige mechaniek, geen registratie, geen installatie.',
  },
  ja: {
    title: 'めっちゃカメレオン 無料デモ - ブラウザで体験',
    description:
      'ブラウザで「めっちゃカメレオン」無料デモを体験。1つのマップ、全メカニクス、登録不要、インストール不要。',
  },
  ko: {
    title: 'Meccha Chameleon 무료 데모 - 브라우저에서 체험',
    description:
      '브라우저에서 Meccha Chameleon 무료 데모를 체험하세요. 한 개 맵, 전체 메커니즘, 가입 없음, 설치 없음.',
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
    icon: Timer,
    title: 'Separate fan-made title',
    body: 'This browser experience comes from chameleon-game.com and is not the official MECCHA CHAMELEON release.',
  },
  {
    icon: Layers,
    title: 'Browser-based camouflage play',
    body: 'Try the provider’s paint-and-hide interpretation without confusing it with the paid Windows PC game on Steam.',
  },
  {
    icon: Sparkles,
    title: 'No signup, no email',
    body: 'Click Play and you are in. The demo does not ask for an account, an email, or a credit card.',
  },
];

const faqs = [
  {
    q: 'Is this an official MECCHA CHAMELEON demo?',
    a: 'No. It is a separate fan-made browser title from chameleon-game.com. The official paid PC game is made and published by lemorion_1224.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. The demo opens in your browser. There is no installer, no admin permission, and no separate launcher to download.',
  },
  {
    q: 'Where do I get the official game?',
    a: 'Use the official MECCHA CHAMELEON Steam store page for the current price, system requirements, and purchase options.',
  },
];

export default async function DemoPage({
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
          { name: 'Meccha Chameleon Demo', item: pageUrl },
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
              Unofficial browser alternative
            </p>
            <h1 className="text-4xl leading-tight font-bold tracking-normal md:text-6xl">
              Fan-made Chameleon Browser Game
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
              Try a separately operated fan-made paint-and-hide game in your
              browser. It is not a demo, port, or free edition of the official
              MECCHA CHAMELEON PC game.
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

      <section className="bg-white">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
                Demo FAQ
              </p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                Demo questions, answered
              </h2>
            </div>
            <a
              href={getLocalizedPath(locale, '/meccha-chameleon-online')}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]"
            >
              <MousePointerClick className="h-4 w-4" />
              Compare official and browser versions
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

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">
                    Liked the demo? Try the full version.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                    The full online build has 6 maps, friend rooms, and the
                    unblocked browser play that schools and offices allow.
                  </p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/unblocked')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Unblocked full game
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">New to hide and seek?</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                    Read the hide and seek guide first - it covers the basics of
                    paint, posture, and picking a good surface.
                  </p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/hide-and-seek')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Hide and seek guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
