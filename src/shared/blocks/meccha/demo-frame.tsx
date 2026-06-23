'use client';

import { useState, useRef, useEffect } from 'react';
import { MousePointer2, ExternalLink, Sparkles } from 'lucide-react';

type Demo = {
  id: string;
  label: string;
  title: string;
  source: string;
  ratio: string;
  src: string;
  note: string;
  openInNewTab: string;
};

// Three difficulty / flavor tiers. Each one is a third-party HTML5
// hide-and-seek / camo game explicitly labeled as NOT the official Meccha
// Chameleon. We always surface "Open in new tab" so the user can fall back
// to a fullscreen window if the iframe splash blocks them.
//
//  - easy:   GameDistribution Hide N Seek!        (most stable, 2D casual)
//  - hard:   GameMonetize Hide And Seek Io        (closer in spirit to the
//            Steam game, red/blue seekers, but provider stability is weaker)
//  - social: GameDistribution Sneaky Friends      (multiplayer hide-and-seek)
const demos: Demo[] = [
  {
    id: 'easy',
    label: 'Easy',
    title: 'Hide N Seek!',
    source: 'GameDistribution',
    ratio: 'aspect-[440/750] sm:aspect-[16/10] lg:aspect-[440/750]',
    src: 'https://embed.gamedistribution.com/?url=https://html5.gamedistribution.com/7eda2be289604aa89f3b97df59661bfe/&width=440&height=750&language=en&gdpr-tracking=1&gdpr-targeting=1&gd_sdk_referrer_url=https://mecchachameleon.art/',
    note: 'Most stable embed in testing. Good for instant play. Click "Continue" inside the game to start.',
    openInNewTab: 'https://html5.gamedistribution.com/7eda2be289604aa89f3b97df59661bfe/',
  },
  {
    id: 'hard',
    label: 'Hard',
    title: 'Hide N Seek',
    source: 'CrazyGames',
    ratio: 'aspect-[9/16]',
    src: 'https://games.crazygames.com/en_US/hide-n-seek/index.html',
    note: 'Same browser demo that mechachameleon.org ships in its hero slot. CrazyGames bundles the 15 MB Unity WebGL bundle in a gameframe that is ad-funded; if you run an ad blocker or the ad network is slow, click "Continue offline" inside the iframe to start the game from the browser cache.',
    openInNewTab: 'https://www.crazygames.com/game/hide-n-seek',
  },
  {
    id: 'social',
    label: 'Social',
    title: 'Sneaky Friends',
    source: 'GameDistribution',
    ratio: 'aspect-[480/800] sm:aspect-[16/10] lg:aspect-[480/800]',
    src: 'https://embed.gamedistribution.com/?url=https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/&width=480&height=800&language=en&gdpr-tracking=1&gdpr-targeting=1&gd_sdk_referrer_url=https://mecchachameleon.art/',
    note: 'Multiplayer hide-and-seek. Best when you want to play with friends in the browser. Click "Continue" inside the game to start.',
    openInNewTab: 'https://html5.gamedistribution.com/8529938662c2447091414e2cc73983e3/',
  },
];

export function DemoFrame() {
  const [activeId, setActiveId] = useState(demos[0].id);
  const [showHint, setShowHint] = useState(true);
  const activeDemo = demos.find((demo) => demo.id === activeId) ?? demos[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-dismiss the "click Continue" hint a few seconds after the user
  // switches tabs. The 8s timer resets whenever activeId changes.
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(t);
  }, [activeId]);

  return (
    <div id="demo" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[#29211D] bg-[#29211D] shadow-[0_18px_60px_rgba(32,35,30,0.25)]">
        <div className="border-b border-white/10 px-4 py-3 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">
                Browser Demo: {activeDemo.title}
              </div>
              <div className="text-xs text-white/60">
                Third-party HTML5 demo via {activeDemo.source}
              </div>
            </div>
            <MousePointer2 className="h-5 w-5 shrink-0 text-[#e0b44d]" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Demo difficulty">
            {demos.map((demo) => (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={activeDemo.id === demo.id}
                onClick={() => {
                  setActiveId(demo.id);
                  setShowHint(true);
                }}
                className={`min-h-8 rounded-md border px-3 text-xs font-semibold transition ${
                  activeDemo.id === demo.id
                    ? 'border-[#C9B2A8] bg-[#C9B2A8] text-[#10211b]'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-white/60">
            {activeDemo.note}
          </p>
        </div>

        <div
          className={`relative max-h-[62vh] sm:max-h-[68vh] w-full overflow-hidden rounded-md bg-black sm:rounded-lg ${activeDemo.ratio}`}
        >
          <iframe
            key={activeDemo.id}
            ref={iframeRef}
            title={`${activeDemo.title} browser demo`}
            src={activeDemo.src}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
            allowFullScreen
            scrolling="no"
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
          />
          {showHint && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border border-amber-300/40 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-lg">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <div className="font-semibold">
                    If the splash sticks, click <span className="rounded bg-amber-200 px-1.5 py-0.5 text-amber-900">Continue offline</span> inside the game.
                  </div>
                  <div className="mt-1 text-xs text-amber-900/80">
                    Third-party ad-funded demo. Disable ad blockers for the first load, then the
                    15 MB Unity WebGL bundle caches locally.
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
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#1c1c1a] px-4 py-3 text-xs text-white/70">
          <span>
            Tip: if the demo does not load, open it in a new tab for the full experience.
          </span>
          <a
            href={activeDemo.openInNewTab}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open {activeDemo.title} in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
