# WORK_CONTEXT — wt/locales-homepage-open-005

**Worktree 路径**: `~/worktrees/mecchachameleon-art/mcc-locales-homepage-open-005`
**分支**: `wt/locales-homepage-open-005`（基于 `main@4bb1f19`，上一轮 `/it/community` 修复版）
**目标仓库**: `https://github.com/zlc000190/mecchachameleon-art.git`

---

## 0. 一句话结论

泰/越/繁体中文/荷兰语 4 语种首页本地化放开：4 语种根路径全 200，4 语种 key SEO 子路径自动 strip locale 跳英文页（`/th/tools` → `/tools`，`/th/community` → `/community`），4 语种非 key SEO 子路径 301 到 `/` 保护 UX。sitemap 从 33 → 36 entries。

**2 个文件，+18/-15 行**——比上一轮 `/it/community` 修复涉及更多逻辑但**结构没变**（proxy.ts 的两条 if 合并成一条 + 加 `LOCALES_WITH_HOMEPAGE` 命名）。

---

## 1. 改了什么 / 为什么

### 1.1 根因

main HEAD `4bb1f19` 状态下，`th / vi / zh-TW` 整站被 proxy.ts 第一条 if（`NEW_LOCALES` 数组）拦截 301 到 `/`，根本看不到首页翻译内容；4 语种子路径（`/th/tools` 等）也没法走 next-intl middleware strip locale 到英文页。

`nl` 因为本来就在第二条 if 的硬编码 locale 列表里，根路径是 200，但子路径（`/nl/tools`）还是 301 到 `/`（上一轮 `/it/community` 修复时已经验证了 key SEO 页豁免）。

### 1.2 修复

**文件 1: `src/proxy.ts`** — 删 `NEW_LOCALES`、合并两条 if 为一条 `LOCALES_WITH_HOMEPAGE`

```diff
-const NEW_LOCALES: Locale[] = [
-  'th',
-  'vi',
-  'zh-TW',
-];
+const LOCALES_WITH_HOMEPAGE = [
+  'es', 'de', 'pt', 'fr', 'it', 'nl', 'ar', 'ja', 'ko',
+  'th', 'vi', 'zh-TW',
+] as const;
```

- 删掉 `NEW_LOCALES` 数组 + 第一条 if（整站 301）
- 删掉第二条 if 的硬编码 locale 列表，改用 `LOCALES_WITH_HOMEPAGE`
- 保留 `!isKeySeoPath(pathWithoutLocale)` 豁免（上一轮修复加的）
- 清掉 unused import `type Locale`、`defaultLocale`

**净效果**：
- 12 个 locale 行为完全一致：「根路径 200、key SEO 子路径 strip locale 到英文、非 key SEO 子路径 301 到 `/`」
- 4 语种首页能正常显示翻译（landing.json 138 行翻译完整）

**文件 2: `scripts/build-sitemap.mjs`** — `homepageOnlyLocales` 加 th/vi/zh-TW

```diff
 const homepageOnlyLocales = ['es', 'de', 'pt', 'fr', 'it', 'nl', 'ar', 'ja', 'ko'];
+const homepageOnlyLocales = [
+  ...上面 9 个...,
+  'th', 'vi', 'zh-TW',
+];
```

`nl` 已经在列表里（不动）。`th/vi/zh-TW` 追加进去。

### 1.3 没改的（保护边界）

- `next.config.mjs` / `Dockerfile` / `pnpm-lock.yaml` — **完全不动**
- `src/config/locale/index.ts` 里 `keySeoPages` — 不动（`/community` 上一轮已加）
- 任何 `src/app/` 下 page.tsx — 不动（landing.json 138 行翻译已有）
- `landing.json` 翻译内容 — 不动（按 memory 2026-06-27 多语种 SEO 策略，翻译质量提升需要 SERP 调研 + 母语验证，不在本 commit）

---

## 2. 本地端到端验证（已跑过）

```
$ pnpm install --frozen-lockfile  # ✅ Done in 34.3s
$ pnpm build                       # ✅ exit 0
   - sitemap: 36 entries, 32122 bytes
   - "Locales with <url> entries: en, zh, ru, es, de, pt, fr, it, nl, ar, ja, ko, th, vi, zh-TW"

$ node .next/standalone/server.js  # ✅ Ready

# 4 语种根路径（应该全 200）:
/th        → 200 ✅   (was 301)
/vi        → 200 ✅   (was 301)
/zh-TW     → 200 ✅   (was 301)
/nl        → 200 ✅   (不变)

# 4 语种 key SEO 子路径（应该 strip locale 到英文）:
/th/tools          → 200  (was 301) ✅
/th/community      → 200  (was 301) ✅
/th/new-player     → 200  (was 301) ✅
/th/maps           → 404  (页面不存在，预先存在)
/nl/tools          → 200  (was 301) ✅
/nl/community      → 200  ✅
/nl/new-player     → 200  ✅
/vi/tools          → 200  ✅
/vi/community      → 200  ✅
/zh-TW/tools       → 200  ✅
/zh-TW/community   → 200  ✅

# 4 语种非 key SEO 子路径（应该 301 到 / 保护 UX）:
/th/pricing    → 301 /  ✅
/th/showcases  → 301 /  ✅
/nl/admin      → 301 /  ✅ (注意: admin 不会被 sign-in 拦截，
                        因为 proxy 第一步就 301 到根)
/vi/blog       → 301 /  ✅
/zh-TW/chat    → 301 /  ✅

# 12 locale 根路径不变:
/ /en(307) /zh /ko /ja /es /de /pt /fr /it /nl /ar → 全 200

# /en strip locale 不受影响:
/en/tools        → 307 /tools  ✅
/en/community    → 307 /community  ✅
/en/new-player   → 307 /new-player  ✅

# admin 流程没破坏:
/admin           → 307 /sign-in?callbackUrl=%2Fadmin  ✅

# 翻译 H1 真的渲染:
/th    H1: Meccha Chameleon เล่นออนไลน์ (泰语)
/vi    H1: Meccha Chameleon Chơi Online (越语)
/zh-TW H1: Meccha Chameleon 線上遊玩 (繁体中文)
/nl    H1: Meccha Chameleon in het Nederlands: ... (荷兰语)

# sitemap 4 语种收录:
/th      1 个 <loc>  ✅ (was 0)
/vi      1 个 <loc>  ✅ (was 3 但其他是 hreflang alt)
/zh-TW   1 个 <loc>  ✅ (was 0)
/nl      1 个 <loc>  ✅ (was 1 不变)
```

---

## 3. 下一步（接手 agent）

### 3.1 提交 + 推送

```bash
cd ~/worktrees/mecchachameleon-art/mcc-locales-homepage-open-005

git add src/proxy.ts scripts/build-sitemap.mjs WORK_CONTEXT.md
git status  # 确认 3 个文件，无 sitemap.xml

git commit -m "feat(i18n): open th/vi/zh-TW homepages; add to sitemap

The src/proxy.ts NEW_LOCALES guard 301-redirected th/vi/zh-TW (and
only those three) to '/' for any request, including the homepage
itself, hiding the landing.json translations that have been in place
for some time. The second guard 301-redirected sub-paths of every
other locale to '/' as well, even though key SEO sub-paths
(/tools, /community, /new-player) should be served as the English
version via next-intl's locale-stripping.

This change:
- Replaces NEW_LOCALES with LOCALES_WITH_HOMEPAGE (all 12 locales
  with a landing.json translation) and consolidates the two redirect
  rules into one. The guard now fires only on (locale in
  LOCALES_WITH_HOMEPAGE) AND (path is non-root) AND (path is NOT
  a key SEO page). Key SEO pages keep their isKeySeoPath() exemption
  so /<locale>/tools falls through to next-intl, which strips the
  locale prefix and serves the English version.
- Adds th/vi/zh-TW to build-sitemap.mjs's homepageOnlyLocales so
  search engines can index their homepages via sitemap <url> entries.
  nl was already in the list. Sitemaps grow from 33 to 36 entries.

Out of scope (intentionally untouched):
- landing.json translation quality (memory 2026-06-27 i18n SEO policy:
  SERP-validated native wording per locale, requires local keyword
  research + native-speaker review, deferred to a later worktree).
- Sub-page translations: /<locale>/tools etc. all fall through to
  the English version (via next-intl locale-stripping) rather than
  getting a real localized page.
- next.config.mjs, Dockerfile, pnpm-lock.yaml: untouched, this commit
  is purely a routing/sitemap visibility change.

Verified locally against pnpm build + standalone server:
- /th, /vi, /zh-TW, /nl all return 200 (th/vi/zh-TW were 301).
- /th/tools, /th/community, /th/new-player, /vi/tools, /vi/community,
  /zh-TW/tools, /zh-TW/community, /nl/tools, /nl/community,
  /nl/new-player all return 200 (previously 301 to /).
- /th/pricing, /th/showcases, /nl/admin, /nl/settings, /vi/blog,
  /zh-TW/chat still 301 to / (UX guard preserved).
- /en/tools etc. still 307 to /tools (next-intl default behavior).
- /admin still 307 to /sign-in (auth flow preserved).
- H1 of each locale page renders the native translation."

git push -u origin wt/locales-homepage-open-005
```

### 3.2 等用户 review 后 ff-merge main

```bash
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git checkout main
git pull origin main
git merge --ff-only origin/wt/locales-homepage-open-005
git push origin main

# 清理 worktree
git worktree remove ~/worktrees/mecchachameleon-art/mcc-locales-homepage-open-005
git push origin --delete wt/locales-homepage-open-005
git branch -d wt/locales-homepage-open-005
```

### 3.3 Dokploy 那边的预期

Dokploy 监听 main，main 推进后自动 redeploy：
- build log `✓ Compiled successfully`
- 线上 https://mecchachameleon.art/th → 200，H1 "Meccha Chameleon เล่นออนไลน์"
- 线上 https://mecchachameleon.art/vi → 200，H1 "Meccha Chameleon Chơi Online"
- 线上 https://mecchachameleon.art/zh-TW → 200，H1 "Meccha Chameleon 線上遊玩"
- 线上 https://mecchachameleon.art/nl → 200，H1 "Meccha Chameleon in het Nederlands: ..."
- 线上 https://mecchachameleon.art/th/tools → 200（显示英文 tools 页）
- 线上 https://mecchachameleon.art/th/community → 200（上一轮已修）
- 线上 https://mecchachameleon.art/th/pricing → 301 → /（UX 保护）
- sitemap.xml → 36 entries（+ th/vi/zh-TW）

---

## 4. 跟上一轮 `/it/community` 修复的关系

上一轮 `4bb1f19` 修了 `keySeoPages` 加 `/community` + proxy.ts 加 `!isKeySeoPath()` 豁免。本 commit 在那个基础上：
- 把「硬编码 locale 列表」改成「`LOCALES_WITH_HOMEPAGE` 数组」
- 把「th/vi/zh-TW 整站 301」删掉（跟其他 9 个 locale 行为一致）
- 加 sitemap 收录

**两个 commit 配合实现完整效果**——只做本 commit 不做上一轮会导致 `/th/community` 仍 301 到 /。

---

## 5. 关键路径速查

| 路径 | 作用 |
|---|---|
| `/Users/zhanglongchao/programPJ/mecchachameleon-art` | 父仓 (main, 当前 `4bb1f19`) |
| `~/worktrees/mecchachameleon-art/mcc-locales-homepage-open-005` | **本 worktree** |
| `~/worktrees/mecchachameleon-art/mcc-art-001` | 现存（feat/all-official-maps-v2，**别碰**） |
| `~/worktrees/mecchachameleon-art/mcc-backlinks-001` | 现存（外链项目，**别碰**） |

## 6. 不要重蹈

- **不要碰 next.config.mjs / Dockerfile / lockfile** —— 跟本次需求无关
- **不要把 `/community` 从 `keySeoPages` 移走** —— 上一轮修复的成果
- **不要单独把 `nl` 拎出来做特殊处理** —— 它现在跟其他 9 个 locale 行为一致（homepageOnlyLocales）
- **不要 commit sitemap.xml** —— build 产物
- **不要顺手改 landing.json 翻译内容** —— 按 memory 2026-06-27 i18n 策略，翻译质量提升需要 SERP 调研 + 母语验证，是另一个 worktree 工作
