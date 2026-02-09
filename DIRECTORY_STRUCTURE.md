# 项目目录结构

## 整体项目结构

```
utils-web/
├── frontend/                 # Next.js 前端项目（本地开发）
├── backend/                  # FastAPI 后端项目（本地开发）
├── docker/                   # Docker 相关配置
│   ├── docker-compose.dev.yml    # 开发环境（仅数据库服务）
│   ├── docker-compose.prod.yml   # 生产环境（完整服务）
│   └── nginx/                    # Nginx 配置
├── docs/                     # 项目文档
└── README.md                 # 项目说明
```

---

## 前端目录结构 (Next.js 14 App Router)

```
frontend/
├── public/                   # 静态资源
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # 根布局
│   │   ├── page.tsx          # 首页
│   │   ├── globals.css       # 全局样式
│   │   │
│   │   ├── (auth)/           # 认证相关路由组
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (main)/           # 主要内容路由组
│   │   │   ├── layout.tsx    # 主布局（包含导航栏）
│   │   │   │
│   │   │   ├── posts/        # 内容列表
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── daily/        # 日常记录
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── albums/       # 相册
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── travel/       # 旅游路线
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── tools/        # 生活小工具
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── profile/      # 用户主页
│   │   │       └── [username]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── create/           # 创建内容
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   └── api/              # API Routes (可选)
│   │       └── revalidate/
│   │           └── route.ts
│   │
│   ├── components/           # React 组件
│   │   ├── ui/               # 基础 UI 组件（基于 Ant Design 封装）
│   │   │   ├── CustomButton.tsx
│   │   │   ├── CustomModal.tsx
│   │   │   ├── CustomCard.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/           # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── post/             # 内容相关组件
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── PostEditor.tsx
│   │   │   └── PostActions.tsx
│   │   │
│   │   ├── comment/          # 评论组件
│   │   │   ├── CommentList.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── CommentForm.tsx
│   │   │
│   │   ├── media/            # 媒体组件
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── VideoUploader.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── MediaPreview.tsx
│   │   │
│   │   ├── map/              # 地图组件
│   │   │   ├── MapView.tsx
│   │   │   ├── RouteEditor.tsx
│   │   │   └── LocationPicker.tsx
│   │   │
│   │   ├── user/             # 用户相关组件
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserAvatar.tsx
│   │   │
│   │   └── common/           # 通用组件
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Pagination.tsx
│   │       ├── SearchBar.tsx
│   │       └── TagList.tsx
│   │
│   ├── lib/                  # 工具库
│   │   ├── api/              # API 客户端
│   │   │   ├── client.ts     # Axios 配置
│   │   │   ├── auth.ts       # 认证 API
│   │   │   ├── posts.ts      # 内容 API
│   │   │   ├── comments.ts   # 评论 API
│   │   │   ├── users.ts      # 用户 API
│   │   │   └── media.ts      # 媒体 API
│   │   │
│   │   ├── hooks/            # 自定义 Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePosts.ts
│   │   │   ├── useComments.ts
│   │   │   ├── useUpload.ts
│   │   │   └── useInfiniteScroll.ts
│   │   │
│   │   ├── store/            # 状态管理 (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── postStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── utils/            # 工具函数
│   │   │   ├── format.ts     # 格式化函数
│   │   │   ├── validation.ts # 验证函数
│   │   │   ├── storage.ts    # 本地存储
│   │   │   └── constants.ts  # 常量定义
│   │   │
│   │   └── types/            # TypeScript 类型定义
│   │       ├── user.ts
│   │       ├── post.ts
│   │       ├── comment.ts
│   │       └── api.ts
│   │
│   └── styles/               # 样式文件
│       ├── globals.css
│       ├── variables.less    # Less 变量
│       ├── antd-custom.less  # Ant Design 主题定制
│       └── themes/
│           ├── light.less
│           └── dark.less
│
├── .env.local                # 环境变量
├── .env.example              # 环境变量示例
├── next.config.js            # Next.js 配置
├── .lessrc                   # Less 配置
├── tsconfig.json             # TypeScript 配置
├── package.json              # 依赖管理
├── .nvmrc                    # Node 版本配置
└── README.md                 # 前端说明文档
```

---

## 后端目录结构 (FastAPI)

```
backend/
├── app/
│   ├── main.py               # FastAPI 应用入口
│   ├── config.py             # 配置文件
│   ├── dependencies.py       # 依赖注入
│   │
│   ├── api/                  # API 路由
│   │   ├── __init__.py
│   │   ├── v1/               # API v1 版本
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py       # 认证接口
│   │   │   │   ├── users.py      # 用户接口
│   │   │   │   ├── posts.py      # 内容接口
│   │   │   │   ├── comments.py   # 评论接口
│   │   │   │   ├── media.py      # 媒体接口
│   │   │   │   ├── travel.py     # 旅游路线接口
│   │   │   │   └── tags.py       # 标签接口
│   │   │   └── router.py     # 路由聚合
│   │   └── deps.py           # API 依赖
│   │
│   ├── core/                 # 核心功能
│   │   ├── __init__.py
│   │   ├── security.py       # 安全相关（JWT、密码加密）
│   │   ├── config.py         # 配置管理
│   │   └── exceptions.py     # 自定义异常
│   │
│   ├── db/                   # 数据库
│   │   ├── __init__.py
│   │   ├── base.py           # 数据库基类
│   │   ├── session.py        # 数据库会话
│   │   └── init_db.py        # 数据库初始化
│   │
│   ├── models/               # SQLAlchemy 模型
│   │   ├── __init__.py
│   │   ├── user.py           # 用户模型
│   │   ├── post.py           # 内容模型
│   │   ├── comment.py        # 评论模型
│   │   ├── media.py          # 媒体模型
│   │   ├── travel_route.py   # 旅游路线模型
│   │   ├── tag.py            # 标签模型
│   │   └── like.py           # 点赞模型
│   │
│   ├── schemas/              # Pydantic 模式（请求/响应）
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── post.py
│   │   ├── comment.py
│   │   ├── media.py
│   │   ├── travel_route.py
│   │   ├── tag.py
│   │   └── token.py
│   │
│   ├── crud/                 # CRUD 操作
│   │   ├── __init__.py
│   │   ├── base.py           # 基础 CRUD
│   │   ├── user.py
│   │   ├── post.py
│   │   ├── comment.py
│   │   ├── media.py
│   │   └── travel_route.py
│   │
│   ├── services/             # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── auth_service.py   # 认证服务
│   │   ├── post_service.py   # 内容服务
│   │   ├── media_service.py  # 媒体处理服务
│   │   ├── email_service.py  # 邮件服务
│   │   └── cache_service.py  # 缓存服务
│   │
│   ├── utils/                # 工具函数
│   │   ├── __init__.py
│   │   ├── file_handler.py   # 文件处理
│   │   ├── image_processor.py # 图片处理
│   │   ├── video_processor.py # 视频处理
│   │   └── validators.py     # 验证器
│   │
│   ├── middleware/           # 中间件
│   │   ├── __init__.py
│   │   ├── cors.py           # CORS 中间件
│   │   ├── rate_limit.py     # 限流中间件
│   │   └── logging.py        # 日志中间件
│   │
│   └── tasks/                # 异步任务 (Celery)
│       ├── __init__.py
│       ├── celery_app.py     # Celery 配置
│       ├── media_tasks.py    # 媒体处理任务
│       └── email_tasks.py    # 邮件发送任务
│
├── alembic/                  # 数据库迁移
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
│
├── tests/                    # 测试
│   ├── __init__.py
│   ├── conftest.py           # pytest 配置
│   ├── test_api/
│   │   ├── test_auth.py
│   │   ├── test_posts.py
│   │   └── test_users.py
│   └── test_services/
│       └── test_auth_service.py
│
├── scripts/                  # 脚本
│   ├── init_db.py            # 初始化数据库
│   └── create_admin.py       # 创建管理员
│
├── .env                      # 环境变量
├── .env.example              # 环境变量示例
├── requirements.txt          # Python 依赖
├── requirements-dev.txt      # 开发依赖
├── Dockerfile                # Docker 配置
├── pyproject.toml            # Python 项目配置
└── README.md                 # 后端说明文档
```

---

## Docker 配置结构

```
docker/
├── docker-compose.dev.yml    # 开发环境（仅数据库服务）
├── docker-compose.prod.yml   # 生产环境（完整服务）
├── backend/
│   └── Dockerfile            # 后端生产环境镜像
├── frontend/
│   └── Dockerfile            # 前端生产环境镜像
└── nginx/
    ├── nginx.conf            # Nginx 主配置
    ├── conf.d/
    │   └── production.conf   # 生产环境站点配置
    └── ssl/                  # SSL 证书（生产环境）
        ├── cert.pem
        └── key.pem
```

---

## 文档结构

```
docs/
├── api/                      # API 文档
│   ├── authentication.md
│   ├── posts.md
│   ├── comments.md
│   └── media.md
│
├── deployment/               # 部署文档
│   ├── docker.md
│   ├── production.md
│   └── ci-cd.md
│
├── development/              # 开发文档
│   ├── setup.md
│   ├── coding-standards.md
│   └── testing.md
│
└── architecture/             # 架构文档
    ├── database-schema.md
    ├── system-design.md
    └── security.md
```

---

## 配置文件说明

### 前端环境变量 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MEDIA_URL=http://localhost:9000
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 后端环境变量 (.env)
```env
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/utils_web
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# 文件存储
STORAGE_TYPE=minio  # minio, s3, oss
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=utils-web

# 邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# 其他
ENVIRONMENT=development
DEBUG=True
```

### Docker Compose 配置
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/utils_web
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
      - minio

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=utils_web
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

---

## 关键文件说明

### 前端关键文件

**package.json**
```json
{
  "name": "utils-web-frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "antd": "^5.12.0",
    "@ant-design/icons": "^5.2.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "less": "^4.2.0",
    "less-loader": "^11.1.0"
  }
}
```

**next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // 支持 Less
  webpack: (config) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: {
                // Ant Design 主题定制
                '@primary-color': '#1890ff',
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
    });
    return config;
  },
}

module.exports = nextConfig
```

**.nvmrc**
```
18.18.0
```

### 后端关键文件

**main.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(title="Utils Web API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
```

**requirements.txt**
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pillow==10.2.0
redis==5.0.1
celery==5.3.6
pydantic==2.5.3
pydantic-settings==2.1.0
```

这个目录结构提供了清晰的代码组织，便于团队协作和项目维护。

