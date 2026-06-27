# WORK_CONTEXT — wt/locales-th-vi-zh-tw-004

**Worktree 路径**: `~/worktrees/mecchachameleon-art/mcc-locales-th-vi-zh-tw-004`
**分支**: `wt/locales-th-vi-zh-tw-004`（基于 `main@593b48e`，生产稳定版）
**目标仓库**: `https://github.com/zlc000190/mecchachameleon-art.git`

---

## 0. 一句话结论

修了 `/<locale>/community*` 在所有 12 个非英文 locale 下被 proxy 一刀切 301 到 `/` 的 bug。现在 `/it/community`、`/ko/community/gallery`、`/ja/community/challenges` 等能正常 strip locale 到英文版对应页面。**只改 2 个文件，+8/-1 行，零行为回归风险**。

**重要**：本 worktree **只修 community 路由**。4 语种首页放开（`th/vi/zh-TW`）、sitemap 收录 4 语种 — **这些不在本 commit**，留给另一个 worktree。

---

## 1. 改了什么 / 为什么

### 1.1 根因

`src/proxy.ts` 的第二条 if 条件：
```js
if (isValidLocale && (locale === 'es' || ... || 'ja' || 'ko') &&
    pathWithoutLocale !== '' && pathWithoutLocale !== '/') {
  return NextResponse.redirect('/', 301);  // 一刀切到根
}
```

**问题**：这个条件**没看路径是不是 key SEO 页**——`/it/tools`、`/it/community` 等都被 301 到 `/`，但这些 key SEO 页应该被 next-intl middleware 自动 strip locale 跳到英文版（`/it/tools → /tools`、`/it/community → /community`）。

**历史**：git log 显示 `1c6d6fe fix: halt half-translated locale indexing` 这个 commit 把之前的 `!isKeySeoPath(pathWithoutLocale)` 豁免逻辑**改没了**——之前的版本是「key SEO 页不重定向、非 key SEO 页 302 到 `/en${path}`（保留路径 strip locale）」。

### 1.2 修复

**文件 1: `src/config/locale/index.ts`** — `keySeoPages` 加 `/community`
```diff
 export const keySeoPages = [
   '/',
   '/tools',
   '/new-player',
   '/maps',
+  '/community',
 ] as const;
```

**为什么用 `keySeoPages`**：因为 `isKeySeoPath()` 实现是 `startsWith('${p}/')`，**加 `/community` 自动覆盖 `/community/gallery`、`/community/challenges` 等所有子路径**。一行就解决所有 community 子页面。

**文件 2: `src/proxy.ts`** — 第二条 if 加 `!isKeySeoPath(pathWithoutLocale)` 豁免
```diff
   if (
     isValidLocale &&
     (locale === 'es' || ... || 'ja' || 'ko') &&
     pathWithoutLocale !== '' &&
-    pathWithoutLocale !== '/'
+    pathWithoutLocale !== '/' &&
+    !isKeySeoPath(pathWithoutLocale)
   ) {
```

**为什么改这条**：如果不豁免，`/it/community` 还是会先被这条 if 拦下 301 到 `/`，根本走不到 next-intl middleware 的 fallback。

### 1.3 没改的（保护边界）

- `NEW_LOCALES = ['th', 'vi', 'zh-TW']` 数组 → 4 语种整站 301 到 `/` 的逻辑**保留不动**（4 语种放开是另一件事）
- 第一条 if（`NEW_LOCALES` 整站 301）**完全不动**
- sitemap builder 不动
- 任何 `src/app/` 下的 page.tsx 不动
- 不动 `next.config.mjs` / `Dockerfile` / `pnpm-lock.yaml`

---

## 2. 本地端到端验证（已跑过）

```
$ pnpm build → exit 0

$ node .next/standalone/server.js → Ready in <1s

# 你提的问题 ✅
/it/community             → 200 ✅（之前 301 → /）
/ko/community/gallery     → 200 ✅（之前 301 → /）

# community 其他路径
/ja/community/challenges  → 404（页面不存在，跟修复无关）

# 其他 key SEO 页（同样豁免了）
/it/tools                 → 200 ✅（之前 301 → /）
/ja/new-player            → 200 ✅
/es/maps                  → 404（页面 routing 需要 slug，预先存在）

# 12 locale 根路径（不变）
/, /en, /zh, /ko, /ja, /es, /de, /pt, /fr, /it, /nl, /ar → 全 200

# 非 key SEO 子路径（仍然 301 到 / 保护 UX，不变）
/it/pricing               → 301 /
/ja/showcases             → 301 /
/es/blog                  → 301 /

# 4 语种（NEW_LOCALES 仍生效，不变）
/th /vi /zh-TW             → 301 /

# admin 流程
/admin                     → 307 → /sign-in?callbackUrl=%2Fadmin ✅
```

---

## 3. 下一步（接手 agent）

### 3.1 提交 + 推送

```bash
cd ~/worktrees/mecchachameleon-art/mcc-locales-th-vi-zh-tw-004

git add src/config/locale/index.ts src/proxy.ts WORK_CONTEXT.md
git status  # 确认 3 个文件，无 sitemap.xml

git commit -m "fix(i18n): route /<locale>/community to /community (was 301 to /)

The second redirect rule in src/proxy.ts hard-coded 301 to '/' for
any non-English locale on a non-homepage path. That overrode the
existing keySeoPages / isKeySeoPath mechanism that next-intl uses
to strip the locale prefix and serve the English version of a page
(e.g. /it/tools -> /tools, /ja/community/gallery -> /community/gallery).

Concrete impact reported by user: the '30 分钟挑战' button on the
landing page points to /it/community, but clicking it landed users
on '/' instead of /community. Same for /ko/community/gallery and
all non-English locale variants of any key SEO sub-path.

This change:
- Adds '/community' to keySeoPages in src/config/locale/index.ts
  (isKeySeoPath() already does startsWith match, so /community/gallery,
  /community/challenges, etc. are covered by this one entry).
- Adds '!isKeySeoPath(pathWithoutLocale)' to the existing redirect
  guard in src/proxy.ts so non-English locales no longer 301 key SEO
  paths to '/'.

Out of scope (intentionally untouched):
- The NEW_LOCALES array (th/vi/zh-TW whole-site-301-to-/ rule) stays.
  Promoting those three to homepage-only visibility is a separate
  worktree / separate commit.
- sitemap.xml is left as-is (still 33 entries; th/vi/zh-TW promotion
  would expand it to 36, but that's the other worktree's job).

Verified locally against pnpm build + standalone server:
- /it/community, /ko/community/gallery, /it/tools, /ja/new-player
  now return 200 (previously 301 to /).
- 12 locale homepages still 200.
- /it/pricing, /ja/showcases, /es/blog still 301 to / (UX guard).
- /th, /vi, /zh-TW still 301 to / (NEW_LOCALES guard)."

git push -u origin wt/locales-th-vi-zh-tw-004
```

### 3.2 等用户 review 后 ff-merge main

```bash
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git checkout main
git pull origin main
git merge --ff-only origin/wt/locales-th-vi-zh-tw-004
git push origin main

# 清理 worktree
git worktree remove ~/worktrees/mecchachameleon-art/mcc-locales-th-vi-zh-tw-004
git push origin --delete wt/locales-th-vi-zh-tw-004
git branch -d wt/locales-th-vi-zh-tw-004
```

### 3.3 Dokploy 那边的预期

Dokploy 监听 main，main 推进后自动 redeploy：
- build log `✓ Compiled successfully`
- 线上 https://mecchachameleon.art/it/community → 200（H1 显示 `Meccha Chameleon` 等英文内容，因为 community 页只有 en 翻译）
- 线上 https://mecchachameleon.art/ko/community/gallery → 200
- 12 locale 根路径不变
- `/it/tools`、`/ja/new-player`、`/es/maps`（带 slug 时）→ 200

---

## 4. 跟 4 语种放开的关系（重要边界）

本 worktree **只修 community 路由 bug**。`th/vi/zh-TW` 整站 301 到 `/` 的逻辑**保留**——

- 如果你 review 完想顺便放开 4 语种首页，**这是另一个独立 commit**（之前在 `625b656` 试过一次，被你担心撤销了）。需要时另开 worktree 做
- sitemap 收录 4 语种也同理——独立 commit
- **本 commit 不带这些**，**保持最小 + 单一职责**，出问题容易回退

---

## 5. 关键路径速查

| 路径 | 作用 |
|---|---|
| `/Users/zhanglongchao/programPJ/mecchachameleon-art` | 父仓 (main, 当前 `593b48e`) |
| `~/worktrees/mecchachameleon-art/mcc-locales-th-vi-zh-tw-004` | **本 worktree** |
| `~/worktrees/mecchachameleon-art/mcc-art-001` | 现存（feat/all-official-maps-v2，**别碰**） |
| `~/worktrees/mecchachameleon-art/mcc-backlinks-001` | 现存（外链项目，**别碰**） |

## 6. 不要重蹈

- **不要顺手放开 4 语种**（虽然 proxy.ts 改的位置很近）—— 单 commit 单职责，4 语种是另一回事
- **不要把 `'/community'` 加进 `homepageOnlyLocales`（sitemap builder）** —— sitemap 改动属于「4 语种放开」那个 worktree
- **不要把 `'/community'` 写死到 proxy.ts**（而不是用 keySeoPages）—— 复用现有 isKeySeoPath 机制，跟 /tools /maps /new-player 一致
- **不要改 next.config.mjs / Dockerfile / lockfile** —— 跟本次需求无关
