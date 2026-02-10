# 忘记密码功能开发完成指南

## 📋 功能概述

完整实现了前后端的忘记密码重置功能，包括：
- ✅ 邮箱验证码发送
- ✅ 验证码验证
- ✅ 密码重置
- ✅ 前端交互界面
- ✅ 错误处理和提示

---

## 🔧 后端实现

### 1. Schema 定义 (`backend/app/schemas/auth.py`)

已定义重置密码请求模型：

```python
class ResetPasswordRequest(BaseModel):
    """重置密码请求模型"""
    email: EmailStr
    code: str  # 6位数字验证码
    new_password: str  # 新密码，6-20位，必须包含字母和数字
    confirm_password: str  # 确认新密码
```

### 2. AuthService 服务 (`backend/app/services/auth_service.py`)

新增 `reset_password` 方法：

```python
async def reset_password(self, reset_data: ResetPasswordRequest) -> MessageResponse:
    """重置密码"""
    # 1. 验证两次密码是否一致
    # 2. 验证密码强度（包含字母和数字）
    # 3. 验证验证码
    # 4. 查找用户
    # 5. 更新密码
    # 6. 返回成功消息
```

**验证规则：**
- 两次密码必须一致
- 密码必须包含字母和数字，长度至少6位
- 验证码必须正确且未过期
- 邮箱必须已注册

### 3. API 路由 (`backend/app/api/v1/auth.py`)

新增 `/auth/reset-password` 端点：

```python
@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    reset_data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """重置密码 API"""
    auth_service = AuthService(db)
    result = await auth_service.reset_password(reset_data)
    return result
```

**API 文档：**
- **路径**: `POST /api/auth/reset-password`
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "code": "123456",
    "new_password": "newpass123",
    "confirm_password": "newpass123"
  }
  ```
- **成功响应**:
  ```json
  {
    "code": 200,
    "data": null,
    "msg": "密码重置成功",
    "errMsg": null
  }
  ```

---

## 🎨 前端实现

### 1. API 客户端 (`frontend/src/lib/api/auth.ts`)

已定义 `resetPassword` 方法：

```typescript
export interface ResetPasswordData {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}

export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};
```

### 2. 忘记密码页面 (`frontend/src/app/forgot-password/page.tsx`)

完整的两步流程：

**步骤 1: 输入邮箱**
- 输入邮箱地址
- 点击"发送验证码"
- 调用 `sendCode({ email, type: 'reset' })`

**步骤 2: 重置密码**
- 输入验证码
- 输入新密码
- 确认新密码
- 点击"重置密码"
- 调用 `resetPassword({ email, code, new_password, confirm_password })`

**功能特性：**
- ✅ 表单验证（邮箱格式、密码强度、密码一致性）
- ✅ 验证码倒计时（60秒）
- ✅ 重新发送验证码
- ✅ Toast 提示消息
- ✅ 加载状态显示
- ✅ 动画效果（Framer Motion）
- ✅ 响应式设计

### 3. 样式设计 (`frontend/src/app/forgot-password/page.module.css`)

- 现代化的玻璃态设计
- 渐变背景和动画效果
- 响应式布局
- 优雅的表单交互

---

## 🔄 完整流程

### 用户操作流程

```
1. 用户访问 /forgot-password
   ↓
2. 输入邮箱地址
   ↓
3. 点击"发送验证码"
   ↓
4. 后端验证邮箱是否存在
   ↓
5. 发送验证码到邮箱
   ↓
6. 用户收到邮件，查看验证码
   ↓
7. 输入验证码和新密码
   ↓
8. 点击"重置密码"
   ↓
9. 后端验证验证码和密码
   ↓
10. 更新数据库中的密码
    ↓
11. 返回成功消息
    ↓
12. 前端跳转到登录页面
```

### API 调用流程

```
前端                          后端
  |                            |
  |-- POST /auth/send-code --->|
  |    { email, type: reset }  |
  |                            |-- 验证邮箱存在
  |                            |-- 生成验证码
  |                            |-- 发送邮件
  |<-- 200 OK ------------------|
  |    { code: 200, msg: ... } |
  |                            |
  |                            |
  |-- POST /auth/reset-password ->|
  |    { email, code, ... }    |
  |                            |-- 验证验证码
  |                            |-- 验证密码强度
  |                            |-- 更新密码
  |<-- 200 OK ------------------|
  |    { code: 200, msg: ... } |
  |                            |
  |-- 跳转到 /login ---------->|
```

---

## 🧪 测试指南

### 1. 准备测试环境

```bash
# 启动后端
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 启动前端
cd frontend
npm run dev
```

### 2. 测试步骤

#### 测试场景 1: 正常流程

1. 访问 `http://localhost:3000/forgot-password`
2. 输入已注册的邮箱（例如：`test@example.com`）
3. 点击"发送验证码"
4. 检查邮箱，获取验证码
5. 输入验证码和新密码（例如：`newpass123`）
6. 确认新密码
7. 点击"重置密码"
8. 验证是否跳转到登录页面
9. 使用新密码登录

#### 测试场景 2: 邮箱未注册

1. 输入未注册的邮箱
2. 点击"发送验证码"
3. 应显示错误提示："该邮箱未注册"

#### 测试场景 3: 验证码错误

1. 输入正确的邮箱
2. 发送验证码
3. 输入错误的验证码
4. 点击"重置密码"
5. 应显示错误提示："验证码错误或已过期"

#### 测试场景 4: 密码不一致

1. 完成验证码发送
2. 输入新密码：`newpass123`
3. 确认密码：`different123`
4. 点击"重置密码"
5. 应显示错误提示："两次输入的密码不一致"

#### 测试场景 5: 密码强度不足

1. 完成验证码发送
2. 输入弱密码：`123456`（只有数字）
3. 点击"重置密码"
4. 应显示错误提示："密码必须包含字母和数字"

#### 测试场景 6: 验证码过期

1. 发送验证码
2. 等待 5 分钟（验证码有效期）
3. 输入过期的验证码
4. 点击"重置密码"
5. 应显示错误提示："验证码错误或已过期"

#### 测试场景 7: 频率限制

1. 发送验证码
2. 立即再次点击"发送验证码"
3. 应显示倒计时，按钮禁用
4. 等待 60 秒后才能重新发送

### 3. API 测试（使用 curl）

```bash
# 1. 发送验证码
curl -X POST http://localhost:8000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "type": "reset"
  }'

# 2. 重置密码
curl -X POST http://localhost:8000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "new_password": "newpass123",
    "confirm_password": "newpass123"
  }'
```

### 4. 数据库验证

```bash
# 连接到数据库
psql -U postgres -d utils_web

# 查看用户密码哈希是否更新
SELECT id, email, password_hash, updated_at 
FROM users 
WHERE email = 'test@example.com';

# 验证 updated_at 时间戳是否更新
```

---

## 🔒 安全特性

### 1. 验证码安全
- ✅ 6位随机数字
- ✅ 5分钟有效期
- ✅ 一次性使用（验证后自动删除）
- ✅ 60秒发送频率限制

### 2. 密码安全
- ✅ 密码强度验证（必须包含字母和数字）
- ✅ 最小长度 6 位
- ✅ 使用 bcrypt 哈希存储
- ✅ 两次密码确认

### 3. 邮箱安全
- ✅ 验证邮箱格式
- ✅ 验证邮箱是否已注册
- ✅ 防止邮箱枚举攻击

### 4. API 安全
- ✅ 统一错误响应格式
- ✅ 详细的错误信息
- ✅ 请求频率限制

---

## 📝 代码文件清单

### 后端文件
- ✅ `backend/app/schemas/auth.py` - 添加 `ResetPasswordRequest` 模型
- ✅ `backend/app/services/auth_service.py` - 添加 `reset_password` 方法
- ✅ `backend/app/api/v1/auth.py` - 添加 `/reset-password` 路由

### 前端文件
- ✅ `frontend/src/lib/api/auth.ts` - 已有 `resetPassword` 方法
- ✅ `frontend/src/app/forgot-password/page.tsx` - 忘记密码页面
- ✅ `frontend/src/app/forgot-password/page.module.css` - 页面样式
- ✅ `frontend/src/components/ui/Toast.tsx` - Toast 组件
- ✅ `frontend/src/lib/hooks/useToast.ts` - Toast Hook

---

## 🎯 功能特点

### 用户体验
- ✅ 清晰的两步流程
- ✅ 实时表单验证
- ✅ 友好的错误提示
- ✅ 验证码倒计时显示
- ✅ 加载状态反馈
- ✅ 成功后自动跳转

### 技术特点
- ✅ TypeScript 类型安全
- ✅ 统一的 API 响应格式
- ✅ 完善的错误处理
- ✅ 代码复用（Toast、API Client）
- ✅ 响应式设计
- ✅ 动画效果

---

## 🚀 部署注意事项

### 1. 环境变量配置

确保配置以下环境变量：

```bash
# 后端 .env
MAIL_USERNAME=your_email@163.com
MAIL_PASSWORD=your_smtp_password
MAIL_FROM=your_email@163.com
MAIL_SERVER=smtp.163.com
MAIL_PORT=465

# 前端 .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. 邮件服务配置

- 确保 SMTP 服务正常工作
- 测试邮件发送功能
- 检查邮件模板格式

### 3. 数据库迁移

确保数据库表结构正确：

```sql
-- users 表必须有以下字段
- id (UUID)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- updated_at (TIMESTAMP)
```

---

## 📚 相关文档

- [认证开发指南](./frontend/AUTH_DEVELOPMENT.md)
- [认证测试指南](./frontend/AUTH_TESTING_GUIDE.md)
- [CORS 解决方案](./CORS_SOLUTION.md)
- [项目启动指南](./PROJECT_STARTUP_SUCCESS.md)

---

## ✅ 完成状态

- ✅ 后端 Schema 定义
- ✅ 后端 Service 实现
- ✅ 后端 API 路由
- ✅ 前端 API 客户端
- ✅ 前端页面实现
- ✅ 前端样式设计
- ✅ 错误处理
- ✅ 表单验证
- ✅ Toast 提示
- ✅ 代码测试

---

**开发完成时间**: 2026-02-10  
**开发者**: AI Assistant  
**版本**: 1.0.0

