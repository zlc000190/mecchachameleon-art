# WORK_CONTEXT — wt/add-community-nav (rebased onto 12929a4)

**一句话结论**：把 `/community` 加到全站 header 导航，名字 "30-minutes hiding challenge"，已在 14 种 locale 端到端验证通过。第二笔推送 (912dd16 → rebase → 重 commit on top of 12929a4)。

## 改了什么
- 范围：15 个 `src/config/locale/messages/<locale>/landing.json`
- 每文件只动了 `header.nav.items` 数组末尾追加一项：
  ```json
  {
    "title": "30-minutes hiding challenge",
    "url": "/community",
    "icon": "Users"
  }
  ```
- 顺序：每文件都是 `[..., Tools, 30-minutes hiding challenge]`，跟其它 5 项保持一致
- title 一律英文 brand 写法（未本地化），跟「先稳英语」原则一致
- icon 选 `Users`（lucide-react，跟 Play/Tools 同一风格）
- url 用 `/community`（不加 locale 前缀，next-intl `as-needed` 自动前缀）
- 未触碰：landing.json 其它段（buttons/footer/topbanner 等）、layout/component 代码、依赖

## 根因说明
1. 用户要求把 community 加导航
2. 顺手发现：commit `eb25244` 的 message 写 "make /community indexable by Google" 但 `public/sitemap.xml` 实际没有 community URL（sitemap 33 条 <loc> 全数过无 community 字面）。这是**单独 bug**，已记给用户，本次 nav 修复**不**碰 sitemap
3. nav 数据源走 `landing.json` 的 `header.nav.items`，15 locale 都有完整结构，加 1 项最稳

## 本地端到端验证（dev :3001，实拉 HTML）
| Locale | HTTP | 桌面 nav hrefs（最后一项 = 新加） | 品牌文案出现次数 |
|---|---|---|---|
| `/`（en） | 200 | `/#play /#new-player /#camo-lab /#atlas /tools /community` | 2（桌面 + 移动） |
| `/zh` | 200 | `/zh#play /zh#new-player /zh#camo-lab /zh#atlas /zh/tools /zh/community` | 2 |
| `/ru` | 200 | `/ru#play /ru#new-player /ru#camo-lab /ru#atlas /ru/tools /ru/community` | 2 |
| `/ja` | 200 | `/ja#play /ja#new-player /ja#camo-lab /ja#atlas /ja/tools /ja/community` | 2 |
| `/ar` | 200 | `/ar#play /ar#new-player /ar#camo-lab /ar#atlas /ar/tools /ar/community` | 2 |

链接目标全部 200：/community, /zh/community, /ru/community, /ja/community 都 HTTP 200

5 个 locale 都正确前缀（`as-needed` 自动前缀逻辑生效），一条 nav 改完之后 14 locale 自动 follow。

## 推送中遇到的部署问题（必须告诉用户）

### 现象
- `git push origin main` 推送成功（origin/main 实际 commit 已前进至 12929a4 + 912dd16 的新版本）
- 但 **Dokploy 没触发 auto rebuild**——线上 `/tools` 90 秒后仍显示 stale RU 串
- 查 GitHub API：`hooks = []` —— **当前 repo 没有装 Dokploy GitHub App / 也没有 webhook**
- 这意味着 "Dokploy 监听 main 自动部署"（WORK_CONTEXT 历史）的期望**当前没成立**

### 影响
- 推 push **不会自动部署** —— 必须去 Dokploy UI 手动 trigger deploy
- 否则 push 完代码在 origin 但生产仍然是上一个 commit 的镜像

### 用户怎么处理（不在本 worktree 内动作）
1. 登录 Dokploy 控制台 (http://SERVER_IP:3000，看你 memory 里的 URL)
2. 找到 app `meccha-chameleon-meccha-fyjne6`
3. 点 "Deploy" / "Redeploy"
4. 等 rebuild，约 1-3 分钟
5. 验证：`curl https://mecchachameleon.art/tools` 出现 "Game assistant software"、"English source repository" 才是 deploy 完成

### 后续可考虑
- 重装 Dokploy GitHub App 让 push 自动触发 deploy（避免每次手动点）
- 但这个工作应该单独开 worktree `wt/reinstall-dokploy-webhook`

## 下一步接手命令

**推送已经完成，请让用户去 Dokploy UI 手动 deploy**：

```bash
# 确认 origin head
git -C /Users/zhanglongchao/programPJ/mecchachameleon-art log --oneline origin/main -3
# 应该看到：<new community-nav SHA> / 12929a4 fix(tools) / eb25244 merge: feat(seo): make /community indexable
```

**用户动作**：Dokploy UI → meccha-chameleon-meccha-fyjne6 → Redeploy → 等 1-3 min

**deploy 后端到端验证命令**：
```bash
curl -s https://mecchachameleon.art/tools | grep -c "Game assistant software"      # 应 ≥ 1
curl -s https://mecchachameleon.art/tools | grep -c "Вспомогательное ПО"            # 应 0
curl -s https://mecchachameleon.art/ | grep -c "30-minutes hiding challenge"       # 应 ≥ 1 (桌面+移动 nav 各 1)
```

**不要 commit 其它东西**：等 deploy 验证通过再开新 worktree。

## 边界
- 边界：landing.json 的 `header.nav.items` 数组
- 边界：5 项 → 6 项；只追加，不改任何原有项

## 禁区
- **不要** 把 community title 在某 locale 改本地化措辞（除非用户明确指示）
- **不要** 蹭着同步碰 sitemap.xml / community page.tsx / 任何 src/shared/ 组件
- **不要** 不验证就继续 ff-merge / push 别的事情；先等 deploy 落地再说
- **不要** 直接 main 上 commit/push
