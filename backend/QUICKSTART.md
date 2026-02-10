# 后端开发快速指南

## 🚀 快速启动

### 方式一：使用安装脚本（推荐）

```bash
cd backend
./setup.sh
```

### 方式二：手动安装

#### 1. 安装依赖

```bash
cd backend
pip3 install -r requirements.txt
```

#### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库、Redis、邮件服务
```

#### 3. 启动数据库和 Redis

**使用 Docker（推荐）：**

```bash
# PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=utils_web \
  -p 5432:5432 \
  postgres:15

# Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7
```

**或使用本地安装：**

```bash
# macOS
brew install postgresql redis
brew services start postgresql
brew services start redis

# Ubuntu/Debian
sudo apt install postgresql redis-server
sudo systemctl start postgresql
sudo systemctl start redis-server
```

#### 4. 启动应用

```bash
python3 main.py
```

或使用 uvicorn：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📝 环境变量配置

编辑 `.env` 文件：

```env
# 数据库配置
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/utils_web

# Redis 配置
REDIS_URL=redis://localhost:6379/0

# JWT 配置
SECRET_KEY=your-secret-key-change-this-in-production

# 邮件配置（重要！）
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
MAIL_FROM=your-email@example.com
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
```

### 邮件服务配置示例

**Gmail:**
```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # 需要开启两步验证并生成应用专用密码
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

**QQ 邮箱:**
```env
MAIL_USERNAME=your-email@qq.com
MAIL_PASSWORD=your-authorization-code  # 使用授权码，不是登录密码
MAIL_SERVER=smtp.qq.com
MAIL_PORT=587
```

**163 邮箱:**
```env
MAIL_USERNAME=your-email@163.com
MAIL_PASSWORD=your-authorization-code
MAIL_SERVER=smtp.163.com
MAIL_PORT=465
```

## 🧪 测试 API

### 1. 访问 API 文档

启动应用后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. 使用测试脚本

```bash
python3 test_api.py
```

### 3. 手动测试

**健康检查：**
```bash
curl http://localhost:8000/health
```

**发送验证码：**
```bash
curl -X POST http://localhost:8000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "type": "register"
  }'
```

**用户注册：**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "username": "测试用户",
    "password": "test123",
    "confirm_password": "test123"
  }'
```

**用户登录：**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "remember": false
  }'
```

## 📂 项目结构

```
backend/
├── app/
│   ├── api/v1/          # API 路由
│   │   └── auth.py      # 认证相关路由
│   ├── core/            # 核心配置
│   │   ├── config.py    # 应用配置
│   │   ├── database.py  # 数据库连接
│   │   └── redis.py     # Redis 连接
│   ├── models/          # 数据模型
│   │   └── user.py      # 用户模型
│   ├── schemas/         # Pydantic 模型
│   │   └── auth.py      # 认证相关模型
│   ├── services/        # 业务逻辑
│   │   ├── auth_service.py   # 认证服务
│   │   └── email_service.py  # 邮件服务
│   └── utils/           # 工具函数
│       ├── security.py       # JWT、密码加密
│       └── verification.py   # 验证码生成
├── main.py              # 应用入口
├── requirements.txt     # 依赖包
├── .env.example         # 环境变量示例
├── setup.sh             # 安装脚本
└── test_api.py          # 测试脚本
```

## 🔧 常见问题

### 1. 依赖安装失败

```bash
# 升级 pip
pip3 install --upgrade pip

# 使用国内镜像
pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 2. 数据库连接失败

- 检查 PostgreSQL 是否启动
- 检查 DATABASE_URL 配置是否正确
- 检查数据库是否已创建

```bash
# 创建数据库
psql -U postgres -c "CREATE DATABASE utils_web;"
```

### 3. Redis 连接失败

- 检查 Redis 是否启动
- 检查 REDIS_URL 配置是否正确

```bash
# 测试 Redis 连接
redis-cli ping
```

### 4. 邮件发送失败

- 检查邮箱配置是否正确
- 某些邮箱需要开启 SMTP 服务
- Gmail 需要开启两步验证并生成应用专用密码
- QQ/163 邮箱需要使用授权码而不是登录密码

### 5. 模块导入错误

确保在 backend 目录下运行：

```bash
cd backend
python3 main.py
```

或设置 PYTHONPATH：

```bash
export PYTHONPATH=/Users/wangshuo/Desktop/utils-web/backend:$PYTHONPATH
```

## 📚 开发文档

- [完整 API 文档](../AUTH_API_DOCS.md)
- [后端 README](README.md)

## 🎯 开发进度

- ✅ 阶段 1: 基础架构搭建
- ✅ 阶段 2: 数据库和工具类
- ✅ 阶段 3: 用户注册功能
- ✅ 阶段 4: 用户登录功能
- ⏳ 阶段 5: Token 管理
- ⏳ 阶段 6: 密码重置功能
- ⏳ 阶段 7: 安全和限流
- ⏳ 阶段 8: 测试和优化

## 📞 技术支持

如有问题，请查看：
1. API 文档: http://localhost:8000/docs
2. 项目 README
3. 错误日志

