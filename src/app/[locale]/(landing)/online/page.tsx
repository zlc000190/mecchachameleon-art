import { ArrowLeft, Brush, CheckCircle2, Gamepad2, MapPinned, MousePointerClick, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;
const pagePath = '/ja/online';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: { title: 'Meccha Chameleon Online Play - Free Japanese Version', description: 'Play Meccha Chameleon online free in your browser. Japanese-language version, no download, no signup - 6 maps, friend rooms, paint and hide.' },
  zh: { title: 'Meccha Chameleon 在线玩 - 免费日语版', description: '在浏览器中免费玩 Meccha Chameleon。日语版、无需下载、无需注册 - 6 张地图、好友房间、涂色躲藏。' },
  ru: { title: 'Meccha Chameleon Онлайн - Бесплатная Японская Версия', description: 'Играйте в Meccha Chameleon онлайн бесплатно в браузере. Японская версия, без скачивания, без регистрации - 6 карт, комнаты с друзьями, камуфляж.' },
  ja: { title: 'めっちゃカメレオン オンライン - 無料ブラウザゲーム', description: 'ブラウザで「めっちゃカメレオン」をオンラインで無料プレイ。日本語版、ダウンロード不要、登録不要 - 6枚のマップ、フレンドルーム、塗って隠す遊び。' },
  es: { title: 'Meccha Chameleon Jugar Online - Versión en Japonés Gratis', description: 'Juega a Meccha Chameleon online gratis en tu navegador. Versión en japonés, sin descarga, sin registro - 6 mapas, salas con amigos, pintar y esconderse.' },
  fr: { title: 'Meccha Chameleon Jouer en Ligne - Version Japonaise Gratuite', description: 'Jouez à Meccha Chameleon en ligne gratuitement dans votre navigateur. Version japonaise, sans téléchargement, sans inscription - 6 cartes, salles entre amis, peinture et dissimulation.' },
  ar: { title: 'ميتشا تشامليون العب أونلاين - النسخة اليابانية المجانية', description: 'العب ميتشا تشامليون أونلاين مجاناً في متصفحك. النسخة اليابانية، بدون تنزيل، بدون تسجيل - 6 خرائط، غرف الأصدقاء، الطلاء والاختباء.' },
  pt: { title: 'Meccha Chameleon Jogar Online - Versão Japonesa Grátis', description: 'Jogue Meccha Chameleon online grátis no seu navegador. Versão japonesa, sem download, sem cadastro - 6 mapas, salas com amigos, pintar e esconder.' },
  de: { title: 'Meccha Chameleon Online Spielen - Japanische Version Gratis', description: 'Spiele Meccha Chameleon online kostenlos in deinem Browser. Japanische Version, kein Download, keine Registrierung - 6 Karten, Freundesräume, Paint-and-Hide.' },
  it: { title: 'Meccha Chameleon Giocare Online - Versione Giapponese Gratuita', description: 'Gioca a Meccha Chameleon online gratis nel tuo browser. Versione giapponese, senza download, senza registrazione - 6 mappe, stanze con amici, dipingere e nascondersi.' },
  nl: { title: 'Meccha Chameleon Online Spelen - Japanse Versie Gratis', description: 'Speel Meccha Chameleon online gratis in je browser. Japanse versie, geen download, geen registratie - 6 kaarten, vriendenkamers, paint-and-hide.' },
  ko: { title: 'Meccha Chameleon 온라인 플레이 - 일본어 버전 무료', description: '브라우저에서 Meccha Chameleon을 온라인으로 무료 플레이하세요. 일본어 버전, 다운로드, 가입 필요 없음 - 6개 맵, 친구 방, 칠하고 숨기.' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
  const { locale } = await params;
  const m = metaByLocale[locale] ?? metaByLocale.en;
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);
  return { title: m.title, description: m.description, alternates: { canonical: canonicalUrl }, openGraph: { title: m.title, description: m.description, url: canonicalUrl }, twitter: { card: 'summary_large_image', title: m.title, description: m.description } };
}

const benefits = [
  { icon: Gamepad2, title: '無料、登録不要', body: 'ページを開いて「Play」を押せば、ほんの数秒でラウンドが始まります。アカウント、メール、確認不要。' },
  { icon: Brush, title: '完全な変装メカニクス', body: '壁を塗り、二次色（目地、影、反射）を合わせ、模様のあるサーフェスに隠れる。フルバージョンと同じツール。' },
  { icon: MapPinned, title: '6つの公式マップ', body: '図書館付き邸宅、田舎の室内、下水道、大阪、ペンギンホテル、Backrooms - マップごとに異なるサーフェスと光。' },
];

const faqs = [
  { q: 'めっちゃカメレオンは本当に無料ですか？', a: 'はい。ブラウザ版は完全無料 - プレミアム層なし、サブスクリプションなし、アプリ内購入なし。' },
  { q: '何かダウンロードが必要ですか？', a: 'いいえ。ゲームはブラウザで直接動作します。URLを開いて「Play」をクリックすれば、ラウンドが始まります。インストーラーも管理者権限もランチャーも不要。' },
  { q: '友達と一緒に遊べますか？', a: 'はい。ゲーム内のフレンドルームを使ってルームコードを共有してください。フレンドルームは 4-8 人対応（マップによる）。' },
];

export default async function JaOnlinePage({ params }: { params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const pageUrl = await getCanonicalUrl(pagePath, locale);
  const backHref = getLocalizedPath(locale, '/#play');
  const isJa = locale === 'ja';
  const title = isJa ? 'めっちゃカメレオン オンライン' : 'Meccha Chameleon Online';
  const lede = isJa
    ? 'ブラウザで「めっちゃカメレオン」をオンラインでプレイ - ダウンロード不要、登録不要、インストール不要。塗って、鬼から隠れて、ラウンドを生き残ろう。6 つの公式マップとフレンドルーム。'
    : 'Play Meccha Chameleon online in your browser - no download, no signup, no install. Paint, hide from the seeker, and survive the round. 6 official maps and friend rooms.';

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd items={[{ name: 'Home', item: homeUrl }, { name: title, item: pageUrl }]} />
      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-28 pb-10 lg:pt-36">
          <a href={backHref} className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
            <ArrowLeft className="h-4 w-4" />{isJa ? 'ホームのゲームへ戻る' : 'Back to home game'}
          </a>
          <div className="mb-6 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{isJa ? '無料ブラウザゲーム' : 'Free browser game'}</p>
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{isJa ? 'プレイヤーへの回答' : 'Player answers'}</p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{isJa ? 'よくある質問' : 'Free online play FAQ'}</h2>
            </div>
            <a href={getLocalizedPath(locale, '/maps')} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]">
              <MousePointerClick className="h-4 w-4" />{isJa ? 'マップガイドを開く' : 'Open map guide'}
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
                  <h3 className="font-semibold">{isJa ? 'ブロック解除版が必要ですか？' : 'Need the unblocked version?'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{isJa ? '同じゲームで、通常のブラウザタブで開くので、学校やオフィスでも動作します。' : 'The same game, opened in a normal browser tab, works at schools and offices.'}</p>
                </div>
                <a href={getLocalizedPath(locale, '/unblocked')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Sparkles className="h-4 w-4" />{isJa ? 'ブロック解除' : 'Unblocked'}
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">{isJa ? '友達と一緒に遊びたい？' : 'Want to play with friends?'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{isJa ? 'フレンドルームを作ってコードを共有 - 1 つのマップで最大 8 人まで。' : 'Create a friend room and share the code - up to 8 players on one map.'}</p>
                </div>
                <a href={getLocalizedPath(locale, '/new-player')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Users className="h-4 w-4" />{isJa ? '初心者ガイド' : 'New player guide'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
