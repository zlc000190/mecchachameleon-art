'use client';

import { useState, useRef } from 'react';
import { MousePointer2, ExternalLink } from 'lucide-react';

type Demo = {
  id: string;
  label: string;
  title: string;
  ratio: string;
  src: string;
  note: string;
  openInNewTab: string;
};

// Keep the default source close to the Meccha Chameleon search intent so
// players can enter a familiar play page first.
const demos: Demo[] = [
  {
    id: 'meccha-play',
    label: 'Easy',
    title: 'Meccha Chameleon',
    ratio: 'aspect-[16/10]',
    src: 'https://storytellergame.io/meccha-chameleon/',
    note: 'Start here if you searched for Meccha Chameleon and want to play right away.',
    openInNewTab: 'https://storytellergame.io/meccha-chameleon/',
  },
  {
    id: 'hidden-hunt',
    label: 'Hidden Hunt',
    title: 'Istanbul Hidden Objects',
    ratio: 'aspect-[16/10]',
    src: 'https://cdn.htmlgames.com/IstanbulHiddenObjects/index.html?npa=1',
    note: 'A bright hidden-object hunt with instant play and clear seek mechanics.',
    openInNewTab: 'https://www.htmlgames.com/game/Istanbul+Hidden+Objects',
  },
  {
    id: 'hide-seek',
    label: 'Hard',
    title: 'Hide N Seek',
    ratio: 'aspect-[9/16]',
    src: 'https://games.crazygames.com/en_US/hide-n-seek/index.html',
    note: 'A vertical hide-and-seek run with a simple play loop and quick restart.',
    openInNewTab: 'https://www.crazygames.com/game/hide-n-seek',
  },
];

export function DemoFrame() {
  const [activeId, setActiveId] = useState(demos[0].id);
  const activeDemo = demos.find((demo) => demo.id === activeId) ?? demos[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div id="play" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
        <div className="border-b border-white/70 px-4 py-3 text-[#2f2730]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">
                Play Now: {activeDemo.title}
              </div>
              <div className="text-xs text-[#5f5260]">
                No download. Runs in your browser.
              </div>
            </div>
            <MousePointer2 className="h-5 w-5 shrink-0 text-[#ff6f9a]" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Game selector">
            {demos.map((demo) => (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={activeDemo.id === demo.id}
                onClick={() => setActiveId(demo.id)}
                className={`min-h-8 rounded-md border px-3 text-xs font-semibold transition ${
                  activeDemo.id === demo.id
                    ? 'border-[#ff8fb3] bg-[#ff8fb3] text-white'
                    : 'border-white/80 bg-white/70 text-[#3b3038] hover:bg-white'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-[#5f5260]">
            {activeDemo.note}
          </p>
        </div>

        <div
          className={`relative w-full overflow-hidden bg-[#eef8ff] ${activeDemo.ratio}`}
        >
          <iframe
            key={activeDemo.id}
            ref={iframeRef}
            title={`${activeDemo.title} browser game`}
            src={activeDemo.src}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
            allowFullScreen
            scrolling="no"
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/70 bg-white/75 px-4 py-3 text-xs text-[#5f5260]">
          <span>Tip: if the embedded page is slow, open it in a new tab and keep playing.</span>
          <a
            href={activeDemo.openInNewTab}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#efc8d3] bg-white px-3 py-1.5 font-semibold text-[#3b3038] hover:bg-[#fff7c8]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open {activeDemo.title} in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
