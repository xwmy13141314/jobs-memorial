# 乔布斯纪念馆 AI 升级版 - 快速启动指南

## 已完成的功能

✅ AI 对话 API (支持智谱 GLM-4.7、DeepSeek、OpenAI)
✅ 悬浮 "Ask Steve" 按钮组件
✅ 对话面板组件（玻璃拟态风格）
✅ 预设问题标签（产品取舍、审美纠偏、品牌灵魂、创新瓶颈）
✅ 限流保护（IP 级别 + 会话级别）
✅ 内容安全过滤
✅ 品牌关键词触发（RugOne 彩蛋）
✅ 移动端全屏适配
✅ 打字机流式响应效果
✅ 金句分享功能

---

## 第一步：配置环境变量

1. 复制环境变量模板：
```bash
cp .env.local.example .env.local
```

2. 编辑 `.env.local`，填入你的 API Key：

```bash
# 智谱 AI (GLM-4.7) - 优先使用
# 获取地址: https://open.bigmodel.cn/
ZHIPU_API_KEY=你的智谱API密钥

# 备选：DeepSeek API
# 获取地址: https://platform.deepseek.com/
# DEEPSEEK_API_KEY=你的DeepSeek密钥

# 备选：OpenAI API
# OPENAI_API_KEY=你的OpenAI密钥

# 限流配置（可选）
RATE_LIMIT_MAX_REQUESTS_PER_MINUTE=5
RATE_LIMIT_MAX_REQUESTS_PER_DAY=30
```

---

## 第二步：启动开发服务器

```bash
cd "jobs memorial"
npm install  # 首次运行需要安装依赖
npm run dev
```

访问 http://localhost:3000

---

## 第三步：测试 AI 对话功能

1. 打开网站，右下角会看到悬浮按钮
2. 点击按钮打开对话面板
3. 选择预设问题或输入自定义问题
4. 体验 "Steve Jobs" 风格的回复

---

## 品牌彩蛋触发测试

尝试输入以下关键词，会触发 RugOne 品牌彩蛋：

- "RugOne"
- "户外设备"
- "对讲机"
- "三防手机"
- "户外探险"

---

## 项目结构

```
jobs memorial/
├── app/
│   ├── api/chat/route.ts    # AI 对话 API
│   └── layout.tsx            # 根布局（已集成 ChatWidget）
├── components/
│   ├── ChatWidget.tsx         # 悬浮按钮组件
│   └── ChatPanel.tsx          # 对话面板组件
├── lib/
│   ├── ai.ts                  # AI 核心逻辑
│   └── rate-limit.ts          # 限流控制
└── .env.local                 # 环境变量配置（需自行创建）
```

---

## 限流配置

| 限流类型 | 默认值 | 说明 |
|---------|--------|------|
| IP 级别 | 5次/分钟 | 防止恶意刷请求 |
| 会话级别 | 30次/天 | 控制每日对话额度 |

---

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 环境变量中配置 `ZHIPU_API_KEY`
4. 点击部署

---

## 常见问题

**Q: 构建时提示找不到 API Key？**
A: 确保已创建 `.env.local` 文件并填入有效的 API Key。

**Q: AI 回复不是乔布斯风格？**
A: 检查 System Prompt 配置，可能需要调整提示词。

**Q: 移动端显示异常？**
A: 清除浏览器缓存后刷新，确保使用最新代码。

**Q: 限流太严格？**
A: 修改 `.env.local` 中的 `RATE_LIMIT_*` 配置。

---

## 下一步计划

- [ ] 添加金句海报生成功能（图片导出）
- [ ] 接入埋点分析系统
- [ ] 添加多语言支持
- [ ] 优化乔布斯人格还原度

---

## 技术支持

如有问题，请查看：
- PRD 文档: `PRD_乔布斯纪念馆AI升级_v2.2.md`
- 智谱 AI 文档: https://open.bigmodel.cn/
- Vercel AI SDK: https://sdk.vercel.ai/
