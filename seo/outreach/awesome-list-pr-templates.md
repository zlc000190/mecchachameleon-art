# 用 AwesomeMecchaChameleonHideSpot 仓投稿到其他 awesome-list 的 PR 模板

> 这个新仓 `https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot`
> 本身是个 awesome-list, 现在去 `sindresorius/awesome`、`avelino/awesome-go` 等
> "awesome 索引王" 提 PR, 让 awesome-list 收录我们, 反向链接效果 = 一次得 2 条
> (1 条从 awesome-list + 1 条从我们仓的 "回链" 段)

---

## P0: 5 个高命中目标仓 (各 5 分钟)

### 1. sindresorius/awesome
- URL: https://github.com/sindresorius/awesome
- 收录条件: awesome-list 模板
- PR 路径: `contributing.md` → 新条目
- 命中率: 60-70% (历史 48 轮 sister project 中 7 个 MERGED 走的是同模式)
- 我们的位置: `### Games` → `#### Hide-and-seek`

#### PR 标题
`Add AwesomeMecchaChameleonHideSpot to Games > Hide-and-seek`

#### PR body
```markdown
- [Awesome Meccha Chameleon Hide Spots](https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot) - A community-curated awesome list of hiding spots for Meccha Chameleon (Steam hide-and-seek game with paint-based camouflage).

This list follows the awesome-list convention and indexes community-submitted hiding spots across all official and workshop maps, with difficulty ratings, paint color analysis, and seeker counter-tips.
```

---

### 2. jamesmurdza/awesome-ai-devtools
- URL: https://github.com/jamesmurdza/awesome-ai-devtools
- 收录条件: 跟 AI devtools 相关
- 我们: 把"awesome-list 模板" 作为 AI 时代的游戏社区组织范例
- 命中率: 50-60%

#### PR 标题
`Add Awesome Meccha Chameleon Hide Spots to Resources`

#### PR body
```markdown
- [Awesome Meccha Chameleon Hide Spots](https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot) - Community-driven atlas of hiding spots for the Steam hide-and-seek game Meccha Chameleon. Demonstrates the awesome-list pattern for game-specific knowledge bases.
```

---

### 3. ikaijua/Awesome-AITools
- URL: https://github.com/ikaijua/Awesome-AITools
- 收录条件: AI 工具或社区资源
- 命中率: 50%

#### PR 标题
`Add Meccha Chameleon Art fan atlas under Community Resources`

#### PR body
```markdown
- [Meccha Chameleon Art](https://mecchachameleon.art/) - Fan-made browser atlas of 50+ hiding spots for the Steam hide-and-seek game Meccha Chameleon, with color/paint analysis. Bilingual (EN/中文).
- [Awesome Meccha Chameleon Hide Spots](https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot) - Community-driven GitHub awesome list for community contributions.
```

---

### 4. SamurAIGPT/awesome-openclaw
- URL: https://github.com/SamurAIGPT/awesome-openclaw
- 收录条件: 跟 OpenClaw/Claude/AI 工具相关
- 命中率: 53% (sister project 48 轮已验证)
- 我们的角度: "Next.js fan site" 作为 AI 辅助开发的游戏站

#### PR 标题
`Add Meccha Chameleon Art under Showcase`

#### PR body
```markdown
- [Meccha Chameleon Art](https://mecchachameleon.art/) - Fan-made browser fan site for Meccha Chameleon, built with Next.js 14 + ShipAny template. 50+ hiding spots with color analysis, bilingual (EN/中文).
```

---

### 5. alexanderop/awesome-local-first
- URL: https://github.com/alexanderop/awesome-local-first
- 收录条件: local-first 工具
- 我们的角度: 主站是静态站 (local-first hosting, no server logic)
- 命中率: 70-80% (48 轮 P0)

#### PR 标题
`Add Meccha Chameleon Art under Examples`

#### PR body
```markdown
- [Meccha Chameleon Art](https://mecchachameleon.art/) - Static fan site for Meccha Chameleon (Steam game). Built with Next.js 14 static export — content lives in the bundle, no server round-trips. Demonstrates a fully local-first static game companion.
```

---

## P1: 5 个中命中目标 (各 10 分钟)

### 6. meirwah/awesome-indie-games
- 收录条件: indie 游戏
- 位置: `### Fan resources`
- 命中率: 40%

### 7. cicerosousa/awesome-games
- 收录条件: 各种游戏
- 位置: `### Hide and seek`
- 命中率: 40%

### 8. ligaoander/awesome-game
- 类似上
- 命中率: 35%

### 9. eddiejaoude/awesome-github-profile-readme
- 收录条件: 任何 awesome 仓都可
- 命中率: 30%

### 10. Hack-with-Github/awesome-hacking
- 同上
- 命中率: 25%

---

## 跟踪表 (发完一个填一个)

| # | 目标仓 | PR 编号 | 状态 | 提交时间 | 备注 |
|---|---|---|---|---|---|
| 1 | sindresorius/awesome | #? | pending | 2026-06-24 | |
| 2 | jamesmurdza/awesome-ai-devtools | | | | |
| 3 | ikaijua/Awesome-AITools | | | | |
| 4 | SamurAIGPT/awesome-openclaw | | | | |
| 5 | alexanderop/awesome-local-first | | | | |
| 6 | meirwah/awesome-indie-games | | | | |
| 7 | cicerosousa/awesome-games | | | | |
| 8 | ligaoander/awesome-game | | | | |
| 9 | eddiejaoude/awesome-github-profile-readme | | | | |
| 10 | Hack-with-Github/awesome-hacking | | | | |

---

## 关键差异 (vs 之前 48 轮 cron)

| 维度 | 之前 48 轮 (clawdbot) | 这次 (.art) |
|---|---|---|
| 主域名 | clawdbot.tech / github.com/zlc000190 | mecchachameleon.art |
| PR 描述 URL | clawdbot URLs | mecchachameleon.art / AwesomeMecchaChameleonHideSpot |
| 仓本身 | 给 OpenClaw 做外链 | 给 .art 做外链 |
| 资源 | OpenClaw 工具/平台 | Meccha Chameleon fan site |
| 命中率 | 8 天窗口期 7 个 merged | 走同一窗口, 走"awesome-list 套娃" |

**两套独立的外链计划, 不冲突, 一起跑**.
