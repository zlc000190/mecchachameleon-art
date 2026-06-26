'use client';

import { useRef, useState } from 'react';
import { Gamepad2, Play } from 'lucide-react';

const gameSrc = 'https://storytellergame.io/meccha-chameleon/';

const frameCopy: Record<string, { title: string; play: string; iframe: string; note: string }> = {
  en: { title: 'Meccha Chameleon', play: 'Click to Play', iframe: 'Meccha Chameleon browser game', note: 'The browser demo loads only after you click, so Google does not read third-party game-page breadcrumbs as part of this site.' },
  zh: { title: '超级变色龙 Meccha Chameleon', play: '点击开始', iframe: '超级变色龙浏览器游戏', note: '点击后才加载浏览器游戏，避免 Google 把第三方游戏页的旧面包屑识别到本站。' },
  ru: { title: 'Meccha Chameleon', play: 'Нажмите, чтобы играть', iframe: 'браузерная игра Meccha Chameleon', note: 'Демо загружается только после клика, чтобы Google не считывал сторонние breadcrumbs как часть сайта.' },
  it: { title: 'Meccha Chameleon', play: 'Clicca per giocare', iframe: 'gioco browser Meccha Chameleon', note: 'La demo si carica solo dopo il clic, evitando breadcrumb di terze parti nel rendering Google.' },
  fr: { title: 'Meccha Chameleon', play: 'Cliquer pour jouer', iframe: 'jeu navigateur Meccha Chameleon', note: 'La démo se charge après le clic pour éviter les breadcrumbs tiers dans le rendu Google.' },
  de: { title: 'Meccha Chameleon', play: 'Zum Spielen klicken', iframe: 'Meccha Chameleon Browser-Spiel', note: 'Die Demo lädt erst nach dem Klick, damit Google keine Drittanbieter-Breadcrumbs übernimmt.' },
  es: { title: 'Meccha Chameleon', play: 'Haz clic para jugar', iframe: 'juego de navegador Meccha Chameleon', note: 'La demo se carga solo tras hacer clic para evitar breadcrumbs externos en Google.' },
  pt: { title: 'Meccha Chameleon', play: 'Clique para jogar', iframe: 'jogo de navegador Meccha Chameleon', note: 'A demo carrega só após o clique para evitar breadcrumbs de terceiros no Google.' },
  ja: { title: 'Meccha Chameleon', play: 'クリックしてプレイ', iframe: 'Meccha Chameleon ブラウザゲーム', note: 'クリック後にだけデモを読み込み、Google が外部ページのパンくずを拾わないようにしています。' },
  ko: { title: 'Meccha Chameleon', play: '클릭해서 플레이', iframe: 'Meccha Chameleon 브라우저 게임', note: '클릭 후에만 데모를 로드해 Google이 외부 페이지 breadcrumb를 읽지 않게 합니다.' },
  ar: { title: 'Meccha Chameleon', play: 'انقر للعب', iframe: 'لعبة Meccha Chameleon في المتصفح', note: 'يتم تحميل العرض بعد النقر فقط حتى لا يقرأ Google مسارات تنقل خارجية.' },
  th: { title: 'Meccha Chameleon', play: 'คลิกเพื่อเล่น', iframe: 'เกมเบราว์เซอร์ Meccha Chameleon', note: 'โหลดเดโมหลังคลิกเท่านั้น เพื่อไม่ให้ Google อ่าน breadcrumb ของเว็บภายนอก' },
  vi: { title: 'Meccha Chameleon', play: 'Bấm để chơi', iframe: 'trò chơi trình duyệt Meccha Chameleon', note: 'Demo chỉ tải sau khi bấm để Google không đọc breadcrumb từ trang bên thứ ba.' },
  'zh-TW': { title: 'Meccha Chameleon', play: '點擊開始', iframe: 'Meccha Chameleon 瀏覽器遊戲', note: '點擊後才載入瀏覽器遊戲，避免 Google 把第三方遊戲頁的舊麵包屑算到本站。' },
  nl: { title: 'Meccha Chameleon', play: 'Klik om te spelen', iframe: 'Meccha Chameleon browsergame', note: 'De demo laadt pas na een klik, zodat Google geen externe breadcrumbs meeneemt.' },
};

export function DemoFrame({ locale = 'en' }: { locale?: string }) {
  const copy = frameCopy[locale] ?? frameCopy.en;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  function startGame() {
    setLoaded(true);
    requestAnimationFrame(() => iframeRef.current?.focus());
  }

  return (
    <div id="play" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[#efc8d3] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff] shadow-[0_18px_60px_rgba(134,103,124,0.18)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/70 px-4 py-3 text-[#2f2730]">
          <div className="text-sm font-semibold">{copy.title}</div>
          <button
            type="button"
            onClick={startGame}
            className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#ff6f9a] px-4 text-sm font-semibold text-white transition hover:bg-[#e95a88]"
          >
            <Gamepad2 className="h-4 w-4" />
            {copy.play}
          </button>
        </div>

        <div className="relative h-[760px] w-full overflow-hidden bg-[#eef8ff] sm:h-[860px] lg:h-[980px] xl:h-[1080px]">
          {loaded ? (
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
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#fff7c8_0,#ffd2e1_34%,#cdefff_100%)] p-6 text-center">
              <div className="max-w-md rounded-2xl border border-white/80 bg-white/85 p-7 shadow-xl backdrop-blur">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6f9a] text-white shadow-lg">
                  <Play className="h-6 w-6 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-[#29211D]">{copy.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4C3B35]">{copy.note}</p>
                <button
                  type="button"
                  onClick={startGame}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]"
                >
                  <Gamepad2 className="h-4 w-4" />
                  {copy.play}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
