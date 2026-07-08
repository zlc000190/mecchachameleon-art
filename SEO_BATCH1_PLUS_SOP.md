# SEO Batch 1+ 完整重做 SOP

> 本文件是 **机器可读** 的完整重做指南
> 上次会话 Hermes Agent 写完所有文件后 worktree 灾难性丢失
> 本 SOP 包含完整的代码模板 + 写文件命令，下次会话可以 1:1 还原

---

## 0. 环境信息

- 仓库: `/Users/zhanglongchao/programPJ/mecchachameleon-art`
- 当前分支: `fix/seo-batch0-urgent-008` (commit 7a5d2e9, 已 push)
- 新分支名建议: `feat/seo-batch1-plus-009` (基于 main)
- Node: 建议 pnpm 10
- 关键文件位置: 见 `SEO_PLAN.md` 第 4 节

---

## 1. 准备工作

### 1.1 建 worktree（避免主仓污染）

```bash
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git fetch origin main
git worktree add -b feat/seo-batch1-plus-009 /Users/zhanglongchao/worktrees/mecchachameleon-art/mcc-seo-batch1-plus-009 main
cd /Users/zhanglongchao/worktrees/mecchachameleon-art/mcc-seo-batch1-plus-009
```

### 1.2 装依赖

```bash
pnpm install --prefer-offline
# 如果 frozen lockfile 报错: pnpm install --prefer-offline
```

### 1.3 验证基础编译

```bash
npx tsc --noEmit -p tsconfig.json
# 期望: 0 错误
```

### 1.4 ⚠️ 重要防坑

**绝不要在 worktree 里跑 `git checkout -- <file>`**（除非你 100% 确定那个文件是脏的）。**绝不要跑 `git restore --staged`** 范围超过单文件。**绝不要让 pnpm postinstall 触发任何 git clean**。

如果遇到 lockfile 不匹配问题，**只改 `pnpm-lock.yaml` 那个文件**，**不要**用 `git restore .` 或 `git checkout .` 批量恢复。

---

## 2. Batch 1 — 4 个核心玩法页

### 2.1 `/unblocked/page.tsx` (12 locale metadata, 英文 body)

**路径**: `src/app/[locale]/(landing)/unblocked/page.tsx`

**核心代码结构**:
```tsx
import {
  ArrowLeft, CheckCircle2, Gamepad2, Globe, MousePointerClick,
  School, Shield, Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;
const pagePath = '/unblocked';

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: { title: 'Play Meccha Chameleon Unblocked - Free Browser Game', description: 'Play Meccha Chameleon unblocked in your browser. No download, no VPN, no install - works at school, work, or anywhere games are restricted.' },
  zh: { title: 'Meccha Chameleon 无限制版 - 免费浏览器游戏', description: '在浏览器中无限制畅玩 Meccha Chameleon。无需下载、无需 VPN、无需安装 - 在学校、公司或任何受限网络都能玩。' },
  ru: { title: 'Meccha Chameleon Без Блокировки - Бесплатная Браузерная Игра', description: 'Играйте в Meccha Chameleon без блокировки прямо в браузере. Без скачивания, без VPN, без установки - работает в школе, на работе и везде, где заблокированы игры.' },
  es: { title: 'Jugar Meccha Chameleon Sin Bloqueos - Juego de Navegador Gratis', description: 'Juega a Meccha Chameleon sin bloqueos en tu navegador. Sin descarga, sin VPN, sin instalación - funciona en la escuela, el trabajo o donde sea.' },
  fr: { title: 'Jouer à Meccha Chameleon Sans Blocage - Jeu Navigateur Gratuit', description: "Jouez à Meccha Chameleon sans blocage dans votre navigateur. Sans téléchargement, sans VPN, sans installation - fonctionne à l'école, au travail ou partout." },
  ar: { title: 'العب ميتشا تشامليون بدون قيود - لعبة متصفح مجانية', description: 'العب ميتشا تشامليون بدون قيود في متصفحك. بدون تنزيل، بدون VPN، بدون تثبيت - تعمل في المدرسة، العمل أو أي مكان محظور.' },
  pt: { title: 'Jogar Meccha Chameleon Sem Bloqueio - Jogo de Navegador Grátis', description: 'Jogue Meccha Chameleon sem bloqueio no seu navegador. Sem download, sem VPN, sem instalação - funciona na escola, trabalho ou qualquer lugar.' },
  de: { title: 'Meccha Chameleon Ungesperrt Spielen - Kostenloses Browserspiel', description: 'Spiele Meccha Chameleon ungesperrt in deinem Browser. Kein Download, kein VPN, keine Installation - funktioniert in der Schule, bei der Arbeit und überall.' },
  it: { title: 'Gioca a Meccha Chameleon Senza Blocchi - Gioco Browser Gratuito', description: 'Gioca a Meccha Chameleon senza blocchi nel tuo browser. Senza download, senza VPN, senza installazione - funziona a scuola, al lavoro o ovunque.' },
  nl: { title: 'Meccha Chameleon Gedeblokkeerd Spelen - Gratis Browserspel', description: 'Speel Meccha Chameleon gedeblokkeerd in je browser. Geen download, geen VPN, geen installatie - werkt op school, werk of overal.' },
  ja: { title: 'めっちゃカメレオン ブロック解除 - 無料ブラウザゲーム', description: 'ブラウザでめっちゃカメレオンをブロック解除でプレイ。ダウンロード不要、VPN不要、インストール不要 - 学校、職場、どこでも遊べます。' },
  ko: { title: 'Meccha Chameleon 차단 해제 - 무료 브라우저 게임', description: '브라우저에서 Meccha Chameleon을 차단 해제하고 플레이하세요. 다운로드, VPN, 설치 필요 없음 - 학교, 직장, 어디서나 작동합니다.' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
  const { locale } = await params;
  const m = metaByLocale[locale] ?? metaByLocale.en;
  const canonicalUrl = await getCanonicalUrl(pagePath, locale);
  return { title: m.title, description: m.description, alternates: { canonical: canonicalUrl }, openGraph: { title: m.title, description: m.description, url: canonicalUrl }, twitter: { card: 'summary_large_image', title: m.title, description: m.description } };
}

const benefits = [
  { icon: School, title: 'Works at school', body: 'Browser-based gameplay runs on regular school networks without triggering most game-block filters. No download, no admin install required.' },
  { icon: Shield, title: 'No VPN, no proxy', body: 'Skip the slowdown of a school or work VPN. The game opens directly in your browser tab through standard HTTPS traffic.' },
  { icon: Globe, title: 'Works on any device', body: 'Play on a school Chromebook, library PC, work laptop, or personal phone. If it has a browser, it can run the hide-and-seek loop.' },
];

const steps = [
  'Open this page in your browser (Chrome, Edge, Safari, or Firefox).',
  'Click the Play button to start a hide-and-seek round inside the game frame.',
  'Use Easy mode if your school or office network is slower than usual.',
  'Bookmark this URL so you can come back during breaks and free periods.',
];

const faqs = [
  { q: 'Is Meccha Chameleon really unblocked?', a: 'It runs in a normal browser tab over HTTPS, so it works on most networks where standard websites load. Network filters vary, but browser-based play is the most reliable unblocked option we know of.' },
  { q: 'Do I need a VPN or proxy to play?', a: 'No. The game opens directly in your browser without a VPN, proxy, or download. If your network blocks browser games specifically, you may need to wait until you are on an open network.' },
  { q: 'Can I play on a school Chromebook?', a: 'Yes. Open the URL in the Chrome browser, click Play, and you are in a round within a few seconds. No extension or admin permission is needed.' },
];

export default async function UnblockedPage({ params }: { params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeUrl = await getCanonicalUrl('/', locale);
  const pageUrl = await getCanonicalUrl(pagePath, locale);
  const backHref = getLocalizedPath(locale, '/#play');

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#29211D]">
      <BreadcrumbJsonLd items={[{ name: 'Home', item: homeUrl }, { name: 'Meccha Chameleon Unblocked', item: pageUrl }]} />

      <section className="border-b border-[#f2cfd8] bg-gradient-to-br from-[#fff7c8] via-[#ffd2e1] to-[#cdefff]">
        <div className="container pt-28 pb-10 lg:pt-36">
          <a href={backHref} className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#efc8d3] bg-white px-4 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
            <ArrowLeft className="h-4 w-4" />Back to home game
          </a>
          <div className="mb-6 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Unblocked browser game</p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal md:text-6xl">Play Meccha Chameleon Unblocked</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#4C3B35] md:text-lg">Open this page in any browser and start a Meccha Chameleon round in seconds - no download, no VPN, no admin install. Works on school, work, and library networks where most game sites are blocked.</p>
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

      <section className="border-b border-[#D8CFC6] bg-[#F6F0EA]">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">How to start</p>
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">Open the page, click play, hide.</h2>
            <p className="mt-4 text-sm leading-6 text-[#4C3B35]">This unblocked version is built for people searching "Meccha Chameleon unblocked" or "chameleon unblocked games" from a school or work computer. There is nothing to install.</p>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-md border border-[#D8CFC6] bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#ff6f9a] text-sm font-bold text-white">{index + 1}</span>
                <p className="pt-1 text-sm leading-6 text-[#4C3B35]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[#7D6D69]">Unblocked play FAQ</p>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">Free unblocked play FAQ</h2>
            </div>
            <a href={getLocalizedPath(locale, '/meccha-chameleon-online')} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[#29211D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4C3B35]">
              <MousePointerClick className="h-4 w-4" />Play online version
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
                  <h3 className="font-semibold">Hide & seek on the same page</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">Looking for the paint-and-hide version? The hide and seek mode is built into the same browser tab.</p>
                </div>
                <a href={getLocalizedPath(locale, '/hide-and-seek')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Users className="h-4 w-4" />Hide and seek
                </a>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CFC6] bg-[#FFF9F5] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Try the free demo first</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4C3B35]">Want to test a short round before bringing friends in? The demo is the same browser play, just on a single map.</p>
                </div>
                <a href={getLocalizedPath(locale, '/demo')} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#D8CFC6] bg-white px-5 py-3 text-sm font-semibold text-[#29211D] transition hover:bg-[#fff7c8]">
                  <Gamepad2 className="h-4 w-4" />Free demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

### 2.2 `/hide-and-seek/page.tsx`

**路径**: `src/app/[locale]/(landing)/hide-and-seek/page.tsx`

模板与 unblocked 几乎一致，**只改以下**:
- imports: 换 icon（`Brush, EyeOff, MapPinned, Search, Users`）
- `pagePath = '/hide-and-seek'`
- 12 locale metaByLocale（key 都是 hide and seek 系列）
- `basics` 数组（3 个角色说明）替代 `benefits`
- `tips` 数组（8 条 Hider tips）替代 `steps`
- 3 个 hide-and-seek FAQ

**完整代码 (~ 15K 字符)** 见上次会话输出（我手头有完整版但**这次没写文件**——下次会话执行 SOP 时按 unblocked 模板改字段即可，不需要重新想内容）。

### 2.3 `/demo/page.tsx`

**路径**: `src/app/[locale]/(landing)/demo/page.tsx`

模板同 unblocked，关键差异:
- `pagePath = '/demo'`
- 12 locale metaByLocale
- 3 benefits（One map / Full mechanics / No signup）
- 3 FAQ
- 链接到 /unblocked 和 /hide-and-seek

### 2.4 强化 `/meccha-chameleon-online/page.tsx`

**路径**: `src/app/[locale]/(landing)/meccha-chameleon-online/page.tsx`（**已存在**）

**只做 3 个增强**:
1. 在文件底部增加 "Related Play Pages" section，链到 /unblocked /hide-and-seek /demo
2. 检查 H2 数量 (期望 5-7 个，目前 3-4 个)
3. 验证 12 locale metadata 同步（en/zh/ru + 其他 9 locale）

---

## 3. Batch 2 — 5 个语种深度页 (page.tsx)

### 3.1 通用模板

```tsx
// 文件头 (相同)
import { ArrowLeft, Brush, CheckCircle2, Gamepad2, MapPinned, MousePointerClick, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { DemoFrame } from '@/shared/blocks/meccha/demo-frame';
import { getLocalizedPath } from '@/shared/blocks/meccha/atlas-data';
import { BreadcrumbJsonLd } from '@/shared/components/seo/breadcrumb-json-ld';
import { getCanonicalUrl } from '@/shared/lib/seo';

export const revalidate = 3600;
const pagePath = '/<LOCALE>/<SLUG>';  // 例如 /ru/igrat
```

**12 locale metaByLocale**: 每个 locale 一行 title/description

**benefits (3 个 native 段落)**: 改成本地语言

**faqs (3 个 native Q&A)**: 改成本地语言

**Body 渲染逻辑**:
```tsx
const isNative = locale === '<LOCALE>';  // 例如 'ru'
const title = isNative ? '<NATIVE TITLE>' : '<ENGLISH TITLE>';
const lede = isNative ? `<native lede>` : `<english lede>`;
```

**完整模板**: ~12K 字符（与 unblocked 结构同，只是改字段）

### 3.2 5 个语种深度页内容速查

| Locale | URL | metaByLocale (12 条) | 模板 |
|---|---|---|---|
| ru | `/ru/igrat` | Играть Онлайн + 11 other locales | unblocked 结构 |
| es | `/es/donde-jugar` | Dónde Jugar + 11 other locales | unblocked 结构 |
| ar | `/ar/download` | تحميل + 11 other locales | unblocked 结构 + `dir={isAr ? 'rtl' : 'ltr'}` |
| pt | `/pt/jogar-gratis` | Jogar Grátis + 11 other locales | unblocked 结构 |
| ja | `/ja/online` | オンライン + 11 other locales | unblocked 结构 |

**metaByLocale 完整内容**: 见上次会话 `SEO_PLAN.md` 或 `SEO_REVIEW_HANDOFF.md` 备份（如果你能恢复），否则按 `git log` 查 7a5d2e9 commit 之前的对话。

---

## 4. Batch 3 — 21 个长尾 MDX

### 4.1 MDX 模板（统一格式）

每个 MDX 文件结构:
```mdx
---
title: <完整 title 包含长尾词>
description: <meta description 150-160 字符>
created_at: 2026-07-08
---

# <H1 跟 title 略有不同，更具体>

<intro 段落 50-80 词>

<iframe
  src="https://chameleon-game.com/"
  width="100%"
  height="540"
  title="<H1>"
  frameBorder="0"
  allowFullScreen
></iframe>

## <H2 章节 1: 玩法介绍>

<200-300 词段落>

## <H2 章节 2: 关键机制>

<200-300 词段落>

## <H2 章节 3: 地图列表>

- **Map 1** - 简介
- **Map 2** - 简介
- ...

## Related Play Pages

- [Meccha Chameleon Online](/meccha-chameleon-online/) - ...
- [Play Meccha Chameleon Unblocked](/unblocked/) - ...
- [Meccha Chameleon Hide and Seek](/hide-and-seek/) - ...
- [Meccha Chameleon Free Demo](/demo/) - ...
- [Map Atlas](/maps/) - ...

## FAQ

### <Q1>
<A1 30-50 词>

### <Q2>
<A2 30-50 词>

### <Q3>
<A3 30-50 词>
```

### 4.2 11 个英文长尾 MDX

| Slug | Title (≤60 字符) | Description (≤160 字符) |
|---|---|---|
| `chameleon-hide-and-seek-game` | Chameleon Hide and Seek Game - Free Browser Play | Play the chameleon hide and seek game free in your browser. Paint, hide, and outsmart the seeker with no download and no signup. |
| `hide-and-seek-paint-game` | Hide and Seek Paint Game - Free Browser Camo Game | Play the hide and seek paint game free in your browser. Paint your character, blend with the background, and outlast the seeker across 6 maps. |
| `hide-and-seek-paint-game-online` | Hide and Seek Paint Game Online - Free In Browser | Play hide and seek paint game online free in your browser. No download, no signup - paint, hide, and survive the seeker across 6 official maps. |
| `paint-hide-and-seek-online` | Paint Hide and Seek Online - Free Browser Game | Play paint hide and seek online free in your browser. Paint your character to match the wall, hide from the seeker, and survive the round. |
| `camouflage-game-online` | Camouflage Game Online - Free Browser Camo Game | Play the camouflage game online free in your browser. Paint to match the wall, hide in plain sight, and outlast the seeker in 6 official maps. |
| `chameleon-game` | Chameleon Game - Free Browser Hide and Seek | Play the chameleon game free in your browser. Paint to match the wall, hide from the seeker, and survive the round across 6 official maps. |
| `chameleon-paint-game` | Chameleon Paint Game - Free Browser Camo Game | Play the chameleon paint game free in your browser. Use the paint tool to match the wall, hide in plain sight, and outlast the seeker. |
| `meccha-chameleon-poki` | Meccha Chameleon Poki - Free Browser Alternative | Looking for Meccha Chameleon on Poki? Play the free browser version here - same paint-and-hide loop, no signup, no download, no install. |
| `meccha-chameleon-official` | Meccha Chameleon Official - Play Free In Browser | The Meccha Chameleon official browser play page. Free, no download, no signup. Same hide and seek game, same 6 official maps, same friend rooms. |
| `chameleon` | Chameleon - Free Hide and Seek Browser Game | Play the free chameleon hide and seek game in your browser. Paint to match the wall, hide in plain sight, and outlast the seeker across 6 official maps. |
| `chameleon-game-online` | Chameleon Game Online - Free Browser Play | Play the chameleon game online free in your browser. Paint, hide, and outlast the seeker across 6 official maps with no download and no signup. |

**每个 MDX 的 H1 / intro / sections / FAQs 内容**: 跟上次会话完全一致（我的对话历史里有完整版，但 worktree 丢失了文件）。**最简方案**: 用 `chameleon-hide-and-seek-game.mdx` 当模板，把 title/description/H1/intro 改成目标词，其他章节 (`How a Round Works` / `Why Paint Beats Hiding` / `6 Maps` / `Tips`) 内容**几乎可复用**——只需要把 target 长尾词替换进去。

### 4.3 5 个语种长尾 MDX (en + zh 双版本)

| Slug | Locale | Title (英文 + 中文) |
|---|---|---|
| `juego-camaleon` | es | EN: Juego Camaleón - Free Hide and Seek Online / ZH: 变色龙游戏 - 免费在线捉迷藏 |
| `jogo-camuflagem` | pt | EN: Jogo de Camuflagem - Free Hide and Seek Online / ZH: 伪装游戏 - 免费在线捉迷藏 |
| `nascondino-online` | it | EN: Nascondino Online - Free Italian Hide and Seek / ZH: 在线捉迷藏 - 免费意大利语版 |
| `jeu-cache-cache` | fr | EN: Jeu de Cache-Cache - Free Hide and Seek Online / ZH: 捉迷藏游戏 - 免费在线版 |
| `chameleon-spiel` | de | EN: Chameleon Spiel - Free German Hide and Seek / ZH: 变色龙游戏 - 免费德语版 |

**MDX 结构**: 跟英文长尾同，但 sections 内容有 native 语言版本（西/葡/意/法/德），ZH 版是中文。

---

## 5. 验证步骤

### 5.1 TypeScript 检查

```bash
cd /Users/zhanglongchao/worktrees/mecchachameleon-art/mcc-seo-batch1-plus-009
npx tsc --noEmit -p tsconfig.json
# 期望: 0 错误
```

### 5.2 Build 测试

```bash
pnpm build:fast 2>&1 | tail -60
# 期望: exit 0 + 所有新路由生成
```

### 5.3 本地起 dev server 抽查

```bash
pnpm dev
# 浏览器打开
# http://localhost:3000/unblocked
# http://localhost:3000/hide-and-seek
# http://localhost:3000/demo
# http://localhost:3000/ru/igrat
# http://localhost:3000/es/donde-jugar
# http://localhost:3000/chameleon-hide-and-seek-game
# ...
```

### 5.4 提交

```bash
git add -A
git status  # 检查无意外文件
git -c user.name="Hermes Agent" -c user.email="agent@hermes.local" commit -m "feat(seo): batch 1-3 - 8 play pages + 21 longtail MDX

Implements SEO expansion from SEO_PLAN.md / GSC 28-day data:
- 4 play pages: /meccha-chameleon-online (reinforced), /unblocked,
  /hide-and-seek, /demo
- 5 locale depth pages: /ru/igrat, /es/donde-jugar, /ar/download,
  /pt/jogar-gratis, /ja/online
- 11 English longtail MDX
- 5 locale longtail MDX (en + zh each)

Body: 12 locale metadata, English body for play pages, native
body in core 5 depth pages, English + Chinese body for longtail
MDX.

Refs: SEO_PLAN.md, SEO_REVIEW_HANDOFF.md"

git push -u origin feat/seo-batch1-plus-009
# 打开 PR
```

---

## 6. 完成后必做

1. **更新 sitemap.xml**: 加入新页面（参考 Batch 0 的脚本）
2. **GSC 提交**: 部署后立即在 GSC 提交 sitemap
3. **本地化 review agent 通知**: review 这 29 个新文件的 metadata
4. **更新 SEO_PLAN.md** "7. 关键文件改动历史" 表格，加新 commit

---

## 7. 已知风险 + 应对

| 风险 | 应对 |
|---|---|
| worktree 再次丢失 | 每个 page.tsx 写完立即 `git add` + 单文件 `git commit`，分散风险 |
| TypeScript 错误 | 每个 page.tsx 写完跑 `npx tsc --noEmit` |
| MDX 渲染失败 | 跑 `pnpm build:fast` 看 `.next` 产物 |
| 7 个 locale 仍然不显示 native body | 接受：当前批次只 body 英文，metadata 12 locale 完整 |
| 路由冲突 | 具体路径 (`/hide-and-seek/`) 优先于 catch-all (`/[...slug]/`) |
| iframe 在 MDX 失效 | 用裸 `<iframe>` HTML 标签（已验证可行） |
