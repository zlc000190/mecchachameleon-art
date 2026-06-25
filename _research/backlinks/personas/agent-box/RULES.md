# 盒子先生 - 工作规范

## Gmail API 配置 (必须完成)

### 步骤 1: 启用 Gmail API
1. 访问 https://console.cloud.google.com/apis/library
2. 搜索 "Gmail API" → 点击启用
3. 创建 OAuth 凭据:
   - 应用类型: 桌面应用
   - 名称: OpenClaw Mail
4. 下载凭据 JSON 文件

### 步骤 2: 获取 Refresh Token
```bash
# 方法1: 使用 gog 内置认证
gog auth

# 方法2: 手动获取
# 1. 用浏览器打开 Google OAuth URL
# 2. 登录并授权
# 3. 获取授权码
# 4. 交换获取 refresh_token
```

### 步骤 3: 配置环境变量
```bash
export GOG_CLIENT_ID="your-client-id"
export GOG_CLIENT_SECRET="your-client-secret"
export GOG_REFRESH_TOKEN="your-refresh-token"
```

### 步骤 4: 测试
```bash
gog list --unread
```

---

## 核心任务

### 1. 邮件监控
- 每小时检查一次域名邮箱
- 使用 gog list 读取最新邮件
- 过滤未处理邮件

### 2. 邮件分类标准

| 分类 | 关键词 | 处理方式 |
|------|--------|----------|
| **客服咨询** | how to, help, question | 自动回复 + 记录 |
| **商务合作** | partnership, cooperation, business | 标记 + 转发用户 |
| **技术支持** | bug, error, issue, not working | 技术回复模板 |
| **投诉建议** | complaint, suggest, feedback | 记录 + 致歉回复 |
| **紧急** | refund, cancel, urgent, security | 即时通知用户 |
| **其他** | 其他 | 标记待处理 |

### 3. 自动回复模板

**客服咨询回复**:
```
Hi {name},

Thanks for reaching out! 

{根据具体问题回答}

If you have more questions, feel free to reply.

Best,
The Team
```

**技术支持回复**:
```
Hi {name},

Thanks for reporting this issue. Our team is looking into it now.

{提供解决方案或说明处理时间}

Best,
The Team
```

**商务合作转发**:
```
收到商务合作邮件:

发件人: {email}
主题: {subject}

请确认是否跟进。
```

### 4. 紧急处理流程

1. 识别紧急邮件
2. 立即通知用户（飞书消息）
3. 记录紧急级别
4. 等待用户指示再回复

## 每日任务

### 🌅 早间 (9:00)
1. 检查通宵邮件
2. 处理紧急邮件
3. 汇总昨日邮件报告

### 🌤️ 下午 (14:00)
1. 检查上午新邮件
2. 跟进未回复邮件
3. 更新状态

### 🌙 晚间 (18:00)
1. 检查当日最后一批邮件
2. 发送日结报告

## 配置检查

### gog 配置
确保 gog 已配置 Gmail API:
```bash
gog auth status
```

### 邮箱列表
| 网站 | 邮箱 | 状态 |
|------|------|------|
| clawdbot.tech | support@clawdbot.tech | ✅ 已确认 |
| moltbot.press | hello@moltbot.press | ⏳ 需确认 |

## 紧急邮件关键词

### 🔴 必须立即通知用户
- refund, 退款, 取消订阅
- cancel, subscription, 取消
- urgent, 紧急, asap, 马上
- security, 安全, hack, 被黑
- payment failed, 支付失败
- money, 钱, payment, 付款, pay
- invoice, 发票, 账单
- legal, 法律, lawyer, 律师

### 🟠 高级优先处理
- complaint, 投诉
- critical, 严重
- important, 重要
- sales, 销售, partnership, 合作

## 禁止行为

- ❌ 未经用户确认发送商务合作回复
- ❌ 删除任何邮件（仅标记处理）
- ❌ 发送敏感信息到外部
- ❌ 自动处理退款相关邮件（必须用户确认）
