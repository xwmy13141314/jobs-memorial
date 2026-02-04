# Vercel KV 部署指南

## 📋 概述

本项目的访问统计功能支持两种存储方式：
- **本地开发**：自动使用文件存储（`data/visit-stats.json`）
- **Vercel 生产**：自动检测并使用 Vercel KV（如果已配置）

## 🚀 Vercel KV 设置步骤

### 方式一：使用 Vercel Dashboard（推荐）

1. **登录 Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **进入你的项目设置**
   - 选择 `steve-jobs-tribute` 项目
   - 点击 `Storage` 标签

3. **创建 KV 数据库**
   - 点击 `Create Database`
   - 选择 `KV` (Redis-compatible)
   - 选择区域（推荐：`Washington D.C.` 或离用户最近的区域）
   - 点击 `Create` 继续

4. **连接数据库**
   - 创建后，Vercel 会自动添加环境变量：
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
   - 这些环境变量会被 `@vercel/kv` 自动使用

5. **重新部署**
   - 数据库连接后，Vercel 会提示重新部署
   - 点击 `Redeploy` 应用更改

### 方式二：使用 Vercel CLI

```bash
# 安装 Vercel CLI（如果未安装）
npm i -g vercel

# 登录
vercel login

# 链接项目
cd "jobs memorial"
vercel link

# 创建 KV 数据库
vercel kv create

# 重新部署
vercel --prod
```

## 🧪 验证部署

部署后，访问你的网站并检查：

1. **查看网络请求**
   - 打开浏览器开发者工具（F12）
   - 切换到 Network 标签
   - 刷新页面，查找 `/api/visit` 请求

2. **检查响应数据**
   ```json
   {
     "success": true,
     "data": {
       "totalVisits": 12581,
       "uniqueVisitors": 1,
       "lastUpdated": 1738656000000
     }
   }
   ```

3. **验证 KV 存储**
   - 在 Vercel Dashboard → Storage → KV 数据库
   - 点击 "Browse" 查看存储的键值
   - 应该能看到类似 `steve-jobs:visit-stats` 的键

## 📊 数据结构

### KV 存储的键值

| 键名 | 类型 | TTL | 说明 |
|------|------|-----|------|
| `steve-jobs:visit-stats` | JSON | 无 | 统计数据对象 |
| `steve-jobs:ip:{ip地址}` | 时间戳 | 24小时 | IP 访问记录 |

### 统计数据格式

```json
{
  "totalVisits": 12580,
  "uniqueVisitors": 1234,
  "lastUpdated": 1738656000000
}
```

## 🔧 环境变量说明

项目不需要手动设置环境变量，Vercel KV 会自动注入：
- `KV_URL` - KV 连接 URL
- `KV_REST_API_URL` - REST API 端点
- `KV_REST_API_TOKEN` - 认证令牌

## ⚠️ 注意事项

1. **KV 已弃用**
   - Vercel KV 已被弃用，推荐新项目使用 Upstash Redis
   - 但已安装的 `@vercel/kv` 包仍可正常工作

2. **本地开发**
   - 本地运行时，KV 不可用会自动降级到文件存储
   - 这是正常行为，无需担心

3. **数据迁移**
   - 如果从文件存储迁移到 KV，初始数据会重新开始计数
   - 可以手动导入初始数据到 KV

## 📈 升级到 Upstash Redis（可选）

如果需要更强大的 Redis 功能，可以升级到 Upstash：

1. 在 Vercel Marketplace 搜索 "Upstash Redis"
2. 安装并创建数据库
3. 安装 `@upstash/redis` 包
4. 更新代码使用 Upstash SDK

## 🆘 常见问题

### Q: A 部署后统计不工作？
A: 检查 Vercel Dashboard 中是否已正确连接 KV 数据库

### Q: 本地开发时能否使用 KV？
A: 可以，使用 `vercel env pull .env.local` 拉取环境变量到本地

### Q: 如何重置统计数据？
A: 在 Vercel Dashboard 的 KV 浏览器中删除 `steve-jobs:visit-stats` 键

### Q: 统计数据不准确？
A: KV 使用 IP 去重，24小时内同一 IP 只计数一次
