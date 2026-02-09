# 本地开发指南

本文档详细说明如何在本地进行开发，使用 Docker 运行数据库服务，前后端在本地运行。

## 开发架构

```
┌─────────────────────────────────────────────────────────┐
│                    本地开发环境                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐              ┌──────────────┐        │
│  │   Frontend   │              │   Backend    │        │
│  │  (Next.js)   │◄────────────►│  (FastAPI)   │        │
│  │ localhost:   │              │ localhost:   │        │
│  │    3000      │              │    8000      │        │
│  └──────────────┘              └──────┬───────┘        │
│       ▲                               │                 │
│       │                               │                 │
│       │                               ▼                 │
│       │                    ┌─────────────────┐         │
│       │                    │  Docker 服务     │         │
│       │                    ├─────────────────┤         │
│       │                    │  PostgreSQL     │         │
│       │                    │  :5432          │         │
│       │                    ├─────────────────┤         │
│       │                    │  Redis          │         │
│       └───────────────────►│  :6379          │         │
│                            ├─────────────────┤         │
│                            │  MinIO          │         │
│                            │  :9000/:9001    │         │
│                            └─────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## 环境准备

### 1. 安装 nvm (Node Version Manager)

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc

# 验证安装
nvm --version
```

### 2. 安装 Python 3.11

```bash
# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt install python3.11 python3.11-venv python3-pip

# 验证安装
python3.11 --version
```

### 3. 安装 Docker Desktop

- macOS: https://docs.docker.com/desktop/install/mac-install/
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Linux: https://docs.docker.com/desktop/install/linux-install/

```bash
# 验证安装
docker --version
docker-compose --version
```

---

## 快速开始

### Step 1: 启动 Docker 数据库服务

```bash
# 进入 docker 目录
cd docker

# 启动数据库服务（PostgreSQL + Redis + MinIO）
docker-compose -f docker-compose.dev.yml up -d

# 查看服务状态
docker-compose -f docker-compose.dev.yml ps

# 应该看到 3 个服务都是 Up 状态
# NAME                    STATUS
# utils-web-db-dev        Up (healthy)
# utils-web-redis-dev     Up (healthy)
# utils-web-minio-dev     Up (healthy)
```

**服务访问地址：**
- PostgreSQL: `localhost:5432`
  - 用户名: `postgres`
  - 密码: `postgres123`
  - 数据库: `utils_web`
- Redis: `localhost:6379`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`
  - 用户名: `minioadmin`
  - 密码: `minioadmin123`

### Step 2: 设置后端

```bash
# 回到项目根目录
cd ..

# 进入后端目录
cd backend

# 创建 Python 虚拟环境
python3.11 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Windows: venv\Scripts\activate

# 升级 pip
pip install --upgrade pip

# 安装依赖
pip install -r requirements.txt

# 开发环境还需要安装开发依赖
pip install -r requirements-dev.txt

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件（可选，默认配置已经可以连接到 Docker 服务）
# vim .env 或使用你喜欢的编辑器

# 初始化数据库（首次运行）
alembic upgrade head

# 创建测试数据（可选）
python scripts/init_db.py

# 启动后端开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**后端服务访问：**
- API: http://localhost:8000
- API 文档 (Swagger): http://localhost:8000/docs
- API 文档 (ReDoc): http://localhost:8000/redoc
- 健康检查: http://localhost:8000/health

### Step 3: 设置前端

```bash
# 新开一个终端窗口
# 进入前端目录
cd frontend

# 使用 nvm 安装并切换到项目指定的 Node 版本
nvm install  # 读取 .nvmrc 文件
nvm use      # 使用指定版本

# 验证 Node 版本
node --version  # 应该显示 v18.18.0

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env.local

# 编辑 .env.local 文件（可选，默认配置已经可以）
# vim .env.local

# 启动前端开发服务器
npm run dev
```

**前端服务访问：**
- 应用: http://localhost:3000

---

## 开发工作流

### 日常开发

1. **启动 Docker 服务**（如果还没启动）
```bash
cd docker
docker-compose -f docker-compose.dev.yml up -d
```

2. **启动后端**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. **启动前端**（新终端）
```bash
cd frontend
nvm use
npm run dev
```

### 停止开发环境

```bash
# 停止前后端（在各自终端按 Ctrl+C）

# 停止 Docker 服务
cd docker
docker-compose -f docker-compose.dev.yml down

# 如果需要清除所有数据（慎用！）
docker-compose -f docker-compose.dev.yml down -v
```

### 查看 Docker 服务日志

```bash
cd docker

# 查看所有服务日志
docker-compose -f docker-compose.dev.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.dev.yml logs -f db
docker-compose -f docker-compose.dev.yml logs -f redis
docker-compose -f docker-compose.dev.yml logs -f minio
```

---

## 数据库操作

### 连接数据库

```bash
# 使用 psql 连接
psql postgresql://postgres:postgres123@localhost:5432/utils_web

# 或者进入 Docker 容器
docker exec -it utils-web-db-dev psql -U postgres -d utils_web
```

### 数据库迁移

```bash
cd backend
source venv/bin/activate

# 创建新迁移
alembic revision --autogenerate -m "添加新表"

# 查看迁移历史
alembic history

# 执行迁移
alembic upgrade head

# 回滚到上一个版本
alembic downgrade -1

# 回滚到特定版本
alembic downgrade <revision_id>
```

### 重置数据库

```bash
# 方法 1: 使用 Alembic
cd backend
source venv/bin/activate
alembic downgrade base
alembic upgrade head

# 方法 2: 删除并重建 Docker 容器
cd docker
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
# 等待服务启动后
cd ../backend
alembic upgrade head
```

---

## MinIO 对象存储

### 访问 MinIO Console

1. 打开浏览器访问: http://localhost:9001
2. 登录信息:
   - 用户名: `minioadmin`
   - 密码: `minioadmin123`

### 创建存储桶

```bash
# 方法 1: 通过 Web Console 创建
# 访问 http://localhost:9001，点击 "Create Bucket"，输入 "utils-web"

# 方法 2: 使用 mc 命令行工具
docker exec utils-web-minio-dev mc alias set local http://localhost:9000 minioadmin minioadmin123
docker exec utils-web-minio-dev mc mb local/utils-web
docker exec utils-web-minio-dev mc policy set public local/utils-web
```

---

## 前端开发

### 使用 Ant Design 组件

```typescript
// src/components/post/PostCard.tsx
import { Card, Avatar, Space, Button } from 'antd';
import { LikeOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import styles from './PostCard.module.css';

export default function PostCard({ post }) {
  return (
    <Card
      className={styles.postCard}
      cover={<img alt={post.title} src={post.coverImage} />}
    >
      <Card.Meta
        avatar={<Avatar src={post.author.avatar} />}
        title={post.title}
        description={post.author.username}
      />
      <div className={styles.content}>{post.content}</div>
      <Space className={styles.actions}>
        <Button icon={<LikeOutlined />}>{post.likeCount}</Button>
        <Button icon={<CommentOutlined />}>{post.commentCount}</Button>
        <Button icon={<ShareAltOutlined />}>分享</Button>
      </Space>
    </Card>
  );
}
```

### 自定义主题

编辑 `src/styles/antd-custom.less`:

```less
// 主题色
@primary-color: #1890ff;
@link-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #f5222d;

// 字体
@font-size-base: 14px;
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;

// 圆角
@border-radius-base: 4px;

// 间距
@padding-lg: 24px;
@padding-md: 16px;
@padding-sm: 12px;
```

### API 调用示例

```typescript
// src/lib/api/posts.ts
import apiClient from './client';

export const getPosts = async (page = 1, pageSize = 20) => {
  const response = await apiClient.get('/api/v1/posts', {
    params: { page, page_size: pageSize }
  });
  return response.data;
};

export const createPost = async (data: any) => {
  const response = await apiClient.post('/api/v1/posts', data);
  return response.data;
};
```

---

## 后端开发

### 创建新的 API 端点

```python
# backend/app/api/v1/endpoints/posts.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.post import PostCreate, PostResponse
from app.crud.post import create_post

router = APIRouter()

@router.post("/", response_model=PostResponse)
def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db)
):
    return create_post(db, post)
```

### 添加数据库模型

```python
# backend/app/models/post.py
from sqlalchemy import Column, String, Text, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
import uuid

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
```

---

## 常见问题

### 1. Docker 服务无法启动

```bash
# 检查端口是否被占用
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :9000  # MinIO

# 停止占用端口的进程或修改 docker-compose.dev.yml 中的端口映射
```

### 2. 后端无法连接数据库

```bash
# 检查 Docker 服务是否运行
docker-compose -f docker-compose.dev.yml ps

# 检查 .env 文件中的数据库连接字符串
# DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/utils_web

# 测试数据库连接
psql postgresql://postgres:postgres123@localhost:5432/utils_web
```

### 3. 前端无法调用后端 API

```bash
# 检查后端是否运行
curl http://localhost:8000/health

# 检查 CORS 配置
# backend/.env 中的 CORS_ORIGINS 应该包含 http://localhost:3000

# 检查前端环境变量
# frontend/.env.local 中的 NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. nvm 命令找不到

```bash
# 重新加载 shell 配置
source ~/.bashrc  # 或 source ~/.zshrc

# 如果还是不行，重新安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### 5. Python 虚拟环境问题

```bash
# 删除旧的虚拟环境
rm -rf backend/venv

# 重新创建
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 性能优化建议

### 开发环境

1. **使用 SSD 硬盘**：Docker 卷性能更好
2. **分配足够的内存**：Docker Desktop 建议至少 4GB
3. **使用 Docker 卷而非绑定挂载**：数据库性能更好
4. **启用 Next.js Fast Refresh**：已默认启用
5. **使用 uvicorn --reload**：自动重载后端代码

### 数据库查询

1. **使用索引**：为常用查询字段添加索引
2. **使用连接池**：SQLAlchemy 已配置
3. **避免 N+1 查询**：使用 joinedload
4. **使用 Redis 缓存**：缓存热点数据

---

## 下一步

1. 阅读 [API 文档](http://localhost:8000/docs)
2. 查看 [Ant Design 文档](https://ant.design/components/overview-cn/)
3. 了解 [FastAPI 最佳实践](https://fastapi.tiangolo.com/tutorial/)
4. 学习 [Next.js App Router](https://nextjs.org/docs/app)

---

## 获取帮助

- 查看项目文档
- 提交 Issue
- 联系项目维护者

