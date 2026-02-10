# 用户认证 API 文档

## 概述

用户认证系统支持邮箱密码登录和邮箱验证码注册。

## 认证流程

### 登录流程
1. 用户输入邮箱和密码
2. 后端验证凭据
3. 返回 JWT Token（Access Token + Refresh Token）
4. 前端存储 Token 并跳转

### 注册流程
1. 用户输入邮箱
2. 发送验证码到邮箱
3. 用户输入验证码、密码、用户名
4. 后端验证验证码
5. 创建账户并返回 Token
6. 前端存储 Token 并跳转

## API 端点

### 1. 用户登录

**端点**: `POST /api/auth/login`

**描述**: 使用邮箱和密码登录

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember": true
}
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码（6-20位） |
| remember | boolean | 否 | 是否记住登录状态，默认 false |

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "username": "张三",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "created_at": "2026-02-10T10:00:00Z"
    }
  }
}
```

### 2. 发送注册验证码

**端点**: `POST /api/auth/send-code`

**描述**: 发送邮箱验证码用于注册

**请求体**:
```json
{
  "email": "newuser@example.com",
  "type": "register"
}
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| type | string | 是 | 验证码类型：register（注册）/ reset（重置密码） |

**响应示例**:

```json
{
  "code": 200,
  "message": "验证码已发送",
  "data": {
    "email": "newuser@example.com",
    "expires_in": 300,
    "sent_at": "2026-02-10T10:00:00Z"
  }
}
```

**限流规则**:
- 同一邮箱：60秒内只能发送1次
- 同一IP：1小时内最多发送10次

### 3. 用户注册

**端点**: `POST /api/auth/register`

**描述**: 使用邮箱验证码注册新账户

**请求体**:
```json
{
  "email": "newuser@example.com",
  "code": "123456",
  "username": "张三",
  "password": "password123",
  "confirm_password": "password123"
}
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| code | string | 是 | 6位数字验证码 |
| username | string | 是 | 用户名（2-20个字符） |
| password | string | 是 | 密码（6-20位，包含字母和数字） |
| confirm_password | string | 是 | 确认密码（必须与密码一致） |

**响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "username": "张三",
      "email": "newuser@example.com",
      "avatar": null,
      "created_at": "2026-02-10T10:00:00Z"
    }
  }
}
```

### 4. 刷新 Token

**端点**: `POST /api/auth/refresh`

**描述**: 使用 Refresh Token 刷新 Access Token

**请求头**:
```
Authorization: Bearer {refresh_token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "Token 刷新成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### 5. 用户登出

**端点**: `POST /api/auth/logout`

**描述**: 登出当前用户，使 Token 失效

**请求头**:
```
Authorization: Bearer {access_token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登出成功"
}
```

### 6. 获取当前用户信息

**端点**: `GET /api/auth/me`

**描述**: 获取当前登录用户的信息

**请求头**:
```
Authorization: Bearer {access_token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid",
    "username": "张三",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "这是我的个人简介",
    "created_at": "2026-02-10T10:00:00Z",
    "updated_at": "2026-02-10T10:00:00Z"
  }
}
```

### 7. 重置密码 - 发送验证码

**端点**: `POST /api/auth/send-code`

**描述**: 发送邮箱验证码用于重置密码

**请求体**:
```json
{
  "email": "user@example.com",
  "type": "reset"
}
```

### 8. 重置密码

**端点**: `POST /api/auth/reset-password`

**描述**: 使用验证码重置密码

**请求体**:
```json
{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "密码重置成功"
}
```

## 数据模型

### User (用户)

```typescript
interface User {
  id: string;              // UUID
  username: string;        // 用户名
  email: string;           // 邮箱
  avatar?: string;         // 头像URL
  bio?: string;            // 个人简介
  is_active: boolean;      // 是否激活
  is_verified: boolean;    // 是否验证邮箱
  created_at: string;      // 创建时间
  updated_at: string;      // 更新时间
}
```

### AuthResponse (认证响应)

```typescript
interface AuthResponse {
  access_token: string;    // 访问令牌
  refresh_token: string;   // 刷新令牌
  token_type: string;      // 令牌类型（Bearer）
  expires_in: number;      // 过期时间（秒）
  user: User;              // 用户信息
}
```

### VerificationCode (验证码)

```typescript
interface VerificationCode {
  email: string;           // 邮箱
  code: string;            // 6位数字验证码
  type: 'register' | 'reset';  // 类型
  expires_at: string;      // 过期时间
  created_at: string;      // 创建时间
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 403 | 禁止访问 |
| 404 | 用户不存在 |
| 409 | 邮箱已被注册 |
| 422 | 验证码错误或已过期 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

## 错误响应示例

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": {
    "email": ["邮箱格式不正确"],
    "password": ["密码长度必须在6-20位之间"]
  }
}
```

## Token 说明

### Access Token
- **用途**: 访问受保护的 API
- **有效期**: 1 小时
- **存储位置**: localStorage 或 sessionStorage
- **使用方式**: 请求头 `Authorization: Bearer {token}`

### Refresh Token
- **用途**: 刷新 Access Token
- **有效期**: 7 天（记住我）或 1 天（不记住）
- **存储位置**: httpOnly Cookie（推荐）或 localStorage
- **使用方式**: 调用刷新接口

## 安全策略

### 密码要求
- 长度：6-20 位
- 必须包含字母和数字
- 不能包含空格
- 不能与邮箱相同

### 验证码规则
- 格式：6 位数字
- 有效期：5 分钟
- 同一邮箱 60 秒内只能发送 1 次
- 验证失败 5 次后锁定 30 分钟

### Token 安全
- 使用 HTTPS 传输
- Access Token 短期有效
- Refresh Token 长期有效但存储在 httpOnly Cookie
- 支持 Token 黑名单（登出时加入）

### 防暴力破解
- 登录失败 5 次后锁定账户 30 分钟
- IP 限流：每分钟最多 10 次登录请求
- 验证码限流：每小时最多 10 次

## 邮件模板

### 注册验证码邮件

**主题**: 【生活记录平台】注册验证码

**内容**:
```
您好，

您正在注册生活记录平台账户，验证码为：

123456

验证码有效期为 5 分钟，请尽快完成注册。

如果这不是您的操作，请忽略此邮件。

---
生活记录平台
https://example.com
```

### 重置密码验证码邮件

**主题**: 【生活记录平台】重置密码验证码

**内容**:
```
您好，

您正在重置生活记录平台账户密码，验证码为：

123456

验证码有效期为 5 分钟，请尽快完成密码重置。

如果这不是您的操作，请立即修改密码并联系我们。

---
生活记录平台
https://example.com
```

## 实现建议

### 后端实现

1. **JWT Token 生成**
   ```python
   from jose import jwt
   from datetime import datetime, timedelta
   
   def create_access_token(user_id: str, expires_delta: timedelta = None):
       expire = datetime.utcnow() + (expires_delta or timedelta(hours=1))
       payload = {
           "sub": user_id,
           "exp": expire,
           "type": "access"
       }
       return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
   ```

2. **验证码生成和验证**
   ```python
   import random
   import redis
   
   def generate_code() -> str:
       return str(random.randint(100000, 999999))
   
   def save_code(email: str, code: str, type: str):
       key = f"verify_code:{type}:{email}"
       redis_client.setex(key, 300, code)  # 5分钟过期
   
   def verify_code(email: str, code: str, type: str) -> bool:
       key = f"verify_code:{type}:{email}"
       saved_code = redis_client.get(key)
       if saved_code and saved_code == code:
           redis_client.delete(key)
           return True
       return False
   ```

3. **邮件发送**
   ```python
   from fastapi_mail import FastMail, MessageSchema
   
   async def send_verification_email(email: str, code: str, type: str):
       subject = "【生活记录平台】注册验证码" if type == "register" else "【生活记录平台】重置密码验证码"
       body = f"您的验证码是：{code}，有效期5分钟。"
       
       message = MessageSchema(
           subject=subject,
           recipients=[email],
           body=body,
           subtype="html"
       )
       
       await fast_mail.send_message(message)
   ```

### 前端实现

1. **Token 存储**
   ```typescript
   // 存储 Token
   localStorage.setItem('access_token', token);
   
   // 获取 Token
   const token = localStorage.getItem('access_token');
   
   // 清除 Token
   localStorage.removeItem('access_token');
   ```

2. **API 请求拦截器**
   ```typescript
   axios.interceptors.request.use(config => {
     const token = localStorage.getItem('access_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Token 刷新**
   ```typescript
   axios.interceptors.response.use(
     response => response,
     async error => {
       if (error.response?.status === 401) {
         // Token 过期，尝试刷新
         const newToken = await refreshToken();
         if (newToken) {
           // 重试原请求
           error.config.headers.Authorization = `Bearer ${newToken}`;
           return axios.request(error.config);
         }
       }
       return Promise.reject(error);
     }
   );
   ```

## 测试用例

### 登录测试
- [ ] 正确的邮箱和密码可以登录
- [ ] 错误的密码无法登录
- [ ] 不存在的邮箱无法登录
- [ ] 记住我功能正常工作

### 注册测试
- [ ] 验证码发送成功
- [ ] 正确的验证码可以注册
- [ ] 错误的验证码无法注册
- [ ] 过期的验证码无法注册
- [ ] 已注册的邮箱无法重复注册
- [ ] 密码强度验证正常

### 安全测试
- [ ] Token 过期后无法访问
- [ ] 登出后 Token 失效
- [ ] 验证码限流正常
- [ ] 登录失败锁定正常

## 参考资料

- [JWT 官方文档](https://jwt.io/)
- [FastAPI 认证文档](https://fastapi.tiangolo.com/tutorial/security/)
- [OAuth 2.0 规范](https://oauth.net/2/)

