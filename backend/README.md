# 生活记录平台 - 后端 API

基于 FastAPI 的用户认证系统后端服务。

## 功能特性

- ✅ 用户注册（邮箱验证码）
- ✅ 用户登录（邮箱密码）
- ✅ JWT Token 认证
- ✅ 邮件验证码发送
- ✅ 密码加密存储
- ✅ Redis 缓存
- ✅ PostgreSQL 数据库

## 技术栈

- **框架**: FastAPI 0.109.0
- **数据库**: PostgreSQL + SQLAlchemy
- **缓存**: Redis
- **认证**: JWT (python-jose)
- **密码加密**: Passlib + Bcrypt
- **邮件服务**: FastAPI-Mail

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库、Redis、邮件服务等：

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/utils_web
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
```

### 3. 启动数据库和 Redis

```bash
# 使用 Docker 启动 PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=utils_web \
  -p 5432:5432 \
  postgres:15

# 使用 Docker 启动 Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7
```

### 4. 运行应用

```bash
python main.py
```

或使用 uvicorn：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. 访问 API 文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 端点

### 认证相关

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/auth/send-code` | 发送验证码 |
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/me` | 获取当前用户信息 |

详细 API 文档请参考 [AUTH_API_DOCS.md](../AUTH_API_DOCS.md)

## 项目结构

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── auth.py          # 认证路由
│   ├── core/
│   │   ├── config.py            # 配置管理
│   │   ├── database.py          # 数据库连接
│   │   └── redis.py             # Redis 连接
│   ├── models/
│   │   └── user.py              # 用户模型
│   ├── schemas/
│   │   └── auth.py              # Pydantic 模型
│   ├── services/
│   │   ├── auth_service.py      # 认证服务
│   │   └── email_service.py     # 邮件服务
│   └── utils/
│       ├── security.py          # 安全工具（JWT、密码）
│       └── verification.py      # 验证码工具
├── main.py                      # 应用入口
├── requirements.txt             # 依赖包
└── .env.example                 # 环境变量示例

## 开发说明

### 数据库迁移

使用 Alembic 进行数据库迁移：

```bash
# 初始化迁移
alembic init alembic

# 创建迁移
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

### 测试

```bash
# 安装测试依赖
pip install -r requirements-dev.txt

# 运行测试
pytest
```

## 安全配置

### 密码要求
- 长度：6-20 位
- 必须包含字母和数字

### 验证码规则
- 格式：6 位数字
- 有效期：5 分钟
- 频率限制：60 秒/次

### Token 配置
- Access Token：1 小时
- Refresh Token：7 天（记住我）/ 1 天（不记住）

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | PostgreSQL 连接字符串 | - |
| REDIS_URL | Redis 连接字符串 | - |
| SECRET_KEY | JWT 密钥 | - |
| MAIL_USERNAME | 邮箱账号 | - |
| MAIL_PASSWORD | 邮箱密码 | - |
| MAIL_SERVER | SMTP 服务器 | - |
| MAIL_PORT | SMTP 端口 | 587 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access Token 过期时间（分钟） | 60 |
| REFRESH_TOKEN_EXPIRE_DAYS | Refresh Token 过期时间（天） | 7 |

## 常见问题

### 1. 数据库连接失败

检查 PostgreSQL 是否启动，以及 `DATABASE_URL` 配置是否正确。

### 2. Redis 连接失败

检查 Redis 是否启动，以及 `REDIS_URL` 配置是否正确。

### 3. 邮件发送失败

检查邮箱配置是否正确，某些邮箱需要开启 SMTP 服务并使用授权码。

### 4. Token 验证失败

检查 `SECRET_KEY` 是否配置，以及 Token 是否过期。

## 许可证

MIT License

