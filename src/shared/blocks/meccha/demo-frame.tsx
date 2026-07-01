'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Gamepad2, Sparkles } from 'lucide-react';

type Demo = {
  id: 'easy' | 'hard' | 'social';
  label: string;
  title: string;
  source: string;
  ratio: string;
  src: string;
  note: string;
  openInNewTab: string;
};

const demos: Demo[] = [
  {
    id: 'easy',
    label: 'Easy',
    title: 'Meccha Chameleon Browser Game',
    source: 'Geometry Online',
    ratio: 'aspect-[16/9] min-h-[520px] max-h-[86vh]',
    src: 'https://chameleon-game.com/',
    note: 'Easy mode opens the Meccha Chameleon game screen directly, with Quick play, room creation, and practice visible right away.',
    openInNewTab: 'https://chameleon-game.com/',
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
];

const zhNotes: Record<Demo['id'], string> = {
  easy: 'Easy 直接打开 Meccha Chameleon 游戏屏，进入后就能看到 Quick play、创建房间和练习模式。',
  hard: 'Hard 使用 CrazyGames 的 Hide N Seek iframe。广告加载卡住时，用新标签打开。',
  social: 'Social 使用偏朋友组队体验的 hide-and-seek 浏览器游戏，适合社交玩法搜索。',
};

export function DemoFrame({ locale = 'en' }: { locale?: string }) {
  const zh = locale === 'zh';
  const [activeId, setActiveId] = useState<Demo['id']>('easy');
  const [showHint, setShowHint] = useState(true);
  const [loaded, setLoaded] = useState(true);
  const activeDemo = demos.find((demo) => demo.id === activeId) ?? demos[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 9000);
    return () => clearTimeout(t);
  }, [activeId]);

  function startGame() {
    setLoaded(true);
    requestAnimationFrame(() => iframeRef.current?.focus());
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
              onClick={startGame}
              className="inline-flex min-h-9 w-fit items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
            >
              <Gamepad2 className="h-4 w-4" />
              {zh ? '点击开始' : 'Click to Play'}
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
                  setActiveId(demo.id);
                  setLoaded(true);
                  setShowHint(true);
                }}
                className={`min-h-9 rounded-md border px-4 text-sm font-semibold transition ${
                  activeDemo.id === demo.id
                    ? 'border-[#29211D] bg-[#29211D] text-white'
                    : 'border-[#efc8d3] bg-white text-[#29211D] hover:bg-[#fff7c8]'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#4C3B35]">
            {zh ? zhNotes[activeDemo.id] : activeDemo.note}
          </p>
        </div>

        <div className={`relative w-full overflow-hidden bg-[#eef8ff] ${activeDemo.ratio}`}>
          {loaded ? (
            <iframe
              key={activeDemo.id}
              ref={iframeRef}
              title={`${activeDemo.title} browser game`}
              src={activeDemo.src}
              className={
                'absolute inset-0 h-full w-full'
              }
              loading="eager"
              allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
              allowFullScreen
              scrolling="no"
              referrerPolicy="origin"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#fff7c8_0,#ffd2e1_34%,#cdefff_100%)] p-6 text-center">
              <div className="max-w-md rounded-2xl border border-white/80 bg-white/85 p-7 shadow-xl backdrop-blur">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6f9a] text-white shadow-lg">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#29211D]">{activeDemo.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4C3B35]">
                  {zh
                    ? '点击开始游戏；如果加载卡住，可以用下方的新标签打开。'
                    : 'Click to start playing. If the game gets stuck while loading, use the new-tab option below.'}
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]"
                >
                  <Gamepad2 className="h-4 w-4" />
                  {zh ? '点击开始' : 'Click to Play'}
                </button>
              </div>
            </div>
          )}
          {loaded && showHint && activeDemo.id !== 'easy' ? (
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/70 bg-white/80 px-4 py-3 text-xs text-[#4C3B35]">
          <span>{zh ? '游戏已经在上方显示；卡住时可新标签打开。' : 'The game is visible above; use a new tab if loading gets stuck.'}</span>
          {loaded ? (
            <a
              href={activeDemo.openInNewTab}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D8CFC6] bg-white px-3 py-1.5 font-semibold text-[#29211D] hover:bg-[#fff7c8]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {zh ? `打开 ${activeDemo.label}` : `Open ${activeDemo.title}`}
            </a>
          ) : (
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D8CFC6] bg-white px-3 py-1.5 font-semibold text-[#29211D] hover:bg-[#fff7c8]"
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              {zh ? `加载 ${activeDemo.label}` : `Load ${activeDemo.title}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
