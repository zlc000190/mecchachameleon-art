import { ArrowLeft, Brush, CheckCircle2, Gamepad2, MapPinned, MousePointerClick, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;
const pagePath = '/ar/download';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: { title: 'Download Meccha Chameleon - Free Browser Game', description: 'Download Meccha Chameleon free in your browser. No install, no signup - 6 official maps, friend rooms, and the paint-and-hide loop.' },
  zh: { title: 'Meccha Chameleon 下载 - 免费浏览器游戏', description: '在浏览器中免费下载玩 Meccha Chameleon。无需安装、无需注册 - 6 张官方地图、好友房间、涂色躲藏玩法。' },
  ru: { title: 'Скачать Meccha Chameleon - Бесплатная Браузерная Игра', description: 'Скачайте Meccha Chameleon бесплатно в браузере. Без установки, без регистрации - 6 официальных карт, комнаты с друзьями и механика камуфляжа.' },
  ar: { title: 'تحميل ميتشا تشامليون - لعبة متصفح مجانية', description: 'حمل ميتشا تشامليون مجاناً في متصفحك. بدون تثبيت، بدون تسجيل - 6 خرائط رسمية، غرف الأصدقاء، وآلية الطلاء والاختباء.' },
  es: { title: 'Descargar Meccha Chameleon - Juego de Navegador Gratis', description: 'Descarga Meccha Chameleon gratis en tu navegador. Sin instalación, sin registro - 6 mapas oficiales, salas con amigos y la mecánica de pintar y esconderse.' },
  fr: { title: 'Télécharger Meccha Chameleon - Jeu Navigateur Gratuit', description: 'Téléchargez Meccha Chameleon gratuitement dans votre navigateur. Sans installation, sans inscription - 6 cartes officielles, salles entre amis et mécanique de peinture et dissimulation.' },
  pt: { title: 'Baixar Meccha Chameleon - Jogo de Navegador Grátis', description: 'Baixe Meccha Chameleon grátis no seu navegador. Sem instalação, sem cadastro - 6 mapas oficiais, salas com amigos e a mecânica de pintar e esconder.' },
  de: { title: 'Meccha Chameleon Herunterladen - Kostenloses Browserspiel', description: 'Lade Meccha Chameleon kostenlos in deinem Browser herunter. Keine Installation, keine Registrierung - 6 offizielle Karten, Freundesräume und die Paint-and-Hide-Mechanik.' },
  it: { title: 'Scaricare Meccha Chameleon - Gioco Browser Gratuito', description: 'Scarica Meccha Chameleon gratis nel tuo browser. Senza installazione, senza registrazione - 6 mappe ufficiali, stanze con amici e la meccanica di dipingere e nascondersi.' },
  nl: { title: 'Meccha Chameleon Downloaden - Gratis Browserspel', description: 'Download Meccha Chameleon gratis in je browser. Geen installatie, geen registratie - 6 officiële kaarten, vriendenkamers en de paint-and-hide mechaniek.' },
  ja: { title: 'めっちゃカメレオン ダウンロード - 無料ブラウザゲーム', description: 'ブラウザで「めっちゃカメレオン」を無料でダウンロードプレイ。インストール不要、登録不要 - 公式マップ6枚、フレンドルーム、塗って隠すメカニック。' },
  ko: { title: 'Meccha Chameleon 다운로드 - 무료 브라우저 게임', description: '브라우저에서 Meccha Chameleon을 무료로 다운로드 플레이하세요. 설치, 가입 필요 없음 - 공식 맵 6개, 친구 방, 칠하고 숨기 메커니즘.' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
  const { locale } = await params;
  const m = metaByLocale[locale] ?? metaByLocale.en;
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);
  return { title: m.title, description: m.description, alternates: { canonical: canonicalUrl }, openGraph: { title: m.title, description: m.description, url: canonicalUrl }, twitter: { card: 'summary_large_image', title: m.title, description: m.description } };
}

const benefits = [
  { icon: Gamepad2, title: 'مجاني، بدون تسجيل', body: 'افتح الصفحة، اضغط على Play، وفي ثوانٍ تكون في جولة. بدون حساب، بدون بريد إلكتروني، بدون تأكيد.' },
  { icon: Brush, title: 'آلية التمويه الكاملة', body: 'لوّن الجدران، طابق اللون الثانوي (الدرزات، الظلال، الانعكاسات) واختبئ في الأسطح المزدحمة. نفس الأدوات الموجودة في النسخة الكاملة.' },
  { icon: MapPinned, title: '6 خرائط رسمية', body: 'القصر مع المكتبة، المنزل الريفي الداخلي، المجاري، أوساكا، فندق البطريق والـ Backrooms - كل خريطة بأسطح وإضاءة فريدة.' },
];

const faqs = [
  { q: 'هل ميتشا تشامليون مجاني فعلاً؟', a: 'نعم. نسخة المتصفح مجانية بالكامل - بدون مستوى مميز، بدون اشتراك، بدون مشتريات داخل اللعبة.' },
  { q: 'هل أحتاج إلى تنزيل أي شيء؟', a: 'لا. اللعبة تعمل مباشرة في المتصفح. افتح عنوان URL، اضغط على Play، وفي ثوانٍ تكون في جولة. بدون مثبت، بدون صلاحيات المسؤول، بدون مشغل منفصل.' },
  { q: 'هل يمكنني اللعب مع الأصدقاء؟', a: 'نعم. استخدم غرفة الأصدقاء داخل اللعبة وشارك رمز الغرفة. غرف الأصدقاء تدعم من 4 إلى 8 لاعبين حسب الخريطة.' },
];

export default async function ArDownloadPage({ params }: { params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const pageUrl = await getCanonicalUrl(pagePath, locale);
  const backHref = getLocalizedPath(locale, '/#play');
  const isAr = locale === 'ar';
  const title = isAr ? 'تحميل ميتشا تشامليون' : 'Download Meccha Chameleon';
  const lede = isAr
    ? 'العب ميتشا تشامليون في متصفحك - بدون تنزيل، بدون تسجيل، بدون تثبيت. لوّن، اختبئ من الباحث، وانجُ من الجولة. 6 خرائط رسمية وغرف أصدقاء.'
    : 'Play Meccha Chameleon in your browser - no download, no signup, no install. Paint, hide from the seeker, and survive the round. 6 official maps and friend rooms.';

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]" dir={isAr ? 'rtl' : 'ltr'}>
      <BreadcrumbJsonLd items={[{ name: 'Home', item: homeUrl }, { name: title, item: pageUrl }]} />
      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-28 pb-10 lg:pt-36">
          <a href={backHref} className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
            <ArrowLeft className="h-4 w-4" />{isAr ? 'العودة إلى اللعبة الرئيسية' : 'Back to home game'}
          </a>
          <div className="mb-6 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{isAr ? 'لعبة متصفح مجانية' : 'Free browser game'}</p>
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">{isAr ? 'إجابات للاعبين' : 'Player answers'}</p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{isAr ? 'الأسئلة الشائعة' : 'Free online play FAQ'}</h2>
            </div>
            <a href={getLocalizedPath(locale, '/maps')} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]">
              <MousePointerClick className="h-4 w-4" />{isAr ? 'افتح دليل الخرائط' : 'Open map guide'}
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
                  <h3 className="font-semibold">{isAr ? 'هل تريد النسخة بدون قيود؟' : 'Need the unblocked version?'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{isAr ? 'نفس اللعبة، تُفتح في علامة تبويب عادية بالمتصفح، تعمل في المدارس والمكاتب.' : 'The same game, opened in a normal browser tab, works at schools and offices.'}</p>
                </div>
                <a href={getLocalizedPath(locale, '/unblocked')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Sparkles className="h-4 w-4" />{isAr ? 'بدون قيود' : 'Unblocked'}
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">{isAr ? 'هل تريد اللعب مع الأصدقاء؟' : 'Want to play with friends?'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{isAr ? 'أنشئ غرفة أصدقاء وشارك الرمز - حتى 8 لاعبين على خريطة واحدة.' : 'Create a friend room and share the code - up to 8 players on one map.'}</p>
                </div>
                <a href={getLocalizedPath(locale, '/new-player')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Users className="h-4 w-4" />{isAr ? 'دليل المبتدئين' : 'New player guide'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
