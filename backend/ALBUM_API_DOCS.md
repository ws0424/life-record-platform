# 相册 API 文档

## 概述

相册功能提供了完整的照片管理和统计功能，支持按地点、标签、时间轴进行分类统计，以及标题和作者名称的模糊搜索。

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1/content`
- **认证方式**: Bearer Token（部分接口支持未登录访问）
- **响应格式**: JSON

## API 接口列表

### 1. 相册列表

#### 获取相册列表

```http
GET /albums/list
```

**描述**: 获取所有公开的相册列表（允许未登录访问）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20，最大 100 |
| keyword | string | 否 | 搜索关键词（标题、描述） |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "type": "album",
        "title": "春日樱花",
        "description": "2024年春天的樱花季",
        "tags": ["樱花", "春天", "京都"],
        "images": ["url1", "url2", "url3"],
        "videos": [],
        "video_thumbnails": [],
        "location": "日本京都",
        "is_public": true,
        "is_featured": false,
        "view_count": 892,
        "like_count": 156,
        "comment_count": 23,
        "save_count": 45,
        "created_at": "2024-03-15T10:00:00",
        "user": {
          "id": "uuid",
          "username": "photographer",
          "email": "photo@example.com"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  },
  "msg": "获取成功",
  "errMsg": null
}
```

---

### 2. 相册详情

#### 获取相册详情

```http
GET /{content_id}
```

**描述**: 获取指定相册的详细信息（公开相册允许未登录访问）

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content_id | string | 是 | 相册 ID |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "type": "album",
    "title": "春日樱花",
    "description": "2024年春天的樱花季，记录了最美的粉色时光",
    "content": "详细的相册描述内容...",
    "tags": ["樱花", "春天", "京都", "摄影"],
    "images": ["url1", "url2", "url3", "url4"],
    "videos": [],
    "video_thumbnails": [],
    "location": "日本京都",
    "extra_data": {
      "photo_count": 24,
      "cover_images": ["url1", "url2", "url3", "url4"]
    },
    "is_public": true,
    "is_featured": false,
    "view_count": 893,
    "like_count": 156,
    "comment_count": 23,
    "save_count": 45,
    "created_at": "2024-03-15T10:00:00",
    "updated_at": "2024-03-15T10:00:00",
    "user": {
      "id": "uuid",
      "username": "photographer",
      "email": "photo@example.com"
    },
    "is_liked": false,
    "is_saved": false
  },
  "msg": "获取成功",
  "errMsg": null
}
```

---

### 3. 创建相册

#### 创建新相册

```http
POST /
```

**描述**: 创建新的相册（需要登录）

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "type": "album",
  "title": "春日樱花",
  "description": "2024年春天的樱花季",
  "content": "详细的相册描述内容...",
  "tags": ["樱花", "春天", "京都"],
  "images": ["url1", "url2", "url3"],
  "videos": [],
  "video_thumbnails": [],
  "location": "日本京都",
  "extra_data": {
    "photo_count": 24,
    "cover_images": ["url1", "url2", "url3", "url4"]
  },
  "is_public": true
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "type": "album",
    "title": "春日樱花",
    "description": "2024年春天的樱花季",
    "content": "详细的相册描述内容...",
    "tags": ["樱花", "春天", "京都"],
    "images": ["url1", "url2", "url3"],
    "videos": [],
    "video_thumbnails": [],
    "location": "日本京都",
    "extra_data": {
      "photo_count": 24,
      "cover_images": ["url1", "url2", "url3", "url4"]
    },
    "is_public": true,
    "is_featured": false,
    "view_count": 0,
    "like_count": 0,
    "comment_count": 0,
    "save_count": 0,
    "created_at": "2024-03-15T10:00:00",
    "updated_at": "2024-03-15T10:00:00"
  },
  "msg": "内容创建成功",
  "errMsg": null
}
```

---

### 4. 相册统计

#### 4.1 按地点统计

```http
GET /albums/stats/location
```

**描述**: 统计相册按地点的分布情况

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 否 | 用户ID（不传则统计所有公开相册） |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "locations": [
      {
        "location": "日本京都",
        "count": 5,
        "photo_count": 120,
        "albums": [
          {
            "id": "uuid",
            "title": "春日樱花",
            "photo_count": 24,
            "created_at": "2024-03-15T10:00:00"
          },
          {
            "id": "uuid",
            "title": "秋日红叶",
            "photo_count": 30,
            "created_at": "2024-11-10T10:00:00"
          }
        ]
      },
      {
        "location": "上海",
        "count": 3,
        "photo_count": 80,
        "albums": [...]
      }
    ]
  },
  "msg": "获取成功",
  "errMsg": null
}
```

#### 4.2 按标签统计

```http
GET /albums/stats/tag
```

**描述**: 统计相册按标签的分布情况

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 否 | 用户ID（不传则统计所有公开相册） |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "tags": [
      {
        "tag": "樱花",
        "count": 8,
        "photo_count": 200,
        "albums": [
          {
            "id": "uuid",
            "title": "春日樱花",
            "photo_count": 24,
            "created_at": "2024-03-15T10:00:00"
          }
        ]
      },
      {
        "tag": "旅行",
        "count": 12,
        "photo_count": 350,
        "albums": [...]
      }
    ]
  },
  "msg": "获取成功",
  "errMsg": null
}
```

#### 4.3 按时间轴统计

```http
GET /albums/stats/timeline
```

**描述**: 统计相册按时间的分布情况

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 否 | 用户ID（不传则统计所有公开相册） |
| group_by | string | 否 | 分组方式：year/month/day，默认 month |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "timeline": [
      {
        "time_key": "2024-03",
        "time_label": "2024年3月",
        "count": 5,
        "photo_count": 120,
        "albums": [
          {
            "id": "uuid",
            "title": "春日樱花",
            "photo_count": 24,
            "location": "日本京都",
            "tags": ["樱花", "春天"],
            "created_at": "2024-03-15T10:00:00"
          }
        ]
      },
      {
        "time_key": "2024-02",
        "time_label": "2024年2月",
        "count": 3,
        "photo_count": 80,
        "albums": [...]
      }
    ],
    "group_by": "month"
  },
  "msg": "获取成功",
  "errMsg": null
}
```

---

### 5. 搜索功能

#### 搜索内容

```http
GET /search
```

**描述**: 支持按标题、作者名称模糊搜索内容（允许未登录访问）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 标题关键词（模糊匹配标题、描述、内容） |
| author | string | 否 | 作者名称（模糊匹配用户名、邮箱） |
| type | string | 否 | 内容类型：daily/album/travel |
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "type": "album",
        "title": "春日樱花",
        "description": "2024年春天的樱花季",
        "tags": ["樱花", "春天"],
        "images": ["url1", "url2"],
        "videos": [],
        "video_thumbnails": [],
        "location": "日本京都",
        "is_public": true,
        "is_featured": false,
        "view_count": 892,
        "like_count": 156,
        "comment_count": 23,
        "save_count": 45,
        "created_at": "2024-03-15T10:00:00",
        "user": {
          "id": "uuid",
          "username": "photographer",
          "email": "photo@example.com"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "page_size": 20,
    "total_pages": 3
  },
  "msg": "搜索成功",
  "errMsg": null
}
```

**搜索示例**:

1. 搜索标题包含"樱花"的相册：
   ```
   GET /search?keyword=樱花&type=album
   ```

2. 搜索作者名称包含"photographer"的内容：
   ```
   GET /search?author=photographer
   ```

3. 同时搜索标题和作者：
   ```
   GET /search?keyword=樱花&author=photographer&type=album
   ```

---

### 6. 点赞和收藏

#### 6.1 切换点赞

```http
POST /{content_id}/like
```

**描述**: 点赞或取消点赞相册（需要登录）

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "is_liked": true,
    "like_count": 157
  },
  "msg": "操作成功",
  "errMsg": null
}
```

#### 6.2 切换收藏

```http
POST /{content_id}/save
```

**描述**: 收藏或取消收藏相册（需要登录）

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "is_saved": true,
    "save_count": 46
  },
  "msg": "操作成功",
  "errMsg": null
}
```

---

### 7. 评论功能

#### 7.1 创建评论

```http
POST /{content_id}/comments
```

**描述**: 为相册添加评论（需要登录）

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:

```json
{
  "comment_text": "太美了！",
  "parent_id": null
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "content_id": "uuid",
    "user_id": "uuid",
    "comment_text": "太美了！",
    "parent_id": null,
    "like_count": 0,
    "created_at": "2024-03-15T10:00:00",
    "updated_at": "2024-03-15T10:00:00",
    "user": {
      "id": "uuid",
      "username": "user1",
      "email": "user1@example.com"
    }
  },
  "msg": "评论成功",
  "errMsg": null
}
```

#### 7.2 获取评论列表

```http
GET /{content_id}/comments
```

**描述**: 获取相册的评论列表（允许未登录访问）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| page_size | int | 否 | 每页数量，默认 20，最大 100 |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "content_id": "uuid",
        "user_id": "uuid",
        "comment_text": "太美了！",
        "parent_id": null,
        "like_count": 5,
        "created_at": "2024-03-15T10:00:00",
        "updated_at": "2024-03-15T10:00:00",
        "user": {
          "id": "uuid",
          "username": "user1",
          "email": "user1@example.com"
        },
        "is_liked": false,
        "reply_count": 2,
        "replies": [
          {
            "id": "uuid",
            "content_id": "uuid",
            "user_id": "uuid",
            "comment_text": "谢谢！",
            "parent_id": "parent_uuid",
            "like_count": 1,
            "created_at": "2024-03-15T11:00:00",
            "updated_at": "2024-03-15T11:00:00",
            "user": {
              "id": "uuid",
              "username": "photographer",
              "email": "photo@example.com"
            }
          }
        ]
      }
    ],
    "total": 23,
    "page": 1,
    "page_size": 20,
    "total_pages": 2
  },
  "msg": "获取成功",
  "errMsg": null
}
```

---

## 使用场景示例

### 场景 1: 相册列表页面

1. 获取相册列表：
   ```
   GET /albums/list?page=1&page_size=20
   ```

2. 按地点筛选统计：
   ```
   GET /albums/stats/location
   ```

3. 按标签筛选统计：
   ```
   GET /albums/stats/tag
   ```

4. 按时间轴查看：
   ```
   GET /albums/stats/timeline?group_by=month
   ```

### 场景 2: 相册详情页面

1. 获取相册详情：
   ```
   GET /{album_id}
   ```

2. 点赞相册：
   ```
   POST /{album_id}/like
   ```

3. 收藏相册：
   ```
   POST /{album_id}/save
   ```

4. 添加评论：
   ```
   POST /{album_id}/comments
   ```

5. 查看评论：
   ```
   GET /{album_id}/comments?page=1
   ```

### 场景 3: 搜索功能

1. 搜索标题包含"樱花"的相册：
   ```
   GET /search?keyword=樱花&type=album
   ```

2. 搜索作者"photographer"的所有相册：
   ```
   GET /search?author=photographer&type=album
   ```

3. 综合搜索：
   ```
   GET /search?keyword=樱花&author=photographer&type=album&page=1
   ```

### 场景 4: 我的相册

1. 获取我的相册列表：
   ```
   GET /my/works?type=album
   ```

2. 查看我的相册统计（按地点）：
   ```
   GET /albums/stats/location?user_id={my_user_id}
   ```

3. 查看我的相册统计（按时间）：
   ```
   GET /albums/stats/timeline?user_id={my_user_id}&group_by=month
   ```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或 Token 无效 |
| 403 | 无权访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 注意事项

1. **认证要求**：
   - 创建、更新、删除相册需要登录
   - 点赞、收藏、评论需要登录
   - 查看公开相册不需要登录

2. **权限控制**：
   - 只能编辑和删除自己的相册
   - 私密相册只有作者可以查看
   - 统计接口可以查看所有公开相册或自己的相册

3. **分页限制**：
   - 默认每页 20 条
   - 最大每页 100 条

4. **搜索功能**：
   - 支持标题、描述、内容的模糊搜索
   - 支持作者用户名、邮箱的模糊搜索
   - 可以同时使用多个搜索条件

5. **统计功能**：
   - 地点统计：按相册的 location 字段分组
   - 标签统计：按相册的 tags 数组分组
   - 时间轴统计：支持按年、月、日分组

---

## 测试建议

1. 使用 Swagger UI 测试：访问 `http://localhost:8000/docs`
2. 使用 Postman 或 curl 测试
3. 先创建测试账号并登录获取 Token
4. 创建几个测试相册，包含不同的地点、标签、时间
5. 测试各种搜索和统计功能

---

**最后更新**: 2024-02-14


