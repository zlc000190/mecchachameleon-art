'use client';

import { useRef } from 'react';
import { Gamepad2 } from 'lucide-react';

const gameSrc = 'https://storytellergame.io/meccha-chameleon/';

const frameCopy: Record<string, { title: string; play: string; iframe: string }> = {
  en: { title: 'Meccha Chameleon', play: 'Click to Play', iframe: 'Meccha Chameleon browser game' },
  zh: { title: '超级变色龙 Meccha Chameleon', play: '点击开始', iframe: '超级变色龙浏览器游戏' },
  ru: { title: 'Meccha Chameleon', play: 'Нажмите, чтобы играть', iframe: 'браузерная игра Meccha Chameleon' },
  it: { title: 'Meccha Chameleon', play: 'Clicca per giocare', iframe: 'gioco browser Meccha Chameleon' },
  fr: { title: 'Meccha Chameleon', play: 'Cliquer pour jouer', iframe: 'jeu navigateur Meccha Chameleon' },
  de: { title: 'Meccha Chameleon', play: 'Zum Spielen klicken', iframe: 'Meccha Chameleon Browser-Spiel' },
  es: { title: 'Meccha Chameleon', play: 'Haz clic para jugar', iframe: 'juego de navegador Meccha Chameleon' },
  pt: { title: 'Meccha Chameleon', play: 'Clique para jogar', iframe: 'jogo de navegador Meccha Chameleon' },
  ja: { title: 'Meccha Chameleon', play: 'クリックしてプレイ', iframe: 'Meccha Chameleon ブラウザゲーム' },
  ko: { title: 'Meccha Chameleon', play: '클릭해서 플레이', iframe: 'Meccha Chameleon 브라우저 게임' },
  ar: { title: 'Meccha Chameleon', play: 'انقر للعب', iframe: 'لعبة Meccha Chameleon في المتصفح' },
  th: { title: 'Meccha Chameleon', play: 'คลิกเพื่อเล่น', iframe: 'เกมเบราว์เซอร์ Meccha Chameleon' },
  vi: { title: 'Meccha Chameleon', play: 'Bấm để chơi', iframe: 'trò chơi trình duyệt Meccha Chameleon' },
  'zh-TW': { title: 'Meccha Chameleon', play: '點擊開始', iframe: 'Meccha Chameleon 瀏覽器遊戲' },
  nl: { title: 'Meccha Chameleon', play: 'Klik om te spelen', iframe: 'Meccha Chameleon browsergame' },
};

export function DemoFrame({ locale = 'en' }: { locale?: string }) {
  const copy = frameCopy[locale] ?? frameCopy.en;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div id="play" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/70 px-4 py-3 text-[#2f2730]">
          <div className="text-sm font-semibold">{copy.title}</div>
          <button
            type="button"
            onClick={() => iframeRef.current?.focus()}
            className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
          >
            <Gamepad2 className="h-4 w-4" />
            {copy.play}
          </button>
        </div>

        <div className="relative h-[760px] w-full overflow-hidden bg-[#eef8ff] sm:h-[860px] lg:h-[980px] xl:h-[1080px]">
          <iframe
            ref={iframeRef}
            title={copy.iframe}
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
