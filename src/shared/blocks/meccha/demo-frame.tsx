'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Gamepad2, Sparkles } from 'lucide-react';

type Demo = {
  id: string;
  label: string;
  title: string;
  source: string;
  ratio: string;
  src: string;
  note: string;
  openInNewTab: string;
  poster?: string;
};

const demos: Demo[] = [
  {
    id: 'easy',
    label: 'Meccha',
    title: 'Meccha Chameleon Browser Game',
    source: 'Official Meccha Chameleon',
    ratio: 'aspect-[16/9] min-h-[650px] max-h-[90vh]',
    src: 'https://chameleon-game.com/',
    note: 'The default slot uses official Meccha Chameleon Steam artwork. Use paint, disguise, and quick hide-and-seek rounds to blend into the room, then open the official game tab when the protected embed blocks inline play.',
    openInNewTab: 'https://chameleon-game.com/',
    poster: '/imgs/related-games/meccha-chameleon.png',
  },
  {
    id: 'hard',
    label: 'Hard',
    title: 'Hide N Seek',
    source: 'CrazyGames',
    ratio: 'aspect-[9/16] min-h-[720px] max-h-[86vh]',
    src: 'https://games.crazygames.com/en_US/hide-n-seek/index.html',
    note: 'Hard mode uses the CrazyGames Hide N Seek iframe. If the ad splash sticks, use the new-tab fallback.',
    openInNewTab: 'https://www.crazygames.com/game/hide-n-seek',
  },
  {
    id: 'social',
    label: 'Social',
    title: 'Sneaky Friends',
    source: 'GameDistribution',
    ratio: 'aspect-[480/800] sm:aspect-[16/10] lg:aspect-[480/800] min-h-[640px] max-h-[86vh]',
    src: 'https://embed.gamedistribution.com/?url=https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/&width=480&height=800&language=en&gdpr-tracking=1&gdpr-targeting=1&gd_sdk_referrer_url=https://mechachameleon.games/',
    note: 'Social mode uses the friend-focused hide-and-seek browser game. Best for users looking for a group-play flavor.',
    openInNewTab: 'https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/',
  },
  {
    id: 'hide-n-seek-gd',
    label: 'Hide N Seek',
    title: 'Hide N Seek!',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/7eda2be289604aa89f3b97df59661bfe/',
    note: 'Classic maze-style hide-and-seek from GameDistribution. Pick this when users want a direct hide-or-seek match.',
    openInNewTab: 'https://html5.gamedistribution.com/7eda2be289604aa89f3b97df59661bfe/',
  },
  {
    id: 'stickman-hide-seek',
    label: 'Stickman',
    title: 'Hide and Seek Stickman',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/239942ce1a1349f6bcc9d312b32c5c3b/',
    note: 'Stickman hide-and-seek where players can hide or chase in short browser rounds.',
    openInNewTab: 'https://html5.gamedistribution.com/239942ce1a1349f6bcc9d312b32c5c3b/',
  },
  {
    id: 'horror-escape',
    label: 'Horror',
    title: 'Hide And Seek: Horror Escape',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/169645f5ac814065968e3872875bbce1/',
    note: 'Asymmetric horror hide-and-seek with hide and seek roles, school and hospital escape scenes.',
    openInNewTab: 'https://html5.gamedistribution.com/169645f5ac814065968e3872875bbce1/',
  },
  {
    id: 'kitten-hide-seek',
    label: 'Kitten',
    title: 'Kitten Hide And Seek',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/b78553bf5db34812972452aab68f88c0/',
    note: 'Cute puzzle hide-and-seek: help the little girl escape while avoiding the kitten.',
    openInNewTab: 'https://html5.gamedistribution.com/b78553bf5db34812972452aab68f88c0/',
  },
  {
    id: 'skibidi-hide-seek',
    label: 'Skibidi',
    title: 'Skibidi Titans Hide And Seek',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/38d6fc63e63c4be69887a604699c864a/',
    note: 'A chase-focused hide-and-seek battle with hunters and escape artists.',
    openInNewTab: 'https://html5.gamedistribution.com/38d6fc63e63c4be69887a604699c864a/',
  },
  {
    id: 'among-hide-seek',
    label: 'Among',
    title: 'Among Them Hide N Seek 2',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/012df11266ed40909ce2b303c202fa93/',
    note: 'Cartoon stealth hide-and-seek with quick browser rounds and simple controls.',
    openInNewTab: 'https://html5.gamedistribution.com/012df11266ed40909ce2b303c202fa93/',
  },
  {
    id: 'hunt-and-seek',
    label: 'Hunt',
    title: 'Hunt And Seek',
    source: 'GameDistribution',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://html5.gamedistribution.com/7fa16181fc5c4ce2a7d3b9a171d48f76/',
    note: 'A puzzle-flavored seek-and-find game with hidden characters and short casual rounds.',
    openInNewTab: 'https://html5.gamedistribution.com/7fa16181fc5c4ce2a7d3b9a171d48f76/',
  },
  {
    id: 'blumgi-slime',
    label: 'Blumgi',
    title: 'Blumgi Slime',
    source: 'BlumgiSlime2.io',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://blumgislime2.io/',
    note: 'A colorful precision-jump game from a separate source, useful as a funny casual recommendation.',
    openInNewTab: 'https://blumgislime2.io/',
  },
  {
    id: 'wacky-steps',
    label: 'Wacky',
    title: 'Wacky Steps',
    source: 'WackySteps.io',
    ratio: 'aspect-[16/9] min-h-[560px] max-h-[86vh]',
    src: 'https://wackysteps.io/',
    note: 'A ragdoll walking challenge from a separate source, matching the funny-game angle without using the reference site.',
    openInNewTab: 'https://wackysteps.io/',
  },
];

const zhNotes: Record<string, string> = {
  easy: '默认入口展示 Meccha Chameleon 官方 Steam 图片；官方站点保护了内嵌加载，点击按钮可打开官方游戏。',
  hard: 'Hard 使用 CrazyGames 的 Hide N Seek iframe。广告加载卡住时，用新标签打开。',
  social: 'Social 使用偏朋友组队体验的 hide-and-seek 浏览器游戏，适合社交玩法搜索。',
  'hide-n-seek-gd': 'GameDistribution 的经典 Hide N Seek，点击周围卡片会在中间直接切换。',
  'stickman-hide-seek': 'Stickman 躲猫猫浏览器版，适合补充更多同类游戏入口。',
  'horror-escape': 'Horror Escape 是恐怖逃脱型躲猫猫，有 Hide / Seek 两种身份。',
  'kitten-hide-seek': 'Kitten Hide And Seek 是轻量解谜躲藏玩法。',
  'skibidi-hide-seek': 'Skibidi Titans Hide And Seek 是追逐和逃脱方向的同类游戏。',
  'among-hide-seek': 'Among Them Hide N Seek 2 是卡通躲藏玩法。',
  'hunt-and-seek': 'Hunt And Seek 偏寻找隐藏角色和轻解谜。',
  'blumgi-slime': 'Blumgi Slime 是参考站同款方向，但来源是独立站点。',
  'wacky-steps': 'Wacky Steps 是参考站同款方向，但来源是独立站点。',
};

const EASY_LOAD_TIMEOUT_MS = 8000;
const EASY_POLL_INTERVAL_MS = 250;

function isEasyFrameReady(frame: HTMLIFrameElement | null) {
  if (!frame) return false;

  try {
    const doc = frame.contentDocument;
    const body = doc?.body;

    if (!doc || !body) return false;
    if (body.querySelector('.loader')) return false;

    const title = (doc.title || '').toLowerCase();
    const text = (body.textContent || '').toLowerCase();
    const html = (body.innerHTML || '').toLowerCase();

    // Match by host (any chameleon-game.com variant) or by recognisable game
    // surfaces. Don't require "meccha chameleon" exactly — some embeds
    // translate the title or skip it, and we'd rather show a real game
    // than fall back to a "new tab" button prematurely.
    let host = '';
    try {
      host = (frame.contentWindow?.location?.hostname || '').toLowerCase();
    } catch {
      host = '';
    }
    if (host.includes('chameleon-game.com') || host.includes('meccha')) {
      return true;
    }

    if (title.includes('hide') || title.includes('seek')) return true;
    if (text.includes('quick play')) return true;
    if (text.includes('play now')) return true;
    if (text.includes('start game')) return true;
    if (text.includes('find players')) return true;
    if (text.includes('round')) return true;
    if (text.includes('hide')) return true;
    if (text.includes('seek')) return true;

    return html.length > 1000;
  } catch {
    return false;
  }
}

export function DemoFrame({ locale = 'en' }: { locale?: string }) {
  const zh = locale === 'zh';
  const [activeId, setActiveId] = useState<Demo['id']>('easy');
  const [customDemo, setCustomDemo] = useState<Demo | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [easyFrameState, setEasyFrameState] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [isDesktopPlay, setIsDesktopPlay] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const activeDemo = customDemo ?? demos.find((demo) => demo.id === activeId) ?? demos[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 9000);
    return () => clearTimeout(t);
  }, [activeId]);

  useEffect(() => {
    const handleSelectDemo = (event: Event) => {
      const detail = (event as CustomEvent<{
        demoId?: string;
        title?: string;
        source?: string;
        src?: string;
        note?: string;
        openInNewTab?: string;
      }>).detail;
      const demoId = detail?.demoId;

      if (!demoId) return;

      const knownDemo = demos.find((demo) => demo.id === demoId);
      if (knownDemo) {
        setCustomDemo(null);
        setActiveId(demoId);
      } else if (detail?.src && detail.title && detail.source) {
        setCustomDemo({
          id: demoId,
          label: detail.title.split(' ')[0] || 'Game',
          title: detail.title,
          source: detail.source,
          ratio: 'aspect-[16/9] min-h-[650px] max-h-[90vh]',
          src: detail.src,
          note: detail.note || `${detail.title} opens in the center play frame.`,
          openInNewTab: detail.openInNewTab || detail.src,
        });
        setActiveId(demoId);
      } else {
        return;
      }

      setShowHint(true);
      if (demoId === 'easy') {
        setEasyFrameState('loading');
      }
    };

    window.addEventListener('meccha:select-demo', handleSelectDemo);

    return () => {
      window.removeEventListener('meccha:select-demo', handleSelectDemo);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (pointer: fine)');
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

  useEffect(() => {
    if (activeDemo.id !== 'easy') return;

    let finished = false;
    const finish = (state: 'ready' | 'fallback') => {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutId);
      clearInterval(pollId);
      setEasyFrameState(state);
    };

    const poll = () => {
      if (isEasyFrameReady(iframeRef.current)) {
        finish('ready');
      }
    };

    const timeoutId = window.setTimeout(() => {
      if (!finished) {
        setEasyFrameState((current) => (current === 'ready' ? current : 'fallback'));
      }
    }, EASY_LOAD_TIMEOUT_MS);
    const pollId = window.setInterval(poll, EASY_POLL_INTERVAL_MS);

    poll();

    return () => {
      finished = true;
      clearTimeout(timeoutId);
      clearInterval(pollId);
    };
  }, [activeDemo.id]);

  const openFallback = () => {
    window.open(activeDemo.openInNewTab, '_blank', 'noopener,noreferrer');
  };

  const handleFrameLoad = () => {
    if (activeDemo.id === 'easy') {
      setEasyFrameState('ready');
    }
  };

  const handlePrimaryAction = () => {
    if (activeDemo.id === 'easy' && easyFrameState !== 'ready') {
      openFallback();
      return;
    }

    requestAnimationFrame(() => iframeRef.current?.focus());
  };

  const mobileAspect = 'aspect-[16/9]';
  const mobileFrameSize = isLandscape
    ? 'max-h-[78vh] max-w-[78vw]'
    : 'min-h-[210px] max-h-[42vh] max-w-full';
  const mobileFrameRadius = isLandscape ? 'rounded-2xl' : 'rounded-lg';

  if (!isDesktopPlay) {
    const showMobileFallback = activeDemo.id === 'easy' && easyFrameState === 'fallback';
    const showMobileReady = activeDemo.id === 'easy' && easyFrameState === 'ready';

    return (
      <div id="play" className="scroll-mt-24">
        <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
          <div className="border-b border-white/70 px-4 py-3 text-[#2f2730]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-sm font-semibold">
                  {zh ? 'Mecha Chameleon 在线游戏' : 'Mecha Chameleon Game'} · {activeDemo.label}
                </div>
                <div className="mt-1 text-xs text-[#4C3B35]">
                  {activeDemo.title} via {activeDemo.source}
                </div>
              </div>
              <button
                type="button"
                onClick={openFallback}
                className="inline-flex min-h-9 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
              >
                <ExternalLink className="h-4 w-4" />
                {zh ? '在新标签里玩' : 'Play in new tab'}
              </button>
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
            {showMobileReady ? (
              <div
                className={`relative w-full ${mobileFrameSize} ${mobileAspect} ${mobileFrameRadius} overflow-hidden bg-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
              >
                <iframe
                  key={`${activeDemo.id}-mobile-ready`}
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
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-2">
                  <button
                    type="button"
                    onClick={openFallback}
                    className="pointer-events-auto inline-flex min-h-9 items-center gap-1.5 rounded-md border border-white/30 bg-white/95 px-3 text-xs font-semibold text-[#29211D] hover:bg-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {zh ? '放大到新标签' : 'Open in new tab'}
                  </button>
                </div>
              </div>
            ) : showMobileFallback ? (
              <button
                type="button"
                onClick={openFallback}
                className="flex h-64 w-64 flex-col items-center justify-center gap-4 rounded-full bg-[#ff6f9a] text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition hover:bg-[#e95a88] sm:h-72 sm:w-72"
              >
                <Gamepad2 className="h-16 w-16" />
                <span className="px-6 text-center text-2xl font-bold leading-tight sm:text-3xl">
                  {zh ? '在新标签里玩' : 'Click to Play in New Tab'}
                </span>
                <span className="text-sm font-medium opacity-90">
                  {activeDemo.label} · {activeDemo.title}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openFallback}
                className={`relative w-full ${mobileFrameSize} ${mobileAspect} ${mobileFrameRadius} overflow-hidden bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
              >
                <iframe
                  key={`${activeDemo.id}-mobile-loading`}
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
                  onLoad={handleFrameLoad}
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
                      {activeDemo.poster
                        ? zh
                          ? 'Meccha Chameleon 官方游戏'
                          : 'Official Meccha Chameleon game'
                        : zh
                          ? '正在尝试轻量内嵌加载…'
                          : 'Trying a lightweight embedded load…'}
                    </div>
                    <div className="text-xs text-[#4C3B35]">
                      {activeDemo.poster
                        ? zh
                          ? '官方站点保护内嵌加载，点击进入官方游戏。'
                          : 'The official site protects inline embeds. Tap to open the game.'
                        : zh
                          ? '卡住的话，直接点下方按钮。'
                          : 'If it stalls, tap the button below.'}
                    </div>
                    <span className="mt-1 inline-flex min-h-9 items-center gap-1.5 rounded-md bg-[#ff6f9a] px-4 text-xs font-semibold text-white">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {zh ? '在新标签里玩' : 'Play in new tab'}
                    </span>
                  </div>
                </div>
              </button>
            )}
          </div>

          <div className="border-t border-white/70 bg-white/60 px-4 py-3 text-xs leading-5 text-[#4C3B35]">
            {zh
              ? '手机首屏会按屏幕比例缩放游戏窗口；点屏幕可直接全屏玩，加载不动时显示居中的“新标签打开”按钮。'
              : 'On mobile the embedded game is scaled to fit the screen. Tap the play button to open the full experience in a new tab if the embed stalls.'}
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
                {zh ? 'Mecha Chameleon 在线游戏' : 'Mecha Chameleon Game'} · {activeDemo.label}
              </div>
              <div className="mt-1 text-xs text-[#4C3B35]">
                {activeDemo.title} via {activeDemo.source}
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="inline-flex min-h-9 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
            >
              <Gamepad2 className="h-4 w-4" />
              {zh
                ? activeDemo.id === 'easy' && easyFrameState !== 'ready'
                  ? '新标签打开'
                  : '点击开始'
                : activeDemo.id === 'easy' && easyFrameState !== 'ready'
                  ? 'Open New Tab'
                  : 'Click to Play'}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Game mode">
            {demos.map((demo) => (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={activeDemo.id === demo.id}
                onClick={() => {
                  setCustomDemo(null);
                  setActiveId(demo.id);
                  if (demo.id === 'easy') {
                    setEasyFrameState('loading');
                  }
                  setShowHint(true);
                }}
                className={`min-h-9 rounded-md border px-4 text-sm font-semibold transition ${
                  activeDemo.id === demo.id
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-mortar bg-white text-ink-900 hover:bg-brick-50'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-ink-500">
            {zh ? zhNotes[activeDemo.id] : activeDemo.note}
          </p>
        </div>

        <div className={`relative w-full overflow-hidden bg-brick-900 ${activeDemo.ratio}`}>
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
            onLoad={handleFrameLoad}
          />
          {activeDemo.id === 'easy' && easyFrameState !== 'ready' ? (
            <div className="absolute inset-0 flex items-end justify-center p-4">
              {activeDemo.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeDemo.poster}
                  alt={`${activeDemo.title} official screenshot`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="pointer-events-auto relative z-10 flex max-w-md items-start gap-3 rounded-lg border border-white/20 bg-white/95 px-4 py-3 text-sm text-ink-900 shadow-xl">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brick-500 text-white">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">
                    {easyFrameState === 'fallback'
                      ? zh
                        ? '官方游戏内嵌被拦截，点击打开官方站点。'
                        : 'The official embed is protected. Open the official game tab.'
                      : zh
                        ? '正在展示官方游戏截图，点击按钮进入游戏。'
                        : 'Showing the official game screenshot. Open the game to play.'}
                  </div>
                  <div className="mt-1 text-xs text-ink-500">
                    {zh ? '图片来自 Meccha Chameleon 官方 Steam 页面。' : 'Artwork from the official Meccha Chameleon Steam page.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openFallback}
                  className="shrink-0 rounded-md bg-brick-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brick-700"
                >
                  {zh ? '打开新标签' : 'Open Tab'}
                </button>
              </div>
            </div>
          ) : null}
          {showHint && activeDemo.id !== 'easy' ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border border-amber-300/40 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-lg">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <div className="font-semibold">
                    {zh ? '如果 iframe 加载卡住，点击下方新标签打开。' : 'If the iframe splash sticks, open the game in a new tab.'}
                  </div>
                  <div className="mt-1 text-xs text-amber-900/80">
                    {zh ? '第三方游戏源，非官方 Meccha Chameleon。' : 'Third-party game source, not the official Meccha Chameleon.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHint(false)}
                  className="-mr-1 -mt-1 rounded p-1 text-amber-700 hover:bg-amber-200/60"
                  aria-label="Dismiss hint"
                >
                  ×
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/70 bg-white/80 px-4 py-3 text-xs text-ink-500">
          <span>{zh ? '游戏已经在上方显示；卡住时可新标签打开。' : 'The game is visible above; use a new tab if loading gets stuck.'}</span>
          <a
            href={activeDemo.openInNewTab}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#D8CFC6] bg-white px-3 py-1.5 font-semibold text-[#29211D] hover:bg-[#fff7c8]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {zh ? `打开 ${activeDemo.label}` : `Open ${activeDemo.title}`}
          </a>
        </div>
      </div>
    </div>
  );
}
