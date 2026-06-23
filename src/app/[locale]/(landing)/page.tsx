import {
  BadgeInfo,
  BookOpen,
  Brush,
  ExternalLink,
  Gamepad2,
  type LucideIcon,
  MapPinned,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';

import { AtlasPreview } from '@/shared/blocks/meccha/atlas-preview';
import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { HowToPlaySection } from '@/shared/blocks/meccha/how-to-play-section';
import { KeywordSection } from '@/shared/blocks/meccha/keyword-section';
import { UpdatesSection } from '@/shared/blocks/meccha/updates-section';

const steamUrl = 'https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/';

function getPaths(locale: string) {
  return [
    {
      icon: BadgeInfo,
      title: 'New to the game',
      copy: 'Understand the Steam game, platforms, price, and the basic hide-and-seek loop before you download.',
      href: getLocalizedPath(locale, '/new-player'),
    },
    {
      icon: Brush,
      title: 'Help me hide better',
      copy: 'Use camo ideas, color cues, pose notes, and map spots once you already know the rules.',
      href: '#atlas',
  },
  {
    icon: MonitorSmartphone,
    title: 'Playing on PC',
    copy: 'Keep this page open on your phone as a fast second-screen guide during real matches.',
    href: '#second-screen',
  },
  ];
}

const faqs = [
  {
    q: 'Is this the official Meccha Chameleon game?',
    a: 'No. The browser demo is a third-party hide-and-seek mini game used to explain a similar idea. The official Meccha Chameleon game is sold on Steam.',
  },
  {
    q: 'Why use a simple demo instead of a full clone?',
    a: 'A clone would be slow to build and easy to mislead players. The demo is only a quick onboarding layer; the real value is the Steam guide, camo lab, and map atlas.',
  },
  {
    q: 'What platform is the real game on?',
    a: 'The official listing is a Steam PC game. This site is best used as a browser guide on desktop or as a phone second screen while playing on PC.',
  },
  {
    q: 'What comes after this first version?',
    a: 'The next build should connect the 50 captured hiding spots, add color-matching cards, and make map pages indexable for long-tail search.',
  },
];

const secondScreenItems: Array<[LucideIcon, string, string]> = [
  [Smartphone, 'Phone first', 'Tap map, color, and pose notes without alt-tabbing.'],
  [Gamepad2, 'PC aware', 'Official game remains the Steam PC game, not a browser clone.'],
  [ShieldCheck, 'Lower risk', 'Clear labels separate demo, fan guide, and official product.'],
];

export const revalidate = 3600;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#F6F0EA] text-[#29211D]">
      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA]">
        <div className="container grid gap-6 py-10 text-left lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:gap-8 lg:py-12 lg:items-start">
          <div className="flex flex-col items-start gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ccc1aa] bg-white/70 px-3 py-1 text-sm text-[#4C3B35]">
              <ShieldCheck className="h-4 w-4 text-[#7D6D69]" />
              Fan-made companion for the Steam game
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-[#29211D] md:text-6xl">
                Meccha Chameleon Art Lab
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#4f4b42] md:text-xl">
                Try the browser demo first if you want to know whether the camo
                gameplay clicks for you. If it does, the Steam game is the next
                step. If not, you have only spent a minute.
              </p>
            </div>

            <div className="max-w-2xl rounded-md border border-[#d8cfbd] bg-white/80 p-4 text-sm leading-6 text-[#4f4b42]">
              <strong className="text-[#29211D]">Already own it?</strong>
              {' '}Go straight to the{' '}
              <a href="#new-player" className="font-semibold text-[#7D6D69] underline">
                beginner walkthrough
              </a>{' '}
              or the{' '}
              <a href="#atlas" className="font-semibold text-[#7D6D69] underline">
                50 hiding spots atlas
              </a>
              . If not, hit play below first. No signup, no install.
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#play"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#7D6D69] px-5 py-3 font-semibold text-white transition hover:bg-[#5C4F4C]"
              >
                <Gamepad2 className="h-5 w-5" />
                Play the demo
              </a>
              <a
                href={getLocalizedPath(locale, '/new-player')}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-5 py-3 font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
              >
                <BookOpen className="h-5 w-5" />
                I already own it, teach me
              </a>
              <a
                href={steamUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#b9af9e] bg-white px-5 py-3 font-semibold text-[#29211D] transition hover:bg-[#ece5d8]"
              >
                <Store className="h-5 w-5" />
                Buy on Steam · $5.99
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {getPaths(locale).map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="min-h-[148px] rounded-md border border-[#d8cfbd] bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-[#7D6D69]"
                >
                  <item.icon className="mb-3 h-5 w-5 text-[#7D6D69]" />
                  <div className="font-semibold">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                    {item.copy}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div id="play" className="lg:self-start">
            <DemoFrame />
          </div>
        </div>
      </section>

      <section id="new-player" className="border-b border-[#D8CFC6] bg-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
              New player filter
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              If you have not downloaded the game yet, start here.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['What is it?', 'A Steam PC hide-and-seek game where hiders paint their bodies to blend into the map.'],
              ['Is it free?', 'The real game is on Steam. This site only provides an unofficial demo and companion guide.'],
              ['Can I play on mobile?', 'Use this site on mobile as a guide. Treat mobile game-store clones as separate products unless the developer confirms them.'],
              ['What should I learn first?', 'Spot selection, color matching, pose discipline, and staying still after you commit.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-md border border-[#e0d8c8] p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="camo-lab" className="border-b border-[#D8CFC6] bg-[#F4DCD0]">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
                For real players
              </p>
              <h2 className="max-w-3xl text-3xl font-bold tracking-normal md:text-4xl">
                Camo Lab turns search traffic into match-ready help.
              </h2>
            </div>
            <a
              href="#atlas"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-4 py-3 text-sm font-semibold text-white"
            >
              <MapPinned className="h-4 w-4" />
              Preview map atlas
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Color reads', 'Show primary and secondary paint colors for each map surface.'],
              ['Pose notes', 'Tell players which side or silhouette should face the seeker.'],
              ['Risk rating', 'Label beginner-safe, high-reward, and obvious bait spots.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-md bg-white p-5 shadow-sm">
                <Sparkles className="mb-4 h-5 w-5 text-[#AA776E]" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="atlas"
        className="scroll-mt-28 border-b border-[#D8CFC6] bg-white"
      >
        <div className="container py-14">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
              Hiding Spot Atlas
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              Five real map guides, fifty hiding spots, one fast second screen.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4C3B35]">
              These are the captured Meccha Chameleon map assets Claude already
              prepared: screenshots, paint colors, difficulty, and match tips.
            </p>
          </div>
          <AtlasPreview locale={locale} />
        </div>
      </section>

      <HowToPlaySection locale={locale} />

      <UpdatesSection />

      <section id="second-screen" className="border-b border-[#D8CFC6] bg-[#1F1611] text-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#C9B2A8]">
              Best form factor
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              Build for phone-in-hand while the real game runs on PC.
            </h2>
            <p className="mt-4 leading-7 text-white/75">
              A browser page beats a plugin here. Steam gameplay happens outside
              the browser, so the practical companion is a mobile-friendly web
              guide that loads instantly and needs no account.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {secondScreenItems.map(([Icon, title, copy]) => (
              <div key={title} className="rounded-md border border-white/15 bg-white/8 p-5">
                <Icon className="mb-4 h-5 w-5 text-[#C9B2A8]" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KeywordSection />

      <section className="bg-[#F6F0EA]">
        <div className="container py-14">
          <h2 className="mb-8 text-3xl font-bold tracking-normal md:text-4xl">
            Quick answers
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-md border border-[#D8CFC6] bg-white p-5">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
