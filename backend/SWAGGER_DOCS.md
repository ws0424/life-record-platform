# Swagger API 文档说明

## 📚 访问文档

启动后端服务后，可以通过以下地址访问 API 文档：

### Swagger UI（推荐）
- **地址**: http://localhost:8000/docs
- **特点**: 交互式文档，可以直接测试 API
- **功能**: 
  - 查看所有 API 端点
  - 查看请求/响应模型
  - 在线测试 API
  - 查看示例数据

### ReDoc
- **地址**: http://localhost:8000/redoc
- **特点**: 更美观的文档展示
- **功能**:
  - 清晰的文档结构
  - 详细的模型说明
  - 代码示例

### OpenAPI JSON
- **地址**: http://localhost:8000/openapi.json
- **用途**: 导出 OpenAPI 规范文件

## 🎯 文档特性

### 1. 完整的 API 描述
每个 API 端点都包含：
- ✅ 功能说明
- ✅ 请求参数详解
- ✅ 响应格式说明
- ✅ 错误码说明
- ✅ 使用示例
- ✅ 注意事项

### 2. 详细的数据模型
所有数据模型都包含：
- ✅ 字段说明
- ✅ 数据类型
- ✅ 验证规则
- ✅ 示例数据
- ✅ 必填/可选标识

### 3. 交互式测试
在 Swagger UI 中可以：
- ✅ 直接发送请求
- ✅ 查看实时响应
- ✅ 测试不同参数
- ✅ 验证错误处理

## 📖 API 端点列表

### 系统相关
| 端点 | 方法 | 说明 |
|------|------|------|
| `/` | GET | API 信息 |
| `/health` | GET | 健康检查 |

### 认证相关
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/auth/send-code` | POST | 发送验证码 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户 |

## 🔧 使用 Swagger UI 测试

### 1. 发送验证码

1. 展开 `POST /api/auth/send-code`
2. 点击 "Try it out"
3. 填写请求参数：
   ```json
   {
     "email": "test@example.com",
     "type": "register"
   }
   ```
4. 点击 "Execute"
5. 查看响应结果

### 2. 用户注册

1. 展开 `POST /api/auth/register`
2. 点击 "Try it out"
3. 填写请求参数：
   ```json
   {
     "email": "test@example.com",
     "code": "123456",
     "username": "测试用户",
     "password": "test123",
     "confirm_password": "test123"
   }
   ```
4. 点击 "Execute"
5. 复制返回的 `access_token`

### 3. 用户登录

1. 展开 `POST /api/auth/login`
2. 点击 "Try it out"
3. 填写请求参数：
   ```json
   {
     "email": "test@example.com",
     "password": "test123",
     "remember": false
   }
   ```
4. 点击 "Execute"
5. 查看返回的 Token 和用户信息

### 4. 使用 Token 访问受保护的 API

1. 点击页面右上角的 "Authorize" 按钮
2. 在弹出框中输入：`Bearer {your_access_token}`
3. 点击 "Authorize"
4. 现在可以访问需要认证的 API 了

## 📝 数据模型说明

### UserCreate（用户注册）
```json
{
  "email": "user@example.com",        // 邮箱地址（必填）
  "code": "123456",                   // 6位数字验证码（必填）
  "username": "张三",                  // 用户名，2-20个字符（必填）
  "password": "test123",              // 密码，6-20位，字母+数字（必填）
  "confirm_password": "test123"       // 确认密码（必填）
}
```

### UserLogin（用户登录）
```json
{
  "email": "user@example.com",        // 邮箱地址（必填）
  "password": "test123",              // 密码（必填）
  "remember": false                   // 是否记住登录（可选）
}
```

### TokenResponse（Token 响应）
```json
{
  "access_token": "eyJhbGc...",       // 访问令牌，有效期1小时
  "refresh_token": "eyJhbGc...",      // 刷新令牌
  "token_type": "Bearer",             // 令牌类型
  "expires_in": 3600,                 // 过期时间（秒）
  "user": {                           // 用户信息
    "id": "uuid",
    "username": "张三",
    "email": "user@example.com",
    "avatar": null,
    "bio": null,
    "is_active": true,
    "is_verified": true,
    "created_at": "2026-02-10T10:00:00Z",
    "updated_at": "2026-02-10T10:00:00Z"
  }
}
```

## 🔐 认证说明

### Token 使用方式

**方式 1: 在 Swagger UI 中使用**
1. 点击右上角 "Authorize" 按钮
2. 输入：`Bearer {access_token}`
3. 点击 "Authorize"

**方式 2: 在请求头中使用**
```
Authorization: Bearer {access_token}
```

**方式 3: 使用 curl**
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {access_token}"
```

### Token 有效期
- **Access Token**: 1 小时
- **Refresh Token**: 7 天（记住我）/ 1 天（不记住）

## ⚠️ 错误码说明

| 错误码 | 说明 | 示例 |
|--------|------|------|
| 200 | 成功 | 请求成功 |
| 201 | 创建成功 | 注册成功 |
| 400 | 请求参数错误 | 密码格式不正确 |
| 401 | 未授权 | Token 无效或过期 |
| 403 | 禁止访问 | 账户已被禁用 |
| 404 | 资源不存在 | 用户不存在 |
| 409 | 资源冲突 | 邮箱已被注册 |
| 422 | 验证失败 | 验证码错误或已过期 |
| 429 | 请求过于频繁 | 验证码发送过于频繁 |
| 500 | 服务器错误 | 内部错误 |
| 501 | 功能未实现 | 功能开发中 |

## 📚 示例场景

### 场景 1: 完整的注册流程

1. **发送验证码**
   ```bash
   POST /api/auth/send-code
   {
     "email": "newuser@example.com",
     "type": "register"
   }
   ```

2. **用户注册**
   ```bash
   POST /api/auth/register
   {
     "email": "newuser@example.com",
     "code": "123456",
     "username": "新用户",
     "password": "pass123",
     "confirm_password": "pass123"
   }
   ```

3. **获取用户信息**
   ```bash
   GET /api/auth/me
   Authorization: Bearer {access_token}
   ```

### 场景 2: 登录流程

1. **用户登录**
   ```bash
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "test123",
     "remember": true
   }
   ```

2. **访问受保护的 API**
   ```bash
   GET /api/auth/me
   Authorization: Bearer {access_token}
   ```

3. **用户登出**
   ```bash
   POST /api/auth/logout
   Authorization: Bearer {access_token}
   ```

## 🎨 文档定制

### 修改文档标题和描述
编辑 `backend/main.py`：
```python
app = FastAPI(
    title="你的应用名称",
    version="1.0.0",
    description="你的应用描述",
    # ...
)
```

### 添加新的标签
```python
openapi_tags=[
    {
        "name": "标签名称",
        "description": "标签描述",
    }
]
```

### 自定义 API 端点文档
```python
@router.post(
    "/endpoint",
    summary="简短说明",
    description="详细说明",
    response_description="响应说明",
    responses={
        200: {"description": "成功"},
        400: {"description": "错误"}
    }
)
```

## 🔗 相关资源

- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [ReDoc](https://github.com/Redocly/redoc)

## 💡 提示

1. **开发环境**: 使用 Swagger UI 快速测试 API
2. **生产环境**: 可以通过配置禁用文档（设置 `docs_url=None`）
3. **导出文档**: 访问 `/openapi.json` 导出 OpenAPI 规范
4. **分享文档**: 可以将 OpenAPI JSON 导入到 Postman 等工具

## 🎉 总结

Swagger 文档已完全集成，包括：
- ✅ 详细的 API 说明
- ✅ 完整的数据模型
- ✅ 交互式测试功能
- ✅ 错误码说明
- ✅ 使用示例
- ✅ 认证说明

立即访问 http://localhost:8000/docs 开始使用！

