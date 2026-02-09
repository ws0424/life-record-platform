# 前端项目

基于 Next.js 14 + TypeScript + Framer Motion 的现代化前端应用。

## ✨ 特性

- 🎨 **主题切换** - 支持日间/夜间模式，自动检测系统偏好
- 🎬 **动画效果** - 使用 Framer Motion 实现流畅的页面动画
- 📱 **响应式设计** - 适配所有设备尺寸
- 🎯 **CSS 变量** - 完整的设计令牌系统
- ⚡ **性能优化** - 服务端渲染，快速加载
- 🔧 **TypeScript** - 类型安全

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── daily/             # 日常记录页面
├── components/            # React 组件
│   ├── common/            # 通用组件
│   │   └── ThemeToggle.tsx
│   └── layout/            # 布局组件
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                   # 工具库
│   └── ThemeContext.tsx   # 主题上下文
└── styles/                # 样式文件
    └── theme.css          # CSS 变量和全局样式
```

## 🎨 主题系统

项目使用 CSS 变量实现主题系统，支持：

- 日间/夜间模式切换
- 系统偏好自动检测
- 用户选择持久化
- 防止主题闪烁

详见 [主题系统开发指南](../../THEME_SYSTEM_GUIDE.md)

## 🎬 动画效果

使用 Framer Motion 实现：

- 页面进入/退出动画
- 滚动触发动画
- 悬停交互效果
- 平滑过渡

详见 [前端动画开发指南](../../FRONTEND_ANIMATION_GUIDE.md)

## 🔧 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Framer Motion** - 动画库
- **CSS Modules** - 样式方案
- **Ant Design** - UI 组件库

## 📝 开发规范

### CSS 变量使用

```css
/* 使用 CSS 变量 */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### 组件命名

- 使用 PascalCase：`ThemeToggle.tsx`
- 样式文件：`ThemeToggle.module.css`

### 动画实现

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  内容
</motion.div>
```

## 🌐 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 相关文档

- [项目说明](../../README.md)
- [主题系统开发指南](../../THEME_SYSTEM_GUIDE.md)
- [前端动画开发指南](../../FRONTEND_ANIMATION_GUIDE.md)
- [Next.js 文档](https://nextjs.org/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

