# Personas Orchestration Manifest
**Generated:** 2026-06-24
**Source:** ~/.openclaw/workspace/agents/* (用户的 8 个自定义 persona)
**Goal:** 把每个 persona 映射到 OpenClaw/MiniMax 可执行的 cron job,**长效运行** — 不依赖会话窗口,关掉终端也能跑。

## 8 个 Persona(原样保留用户的命名)

| # | Persona | 角色 | 状态 | 职责 |
|---|---|---|---|---|
| 1 | **dispatch**(调度) | 总管 | ✅ Active | 数据监控/汇总/任务分配/汇报 |
| 2 | **analyst-anna**(安娜) | 情报分析师 | ✅ Active | 信息采集/竞品追踪/趋势发现 |
| 3 | **agent-xieshou**(携手) | 推广专家 | ✅ Active | 内容发布/网站运营/SEO |
| 4 | **agent-intel**(情报员) | 情报侦察兵 | ✅ Active | 社媒监控/科技新闻/SEO竞品 |
| 5 | **agent-box**(盒子先生) | 邮件客服 | ✅ Active | 邮件分类/自动回复/跟进 |
| 6 | **agent-dao**(刀哥) | 数据分析 | ✅ Active | 数据清洗/分析/报告 |
| 7 | **agent-gold**(黄金宝) | 量化交易 | ✅ Active | 账户管理/每日复盘 |
| 8 | **agent-aying**(阿莹) | 生活管家 | ⚠️ Disabled(2026-04-20 用户禁用) | 健康/情绪/亲子/食谱 |

**用户原话对应**:
- "情报管家安娜" → analyst-anna ✅
- "外链专家" → xieshou(携手=内容发布/推广/SEO + 外链也是 SEO 一部分)
- "推广专家" → xieshou ✅
- "生活专家" → aying(阿莹,已禁用)
- "小宽是总管" → main agent(IDENTITY.md 定义),**不是 dispatch** — 小宽是 OpenClaw 主 agent 人格,dispatch 是其中的"调度"子角色
- 还有:情报员 intel、盒子先生 box、刀哥 dao、黄金宝 gold(共 8 个,符合"6-7 个"的"上下"范围)

## 模型分工(用户原话)

用户提到 3 个模型:
- **GPT**(默认 Codex 用的 gpt-5.5 / gpt-5-codex)
- **MiniMax M3**(当前我用的,MiniMax-M2.7 / M2.7-highspeed)
- **GLM 5.2**(下一步买,智谱 GLM-5.2)

按用户之前 memory 里的"专有专长分工"逻辑:
- **GPT(Codex)** → 写代码/PR/Git 操作(代码类任务)
- **MiniMax M3(Hermes/Claude Code)** → 调研/分析/对话/agent 协调
- **GLM 5.2** → 待用户购买,接入后用于中文长文/文案/翻译类任务

> 注:这里"调度"用的是 MiniMax M3 的总 agent + 各 cron job 用不同 subagent 模型。
> GLM 5.2 等用户在 OpenClaw auth status 完成后,再更新 `~/.openclaw/agents/main/agent/models.json` 加进去。

## 痛点 → 长效方案

**用户原话痛点**:
> "每次去给 Codex 或者是 Claude 等等在终端窗口分配任务,但窗口一关,任务就停了"

**方案**:**全部 cron 化 + 自我唤醒** —

1. **`cronjob` 工具** = Hermes 体系的 cron(每个 session 跑完会自己重启)
2. **每个 persona 一个 cron job** — 设定 schedule,关掉 session 也按 schedule 跑
3. **prompts 是自包含** — 不依赖上下文(用户原话:任务到 cron 是 self-contained)
4. **结果写文件** — 不发消息,写到 `~/.openclaw/workspace/memory/<persona>/` 目录,下次 cron 接着读

## 编排 Schema

```yaml
persona:
  id: dispatch
  schedule: "every 6h"     # 调度每 6h 汇总一次
  enabled_toolsets: [web, terminal, file, search, kanban]
  prompt_self_contained: |
    [不依赖用户上下文]你是 OpenClaw 调度 Agent。
    任务:
    1. 读 ~/.openclaw/workspace/agents/{xieshou,box,anna,...}/RULES.md 拿当前任务
    2. 用 web 工具拉 GSC/GA4/X 数据
    3. 写到 ~/.openclaw/workspace/memory/dispatch/YYYY-MM-DD-report.md
    4. 列出待办任务清单 + 分配给哪个 agent
  output_dir: ~/.openclaw/workspace/memory/dispatch/
```

## 待执行的下一步(本次编排范围)

用户的 F16 (mecchachameleon.art 外链) **就属于 xieshou(推广专家)的活** — 已经做了。
现在要做的是 **为这 8 个 persona 建 cron job**,让用户"不用每次窗口分配任务"。

## 关键约束(从 memory/过去教训)

- **Cron 不许 17 全开** — 用户 memory 提到外链任务一直 0 提交要 disabled。新方案是按 persona 一对一 cron,**每个跑得了的才开**
- **Prompts 必须 self-contained** — cron 没有用户上下文
- **输出落盘** — 不发飞书/不发邮件(用户没明确要求),只写文件,用户自己看
- **带安全 gate** — destructive op (auto-merge / 付费 / OAuth) 必须 dry-run + explicit
- **不滥用 quota** — 每 persona 1 cron,频率按任务性质调(高频 30m,低频 每天/每周)
- **跑得动优先于"完美 cron 设计"** — 先让 1-2 个 cron 跑起来,验证 pipeline,再扩展
