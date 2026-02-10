from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth

# 创建数据库表
Base.metadata.create_all(bind=engine)

# Swagger 文档配置
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## 生活记录平台 API 文档

基于 FastAPI 的用户认证系统后端服务。

### 功能特性

* **用户注册** - 使用邮箱验证码注册新账户
* **用户登录** - 使用邮箱密码登录
* **验证码系统** - 发送邮箱验证码（注册/重置密码）
* **JWT 认证** - 基于 Token 的身份验证
* **密码加密** - Bcrypt 加密存储

### 技术栈

* FastAPI 0.109.0
* SQLAlchemy 2.0.25 + PostgreSQL
* Redis 5.0.1
* JWT (python-jose)
* Passlib (Bcrypt)

### 认证流程

#### 注册流程
1. 调用 `/api/auth/send-code` 发送验证码
2. 用户收到邮件验证码
3. 调用 `/api/auth/register` 完成注册
4. 返回 JWT Token 和用户信息

#### 登录流程
1. 调用 `/api/auth/login` 使用邮箱密码登录
2. 返回 JWT Token 和用户信息
3. 后续请求携带 Token 访问受保护的 API

### 安全说明

* 密码长度：6-20 位，必须包含字母和数字
* 验证码有效期：5 分钟
* 验证码频率限制：60 秒/次
* Access Token 有效期：1 小时
* Refresh Token 有效期：7 天（记住我）/ 1 天（不记住）

### 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 409 | 资源冲突（邮箱已注册） |
| 422 | 验证码错误或已过期 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

### 联系方式

* 项目地址: [GitHub](https://github.com/ws0424/life-record-platform)
* API 文档: [Swagger UI](/docs)
* ReDoc 文档: [ReDoc](/redoc)
    """,
    debug=settings.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {
            "name": "认证",
            "description": "用户认证相关接口，包括注册、登录、验证码等功能。",
        },
        {
            "name": "系统",
            "description": "系统相关接口，包括健康检查、API 信息等。",
        }
    ],
    contact={
        "name": "生活记录平台",
        "url": "https://github.com/ws0424/life-record-platform",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])


@app.get(
    "/",
    tags=["系统"],
    summary="API 信息",
    description="获取 API 基本信息，包括版本号和文档地址",
    response_description="返回 API 基本信息"
)
async def root():
    """
    ## API 根路径
    
    返回 API 的基本信息：
    - 欢迎消息
    - 版本号
    - 文档地址
    
    **示例响应：**
    ```json
    {
        "message": "欢迎使用生活记录平台 API",
        "version": "1.0.0",
        "docs": "/docs"
    }
    ```
    """
    return {
        "message": f"欢迎使用{settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get(
    "/health",
    tags=["系统"],
    summary="健康检查",
    description="检查 API 服务是否正常运行",
    response_description="返回服务健康状态"
)
async def health_check():
    """
    ## 健康检查端点
    
    用于监控和负载均衡器检查服务是否正常运行。
    
    **返回：**
    - `status`: 服务状态（healthy/unhealthy）
    
    **示例响应：**
    ```json
    {
        "status": "healthy"
    }
    ```
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

