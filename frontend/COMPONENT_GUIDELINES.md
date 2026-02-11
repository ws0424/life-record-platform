# 前端组件规范文档

## 📁 组件目录结构

### 通用组件 (Common Components)

**位置**: `frontend/src/components/`

**说明**: 可在多个页面复用的通用组件

**示例**:
```
frontend/src/components/
├── ui/                      # UI 基础组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── layout/                  # 布局组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── auth/                    # 认证相关组件
│   └── TokenVerifier.tsx
└── providers/               # 全局 Provider
    ├── AntdProvider.tsx
    └── ThemeProvider.tsx
```

### 页面组件 (Page Components)

**位置**: `frontend/src/app/[page]/components/`

**说明**: 仅在当前页面使用的组件拆分

**示例**:
```
frontend/src/app/dashboard/
├── page.tsx                 # 主页面文件
├── page.module.css          # 页面样式
└── components/              # 页面专属组件
    ├── ProfileSection.tsx
    ├── SecuritySection.tsx
    ├── ActivitySection.tsx
    ├── DevicesSection.tsx
    ├── BindingsSection.tsx
    ├── Skeleton.tsx
    └── Skeleton.module.css
```

## 📋 组件分类规则

### 通用组件 (放在 `src/components/`)

**判断标准**:
- ✅ 在 2 个或以上页面使用
- ✅ 功能独立，不依赖特定页面逻辑
- ✅ 可配置性强，通过 props 控制行为
- ✅ 具有通用性，可在不同场景复用

**示例**:
```typescript
// ✅ 通用组件示例
// frontend/src/components/ui/Button.tsx
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

### 页面组件 (放在 `src/app/[page]/components/`)

**判断标准**:
- ✅ 仅在当前页面使用
- ✅ 包含页面特定的业务逻辑
- ✅ 依赖页面上下文或状态
- ✅ 不需要在其他页面复用

**示例**:
```typescript
// ✅ 页面组件示例
// frontend/src/app/dashboard/components/ProfileSection.tsx
interface ProfileSectionProps {
  user: any;
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export function ProfileSection({ user, success, error }: ProfileSectionProps) {
  // 页面特定的业务逻辑
  const handleSubmit = async () => {
    // ...
  };

  return (
    <div>
      {/* 个人信息表单 */}
    </div>
  );
}
```

## 🎯 组件命名规范

### 文件命名

**通用组件**:
- PascalCase: `Button.tsx`, `Modal.tsx`
- 样式文件: `Button.module.css`

**页面组件**:
- PascalCase + Section/Item 后缀: `ProfileSection.tsx`, `DeviceItem.tsx`
- 样式文件: `ProfileSection.module.css`

### 组件导出

```typescript
// ✅ 推荐：命名导出
export function Button() { }
export function Modal() { }

// ❌ 避免：默认导出（除非是页面组件）
export default function Button() { }
```

## 📦 组件结构示例

### 通用组件结构

```
frontend/src/components/ui/Button/
├── Button.tsx              # 组件实现
├── Button.module.css       # 组件样式
├── Button.test.tsx         # 单元测试
└── index.ts                # 导出文件
```

**index.ts**:
```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### 页面组件结构

```
frontend/src/app/dashboard/components/
├── ProfileSection.tsx      # 个人信息组件
├── SecuritySection.tsx     # 安全设置组件
├── Skeleton.tsx            # 骨架屏组件
└── Skeleton.module.css     # 骨架屏样式
```

## 🔄 组件迁移规则

### 从页面组件升级为通用组件

**场景**: 当页面组件需要在其他页面使用时

**步骤**:
1. 移动组件到 `src/components/` 对应目录
2. 移除页面特定的依赖和逻辑
3. 增加 props 配置，提高可复用性
4. 更新导入路径
5. 添加单元测试

**示例**:
```typescript
// ❌ 页面组件（依赖页面上下文）
function ProfileSection({ user, success, error }) {
  const { setUser } = useAuthStore(); // 页面特定
  // ...
}

// ✅ 通用组件（通过 props 传递）
interface ProfileFormProps {
  initialData: UserData;
  onSubmit: (data: UserData) => Promise<void>;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

function ProfileForm({ initialData, onSubmit, onSuccess, onError }: ProfileFormProps) {
  // 不依赖页面上下文
  // ...
}
```

## 📝 组件文档规范

### 组件注释

```typescript
/**
 * 个人信息编辑组件
 * 
 * @description 用于编辑用户个人信息，包括用户名、简介等
 * @example
 * ```tsx
 * <ProfileSection 
 *   user={user} 
 *   success={(msg) => toast.success(msg)}
 *   error={(msg) => toast.error(msg)}
 * />
 * ```
 */
export function ProfileSection({ user, success, error }: ProfileSectionProps) {
  // ...
}
```

### Props 类型定义

```typescript
/**
 * ProfileSection 组件属性
 */
interface ProfileSectionProps {
  /** 用户信息对象 */
  user: User;
  /** 成功回调函数 */
  success: (message: string) => void;
  /** 错误回调函数 */
  error: (message: string) => void;
  /** 是否显示编辑按钮 */
  showEditButton?: boolean;
}
```

## 🎨 样式规范

### CSS Modules

**通用组件**:
```css
/* Button.module.css */
.button {
  /* 基础样式 */
}

.primary {
  /* 主要按钮样式 */
}

.secondary {
  /* 次要按钮样式 */
}
```

**页面组件**:
```css
/* ProfileSection.module.css */
.section {
  /* 区域样式 */
}

.form {
  /* 表单样式 */
}
```

### 样式导入

```typescript
// ✅ 推荐：CSS Modules
import styles from './Button.module.css';

// ✅ 推荐：页面样式
import styles from '../page.module.css';

// ❌ 避免：全局样式
import './Button.css';
```

## 📊 当前项目组件分布

### 通用组件

```
frontend/src/components/
├── ui/
│   └── Toast.tsx                    # Toast 提示组件
├── layout/
│   ├── Header.tsx                   # 页头组件
│   └── Footer.tsx                   # 页脚组件
├── auth/
│   └── TokenVerifier.tsx            # Token 验证组件
└── providers/
    └── AntdProvider.tsx             # Ant Design 配置
```

### 页面组件

```
frontend/src/app/dashboard/components/
├── ProfileSection.tsx               # 个人信息组件
├── SecuritySection.tsx              # 安全设置组件
├── ActivitySection.tsx              # 最新动态组件
├── DevicesSection.tsx               # 登录设备组件
├── BindingsSection.tsx              # 账号绑定组件
├── Skeleton.tsx                     # 骨架屏组件
└── Skeleton.module.css              # 骨架屏样式
```

## ✅ 最佳实践

### 1. 组件职责单一

```typescript
// ✅ 好的实践：职责单一
function UserAvatar({ src, alt }: AvatarProps) { }
function UserInfo({ name, email }: UserInfoProps) { }

// ❌ 不好的实践：职责混乱
function UserCard({ src, alt, name, email, bio, actions }: UserCardProps) { }
```

### 2. Props 设计

```typescript
// ✅ 好的实践：清晰的 Props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// ❌ 不好的实践：过多的 Props
interface ButtonProps {
  text: string;
  icon: string;
  color: string;
  size: string;
  // ... 20+ props
}
```

### 3. 组件组合

```typescript
// ✅ 好的实践：组件组合
<Card>
  <CardHeader title="标题" />
  <CardBody>{content}</CardBody>
  <CardFooter>{actions}</CardFooter>
</Card>

// ❌ 不好的实践：巨型组件
<Card 
  title="标题"
  content={content}
  actions={actions}
  showHeader={true}
  showFooter={true}
  // ...
/>
```

### 4. 状态管理

```typescript
// ✅ 好的实践：状态提升
function Parent() {
  const [data, setData] = useState();
  return <Child data={data} onChange={setData} />;
}

// ❌ 不好的实践：深层状态传递
function Parent() {
  return <Child1><Child2><Child3 /></Child2></Child1>;
}
```

## 🔍 组件审查清单

在创建或修改组件时，请检查：

- [ ] 组件是否放在正确的目录？
- [ ] 组件命名是否符合规范？
- [ ] Props 类型是否完整定义？
- [ ] 是否有必要的注释和文档？
- [ ] 样式是否使用 CSS Modules？
- [ ] 是否遵循单一职责原则？
- [ ] 是否可以进一步拆分？
- [ ] 是否有重复代码可以提取？

## 📚 参考资源

- [React 组件设计模式](https://react.dev/learn/thinking-in-react)
- [CSS Modules 文档](https://github.com/css-modules/css-modules)
- [TypeScript 类型定义](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Ant Design 组件库](https://ant.design/components/overview-cn)

---

**最后更新**: 2026-02-11  
**维护者**: 开发团队

