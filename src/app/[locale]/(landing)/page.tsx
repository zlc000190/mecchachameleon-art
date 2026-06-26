import {
  BookOpen,
  Gamepad2,
  type LucideIcon,
  MapPinned,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

import { AtlasPreview } from '@/shared/blocks/meccha/atlas-preview';
import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getHomeCopy } from '@/shared/blocks/meccha/meccha-i18n';
import { ToolsTeaser } from '@/shared/blocks/meccha/tools-teaser';
import { HowToPlaySection } from '@/shared/blocks/meccha/how-to-play-section';
import { KeywordSection } from '@/shared/blocks/meccha/keyword-section';
import { UpdatesSection } from '@/shared/blocks/meccha/updates-section';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

const secondScreenIcons: LucideIcon[] = [Smartphone, Gamepad2, ShieldCheck];

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
  const showLongFormSections = locale === 'en' || locale === 'zh';
  const showTranslatedDetailCards = locale === 'en' || locale === 'zh' || locale === 'ru';
  const showTranslatedAtlasPreview = locale === 'en' || locale === 'zh';

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd items={[{ name: locale === 'zh' ? '首页' : 'Home', item: homeUrl }]} />
      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pb-8 pt-32 lg:pb-10 lg:pt-40">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-normal text-[#29211D] md:text-6xl">
                {copy.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#play" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#ff6f9a] px-5 py-3 font-semibold text-white transition hover:bg-[#e95a88]">
                <Gamepad2 className="h-5 w-5" />{copy.playNow}
              </a>
              <a href="#how-to-play" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-5 py-3 font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                <BookOpen className="h-5 w-5" />{copy.howToPlay}
              </a>
            </div>
          </div>

          <div className="grid gap-5"><div id="play"><DemoFrame locale={locale} /></div></div>
        </div>
      </section>

      <ToolsTeaser locale={locale} />

      <section id="new-player" className="border-b border-[#D8CFC6] bg-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{copy.newPlayerEyebrow}</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{copy.newPlayerTitle}</h2>
          </div>
          {showTranslatedDetailCards ? (
            <div className="grid gap-4 md:grid-cols-2">
              {copy.newPlayerCards.map(([title, body]: readonly [string, string]) => (
                <div key={title} className="rounded-md border border-[#e0d8c8] p-5">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{body}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="camo-lab" className="border-b border-[#D8CFC6] bg-[#F4DCD0]">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{copy.camoEyebrow}</p>
              <h2 className="max-w-3xl text-3xl font-bold tracking-normal md:text-4xl">{copy.camoTitle}</h2>
            </div>
            <a href="#atlas" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e95a88]">
              <MapPinned className="h-4 w-4" />{copy.previewAtlas}
            </a>
          </div>
          {showTranslatedDetailCards ? (
            <div className="grid gap-4 md:grid-cols-3">
              {copy.camoCards.map(([title, body]: readonly [string, string]) => (
                <div key={title} className="rounded-md bg-white p-5 shadow-sm">
                  <Sparkles className="mb-4 h-5 w-5 text-[#AA776E]" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{body}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="atlas" className="scroll-mt-28 border-b border-[#D8CFC6] bg-white">
        <div className="container py-14">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{copy.atlasEyebrow}</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{copy.atlasTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4C3B35]">{copy.atlasDesc}</p>
          </div>
          {showTranslatedAtlasPreview ? <AtlasPreview locale={locale} /> : null}
        </div>
      </section>

      {showLongFormSections ? (
        <>
          <HowToPlaySection locale={locale} />
          <UpdatesSection locale={locale} />
        </>
      ) : null}

      <section id="second-screen" className="border-b border-[#D8CFC6] bg-gradient-to-br from-[#9de7dc] via-[#cdefff] to-[#d9b7ff] text-[#29211D]">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{copy.secondEyebrow}</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{copy.secondTitle}</h2>
            <p className="mt-4 leading-7 text-[#4C3B35]">{copy.secondDesc}</p>
            <a
              href={locale === 'en' ? '/tools' : `/${locale}/tools`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#ff6f9a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
            >
              <BookOpen className="h-4 w-4" />
              {copy.openTools}
            </a>
          </div>
          {showTranslatedDetailCards ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {copy.secondScreenItems.map(([title, body]: readonly [string, string], i: number) => {
                const Icon = secondScreenIcons[i];
                return <div key={title} className="rounded-md border border-white/70 bg-white/70 p-5"><Icon className="mb-4 h-5 w-5 text-[#ff6f9a]" /><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#4C3B35]">{body}</p></div>;
              })}
            </div>
          ) : null}
        </div>
      </section>

      {showLongFormSections ? <KeywordSection locale={locale} /> : null}

      {showTranslatedDetailCards ? (
        <section className="bg-[#F6F0EA]">
          <div className="container py-14">
            <h2 className="mb-8 text-3xl font-bold tracking-normal md:text-4xl">{copy.quickAnswers}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {copy.faqs.map(([q, a]: readonly [string, string]) => (
                <div key={q} className="rounded-md border border-[#D8CFC6] bg-white p-5">
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
