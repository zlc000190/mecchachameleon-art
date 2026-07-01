import type { Metadata } from 'next';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Download,
  Gamepad2,
  Keyboard,
  LockKeyhole,
  Radar,
  Shield,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';

import { PlayKitCheckoutButton } from '@/shared/blocks/meccha/play-kit-checkout-button';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const price = '$7';

const copy = {
  en: {
    title: 'Meccha Chameleon Play Kit - Better starts, steadier camo, smoother friend rooms',
    description:
      'A player-first pack for quicker starts, better hiding, and smoother friend rooms: quick-start checklist, lobby fixes, FPS notes, camo practice, and route cards.',
    eyebrow: 'Play Kit',
    h1: `Get Meccha Chameleon Play Kit for ${price}`,
    intro:
      'Keep the useful parts in one place so you can start faster, hide more confidently, and get friends into the same room with less friction.',
    disclaimer:
      'Fan-made and not affiliated with LEMORION or Steam. The pack is meant as a practical companion for prep, notes, and session flow. Use at your own risk.',
    paidButton: `Get Play Kit - ${price}`,
    paidNote:
      'One-time access. Open it before a session and keep the checklist handy.',
    includedTitle: 'What you get',
    signalTitle: 'Why players keep it open',
    signalBody:
      'The pack keeps setup notes, lobby fixes, FPS tips, camo practice, and route cards together so you do not have to hunt across tabs.',
    intentTitle: 'Built for quicker sessions',
    intentBody:
      'If you want less setup friction and more time actually playing, this pack is designed to stay nearby while you queue up.',
    flowTitle: 'How it works',
    controlsTitle: 'Controls',
    tabsTitle: 'Settings tabs',
    requirements:
      'Best with Windows 10/11 and Meccha Chameleon running in windowed or borderless mode.',
    flowSteps: [
      `Tap the ${price} Get Play Kit button.`,
      'Secure checkout opens first.',
      'After payment, the original file download is unlocked from this page.',
    ],
    features: [
      [
        'Fast-start checklist',
        'One place for the first-match plan, controls, and the most common setup steps.',
      ],
      [
        'Friend-room setup',
        'Lobby notes for room codes, server tags, and smoother invites when friends are joining.',
      ],
      [
        'FPS tuning',
        'Low-friction notes for frame pacing, recording, and keeping the game feeling responsive.',
      ],
      [
        'Camo practice',
        'Color-matching drills, shadow habits, and pose timing to make hiding feel more natural.',
      ],
      ['Route cards', 'Quick references for map routes and repeatable hiding spots before the round starts.'],
      ['One-time price', 'A small buy once, keep using it before each session.'],
    ],
    controls: [
      ['Insert / F1', 'Toggle settings menu'],
      ['F10', 'Photo paint / camouflage'],
      ['Close button', 'Bottom bar of menu - quits the application entirely'],
    ],
    tabs: ['START', 'FRIENDS', 'FPS', 'CAMO', 'ROUTES'],
  },
  zh: {
    title: '超级变色龙 Play Kit — 更快开局、更稳隐藏、更顺畅联机',
    description:
      '面向玩家的实用包：快速开局、进房更顺、FPS 更稳、伪装更自然、路线更清楚，一次性付费后就能下载。',
    eyebrow: 'Play Kit',
    h1: `获取超级变色龙 Play Kit，${price} 一次性`,
    intro:
      '把开局清单、联机修复、FPS 设置、伪装练习和路线卡放在一个包里，减少找资料的时间，把注意力留给真正的游戏。',
    disclaimer:
      '这是 fan-made 的玩家辅助包，不隶属于 LEMORION 或 Steam。内容用于准备、记录和提升上手体验，使用前请自行判断风险。',
    paidButton: `获取 Play Kit - ${price}`,
    paidNote:
      '一次性购买，打开后就能在每次开局前快速复用。',
    includedTitle: '你会拿到什么',
    signalTitle: '为什么玩家会一直开着它',
    signalBody:
      '它把开局清单、进房修复、FPS 建议、伪装练习和路线卡放在一起，省得你来回翻网页。',
    intentTitle: '为更快开局而做',
    intentBody:
      '如果你想少折腾、多开玩，这个包的目标就是让你在排队和进房时更轻松。',
    flowTitle: '使用方式',
    controlsTitle: '快捷键',
    tabsTitle: '设置标签',
    requirements: '建议 Windows 10/11，游戏以窗口或无边框模式运行。',
    flowSteps: [
      `点击 ${price} 获取 Play Kit 按钮。`,
      '先完成安全支付。',
      '付款成功后，原始文件下载会在这里解锁。',
    ],
    features: [
      [
        '快速开局清单',
        '把第一次开局的步骤、设置和常见问题放在同一个地方。',
      ],
      ['好友联机', '房间码、服务器标签和邀请流程，减少朋友进房时的来回折腾。'],
      ['FPS 调优', '帧率、录屏和响应感的实用建议。'],
      ['伪装练习', '颜色匹配、阴影习惯和站位节奏，让隐藏更自然。'],
      ['路线卡', '每张地图的简明路线和常用躲点，开局前快速看一眼。'],
      ['一次性价格', '买一次，之后每次开局前都能复用。'],
    ],
    controls: [
      ['Insert / F1', '切换设置菜单'],
      ['F10', '伪装采样与应用'],
      ['关闭按钮', '菜单底部栏 - 退出程序'],
    ],
    tabs: ['开局', '好友', 'FPS', '伪装', '路线'],
  },
  ru: {
    title: 'Meccha Chameleon Play Kit - faster starts, steadier camo, smoother friend rooms',
    description:
      'A practical pack for quicker starts, better hiding, and smoother friend rooms: fast-start checklist, lobby fixes, FPS notes, camo practice, and route cards.',
    eyebrow: 'Play Kit',
    h1: `Get Meccha Chameleon Play Kit for ${price}`,
    intro:
      'Keep the useful parts in one place so you can start faster, hide more confidently, and get friends into the same room with less friction.',
    disclaimer:
      'Fan-made and not affiliated with LEMORION or Steam. The pack is meant as a practical companion for prep, notes, and session flow. Use at your own risk.',
    paidButton: `Get Play Kit - ${price}`,
    paidNote:
      'One-time access. Open it before a session and keep the checklist handy.',
    includedTitle: 'What you get',
    signalTitle: 'Why players keep it open',
    signalBody:
      'The pack keeps setup notes, lobby fixes, FPS tips, camo practice, and route cards together so you do not have to hunt across tabs.',
    intentTitle: 'Built for quicker sessions',
    intentBody:
      'If you want less setup friction and more time actually playing, this pack is designed to stay nearby while you queue up.',
    flowTitle: 'How it works',
    controlsTitle: 'Клавиши',
    tabsTitle: 'Вкладки настроек',
    requirements:
      'Best with Windows 10/11 and Meccha Chameleon running in windowed or borderless mode.',
    flowSteps: [
      `Tap the ${price} Get Play Kit button.`,
      'Secure checkout opens first.',
      'After payment, the original file download is unlocked from this page.',
    ],
    features: [
      [
        'Fast-start checklist',
        'One place for the first-match plan, controls, and the most common setup steps.',
      ],
      [
        'Friend-room setup',
        'Lobby notes for room codes, server tags, and smoother invites when friends are joining.',
      ],
      [
        'FPS tuning',
        'Low-friction notes for frame pacing, recording, and keeping the game feeling responsive.',
      ],
      [
        'Camo practice',
        'Color-matching drills, shadow habits, and pose timing to make hiding feel more natural.',
      ],
      ['Route cards', 'Quick references for map routes and repeatable hiding spots before the round starts.'],
      ['One-time price', 'A small buy once, keep using it before each session.'],
    ],
    controls: [
      ['Insert / F1', 'Open / close settings menu'],
      ['F10', 'Photo paint / camouflage'],
      ['Close button', 'Fully quits the application'],
    ],
    tabs: ['START', 'FRIENDS', 'FPS', 'CAMO', 'ROUTES'],
  },
} as const;

const localeCopy = (locale: string) =>
  locale === 'zh' ? copy.zh : locale === 'ru' ? copy.ru : copy.en;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = localeCopy(locale);
  const canonicalUrl = await getCanonicalUrl('/tools', locale);

  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
  };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = localeCopy(locale);
  const zh = locale === 'zh';
  const homeUrl = await getCanonicalUrl('/', locale);
  const toolsUrl = await getCanonicalUrl('/tools', locale);

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd
        items={[
          { name: zh ? '首页' : 'Home', item: homeUrl },
          { name: t.title, item: toolsUrl },
        ]}
      />

      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container grid gap-8 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#29211D]/20 bg-white/75 px-3 py-1 text-sm font-semibold">
              {t.eyebrow}
            </p>
            <h1 className="max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
              {t.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#4C3B35]">
              {t.intro}
            </p>
            <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              {t.disclaimer}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-auto">
                <PlayKitCheckoutButton
                  label={t.paidButton}
                  priceLabel={price}
                />
              </div>
              <span className="max-w-xl text-sm leading-6 text-[#4C3B35]">
                {t.paidNote}
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/75 bg-white shadow-[0_24px_80px_rgba(93,63,86,0.18)]">
            <Image
              src="/imgs/meccha/play-kit-promo.png"
              alt="Meccha Chameleon Play Kit promo preview"
              width={1672}
              height={941}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container py-14">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">
            {t.includedTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.features.map(([title, body], index) => {
              const icons = [
                Shield,
                Target,
                Radar,
                Zap,
                Gamepad2,
                CheckCircle2,
              ];
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={title}
                  className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5"
                >
                  <Icon className="mb-4 h-5 w-5 text-[#ff6f9a]" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">
                    {body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F4DCD0]">
        <div className="container grid gap-8 py-14 lg:grid-cols-2">
          <div className="rounded-md bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
              <CreditCard className="h-5 w-5 text-[#ff6f9a]" />
              {t.flowTitle}
            </h2>
            <ol className="space-y-3 text-sm leading-6 text-[#4C3B35]">
              {t.flowSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff8fb3] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-3 text-xs leading-5 text-[#4C3B35]">
              {t.requirements}
            </p>
          </div>

          <div
            id="paid-download-intent"
            className="scroll-mt-28 rounded-md bg-[#29211D] p-6 text-white shadow-sm"
          >
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
              <LockKeyhole className="h-5 w-5 text-[#fff7c8]" />
              {t.intentTitle}
            </h2>
            <p className="text-sm leading-6 text-white/85">{t.intentBody}</p>
            <div className="mt-6 rounded-md border border-white/20 bg-white/10 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-[#9de7dc]" />
                {t.signalTitle}
              </h3>
              <p className="text-sm leading-6 text-white/80">{t.signalBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
              <Keyboard className="h-5 w-5 text-[#ff6f9a]" />
              {t.controlsTitle}
            </h2>
            <div className="overflow-hidden rounded-md border border-[#D8CFC6]">
              {t.controls.map(([key, action]) => (
                <div
                  key={key}
                  className="grid grid-cols-[150px_1fr] border-b border-[#D8CFC6] last:border-b-0"
                >
                  <div className="bg-[#F6F0EA] p-3 font-semibold">{key}</div>
                  <div className="p-3 text-sm text-[#4C3B35]">{action}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-2xl font-bold">{t.tabsTitle}</h2>
            <div className="flex flex-wrap gap-2">
              {t.tabs.map((tab) => (
                <span
                  key={tab}
                  className="rounded-full border border-[#D8CFC6] bg-[#F6F0EA] px-4 py-2 text-sm font-semibold"
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
