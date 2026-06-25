# Agent Team 工作流 - OpenClaw 实现

基于 Super黄 Agent Team 教程的多 Agent 协作框架

---

## 核心架构

```
┌─────────────────────────────────────────────────────────┐
│                    Main Agent (协调者)                   │
│         负责分配任务、汇总结果、管理流程                   │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│   Writer Agent      │       │  Reviewer Agent    │
│   (写作/执行)         │◄─────►│   (评审/反馈)        │
│   - Sonnet 4.5      │       │   - Opus 4.6        │
└─────────────────────┘       └─────────────────────┘
           │
           ▼
┌─────────────────────┐
│  Knowledge Base    │
│  (自进化反馈)       │
└─────────────────────┘
```

---

## 场景 1: 写作 Agent Team (Writer + Reviewer)

### 使用方式

```javascript
// 方式1: 使用 sessions_spawn 创建 Agent Team
await sessions_spawn({
  task: `你是一个写作团队:
  
你是 Writer Agent，负责撰写初稿。
主题: ${topic}
风格: ${style}

请写出第一版文章。`,
  model: "minimax-cn/MiniMax-M2.5",
  runtime: "subagent"
})

// 然后调用 Reviewer
await sessions_spawn({
  task: `你是 Reviewer Agent，负责评审文章。
  
请从以下维度评分 (1-10):
1. 内容质量
2. 结构清晰度  
3. 读者吸引力
4. 转化效果

然后给出具体改进建议。`,
  model: "opus",
  runtime: "subagent"
})
```

---

## 场景 2: 研究 Agent Team

```javascript
// 并行执行多个研究任务
const [reddit Research, twitter Research, github Research] = await Promise.all([
  sessions_spawn({ task: "研究 Reddit XXX 趋势", model: "sonnet", runtime: "subagent" }),
  sessions_spawn({ task: "研究 Twitter XXX 趋势", model: "sonnet", runtime: "subagent" }),
  sessions_spawn({ task: "研究 GitHub XXX 趋势", model: "sonnet", runtime: "subagent" })
])

// Main Agent 汇总
await sessions_spawn({
  task: `汇总以下研究结果:
  
Reddit: ${redditResearch}
Twitter: ${twitterResearch}  
GitHub: ${githubResearch}

生成综合报告。`,
  runtime: "subagent"
})
```

---

## 场景 3: 自进化工作流

```javascript
// 每次执行后自动反思优化
async function selfEvolve(task, result, feedback) {
  await sessions_spawn({
    task: `分析本次执行:
    
任务: ${task}
结果: ${result}
反馈: ${feedback}

请提出优化建议并存入知识库，供下次执行参考。`,
    model: "opus",
    runtime: "subagent"
  })
}
```

---

## 实用 Prompt 模板

### Writer Agent Prompt
```
你是专业写作者，负责产出高质量内容。

任务: {task}
受众: {audience}
目标: {goal}

请产出初稿，包含:
1. 开头 Hook
2. 核心内容 (3-5 个关键点)
3. 行动号召

风格: {style}
```

### Reviewer Agent Prompt
```
你是内容评审专家，负责评估和改进内容。

评分维度 (每项 1-10):
- 清晰度
- 说服力
- 结构
- 创新性
- SEO 优化

请:
1. 给出每项分数和总均分
2. 列出具体改进建议
3. 指出 3 个最佳亮点
```

---

## 适用场景判断

| 场景 | 推荐使用 Agent Team | 原因 |
|------|-------------------|------|
| 复杂写作 | ✅ | 多轮迭代提升质量 |
| 市场调研 | ✅ | 并行多源信息收集 |
| 代码审查 | ✅ | 双重检查减少 bug |
| 简单问答 | ❌ | 单 Agent 更高效 |
| 快速翻译 | ❌ | 没必要增加开销 |

---

## 注意事项

1. **不是所有 Skills 都需要 Agent Team** - Token 消耗会增加
2. **选择值得的场景** - 复杂任务、高价值输出才值得
3. **模型分工** - 创意模型写，分析模型评
4. **知识库积累** - 每次好的改进都存入，供下次使用
