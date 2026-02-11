# 401 错误处理修复总结

## 问题描述

1. **接口返回 code: 401 时没有退出账号** - 用户仍然可以看到 dashboard 页面
2. **axios 拦截器未正确处理业务状态码 401** - 只处理了 HTTP 状态码 401
3. **首页不应该跳转到登录页** - 401 错误在首页时应该保持在首页

## 修复内容

### 1. 修复 axios 拦截器 (`frontend/src/lib/api/client.ts`)

#### 修复点 1: 处理业务状态码 401

```typescript
// ✅ 新增：在响应拦截器中处理业务状态码 401
if (apiResponse.code === 401) {
  handleUnauthorized();
  const error: any = new Error(apiResponse.errMsg || apiResponse.msg || '未授权，请重新登录');
  error.code = apiResponse.code;
  error.response = response;
  return Promise.reject(error);
}
```

#### 修复点 2: 统一的未授权处理函数

```typescript
/**
 * 处理未授权错误
 * - 清除本地存储的 token
 * - 如果不在首页，跳转到登录页
 */
function handleUnauthorized() {
  if (typeof window === 'undefined') return;

  // 清除 token
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // 获取当前路径
  const currentPath = window.location.pathname;

  // 如果在首页或登录页，不跳转
  if (currentPath === '/' || currentPath === '/login') {
    return;
  }

  // 跳转到登录页，并保存当前路径用于登录后跳转
  const redirectUrl = encodeURIComponent(currentPath);
  window.location.href = `/login?redirect=${redirectUrl}`;
}
```

#### 修复点 3: HTTP 401 错误处理优化

```typescript
// ✅ 优化：没有 refresh_token 时直接退出
const refreshToken = localStorage.getItem('refresh_token');
if (!refreshToken) {
  // 没有 refresh_token，直接退出登录
  handleUnauthorized();
  return Promise.reject(new Error('未授权，请重新登录'));
}

// ✅ 优化：刷新失败时调用统一处理函数
catch (refreshError) {
  // 刷新失败，清除 token 并跳转到登录页
  handleUnauthorized();
  return Promise.reject(refreshError);
}
```

### 2. 创建路由保护组件 (`frontend/src/components/auth/ProtectedRoute.tsx`)

```typescript
/**
 * 路由保护组件
 * 用于保护需要登录才能访问的页面
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    // 等待初始化完成
    if (!isInitialized) {
      return;
    }

    // 如果未认证，跳转到登录页
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = encodeURIComponent(currentPath);
      router.replace(`/login?redirect=${redirectUrl}`);
    }
  }, [isAuthenticated, isInitialized, router]);

  // 未初始化或未认证时，显示加载状态
  if (!isInitialized || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
```

### 3. 更新 Dashboard 页面 (`frontend/src/app/dashboard/page.tsx`)

```typescript
// ✅ 使用路由保护组件包裹
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### 4. 更新登录页面 (`frontend/src/app/login/page.tsx`)

```typescript
// ✅ 支持 redirect 参数
const searchParams = new URLSearchParams(window.location.search);
const redirect = searchParams.get('redirect') || '/dashboard';

// 延迟跳转，让用户看到成功提示
setTimeout(() => {
  router.push(redirect);
}, 1000);
```

## 修复后的流程

### 场景 1: Dashboard 页面收到 401 错误

```
1. 用户在 /dashboard 页面
2. 接口返回 { code: 401, msg: "未授权" }
3. axios 拦截器捕获 code === 401
4. 调用 handleUnauthorized()
   - 清除 access_token 和 refresh_token
   - 检查当前路径 = /dashboard (不是首页)
   - 跳转到 /login?redirect=%2Fdashboard
5. 用户被重定向到登录页
6. 登录成功后跳转回 /dashboard
```

### 场景 2: 首页收到 401 错误

```
1. 用户在 / 首页
2. 接口返回 { code: 401, msg: "未授权" }
3. axios 拦截器捕获 code === 401
4. 调用 handleUnauthorized()
   - 清除 access_token 和 refresh_token
   - 检查当前路径 = / (是首页)
   - 不跳转，保持在首页
5. 用户继续浏览首页（公开内容）
```

### 场景 3: HTTP 401 错误（token 过期）

```
1. 用户在 /dashboard 页面
2. 接口返回 HTTP 401 状态码
3. axios 拦截器尝试刷新 token
   - 如果有 refresh_token：尝试刷新
     - 刷新成功：重新发送原始请求
     - 刷新失败：调用 handleUnauthorized()
   - 如果没有 refresh_token：直接调用 handleUnauthorized()
4. 用户被重定向到登录页
```

## 测试检查清单

### ✅ 业务状态码 401 测试

- [ ] Dashboard 页面接口返回 `{ code: 401 }` 时，自动退出并跳转到登录页
- [ ] 首页接口返回 `{ code: 401 }` 时，清除 token 但不跳转
- [ ] 登录页接口返回 `{ code: 401 }` 时，不跳转

### ✅ HTTP 状态码 401 测试

- [ ] Token 过期时，自动尝试刷新 token
- [ ] 刷新 token 成功后，重新发送原始请求
- [ ] 刷新 token 失败后，退出并跳转到登录页
- [ ] 没有 refresh_token 时，直接退出并跳转到登录页

### ✅ 路由保护测试

- [ ] 未登录访问 /dashboard，自动跳转到 /login?redirect=%2Fdashboard
- [ ] 登录成功后，自动跳转回原页面
- [ ] 已登录访问 /dashboard，正常显示页面
- [ ] 未登录访问首页，正常显示页面

### ✅ 边界情况测试

- [ ] 在首页点击需要登录的功能，跳转到登录页
- [ ] 登录后刷新页面，保持登录状态
- [ ] 清除 localStorage 后刷新页面，跳转到登录页
- [ ] 多个标签页同时退出登录

## 相关文件

- `frontend/src/lib/api/client.ts` - axios 拦截器
- `frontend/src/components/auth/ProtectedRoute.tsx` - 路由保护组件
- `frontend/src/app/dashboard/page.tsx` - Dashboard 页面
- `frontend/src/app/login/page.tsx` - 登录页面
- `frontend/src/lib/store/authStore.ts` - 认证状态管理
- `frontend/src/components/auth/TokenVerifier.tsx` - Token 验证组件

## 注意事项

1. **清除 token 的时机**
   - 业务状态码 401：立即清除
   - HTTP 状态码 401：尝试刷新后再清除
   - 刷新 token 失败：立即清除

2. **跳转逻辑**
   - 首页（/）：不跳转
   - 登录页（/login）：不跳转
   - 其他页面：跳转到登录页并保存 redirect 参数

3. **用户体验**
   - 显示加载状态，避免闪烁
   - 显示错误提示，告知用户原因
   - 登录后自动跳转回原页面

4. **安全性**
   - 清除所有 token（access_token 和 refresh_token）
   - 清除 Zustand 状态
   - 使用 router.replace 避免返回到受保护页面

## 后续优化建议

1. **添加全局错误处理**
   - 统一的错误提示组件
   - 错误日志上报

2. **优化用户体验**
   - 添加"会话已过期"提示
   - 支持"记住我"功能延长会话时间

3. **安全增强**
   - 添加 CSRF 保护
   - 实现设备指纹识别
   - 添加异常登录检测

4. **性能优化**
   - 减少不必要的 token 验证请求
   - 使用 token 过期时间判断是否需要刷新

