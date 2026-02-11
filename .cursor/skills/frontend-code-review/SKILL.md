---
name: frontend-code-review
description: 前端代码审查和重构工具。在提交代码前自动检查代码规范、组件结构、样式规范等，确保代码质量和一致性。当用户要求提交代码、重构代码或进行代码审查时触发此技能。
---

# Frontend Code Review Skill

## 快速开始

当用户说以下关键词时，自动触发此技能：
- "提交代码"
- "代码审查"
- "检查代码"
- "重构代码"
- "code review"

## 核心功能

### 1. 组件结构检查

**检查项**:
- [ ] 组件是否放在正确的目录？
  - 通用组件 → `src/components/`
  - 页面组件 → `src/app/[page]/components/`
- [ ] 组件命名是否符合 PascalCase？
- [ ] 是否使用命名导出而非默认导出？
- [ ] Props 类型是否完整定义？

**检查脚本**:
```bash
# 检查组件位置
find src/components -name "*.tsx" -type f
find src/app/*/components -name "*.tsx" -type f

# 检查命名导出
grep -r "export default function" src/components/
grep -r "export default function" src/app/*/components/
```

### 2. 样式规范检查

**检查项**:
- [ ] 是否使用 CSS Modules？
- [ ] 样式文件命名是否为 `*.module.css`？
- [ ] 是否避免使用全局样式？
- [ ] 是否使用 CSS 变量？

**检查脚本**:
```bash
# 检查 CSS Modules
find src -name "*.css" ! -name "*.module.css" -type f

# 检查全局样式导入
grep -r "import.*\.css" src/ | grep -v "module.css"
```

### 3. TypeScript 类型检查

**检查项**:
- [ ] Props 是否有类型定义？
- [ ] 是否避免使用 `any` 类型？
- [ ] 函数返回值是否有类型？
- [ ] 是否有必要的注释？

**检查脚本**:
```bash
# 检查 any 类型
grep -r ": any" src/

# 检查未定义类型的 Props
grep -r "function.*({.*})" src/ | grep -v "Props"
```

### 4. 组件职责检查

**检查项**:
- [ ] 组件是否职责单一？
- [ ] 组件代码行数是否超过 300 行？
- [ ] 是否有重复代码可以提取？
- [ ] Props 数量是否超过 10 个？

**检查脚本**:
```bash
# 检查组件行数
find src -name "*.tsx" -exec wc -l {} \; | awk '$1 > 300 {print}'

# 检查 Props 数量
grep -A 20 "interface.*Props" src/ | grep -c "  "
```

### 5. 导入路径检查

**检查项**:
- [ ] 通用组件是否使用绝对路径 (`@/components/`)?
- [ ] 页面组件是否使用相对路径 (`./components/`)?
- [ ] 是否有循环依赖？
- [ ] 导入顺序是否规范？

**检查规范**:
```typescript
// ✅ 正确的导入顺序
import { useState } from 'react';              // 1. React 相关
import { useRouter } from 'next/navigation';   // 2. Next.js 相关
import { Modal } from 'antd';                  // 3. 第三方库
import { useAuthStore } from '@/lib/store';    // 4. 项目内部（绝对路径）
import { ProfileSection } from './components'; // 5. 当前目录（相对路径）
import styles from './page.module.css';        // 6. 样式文件
```

### 6. 性能优化检查

**检查项**:
- [ ] 是否使用 `React.memo` 优化重渲染？
- [ ] 是否使用 `useMemo` 和 `useCallback`？
- [ ] 列表渲染是否有 `key` 属性？
- [ ] 是否有不必要的 `useEffect`？

### 7. 可访问性检查

**检查项**:
- [ ] 图片是否有 `alt` 属性？
- [ ] 按钮是否有明确的文本或 `aria-label`？
- [ ] 表单元素是否有 `label`？
- [ ] 是否有合适的语义化标签？

## 工作流程

### 提交前检查流程

```
1. 用户说"提交代码"
   ↓
2. 触发 Frontend Code Review Skill
   ↓
3. 执行自动检查
   ├─ 组件结构检查
   ├─ 样式规范检查
   ├─ TypeScript 类型检查
   ├─ 组件职责检查
   ├─ 导入路径检查
   ├─ 性能优化检查
   └─ 可访问性检查
   ↓
4. 生成检查报告
   ├─ ✅ 通过的检查项
   ├─ ⚠️  警告项（建议优化）
   └─ ❌ 错误项（必须修复）
   ↓
5. 如果有错误项
   ├─ 自动修复（如果可以）
   └─ 提示用户手动修复
   ↓
6. 重新检查
   ↓
7. 全部通过后执行 git commit
```

## 检查规则详解

### 组件分类规则

**通用组件** (`src/components/`):
```typescript
// ✅ 符合通用组件标准
// - 在 2+ 页面使用
// - 功能独立
// - 高可配置性

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function Button({ children, onClick, variant, disabled }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**页面组件** (`src/app/[page]/components/`):
```typescript
// ✅ 符合页面组件标准
// - 仅当前页面使用
// - 包含页面特定逻辑
// - 依赖页面上下文

interface ProfileSectionProps {
  user: User;
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export function ProfileSection({ user, success, error }: ProfileSectionProps) {
  const { setUser } = useAuthStore(); // 页面特定的 store
  // ...
}
```

### 命名规范

**文件命名**:
```
✅ Button.tsx
✅ ProfileSection.tsx
✅ Button.module.css
❌ button.tsx
❌ profile-section.tsx
❌ Button.css
```

**组件导出**:
```typescript
// ✅ 推荐：命名导出
export function Button() { }
export function Modal() { }

// ❌ 避免：默认导出（除非是页面组件）
export default function Button() { }
```

### 样式规范

**CSS Modules**:
```typescript
// ✅ 正确使用
import styles from './Button.module.css';

function Button() {
  return <button className={styles.button}>Click</button>;
}

// ❌ 错误使用
import './Button.css'; // 全局样式
```

**CSS 变量**:
```css
/* ✅ 使用 CSS 变量 */
.button {
  background: var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

/* ❌ 硬编码值 */
.button {
  background: #E11D48;
  border-radius: 8px;
  padding: 16px;
}
```

### TypeScript 规范

**Props 类型定义**:
```typescript
// ✅ 完整的类型定义
interface ButtonProps {
  /** 按钮文本 */
  children: React.ReactNode;
  /** 点击事件 */
  onClick?: () => void;
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'danger';
  /** 是否禁用 */
  disabled?: boolean;
}

// ❌ 缺少类型定义
function Button({ children, onClick, variant, disabled }) {
  // ...
}
```

**避免 any**:
```typescript
// ✅ 使用具体类型
interface User {
  id: string;
  name: string;
  email: string;
}

function UserCard({ user }: { user: User }) { }

// ❌ 使用 any
function UserCard({ user }: { user: any }) { }
```

## 自动修复规则

### 可自动修复的问题

1. **导入路径优化**
   - 将绝对路径转换为相对路径（页面组件）
   - 统一导入顺序

2. **样式文件重命名**
   - 将 `.css` 重命名为 `.module.css`
   - 更新导入语句

3. **组件导出方式**
   - 将默认导出改为命名导出
   - 更新导入语句

4. **代码格式化**
   - 运行 Prettier
   - 修复缩进和空格

### 需要手动修复的问题

1. **组件职责过重**
   - 提示拆分建议
   - 给出重构方案

2. **类型定义缺失**
   - 提示添加类型
   - 给出类型定义示例

3. **性能问题**
   - 提示优化建议
   - 给出优化代码示例

4. **可访问性问题**
   - 提示添加 ARIA 属性
   - 给出改进建议

## 检查报告格式

```markdown
# 前端代码审查报告

## 📊 检查概览
- ✅ 通过: 15 项
- ⚠️  警告: 3 项
- ❌ 错误: 1 项

## ❌ 必须修复的错误

### 1. 组件位置错误
**文件**: `src/components/dashboard/ProfileSection.tsx`
**问题**: 页面组件放在了通用组件目录
**建议**: 移动到 `src/app/dashboard/components/ProfileSection.tsx`
**自动修复**: 是

## ⚠️  建议优化的警告

### 1. 组件代码过长
**文件**: `src/app/dashboard/page.tsx`
**问题**: 组件代码 708 行，建议拆分
**建议**: 拆分为独立的子组件
**自动修复**: 否

### 2. 缺少类型定义
**文件**: `src/components/ui/Button.tsx`
**问题**: Props 缺少 JSDoc 注释
**建议**: 添加详细的类型注释
**自动修复**: 否

## ✅ 通过的检查

- 样式使用 CSS Modules
- 组件命名符合规范
- 导入路径正确
- 无循环依赖
- 列表渲染有 key
- 图片有 alt 属性
- 表单有 label
- 无 any 类型
- 代码格式正确
- 无重复代码
- Props 数量合理
- 使用语义化标签
- 有必要的注释
- 性能优化合理
- 可访问性良好

## 🔧 自动修复

已自动修复 1 个问题：
- ✅ 移动 ProfileSection.tsx 到正确位置

## 📝 下一步操作

1. 手动修复 2 个警告项（可选）
2. 确认所有修改
3. 执行 git commit
```

## 使用示例

### 示例 1: 提交代码前检查

```
用户: 提交代码

AI: 🔍 开始前端代码审查...

📊 检查结果:
- ✅ 组件结构: 通过
- ✅ 样式规范: 通过
- ✅ TypeScript: 通过
- ⚠️  组件职责: 1 个警告
- ✅ 导入路径: 通过
- ✅ 性能优化: 通过
- ✅ 可访问性: 通过

⚠️  发现 1 个警告:
- SecuritySection.tsx (280 行) 建议拆分为更小的组件

是否继续提交？(建议优化后再提交)
```

### 示例 2: 代码重构

```
用户: 重构 dashboard 代码

AI: 🔧 开始代码重构...

检测到以下问题:
1. ❌ 组件位置错误 (5 个文件)
2. ⚠️  组件代码过长 (1 个文件)
3. ⚠️  缺少骨架屏 (5 个组件)

自动修复:
- ✅ 移动组件到正确位置
- ✅ 更新导入路径
- ✅ 创建骨架屏组件

手动优化建议:
- 拆分 SecuritySection 组件
- 添加 Props 注释
- 优化性能

✅ 重构完成！
```

### 示例 3: 代码审查

```
用户: 检查代码

AI: 📋 代码审查报告

✅ 优秀实践:
- 组件结构清晰
- 类型定义完整
- 样式规范统一
- 性能优化良好

💡 改进建议:
- 考虑添加单元测试
- 部分组件可以提取为通用组件
- 可以添加更多的错误处理

总体评分: 9/10
代码质量优秀，可以提交！
```

## 配置文件

### .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## 参考文档

- [组件规范文档](../COMPONENT_GUIDELINES.md)
- [React 最佳实践](https://react.dev/learn)
- [TypeScript 类型系统](https://www.typescriptlang.org/docs/)
- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 组件库](https://ant.design/)

## 版本历史

### v1.0.0 (2026-02-11)
- ✨ 初始版本发布
- ✅ 组件结构检查
- ✅ 样式规范检查
- ✅ TypeScript 类型检查
- ✅ 组件职责检查
- ✅ 导入路径检查
- ✅ 性能优化检查
- ✅ 可访问性检查
- ✅ 自动修复功能
- ✅ 检查报告生成

---

**最后更新**: 2026-02-11  
**维护者**: 开发团队

