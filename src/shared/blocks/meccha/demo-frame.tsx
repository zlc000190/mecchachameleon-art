'use client';

import { useRef } from 'react';
import { Gamepad2 } from 'lucide-react';

const gameSrc = 'https://storytellergame.io/meccha-chameleon/';

export function DemoFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div id="play" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/70 px-4 py-3 text-[#2f2730]">
          <div className="text-sm font-semibold">Meccha Chameleon</div>
          <button
            type="button"
            onClick={() => iframeRef.current?.focus()}
            className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
          >
            <Gamepad2 className="h-4 w-4" />
            Click to Play
          </button>
        </div>

        <div className="relative h-[760px] w-full overflow-hidden bg-[#eef8ff] sm:h-[860px] lg:h-[980px] xl:h-[1080px]">
          <iframe
            ref={iframeRef}
            title="Meccha Chameleon browser game"
            src={gameSrc}
            className="absolute inset-x-0 -top-[360px] h-[calc(100%+360px)] w-full sm:-top-[420px] sm:h-[calc(100%+420px)] lg:-top-[520px] lg:h-[calc(100%+520px)]"
            loading="lazy"
            allow="autoplay; fullscreen; gamepad; pointer-lock; encrypted-media; web-share"
            allowFullScreen
            scrolling="yes"
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-top-navigation allow-presentation"
          />
        </div>
      </div>
    </div>
  );
}
