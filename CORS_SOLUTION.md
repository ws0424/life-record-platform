# CORS 问题解决方案

## 问题描述

前端访问后端 API 时出现 CORS 错误：
```
Access to XMLHttpRequest at 'http://localhost:8000/api/auth/send-code' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

## 解决方案

### 方案一：开发环境 - Next.js 代理（已配置）✅

#### 1. 配置 Next.js 代理

**文件**: `frontend/next.config.js`

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
  ];
}
```

#### 2. 更新环境变量

**文件**: `frontend/.env.local`

```bash
# 使用相对路径，通过 Next.js 代理转发
NEXT_PUBLIC_API_URL=/api
```

#### 3. 更新后端 CORS 配置

**文件**: `backend/.env`

```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001
```

#### 4. 重启服务

```bash
# 重启前端
cd frontend
pkill -f "next dev"
npm run dev

# 重启后端
cd backend
pkill -f "python main.py"
source venv/bin/activate
python main.py
```

### 方案二：生产环境 - Nginx 反向代理

#### Nginx 配置示例

**文件**: `/etc/nginx/sites-available/your-app`

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS 头（如果后端没有设置）
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        # 处理 OPTIONS 请求
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

#### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 工作原理

### 开发环境（Next.js 代理）

```
浏览器 → http://localhost:3000/api/auth/login
         ↓ (Next.js rewrites)
         http://localhost:8000/api/auth/login
```

**优点**:
- ✅ 无 CORS 问题（同源请求）
- ✅ 配置简单
- ✅ 开发体验好

**缺点**:
- ❌ 仅适用于开发环境
- ❌ 需要重启前端服务

### 生产环境（Nginx 反向代理）

```
浏览器 → https://yourdomain.com/api/auth/login
         ↓ (Nginx proxy_pass)
         http://localhost:8000/api/auth/login
```

**优点**:
- ✅ 无 CORS 问题
- ✅ 统一域名
- ✅ 可以添加 SSL
- ✅ 负载均衡
- ✅ 缓存控制

## 配置对比

| 配置项 | 开发环境 | 生产环境 |
|--------|----------|----------|
| API URL | `/api` | `/api` |
| 代理方式 | Next.js rewrites | Nginx proxy_pass |
| CORS | 不需要 | 不需要 |
| SSL | 不需要 | 需要 |
| 域名 | localhost | yourdomain.com |

## 验证配置

### 1. 检查前端配置

```bash
cat frontend/.env.local
# 应该显示: NEXT_PUBLIC_API_URL=/api
```

### 2. 检查后端 CORS

```bash
cat backend/.env | grep CORS
# 应该包含: http://localhost:3000,http://localhost:3001
```

### 3. 测试 API 请求

打开浏览器控制台，访问注册页面：
```
http://localhost:3000/register
```

点击"发送验证码"，检查 Network 标签：
- Request URL 应该是: `http://localhost:3000/api/auth/send-code`
- 不应该有 CORS 错误

## 常见问题

### Q1: 配置后仍然有 CORS 错误？

**解决方案**:
1. 清除浏览器缓存
2. 重启前端服务
3. 检查 `.env.local` 是否正确
4. 检查 `next.config.js` 的 rewrites 配置

### Q2: API 请求 404？

**检查**:
1. 后端服务是否运行
2. API 路径是否正确
3. Next.js rewrites 配置是否正确

### Q3: 生产环境如何配置？

**步骤**:
1. 配置 Nginx 反向代理
2. 设置 SSL 证书
3. 更新前端环境变量: `NEXT_PUBLIC_API_URL=/api`
4. 构建前端: `npm run build`
5. 启动前端: `npm start`

## 部署检查清单

### 开发环境
- [x] Next.js rewrites 配置
- [x] 环境变量设置为 `/api`
- [x] 后端 CORS 包含开发端口
- [x] 服务已重启

### 生产环境
- [ ] Nginx 反向代理配置
- [ ] SSL 证书配置
- [ ] 环境变量设置为 `/api`
- [ ] 前端构建并部署
- [ ] 后端部署并运行
- [ ] 防火墙规则配置
- [ ] 域名 DNS 解析

## 相关文档

- [Next.js Rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites)
- [Nginx 反向代理](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [CORS 详解](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

---

**更新时间**: 2026-02-10  
**状态**: ✅ 已解决

