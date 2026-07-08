import { ArrowLeft, Brush, CheckCircle2, Gamepad2, MousePointerClick, MapPinned, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;
const pagePath = '/es/donde-jugar';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: { title: 'Where to Play Meccha Chameleon - Free Browser Game', description: 'Where to play Meccha Chameleon free in your browser. No download, no signup - 6 official maps, friend rooms, and the paint-and-hide loop.' },
  zh: { title: 'Meccha Chameleon 在哪里玩 - 免费浏览器游戏', description: '在浏览器中免费玩 Meccha Chameleon。无需下载、无需注册 - 6 张官方地图、好友房间、涂色躲藏玩法。' },
  ru: { title: 'Где Играть в Meccha Chameleon - Бесплатная Браузерная Игра', description: 'Где играть в Meccha Chameleon бесплатно в браузере. Без скачивания, без регистрации - 6 официальных карт, комнаты с друзьями и механика камуфляжа.' },
  es: { title: 'Dónde Jugar Meccha Chameleon - Juego de Navegador Gratis', description: 'Dónde jugar Meccha Chameleon gratis en tu navegador. Sin descarga, sin registro - 6 mapas oficiales, salas con amigos y la mecánica de pintar y esconderse.' },
  fr: { title: 'Où Jouer à Meccha Chameleon - Jeu Navigateur Gratuit', description: 'Où jouer à Meccha Chameleon gratuitement dans votre navigateur. Sans téléchargement, sans inscription - 6 cartes officielles, salles entre amis et mécanique de peinture et dissimulation.' },
  ar: { title: 'أين تلعب ميتشا تشامليون - لعبة متصفح مجانية', description: 'أين تلعب ميتشا تشامليون مجاناً في متصفحك. بدون تنزيل، بدون تسجيل - 6 خرائط رسمية، غرف الأصدقاء، وآلية الطلاء والاختباء.' },
  pt: { title: 'Onde Jogar Meccha Chameleon - Jogo de Navegador Grátis', description: 'Onde jogar Meccha Chameleon grátis no seu navegador. Sem download, sem cadastro - 6 mapas oficiais, salas com amigos e a mecânica de pintar e esconder.' },
  de: { title: 'Wo Meccha Chameleon Spielen - Kostenloses Browserspiel', description: 'Wo du Meccha Chameleon kostenlos in deinem Browser spielen kannst. Kein Download, keine Registrierung - 6 offizielle Karten, Freundesräume und die Paint-and-Hide-Mechanik.' },
  it: { title: 'Dove Giocare a Meccha Chameleon - Gioco Browser Gratuito', description: 'Dove giocare a Meccha Chameleon gratis nel tuo browser. Senza download, senza registrazione - 6 mappe ufficiali, stanze con amici e la meccanica di dipingere e nascondersi.' },
  nl: { title: 'Waar Meccha Chameleon Spelen - Gratis Browserspel', description: 'Waar je Meccha Chameleon gratis in je browser kunt spelen. Geen download, geen registratie - 6 officiële kaarten, vriendenkamers en de paint-and-hide mechaniek.' },
  ja: { title: 'めっちゃカメレオンの遊び場 - 無料ブラウザゲーム', description: 'めっちゃカメレオンをブラウザで無料でプレイできる場所。ダウンロード不要、登録不要 - 公式マップ6枚、フレンドルーム、塗って隠すメカニック。' },
  ko: { title: 'Meccha Chameleon 플레이 장소 - 무료 브라우저 게임', description: 'Meccha Chameleon을 브라우저에서 무료로 플레이할 수 있는 곳. 다운로드, 가입 필요 없음 - 공식 맵 6개, 친구 방, 칠하고 숨기 메커니즘.' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
  const { locale } = await params;
  const m = metaByLocale[locale] ?? metaByLocale.en;
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);
  return { title: m.title, description: m.description, alternates: { canonical: canonicalUrl }, openGraph: { title: m.title, description: m.description, url: canonicalUrl }, twitter: { card: 'summary_large_image', title: m.title, description: m.description } };
}

const benefits = [
  { icon: Gamepad2, title: 'Gratis, sin registro', body: 'Abre la página, pulsa Play, y en segundos estás en una ronda. Sin cuenta, sin email, sin confirmación.' },
  { icon: Brush, title: 'Mecánica de camuflaje completa', body: 'Pinta paredes, combina el color secundario (juntas, sombras, reflejos) y escóndete en superficies ruidosas. Las mismas herramientas que la versión completa.' },
  { icon: MapPinned, title: '6 mapas oficiales', body: 'Mansión con biblioteca, casa de campo interior, alcantarilla, Osaka, hotel pingüino y backrooms - cada mapa con superficies e iluminación únicas.' },
];

const faqs = [
  { q: '¿Realmente es gratis jugar Meccha Chameleon?', a: 'Sí. La versión de navegador es completamente gratis - sin nivel premium, sin suscripción, sin compras dentro del juego.' },
  { q: '¿Necesito descargar algo?', a: 'No. El juego funciona directamente en el navegador. Abre la URL, pulsa Play y ya estás en una ronda. Sin instalador, sin permisos de administrador, sin launcher.' },
  { q: '¿Puedo jugar con amigos?', a: 'Sí. Usa la sala de amigos dentro del juego y comparte el código. Las salas con amigos admiten entre 4 y 8 jugadores según el mapa.' },
];

export default async function EsDondeJugarPage({ params }: { params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const pageUrl = await getCanonicalUrl(pagePath, locale);
  const backHref = getLocalizedPath(locale, '/#play');
  const isEs = locale === 'es';
  const title = isEs ? 'Dónde Jugar Meccha Chameleon' : 'Where to Play Meccha Chameleon';
  const lede = isEs
    ? 'Juega a Meccha Chameleon en tu navegador - sin descarga, sin registro, sin instalación. Pinta, escóndete del Buscador y sobrevive la ronda. 6 mapas oficiales y salas con amigos.'
    : 'Play Meccha Chameleon in your browser - no download, no signup, no install. Paint, hide from the Seeker, and survive the round. 6 official maps and friend rooms.';

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd items={[{ name: 'Home', item: homeUrl }, { name: title, item: pageUrl }]} />
      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-28 pb-10 lg:pt-36">
          <a href={backHref} className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
            <ArrowLeft className="h-4 w-4" />{isEs ? 'Volver al juego principal' : 'Back to home game'}
          </a>
          <div className="mb-6 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{isEs ? 'Juego de navegador gratis' : 'Free browser game'}</p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">{lede}</p>
          </div>
          <DemoFrame locale={locale} />
        </div>
      </section>
      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container grid gap-4 py-12 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
                <Icon className="mb-4 h-5 w-5 text-[#AA776E]" />
                <h2 className="text-lg font-semibold">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{benefit.body}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="bg-white">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{isEs ? 'Respuestas para jugadores' : 'Player answers'}</p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{isEs ? 'Preguntas frecuentes' : 'Free online play FAQ'}</h2>
            </div>
            <a href={getLocalizedPath(locale, '/maps')} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]">
              <MousePointerClick className="h-4 w-4" />{isEs ? 'Abrir guía de mapas' : 'Open map guide'}
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5">
                <CheckCircle2 className="mb-4 h-5 w-5 text-[#61a8ff]" />
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">{isEs ? '¿Quieres la versión sin bloqueos?' : 'Need the unblocked version?'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{isEs ? 'El mismo juego, abierto en una pestaña normal del navegador, funciona en escuelas y oficinas.' : 'The same game, opened in a normal browser tab, works at schools and offices.'}</p>
                </div>
                <a href={getLocalizedPath(locale, '/unblocked')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Sparkles className="h-4 w-4" />{isEs ? 'Sin bloqueos' : 'Unblocked'}
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">{isEs ? '¿Quieres jugar con amigos?' : 'Want to play with friends?'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{isEs ? 'Crea una sala con amigos y comparte el código - hasta 8 jugadores en un mismo mapa.' : 'Create a friend room and share the code - up to 8 players on one map.'}</p>
                </div>
                <a href={getLocalizedPath(locale, '/new-player')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Users className="h-4 w-4" />{isEs ? 'Guía para nuevos' : 'New player guide'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
