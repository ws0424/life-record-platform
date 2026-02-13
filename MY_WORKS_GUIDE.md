# 我的创作功能使用指南

## 📚 目录

- [功能概览](#功能概览)
- [快速开始](#快速开始)
- [功能详解](#功能详解)
- [API 文档](#api-文档)
- [组件说明](#组件说明)
- [常见问题](#常见问题)

## 功能概览

"我的创作"是一个综合性的内容管理中心，包含以下四个核心功能：

### 📝 我的作品
- 查看所有创建的内容
- 编辑、隐藏/公开、删除作品
- 显示私密标签
- 查看作品统计数据

### 👀 浏览记录
- 自动记录浏览过的内容
- 按最后浏览时间排序
- 删除单条浏览记录
- 快速跳转到内容详情

### ❤️ 点赞记录
- 查看所有点赞的内容
- 按点赞时间排序
- 快速访问点赞内容

### 💬 评论记录
- 查看所有评论
- 显示评论内容和点赞数
- 快速跳转到原内容

## 快速开始

### 1. 访问页面

```
http://localhost:3000/my-works
```

或从 Header 用户菜单进入：
1. 点击右上角用户头像
2. 选择"我的创作"

### 2. 查看统计数据

页面顶部显示四个统计卡片：
- 📝 我的作品数量
- 👀 浏览记录数量
- ❤️ 点赞记录数量
- 💬 评论记录数量

### 3. 切换标签页

点击顶部标签切换不同视图：
- 我的作品
- 浏览记录
- 点赞记录
- 评论记录

### 4. 管理内容

#### 编辑作品
1. 找到要编辑的作品
2. 点击"编辑"按钮（铅笔图标）
3. 跳转到编辑页面

#### 隐藏/公开作品
1. 找到要操作的作品
2. 点击"眼睛"图标
3. 确认操作

#### 删除作品
1. 找到要删除的作品
2. 点击"删除"按钮（垃圾桶图标）
3. 在确认对话框中点击"确定"

#### 删除浏览记录
1. 切换到"浏览记录"标签
2. 找到要删除的记录
3. 点击"删除"按钮

## 功能详解

### 统计卡片

统计卡片实时显示各类数据的数量：

```tsx
<StatsGrid stats={{
  worksCount: 10,    // 作品数量
  viewsCount: 50,    // 浏览记录数量
  likesCount: 30,    // 点赞记录数量
  commentsCount: 20  // 评论记录数量
}} />
```

**特点：**
- 紫色渐变背景
- 悬停提升效果
- 动画进入效果
- 实时更新数据

### 无限滚动

所有列表都支持无限滚动加载：

1. 滚动到页面底部
2. 自动加载下一页
3. 显示"加载更多..."提示
4. 加载完成后显示"已加载全部 N 条记录"

**技术实现：**
- Intersection Observer API
- 防止重复请求
- 自动追加数据
- 平滑的加载体验

### 骨架屏加载

首次加载时显示骨架屏：

```tsx
<SkeletonGrid count={6} />
```

**特点：**
- Shimmer 动画效果
- 与实际内容布局一致
- 提升用户体验
- 减少感知等待时间

### 作品卡片

每个作品卡片包含：

- **封面图片** - 支持图片/视频
- **标题** - 作品名称
- **描述** - 作品简介
- **统计数据** - 浏览、点赞、评论数
- **操作按钮** - 编辑、隐藏/公开、删除
- **私密标签** - 显示私密作品
- **创建时间** - 格式化显示

### 评论卡片

每个评论卡片包含：

- **内容链接** - 评论了《作品标题》
- **评论内容** - 完整评论文本
- **点赞数** - 评论获得的点赞
- **创建时间** - 评论时间

## API 文档

### API 封装类

```typescript
import { myWorksApi } from '@/lib/api/myWorks';
```

### 方法列表

#### 1. 获取我的作品

```typescript
const data = await myWorksApi.getMyWorks(page, pageSize, type);

// 参数
page: number       // 页码，默认 1
pageSize: number   // 每页数量，默认 12
type?: string      // 内容类型（可选）

// 返回
{
  items: ContentListItem[],
  total: number,
  page: number,
  page_size: number,
  total_pages: number
}
```

#### 2. 获取浏览记录

```typescript
const data = await myWorksApi.getMyViews(page, pageSize);

// 参数
page: number       // 页码，默认 1
pageSize: number   // 每页数量，默认 12

// 返回
{
  items: ContentListItem[],
  total: number,
  page: number,
  page_size: number,
  total_pages: number
}
```

#### 3. 获取点赞记录

```typescript
const data = await myWorksApi.getMyLikes(page, pageSize);

// 参数
page: number       // 页码，默认 1
pageSize: number   // 每页数量，默认 12

// 返回
{
  items: ContentListItem[],
  total: number,
  page: number,
  page_size: number,
  total_pages: number
}
```

#### 4. 获取评论记录

```typescript
const data = await myWorksApi.getMyComments(page, pageSize);

// 参数
page: number       // 页码，默认 1
pageSize: number   // 每页数量，默认 12

// 返回
{
  items: CommentItem[],
  total: number,
  page: number,
  page_size: number,
  total_pages: number
}
```

#### 5. 隐藏作品

```typescript
await myWorksApi.hideContent(contentId);

// 参数
contentId: string  // 内容 ID

// 返回
{ code: 200, msg: "内容已隐藏" }
```

#### 6. 公开作品

```typescript
await myWorksApi.showContent(contentId);

// 参数
contentId: string  // 内容 ID

// 返回
{ code: 200, msg: "内容已公开" }
```

#### 7. 删除作品

```typescript
await myWorksApi.deleteContent(contentId);

// 参数
contentId: string  // 内容 ID

// 返回
{ code: 200, msg: "内容删除成功" }
```

#### 8. 删除浏览记录

```typescript
await myWorksApi.deleteViewRecord(contentId);

// 参数
contentId: string  // 内容 ID

// 返回
{ code: 200, msg: "浏览记录已删除" }
```

#### 9. 获取统计信息

```typescript
const stats = await myWorksApi.getStats();

// 返回
{
  worksCount: number,
  viewsCount: number,
  likesCount: number,
  commentsCount: number
}
```

## 组件说明

### StatsCard

统计卡片组件

```tsx
<StatsCard 
  icon="📝"           // 图标
  value={10}          // 数值
  label="我的作品"    // 标签
  delay={0}           // 动画延迟（秒）
/>
```

### StatsGrid

统计网格组件

```tsx
<StatsGrid stats={{
  worksCount: 10,
  viewsCount: 50,
  likesCount: 30,
  commentsCount: 20
}} />
```

### SkeletonCard

骨架屏卡片

```tsx
<SkeletonCard />
```

### SkeletonGrid

骨架屏网格

```tsx
<SkeletonGrid count={6} />  // 显示 6 个骨架屏卡片
```

## 常见问题

### Q1: 为什么看不到统计数据？

**A:** 确保：
1. 已登录
2. 网络连接正常
3. 后端服务运行中
4. 检查浏览器控制台是否有错误

### Q2: 删除作品后统计数据没有更新？

**A:** 统计数据会自动更新。如果没有更新，尝试：
1. 刷新页面
2. 检查网络请求是否成功
3. 查看控制台错误信息

### Q3: 无限滚动不工作？

**A:** 检查：
1. 是否有更多数据（查看"已加载全部"提示）
2. 是否正在加载中
3. 浏览器控制台是否有错误
4. 网络请求是否成功

### Q4: 骨架屏一直显示？

**A:** 可能原因：
1. 网络请求失败
2. 后端服务未启动
3. 认证 token 过期
4. 检查浏览器控制台错误

### Q5: 如何自定义每页显示数量？

**A:** 修改 `pageSize` 变量：

```typescript
const pageSize = 12;  // 改为你想要的数量
```

### Q6: 如何添加筛选功能？

**A:** 可以在 API 调用时传入筛选参数：

```typescript
const data = await myWorksApi.getMyWorks(1, 12, 'daily');  // 只显示日常记录
```

### Q7: 浏览记录是如何记录的？

**A:** 当用户访问内容详情页时，后端会自动记录：
1. 检查是否已有记录
2. 如果有，更新 `updated_at` 时间
3. 如果没有，创建新记录
4. 同时增加内容的浏览次数

### Q8: 私密作品别人能看到吗？

**A:** 不能。私密作品（`is_public: false`）：
1. 只有作者可以查看
2. 不会出现在公开列表中
3. 直接访问链接会返回 403 错误
4. 在"我的作品"中显示"私密"标签

### Q9: 如何批量删除？

**A:** 当前版本不支持批量删除。未来版本会添加：
1. 多选功能
2. 批量操作按钮
3. 批量删除确认

### Q10: 数据会缓存吗？

**A:** 不会。每次切换标签页都会重新加载数据，确保数据是最新的。

## 技术栈

- **前端框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: CSS Modules
- **动画**: Framer Motion
- **UI 组件**: Ant Design
- **API 请求**: Fetch API
- **状态管理**: React Hooks

## 设计系统

- **主色**: #7C3AED (紫色)
- **次色**: #A78BFA (浅紫色)
- **字体**: Fira Sans, Fira Code
- **风格**: 数据密集型仪表板
- **响应式**: 支持所有设备

## 性能优化

1. **无限滚动** - 按需加载数据
2. **骨架屏** - 优化首屏加载体验
3. **防抖处理** - 防止重复请求
4. **懒加载** - 图片和视频懒加载
5. **缓存策略** - 合理使用缓存

## 无障碍支持

- ✅ 键盘导航
- ✅ 屏幕阅读器支持
- ✅ ARIA 标签
- ✅ 焦点管理
- ✅ 颜色对比度

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 更新日志

### v1.1.0 (2024-02-13)
- ✅ 添加统计卡片
- ✅ 添加骨架屏加载
- ✅ 创建 API 封装层
- ✅ 优化代码结构

### v1.0.0 (2024-02-13)
- ✅ 初始版本发布
- ✅ 我的作品功能
- ✅ 浏览记录功能
- ✅ 点赞记录功能
- ✅ 评论记录功能

## 反馈与支持

如有问题或建议，请：
1. 查看本文档
2. 检查浏览器控制台
3. 查看网络请求
4. 联系开发团队

---

**最后更新**: 2024-02-13  
**版本**: v1.1.0

