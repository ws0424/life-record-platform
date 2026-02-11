# MinIO 对象存储配置指南

本项目使用 MinIO 作为对象存储服务，用于存储用户上传的图片、视频等文件。

## 📦 安装 MinIO

### 使用 Docker（推荐）

```bash
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  -v /data/minio:/data \
  minio/minio server /data --console-address ":9001"
```

### 使用 Docker Compose

在 `docker-compose.yml` 中添加：

```yaml
services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - app-network

volumes:
  minio_data:
```

启动服务：

```bash
docker-compose up -d minio
```

## ⚙️ 配置说明

### 后端配置（backend/.env）

```env
# MinIO 配置
MINIO_ENDPOINT=localhost:9000          # MinIO 服务地址
MINIO_ACCESS_KEY=minioadmin            # 访问密钥
MINIO_SECRET_KEY=minioadmin123         # 密钥
MINIO_BUCKET=utils-web                 # 存储桶名称
MINIO_SECURE=false                     # 是否使用 HTTPS
MINIO_PUBLIC_URL=http://localhost:9000 # 公开访问地址
```

### 配置项说明

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `MINIO_ENDPOINT` | MinIO 服务地址（不含协议） | `localhost:9000` 或 `minio.example.com` |
| `MINIO_ACCESS_KEY` | 访问密钥（类似用户名） | `minioadmin` |
| `MINIO_SECRET_KEY` | 密钥（类似密码） | `minioadmin123` |
| `MINIO_BUCKET` | 存储桶名称 | `utils-web` |
| `MINIO_SECURE` | 是否使用 HTTPS | `false`（本地）/ `true`（生产） |
| `MINIO_PUBLIC_URL` | 公开访问地址（含协议） | `http://localhost:9000` 或 `https://cdn.example.com` |

## 🌐 不同环境配置

### 本地开发环境

```env
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=utils-web-dev
MINIO_SECURE=false
MINIO_PUBLIC_URL=http://localhost:9000
```

### 测试环境

```env
MINIO_ENDPOINT=minio-test.example.com
MINIO_ACCESS_KEY=test_access_key
MINIO_SECRET_KEY=test_secret_key
MINIO_BUCKET=utils-web-test
MINIO_SECURE=true
MINIO_PUBLIC_URL=https://cdn-test.example.com
```

### 生产环境

```env
MINIO_ENDPOINT=minio.example.com
MINIO_ACCESS_KEY=prod_access_key
MINIO_SECRET_KEY=prod_secret_key
MINIO_BUCKET=utils-web-prod
MINIO_SECURE=true
MINIO_PUBLIC_URL=https://cdn.example.com
```

## 🔧 初始化设置

### 1. 访问 MinIO 控制台

打开浏览器访问：`http://localhost:9001`

- 用户名：`minioadmin`
- 密码：`minioadmin123`

### 2. 创建存储桶

1. 登录后点击 "Buckets" → "Create Bucket"
2. 输入存储桶名称：`utils-web`
3. 点击 "Create Bucket"

### 3. 设置存储桶策略（公开访问）

如果需要公开访问上传的文件：

1. 进入存储桶 → "Access" → "Access Policy"
2. 选择 "Public" 或自定义策略
3. 保存设置

**自定义策略示例（只读）：**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::utils-web/*"]
    }
  ]
}
```

## 📁 文件存储结构

上传的文件按以下结构存储：

```
utils-web/
├── 2024/
│   ├── 02/
│   │   ├── 11/
│   │   │   ├── user-id-1/
│   │   │   │   ├── abc123.jpg
│   │   │   │   └── def456.png
│   │   │   └── user-id-2/
│   │   │       └── ghi789.jpg
│   │   └── 12/
│   └── 03/
└── chunks/  # 分片上传临时文件
    └── user-id/
        └── file-id/
            ├── chunk_0
            ├── chunk_1
            └── chunk_2
```

## 🔐 安全建议

### 生产环境

1. **修改默认密钥**
   ```env
   MINIO_ACCESS_KEY=your_secure_access_key
   MINIO_SECRET_KEY=your_secure_secret_key_at_least_32_chars
   ```

2. **启用 HTTPS**
   ```env
   MINIO_SECURE=true
   MINIO_PUBLIC_URL=https://cdn.example.com
   ```

3. **使用 CDN**
   - 配置 CloudFlare、阿里云 CDN 等
   - 将 `MINIO_PUBLIC_URL` 设置为 CDN 地址

4. **限制存储桶访问**
   - 不要设置为完全公开
   - 使用预签名 URL 控制访问

5. **定期备份**
   - 配置 MinIO 的备份策略
   - 使用 `mc mirror` 命令同步数据

## 🚀 使用示例

### 后端上传图片

```python
from app.services.upload_service import upload_service

# 上传单张图片
url = await upload_service.upload_image(file, user_id)

# 批量上传
urls = await upload_service.upload_images_batch(files, user_id)
```

### 前端上传图片

```typescript
import { uploadImage, uploadImages } from '@/lib/api/upload';

// 上传单张图片
const url = await uploadImage(file);

// 批量上传
const urls = await uploadImages(files);
```

## 🔍 故障排查

### 1. 连接失败

**错误**: `MinIO 初始化失败: connection refused`

**解决**:
- 检查 MinIO 服务是否启动：`docker ps | grep minio`
- 检查端口是否正确：`MINIO_ENDPOINT=localhost:9000`
- 检查防火墙设置

### 2. 认证失败

**错误**: `Access Denied`

**解决**:
- 检查 `MINIO_ACCESS_KEY` 和 `MINIO_SECRET_KEY` 是否正确
- 确认密钥没有多余的空格或换行

### 3. 存储桶不存在

**错误**: `Bucket does not exist`

**解决**:
- 后端会自动创建存储桶
- 手动创建：登录控制台 → Buckets → Create Bucket

### 4. 文件无法访问

**错误**: `403 Forbidden`

**解决**:
- 检查存储桶策略是否设置为公开
- 确认 `MINIO_PUBLIC_URL` 配置正确
- 检查文件路径是否正确

## 📊 监控和维护

### 查看存储使用情况

```bash
# 使用 mc 命令行工具
mc alias set myminio http://localhost:9000 minioadmin minioadmin123
mc du myminio/utils-web
```

### 清理过期文件

```bash
# 删除 30 天前的文件
mc rm --recursive --force --older-than 30d myminio/utils-web/chunks/
```

### 备份数据

```bash
# 同步到备份服务器
mc mirror myminio/utils-web backup-server/utils-web-backup
```

## 🔗 相关链接

- [MinIO 官方文档](https://min.io/docs/minio/linux/index.html)
- [MinIO Python SDK](https://min.io/docs/minio/linux/developers/python/minio-py.html)
- [MinIO Docker Hub](https://hub.docker.com/r/minio/minio)
- [MinIO 客户端工具 (mc)](https://min.io/docs/minio/linux/reference/minio-mc.html)

## 💡 最佳实践

1. **使用环境变量** - 不要在代码中硬编码配置
2. **分离环境** - 开发、测试、生产使用不同的存储桶
3. **启用版本控制** - 防止文件被意外覆盖
4. **设置生命周期策略** - 自动清理临时文件
5. **监控存储使用** - 避免存储空间不足
6. **定期备份** - 防止数据丢失
7. **使用 CDN** - 提升文件访问速度
8. **压缩图片** - 减少存储空间和带宽消耗
