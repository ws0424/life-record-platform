# Docker 国内镜像源配置指南

## 📦 自动配置（推荐）

运行项目初始化脚本，会自动配置 Docker 镜像源：

```bash
cd backend
bash setup.sh
```

脚本会自动创建 `~/.docker/daemon.json` 配置文件。

## 🔧 手动配置

### macOS / Linux

1. **创建或编辑配置文件**

```bash
mkdir -p ~/.docker
nano ~/.docker/daemon.json
```

2. **添加以下内容**

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

3. **重启 Docker**

**macOS:**
- 重启 Docker Desktop 应用

**Linux:**
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### Windows

1. 打开 Docker Desktop
2. 点击右上角设置图标 ⚙️
3. 选择 "Docker Engine"
4. 在 JSON 配置中添加：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

5. 点击 "Apply & Restart"

## 🌐 可用的国内镜像源

### 推荐镜像源

| 镜像源 | 地址 | 说明 |
|--------|------|------|
| 中科大 | `https://docker.mirrors.ustc.edu.cn` | 稳定可靠 ⭐ |
| 网易 | `https://hub-mirror.c.163.com` | 速度快 ⭐ |
| 百度云 | `https://mirror.baidubce.com` | 国内大厂 |
| 阿里云 | `https://<your-id>.mirror.aliyuncs.com` | 需要注册获取专属地址 |

### 阿里云镜像加速器（推荐）

阿里云提供个人专属的镜像加速地址，速度更快：

1. 访问 [阿里云容器镜像服务](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
2. 登录后获取专属加速地址
3. 将地址添加到配置文件的第一位

```json
{
  "registry-mirrors": [
    "https://your-id.mirror.aliyuncs.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

## ✅ 验证配置

### 1. 检查配置是否生效

```bash
docker info | grep -A 5 "Registry Mirrors"
```

应该看到类似输出：

```
Registry Mirrors:
  https://docker.mirrors.ustc.edu.cn/
  https://hub-mirror.c.163.com/
  https://mirror.baidubce.com/
```

### 2. 测试拉取镜像

```bash
# 拉取一个小镜像测试速度
docker pull alpine:latest

# 拉取项目需要的镜像
docker pull postgres:15
docker pull redis:7
```

## 🚀 快速启动项目容器

配置好镜像源后，可以快速启动项目所需的服务：

### PostgreSQL

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=utils_web \
  -p 5432:5432 \
  postgres:15
```

### Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7
```

### 使用 Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres
    environment:
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: utils_web
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

启动所有服务：

```bash
docker-compose up -d
```

## 🔍 常见问题

### 1. 配置后仍然很慢？

- 尝试更换镜像源顺序
- 使用阿里云个人专属镜像加速器
- 检查网络连接

### 2. macOS 配置文件位置不对？

Docker Desktop for Mac 的配置在应用内部，建议通过 GUI 配置。

### 3. 镜像源不可用？

国内镜像源可能会变化，如果某个源不可用：
- 从配置中移除该源
- 尝试其他可用的镜像源
- 访问镜像源官网查看最新地址

### 4. 权限问题（Linux）

```bash
# 如果遇到权限问题，确保配置文件权限正确
sudo chown $USER:$USER ~/.docker/daemon.json
sudo chmod 644 ~/.docker/daemon.json
```

## 📊 性能对比

配置前后拉取镜像速度对比（以 postgres:15 为例）：

| 场景 | 下载速度 | 耗时 |
|------|----------|------|
| 未配置镜像源 | ~100 KB/s | 5-10 分钟 |
| 配置国内镜像源 | ~5 MB/s | 30-60 秒 |
| 阿里云专属加速 | ~10 MB/s | 15-30 秒 |

## 🔗 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [中科大镜像站](https://mirrors.ustc.edu.cn/help/dockerhub.html)
- [阿里云容器镜像服务](https://cr.console.aliyun.com/)
- [网易云镜像中心](https://c.163yun.com/hub)

## 💡 最佳实践

1. **优先使用阿里云个人专属镜像加速器**
2. **配置多个镜像源作为备份**
3. **定期检查镜像源可用性**
4. **使用 Docker Compose 管理多个容器**
5. **配置后记得重启 Docker 服务**

---

**最后更新**: 2026-02-10  
**适用版本**: Docker 20.10+

