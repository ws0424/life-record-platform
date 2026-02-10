# 生活记录平台 (Life Record Platform)

一个基于 React SSR + FastAPI 的现代化生活记录平台，支持日常记录、相册管理、旅游路线分享等功能。

[![GitHub](https://img.shields.io/badge/GitHub-life--record--platform-blue)](https://github.com/ws0424/life-record-platform)

## ✨ 核心功能

- 📝 **日常记录** - 发布文字、图片、视频内容
- 📷 **历史相册** - 管理和展示个人相册
- 🗺️ **旅游路线** - 记录和分享旅行路线
- 🛠️ **生活小工具** - 实用工具记录
- 🔥 **热搜榜** - 聚合多平台热门内容（知乎、微博、百度等）
- 💬 **互动系统** - 评论、点赞、收藏
- 👤 **用户系统** - 完整的认证和权限管理
- 🔍 **SEO优化** - 服务端渲染，搜索引擎友好

## 🚀 快速开始

### 前置要求

- **Node.js 18+** (使用 nvm 管理)
- **Python 3.11+**
- **Docker & Docker Compose** (仅用于数据库服务)

### 5分钟快速启动

```bash
# 1. 启动 Docker 数据库服务
cd docker
docker-compose -f docker-compose.dev.yml up -d

# 2. 启动后端（新终端）
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 3. 启动前端（新终端）
cd frontend
nvm install && nvm use
npm install
cp .env.example .env.local
npm run dev
```

### 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

详细说明请查看 [快速启动指南](./QUICKSTART.md) 或 [本地开发指南](./LOCAL_DEVELOPMENT.md)

## 🛠️ 技术栈

### 前端
- **React 18** + **Next.js 14** (App Router)
- **Ant Design 5** - 企业级 UI 组件库
- **TypeScript** - 类型安全
- **CSS Modules + Less** - 样式方案
- **Zustand** - 轻量级状态管理
- **React Query** - 数据获取和缓存

### 后端
- **FastAPI** - 高性能 Python Web 框架
- **PostgreSQL** - 关系型数据库
- **Redis** - 缓存和会话管理
- **SQLAlchemy 2.0** - ORM
- **JWT** - 身份认证
- **MinIO** - 对象存储

### DevOps
- **Docker** + **Docker Compose** - 容器化部署
- **Nginx** - 反向代理
- **nvm** - Node 版本管理

## 📁 项目结构

```
utils-web/
├── frontend/              # Next.js + Ant Design (本地运行)
├── backend/               # FastAPI + Python (本地运行)
├── docker/                # Docker 数据库服务
│   ├── docker-compose.dev.yml   # 开发环境
│   └── docker-compose.prod.yml  # 生产环境
├── .cursor/               # Cursor AI 配置
│   └── skills/            # AI Skills
│       ├── git-auto-commit/      # Git 自动提交
│       ├── skill-validator/      # Skill 验证工具
│       └── skill-optimizer/      # Skill 优化工具
└── docs/                  # 项目文档
```

## 📚 文档

- [快速启动指南](./QUICKSTART.md) ⭐ 推荐新手阅读
- [本地开发指南](./LOCAL_DEVELOPMENT.md) - 详细的开发环境配置
- [完整项目方案](./PROJECT_PLAN.md) - 技术方案和架构设计
- [目录结构说明](./DIRECTORY_STRUCTURE.md) - 完整的目录架构
- [技术选型说明](./TECH_STACK.md) - 技术栈选择理由
- [实施指南](./IMPLEMENTATION_GUIDE.md) - 分步实施指南
- [热搜榜 API 文档](./TRENDING_API_DOCS.md) - 热搜榜接口文档
- [热搜榜前端文档](./TRENDING_FRONTEND_DOCS.md) - 热搜榜前端开发文档

## 💡 开发模式

本项目采用**混合开发模式**：

✅ **前端和后端在本地运行** - 支持热重载，开发效率高  
✅ **数据库服务在 Docker 运行** - 环境一致，配置简单  
✅ **使用 nvm 管理 Node 版本** - 团队版本统一  

## 🔧 常用命令

### Docker 服务

```bash
# 启动数据库服务
cd docker && docker-compose -f docker-compose.dev.yml up -d

# 停止服务
docker-compose -f docker-compose.dev.yml down

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f
```

### 后端开发

```bash
# 激活虚拟环境
source backend/venv/bin/activate

# 数据库迁移
cd backend && alembic upgrade head

# 运行测试
pytest

# 代码格式化
black app/ && isort app/
```

### 前端开发

```bash
# 切换 Node 版本
cd frontend && nvm use

# 开发模式
npm run dev

# 构建
npm run build

# 代码检查
npm run lint
```

### Git 提交

```bash
# 使用自动提交脚本
./git-commit.sh "feat: 添加新功能"

# 或者让 AI 自动分析并生成提交信息
python3 .cursor/skills/git-auto-commit/scripts/analyze-commit.py
./git-commit.sh
```

## 🎯 开发阶段

### Phase 1: 基础架构搭建 ✅
- [x] 项目初始化
- [x] 数据库设计
- [x] Docker 环境配置
- [x] 开发文档编写

### Phase 2: 核心功能开发 (进行中)
- [ ] 用户认证系统
- [ ] 内容发布功能
- [ ] 图片上传与展示
- [ ] 评论系统

### Phase 3: 高级功能
- [ ] 旅游路线功能
- [ ] 地图集成
- [ ] 标签系统
- [ ] 搜索功能

### Phase 4: 优化与测试
- [ ] SEO 优化
- [ ] 性能优化
- [ ] 单元测试
- [ ] 集成测试

### Phase 5: 部署上线
- [ ] 生产环境配置
- [ ] CI/CD 流程
- [ ] 监控告警

## 🤖 AI 辅助开发

本项目配置了 Cursor AI Skills，提供智能开发辅助：

### Git Auto Commit
自动分析代码变更，生成语义化的 commit message。

**使用方法：**
```
用户: 提交代码
AI: 分析变更 → 生成 commit → 执行提交
```

### Skill Validator
检查项目中的 skills 是否符合规范。

**使用方法：**
```
用户: 检查skill
AI: 扫描 skills → 验证规范 → 生成报告
```

### Skill Optimizer
自动优化和修复不规范的 skills。

**使用方法：**
```
用户: 优化skill
AI: 读取报告 → 应用修复 → 验证结果
```

## 📊 数据库设计

### 核心表
- `users` - 用户表
- `posts` - 内容发布表
- `media` - 媒体文件表
- `comments` - 评论表
- `likes` - 点赞表
- `tags` - 标签表
- `travel_routes` - 旅游路线表

详细设计请查看 [PROJECT_PLAN.md](./PROJECT_PLAN.md)

## 🔐 环境变量

### 前端 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MEDIA_URL=http://localhost:9000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 后端 (.env)
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/utils_web
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key
MINIO_ENDPOINT=localhost:9000
```

完整配置请参考各目录下的 `.env.example` 文件

## 🚢 部署

### 生产环境部署

```bash
cd docker
cp .env.prod.example .env.prod
# 编辑 .env.prod 填入生产配置

docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

详细部署说明请查看 [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 提交规范

使用语义化提交信息（Conventional Commits）：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- [@ws0424](https://github.com/ws0424)

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

## 📞 联系方式

- GitHub: https://github.com/ws0424/life-record-platform
- Issues: https://github.com/ws0424/life-record-platform/issues

---

**注意**: 这是一个开发中的项目，功能和文档会持续更新。

⭐ 如果这个项目对你有帮助，请给个 Star！
