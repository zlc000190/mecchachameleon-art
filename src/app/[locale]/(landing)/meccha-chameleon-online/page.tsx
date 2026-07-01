import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Gamepad2,
  MapPinned,
  MousePointerClick,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const pagePath = '/meccha-chameleon-online';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Meccha Chameleon Online - Play Free, No Download';
  const description =
    'Play Meccha Chameleon online for free in your browser. No download, no install, quick start hide-and-seek gameplay with maps, tips, and friend-room help.';
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const benefits = [
  {
    icon: Gamepad2,
    title: 'Play instantly',
    body: 'The Easy game source loads on the page so players can start the Mecha Chameleon style hide-and-seek loop without hunting for a separate download.',
  },
  {
    icon: Download,
    title: 'Free, no download',
    body: 'Use the browser version first. No installer, no signup wall, and no extra app is needed for a quick Meccha Chameleon online session.',
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
    q: 'Can I play Meccha Chameleon online for free?',
    a: 'Yes. This page gives you a browser play window for a quick free Meccha Chameleon online session, with no download required.',
  },
  {
    q: 'Do I need to download Meccha Chameleon?',
    a: 'No download is needed to try the online browser version here. If you later want the full PC experience, use this page as a quick test before installing anything.',
  },
  {
    q: 'Is this the official Meccha Chameleon game?',
    a: 'This is a fan-made play hub with a browser game source, map help, and player notes. It is built for people searching Meccha Chameleon online or Mecha Chameleon game online.',
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
              Free browser game
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Meccha Chameleon Online
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">
              Play Meccha Chameleon online for free in your browser. No
              download, no install, and no slow setup - just open the game,
              test the hide-and-seek loop, then use the map guide when you want
              better hiding spots.
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
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
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                  {faq.a}
                </p>
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
    </main>
  );
}
