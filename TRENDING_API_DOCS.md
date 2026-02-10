# 热搜榜 API 文档

## 概述

热搜榜功能聚合多个平台的热门内容，包括知乎、微博、百度、抖音、GitHub 等平台的热搜数据。

## 数据来源

- 知乎热榜
- 微博热搜
- 百度热搜
- 抖音热点
- GitHub Trending
- 掘金热门
- V2EX 热议
- 豆瓣热门

## API 端点

### 1. 获取热搜榜列表

**端点**: `GET /api/trending`

**描述**: 获取所有平台的热搜数据

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| platform | string | 否 | 平台筛选 (zhihu/weibo/baidu/douyin/github/juejin/v2ex/douban) |
| limit | integer | 否 | 每个平台返回的条目数，默认 20，最大 50 |
| cache | boolean | 否 | 是否使用缓存，默认 true |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "zhihu": {
      "platform": "zhihu",
      "platform_name": "知乎",
      "icon": "https://static.zhihu.com/heifetz/favicon.ico",
      "update_time": "2026-02-10T10:30:00Z",
      "items": [
        {
          "id": "1",
          "title": "如何看待某某事件？",
          "url": "https://www.zhihu.com/question/123456",
          "hot_value": "1234万热度",
          "cover": "https://pic.zhihu.com/xxx.jpg",
          "excerpt": "这是一个热门问题...",
          "author": "匿名用户",
          "category": "社会",
          "rank": 1
        }
      ]
    },
    "weibo": {
      "platform": "weibo",
      "platform_name": "微博",
      "icon": "https://weibo.com/favicon.ico",
      "update_time": "2026-02-10T10:30:00Z",
      "items": [
        {
          "id": "1",
          "title": "#某某话题#",
          "url": "https://s.weibo.com/weibo?q=%23xxx%23",
          "hot_value": "5678万",
          "tag": "热",
          "category": "娱乐",
          "rank": 1
        }
      ]
    }
  }
}
```

### 2. 获取单个平台热搜

**端点**: `GET /api/trending/{platform}`

**描述**: 获取指定平台的热搜数据

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| platform | string | 是 | 平台标识 (zhihu/weibo/baidu/douyin/github/juejin/v2ex/douban) |

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | integer | 否 | 返回的条目数，默认 20，最大 50 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "platform": "zhihu",
    "platform_name": "知乎",
    "icon": "https://static.zhihu.com/heifetz/favicon.ico",
    "update_time": "2026-02-10T10:30:00Z",
    "items": [
      {
        "id": "1",
        "title": "如何看待某某事件？",
        "url": "https://www.zhihu.com/question/123456",
        "hot_value": "1234万热度",
        "cover": "https://pic.zhihu.com/xxx.jpg",
        "excerpt": "这是一个热门问题...",
        "author": "匿名用户",
        "category": "社会",
        "rank": 1
      }
    ]
  }
}
```

### 3. 刷新热搜数据

**端点**: `POST /api/trending/refresh`

**描述**: 手动刷新热搜数据（需要管理员权限）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| platform | string | 否 | 指定刷新的平台，不传则刷新所有 |

**响应示例**:

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "refreshed_platforms": ["zhihu", "weibo", "baidu"],
    "refresh_time": "2026-02-10T10:30:00Z"
  }
}
```

### 4. 获取平台列表

**端点**: `GET /api/trending/platforms`

**描述**: 获取支持的所有平台列表

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "zhihu",
      "name": "知乎",
      "icon": "https://static.zhihu.com/heifetz/favicon.ico",
      "color": "#0084FF",
      "enabled": true
    },
    {
      "id": "weibo",
      "name": "微博",
      "icon": "https://weibo.com/favicon.ico",
      "color": "#E6162D",
      "enabled": true
    }
  ]
}
```

## 数据模型

### TrendingItem (热搜条目)

```typescript
interface TrendingItem {
  id: string;              // 唯一标识
  title: string;           // 标题
  url: string;             // 链接
  hot_value?: string;      // 热度值
  cover?: string;          // 封面图
  excerpt?: string;        // 摘要
  author?: string;         // 作者
  category?: string;       // 分类
  tag?: string;            // 标签 (热/新/爆等)
  rank: number;            // 排名
}
```

### PlatformData (平台数据)

```typescript
interface PlatformData {
  platform: string;        // 平台标识
  platform_name: string;   // 平台名称
  icon: string;            // 平台图标
  update_time: string;     // 更新时间
  items: TrendingItem[];   // 热搜条目列表
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 平台不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |
| 503 | 数据源不可用 |

## 缓存策略

- 热搜数据缓存时间：10 分钟
- 平台列表缓存时间：1 小时
- 使用 Redis 作为缓存层
- 支持手动刷新缓存

## 限流策略

- 普通用户：每分钟 60 次请求
- 刷新接口：每小时 10 次请求
- 超过限制返回 429 错误

## 数据更新

- 自动更新：每 10 分钟自动抓取一次
- 手动更新：管理员可手动触发刷新
- 失败重试：失败后 1 分钟重试，最多重试 3 次

## 第三方数据源

### 知乎热榜
- API: `https://www.zhihu.com/api/v4/creators/rank/hot`
- 更新频率: 实时

### 微博热搜
- API: `https://weibo.com/ajax/side/hotSearch`
- 更新频率: 实时

### 百度热搜
- API: `https://top.baidu.com/api/board`
- 更新频率: 实时

### GitHub Trending
- API: `https://api.github.com/search/repositories`
- 更新频率: 每日

### 掘金热门
- API: `https://api.juejin.cn/content_api/v1/content/article_rank`
- 更新频率: 实时

### V2EX 热议
- API: `https://www.v2ex.com/api/topics/hot.json`
- 更新频率: 实时

### 豆瓣热门
- API: `https://movie.douban.com/j/search_subjects`
- 更新频率: 每日

## 实现建议

### 后端实现

1. **数据抓取服务**
   - 使用 Celery 定时任务
   - 异步抓取各平台数据
   - 错误处理和重试机制

2. **缓存层**
   - Redis 存储热搜数据
   - 设置合理的过期时间
   - 支持缓存预热

3. **API 层**
   - FastAPI 实现 RESTful API
   - 数据验证和序列化
   - 限流和权限控制

### 前端实现

1. **数据展示**
   - 卡片式布局
   - 支持平台切换
   - 实时更新提示

2. **交互优化**
   - 骨架屏加载
   - 下拉刷新
   - 无限滚动

3. **性能优化**
   - 虚拟滚动
   - 图片懒加载
   - 数据缓存

## 安全考虑

- 防止爬虫被封：使用代理池、User-Agent 轮换
- 数据验证：过滤恶意内容
- 频率限制：防止滥用
- 错误处理：优雅降级

## 扩展功能

- [ ] 热搜历史记录
- [ ] 热搜趋势分析
- [ ] 个性化推荐
- [ ] 关键词订阅
- [ ] 数据导出
- [ ] 热搜对比

## 参考资料

- [知乎 API 文档](https://www.zhihu.com/api)
- [微博 API 文档](https://open.weibo.com/wiki)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [掘金 API 文档](https://juejin.cn/api)

