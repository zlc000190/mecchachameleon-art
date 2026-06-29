# WORK_CONTEXT — wt/fix-tools-en-russian

**一句话结论**：把 `/tools` 英文版里被错塞的俄语字符串还原成英文（commit 4983843 回归修复）。

## 改了什么
- 单文件：`src/app/[locale]/(landing)/tools/page.tsx`
- 范围：仅 `copy.en` block（30 行字典项：eyebrow / repoLabel / releaseLabel / exeLabel / quickSteps / features 中 3 项 / controls 中 2 项）
- 未触碰：`copy.zh`、`copy.ru`、链接、布局、组件、依赖

## 根因
commit 4983843「feat: localize lower-home sections across reopened locales and reopen Arabic homepage」(2026-06-27, Hermes) 在给各语种加本地化时，把俄文字典块的几个 key（eyebrow/repoLabel/releaseLabel/exeLabel/quickSteps/features 中 Health-bars/Radar/Colors/controls 开关项）**错位贴到了 copy.en** 上面去了。`copy.ru` 是干净的，所以 ru 页面没事；en 页面中招。

## 本地端到端验证（pnpm dev :3002 实拉 HTML）
| URL | 状态 | 关键文案 | 老 RU 串 |
|---|---|---|---|
| `/tools` (en) | 200, 257KB | Game assistant software ✓ / English source repository ✓ / Latest English release ✓ / Download MecchaCamouflage.exe ✓ / Toggle settings menu ✓ / Photo paint / camouflage ✓ / Health bars ✓ / External minimap radar ✓ / Enemy, local player, and skeleton overlay color pickers ✓ / Run MecchaCamouflage.exe and use Insert ✓ | Вспомогательное ✓ absent / Исходный репозиторий ✓ absent / Скачайте ✓ absent / Здоровье и щит ✓ absent / Фотопокраска ✓ absent / Открыть / закрыть ✓ absent |
| `/zh/tools` (zh) | 200, 263KB | 游戏辅助软件 ✓ / 中文源码仓库 ✓ / 中文最新版发布页 ✓ / 下载 MecchaCamouflage.exe ✓ / 切换设置菜单 ✓ / 伪装采样与应用 ✓ / 本页面整理社区版 ✓ | — |
| `/ru/tools` (ru) | 200, 257KB | Вспомогательное ПО ✓ / Исходный репозиторий ✓ / Последний релиз ✓ / Скачать MecchaCamouflage.exe ✓ / Открыть / закрыть ✓ / Фотопокраска ✓ / Возможности ✓ / Быстрый старт ✓ | — |

实渲染 banner 对照（EN vs RU）：
- EN: eyebrow=`Game assistant software` / h1=`Meccha Chameleon Tools for assisted play testing` / steps=Download… | Launch MECCHA CHAMELEON in windowed or borderless mode. | Run MecchaCamouflage.exe and use Insert / F1 to open the settings menu.
- RU: eyebrow=`Вспомогательное ПО` / h1=`Meccha Chameleon Tools для исследовательского тестирования` / steps=Скачайте… | Запустите MECCHA CHAMELEON в оконном или borderless-режиме. | Запустите MecchaCamouflage.exe и нажмите Insert / F1, чтобы открыть меню настроек.

## 下一步接手命令
```bash
cd /Users/zhanglongchao/worktrees/mecchachameleon-art/mcc-tools-en-fix
git status -s                              # 应只看到 tools/page.tsx 改
git diff src/app/.../tools/page.tsx        # 确认只动 copy.en 段
git add src/app/[locale]/(landing)/tools/page.tsx
git commit -m "fix(tools): restore English strings on /tools (regression from 4983843)"
```
ff-merge：
```bash
cd /Users/zhanglongchao/programPJ/mecchachameleon-art
git merge --ff-only wt/fix-tools-en-russian
git push origin main                       # Dokploy 监听 main 自动部署
```

## 边界
- 边界：`/tools` 页 en 文案字典（`copy.en`）
- 边界：未碰 zh/ru 文案、未碰布局、未碰链接结构

## 禁区
- **不要** 在这次 merge 里夹带其他修改（哪怕是顺手看到的小问题）
- **不要** 用 `git reset --force` 或 `git rebase` 退到我或其他 worktree 没看过的历史
- **不要** 跳 worktree 直接在 main 上 commit/push
- en/zh/ru 三条 locale 端到端检查全部 200 + key 文案存在才能 merge，缺一就回来再查
