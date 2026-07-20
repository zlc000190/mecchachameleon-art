'use client';

import { useEffect, useRef, useState } from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';

type Demo = {
  id: string;
  label: string;
  title: string;
  source: string;
  ratio: string;
  src: string;
  note: string;
  openInNewTab?: string;
  poster?: string;
  comingSoon?: boolean;
};

// Until we ship our own Unity WebGL build under /game, the Meccha Chameleon
// slot is intentionally offline — embedding the third-party site was leaking
// PageRank and sending users away. This keeps the slot visible in the UI but
// drops the iframe, the dofollow outbound link, and the host probe.
const MECCHA_COMING_SOON_NOTE_EN =
  'Our native Meccha Chameleon build is in active development. The previous iframe pointed at a third-party site and is now offline while we finish the in-house version.';

const MECCHA_COMING_SOON_NOTE_ZH =
  '我们正在开发 Meccha Chameleon 的官方版本。原先嵌入第三方站点的 iframe 已临时下线，不再外链到外部网站。';

const MECCHA_COMING_SOON_CTA_EN = 'Notify me when it launches';
const MECCHA_COMING_SOON_CTA_ZH = '上线通知';

const demos: Demo[] = [
  {
    id: 'easy',
    label: 'Meccha',
    title: 'Meccha Chameleon Browser Game',
    source: 'Meccha Chameleon Art Studio',
    ratio: 'aspect-[16/9] min-h-[650px] max-h-[90vh]',
    src: '',
    note: MECCHA_COMING_SOON_NOTE_EN,
    poster: '/imgs/related-games/meccha-header.jpg',
    comingSoon: true,
  },
  {
    id: 'hard',
    label: 'Hard',
    title: 'Hide N Seek',
    source: 'CrazyGames',
    ratio: 'aspect-[9/16] min-h-[720px] max-h-[86vh]',
    src: 'https://games.crazygames.com/en_US/hide-n-seek/index.html',
    note: 'Hard mode uses the CrazyGames Hide N Seek iframe. Please wait in this page while the game finishes loading.',
    openInNewTab: 'https://www.crazygames.com/game/hide-n-seek',
  },
  {
    id: 'social',
    label: 'Social',
    title: 'Sneaky Friends',
    source: 'GameDistribution',
    ratio:
      'aspect-[480/800] sm:aspect-[16/10] lg:aspect-[480/800] min-h-[640px] max-h-[86vh]',
    src: 'https://embed.gamedistribution.com/?url=https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/&width=480&height=800&language=en&gdpr-tracking=1&gdpr-targeting=1&gd_sdk_referrer_url=https://mechachameleon.games/',
    note: 'Social mode uses the friend-focused hide-and-seek browser game. Best for users looking for a group-play flavor.',
    openInNewTab:
      'https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/',
  },
  {
    id: 'hide-n-seek-gd',
    label: 'Hide N Seek',
    title: 'Hide N Seek!',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/7eda2be289604aa89f3b97df59661bfe/',
    note: 'Classic maze-style hide-and-seek from GameDistribution. Pick this when users want a direct hide-or-seek match.',
    openInNewTab:
      'https://html5.gamedistribution.com/7eda2be289604aa89f3b97df59661bfe/',
  },
  {
    id: 'stickman-hide-seek',
    label: 'Stickman',
    title: 'Hide and Seek Stickman',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/239942ce1a1349f6bcc9d312b32c5c3b/',
    note: 'Stickman hide-and-seek where players can hide or chase in short browser rounds.',
    openInNewTab:
      'https://html5.gamedistribution.com/239942ce1a1349f6bcc9d312b32c5c3b/',
  },
  {
    id: 'horror-escape',
    label: 'Horror',
    title: 'Hide And Seek: Horror Escape',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/169645f5ac814065968e3872875bbce1/',
    note: 'Asymmetric horror hide-and-seek with hide and seek roles, school and hospital escape scenes.',
    openInNewTab:
      'https://html5.gamedistribution.com/169645f5ac814065968e3872875bbce1/',
  },
  {
    id: 'kitten-hide-seek',
    label: 'Kitten',
    title: 'Kitten Hide And Seek',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/b78553bf5db34812972452aab68f88c0/',
    note: 'Cute puzzle hide-and-seek: help the little girl escape while avoiding the kitten.',
    openInNewTab:
      'https://html5.gamedistribution.com/b78553bf5db34812972452aab68f88c0/',
  },
  {
    id: 'skibidi-hide-seek',
    label: 'Skibidi',
    title: 'Skibidi Titans Hide And Seek',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/38d6fc63e63c4be69887a604699c864a/',
    note: 'A chase-focused hide-and-seek battle with hunters and escape artists.',
    openInNewTab:
      'https://html5.gamedistribution.com/38d6fc63e63c4be69887a604699c864a/',
  },
  {
    id: 'among-hide-seek',
    label: 'Among',
    title: 'Among Them Hide N Seek 2',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/012df11266ed40909ce2b303c202fa93/',
    note: 'Cartoon stealth hide-and-seek with quick browser rounds and simple controls.',
    openInNewTab:
      'https://html5.gamedistribution.com/012df11266ed40909ce2b303c202fa93/',
  },
  {
    id: 'hunt-and-seek',
    label: 'Hunt',
    title: 'Hunt And Seek',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/7fa16181fc5c4ce2a7d3b9a171d48f76/',
    note: 'A puzzle-flavored seek-and-find game with hidden characters and short casual rounds.',
    openInNewTab:
      'https://html5.gamedistribution.com/7fa16181fc5c4ce2a7d3b9a171d48f76/',
  },
  {
    id: 'blumgi-slime',
    label: 'Blumgi',
    title: 'Blumgi Slime',
    source: 'BlumgiSlime2.io',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://blumgislime2.io/',
    note: 'A bright precision-jump game for the funny-games strip.',
    openInNewTab: 'https://blumgislime2.io/',
  },
  {
    id: 'wacky-steps',
    label: 'Wacky',
    title: 'Wacky Steps',
    source: 'WackySteps.io',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://wackysteps.io/',
    note: 'A ragdoll walking challenge with funny fail-heavy movement.',
    openInNewTab: 'https://wackysteps.io/',
  },
];

const zhNotes: Record<string, string> = {
  easy: MECCHA_COMING_SOON_NOTE_ZH,
  hard: 'Hard 使用 CrazyGames 的 Hide N Seek iframe，请在当前页面等待加载完成。',
  social:
    'Social 使用偏朋友组队体验的 hide-and-seek 浏览器游戏，适合社交玩法搜索。',
  'hide-n-seek-gd':
    'GameDistribution 的经典 Hide N Seek，点击周围卡片会在中间直接切换。',
  'stickman-hide-seek': 'Stickman 躲猫猫浏览器版，适合补充更多同类游戏入口。',
  'horror-escape':
    'Horror Escape 是恐怖逃脱型躲猫猫，有 Hide / Seek 两种身份。',
  'kitten-hide-seek': 'Kitten Hide And Seek 是轻量解谜躲藏玩法。',
  'skibidi-hide-seek':
    'Skibidi Titans Hide And Seek 是追逐和逃脱方向的同类游戏。',
  'among-hide-seek': 'Among Them Hide N Seek 2 是卡通躲藏玩法。',
  'hunt-and-seek': 'Hunt And Seek 偏寻找隐藏角色和轻解谜。',
  'blumgi-slime': 'Blumgi Slime 是参考站同款方向，但来源是独立站点。',
  'wacky-steps': 'Wacky Steps 是参考站同款方向，但来源是独立站点。',
};

function ComingSoonCard({ demo, locale }: { demo: Demo; locale: string }) {
  const zh = locale === 'zh';
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-[#1f1230] via-[#2a1845] to-[#3a2358] p-6 text-center text-white">
      {demo.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={demo.poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1f1230]/95 via-[#1f1230]/70 to-transparent" />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
          <Sparkles className="h-3.5 w-3.5" />
          {zh ? '即将上线' : 'Coming soon'}
        </span>
        <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
          {zh ? 'Meccha Chameleon 原生版本' : 'Native Meccha Chameleon build'}
        </h3>
        <p className="text-sm leading-6 text-white/80 md:text-base">
          {zh ? MECCHA_COMING_SOON_NOTE_ZH : MECCHA_COMING_SOON_NOTE_EN}
        </p>
        <span className="mt-1 inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
          {zh ? MECCHA_COMING_SOON_CTA_ZH : MECCHA_COMING_SOON_CTA_EN}
        </span>
      </div>
    </div>
  );
}

export function DemoFrame({ locale = 'en' }: { locale?: string }) {
  const zh = locale === 'zh';
  const [activeId, setActiveId] = useState<Demo['id']>('easy');
  const [customDemo, setCustomDemo] = useState<Demo | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isDesktopPlay, setIsDesktopPlay] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const activeDemo =
    customDemo ?? demos.find((demo) => demo.id === activeId) ?? demos[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isComingSoon = !!activeDemo.comingSoon;

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 9000);
    return () => clearTimeout(t);
  }, [activeId]);

  useEffect(() => {
    const handleSelectDemo = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          demoId?: string;
          title?: string;
          source?: string;
          src?: string;
          note?: string;
          openInNewTab?: string;
        }>
      ).detail;
      const demoId = detail?.demoId;

      if (!demoId) return;

      const knownDemo = demos.find((demo) => demo.id === demoId);
      if (knownDemo) {
        setCustomDemo(null);
        setActiveId(demoId);
      } else if (detail?.src && detail.title && detail.source) {
        // Custom demo injected from a related-games click. We accept the
        // payload as-is; never seed `openInNewTab` with anything that is not
        // already on the demo entry, to keep outbound links auditable.
        setCustomDemo({
          id: demoId,
          label: detail.title.split(' ')[0] || 'Game',
          title: detail.title,
          source: detail.source,
          ratio: 'aspect-[16/9] min-h-[650px] max-h-[90vh]',
          src: detail.src,
          note:
            detail.note || `${detail.title} opens in the center play frame.`,
          openInNewTab: detail.openInNewTab,
        });
        setActiveId(demoId);
      } else {
        return;
      }

      setShowHint(true);
    };

    window.addEventListener('meccha:select-demo', handleSelectDemo);

    return () => {
      window.removeEventListener('meccha:select-demo', handleSelectDemo);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(min-width: 768px) and (pointer: fine)'
    );
    const update = () => setIsDesktopPlay(mediaQuery.matches);
    const raf = window.requestAnimationFrame(update);

    mediaQuery.addEventListener('change', update);

    return () => {
      window.cancelAnimationFrame(raf);
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const landscapeQuery = window.matchMedia('(orientation: landscape)');
    const update = () => setIsLandscape(landscapeQuery.matches);
    const raf = window.requestAnimationFrame(update);

    landscapeQuery.addEventListener('change', update);

    return () => {
      window.cancelAnimationFrame(raf);
      landscapeQuery.removeEventListener('change', update);
    };
  }, []);

  const handlePrimaryAction = () => {
    if (isComingSoon) return;
    requestAnimationFrame(() => iframeRef.current?.focus());
  };

  const mobileAspect = 'aspect-[16/9]';
  const mobileFrameSize = isLandscape
    ? 'max-h-[78vh] max-w-[78vw]'
    : 'min-h-[210px] max-h-[42vh] max-w-full';
  const mobileFrameRadius = isLandscape ? 'rounded-2xl' : 'rounded-lg';

  if (!isDesktopPlay) {
    return (
      <div id="play" className="scroll-mt-24">
        <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
          <div className="border-b border-white/70 px-4 py-3 text-[#2f2730]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-sm font-semibold">
                  {zh ? 'Mecha Chameleon 在线游戏' : 'Mecha Chameleon Game'} ·{' '}
                  {activeDemo.label}
                </div>
                <div className="mt-1 text-xs text-[#4C3B35]">
                  {activeDemo.title} via {activeDemo.source}
                </div>
              </div>
            </div>

            <div
              className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
              role="tablist"
              aria-label="Game mode"
            >
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDemo.id === demo.id}
                  onClick={() => {
                    setCustomDemo(null);
                    setActiveId(demo.id);
                    setShowHint(true);
                  }}
                  className={`min-h-9 shrink-0 rounded-md border px-4 text-sm font-semibold transition ${
                    activeDemo.id === demo.id
                      ? 'border-[#29211D] bg-[#29211D] text-white'
                      : 'border-[#efc8d3] bg-white text-[#29211D] hover:bg-[#fff7c8]'
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-[280px] items-center justify-center bg-[#1f1230] p-3 sm:min-h-[58vh] sm:p-6">
            {isComingSoon ? (
              <div
                className={`relative w-full ${mobileFrameSize} ${mobileAspect} ${mobileFrameRadius} overflow-hidden bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
              >
                <ComingSoonCard demo={activeDemo} locale={locale} />
              </div>
            ) : (
              <div
                className={`relative w-full ${mobileFrameSize} ${mobileAspect} ${mobileFrameRadius} overflow-hidden bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
              >
                <iframe
                  key={`${activeDemo.id}-mobile`}
                  ref={iframeRef}
                  title={`${activeDemo.title} browser game`}
                  src={activeDemo.src}
                  className="absolute inset-0 h-full w-full"
                  loading="eager"
                  allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
                  allowFullScreen
                  scrolling="no"
                  referrerPolicy="origin"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
                />
                {activeDemo.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeDemo.poster}
                    alt={`${activeDemo.title} official artwork`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-b from-black/20 via-black/5 to-black/65 p-3 sm:items-center sm:bg-gradient-to-b sm:from-black/45 sm:via-black/15 sm:to-black/55">
                  <div className="pointer-events-auto relative z-10 flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/95 px-6 py-5 text-center text-sm text-[#29211D] shadow-2xl">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6f9a] text-white">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
                    </div>
                    <div className="font-semibold">
                      {zh
                        ? '游戏正在加载，请稍候。'
                        : 'The game is loading. Please wait.'}
                    </div>
                    <div className="text-xs text-[#4C3B35]">
                      {zh
                        ? '请留在当前页面，加载完成后游戏会自动显示。'
                        : 'Please stay on this page. The game will appear automatically when loading finishes.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/70 bg-white/60 px-4 py-3 text-xs leading-5 text-[#4C3B35]">
            {zh
              ? '手机首屏会按屏幕比例缩放游戏窗口；游戏会始终留在当前页面加载。'
              : 'On mobile the embedded game is scaled to fit the screen and remains on this page while loading.'}
            <div className="mt-2">
              {zh ? zhNotes[activeDemo.id] : activeDemo.note}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="play" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
        <div className="border-b border-white/70 px-4 py-3 text-[#2f2730]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-sm font-semibold">
                {zh ? 'Mecha Chameleon 在线游戏' : 'Mecha Chameleon Game'} ·{' '}
                {activeDemo.label}
              </div>
              <div className="mt-1 text-xs text-[#4C3B35]">
                {activeDemo.title} via {activeDemo.source}
              </div>
            </div>
            {!isComingSoon ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex min-h-9 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
              >
                <Gamepad2 className="h-4 w-4" />
                {zh ? '点击开始' : 'Click to Play'}
              </button>
            ) : null}
          </div>

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Game mode"
          >
            {demos.map((demo) => (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={activeDemo.id === demo.id}
                onClick={() => {
                  setCustomDemo(null);
                  setActiveId(demo.id);
                  setShowHint(true);
                }}
                className={`min-h-9 rounded-md border px-4 text-sm font-semibold transition ${
                  activeDemo.id === demo.id
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-mortar text-ink-900 hover:bg-brick-50 bg-white'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="text-ink-500 mt-3 text-xs leading-5">
            {zh ? zhNotes[activeDemo.id] : activeDemo.note}
          </p>
        </div>

        <div
          className={`bg-brick-900 relative w-full overflow-hidden ${activeDemo.ratio}`}
        >
          {isComingSoon ? (
            <ComingSoonCard demo={activeDemo} locale={locale} />
          ) : (
            <>
              <iframe
                key={activeDemo.id}
                ref={iframeRef}
                title={`${activeDemo.title} browser game`}
                src={activeDemo.src}
                className="absolute inset-0 h-full w-full"
                loading="eager"
                allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
                allowFullScreen
                scrolling="no"
                referrerPolicy="origin"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
              />
              {showHint ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border border-amber-300/40 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-lg">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <div className="font-semibold">
                        {zh
                          ? '游戏正在当前页面加载，请稍候。'
                          : 'The game is loading on this page. Please wait.'}
                      </div>
                      <div className="mt-1 text-xs text-amber-900/80">
                        {zh
                          ? '第三方游戏源，非官方 Meccha Chameleon。'
                          : 'Third-party game source, not the official Meccha Chameleon.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHint(false)}
                      className="-mt-1 -mr-1 rounded p-1 text-amber-700 hover:bg-amber-200/60"
                      aria-label="Dismiss hint"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="text-ink-500 flex flex-wrap items-center justify-between gap-3 border-t border-white/70 bg-white/80 px-4 py-3 text-xs">
          <span>
            {isComingSoon
              ? zh
                ? '原生版本正在开发中，上线后会回到这里直接玩。'
                : 'The native build is in development. It will appear here when it ships.'
              : zh
                ? '游戏会始终留在当前页面，加载完成后即可游玩。'
                : 'The game stays on this page and is playable as soon as loading finishes.'}
          </span>
        </div>
      </div>
    </div>
  );
}