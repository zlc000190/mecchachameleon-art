# WORK_CONTEXT — wt/i18n-community-indexable-008

**Worktree 路径**: `~/worktrees/mecchachameleon-art/mcc-i18n-community-indexable-008`
**分支**: `wt/i18n-community-indexable-008`（基于 `main@2bcc587`）
**目标仓库**: `https://github.com/zlc000190/mecchachameleon-art.git`
**目标**: 让 `/community`、`/community/gallery`、`/community/gallery/<id>` 三页被 Google 收录（去掉 `noindex` + 加 hreflang 14 语种）

---

## 0. 一句话结论

3 个 community page.tsx 文件：
- `robots: { index: false, follow: false }` → `{ index: true, follow: true }`
- `canonical` 从 `getCanonicalUrl('/community', locale)` 改成 **永远指向 `/community`**（不带 locale）
- 加 `alternates.languages` —— 14 语种都指向 `/community`（告诉 Google 多语言版本，alternate URL 会 301 到 canonical）

**3 个文件，~60 行变更，0 个新文件**。

---

## 1. 改了什么 / 为什么

### 1.1 根因（之前 /community 收不到 Google 收录的原因）

实测 main HEAD `2bcc587` 下 `/community` 页面的 `<head>`：
```html
<title>Community 30-Minute Hiding Challenges | Meccha Chameleon</title>
<link rel="canonical" href="https://mecchachameleon.art/community" />
<meta name="robots" content="noindex, nofollow" />
```

3 个问题：
1. **`robots: noindex`** — `community/page.tsx`、`gallery/page.tsx`、`gallery/[id]/page.tsx` 各自硬编码了 `robots: { index: false, follow: false }`（之前的设计意图：community 是 demo 区不想让 Google 索引）
2. **`/zh/community` 等** 也返回 200 但 canonical 是 `/zh/community`（不同 URL）—— 重复内容风险
3. **`hreflang` 数量 = 0** —— 缺多语言 alternate 信号

### 1.2 修复

3 个 page.tsx：

**每个 generateMetadata 改成**：
- 移除 `const { locale } = await params`（**不再用 locale 参数**）
- `canonical` 硬编码为 `${envConfigs.app_url}/community`（不带 locale）—— 因为 `/<locale>/community` 会 301 到 `/community`，**唯一 canonical**
- 加 `alternates.languages: { en, zh, ru, ..., nl: '/community' }` —— 14 语种都列，alternate URL 即使 301 也能告诉 Google 多语言关系
- `robots: { index: true, follow: true }`（**收录！**）
- gallery/[id] 的 404 case 保留 noindex（不索引错误页）

### 1.3 没改的（保护边界）

- **proxy.ts**：已经处理 `/<locale>/community` → 301 → `/community`（上一轮 `/it/community` 修复）
- **getCanonicalUrl()**：保留不动（其他 page 还在用）
- **getMetadata()**：保留不动（已经有 `alternates.languages` 字段支持）
- **next.config.mjs / Dockerfile / sitemap / lockfile / page.tsx 外的其他文件**：完全不动
- **landing.json 翻译内容**：本 commit 不涉及（属于 4 语种首页本地化工作）

---

## 2. 本地端到端验证（已跑过）

```
$ pnpm build               # ✅ exit 0
$ node .next/standalone  # ✅ Ready

# 各 locale /community 行为（不带 -L 看第一步响应）:
/community       → 200 ✅
/en/community    → 307 → /community ✅
/zh/community    → 200 (渲染 /community 内容) ✅
/ja/community    → 200 ✅
/vi/community    → 200 ✅
/nl/community    → 200 ✅

# /community head meta:
title:        Community 30-Minute Hiding Challenges | Meccha Chameleon
canonical:    https://mecchachameleon.art/community
robots:       index, follow ✅
hreflang:     14 个 alternate (en/zh/ru/it/fr/de/es/pt/ja/ko/ar/th/vi/zh-TW/nl + x-default)
              全部指向 https://mecchachameleon.art/community
```

---

## 3. 下一步（接手 agent）

### 3.1 提交 + 推送

```bash
cd ~/worktrees/mecchachameleon-art/mcc-i18n-community-indexable-008

git add src/app/[locale]/(landing)/community/page.tsx \
        src/app/[locale]/(landing)/community/gallery/page.tsx \
        src/app/[locale]/(landing)/community/gallery/[id]/page.tsx \
        WORK_CONTEXT.md
git status  # 确认 4 个文件

git commit -m "feat(seo): make /community indexable by Google

The three community page.tsx files (community, gallery, gallery/[id])
hardcoded robots: { index: false, follow: false }. The design intent
was to keep the demo community section out of Google, but the user
wants organic traffic now that the section is real.

This commit:
- Flips robots to { index: true, follow: true } on all three pages.
  The 404 case in gallery/[id] stays noindex (don't index errors).
- Removes locale from generateMetadata and hardcodes the canonical
  URL to https://mecchachameleon.art/community (no locale prefix).
  /<locale>/community is already 301'd to /community by the proxy
  (per commit 4bb1f19 + the keySeoPages isKeySeoPath mechanism),
  so this is the single URL Google should index. Without this,
  /zh/community and /community would each have a distinct canonical
  pointing at the same English content — duplicate-content risk.
- Adds alternates.languages enumerating all 14 supported locales
  (en, zh, ru, it, fr, de, es, pt, ja, ko, ar, th, vi, zh-TW, nl) plus
  x-default, all pointing at the same /community URL. Google uses
  hreflang even when all alternates 301 to the same canonical, which
  is the standard pattern for \"this page is available in N locales
  but not yet localized\".
- Gallery/[id] page keeps noindex for the challenge-not-found branch
  so 404 challenges never make it into Google.

Verified locally against pnpm build + standalone server:
- /community head meta now emits robots: index, follow and 14 hreflang
  alternates all pointing at /community.
- /community/gallery and /community/gallery/<id> same shape.
- /<locale>/community still 307/200 (locale strip or single-URL render);
  canonical under those URLs all points at /community to avoid
  duplicate-content."

git push -u origin wt/i18n-community-indexable-008
```

### 3.2 等用户 review 后 ff-merge main

```bash
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git checkout main
git pull origin main
git merge --ff-only origin/wt/i18n-community-indexable-008
git push origin main

git worktree remove ~/worktrees/mecchachameleon-art/mcc-i18n-community-indexable-008
git push origin --delete wt/i18n-community-indexable-008
git branch -d wt/i18n-community-indexable-008
```

### 3.3 Dokploy 那边的预期

- build log `✓ Compiled successfully`
- 线上 https://mecchachameleon.art/community → robots: index, follow + 14 hreflang
- Google Search Console 「已抓取未索引」数量会因为 robots 翻转而增加（正确信号）
- 不破坏任何已有路由

---

## 4. 父仓 dirty 状态（merge 时必须处理）

**重要**：merge 这个 commit 之前，父仓 main 有 4 个 dirty 改动（被 `git stash` 保护了）：

| 文件 | 改动来源 | 处理 |
|---|---|---|
| `Dockerfile` | 之前 `fa479ba` libsql 修复残留（git reset 没清干净）| **stash@{0} 留着**，deploy 出问题要恢复 |
| `src/app/robots.ts` | 加 `OAI-SearchBot` allow（OpenAI Search Bot）| 待用户决定是否单独 ship |
| `public/robots.txt` | 加 `OAI-SearchBot` allow（与 robots.ts 配套）| 同上 |
| `public/sitemap.xml` | build 产物（每次 build 都变）| 无用，可丢 |

**接手 agent 在 ff-merge 之前**：父仓应保持 `nothing to commit, working tree clean`（已经 stash 过）。merge 完成后再 `git stash pop`，看 dirty 内容**单独 commit**（OAI-SearchBot）或**stash drop**（Dockerfile 那条 stash 内容是已知 libsql 修复）。

---

## 5. 关键路径速查

| 路径 | 作用 |
|---|---|
| `/Users/zhanglongchao/programPJ/mecchachameleon-art` | 父仓 (main, 当前 `2bcc587`)，**已经 stash dirty** |
| `~/worktrees/mecchachameleon-art/mcc-i18n-community-indexable-008` | **本 worktree**（4 文件改动待 commit） |
| `~/worktrees/mecchachameleon-art/mcc-i18n-og-8locales-007` | 8 locale common.json worktree（**没合并**，用户 review 中） |
| `~/worktrees/mecchachameleon-art/mcc-art-001` | 现存（**别碰**）|
| `~/worktrees/mecchachameleon-art/mcc-backlinks-001` | 现存（**别碰**）|

## 6. 不要重蹈

- **不要碰** `proxy.ts` —— 已经处理 `/<locale>/community` → 301 `/community`
- **不要碰** `getCanonicalUrl()` —— 其他 page 还在用，本 commit 不该改公用工具
- **不要碰** `sitemap.xml` —— build 产物
- **不要碰** 父仓 dirty（已经 stash 保护）—— merge 完成后再单独处理
