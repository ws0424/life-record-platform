# 热搜榜前端开发文档

## 页面设计

### 参考设计
参考网站：https://momoyu.cc/

### 设计特点
- 卡片式布局
- 简洁现代的 UI
- 平台切换标签
- 实时更新提示
- 响应式设计

## 页面结构

```
/trending
├── Header (标题 + 刷新按钮)
├── PlatformTabs (平台切换)
└── TrendingList (热搜列表)
    └── TrendingCard (热搜卡片)
```

## 组件设计

### 1. TrendingPage (主页面)

**路径**: `frontend/src/app/trending/page.tsx`

**功能**:
- 获取热搜数据
- 平台切换
- 数据刷新
- 加载状态

### 2. TrendingCard (热搜卡片)

**路径**: `frontend/src/components/trending/TrendingCard.tsx`

**Props**:
```typescript
interface TrendingCardProps {
  item: TrendingItem;
  platform: string;
  rank: number;
}
```

**功能**:
- 显示排名
- 显示标题
- 显示热度值
- 显示标签 (热/新/爆)
- 点击跳转

### 3. PlatformTabs (平台标签)

**路径**: `frontend/src/components/trending/PlatformTabs.tsx`

**Props**:
```typescript
interface PlatformTabsProps {
  platforms: Platform[];
  active: string;
  onChange: (platform: string) => void;
}
```

**功能**:
- 平台切换
- 显示平台图标
- 激活状态

## 数据类型

```typescript
// 热搜条目
interface TrendingItem {
  id: string;
  title: string;
  url: string;
  hot_value?: string;
  cover?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tag?: string;
  rank: number;
}

// 平台数据
interface PlatformData {
  platform: string;
  platform_name: string;
  icon: string;
  update_time: string;
  items: TrendingItem[];
}

// 平台信息
interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}
```

## API 调用

### 使用 Mock 数据（开发阶段）

```typescript
// lib/api/trending.ts
export async function getTrendingData(platform?: string) {
  // 返回 Mock 数据
  return mockTrendingData;
}
```

### 真实 API（生产环境）

```typescript
export async function getTrendingData(platform?: string) {
  const url = platform 
    ? `/api/trending/${platform}`
    : '/api/trending';
  
  const response = await fetch(url);
  return response.json();
}
```

## 样式设计

### 卡片样式

参考 momoyu.cc 的卡片设计：

- **布局**: 网格布局，响应式
- **卡片**: 白色背景，圆角，阴影
- **排名**: 左侧数字，渐变色
- **标题**: 单行或两行，超出省略
- **热度**: 右下角，灰色小字
- **标签**: 右上角，红色/橙色标签
- **悬停**: 轻微上移，阴影加深

### 配色方案

- **背景**: `#F5F7FA` (浅灰)
- **卡片**: `#FFFFFF` (白色)
- **主色**: `#E11D48` (Rose)
- **次要色**: `#FB7185` (Pink)
- **文字**: `#1F2937` (深灰)
- **次要文字**: `#6B7280` (中灰)

### 排名颜色

- **Top 1**: 渐变金色 `linear-gradient(135deg, #FFD700, #FFA500)`
- **Top 2**: 渐变银色 `linear-gradient(135deg, #C0C0C0, #A8A8A8)`
- **Top 3**: 渐变铜色 `linear-gradient(135deg, #CD7F32, #B87333)`
- **其他**: 灰色 `#9CA3AF`

## 响应式设计

### 断点

- **手机**: < 768px (1 列)
- **平板**: 768px - 1024px (2 列)
- **桌面**: 1024px - 1440px (3 列)
- **大屏**: > 1440px (4 列)

### 布局调整

```css
/* 手机 */
@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* 平板 */
@media (min-width: 768px) and (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* 桌面 */
@media (min-width: 1024px) and (max-width: 1439px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

/* 大屏 */
@media (min-width: 1440px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}
```

## 动画效果

### 卡片进入动画

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;
}

.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 50ms; }
.card:nth-child(3) { animation-delay: 100ms; }
```

### 卡片悬停动画

```css
.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
```

## 性能优化

### 1. 虚拟滚动

对于大量数据，使用虚拟滚动：

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 2. 图片懒加载

```typescript
<img 
  src={item.cover} 
  loading="lazy"
  alt={item.title}
/>
```

### 3. 数据缓存

```typescript
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['trending', platform],
  queryFn: () => getTrendingData(platform),
  staleTime: 10 * 60 * 1000, // 10 分钟
});
```

## 交互优化

### 1. 骨架屏

```typescript
{isLoading && <TrendingSkeleton count={20} />}
```

### 2. 下拉刷新

```typescript
const handleRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};
```

### 3. 错误处理

```typescript
{error && (
  <ErrorState 
    message="加载失败，请稍后重试"
    onRetry={refetch}
  />
)}
```

## Mock 数据

开发阶段使用 Mock 数据：

```typescript
export const mockTrendingData = {
  zhihu: {
    platform: 'zhihu',
    platform_name: '知乎',
    icon: '/icons/zhihu.svg',
    update_time: new Date().toISOString(),
    items: [
      {
        id: '1',
        title: '如何看待某某事件？',
        url: 'https://www.zhihu.com/question/123456',
        hot_value: '1234万热度',
        excerpt: '这是一个热门问题...',
        category: '社会',
        rank: 1,
        tag: '热'
      },
      // ... 更多数据
    ]
  },
  // ... 其他平台
};
```

## 开发步骤

### Phase 1: 基础结构
1. 创建页面路由 `/trending`
2. 创建基础组件结构
3. 添加 Mock 数据

### Phase 2: UI 实现
1. 实现卡片组件
2. 实现平台切换
3. 添加样式和动画

### Phase 3: 功能完善
1. 集成真实 API
2. 添加加载状态
3. 添加错误处理

### Phase 4: 优化
1. 性能优化
2. 响应式适配
3. 无障碍优化

## 测试要点

- [ ] 数据正确显示
- [ ] 平台切换正常
- [ ] 卡片点击跳转
- [ ] 加载状态显示
- [ ] 错误处理正常
- [ ] 响应式布局正常
- [ ] 动画流畅
- [ ] 性能良好

## 部署注意事项

1. **环境变量**
   ```env
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

2. **API 代理**
   ```javascript
   // next.config.js
   async rewrites() {
     return [
       {
         source: '/api/:path*',
         destination: 'https://api.example.com/:path*',
       },
     ];
   }
   ```

3. **缓存策略**
   - 静态资源 CDN 缓存
   - API 数据客户端缓存
   - 图片懒加载

## 参考资源

- [momoyu.cc](https://momoyu.cc/) - 设计参考
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [React Query](https://tanstack.com/query) - 数据获取
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

