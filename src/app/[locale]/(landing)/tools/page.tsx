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
import { setRequestLocale } from 'next-intl/server';

import { PlayKitCheckoutButton } from '@/shared/blocks/meccha/play-kit-checkout-button';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const price = '$7';

const copy = {
  en: {
    title: 'Meccha Chameleon Tools - Paid Download',
    description:
      'Download Meccha Chameleon Tools for a low one-time price. Paid download intent page for overlay, radar, color helper, controls, and safety notes.',
    eyebrow: 'Paid tool download',
    h1: `Download Meccha Chameleon Tools for ${price}`,
    intro:
      'A low one-time price tests whether serious players want a packaged assistant toolkit instead of another free mirror. If clicks show real demand, checkout will move to Stripe and unlock the Windows build after payment.',
    disclaimer:
      'Educational and research purposes only. Use at your own risk. Third-party tools can violate game terms, trigger anti-cheat, or affect other players. We are validating paid access before opening checkout.',
    paidButton: `Download Tools - ${price}`,
    paidNote:
      'One-time access. No subscription. Checkout connection is the next step if demand is real.',
    includedTitle: 'What the paid download would include',
    signalTitle: 'How this test will be read',
    signalBody:
      'Clicks on the paid download button are tracked as purchase intent. Repeat visits and repeat clicks matter more than one-off curiosity.',
    intentTitle: 'Paid download checkout is being prepared',
    intentBody:
      'This click is counted as paid-download interest. If enough visitors click at this price, the next version will route here to Stripe checkout and then to the file.',
    flowTitle: 'Paid download flow',
    controlsTitle: 'Controls',
    tabsTitle: 'Settings tabs',
    requirements:
      'Expected requirements: Windows 10/11 and MECCHA CHAMELEON running in windowed or borderless mode.',
    flowSteps: [
      `Click the ${price} Download Tools button.`,
      'Secure checkout opens before the file is delivered.',
      'After payment launches, the packaged Windows build is unlocked from this page.',
    ],
    features: [
      [
        'ESP overlay',
        'Dot / 2D box / skeleton overlay, names, distance, snap lines, team filter, and distance scaling.',
      ],
      [
        'Health bars',
        'Health and shield bars with adjustable model height and Y offset.',
      ],
      ['Radar', 'External minimap radar with configurable size and range.'],
      [
        'Aimbot',
        'Smooth aim assist with FOV circle, rebindable key, FOV radius, smoothing, and aim offset.',
      ],
      ['Colors', 'Enemy, local player, and skeleton overlay color pickers.'],
      [
        'External design',
        'Designed as an external helper. No free mirror or open file links are listed here.',
      ],
    ],
    controls: [
      ['Insert / F1', 'Toggle settings menu'],
      ['F10', 'Photo paint / camouflage'],
      ['Close button', 'Bottom bar of menu - quits the application entirely'],
    ],
    tabs: ['ESP', 'HEALTH', 'RADAR', 'AIMBOT', 'COLORS'],
  },
  zh: {
    title: '超级变色龙工具箱 - 付费下载',
    description:
      '超级变色龙工具箱低价一次性付费下载测试页：透视、雷达、自瞄、伪装、快捷键、功能说明和风险提示。',
    eyebrow: '付费工具下载',
    h1: `超级变色龙工具箱 ${price} 下载`,
    intro:
      '这里先用低价一次性下载测试真实付费意愿，不再把用户直接导向免费镜像或安装包。如果点击意愿成立，下一步把这个按钮接到 Stripe，支付后再开放文件下载。',
    disclaimer:
      'Educational and research purposes only. Use at your own risk. 仅供教育和研究目的使用，风险自负。第三方工具可能违反游戏条款、触发反作弊或影响其他玩家。当前阶段用于验证付费访问意愿。',
    paidButton: `Download Tools - ${price}`,
    paidNote:
      '一次性价格，无订阅。先测点击付费意愿，成立后再接正式支付和下载。',
    includedTitle: '付费下载将包含什么',
    signalTitle: '怎么看这个测试',
    signalBody:
      '按钮点击会作为付费下载意向记录。比单次好奇点击更重要的是：用户是否反复回来、反复点。',
    intentTitle: '付费下载通道准备中',
    intentBody:
      '这次点击会被计为付费下载兴趣。如果这个价格有足够多人愿意点，下一版会把这里接到 Stripe 支付，然后跳转到下载文件。',
    flowTitle: '付费下载流程',
    controlsTitle: '快捷键',
    tabsTitle: '设置标签',
    requirements: '预计需求：Windows 10/11，游戏以窗口或无边框模式运行。',
    flowSteps: [
      `点击 ${price} Download Tools 按钮。`,
      '先进入安全支付，再开放文件。',
      '支付链路上线后，本页会在付款完成后解锁 Windows 工具包。',
    ],
    features: [
      [
        '透视',
        '圆点 / 2D 方框 / 骨骼叠加、名称、距离、吸附线、队伍过滤、距离缩放。',
      ],
      ['伪装', 'F10 采样屏幕颜色应用伪装，目标是减少手动调色成本。'],
      ['血条', '血量条和护盾条，可调模型高度和 Y 偏移。'],
      ['雷达', '外部小地图雷达，可配置尺寸和范围。'],
      ['自瞄', '平滑自瞄辅助、FOV 圆圈、按键绑定、平滑度和瞄准偏移。'],
      ['付费打包', '本页不再展示免费镜像、开放文件或直链下载入口。'],
    ],
    controls: [
      ['Insert / F1', '切换设置菜单'],
      ['F10', '伪装采样与应用'],
      ['关闭按钮', '菜单底部栏 - 退出程序'],
    ],
    tabs: ['透视', '血量', '雷达', '自瞄', '颜色', '伪装'],
  },
  ru: {
    title: 'Meccha Chameleon Tools - платная загрузка',
    description:
      'Low-price paid download test for Meccha Chameleon Tools: overlay, radar, aim assist, color helper, controls, and safety notes.',
    eyebrow: 'Платная загрузка',
    h1: `Download Meccha Chameleon Tools for ${price}`,
    intro:
      'This page tests whether serious players will click a low one-time paid download instead of leaving through free mirror or open file links. If demand is real, this button will move to Stripe checkout and then unlock the Windows build.',
    disclaimer:
      'Educational and research purposes only. Use at your own risk. Third-party tools can violate game terms, trigger anti-cheat, or affect other players. Paid access is being validated before checkout opens.',
    paidButton: `Download Tools - ${price}`,
    paidNote:
      'One-time access. No subscription. Checkout connection is the next step if demand is real.',
    includedTitle: 'What the paid download would include',
    signalTitle: 'How this test will be read',
    signalBody:
      'Clicks on the paid download button are tracked as purchase intent. Repeat visits and repeat clicks matter more than one-off curiosity.',
    intentTitle: 'Paid download checkout is being prepared',
    intentBody:
      'This click is counted as paid-download interest. If enough visitors click at this price, the next version will route here to Stripe checkout and then to the file.',
    flowTitle: 'Paid download flow',
    controlsTitle: 'Клавиши',
    tabsTitle: 'Вкладки настроек',
    requirements:
      'Expected requirements: Windows 10/11, game in windowed or borderless mode.',
    flowSteps: [
      `Click the ${price} Download Tools button.`,
      'Secure checkout opens before the file is delivered.',
      'After payment launches, the packaged Windows build is unlocked from this page.',
    ],
    features: [
      [
        'ESP overlay',
        'Dots / 2D boxes / skeleton overlay, names, distance, snap lines, team filter, and distance scaling.',
      ],
      [
        'Health bars',
        'Health and shield bars with adjustable model height and Y offset.',
      ],
      ['Radar', 'External minimap radar with configurable size and range.'],
      [
        'Aimbot',
        'Smooth aim assist with FOV circle, rebindable key, smoothing, and aim offset.',
      ],
      ['Colors', 'Enemy, local player, and skeleton overlay color pickers.'],
      [
        'Paid package',
        'No free mirror, open file, or direct download buttons are listed here.',
      ],
    ],
    controls: [
      ['Insert / F1', 'Open / close settings menu'],
      ['F10', 'Photo paint / camouflage'],
      ['Close button', 'Fully quits the application'],
    ],
    tabs: ['ESP', 'HEALTH', 'RADAR', 'AIMBOT', 'COLORS'],
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
        <div className="container py-20 lg:py-28">
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
