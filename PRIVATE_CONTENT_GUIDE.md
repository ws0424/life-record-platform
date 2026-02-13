# 私密作品功能说明

## 📋 功能概述

私密作品功能允许用户将作品设置为私密状态，私密作品只在"我的创作"中可见，不会出现在公开列表中。

## 🔒 权限控制

### 公开列表（所有用户可见）
- `/daily/list` - 日常记录列表
- `/albums/list` - 相册列表
- `/travel/list` - 旅游路线列表
- `/explore/list` - 探索页面

**规则：**
- ✅ 只显示 `is_public=true` 的作品
- ❌ 私密作品（`is_public=false`）不可见
- ✅ 未登录用户也可以访问

### 我的创作（仅作者可见）
- `/my/works` - 我的作品

**规则：**
- ✅ 显示所有自己的作品（包括公开和私密）
- ✅ 私密作品有明显的"私密"标识
- ✅ 可以切换作品的公开/私密状态
- ❌ 需要登录才能访问

### 作品详情页
- `/daily/[id]` - 日常记录详情
- `/albums/[id]` - 相册详情
- `/travel/[id]` - 旅游路线详情

**规则：**
- ✅ 公开作品：所有人可见
- ✅ 私密作品：只有作者可见
- ❌ 其他用户访问私密作品：返回 403 Forbidden

## 🎨 前端实现

### 1. 私密标识
在"我的作品"列表中，私密作品会显示红色的"私密"标签：

```tsx
{!content.is_public && (
  <span className={`${styles.badge} ${styles.private}`}>私密</span>
)}
```

**样式：**
```css
.badge.private {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}
```

### 2. 切换可见性
用户可以通过眼睛图标切换作品的公开/私密状态：

```tsx
<button
  onClick={() => handleToggleVisibility(content.id, content.is_public)}
  title={content.is_public ? '隐藏' : '公开'}
>
  {content.is_public ? <EyeInvisibleOutlined /> : <EyeOutlined />}
</button>
```

### 3. 批量操作
支持批量隐藏和批量公开：

```tsx
<Button onClick={handleBatchHide}>批量隐藏</Button>
<Button onClick={handleBatchShow}>批量公开</Button>
```

## 🔧 后端实现

### 1. 数据库字段
```python
class Content(Base):
    # ...
    is_public = Column(Boolean, default=True)  # 是否公开
```

### 2. 公开列表接口
强制过滤 `is_public=True`：

```python
@router.get("/daily/list")
async def list_daily_contents(...):
    return service.list_contents(
        content_type=ContentType.DAILY,
        is_public=True,  # 强制公开
        ...
    )
```

### 3. 我的作品接口
不过滤 `is_public`，显示所有自己的作品：

```python
@router.get("/my/works")
async def get_my_works(...):
    return service.list_contents(
        user_id=str(current_user.id),  # 只过滤用户ID
        # 不设置 is_public，显示所有作品
        ...
    )
```

### 4. 详情页权限检查
```python
def get_content(self, content_id: str, user_id: Optional[str] = None):
    content = self.db.query(Content).filter(Content.id == content_id).first()
    
    # 检查权限：如果是私密内容，只有作者可以查看
    if not content.is_public and str(content.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权访问此内容"
        )
```

### 5. 切换可见性接口
```python
@router.post("/{content_id}/hide")
async def hide_content(content_id: str, current_user: User):
    return service.toggle_content_visibility(
        content_id, 
        str(current_user.id), 
        is_public=False
    )

@router.post("/{content_id}/show")
async def show_content(content_id: str, current_user: User):
    return service.toggle_content_visibility(
        content_id, 
        str(current_user.id), 
        is_public=True
    )
```

## 📊 使用场景

### 场景 1：草稿保存
用户创建作品时可以先设置为私密，完善后再公开：

1. 创建作品，设置 `is_public=false`
2. 在"我的作品"中查看和编辑
3. 完善后点击"公开"按钮
4. 作品出现在公开列表中

### 场景 2：临时隐藏
用户可以临时隐藏某些作品：

1. 在"我的作品"中找到要隐藏的作品
2. 点击"隐藏"按钮
3. 作品从公开列表中消失
4. 需要时可以再次公开

### 场景 3：批量管理
用户可以批量管理作品的可见性：

1. 点击"批量操作"按钮
2. 选择多个作品
3. 点击"批量隐藏"或"批量公开"
4. 所有选中的作品状态同时更新

## 🔍 测试验证

### 1. 创建私密作品
```bash
POST /api/content
{
  "type": "daily",
  "title": "私密日记",
  "content": "这是私密内容",
  "is_public": false
}
```

### 2. 验证公开列表不可见
```bash
GET /api/content/daily/list
# 响应中不包含私密作品
```

### 3. 验证我的作品可见
```bash
GET /api/content/my/works
# 响应中包含私密作品，且有 is_public=false 标识
```

### 4. 验证详情页权限
```bash
# 作者访问 - 成功
GET /api/content/{private_content_id}
Authorization: Bearer {author_token}

# 其他用户访问 - 403 Forbidden
GET /api/content/{private_content_id}
Authorization: Bearer {other_user_token}
```

### 5. 切换可见性
```bash
# 隐藏作品
POST /api/content/{content_id}/hide

# 公开作品
POST /api/content/{content_id}/show
```

## ✅ 功能清单

- [x] 数据库字段 `is_public`
- [x] 公开列表强制过滤 `is_public=true`
- [x] 我的作品显示所有作品（包括私密）
- [x] 私密作品标识（红色"私密"标签）
- [x] 详情页权限检查
- [x] 切换可见性接口（隐藏/公开）
- [x] 批量隐藏功能
- [x] 批量公开功能
- [x] 前端 UI 实现
- [x] 后端 API 实现
- [x] 权限验证

## 🎯 总结

私密作品功能已完整实现：

1. **后端**：完善的权限控制和 API 接口
2. **前端**：清晰的私密标识和便捷的操作
3. **安全**：严格的权限验证，确保私密内容不泄露
4. **易用**：支持单个和批量操作，用户体验良好

用户可以放心地将作品设置为私密，只在"我的创作"中管理，不会出现在公开列表中。

