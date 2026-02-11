# 视频上传和大文件切片上传功能文档

## 📋 功能概述

本项目实现了完整的视频上传和大文件切片上传功能，支持多个视频上传、断点续传、实时进度显示等特性。

## 🎯 功能特性

### 前端功能

#### 1. 大文件切片上传
- **切片大小**: 5MB/片
- **断点续传**: 支持上传中断后继续
- **进度回调**: 实时显示上传进度
- **文件标识**: 使用 MD5 标识文件
- **自动合并**: 所有切片上传完成后自动合并

#### 2. 视频上传组件
- **多视频支持**: 最多上传 5 个视频
- **格式支持**: MP4、WebM、OGG、MOV、AVI
- **大小限制**: 单个文件最大 500MB
- **实时进度**: 显示每个视频的上传进度
- **视频预览**: 上传成功后可预览
- **删除功能**: 支持删除已上传的视频

#### 3. 创建页面集成
- **图片上传**: 最多 9 张图片
- **视频上传**: 最多 5 个视频
- **混合上传**: 图片和视频可同时上传
- **表单验证**: 完整的表单验证规则

### 后端功能

#### 1. 切片上传接口
```
POST /api/v1/upload/chunk
- 上传单个切片
- 参数：chunk, chunkIndex, totalChunks, fileIdentifier, filename
```

#### 2. 切片合并接口
```
POST /api/v1/upload/merge
- 合并所有切片
- 参数：fileIdentifier, filename, totalChunks, fileSize, mimeType
- 返回：文件 URL
```

#### 3. 文件检查接口
```
GET /api/v1/upload/check
- 检查文件上传状态（断点续传）
- 参数：fileIdentifier, filename
- 返回：已上传的切片列表
```

## 📦 技术实现

### 前端技术栈

#### 1. 切片上传工具 (`chunkUpload.ts`)

```typescript
// 上传文件（自动切片）
const result = await uploadFileInChunks({
  file: videoFile,
  onProgress: (progress) => {
    console.log(`上传进度: ${progress}%`);
  },
  onChunkProgress: (chunkIndex, totalChunks) => {
    console.log(`切片 ${chunkIndex + 1}/${totalChunks}`);
  },
});

// 返回结果
{
  url: "https://minio.example.com/videos/xxx.mp4",
  filename: "video.mp4",
  size: 52428800,
  mimeType: "video/mp4"
}
```

#### 2. 视频上传组件 (`VideoUpload.tsx`)

```tsx
<VideoUpload
  value={videos}
  onChange={setVideos}
  maxCount={5}
  maxSize={500}
/>
```

**Props:**
- `value`: 已上传的视频 URL 数组
- `onChange`: 视频列表变化回调
- `maxCount`: 最大视频数量（默认 5）
- `maxSize`: 单个文件最大大小（MB，默认 500）

### 后端技术栈

#### 1. 切片上传服务 (`chunk_upload_service.py`)

**核心功能:**

```python
class ChunkUploadService:
    async def upload_chunk(...)
        # 保存切片到临时目录
        
    async def merge_chunks(...)
        # 合并切片
        # 验证文件大小
        # 上传到 MinIO
        # 清理临时文件
        
    async def check_file_exists(...)
        # 检查已上传的切片
```

#### 2. 数据库模型

```python
class Content(Base):
    images = Column(ARRAY(String), default=list)  # 图片 URL 列表
    videos = Column(ARRAY(String), default=list)  # 视频 URL 列表
```

## 🚀 使用指南

### 前端使用

#### 1. 在创建页面使用

```tsx
import VideoUpload from './components/VideoUpload';

const [videos, setVideos] = useState<string[]>([]);

<Form.Item label="视频">
  <VideoUpload
    value={videos}
    onChange={setVideos}
    maxCount={5}
    maxSize={500}
  />
</Form.Item>
```

#### 2. 提交表单

```tsx
const handleSubmit = async (values) => {
  await createContent({
    ...values,
    images: imageUrls,
    videos: videos,  // 视频 URL 数组
  });
};
```

### 后端使用

#### 1. 接收视频 URL

```python
class ContentCreate(BaseModel):
    images: List[str] = Field(default_factory=list)
    videos: List[str] = Field(default_factory=list)
```

#### 2. 保存到数据库

```python
content = Content(
    images=content_data.images,
    videos=content_data.videos,
    ...
)
```

## 📊 上传流程

### 大文件切片上传流程

```
1. 选择文件
   ↓
2. 计算文件标识（MD5）
   ↓
3. 检查是否已上传（断点续传）
   ↓
4. 切分文件（5MB/片）
   ↓
5. 并行上传所有切片
   ↓
6. 合并切片
   ↓
7. 上传到 MinIO
   ↓
8. 返回文件 URL
   ↓
9. 清理临时文件
```

### 视频上传流程

```
1. 选择视频文件
   ↓
2. 验证格式和大小
   ↓
3. 调用切片上传
   ↓
4. 显示上传进度
   ↓
5. 上传成功
   ↓
6. 保存视频 URL
   ↓
7. 显示预览按钮
```

## 🔧 配置说明

### 前端配置

```typescript
// chunkUpload.ts
const CHUNK_SIZE = 5 * 1024 * 1024;  // 5MB

// VideoUpload.tsx
const allowedTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',  // .mov
  'video/x-msvideo',  // .avi
];
```

### 后端配置

```python
# chunk_upload_service.py
self.temp_dir = Path(settings.UPLOAD_DIR) / "chunks"

# MinIO 存储桶
if mime_type.startswith("video/"):
    bucket_name = "videos"
elif mime_type.startswith("image/"):
    bucket_name = "images"
else:
    bucket_name = "files"
```

## 🎨 UI 展示

### 视频上传组件

```
┌─────────────────────────────────────┐
│  [选择视频]                          │
│  支持 MP4、WebM、OGG、MOV、AVI      │
│  单个文件最大 500MB，最多 5 个视频   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🎬  video1.mp4                     │
│      52.4 MB                        │
│      ████████████░░░░░░░░ 60%      │
│                      [预览] [删除]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🎬  video2.mp4                     │
│      128.5 MB                       │
│      ✅ 上传成功                    │
│                      [预览] [删除]  │
└─────────────────────────────────────┘
```

## 🐛 错误处理

### 前端错误处理

```typescript
// 文件类型错误
if (!validateFileType(file, allowedTypes)) {
  message.error('只支持 MP4、WebM、OGG、MOV、AVI 格式的视频');
  return false;
}

// 文件大小错误
if (fileSizeMB > maxSize) {
  message.error(`视频大小不能超过 ${maxSize}MB`);
  return false;
}

// 数量限制错误
if (videos.length >= maxCount) {
  message.error(`最多只能上传 ${maxCount} 个视频`);
  return false;
}
```

### 后端错误处理

```python
# 切片缺失
if missing_chunks:
    raise HTTPException(
        status_code=400,
        detail=f"缺少切片: {missing_chunks}"
    )

# 文件大小不匹配
if actual_size != file_size:
    raise HTTPException(
        status_code=400,
        detail=f"文件大小不匹配"
    )
```

## 📈 性能优化

### 1. 并行上传
- 所有切片并行上传
- 提高上传速度

### 2. 断点续传
- 检查已上传的切片
- 只上传缺失的切片

### 3. 自动清理
- 上传成功后自动清理临时文件
- 上传失败也会清理

### 4. 进度显示
- 实时显示上传进度
- 切片级别的进度回调

## 🔒 安全性

### 1. 文件验证
- 验证文件类型
- 验证文件大小
- 验证切片完整性

### 2. 权限控制
- 需要登录才能上传
- JWT Token 验证

### 3. 文件标识
- 使用 MD5 标识文件
- 防止重复上传

## 📝 API 文档

### 上传切片

**请求:**
```http
POST /api/v1/upload/chunk
Content-Type: multipart/form-data

chunk: File
chunkIndex: 0
totalChunks: 10
fileIdentifier: "abc123"
filename: "video.mp4"
```

**响应:**
```json
{
  "success": true,
  "message": "切片 1/10 上传成功",
  "data": {
    "chunkIndex": 0,
    "totalChunks": 10,
    "uploaded": true
  }
}
```

### 合并切片

**请求:**
```http
POST /api/v1/upload/merge
Content-Type: application/x-www-form-urlencoded

fileIdentifier=abc123
filename=video.mp4
totalChunks=10
fileSize=52428800
mimeType=video/mp4
```

**响应:**
```json
{
  "url": "https://minio.example.com/videos/abc123.mp4",
  "filename": "video.mp4",
  "size": 52428800,
  "mimeType": "video/mp4"
}
```

### 检查文件

**请求:**
```http
GET /api/v1/upload/check?fileIdentifier=abc123&filename=video.mp4
```

**响应:**
```json
{
  "exists": true,
  "uploadedChunks": [0, 1, 2, 3, 4]
}
```

## 🎯 最佳实践

### 1. 文件大小
- 建议单个视频不超过 500MB
- 超大文件建议压缩后上传

### 2. 格式选择
- 推荐使用 MP4 格式（兼容性最好）
- WebM 格式体积更小

### 3. 用户体验
- 显示上传进度
- 提供取消上传功能
- 上传失败后可重试

### 4. 性能优化
- 使用 CDN 加速视频访问
- 视频转码优化播放

## 🔗 相关文档

- [MinIO 配置文档](../MINIO_SETUP.md)
- [前端组件文档](../frontend/COMPONENT_GUIDELINES.md)
- [API 文档](http://localhost:8000/docs)

---

**最后更新时间:** 2024-02-11  
**版本:** 1.0.0

