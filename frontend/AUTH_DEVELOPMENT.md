# 前端认证功能开发文档

**开发时间**: 2026-02-10  
**功能模块**: 用户注册、登录、忘记密码

---

## 📋 功能概述

已完成前端与后端 API 的完整对接，实现以下功能：

### ✅ 已实现功能

1. **用户注册**
   - 邮箱验证码发送
   - 表单验证（邮箱、用户名、密码）
   - 密码强度检查
   - 自动登录并跳转

2. **用户登录**
   - 邮箱密码登录
   - 记住我功能
   - Token 自动保存
   - 登录成功跳转

3. **忘记密码**
   - 邮箱验证码发送
   - 密码重置
   - 两步验证流程

4. **通用功能**
   - Toast 消息提示
   - 统一错误处理
   - Token 自动刷新
   - 响应拦截器

---

## 🏗️ 技术架构

### 目录结构

```
frontend/src/
├── app/
│   ├── login/                    # 登录页面
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── register/                 # 注册页面
│   │   ├── page.tsx
│   │   └── page.module.css
│   └── forgot-password/          # 忘记密码页面
│       ├── page.tsx
│       └── page.module.css
├── components/
│   └── ui/
│       ├── Toast.tsx             # Toast 提示组件
│       └── Toast.module.css
├── lib/
│   ├── api/
│   │   ├── client.ts             # API 客户端（Axios 配置）
│   │   └── auth.ts               # 认证 API 接口
│   ├── store/
│   │   └── authStore.ts          # 认证状态管理（Zustand）
│   └── hooks/
│       └── useToast.ts           # Toast Hook
└── .env.local                    # 环境变量配置
```

---

## 🔌 API 接口对接

### 后端 API 地址

```
BASE_URL: http://localhost:8000/api
```

### 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 发送验证码 | POST | `/auth/send-code` | 发送邮箱验证码 |
| 用户注册 | POST | `/auth/register` | 注册新用户 |
| 用户登录 | POST | `/auth/login` | 用户登录 |
| 用户登出 | POST | `/auth/logout` | 用户登出 |
| 获取用户信息 | GET | `/auth/me` | 获取当前用户 |
| 重置密码 | POST | `/auth/reset-password` | 重置密码 |

### 统一响应格式

后端返回统一格式：

```typescript
{
  code: number;        // 业务状态码（200 成功）
  data: any;          // 响应数据
  msg: string;        // 响应消息
  errMsg: string | null;  // 错误详情
}
```

---

## 📝 核心代码说明

### 1. API Client 配置

**文件**: `src/lib/api/client.ts`

```typescript
// 特点：
// - 自动添加 Authorization 头
// - 统一处理后端响应格式
// - 自动 Token 刷新
// - 错误信息提取
```

**关键功能**:
- ✅ 请求拦截器：自动添加 Token
- ✅ 响应拦截器：处理统一格式，提取错误信息
- ✅ Token 刷新：401 错误自动刷新 Token
- ✅ 错误处理：统一错误消息格式

### 2. 认证 API

**文件**: `src/lib/api/auth.ts`

```typescript
// 提供的方法：
// - sendCode()        发送验证码
// - register()        用户注册
// - login()           用户登录
// - logout()          用户登出
// - getCurrentUser()  获取用户信息
// - resetPassword()   重置密码
```

### 3. 状态管理

**文件**: `src/lib/store/authStore.ts`

使用 Zustand 管理认证状态：

```typescript
interface AuthState {
  user: User | null;           // 用户信息
  token: string | null;        // Access Token
  isAuthenticated: boolean;    // 是否已登录
  setAuth()                    // 设置认证信息
  setUser()                    // 设置用户信息
  logout()                     // 登出
}
```

### 4. Toast 提示

**文件**: `src/components/ui/Toast.tsx`

提供 4 种类型的提示：
- ✅ Success（成功）
- ❌ Error（错误）
- ⚠️ Warning（警告）
- ℹ️ Info（信息）

**使用方法**:

```typescript
const { success, error, warning, info } = useToast();

success('操作成功！');
error('操作失败！');
```

---

## 🎯 使用示例

### 登录示例

```typescript
import * as authApi from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

const { setAuth } = useAuthStore();

const handleLogin = async () => {
  try {
    const response = await authApi.login({
      email: 'user@example.com',
      password: 'password123',
      remember: true,
    });
    
    // 保存 Token 和用户信息
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    setAuth(response.user, response.access_token);
    
    // 跳转到首页
    router.push('/');
  } catch (err) {
    console.error(err.message);
  }
};
```

### 注册示例

```typescript
const handleRegister = async () => {
  try {
    // 1. 发送验证码
    await authApi.sendCode({
      email: 'user@example.com',
      type: 'register',
    });
    
    // 2. 注册
    const response = await authApi.register({
      email: 'user@example.com',
      code: '123456',
      username: '张三',
      password: 'password123',
      confirm_password: 'password123',
    });
    
    // 保存认证信息
    setAuth(response.user, response.access_token);
  } catch (err) {
    console.error(err.message);
  }
};
```

### 重置密码示例

```typescript
const handleResetPassword = async () => {
  try {
    // 1. 发送验证码
    await authApi.sendCode({
      email: 'user@example.com',
      type: 'reset',
    });
    
    // 2. 重置密码
    await authApi.resetPassword({
      email: 'user@example.com',
      code: '123456',
      new_password: 'newpassword123',
      confirm_password: 'newpassword123',
    });
    
    // 跳转到登录页
    router.push('/login');
  } catch (err) {
    console.error(err.message);
  }
};
```

---

## 🔒 安全特性

### 1. 密码验证规则

- ✅ 长度：6-20 位
- ✅ 必须包含字母和数字
- ✅ 前端和后端双重验证

### 2. Token 管理

- ✅ Access Token：存储在 localStorage
- ✅ Refresh Token：存储在 localStorage
- ✅ 自动刷新：401 错误时自动刷新
- ✅ 安全登出：清除所有 Token

### 3. 验证码机制

- ✅ 有效期：5 分钟
- ✅ 频率限制：60 秒/次
- ✅ 一次性使用：验证后自动删除

### 4. 请求安全

- ✅ HTTPS 传输（生产环境）
- ✅ Authorization 头自动添加
- ✅ CORS 配置正确

---

## 🧪 测试流程

### 1. 注册流程测试

```bash
# 步骤：
1. 访问 http://localhost:3001/register
2. 输入邮箱：test@example.com
3. 点击"发送验证码"
4. 检查邮箱收到验证码
5. 填写完整信息并提交
6. 验证是否自动登录并跳转
```

### 2. 登录流程测试

```bash
# 步骤：
1. 访问 http://localhost:3001/login
2. 输入邮箱和密码
3. 勾选"记住我"（可选）
4. 点击"登录"
5. 验证是否跳转到首页
```

### 3. 忘记密码测试

```bash
# 步骤：
1. 访问 http://localhost:3001/forgot-password
2. 输入邮箱
3. 点击"发送验证码"
4. 输入验证码和新密码
5. 点击"重置密码"
6. 验证是否跳转到登录页
```

---

## 🐛 常见问题

### Q1: API 请求失败？

**检查步骤**:
1. 确认后端服务运行在 8000 端口
2. 检查 `.env.local` 配置是否正确
3. 查看浏览器控制台网络请求
4. 检查 CORS 配置

**解决方案**:
```bash
# 检查后端服务
curl http://localhost:8000/health

# 检查环境变量
cat frontend/.env.local
```

### Q2: 验证码发送失败？

**可能原因**:
1. 邮件服务配置错误
2. 邮箱不存在（重置密码）
3. 邮箱已注册（注册）
4. 频率限制（60秒内重复发送）

**解决方案**:
- 检查后端 `.env` 中的邮件配置
- 查看后端日志：`tail -f backend/backend.log`

### Q3: Token 过期怎么办？

**自动处理**:
- API Client 会自动刷新 Token
- 刷新失败会自动跳转到登录页

**手动处理**:
```typescript
// 手动登出
const { logout } = useAuthStore();
logout();
```

### Q4: 跨域问题？

**后端已配置 CORS**:
```python
# backend/app/core/config.py
CORS_ORIGINS = "http://localhost:3000,http://localhost:3001"
```

如果端口不同，需要修改后端配置。

---

## 📊 状态码说明

| 状态码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | 正常处理 |
| 400 | 请求参数错误 | 显示错误信息 |
| 401 | 未授权 | 自动刷新 Token 或跳转登录 |
| 403 | 禁止访问 | 显示错误信息 |
| 404 | 资源不存在 | 显示错误信息 |
| 409 | 资源冲突（邮箱已注册） | 显示错误信息 |
| 422 | 验证码错误 | 显示错误信息 |
| 429 | 请求过于频繁 | 显示错误信息 |
| 500 | 服务器错误 | 显示错误信息 |

---

## 🚀 部署注意事项

### 环境变量配置

**开发环境** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**生产环境** (`.env.production`):
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 安全配置

1. **更换 JWT 密钥**
   ```bash
   # backend/.env
   SECRET_KEY=your-production-secret-key
   ```

2. **启用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 配置 SSL 证书

3. **更新 CORS 配置**
   ```bash
   # backend/.env
   CORS_ORIGINS=https://yourdomain.com
   ```

---

## 📚 相关文档

- [后端 API 文档](http://localhost:8000/docs)
- [后端代码检查报告](../backend/BACKEND_CODE_REVIEW.md)
- [项目启动文档](../PROJECT_STARTUP_SUCCESS.md)
- [本地开发指南](../LOCAL_DEVELOPMENT.md)

---

## ✅ 开发清单

- [x] 更新 API Client 配置
- [x] 完善 auth.ts API 接口
- [x] 更新登录页面
- [x] 更新注册页面
- [x] 创建忘记密码页面
- [x] 更新 authStore
- [x] 添加 Toast 提示组件
- [x] 创建环境变量配置
- [x] 编写开发文档

---

## 🎉 下一步

1. **测试完整流程**
   - 注册新用户
   - 登录测试
   - 忘记密码测试

2. **完善用户体验**
   - 添加加载动画
   - 优化错误提示
   - 添加表单验证提示

3. **扩展功能**
   - 个人资料编辑
   - 头像上传
   - 修改密码
   - 账户设置

---

**开发完成时间**: 2026-02-10  
**开发者**: AI Assistant  
**状态**: ✅ 已完成

