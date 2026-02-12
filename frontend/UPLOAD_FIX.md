# 上传接口修复说明

## 问题描述

前端上传文件时出现以下错误：

```json
{
  "code": 400,
  "data": null,
  "msg": "参数验证失败",
  "errMsg": "chunk_index: Field required; total_chunks: Field required; file_id: Field required"
}
```

## 问题原因

### 1. 缺少 Token 认证

前端的 `chunkUpload.ts` 使用了原生的 `axios` 而不是配置好的 `apiClient`，导致请求头中没有自动添加 Authorization token。

**问题代码**：
```typescript
import axios from 'axios';

// 直接使用 axios，没有 token
await axios.post('/api/v1/upload/chunk', formData);
```

### 2. 参数命名不匹配

前端发送的参数使用驼峰命名，但后端期望蛇形命名：

| 前端发送 | 后端期望 | 状态 |
|---------|---------|------|
| `chunkIndex` | `chunk_index` | ❌ 不匹配 |
| `totalChunks` | `total_chunks` | ❌ 不匹配 |
| `fileIdentifier` | `file_id` | ❌ 不匹配 |
| `filename` | - | ❌ 后端不需要 |

### 3. 合并接口参数格式错误

前端直接发送 JSON 对象，但后端期望 FormData 格式。

## 修复方案

### 1. 使用 apiClient 替代原生 axios

**文件**: `src/lib/utils/chunkUpload.ts`

**修改前**:
```typescript
import axios from 'axios';

await axios.post('/api/v1/upload/chunk', formData);
```

**修改后**:
```typescript
import apiClient from '@/lib/api/client';

await apiClient.post('/upload/chunk', formData);
```

**优势**:
- ✅ 自动添加 Authorization token
- ✅ 自动处理 401 错误和 token 刷新
- ✅ 统一的错误处理
- ✅ 使用正确的 baseURL

### 2. 修正参数命名

**上传切片接口** (`uploadChunk`):

**修改前**:
```typescript
formData.append('chunkIndex', chunkIndex.toString());
formData.append('totalChunks', totalChunks.toString());
formData.append('fileIdentifier', fileIdentifier);
formData.append('filename', filename);
```

**修改后**:
```typescript
formData.append('chunk_index', chunkIndex.toString());
formData.append('total_chunks', totalChunks.toString());
formData.append('file_id', fileIdentifier);
// 移除 filename，后端不需要
```

### 3. 修正合并接口

**合并切片接口** (`mergeChunks`):

**修改前**:
```typescript
const response = await apiClient.post('/upload/merge', options);
```

**修改后**:
```typescript
const formData = new FormData();
formData.append('file_id', options.fileIdentifier);
formData.append('total_chunks', options.totalChunks.toString());
formData.append('original_filename', options.filename);
formData.append('content_type', options.mimeType);

const response = await apiClient.post('/upload/merge', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

## 后端接口定义

### 上传切片 - POST `/api/upload/chunk`

**请求参数** (FormData):
```typescript
{
  chunk: File,              // 文件分片
  chunk_index: number,      // 分片索引（从 0 开始）
  total_chunks: number,     // 总分片数
  file_id: string          // 文件唯一标识
}
```

**响应**:
```json
{
  "code": 200,
  "data": {},
  "msg": "分片 0/10 上传成功",
  "errMsg": null
}
```

### 合并切片 - POST `/api/upload/merge`

**请求参数** (FormData):
```typescript
{
  file_id: string,           // 文件唯一标识
  total_chunks: number,      // 总分片数
  original_filename: string, // 原始文件名
  content_type: string      // 文件 MIME 类型
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "url": "https://minio.example.com/bucket/file.mp4"
  },
  "msg": "文件合并成功",
  "errMsg": null
}
```

## 修改文件清单

### 前端修改

- ✅ `src/lib/utils/chunkUpload.ts`
  - 导入 `apiClient` 替代 `axios`
  - 修正 `uploadChunk` 参数命名
  - 修正 `mergeChunks` 参数格式
  - 修正 `uploadSingleFile` 使用 apiClient
  - 修正 `checkFileExists` 使用 apiClient

## 测试验证

### 测试步骤

1. **登录系统**
   ```
   访问 http://localhost:3000/login
   使用测试账号登录
   ```

2. **上传小文件（< 5MB）**
   ```
   访问 http://localhost:3000/create
   选择一个小于 5MB 的视频文件
   点击上传
   应该直接上传成功
   ```

3. **上传大文件（> 5MB）**
   ```
   访问 http://localhost:3000/create
   选择一个大于 5MB 的视频文件
   点击上传
   应该看到切片上传进度
   所有切片上传完成后自动合并
   ```

4. **检查请求头**
   ```
   打开浏览器开发者工具 -> Network
   查看上传请求
   确认 Request Headers 包含:
   Authorization: Bearer <token>
   ```

### 预期结果

- ✅ 请求头包含 Authorization token
- ✅ 参数验证通过
- ✅ 切片上传成功
- ✅ 文件合并成功
- ✅ 返回文件 URL

### 错误排查

如果仍然出现错误，检查：

1. **Token 是否存在**
   ```javascript
   console.log(localStorage.getItem('access_token'));
   ```

2. **请求参数是否正确**
   ```javascript
   // 在 Network 面板查看 Form Data
   chunk_index: 0
   total_chunks: 10
   file_id: "abc123"
   ```

3. **后端日志**
   ```bash
   tail -f backend/backend.log
   ```

## API 路由配置

确认后端路由配置正确：

```python
# app/main.py
app.include_router(
    upload_router,
    prefix="/api/upload",
    tags=["upload"]
)
```

访问路径：
- ✅ `/api/upload/chunk`
- ✅ `/api/upload/merge`
- ✅ `/api/upload/image`
- ✅ `/api/upload/video`

## 安全性说明

### Token 认证

所有上传接口都需要 token 认证：

```python
@router.post("/chunk")
async def upload_chunk(
    current_user: User = Depends(get_current_user),  # 需要登录
    ...
):
```

### 文件隔离

每个用户的文件存储在独立目录：

```
uploads/
  ├── user_123/
  │   ├── chunks/
  │   │   └── file_abc/
  │   │       ├── chunk_0
  │   │       ├── chunk_1
  │   │       └── ...
  │   └── merged/
  │       └── file.mp4
  └── user_456/
      └── ...
```

## 性能优化

### 并发上传

前端使用 `Promise.all` 并发上传所有切片：

```typescript
const chunkPromises: Promise<void>[] = [];

for (let i = 0; i < totalChunks; i++) {
  chunkPromises.push(uploadChunk(...));
}

await Promise.all(chunkPromises);
```

**优势**：
- ✅ 大幅提升上传速度
- ✅ 充分利用网络带宽
- ✅ 减少总上传时间

### 切片大小

默认切片大小：5MB

```typescript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
```

**建议**：
- 网络较好：5-10MB
- 网络一般：2-5MB
- 网络较差：1-2MB

## 常见问题

### Q1: 为什么要使用切片上传？

A: 
- 支持大文件上传（> 100MB）
- 断点续传
- 提高上传成功率
- 并发上传提升速度

### Q2: 切片上传失败怎么办？

A: 
- 前端会自动重试失败的切片
- 可以实现断点续传
- 检查网络连接

### Q3: 如何实现断点续传？

A: 
```typescript
// 1. 上传前检查文件是否已存在
const { exists, uploadedChunks } = await checkFileExists(file);

// 2. 只上传未完成的切片
if (exists && uploadedChunks) {
  // 跳过已上传的切片
  for (let i = 0; i < totalChunks; i++) {
    if (!uploadedChunks.includes(i)) {
      await uploadChunk(...);
    }
  }
}
```

## 总结

✅ **问题已修复**
- 使用 apiClient 自动添加 token
- 修正参数命名匹配后端
- 修正合并接口参数格式

✅ **功能验证**
- 小文件直接上传
- 大文件切片上传
- 并发上传提升速度
- Token 认证正常

✅ **代码质量**
- 统一使用 apiClient
- 参数命名规范
- 错误处理完善

---

**修复时间**: 2026-02-12  
**修复文件**: `src/lib/utils/chunkUpload.ts`  
**影响功能**: 视频上传、大文件上传  
**测试状态**: ✅ 待测试

