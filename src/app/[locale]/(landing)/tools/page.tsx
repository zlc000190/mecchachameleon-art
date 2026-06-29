import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Gamepad2,
  Keyboard,
  Radar,
  Shield,
  Target,
  Zap,
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;

const links = {
  enRepo: 'https://github.com/SilentJMA/Meccha-Chameleon-Tools',
  enRelease: 'https://github.com/SilentJMA/Meccha-Chameleon-Tools/releases/latest',
  enExe: 'https://pub-df9b5ddb7c4049af9616db9a99a48adf.r2.dev/mecchachameleon.art-ass/MecchaCamouflage.exe',
  zhRepo: 'https://github.com/WmxStars/Meccha-Chameleon-Tools-CN',
  zhRelease: 'https://github.com/WmxStars/Meccha-Chameleon-Tools-CN/releases/latest',
  zhExe: 'https://pub-df9b5ddb7c4049af9616db9a99a48adf.r2.dev/mecchachameleon.art-ass/MecchaCamouflage.exe',
};

const copy = {
  en: {
    title: 'Meccha Chameleon Tools — Game Assistant Software',
    description:
      'Meccha Chameleon Tools overview: ESP, radar, aim assist, color tools, downloads, controls, and safety notes. Educational research only.',
    eyebrow: 'Game assistant software',
    h1: 'Meccha Chameleon Tools for assisted play testing',
    intro:
      'This page summarizes the community Meccha Chameleon Tools project for players who want an external overlay, radar, color/camouflage helper, and input-assist features while researching the game mechanics.',
    disclaimer:
      'Educational and research purposes only. Use at your own risk. Third-party tools can violate game terms, trigger anti-cheat, or affect other players. We do not host the executable and we are not affiliated with LEMORION or the tool authors.',
    repoLabel: 'English source repository',
    releaseLabel: 'Latest English release',
    exeLabel: 'Download MecchaCamouflage.exe',
    featuresTitle: 'What the assistant can do',
    quickTitle: 'Quick start — standalone EXE, no Python',
    sourceTitle: 'Run from source',
    controlsTitle: 'Controls',
    tabsTitle: 'Settings tabs',
    requirements: 'Requirements: Windows 10/11 and MECCHA CHAMELEON running in windowed or borderless mode.',
    quickSteps: [
      'Download MecchaCamouflage.exe from the latest release.',
      'Launch MECCHA CHAMELEON in windowed or borderless mode.',
      'Run MecchaCamouflage.exe and use Insert / F1 to open the settings menu.',
    ],
    sourceSteps: ['pip install -r requirements.txt', 'python -m meccha_chameleon_tools'],
    features: [
      ['ESP overlay', 'Dot / 2D box / skeleton overlay, names, distance, snap lines, team filter, and distance scaling.'],
      ['Health bars', 'Health and shield bars with adjustable model height and Y offset.'],
      ['Radar', 'External minimap radar with configurable size and range.'],
      ['Aimbot', 'Smooth aim assist with FOV circle, rebindable key, FOV radius, smoothing, and aim offset.'],
      ['Colors', 'Enemy, local player, and skeleton overlay color pickers.'],
      ['External design', 'Fully external implementation — no DLL injection, no UE4SS, no DXGI.'],
    ],
    controls: [
      ['Insert / F1', 'Toggle settings menu'],
      ['F10', 'Photo paint / camouflage'],
      ['Close button', 'Bottom bar of menu — quits the application entirely'],
    ],
    tabs: ['ESP', 'HEALTH', 'RADAR', 'AIMBOT', 'COLORS'],
    cnNote: 'Need the Chinese enhanced build? Open the CN repository for v1.5.0 texture writing, F11 segmented paint, auto fire, speed modification, and full Chinese UI.',
  },
  zh: {
    title: '超级变色龙工具箱 — 游戏辅助软件',
    description:
      '超级变色龙工具箱说明：透视、雷达、自瞄、伪装、纹理直写、内存功能、下载方式、快捷键和风险提示。仅供教育和研究目的使用。',
    eyebrow: '游戏辅助软件',
    h1: '超级变色龙工具箱：外部叠加层与伪装辅助',
    intro:
      '本页面整理社区版 MECCHA CHAMELEON 工具箱的能力：透视叠加、雷达、自瞄、颜色/伪装辅助，以及中文增强版的纹理直写、F11 分片涂色和内存功能。',
    disclaimer:
      'Educational and research purposes only. Use at your own risk. 仅供教育和研究目的使用，风险自负。第三方工具可能违反游戏条款、触发反作弊或影响其他玩家。本站不托管可执行文件，也不隶属于 LEMORION 或工具作者。',
    repoLabel: '中文源码仓库',
    releaseLabel: '中文最新版发布页',
    exeLabel: '下载 MecchaCamouflage.exe',
    featuresTitle: '这个辅助能实现什么',
    quickTitle: '快速开始 — 独立运行，无需 Python',
    sourceTitle: '从源码运行',
    controlsTitle: '快捷键',
    tabsTitle: '设置标签',
    requirements: '需求：Windows 10/11，游戏以窗口或无边框模式运行。',
    quickSteps: [
      '从最新发布下载 MecchaCamouflage.exe。',
      '启动 MECCHA CHAMELEON（窗口/无边框模式）。',
      '运行 MecchaCamouflage.exe，按 Insert / F1 打开设置菜单。',
    ],
    sourceSteps: ['pip install -r requirements.txt', 'python -m meccha_chameleon_tools'],
    features: [
      ['透视', '圆点 / 2D 方框 / 骨骼叠加、名称、距离、吸附线、队伍过滤、距离缩放。'],
      ['伪装', 'F10 采样屏幕颜色应用伪装；中文增强版支持 F11 直接纹理涂色与 16 片分片进度条。'],
      ['血条', '血量条和护盾条，可调模型高度和 Y 偏移。'],
      ['雷达', '外部小地图雷达，可配置尺寸和范围。'],
      ['自瞄', '平滑自瞄辅助、FOV 圆圈、按键绑定、平滑度和瞄准偏移。'],
      ['内存功能', '中文增强版包含自动射击间隔 50-2000ms，以及移动速度 50-2000 修改。'],
      ['全外部实现', '无 DLL 注入，无 UE4SS，无 DXGI。'],
    ],
    controls: [
      ['Insert / F1', '切换设置菜单'],
      ['F10', '伪装采样与应用'],
      ['F11', '直接纹理涂色（中文增强版，16 片分片视觉反馈）'],
      ['关闭按钮', '菜单底部栏 — 退出程序'],
    ],
    tabs: ['透视', '血量', '雷达', '自瞄', '颜色', '伪装', '内存'],
    cnNote: '中文增强版来自 WmxStars/Meccha-Chameleon-Tools-CN，包含 v1.5.0 纹理直写、F11 分片涂色、自动射击、移动速度修改和全中文 UI。',
  },
  ru: {
    title: 'Meccha Chameleon Tools — вспомогательное ПО',
    description:
      'Обзор Meccha Chameleon Tools: внешний ESP, радар, aim assist, цветовые инструменты, запуск, ссылки на релизы и предупреждение о рисках.',
    eyebrow: 'Вспомогательное ПО',
    h1: 'Meccha Chameleon Tools для исследовательского тестирования',
    intro:
      'Краткий перевод английской страницы: проект предоставляет внешний overlay, radar, camouflage/color helper и input-assist функции для изучения механик игры.',
    disclaimer:
      'Educational and research purposes only. Use at your own risk. Сторонние инструменты могут нарушать правила игры, срабатывать античитом или влиять на других игроков.',
    repoLabel: 'Исходный репозиторий',
    releaseLabel: 'Последний релиз',
    exeLabel: 'Скачать MecchaCamouflage.exe',
    featuresTitle: 'Возможности',
    quickTitle: 'Быстрый старт — standalone EXE',
    sourceTitle: 'Запуск из исходников',
    controlsTitle: 'Клавиши',
    tabsTitle: 'Вкладки настроек',
    requirements: 'Требования: Windows 10/11, игра в windowed или borderless mode.',
    quickSteps: [
      'Скачайте MecchaCamouflage.exe со страницы последнего релиза.',
      'Запустите MECCHA CHAMELEON в оконном или borderless-режиме.',
      'Запустите MecchaCamouflage.exe и нажмите Insert / F1, чтобы открыть меню настроек.',
    ],
    sourceSteps: ['pip install -r requirements.txt', 'python -m meccha_chameleon_tools'],
    features: [
      ['ESP overlay', 'Точки / 2D-боксы / скелет, имена, дистанция, линии наведения, фильтр команд и масштабирование по расстоянию.'],
      ['Полосы здоровья', 'Здоровье и щит с настраиваемой высотой модели и смещением по Y.'],
      ['Радар', 'Внешний минирадар с настраиваемыми размером и радиусом.'],
      ['Aimbot', 'Плавный aim assist, круг FOV, переназначаемая клавиша, сглаживание и смещение прицела.'],
      ['Цвета', 'Выбор цветов для врагов, локального игрока и скелетного overlay.'],
    ],
    controls: [
      ['Insert / F1', 'Открыть / закрыть меню настроек'],
      ['F10', 'Фотопокраска / камуфляж'],
      ['Кнопка закрытия', 'Полностью завершает приложение'],
    ],
    tabs: ['ESP', 'HEALTH', 'RADAR', 'AIMBOT', 'COLORS'],
    cnNote: 'Китайская расширенная сборка доступна в WmxStars/Meccha-Chameleon-Tools-CN.',
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
    openGraph: { title: t.title, description: t.description, url: canonicalUrl },
    twitter: { card: 'summary_large_image', title: t.title, description: t.description },
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
  const repo = zh ? links.zhRepo : links.enRepo;
  const release = zh ? links.zhRelease : links.enRelease;
  const exe = zh ? links.zhExe : links.enExe;

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
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            {t.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#4C3B35]">
            {t.intro}
          </p>
          <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            {t.disclaimer}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={repo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#29211D] bg-white px-5 py-3 font-semibold text-[#29211D] hover:bg-[#fff7c8]">
              <ExternalLink className="h-4 w-4" /> {t.repoLabel}
            </a>
            <a href={release} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#ff6f9a] px-5 py-3 font-semibold text-white hover:bg-[#e95a88]">
              <Download className="h-4 w-4" /> {t.releaseLabel}
            </a>
            <a href={exe} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 font-semibold text-white hover:bg-[#4C3B35]">
              <Download className="h-4 w-4" /> {t.exeLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-white">
        <div className="container py-14">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">{t.featuresTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.features.map(([title, body], index) => {
              const icons = [Shield, Target, Radar, Zap, Gamepad2, CheckCircle2, Shield];
              const Icon = icons[index % icons.length];
              return (
                <div key={title} className="rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-5">
                  <Icon className="mb-4 h-5 w-5 text-[#ff6f9a]" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CFC6] bg-[#F4DCD0]">
        <div className="container grid gap-8 py-14 lg:grid-cols-2">
          <div className="rounded-md bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">{t.quickTitle}</h2>
            <ol className="space-y-3 text-sm leading-6 text-[#4C3B35]">
              {t.quickSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff8fb3] text-xs font-bold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-md border border-[#D8CFC6] bg-[#F6F0EA] p-3 text-xs leading-5 text-[#4C3B35]">
              {t.requirements}
            </p>
          </div>

          <div className="rounded-md bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">{t.sourceTitle}</h2>
            <div className="rounded-md bg-[#29211D] p-4 font-mono text-sm leading-7 text-white">
              {t.sourceSteps.map((line) => <div key={line}>{line}</div>)}
            </div>
            <p className="mt-5 text-sm leading-6 text-[#4C3B35]">{t.cnNote}</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold"><Keyboard className="h-5 w-5 text-[#ff6f9a]" />{t.controlsTitle}</h2>
            <div className="overflow-hidden rounded-md border border-[#D8CFC6]">
              {t.controls.map(([key, action]) => (
                <div key={key} className="grid grid-cols-[150px_1fr] border-b border-[#D8CFC6] last:border-b-0">
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
                <span key={tab} className="rounded-full border border-[#D8CFC6] bg-[#F6F0EA] px-4 py-2 text-sm font-semibold">
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
