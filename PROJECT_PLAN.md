# 生活记录平台 - 项目方案

## 项目概述

一个基于 React SSR + FastAPI 的生活记录平台，支持日常记录、历史相册、旅游路线分享等功能。

### 核心功能
- 📝 日常记录发布（文字、图片、视频）
- 📷 历史相册管理
- 🗺️ 旅游路线记录与分享
- 💬 评论互动系统
- 👤 用户认证系统
- 🔍 SEO 优化（服务端渲染）
- 📱 响应式设计

### 用户权限
- **未登录用户**：浏览公开内容
- **登录用户**：发布内容、评论、点赞、收藏

---

## 技术栈

### 前端
- **框架**: React 18
- **SSR**: Next.js 14 (App Router)
- **状态管理**: Zustand / React Query
- **UI组件**: Ant Design 5.x
- **样式**: CSS Modules + Less
- **富文本编辑器**: Tiptap / Lexical
- **地图**: Mapbox GL JS / 高德地图
- **媒体上传**: Ant Design Upload
- **图片预览**: Ant Design Image
- **视频播放**: Video.js / Plyr
- **图标**: @ant-design/icons

### 后端
- **框架**: FastAPI 0.109+
- **数据库**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0
- **认证**: JWT (python-jose)
- **文件存储**: MinIO / 阿里云OSS / AWS S3
- **缓存**: Redis
- **任务队列**: Celery + Redis
- **图片处理**: Pillow
- **视频处理**: FFmpeg (通过 python-ffmpeg)

### DevOps
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack (可选)

---

## 数据库设计

### 核心表结构

#### users (用户表)
```sql
- id: UUID (主键)
- username: VARCHAR(50) (唯一)
- email: VARCHAR(100) (唯一)
- password_hash: VARCHAR(255)
- avatar_url: VARCHAR(500)
- bio: TEXT
- is_active: BOOLEAN
- is_verified: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### posts (内容发布表)
```sql
- id: UUID (主键)
- user_id: UUID (外键)
- type: ENUM('daily', 'album', 'travel', 'tool')
- title: VARCHAR(200)
- content: TEXT
- cover_image: VARCHAR(500)
- is_public: BOOLEAN
- view_count: INTEGER
- like_count: INTEGER
- comment_count: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### media (媒体文件表)
```sql
- id: UUID (主键)
- post_id: UUID (外键)
- type: ENUM('image', 'video')
- url: VARCHAR(500)
- thumbnail_url: VARCHAR(500)
- file_size: BIGINT
- width: INTEGER
- height: INTEGER
- duration: INTEGER (视频时长)
- order: INTEGER
- created_at: TIMESTAMP
```

#### travel_routes (旅游路线表)
```sql
- id: UUID (主键)
- post_id: UUID (外键)
- start_location: VARCHAR(200)
- end_location: VARCHAR(200)
- waypoints: JSONB (途经点)
- duration_days: INTEGER
- total_distance: FLOAT
- route_data: JSONB (地图路线数据)
- created_at: TIMESTAMP
```

#### comments (评论表)
```sql
- id: UUID (主键)
- post_id: UUID (外键)
- user_id: UUID (外键)
- parent_id: UUID (外键, 可为空)
- content: TEXT
- like_count: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### likes (点赞表)
```sql
- id: UUID (主键)
- user_id: UUID (外键)
- target_id: UUID (可以是post或comment)
- target_type: ENUM('post', 'comment')
- created_at: TIMESTAMP
- UNIQUE(user_id, target_id, target_type)
```

#### tags (标签表)
```sql
- id: UUID (主键)
- name: VARCHAR(50) (唯一)
- usage_count: INTEGER
- created_at: TIMESTAMP
```

#### post_tags (文章标签关联表)
```sql
- post_id: UUID (外键)
- tag_id: UUID (外键)
- PRIMARY KEY(post_id, tag_id)
```

---

## API 设计

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新Token
- `GET /api/auth/me` - 获取当前用户信息

### 用户相关
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/:id` - 更新用户信息
- `GET /api/users/:id/posts` - 获取用户发布内容

### 内容发布
- `GET /api/posts` - 获取内容列表（支持分页、筛选）
- `GET /api/posts/:id` - 获取内容详情
- `POST /api/posts` - 创建内容
- `PUT /api/posts/:id` - 更新内容
- `DELETE /api/posts/:id` - 删除内容
- `POST /api/posts/:id/like` - 点赞/取消点赞

### 评论相关
- `GET /api/posts/:id/comments` - 获取评论列表
- `POST /api/posts/:id/comments` - 发表评论
- `PUT /api/comments/:id` - 更新评论
- `DELETE /api/comments/:id` - 删除评论
- `POST /api/comments/:id/like` - 点赞评论

### 媒体上传
- `POST /api/media/upload` - 上传图片/视频
- `DELETE /api/media/:id` - 删除媒体文件
- `POST /api/media/upload/chunk` - 分片上传（大文件）

### 旅游路线
- `GET /api/travel-routes` - 获取旅游路线列表
- `GET /api/travel-routes/:id` - 获取路线详情

### 标签相关
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/:id/posts` - 获取标签下的内容

---

## 功能模块详细设计

### 1. 用户认证系统
- JWT Token 认证（Access Token + Refresh Token）
- 密码加密存储（bcrypt）
- 邮箱验证
- 第三方登录（可选：微信、GitHub）
- 密码重置功能

### 2. 内容发布系统
- 富文本编辑器（支持Markdown）
- 图片批量上传（拖拽上传）
- 视频上传（支持大文件分片上传）
- 内容草稿保存
- 内容可见性设置（公开/私密）
- 标签系统

### 3. 旅游路线功能
- 地图路线绘制
- 途经点标记
- 行程天数记录
- 费用预算（可选）
- 景点推荐
- 路线导出（GPX格式）

### 4. 互动系统
- 评论（支持嵌套回复）
- 点赞
- 收藏
- 分享（生成分享链接）
- 通知系统

### 5. SEO 优化
- 服务端渲染（Next.js SSR）
- 动态生成 Meta 标签
- Sitemap 自动生成
- 结构化数据（JSON-LD）
- Open Graph 标签
- 图片懒加载
- 页面预渲染

---

## 开发阶段规划

### Phase 1: 基础架构搭建（2周）
- [ ] 项目初始化
- [ ] 数据库设计与迁移
- [ ] 用户认证系统
- [ ] 基础 API 框架
- [ ] Next.js SSR 配置
- [ ] Docker 环境搭建

### Phase 2: 核心功能开发（4周）
- [ ] 内容发布功能
- [ ] 图片上传与展示
- [ ] 视频上传与播放
- [ ] 评论系统
- [ ] 点赞功能
- [ ] 用户个人主页

### Phase 3: 高级功能（3周）
- [ ] 旅游路线功能
- [ ] 地图集成
- [ ] 标签系统
- [ ] 搜索功能
- [ ] 通知系统
- [ ] 收藏功能

### Phase 4: 优化与测试（2周）
- [ ] SEO 优化
- [ ] 性能优化
- [ ] 单元测试
- [ ] 集成测试
- [ ] 安全性测试
- [ ] 响应式适配

### Phase 5: 部署上线（1周）
- [ ] 生产环境配置
- [ ] CI/CD 流程
- [ ] 监控告警
- [ ] 备份策略
- [ ] 文档完善

---

## 性能优化策略

### 前端优化
- 代码分割（Dynamic Import）
- 图片优化（WebP格式、响应式图片）
- 懒加载（图片、组件）
- CDN 加速
- Service Worker（PWA）
- 骨架屏加载

### 后端优化
- 数据库索引优化
- Redis 缓存（热点数据）
- 数据库连接池
- 异步任务处理（Celery）
- API 响应压缩
- 分页查询优化

### 媒体文件优化
- 图片压缩与缩略图生成
- 视频转码（多清晰度）
- CDN 存储
- 懒加载策略

---

## 安全策略

- HTTPS 强制
- CORS 配置
- SQL 注入防护（ORM参数化查询）
- XSS 防护（内容过滤）
- CSRF 防护
- 文件上传验证（类型、大小）
- 频率限制（Rate Limiting）
- 敏感信息加密
- 日志审计

---

## 部署架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │  (反向代理)  │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼─────┐            ┌─────▼─────┐
         │ Next.js  │            │  FastAPI  │
         │   SSR    │            │   API     │
         └──────────┘            └─────┬─────┘
                                       │
                    ┌──────────────────┼──────────────┐
                    │                  │              │
              ┌─────▼─────┐      ┌────▼────┐   ┌────▼────┐
              │PostgreSQL │      │  Redis  │   │  MinIO  │
              │  (数据库)  │      │ (缓存)  │   │ (存储)  │
              └───────────┘      └─────────┘   └─────────┘
```

---

## 监控与维护

- 应用性能监控（APM）
- 错误追踪（Sentry）
- 日志收集与分析
- 数据库性能监控
- 服务器资源监控
- 定期备份策略
- 灾难恢复计划

---

## 扩展性考虑

- 微服务架构（后期可拆分）
- 数据库读写分离
- 负载均衡
- 消息队列（RabbitMQ/Kafka）
- 搜索引擎（Elasticsearch）
- 推荐系统（协同过滤）

