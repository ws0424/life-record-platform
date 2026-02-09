# 实施指南

本文档提供了项目的详细实施步骤和最佳实践。

## 📋 目录

1. [环境准备](#环境准备)
2. [项目初始化](#项目初始化)
3. [数据库设置](#数据库设置)
4. [开发流程](#开发流程)
5. [测试策略](#测试策略)
6. [部署流程](#部署流程)

---

## 环境准备

### 1. 安装必要工具

#### macOS
```bash
# 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node

# 安装 Python
brew install python@3.11

# 安装 PostgreSQL
brew install postgresql@15

# 安装 Redis
brew install redis

# 安装 Docker
brew install --cask docker
```

#### Ubuntu/Debian
```bash
# 更新包列表
sudo apt update

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Python
sudo apt install -y python3.11 python3.11-venv python3-pip

# 安装 PostgreSQL
sudo apt install -y postgresql-15

# 安装 Redis
sudo apt install -y redis-server

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. 验证安装

```bash
node --version    # v18.x.x 或更高
python3 --version # 3.11.x 或更高
psql --version    # 15.x
redis-cli --version
docker --version
docker-compose --version
```

---

## 项目初始化

### 1. 克隆或创建项目

```bash
# 如果是新项目
mkdir utils-web
cd utils-web

# 如果从 Git 克隆
git clone <repository-url>
cd utils-web
```

### 2. 初始化后端

```bash
# 创建后端目录
mkdir -p backend/app

# 创建虚拟环境
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 创建 requirements.txt
cat > requirements.txt << 'EOF'
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
python-dotenv==1.0.0
aiofiles==23.2.1
httpx==0.26.0
EOF

# 安装依赖
pip install -r requirements.txt

# 创建开发依赖
cat > requirements-dev.txt << 'EOF'
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
black==24.1.1
isort==5.13.2
flake8==7.0.0
mypy==1.8.0
EOF

pip install -r requirements-dev.txt
```

### 3. 初始化前端

```bash
cd ../
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir

# 或手动创建
mkdir frontend
cd frontend
npm init -y

# 安装依赖
npm install next@14 react@18 react-dom@18
npm install -D typescript @types/react @types/node
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint eslint-config-next

# 安装其他依赖
npm install zustand axios react-query
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install react-dropzone react-image-gallery
npm install mapbox-gl @types/mapbox-gl
```

---

## 数据库设置

### 1. 创建数据库

```bash
# 启动 PostgreSQL
# macOS
brew services start postgresql@15

# Ubuntu
sudo systemctl start postgresql

# 创建数据库
psql postgres
CREATE DATABASE utils_web;
CREATE USER utils_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE utils_web TO utils_user;
\q
```

### 2. 配置 Alembic

```bash
cd backend

# 初始化 Alembic
alembic init alembic

# 编辑 alembic.ini
# 修改 sqlalchemy.url = postgresql://utils_user:your_password@localhost/utils_web
```

### 3. 创建初始迁移

```bash
# 创建模型后
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

---

## 开发流程

### 1. 后端开发

#### 创建基础结构

```bash
cd backend/app

# 创建目录结构
mkdir -p api/v1/endpoints core db models schemas crud services utils middleware tasks

# 创建 __init__.py 文件
touch api/__init__.py api/v1/__init__.py api/v1/endpoints/__init__.py
touch core/__init__.py db/__init__.py models/__init__.py
touch schemas/__init__.py crud/__init__.py services/__init__.py
touch utils/__init__.py middleware/__init__.py tasks/__init__.py
```

#### 创建配置文件 (app/core/config.py)

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Utils Web API"
    API_V1_PREFIX: str = "/api/v1"
    
    DATABASE_URL: str
    REDIS_URL: str
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

#### 创建主应用 (app/main.py)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

#### 启动开发服务器

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 前端开发

#### 创建基础结构

```bash
cd frontend/src

# 创建目录
mkdir -p components/ui components/layout components/post
mkdir -p lib/api lib/hooks lib/store lib/utils lib/types
mkdir -p styles/themes
```

#### 配置 Next.js (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

#### 创建 API 客户端 (lib/api/client.ts)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

#### 启动开发服务器

```bash
cd frontend
npm run dev
```

---

## 测试策略

### 1. 后端测试

#### 配置 pytest (backend/tests/conftest.py)

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)
```

#### 运行测试

```bash
cd backend
pytest
pytest --cov=app tests/
```

### 2. 前端测试

#### 安装测试工具

```bash
cd frontend
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

#### 运行测试

```bash
npm run test
npm run test:coverage
```

---

## 部署流程

### 1. 使用 Docker Compose 部署

```bash
# 开发环境
docker-compose up -d

# 生产环境
# 1. 配置环境变量
cp .env.prod.example .env.prod
# 编辑 .env.prod 填入生产配置

# 2. 启动服务
docker-compose -f docker-compose.prod.yml up -d

# 3. 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 4. 停止服务
docker-compose -f docker-compose.prod.yml down
```

### 2. 数据库迁移

```bash
# 进入后端容器
docker-compose exec backend bash

# 执行迁移
alembic upgrade head

# 创建管理员用户
python scripts/create_admin.py
```

### 3. 配置 SSL 证书

```bash
# 使用 Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

### 4. 监控和日志

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 查看资源使用
docker stats
```

---

## 常见问题

### 1. 数据库连接失败

```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql

# 检查连接字符串
echo $DATABASE_URL

# 测试连接
psql $DATABASE_URL
```

### 2. Redis 连接失败

```bash
# 检查 Redis 是否运行
redis-cli ping

# 应该返回 PONG
```

### 3. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :8000

# 杀死进程
kill -9 <PID>
```

### 4. Docker 容器无法启动

```bash
# 查看容器日志
docker-compose logs <service-name>

# 重新构建
docker-compose build --no-cache

# 清理并重启
docker-compose down -v
docker-compose up -d
```

---

## 下一步

1. 阅读 [API 文档](./docs/api/)
2. 查看 [开发规范](./docs/development/coding-standards.md)
3. 了解 [架构设计](./docs/architecture/system-design.md)
4. 开始开发第一个功能模块

---

## 获取帮助

- 查看项目文档
- 提交 Issue
- 联系项目维护者

