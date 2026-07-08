# mecchachameleon.art SEO 扩页面完整计划

> 数据基础: GSC 28 天报告 (2026-06-10 ~ 2026-07-08)
> 规模: 1000 queries / 83882 imp / 5579 clk / 6.65% CTR
> 决策时间: 2026-07-08
> 协作: 用户 (大帅哥) + Hermes Agent (代码) + Local Agent (review)

---

## 0. 三个真相（先看这个）

### 真相 1 — 7 个 locale 缺 `common.json`

`getMetadata` 走 `common.metadata` → next-intl 回退 en → 7 个 locale title 全是英文
- **影响**: GSC 抓取 /es /fr /ar /pt /ja /de /it 页面 title 都是 "Meccha Chameleon Play Online — Browser Game"
- **修复成本**: 8 个 JSON 文件，1 小时
- ✅ **Batch 0.5 已完成** (commit `7a5d2e9`)

### 真相 2 — hreflang 圈已经分两层（设计正确）

- 首页 (`/`): 12 个 locale 互链 ✅
- 子页 (`/maps/...` 等): 只对 en/zh/ru 出 hreflang ⚠️
  - 原因: 7 个 locale 没有"子页面本地化版本"，直接暴露半翻译子页会稀释质量
  - **修法**: 7 个 locale 子页加 `noindex`，或子页同步本地化
  - **决策**: 保守 (保持现状)

### 真相 3 — sitemap.xml 只 14 个 URL

14 个 URL = 首页 × 1 + /zh × 1 + /new-player × 2 + 6 个 maps × 2
- **缺**: 8 个语种首页 + 全部子页
- ✅ **Batch 0 已完成** (commit `7a5d2e9`，扩到 96 URL)

---

## 1. GSC 关键词分类

### 按语种 (imp / clk / CTR)

| Locale | Imp | Clk | CTR | 价值 |
|---|---|---|---|---|
| en | 65,901 | 3,996 | 6.06% | 主战场 |
| ar | 5,797 | 421 | 7.26% | 大语种 |
| es | 4,903 | 347 | 7.08% | 大语种 |
| ru | 3,691 | 351 | **9.51%** | 转化最好 |
| pt | 2,058 | 180 | 8.75% | 中等 |
| ja | 961 | 222 | **23.10%** | 转化逆天但量小 |
| fr | 571 | 62 | 10.86% | 小 |
| it | 274 | 9 | 3.28% | 极小 |
| de | 257 | 21 | 8.17% | 极小 |
| nl | 46 | 3 | 6.52% | 噪音 |

### 按玩法需求 (imp / clk / CTR)

| Intent | Imp | Clk | CTR | 状态 |
|---|---|---|---|---|
| brand | 49,311 | 3,506 | 7.11% | 首页已接 |
| **online** ⭐ | 12,967 | 461 | **3.56%** | `/meccha-chameleon-online` 有但无内链 |
| play | 6,085 | 497 | 8.17% | 首页接住 |
| game | 5,697 | 172 | 3.02% | 未专门接 |
| **hide-and-seek** | 5,499 | 358 | 6.51% | **未做承接页** |
| camouflage | 1,726 | 204 | 11.82% | 未做 |
| free | 1,211 | 170 | 14.04% | 未做 |
| download | 654 | 59 | 9.02% | 反向需求 |
| **browser** | 264 | 67 | **25.38%** | 高 CTR 未接 |
| **unblocked** ⭐ | 191 | 52 | **27.23%** | 最高 CTR 未做 |
| demo | 130 | 15 | 11.54% | 未做 |
| mobile | 145 | 17 | 11.72% | 未做 |

### Top 20 必接词（按 imp 排）

| Imp | CTR | Pos | Query | 处理 |
|---|---|---|---|---|
| 8233 | 0.58% | 10.7 | meccha chameleon online | 修复 `/meccha-chameleon-online` 内链 |
| 933 | 4.18% | 8.7 | chameleon hide and seek | **新建 `/hide-and-seek/`** |
| 820 | 0.98% | 11.2 | mecha chameleon online | 同上路由 |
| 635 | 1.73% | 9.5 | meccha chameleon donde jugar | **新建 `/es/donde-jugar/`** |
| 473 | 4.44% | 10.9 | hide and seek paint game | **新建 `/hide-and-seek-paint-game/`** |
| 321 | 0.31% | 15.4 | meccha chameleon download | 新建 `/no-download/` |
| 265 | 1.13% | 9.6 | donde jugar meccha chameleon | 共享 `/es/donde-jugar/` |

---

## 2. 页面计划（按 ROI 排）

### Batch 0 + 0.5（已完成，commit `7a5d2e9`）

- ✅ sitemap.xml: 14 → 96 URL
- ✅ 8 个 locale common.json: 本地化 metadata

### Batch 1（4 个核心玩法页）

| Slug | 承接词 | Imp | 模板 |
|---|---|---|---|
| `/meccha-chameleon-online/` 强化 | meccha chameleon online | 8233 | 现有 page + 加内链/强化 H2 |
| `/hide-and-seek/` | chameleon hide and seek | 933 | T2 hide-and-seek |
| `/unblocked/` | meccha chameleon unblocked | 191 | T1 unblocked |
| `/demo/` | meccha chameleon demo | 130 | T3 demo |

### Batch 2（5 个语种深度页）

按 GSC 价值排：

| Locale | Slug | 主词 imp | CTR |
|---|---|---|---|
| ru | `/ru/igrat` | 2298 | 9.5% |
| es | `/es/donde-jugar` | 635 | 1.7% |
| ar | `/ar/download` | 177 | 0.6% |
| pt | `/pt/jogar-gratis` | 200+ | 8% |
| ja | `/ja/online` | 961 | 23% |

### Batch 3（21 个长尾 MDX）

- 11 英文长尾: `chameleon-hide-and-seek-game` `hide-and-seek-paint-game` `hide-and-seek-paint-game-online` `paint-hide-and-seek-online` `camouflage-game-online` `chameleon-game` `chameleon-paint-game` `meccha-chameleon-poki` `meccha-chameleon-official` `chameleon` `chameleon-game-online`
- 5 语种长尾 (en + zh 双版本): `juego-camaleon` `jogo-camuflagem` `nascondino-online` `jeu-cache-cache` `chameleon-spiel`

---

## 3. URL 路由策略

### 已存在路由（page.tsx，hardcoded）
- `/meccha-chameleon-online/` — 已有
- `/hide-and-seek/` — 待建
- `/unblocked/` — 待建
- `/demo/` — 待建
- `/ru/igrat/` `/es/donde-jugar/` 等 — 待建

### Catch-all 路由（MDX）
- `src/app/[locale]/(landing)/[...slug]/page.tsx`
- 自动加载 `content/pages/<slug>.mdx`
- **重要**: `pagesSource` i18n 配置只支持 en 和 zh
  - 文件 `src/core/docs/source.ts`: `languages: ['en', 'zh']`
  - 含义: 21 个 MDX 只能 `slug.mdx` (en) + `slug.zh.mdx` 双版本
  - 其他 10 locale 走 en fallback

### 路由冲突检查
- 现有具体路由 (`/hide-and-seek/page.tsx`) 优先于 catch-all (`/[...slug]/page.tsx`)
- 不会冲突 ✅

---

## 4. 关键文件位置

```
mecchachameleon-art/
├── public/
│   └── sitemap.xml                    # 96 URLs (Batch 0 ✅)
├── content/pages/                     # MDX 文件
│   ├── privacy-policy.mdx             # 现有
│   ├── privacy-policy.zh.mdx          # 现有
│   ├── terms-of-service.mdx           # 现有
│   ├── terms-of-service.zh.mdx        # 现有
│   └── [21 个新 MDX]                  # 待建 (Batch 3)
├── src/
│   ├── app/[locale]/(landing)/
│   │   ├── page.tsx                   # 首页 (已含各语种 SEO section)
│   │   ├── meccha-chameleon-online/
│   │   │   └── page.tsx               # 现有 (Batch 0 强化)
│   │   ├── hide-and-seek/
│   │   │   └── page.tsx               # 待建 (Batch 1)
│   │   ├── unblocked/
│   │   │   └── page.tsx               # 待建 (Batch 1)
│   │   ├── demo/
│   │   │   └── page.tsx               # 待建 (Batch 1)
│   │   ├── ru/igrat/page.tsx          # 待建 (Batch 2)
│   │   ├── es/donde-jugar/page.tsx    # 待建 (Batch 2)
│   │   ├── ar/download/page.tsx       # 待建 (Batch 2)
│   │   ├── pt/jogar-gratis/page.tsx   # 待建 (Batch 2)
│   │   ├── ja/online/page.tsx         # 待建 (Batch 2)
│   │   └── [...slug]/page.tsx         # catch-all (MDX)
│   ├── app/layout.tsx                 # hreflang 圈 filter (第 54-56 行)
│   ├── shared/blocks/meccha/
│   │   ├── demo-frame.tsx             # 客户端组件 (DemoFrame)
│   │   ├── atlas-data.ts              # getLocalizedPath
│   │   ├── arabic-seo-section.tsx     # 现有 (仅 en 首页用)
│   │   ├── french-seo-section.tsx     # 现有
│   │   └── ... (8 个语种 SEO section)
│   ├── shared/lib/seo.ts              # getMetadata / getCanonicalUrl
│   ├── shared/components/seo/
│   │   └── breadcrumb-json-ld.tsx     # JSON-LD breadcrumb
│   ├── config/locale/
│   │   ├── index.ts                   # seoLocales, fullyTranslatedLocales
│   │   └── messages/
│   │       ├── en/common.json         # 完整
│   │       ├── zh/common.json         # 完整
│   │       ├── ru/common.json         # 完整
│   │       ├── nl/common.json         # ✅ Batch 0 修了
│   │       ├── es/common.json         # ✅ Batch 0 新建
│   │       ├── fr/common.json         # ✅ Batch 0 新建
│   │       ├── ar/common.json         # ✅ Batch 0 新建
│   │       ├── pt/common.json         # ✅ Batch 0 新建
│   │       ├── ja/common.json         # ✅ Batch 0 新建
│   │       ├── de/common.json         # ✅ Batch 0 新建
│   │       └── it/common.json         # ✅ Batch 0 新建
│   ├── core/i18n/
│   │   ├── config.ts                  # next-intl routing 配置
│   │   └── ...
│   └── core/docs/source.ts            # pagesSource i18n (en/zh only)
├── SEO_PLAN.md                        # ✅ 本文件
├── SEO_BATCH1_PLUS_SOP.md             # 完整 SOP + 模板
└── SEO_REVIEW_HANDOFF.md              # 本地化 review 交接包
```

---

## 5. 12 locale 完整列表

```
en, zh, ru, es, de, pt, fr, it, nl, ar, ja, ko
```

配置位置:
- `src/config/locale/index.ts`: `locales` 数组 (15 个: + th, vi, zh-TW)
- `src/config/locale/index.ts`: `seoLocales` (12 个, GSC 露出)
- `src/config/locale/index.ts`: `fullyTranslatedLocales` (3 个: en, zh, ru)
- `src/core/docs/source.ts`: `languages: ['en', 'zh']` (MDX i18n 限制)

**重要含义**:
- 子页 hreflang 圈只对 en/zh/ru (在 layout.tsx 第 56 行 filter)
- 7 个 locale 子页靠元数据本地化获得 CTR
- MDX 只支持 en + zh 双版本

---

## 6. 4 周预估收益

**保守 4 周预估**:
- 月点击从 5,579 → 9,000-12,000 (+60-110%)
- impression 预计涨 30-50%
- `/meccha chameleon online` 关键词从 48 → 250+ 点击/月 (仅一词)
- `/chameleon hide and seek` 关键词从 39 → 80+ 点击/月
- 7 个 locale 首页 CTR 涨 30-50%

**关键 GSC 指标监控**:
- 1 周后: 覆盖率 (sitemap 提交效果)
- 4 周后: 网页报表 (新 URL 收录)
- 8 周后: 查询报表 (长尾词排名)

---

## 7. 关键文件改动历史

| Commit | 改动 | 状态 |
|---|---|---|
| `7a5d2e9` (本次) | sitemap + 8 common.json | ✅ 已 push |
| (下次) | 8 page.tsx + 21 MDX | ⏳ 见 SEO_BATCH1_PLUS_SOP.md |
| (可选) | hreflang 圈扩展 (layout.tsx) | ⏳ |
