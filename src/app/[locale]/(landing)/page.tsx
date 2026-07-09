import {
  BookOpen,
  Gamepad2,
  MapPinned,
  ShieldCheck,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { AdsterraNativeBanner } from '@/extensions/ads';
import { ArabicSeoSection } from '@/shared/blocks/meccha/arabic-seo-section';
import { AtlasPreview } from '@/shared/blocks/meccha/atlas-preview';
import { CommunityChallengePreview } from '@/shared/blocks/meccha/community-challenge-preview';
import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { DutchSeoSection } from '@/shared/blocks/meccha/dutch-seo-section';
import { FrenchSeoSection } from '@/shared/blocks/meccha/french-seo-section';
import { GermanSeoSection } from '@/shared/blocks/meccha/german-seo-section';
import { HowToPlaySection } from '@/shared/blocks/meccha/how-to-play-section';
import { ItalianSeoSection } from '@/shared/blocks/meccha/italian-seo-section';
import { JapaneseSeoSection } from '@/shared/blocks/meccha/japanese-seo-section';
import { KeywordSection } from '@/shared/blocks/meccha/keyword-section';
import {
  getHomeCopy,
  getLocalizedPath,
} from '@/shared/blocks/meccha/meccha-i18n';
import { PaidDownloadButton } from '@/shared/blocks/meccha/paid-download-button';
import { PortugueseSeoSection } from '@/shared/blocks/meccha/portuguese-seo-section';
import { SpanishSeoSection } from '@/shared/blocks/meccha/spanish-seo-section';
import { ToolsTeaser } from '@/shared/blocks/meccha/tools-teaser';
import { RelatedGames } from '@/shared/blocks/meccha/related-games';
import { UpdatesSection } from '@/shared/blocks/meccha/updates-section';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getPlayKitPriceLabel } from '@/shared/lib/play-kit';
import { getCanonicalUrl } from '@/shared/lib/seo';

const secondScreenIcons: LucideIcon[] = [Smartphone, Gamepad2, ShieldCheck];
const coreLocalizedLocales = [
  'en',
  'zh',
  'ru',
  'es',
  'de',
  'pt',
  'fr',
  'it',
  'nl',
  'ar',
  'ja',
  'ko',
  'th',
  'vi',
  'zh-TW',
];
const longFormLocales = ['en', 'zh', 'nl', 'th', 'vi', 'zh-TW'];

export const revalidate = 3600;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getHomeCopy(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const showLongFormSections = longFormLocales.includes(locale);
  const showLocalizedHowToPlay = [
    'en',
    'zh',
    'zh-TW',
    'ru',
    'es',
    'de',
    'pt',
    'fr',
    'it',
    'nl',
    'ar',
    'ja',
    'ko',
  ].includes(locale);
  const showSpanishSeoSection = locale === 'es';
  const showGermanSeoSection = locale === 'de';
  const showPortugueseSeoSection = locale === 'pt';
  const showFrenchSeoSection = locale === 'fr';
  const showItalianSeoSection = locale === 'it';
  const showDutchSeoSection = locale === 'nl';
  const showArabicSeoSection = locale === 'ar';
  const showJapaneseSeoSection = locale === 'ja';
  const showTranslatedDetailCards = coreLocalizedLocales.includes(locale);
  const showTranslatedAtlasPreview = coreLocalizedLocales.includes(locale);
  const showCommunityPreview = coreLocalizedLocales.includes(locale);
  const salePriceLabel = getPlayKitPriceLabel();

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd
        items={[{ name: locale === 'zh' ? '首页' : 'Home', item: homeUrl }]}
      />
      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-32 pb-8 lg:pt-40 lg:pb-10">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl leading-tight font-bold tracking-normal text-[#29211D] md:text-6xl">
                {copy.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#play"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#ff6f9a] px-5 py-3 font-semibold text-white transition hover:bg-[#e95a88]"
              >
                <Gamepad2 className="h-5 w-5" />
                {copy.playNow}
              </a>
              <a
                href="#how-to-play"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-5 py-3 font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
              >
                <BookOpen className="h-5 w-5" />
                {copy.howToPlay}
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            <div id="play">
              <DemoFrame locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <RelatedGames locale={locale} />

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container py-6">
          <AdsterraNativeBanner
            className="mx-auto min-h-[90px] w-full max-w-5xl"
            containerId="container-b59ba82077f589c928c05fdf83f0e6e0"
            invokeSrc="https://pl30105394.effectivecpmnetwork.com/b59ba82077f589c928c05fdf83f0e6e0/invoke.js"
          />
        </div>
      </section>

      <ToolsTeaser locale={locale} />

      <section id="new-player" className="border-b border-[#D8CFC6] bg-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              {copy.newPlayerEyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              {copy.newPlayerTitle}
            </h2>
          </div>
          {showTranslatedDetailCards ? (
            <div className="grid gap-4 md:grid-cols-2">
              {copy.newPlayerCards.map(
                ([title, body]: readonly [string, string]) => (
                  <div
                    key={title}
                    className="rounded-md border border-[#e0d8c8] p-5"
                  >
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                      {body}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section id="camo-lab" className="border-b border-[#D8CFC6] bg-[#F4DCD0]">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
                {copy.camoEyebrow}
              </p>
              <h2 className="max-w-3xl text-3xl font-bold tracking-normal md:text-4xl">
                {copy.camoTitle}
              </h2>
            </div>
            <a
              href="#atlas"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e95a88]"
            >
              <MapPinned className="h-4 w-4" />
              {copy.previewAtlas}
            </a>
          </div>
          {showTranslatedDetailCards ? (
            <div className="grid gap-4 md:grid-cols-3">
              {copy.camoCards.map(
                ([title, body]: readonly [string, string]) => (
                  <div
                    key={title}
                    className="rounded-md bg-white p-5 shadow-sm"
                  >
                    <Sparkles className="mb-4 h-5 w-5 text-[#AA776E]" />
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                      {body}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section
        id="community-challenge"
        className="border-b border-[#D8CFC6] bg-white"
      >
        <div className="container py-14">
          {showCommunityPreview ? (
            <CommunityChallengePreview locale={locale} />
          ) : null}
        </div>
      </section>

      <section
        id="atlas"
        className="scroll-mt-28 border-b border-[#D8CFC6] bg-white"
      >
        <div className="container py-14">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              {copy.atlasEyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              {copy.atlasTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4C3B35]">
              {copy.atlasDesc}
            </p>
          </div>
          {showTranslatedAtlasPreview ? <AtlasPreview locale={locale} /> : null}
        </div>
      </section>

      {showSpanishSeoSection ? <SpanishSeoSection /> : null}
      {showGermanSeoSection ? <GermanSeoSection /> : null}
      {showPortugueseSeoSection ? <PortugueseSeoSection /> : null}
      {showFrenchSeoSection ? <FrenchSeoSection /> : null}
      {showItalianSeoSection ? <ItalianSeoSection /> : null}
      {showDutchSeoSection ? <DutchSeoSection /> : null}
      {showArabicSeoSection ? <ArabicSeoSection /> : null}
      {showJapaneseSeoSection ? <JapaneseSeoSection /> : null}

      {showLocalizedHowToPlay ? <HowToPlaySection locale={locale} /> : null}

      {showLongFormSections ? <UpdatesSection locale={locale} /> : null}

      <section
        id="second-screen"
        className="border-b border-[#D8CFC6] bg-gradient-to-br from-[#9de7dc] via-[#cdefff] to-[#d9b7ff] text-[#29211D]"
      >
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-normal text-[#7D6D69] uppercase">
              {copy.secondEyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
              {copy.secondTitle}
            </h2>
            <p className="mt-4 leading-7 text-[#4C3B35]">{copy.secondDesc}</p>
            <PaidDownloadButton
              locale={locale}
              href={`${getLocalizedPath(locale, '/tools')}#paid-download-intent`}
              price={salePriceLabel}
              source="home_second_screen"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#ff6f9a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
            >
              <BookOpen className="h-4 w-4" />
              {locale === 'zh'
                ? `获取 Play Kit - ${salePriceLabel}`
                : `Get Play Kit - ${salePriceLabel}`}
            </PaidDownloadButton>
          </div>
          {showTranslatedDetailCards ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {copy.secondScreenItems.map(
                ([title, body]: readonly [string, string], i: number) => {
                  const Icon = secondScreenIcons[i];
                  return (
                    <div
                      key={title}
                      className="rounded-md border border-white/70 bg-white/70 p-5"
                    >
                      <Icon className="mb-4 h-5 w-5 text-[#ff6f9a]" />
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                        {body}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          ) : null}
        </div>
      </section>

      {showLongFormSections ? <KeywordSection locale={locale} /> : null}

      {showTranslatedDetailCards ? (
        <section className="bg-[#F6F0EA]">
          <div className="container py-14">
            <h2 className="mb-8 text-3xl font-bold tracking-normal md:text-4xl">
              {copy.quickAnswers}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {copy.faqs.map(([q, a]: readonly [string, string]) => (
                <div
                  key={q}
                  className="rounded-md border border-[#D8CFC6] bg-white p-5"
                >
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
