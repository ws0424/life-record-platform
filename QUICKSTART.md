# 快速启动指南

## 🚀 5分钟快速开始

### 1️⃣ 启动 Docker 数据库服务

```bash
cd docker
docker-compose -f docker-compose.dev.yml up -d
```

### 2️⃣ 启动后端

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3️⃣ 启动前端（新终端）

```bash
cd frontend
nvm install
nvm use
npm install
cp .env.example .env.local
npm run dev
```

### 4️⃣ 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

---

## 📁 项目结构

```
utils-web/
├── frontend/              # Next.js + Ant Design (本地运行)
├── backend/               # FastAPI + Python (本地运行)
└── docker/                # Docker 数据库服务
    ├── docker-compose.dev.yml   # 开发环境
    └── docker-compose.prod.yml  # 生产环境
```

---

## 📚 详细文档

- [完整项目方案](./PROJECT_PLAN.md)
- [本地开发指南](./LOCAL_DEVELOPMENT.md) ⭐ 推荐阅读
- [目录结构说明](./DIRECTORY_STRUCTURE.md)
- [技术选型说明](./TECH_STACK.md)
- [实施指南](./IMPLEMENTATION_GUIDE.md)

---

## 🛠️ 技术栈

- **前端**: Next.js 14 + React 18 + Ant Design 5 + TypeScript
- **后端**: FastAPI + Python 3.11 + PostgreSQL + Redis
- **开发**: nvm (Node 18.18.0) + Docker (数据库服务)

---

## 💡 开发模式

本项目采用**混合开发模式**：

✅ **前端和后端在本地运行** - 支持热重载，开发效率高  
✅ **数据库服务在 Docker 运行** - 环境一致，配置简单  
✅ **使用 nvm 管理 Node 版本** - 团队版本统一  

---

## 🔧 常用命令

### Docker 服务

```bash
# 启动
docker-compose -f docker/docker-compose.dev.yml up -d

# 停止
docker-compose -f docker/docker-compose.dev.yml down

# 查看日志
docker-compose -f docker/docker-compose.dev.yml logs -f
```

### 后端

```bash
# 激活虚拟环境
source backend/venv/bin/activate

# 数据库迁移
alembic upgrade head

# 运行测试
pytest
```

### 前端

```bash
# 切换 Node 版本
nvm use

# 开发模式
npm run dev

# 构建
npm run build
```

---

## 📞 获取帮助

遇到问题？查看 [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) 的常见问题部分。

