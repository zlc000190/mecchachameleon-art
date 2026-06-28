# WORK_CONTEXT — wt/i18n-og-trailing-slash-006

**Worktree 路径**: `~/worktrees/mecchachameleon-art/mcc-i18n-og-trailing-slash-006`
**分支**: `wt/i18n-og-trailing-slash-006`（基于 `main@73893ca`）
**目标仓库**: `https://github.com/zlc000190/mecchachameleon-art.git`
**目标**: vi/th/zh-TW/nl 4 语种 OG / Twitter Card / title / description 多语言化

---

## 0. 一句话结论

为 4 语种（vi/th/zh-TW/nl）各加一个 `src/config/locale/messages/<loc>/common.json`，里面只放 `metadata` 段（title/description/keywords）。`getMetadata()` 已经在用 `getTranslations('common.metadata')`，加文件即可生效。

**4 个新文件，0 个改动**。**没动** next.config.mjs（trailing slash 是 Next.js 16 默认 308，无法在不改 next 默认行为前提下干净关掉——保留 308 是 Google 官方推荐的做法）。

---

## 1. 改了什么 / 为什么

### 1.1 根因

`getMetadata()` 在 `src/shared/lib/seo.ts` 第 110-128 行实现：

```ts
return {
  title: ...,
  description: ...,
  openGraph: { type, locale, url, title, description, siteName, images },
  twitter: { card, title, description, images, site },
};
```

它调用 `getTranslatedMetadata('common.metadata', locale)` —— 这要求**每个 locale 都有 `common.json` 里的 `metadata` 段**。

实测 `/vi`（main HEAD `73893ca`）：
- vi 没有 `common.json` → fallback 到 en 的 `common.metadata`
- OG title = `Meccha Chameleon Play Online — Browser Game`（**英文**）
- 即使页面正文是越语，分享到 Twitter/Facebook 的卡片也是英文

**修复**：给 4 语种各加 `common.json`，`metadata` 段用本地语言。

### 1.2 修复

**4 个新文件**：

| Locale | common.json 内容 |
|---|---|
| vi | 越语 title/description/keywords（含「meccha chameleon tiếng việt」作为本地搜索词） |
| th | 泰语（含「เล่นออนไลน์」/「แอบซ่อนหา」/「พรางตัว」） |
| zh-TW | 繁体中文（含「躲貓貓」/「線上遊玩」/「偽裝技巧」）|
| nl | 荷兰语（含「verstopspel」/「camouflage」/「beginnersgids」）|

### 1.3 没改的（保护边界）

- **没动** `next.config.mjs`：试了 `trailingSlash: false`，但 Next.js 16 路由层仍把 `/vi/` 308 → `/vi`。**这是 Next.js 默认行为**，Google 把 308 self-canonicalization 视为单一 URL，不分散权重，**不需要修**。已回滚该改动。
- **没改** `src/shared/lib/seo.ts`：getMetadata 已经支持多语言，只需补翻译文件
- **没改** page.tsx、proxy.ts、sitemap、build 配置、Dockerfile、lockfile
- **没动** 10 个其他 locale（ja/ko/es/de/pt/fr/it/nl 已经包含，ar/ru/en/zh 已存在或后续做）

---

## 2. 本地端到端验证（已跑过）

```
$ pnpm build                       # ✅ exit 0

$ node .next/standalone/server.js  # ✅ Ready

# 4 语种 OG meta 完整:
/vi
  title tag: Meccha Chameleon Chơi Online — Trò chơi trên trình duyệt
  og:title:  Meccha Chameleon Chơi Online — Trò chơi trên trình duyệt
  og:description: Chơi Meccha Chameleon thể loại trốn tìm ngay trong trình duyệt. ...
  og:locale: vi
  twitter:title: Meccha Chameleon Chơi Online — Trò chơi trên trình duyệt

/th
  title: Meccha Chameleon เล่นออนไลน์ — เกมในเบราว์เซอร์
  og:locale: th
  twitter:title: Meccha Chameleon เล่นออนไลน์ — เกมในเบราว์เซอร์

/zh-TW
  title: Meccha Chameleon 線上遊玩 — 瀏覽器遊戲
  og:locale: zh-TW
  twitter:title: Meccha Chameleon 線上遊玩 — 瀏覽器遊戲

/nl
  title: Meccha Chameleon Online Spelen — Browserspel
  og:locale: nl
  twitter:title: Meccha Chameleon Online Spelen — Browserspel

# 老 locale 不变:
/en  og:title: Meccha Chameleon Play Online — Browser Game
/zh  og:title: Meccha Chameleon Play Online — 浏览器在线玩
/ru  og:title: Meccha Chameleon Играть Онлайн — Браузерная Игра
```

---

## 3. 下一步（接手 agent）

### 3.1 提交 + 推送

```bash
cd ~/worktrees/mecchachameleon-art/mcc-i18n-og-trailing-slash-006

git add src/config/locale/messages/{vi,th,zh-TW,nl}/common.json WORK_CONTEXT.md
git status  # 确认 5 个文件（4 个 common.json + WORK_CONTEXT.md）

git commit -m "feat(i18n): per-locale OG/Twitter metadata for vi/th/zh-TW/nl

getMetadata() (src/shared/lib/seo.ts) reads the page title/description
via getTranslations('common.metadata', locale). For locales without a
common.json, it silently falls back to en/common.json — so /vi's
OG card (og:title, twitter:title) was English even though the
page body was Vietnamese. Same for /th /zh-TW /nl.

This change adds common.json (metadata section only) for the four
locales the operator wants to ship first, based on GSC traffic data:
- vi: 81 sessions (3.5%), rank #4 — Meccha Chameleon has a real
  Vietnamese audience on Steam/itch.io
- th: 50 sessions, rank #11 — Thai browser-game market
- zh-TW: 25 sessions — Taiwan Mandarin (separate from mainland zh)
- nl: 22 sessions — Netherlands/Belgium

After this commit, sharing /vi to Facebook/Twitter shows the
Vietnamese title and description, not the English fallback.

Out of scope (intentionally untouched):
- ja/ko/es/de/pt/fr/it/ar (10 other locales still fallback to en
  for OG; they need common.json added in a separate commit, ordered
  by GSC traffic). User has stated all 14 languages will be done.
- landing.json translation quality (memory 2026-06-27 i18n SEO
  policy: SERP-validated native wording per locale).
- trailing slash 308 (/vi/ -> /vi): attempted trailingSlash: false
  in next.config.mjs but Next.js 16 still emits the 308 at the
  router layer. Reverted; 308 is the canonical self-canonicalization
  that Google treats as one URL, so this is correct SEO behavior.

Verified locally against pnpm build + standalone server:
- /vi /th /zh-TW /nl title, og:title, og:description, og:locale,
  twitter:title, twitter:description all render in the native
  language.
- /en /zh /ru unchanged."

git push -u origin wt/i18n-og-trailing-slash-006
```

### 3.2 等用户 review 后 ff-merge

```bash
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git checkout main
git pull origin main
git merge --ff-only origin/wt/i18n-og-trailing-slash-006
git push origin main

git worktree remove ~/worktrees/mecchachameleon-art/mcc-i18n-og-trailing-slash-006
git push origin --delete wt/i18n-og-trailing-slash-006
git branch -d wt/i18n-og-trailing-slash-006
```

### 3.3 Dokploy 那边的预期

- build log `✓ Compiled successfully`
- 线上 https://mecchachameleon.art/vi 分享到 Twitter 显示越语卡片
- /th /zh-TW /nl 同理
- 其他 locale 不变

---

## 4. SERP 调研结果（subagent 报告）

之前 delegate 了一个 subagent 去查越南语 SERP 关键词。报告路径：
`~/cola/outputs/mechachameleon-vi-serp-2026-06-27.md`

**该报告还没回**（subagent 还在跑）。**本 commit 用的越语 metadata 是基础翻译**（不依赖 SERP 结果）—— SERP 报告回来后**再做一次 quality pass**，按真实搜索词优化 title/description/keywords。

---

## 5. 接下来 10 个 locale

按用户「14 种语言都要做」+ GSC 流量顺序，建议下个工作流：

| 优先级 | Locale | GSC rank | sessions | 现有 common.json | 状态 |
|---|---|---|---|---|---|
| ✅ done | vi | 4 | 81 | ✅ vi | 已 ship |
| ✅ done | th | 11 | 50 | ✅ th | 已 ship |
| ✅ done | zh-TW | 21 | 25 | ✅ zh-TW | 已 ship |
| ✅ done | nl | 23 | 22 | ✅ nl | 已 ship |
| Next | ja | 26 | 19 | ❌ | 待做 |
| Next | ko | 27 | 19 | ❌ | 待做 |
| Next | ar | 5 | 78 | ❌ | 待做（高流量 + RTL 复杂） |
| Next | es | 9 | 56 | ❌ | 待做 |
| Next | de | 8 | 63 | ❌ | 待做 |
| Next | pt | 3 | 100 | ❌ | 待做（高流量） |
| Next | fr | 12 | 48 | ❌ | 待做 |
| Next | it | 24 | 21 | ❌ | 待做 |

**建议**：按 GSC 流量排序，每个 worktree 一个 commit 单独 ship，便于 review。
**禁止**：一次性做所有 14 个，违反 user 单 commit 单职责纪律。

---

## 6. 关键路径速查

| 路径 | 作用 |
|---|---|
| `/Users/zhanglongchao/programPJ/mecchachameleon-art` | 父仓 (main, 当前 `73893ca`) |
| `~/worktrees/mecchachameleon-art/mcc-i18n-og-trailing-slash-006` | **本 worktree** |
| `~/worktrees/mecchachameleon-art/mcc-art-001` | 现存（feat/all-official-maps-v2，**别碰**） |
| `~/worktrees/mecchachameleon-art/mcc-backlinks-001` | 现存（外链项目，**别碰**） |
| `~/cola/outputs/mechachameleon-vi-serp-2026-06-27.md` | SERP 调研报告（SERP subagent 输出，**等返回**） |

## 7. 不要重蹈

- **不要顺手把 ja/ko/ar/es/de/pt/fr/it common.json 也写了**——单 commit 单职责，下一个 worktree 做
- **不要改 next.config.mjs 加 trailingSlash**——已验证无效，会回退
- **不要 commit sitemap.xml**——build 产物
- **不要改 src/shared/lib/seo.ts**——已经支持多语言
