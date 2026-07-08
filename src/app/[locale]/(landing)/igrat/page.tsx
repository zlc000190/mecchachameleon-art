import {
  ArrowLeft,
  Brush,
  CheckCircle2,
  Gamepad2,
  MousePointerClick,
  MapPinned,
  Sparkles,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const pagePath = '/ru/igrat';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Meccha Chameleon Play Online - Free Browser Game',
    description:
      'Play Meccha Chameleon online free in your browser. No download, no signup, no install - hide and seek, paint, and 6 official maps.',
  },
  zh: {
    title: 'Meccha Chameleon 在线玩 - 免费浏览器游戏',
    description: '在浏览器中免费玩 Meccha Chameleon。无需下载、无需注册、无需安装 - 捉迷藏、涂色、6 张官方地图。',
  },
  ru: {
    title: 'Meccha Chameleon Играть Онлайн - Бесплатная Браузерная Игра',
    description:
      'Играйте в Meccha Chameleon онлайн бесплатно в браузере. Без скачивания, без регистрации, без установки - прятки, камуфляж и 6 официальных карт.',
  },
  es: {
    title: 'Meccha Chameleon Jugar Online - Juego de Navegador Gratis',
    description: 'Juega a Meccha Chameleon online gratis en tu navegador. Sin descarga, sin registro, sin instalación - escondite, camuflaje y 6 mapas oficiales.',
  },
  fr: {
    title: 'Meccha Chameleon Jouer en Ligne - Jeu Navigateur Gratuit',
    description: 'Jouez à Meccha Chameleon en ligne gratuitement dans votre navigateur. Sans téléchargement, sans inscription, sans installation - cache-cache, camouflage et 6 cartes officielles.',
  },
  ar: {
    title: 'ميتشا تشامليون العب أونلاين - لعبة متصفح مجانية',
    description: 'العب ميتشا تشامليون أونلاين مجاناً في متصفحك. بدون تنزيل، بدون تسجيل، بدون تثبيت - الغميضة، التمويه و6 خرائط رسمية.',
  },
  pt: {
    title: 'Meccha Chameleon Jogar Online - Jogo de Navegador Grátis',
    description: 'Jogue Meccha Chameleon online grátis no seu navegador. Sem download, sem cadastro, sem instalação - esconde-esconde, camuflagem e 6 mapas oficiais.',
  },
  de: {
    title: 'Meccha Chameleon Online Spielen - Kostenloses Browserspiel',
    description: 'Spiele Meccha Chameleon online kostenlos in deinem Browser. Kein Download, keine Registrierung, keine Installation - Versteckspiel, Tarnung und 6 offizielle Karten.',
  },
  it: {
    title: 'Meccha Chameleon Giocare Online - Gioco Browser Gratuito',
    description: 'Gioca a Meccha Chameleon online gratis nel tuo browser. Senza download, senza registrazione, senza installazione - nascondino, mimetizzazione e 6 mappe ufficiali.',
  },
  nl: {
    title: 'Meccha Chameleon Online Spelen - Gratis Browserspel',
    description: 'Speel Meccha Chameleon online gratis in je browser. Geen download, geen registratie, geen installatie - verstopspel, camouflage en 6 officiële kaarten.',
  },
  ja: {
    title: 'めっちゃカメレオン オンラインプレイ - 無料ブラウザゲーム',
    description: 'ブラウザで「めっちゃカメレオン」をオンラインで無料プレイ。ダウンロード不要、登録不要、インストール不要 - かくれんぼ、変装、公式マップ6枚。',
  },
  ko: {
    title: 'Meccha Chameleon 온라인 플레이 - 무료 브라우저 게임',
    description: '브라우저에서 Meccha Chameleon을 온라인으로 무료 플레이하세요. 다운로드, 가입, 설치 필요 없음 - 숨바꼭질, 위장, 공식 맵 6개.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = metaByLocale[locale] ?? metaByLocale.en;
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);

  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: m.title, description: m.description, url: canonicalUrl },
    twitter: { card: 'summary_large_image', title: m.title, description: m.description },
  };
}

const benefits = [
  {
    icon: Gamepad2,
    title: 'Бесплатно, без регистрации',
    body: 'Откройте страницу, нажмите Play - и вы уже в раунде. Без аккаунта, без email, без подтверждения.',
  },
  {
    icon: Brush,
    title: 'Полная механика камуфляжа',
    body: 'Красьте стены, подбирайте вторичный цвет (швы, тени, блики) и прячьтесь в шумных поверхностях. Все те же инструменты, что и в полной версии.',
  },
  {
    icon: MapPinned,
    title: '6 официальных карт',
    body: 'Поместье с библиотекой, загородный дом, канализация, Осака, отель "Пингвин" и Backrooms - у каждой карты свои поверхности и свет.',
  },
];

const faqs = [
  {
    q: 'Meccha Chameleon действительно бесплатный?',
    a: 'Да. Браузерная версия полностью бесплатна - без премиум-уровня, без подписки, без внутриигровых покупок.',
  },
  {
    q: 'Нужно ли что-то скачивать?',
    a: 'Нет. Игра работает прямо в браузере. Откройте URL, нажмите Play, и вы уже в раунде. Без установщика, без прав администратора, без отдельного лаунчера.',
  },
  {
    q: 'Можно ли играть с друзьями?',
    a: 'Да. Используйте комнату с друзьями в игре и поделитесь кодом комнаты. Комнаты с друзьями поддерживают от 4 до 8 игроков в зависимости от карты.',
  },
];

export default async function RuIgratPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const pageUrl = await getCanonicalUrl(pagePath, locale);
  const backHref = getLocalizedPath(locale, '/#play');

  const isRu = locale === 'ru';
  const title = isRu ? 'Meccha Chameleon Играть Онлайн' : 'Meccha Chameleon Play Online';
  const lede = isRu
    ? 'Играйте в Meccha Chameleon прямо в браузере - без скачивания, без регистрации, без установки. Красьте стены, прячьтесь от Искателя, выживайте в раунде. 6 официальных карт и комнаты с друзьями.'
    : 'Play Meccha Chameleon in your browser - no download, no signup, no install. Paint, hide from the seeker, and survive the round. 6 official maps and friend rooms.';

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd items={[{ name: 'Home', item: homeUrl }, { name: title, item: pageUrl }]} />

      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-28 pb-10 lg:pt-36">
          <a
            href={backHref}
            className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
          >
            <ArrowLeft className="h-4 w-4" />
            {isRu ? 'Назад на главную' : 'Back to home game'}
          </a>
          <div className="mb-6 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
              {isRu ? 'Бесплатная браузерная игра' : 'Free browser game'}
            </p>
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">
                {isRu ? 'Ответы на вопросы' : 'Player answers'}
              </p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                {isRu ? 'Часто задаваемые вопросы' : 'Free online play FAQ'}
              </h2>
            </div>
            <a
              href={getLocalizedPath(locale, '/maps')}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]"
            >
              <MousePointerClick className="h-4 w-4" />
              {isRu ? 'Открыть карты' : 'Open map guide'}
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
                  <h3 className="font-semibold">
                    {isRu ? 'Хотите версию без блокировки?' : 'Need the unblocked version?'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                    {isRu
                      ? 'Та же игра, открывается в обычной вкладке браузера, работает в школах и офисах.'
                      : 'The same game, opened in a normal browser tab, works at schools and offices.'}
                  </p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/unblocked')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Sparkles className="h-4 w-4" />
                  {isRu ? 'Без блокировки' : 'Unblocked'}
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">
                    {isRu ? 'Хотите поиграть с друзьями?' : 'Want to play with friends?'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                    {isRu
                      ? 'Создайте комнату с друзьями и поделитесь кодом - до 8 игроков на одной карте.'
                      : 'Create a friend room and share the code - up to 8 players on one map.'}
                  </p>
                </div>
                <a
                  href={getLocalizedPath(locale, '/new-player')}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]"
                >
                  <Users className="h-4 w-4" />
                  {isRu ? 'Гид для новичков' : 'New player guide'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
