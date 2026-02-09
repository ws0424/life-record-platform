# 前端主题系统开发指南

## 📚 目录

- [概述](#概述)
- [CSS 变量设计](#css-变量设计)
- [主题切换实现](#主题切换实现)
- [React 实现方案](#react-实现方案)
- [Next.js 实现方案](#nextjs-实现方案)
- [Vue 实现方案](#vue-实现方案)
- [Tailwind CSS 集成](#tailwind-css-集成)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 概述

本指南提供完整的日间/夜间主题切换解决方案，使用 CSS 变量实现主题系统，支持多种框架和技术栈。

### 核心特性

- 🎨 **CSS 变量驱动** - 所有颜色、间距、字体等通过变量定义
- 🌓 **日间/夜间模式** - 平滑切换，支持系统偏好
- 💾 **持久化存储** - 记住用户选择
- ⚡ **性能优化** - 避免闪烁，快速切换
- 🎯 **类型安全** - TypeScript 支持
- 📱 **响应式** - 适配所有设备

---

## CSS 变量设计

### 基础变量结构

```css
/* styles/theme.css */
:root {
  /* ===== 颜色系统 ===== */
  
  /* 主色调 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;
  
  /* 次要色 */
  --color-secondary: #8b5cf6;
  --color-secondary-hover: #7c3aed;
  
  /* 成功/错误/警告/信息 */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #06b6d4;
  
  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --bg-elevated: #ffffff;
  
  /* 文本色 */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --text-inverse: #ffffff;
  
  /* 边框色 */
  --border-primary: #e5e7eb;
  --border-secondary: #d1d5db;
  --border-focus: #3b82f6;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* ===== 间距系统 ===== */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* ===== 字体系统 ===== */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* ===== 圆角系统 ===== */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
  
  /* ===== 过渡动画 ===== */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  
  /* ===== Z-index 层级 ===== */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* ===== 暗色主题 ===== */
[data-theme="dark"] {
  /* 主色调（暗色模式下稍微调亮） */
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-primary-active: #2563eb;
  
  /* 次要色 */
  --color-secondary: #a78bfa;
  --color-secondary-hover: #8b5cf6;
  
  /* 成功/错误/警告/信息 */
  --color-success: #34d399;
  --color-error: #f87171;
  --color-warning: #fbbf24;
  --color-info: #22d3ee;
  
  /* 背景色 */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-elevated: #1e293b;
  
  /* 文本色 */
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-inverse: #0f172a;
  
  /* 边框色 */
  --border-primary: #334155;
  --border-secondary: #475569;
  --border-focus: #60a5fa;
  
  /* 阴影（暗色模式下更深） */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}

/* ===== 系统偏好检测 ===== */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 如果用户没有手动设置主题，跟随系统 */
    --color-primary: #60a5fa;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    /* ... 其他暗色变量 */
  }
}

/* ===== 组件样式示例 ===== */
.button {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-base);
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.card {
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}
```

---

## 主题切换实现

### 原生 JavaScript 实现

```javascript
// utils/theme.js

/**
 * 主题管理器
 */
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'theme-preference';
    this.THEME_ATTR = 'data-theme';
    this.init();
  }

  /**
   * 初始化主题
   */
  init() {
    // 1. 从 localStorage 读取
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    // 2. 如果没有保存，检测系统偏好
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    
    // 3. 应用主题
    const theme = savedTheme || systemTheme;
    this.setTheme(theme);
    
    // 4. 监听系统主题变化
    this.watchSystemTheme();
  }

  /**
   * 设置主题
   */
  setTheme(theme) {
    document.documentElement.setAttribute(this.THEME_ATTR, theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /**
   * 切换主题
   */
  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * 获取当前主题
   */
  getTheme() {
    return document.documentElement.getAttribute(this.THEME_ATTR) || 'light';
  }

  /**
   * 监听系统主题变化
   */
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // 只有在用户没有手动设置时才跟随系统
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// 导出单例
export const themeManager = new ThemeManager();
```

### 防止闪烁的脚本

```html
<!-- 在 <head> 中尽早执行，防止主题闪烁 -->
<script>
  (function() {
    const theme = localStorage.getItem('theme-preference') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

---

## React 实现方案

### 方案 1: Context + Hook

```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 服务端渲染时返回默认值
    if (typeof window === 'undefined') return 'light';
    
    // 从 localStorage 读取
    const saved = localStorage.getItem('theme-preference') as Theme;
    if (saved) return saved;
    
    // 检测系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  useEffect(() => {
    // 应用主题
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-preference')) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 主题切换按钮组件

```typescript
// components/ThemeToggle.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <Sun className="icon" />
      ) : (
        <Moon className="icon" />
      )}
    </button>
  );
}
```

```css
/* components/ThemeToggle.css */
.theme-toggle {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.theme-toggle:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.05);
}

.theme-toggle .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-primary);
  transition: transform var(--transition-base);
}

.theme-toggle:hover .icon {
  transform: rotate(15deg);
}
```

### 使用示例

```typescript
// app/layout.tsx 或 _app.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/theme.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 防止闪烁 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme-preference') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `
        }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Next.js 实现方案

### 使用 next-themes 库

```bash
npm install next-themes
```

```typescript
// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers';
import '@/styles/theme.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

```typescript
// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // 占位符
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="theme-toggle"
      aria-label="切换主题"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

## Vue 实现方案

### Composition API

```typescript
// composables/useTheme.ts
import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  const initTheme = () => {
    // 从 localStorage 读取
    const saved = localStorage.getItem('theme-preference') as Theme;
    if (saved) {
      setTheme(saved);
      return;
    }

    // 检测系统偏好
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    setTheme(systemTheme);

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-preference')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  onMounted(() => {
    initTheme();
  });

  return {
    theme,
    setTheme,
    toggleTheme
  };
}
```

```vue
<!-- components/ThemeToggle.vue -->
<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle"
    aria-label="切换主题"
  >
    <Moon v-if="theme === 'light'" />
    <Sun v-else />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { Moon, Sun } from 'lucide-vue-next';

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.theme-toggle:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.05);
}
</style>
```

---

## Tailwind CSS 集成

### 配置 Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          elevated: 'var(--bg-elevated)',
        },
        
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          focus: 'var(--border-focus)',
        }
      },
      
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      }
    }
  }
};
```

### 使用 Tailwind 类

```jsx
<div className="bg-bg-primary text-text-primary border border-border-primary rounded-lg p-md shadow-md">
  <h2 className="text-2xl font-semibold mb-sm">标题</h2>
  <p className="text-text-secondary">内容</p>
  <button className="bg-primary text-white px-md py-sm rounded-md hover:bg-primary/90 transition-base">
    按钮
  </button>
</div>
```


---

## 最佳实践

### 1. 颜色对比度

确保文本在两种主题下都有足够的对比度（WCAG AA 标准：4.5:1）

```css
/* ✅ 好 - 高对比度 */
:root {
  --text-primary: #111827;  /* 深灰 */
  --bg-primary: #ffffff;    /* 白色 */
}

[data-theme="dark"] {
  --text-primary: #f1f5f9;  /* 浅灰 */
  --bg-primary: #0f172a;    /* 深蓝 */
}

/* ❌ 避免 - 对比度不足 */
:root {
  --text-primary: #9ca3af;  /* 太浅 */
  --bg-primary: #ffffff;
}
```

### 2. 语义化命名

使用语义化的变量名，而不是具体的颜色值

```css
/* ✅ 好 - 语义化 */
--color-primary
--color-success
--bg-elevated
--text-secondary

/* ❌ 避免 - 具体颜色 */
--color-blue
--color-green
--bg-white
--text-gray
```

### 3. 渐进增强

为不支持 CSS 变量的浏览器提供回退

```css
.button {
  /* 回退值 */
  background-color: #3b82f6;
  /* CSS 变量 */
  background-color: var(--color-primary, #3b82f6);
}
```

### 4. 避免硬编码颜色

```jsx
/* ❌ 避免 - 硬编码 */
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  内容
</div>

/* ✅ 好 - 使用 CSS 变量 */
<div style={{ 
  backgroundColor: 'var(--bg-primary)', 
  color: 'var(--text-primary)' 
}}>
  内容
</div>

/* ✅ 更好 - 使用 CSS 类 */
<div className="bg-bg-primary text-text-primary">
  内容
</div>
```

### 5. 图片和图标适配

```css
/* 暗色模式下调整图片亮度 */
[data-theme="dark"] img {
  filter: brightness(0.9);
}

/* Logo 切换 */
.logo-light {
  display: block;
}

.logo-dark {
  display: none;
}

[data-theme="dark"] .logo-light {
  display: none;
}

[data-theme="dark"] .logo-dark {
  display: block;
}
```

```jsx
// React 组件
function Logo() {
  const { theme } = useTheme();
  
  return (
    <img 
      src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'} 
      alt="Logo" 
    />
  );
}
```

### 6. 平滑过渡

```css
/* 为主题切换添加过渡效果 */
* {
  transition: 
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base);
}

/* 但要排除动画和变换 */
*,
*::before,
*::after {
  transition-property: background-color, border-color, color, fill, stroke;
}
```

### 7. 性能优化

```javascript
// 使用 CSS.supports 检测支持
if (CSS.supports('color', 'var(--test)')) {
  // 浏览器支持 CSS 变量
  applyTheme();
}

// 使用 requestAnimationFrame 批量更新
function applyTheme(theme) {
  requestAnimationFrame(() => {
    document.documentElement.setAttribute('data-theme', theme);
  });
}
```

### 8. TypeScript 类型定义

```typescript
// types/theme.ts
export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}

// 获取 CSS 变量的类型安全函数
export function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
```

---

## 完整示例

### 示例 1: 简单的卡片组件

```tsx
// components/Card.tsx
import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

```css
/* components/Card.module.css */
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.card.elevated {
  background-color: var(--bg-elevated);
  box-shadow: var(--shadow-lg);
}

.card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
}

.title {
  color: var(--text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.content {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}
```

### 示例 2: 导航栏

```tsx
// components/Navbar.tsx
import { ThemeToggle } from './ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/logo.svg" alt="Logo" />
          <span>我的应用</span>
        </div>
        
        <div className={styles.menu}>
          <a href="/" className={styles.link}>首页</a>
          <a href="/about" className={styles.link}>关于</a>
          <a href="/contact" className={styles.link}>联系</a>
        </div>
        
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

```css
/* components/Navbar.module.css */
.navbar {
  background-color: var(--bg-elevated);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(10px);
  background-color: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.logo img {
  width: 32px;
  height: 32px;
}

.menu {
  display: flex;
  gap: var(--spacing-lg);
}

.link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-base);
  position: relative;
}

.link:hover {
  color: var(--text-primary);
}

.link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary);
  transition: width var(--transition-base);
}

.link:hover::after {
  width: 100%;
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}
```

### 示例 3: 表单组件

```tsx
// components/Input.tsx
import { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input 
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
```

```css
/* components/Input.module.css */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.input {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input.error {
  border-color: var(--color-error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.errorText {
  color: var(--color-error);
  font-size: var(--font-size-xs);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

---

## 常见问题

### Q1: 如何避免主题切换时的闪烁？

**A**: 在 HTML 加载时尽早执行主题脚本

```html
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('theme-preference') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <!-- 其他 head 内容 -->
</head>
```

### Q2: 如何处理第三方组件的主题？

**A**: 使用 CSS 变量覆盖第三方组件样式

```css
/* 覆盖 Ant Design */
.ant-btn-primary {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

/* 覆盖 Material-UI */
.MuiButton-containedPrimary {
  background-color: var(--color-primary) !important;
}
```

### Q3: 如何在 JavaScript 中读取 CSS 变量？

**A**: 使用 `getComputedStyle`

```javascript
// 读取变量
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary')
  .trim();

// 设置变量
document.documentElement.style.setProperty('--color-primary', '#ff0000');
```

### Q4: 如何支持多个主题（不只是亮/暗）？

**A**: 扩展主题系统

```css
/* 蓝色主题 */
[data-theme="blue"] {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}

/* 绿色主题 */
[data-theme="green"] {
  --color-primary: #10b981;
  --color-secondary: #06b6d4;
}

/* 紫色主题 */
[data-theme="purple"] {
  --color-primary: #8b5cf6;
  --color-secondary: #ec4899;
}
```

```typescript
type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple';
```

### Q5: 如何测试主题切换？

**A**: 编写测试用例

```typescript
// __tests__/theme.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('Theme System', () => {
  it('should toggle theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    
    // 初始主题
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    // 切换到暗色
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    // 切换回亮色
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
  
  it('should persist theme preference', () => {
    localStorage.setItem('theme-preference', 'dark');
    
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
```

---

## 资源链接

- [CSS Variables (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [prefers-color-scheme (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [WCAG 对比度指南](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

## 快速检查清单

- [ ] 定义完整的 CSS 变量系统
- [ ] 实现亮色和暗色两套主题
- [ ] 添加主题切换按钮
- [ ] 支持系统偏好检测
- [ ] 持久化用户选择
- [ ] 防止主题闪烁
- [ ] 确保颜色对比度符合 WCAG 标准
- [ ] 为所有组件使用 CSS 变量
- [ ] 测试主题切换功能
- [ ] 适配第三方组件库

---

**最后更新**: 2026-02-09  
**维护者**: 前端开发团队
