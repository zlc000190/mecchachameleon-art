# mecchachameleon.art SEO 扩页面 — Review 交接包

> 当前状态: Batch 0 + 0.5 紧急修复已 commit `7a5d2e9` 在 `fix/seo-batch0-urgent-008` 分支并 push
> Batch 1+ (29 个新页面) 计划 + SOP 见 `SEO_BATCH1_PLUS_SOP.md`
> 完整背景 + 数据分析见 `SEO_PLAN.md`
>
> 编写时间: 2026-07-08
> 配套数据: GSC 28 天报告 (1000 queries, 83882 imp, 5579 clk)

---

## 一、Review 待办清单（按 GSC 价值排）

### P0 — 必须 review (5 个语种深度页)

| Locale | 文件 | URL 路径 | GSC 价值 |
|---|---|---|---|
| **ru** | `src/app/[locale]/(landing)/ru/igrat/page.tsx` | /ru/igrat | 2298 imp / 218 clk / 9.5% CTR (金矿) |
| **es** | `src/app/[locale]/(landing)/es/donde-jugar/page.tsx` | /es/donde-jugar | 635 imp / 11 clk |
| **ar** | `src/app/[locale]/(landing)/ar/download/page.tsx` | /ar/download | 177 imp / 1 clk |
| **pt** | `src/app/[locale]/(landing)/pt/jogar-gratis/page.tsx` | /pt/jogar-gratis | 200+ imp / ~20 clk |
| **ja** | `src/app/[locale]/(landing)/ja/online/page.tsx` | /ja/online | 961 imp / 222 clk / 23% CTR |

**这些文件还没创建**（Batch 1+ SOP 里有完整模板），review agent 应在 Batch 1+ 落地后立即 review 5 个 native 语种 body。

### P0 — 必须 review (7 个 locale common.json)

✅ **已完成** (commit `7a5d2e9`)：`src/config/locale/messages/{es,fr,ar,pt,ja,de,it}/common.json` + `nl/common.json` 的 `metadata.title/description/keywords` 节点。

**Review 重点**:
- 标题字符长度（50-60 字符最佳，>60 会被 Google 截断）
- 描述是否包含本地用户的搜索词
- 关键词是否地道（不要直译英文）

### P1 — 高价值 review (5 个语种长尾 MDX)

文件清单（未创建，SOP 里给完整模板）：
- `content/pages/juego-camaleon.mdx` + `.zh.mdx` (es)
- `content/pages/jogo-camuflagem.mdx` + `.zh.mdx` (pt)
- `content/pages/nascondino-online.mdx` + `.zh.mdx` (it)
- `content/pages/jeu-cache-cache.mdx` + `.zh.mdx` (fr)
- `content/pages/chameleon-spiel.mdx` + `.zh.mdx` (de)

**Review 重点**:
- 游戏机制描述是否准确（不是机翻）
- maps 列表（mansion/Osaka/backrooms）是否与游戏内一致
- FAQ 3 个问答是否合理

### P1 — 中等价值 (3 个玩法页英文 body review)

文件清单（未创建）：
- `src/app/[locale]/(landing)/unblocked/page.tsx`
- `src/app/[locale]/(landing)/hide-and-seek/page.tsx`
- `src/app/[locale]/(landing)/demo/page.tsx`

**Review 重点**:
- 英文 body 质量（unblocked 页面的 FAQ 等）
- 12 locale metadata 的其他 locale 部分（俄/中/西/阿/葡/法/德/意/日/韩 翻译质量）

### P2 — 低价值 (11 英文长尾 MDX)

文件清单见 SOP，body 是英文、metadata 是英文 + 中文（其他 10 locale 走 en fallback）。

---

## 二、Review 优先级建议（估时）

| 优先级 | 项目 | 估时 | ROI |
|---|---|---|---|
| **P0** | 5 个核心语种深度页的 native body | 2-3h | 极高（直接承接搜索词） |
| **P0** | 7 个 locale common.json 的 metadata | 30min | 极高（首页 CTR 立刻涨） |
| **P1** | 5 个语种长尾 MDX (es/pt/it/fr/de) | 2h | 高 |
| **P1** | 3 个玩法页的英文 body | 1h | 中 |
| **P2** | 11 英文长尾 MDX 的英文质量 | 2h | 中 |
| **P2** | 7 个 locale 的子页 hreflang 圈扩展 | 1h | 中（需要改 layout.tsx 第 56 行） |
| **合计** | | 8-10h | |

---

## 三、已知 trade-off（review 时重点检查）

### 1. 7 个 locale 子页只对 en/zh/ru 出 hreflang

`src/app/layout.tsx` 第 56 行有 filter:
```ts
const activeSeoLocales = strippedPath === '/'
  ? seoLocales
  : seoLocales.filter((loc) => loc !== 'es' && loc !== 'de' && ...);
```

**含义**: 7 个 locale 的子页（unblocked/hide-and-seek/demo/深度页）**没进 hreflang 圈**。Google 不会展示 locale 替代链接。

**修法**:
- **激进**: 删 filter（风险：可能让 Google 看到重复内容）
- **保守**: 保持现状，依靠元数据本地化获得 CTR 提升

### 2. MDX 页面无 iframe client component

`<iframe src="https://chameleon-game.com/">` 是裸 HTML，转化比 page.tsx 模式稍弱（无 benefits 卡片、无 FAQ 组件）。

**修法**: 写一个 `<SeoPageFrame>` MDX 组件集成 DemoFrame（如果 review agent 想做）

### 3. 3 个新 page.tsx 12 locale body 仍是英文

只有 metadata 是 native。

**修法**: review agent 翻译 body 后替换

### 4. 5 个语种深度页 native body 只在该 locale 下显示

8 个其他 locale 看到 en fallback。

**修法**: 完整 12 locale body 翻译（review agent）

### 5. sitemap.xml 是手维护的静态文件

每加新页需要手动更新。

**修法**: 后续在 `scripts/` 写 generator

---

## 四、测试方法

### 1. 部署到 staging 后立即验证

```bash
# 拉 PR 分支到本地
git fetch origin fix/seo-batch0-urgent-008
git checkout fix/seo-batch0-urgent-008

# 验证 sitemap
curl -s https://mecchachameleon.art/sitemap.xml | head -50

# 验证 7 个 locale 拿到本地化 title
for loc in es fr ar pt ja de it nl; do
  echo "=== /$loc ==="
  curl -sL https://mecchachameleon.art/$loc | grep -oE '<title[^>]*>[^<]+</title>' | head -1
done
```

### 2. GSC 验证时间线

- **1 周后**: 查 "网页" 报表，看新 URL 是否被收录
- **4 周后**: 查 "查询" 报表，看长尾词排名是否提升
- **关键指标**: `/meccha chameleon online` 的 CTR 从 0.58% → 3%+

### 3. hreflang 验证

用 [hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/) 验证 12 locale 互链。

### 4. 已知手动检查

```bash
# 检查 /meccha-chameleon-online 是否进 sitemap
curl -s https://mecchachameleon.art/sitemap.xml | grep -c "meccha-chameleon-online"

# 检查 7 个 locale 的 title 不是英文
for loc in es fr ar pt ja de it; do
  title=$(curl -sL https://mecchachameleon.art/$loc | grep -oE '<title[^>]*>[^<]+</title>' | head -1)
  echo "$loc: $title"
  # 应该看到本地语言，不是 "Play Online"
done
```

---

## 五、PR 合并清单

### 现在：merge `fix/seo-batch0-urgent-008` → main

- PR: https://github.com/zlc000190/mecchachameleon-art/pull/new/fix/seo-batch0-urgent-008
- 改动: 9 文件 (sitemap + 8 common.json)
- 风险: 零（只动首页 metadata + sitemap URL 列表）
- 测试: 部署后立刻在 GSC "覆盖率" 报表看新增 URL

### 下次会话：按 SEO_BATCH1_PLUS_SOP.md 做 Batch 1+ 29 个新页

- 详见 `SEO_BATCH1_PLUS_SOP.md`
- 完整 page.tsx 模板 + MDX 模板 + 写文件命令都给了
- 预计 4-5 小时 agent 工作量

---

## 六、给本地化 review agent 的说明

review agent 你好！你要 review 的是 mecchachameleon.art 网站的 SEO 扩页面本地化质量。

**仓库**: `/Users/zhanglongchao/programPJ/mecchachameleon-art`
**当前分支**: `fix/seo-batch0-urgent-008` (已包含 Batch 0+0.5 修复)

**你 review 的内容**:

1. ✅ **已落地** (Batch 0+0.5): 7 个 locale common.json 的 metadata
2. ⏳ **待落地** (Batch 1+): 8 个新 page.tsx + 21 个新 MDX
   - SOP 在 `SEO_BATCH1_PLUS_SOP.md`
   - 模板里有 12 locale metadata 占位符，需要 native 翻译

**Review 工作流**:

```bash
# 1. 拉最新代码
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git pull origin fix/seo-batch0-urgent-008

# 2. 检查 7 个 locale common.json
for loc in es fr ar pt ja de it nl; do
  cat src/config/locale/messages/$loc/common.json | python3 -m json.tool | head -10
done

# 3. 如果 Batch 1+ 已落地，review 8 个新 page.tsx
ls -la "src/app/[locale]/(landing)/"{unblocked,hide-and-seek,demo,ru,es,ar,pt,ja} 2>/dev/null

# 4. 如果 MDX 已落地，review 21 个长尾
ls content/pages/*.mdx | head -30
```

**Review 评判标准**:

- **标题**: 50-60 字符，包含目标长尾词，本地化自然（不是机翻）
- **描述**: 150-160 字符，包含价值主张 + 行动召唤
- **body**: 至少 300 字本地原创内容（不是机翻）
- **FAQ**: 问题必须是本地用户真会问的
- **关键词**: 包含本地搜索词，不是直译英文

**完成 review 后**:

1. 给出每页评分（1-5）+ 改进建议
2. 如果有重大翻译问题，更新 `src/config/locale/messages/<locale>/` 下的 JSON
3. 提交到新分支 `feat/seo-localization-review-009`，push 后等合并
