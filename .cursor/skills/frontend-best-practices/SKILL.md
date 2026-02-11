---
name: frontend-best-practices
description: 前端最佳实践检查工具。检查 Ant Design、Day.js、Lodash 等第三方库的使用是否合理，避免性能问题和不规范用法。当用户提交代码、创建组件或页面时自动触发检查。
---

# Frontend Best Practices Skill

## 快速开始

当用户说以下关键词时，自动触发此技能：
- "提交代码"
- "创建组件"
- "创建页面"
- "检查代码"
- "优化代码"

## 核心功能

### 1. Ant Design 使用检查

#### ✅ 推荐做法

**按需导入组件**:
```typescript
// ✅ 正确：按需导入
import { Button, Modal, Form, Input } from 'antd';

// ❌ 错误：导入整个库
import antd from 'antd';
```

**使用 ConfigProvider 统一配置**:
```typescript
// ✅ 正确：全局配置
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#E11D48',
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
```

**使用 Form.useForm() 而非 ref**:
```typescript
// ✅ 正确：使用 Hook
import { Form } from 'antd';

function MyForm() {
  const [form] = Form.useForm();
  
  const handleSubmit = async () => {
    const values = await form.validateFields();
    console.log(values);
  };
  
  return <Form form={form}>...</Form>;
}

// ❌ 错误：使用 ref
function MyForm() {
  const formRef = useRef<FormInstance>(null);
  
  const handleSubmit = () => {
    formRef.current?.validateFields();
  };
  
  return <Form ref={formRef}>...</Form>;
}
```

**使用 message/notification 的静态方法**:
```typescript
// ✅ 正确：使用静态方法
import { message } from 'antd';

function MyComponent() {
  const handleClick = () => {
    message.success('操作成功');
  };
  
  return <Button onClick={handleClick}>提交</Button>;
}

// ❌ 错误：使用 hooks（除非需要 contextHolder）
import { message } from 'antd';

function MyComponent() {
  const [messageApi, contextHolder] = message.useMessage();
  
  const handleClick = () => {
    messageApi.success('操作成功');
  };
  
  return (
    <>
      {contextHolder}
      <Button onClick={handleClick}>提交</Button>
    </>
  );
}
```

**合理使用 Table 组件**:
```typescript
// ✅ 正确：使用 rowKey
<Table
  dataSource={data}
  columns={columns}
  rowKey="id"  // 使用唯一标识
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }}
/>

// ❌ 错误：不指定 rowKey
<Table
  dataSource={data}
  columns={columns}
  // 缺少 rowKey，会使用 index 作为 key
/>
```

**避免在循环中创建组件配置**:
```typescript
// ✅ 正确：在组件外定义
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
];

function MyTable() {
  return <Table columns={columns} dataSource={data} />;
}

// ❌ 错误：在组件内定义（每次渲染都会重新创建）
function MyTable() {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
  ];
  
  return <Table columns={columns} dataSource={data} />;
}
```

#### 🚫 常见错误

1. **不要直接修改 antd 的全局样式**
```css
/* ❌ 错误：直接覆盖 antd 样式 */
.ant-btn {
  background: red !important;
}

/* ✅ 正确：使用 CSS Modules 或自定义类名 */
.myButton {
  background: red;
}
```

2. **不要在每个组件中重复配置 locale**
```typescript
// ❌ 错误：重复配置
function MyComponent() {
  return (
    <ConfigProvider locale={zhCN}>
      <DatePicker />
    </ConfigProvider>
  );
}

// ✅ 正确：在根组件配置一次
// 在 layout.tsx 或 _app.tsx 中配置
```

3. **不要滥用 Modal.confirm**
```typescript
// ❌ 错误：每次都创建新的 Modal
function MyComponent() {
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除？',
      onOk: () => deleteItem(),
    });
  };
}

// ✅ 正确：使用 useState 控制 Modal
function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>删除</Button>
      <Modal
        open={open}
        onOk={handleDelete}
        onCancel={() => setOpen(false)}
      >
        确认删除？
      </Modal>
    </>
  );
}
```

---

### 2. Day.js 使用检查

#### ✅ 推荐做法

**统一配置 Day.js**:
```typescript
// lib/dayjs.ts
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;
```

**使用统一的日期格式**:
```typescript
// ✅ 正确：定义常量
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm:ss';

// 使用
import dayjs from '@/lib/dayjs';
import { DATE_FORMAT } from '@/lib/constants';

const formattedDate = dayjs().format(DATE_FORMAT);

// ❌ 错误：硬编码格式
const formattedDate = dayjs().format('YYYY-MM-DD');
```

**合理使用插件**:
```typescript
// ✅ 正确：只导入需要的插件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// 使用
const timeAgo = dayjs(date).fromNow(); // "3 天前"

// ❌ 错误：导入不需要的插件
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
// ... 导入一堆用不到的插件
```

**处理时区**:
```typescript
// ✅ 正确：明确指定时区
import dayjs from '@/lib/dayjs';

const utcTime = dayjs().utc();
const localTime = dayjs().tz('Asia/Shanghai');

// ❌ 错误：不处理时区差异
const time = dayjs(); // 可能导致时区问题
```

**日期比较**:
```typescript
// ✅ 正确：使用 Day.js 方法
const isAfter = dayjs(date1).isAfter(date2);
const isBefore = dayjs(date1).isBefore(date2);
const isSame = dayjs(date1).isSame(date2, 'day');

// ❌ 错误：直接比较字符串
const isAfter = date1 > date2; // 不可靠
```

#### 🚫 常见错误

1. **不要重复创建 dayjs 实例**
```typescript
// ❌ 错误：重复创建
function MyComponent() {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  const yesterday = dayjs().subtract(1, 'day');
}

// ✅ 正确：复用实例
function MyComponent() {
  const today = dayjs();
  const tomorrow = today.add(1, 'day');
  const yesterday = today.subtract(1, 'day');
}
```

2. **不要忘记格式化**
```typescript
// ❌ 错误：直接使用 dayjs 对象
const date = dayjs();
console.log(date); // Dayjs 对象

// ✅ 正确：格式化后使用
const date = dayjs().format('YYYY-MM-DD');
console.log(date); // "2026-02-11"
```

3. **不要混用 Date 和 Day.js**
```typescript
// ❌ 错误：混用
const date = new Date();
const formatted = dayjs(date).format('YYYY-MM-DD');

// ✅ 正确：统一使用 Day.js
const formatted = dayjs().format('YYYY-MM-DD');
```

---

### 3. Lodash 使用检查

#### ✅ 推荐做法

**按需导入**:
```typescript
// ✅ 正确：按需导入
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';

// ❌ 错误：导入整个库
import _ from 'lodash';
```

**使用 debounce 优化搜索**:
```typescript
// ✅ 正确：使用 debounce
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

function SearchInput() {
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      // 执行搜索
      fetchData(value);
    }, 300),
    []
  );
  
  return (
    <Input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="搜索..."
    />
  );
}

// ❌ 错误：不使用 debounce
function SearchInput() {
  const handleSearch = (value: string) => {
    fetchData(value); // 每次输入都会触发
  };
  
  return (
    <Input
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

**使用 throttle 优化滚动事件**:
```typescript
// ✅ 正确：使用 throttle
import { useEffect, useMemo } from 'react';
import throttle from 'lodash/throttle';

function ScrollComponent() {
  const handleScroll = useMemo(
    () => throttle(() => {
      console.log('滚动中...');
    }, 200),
    []
  );
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}

// ❌ 错误：不使用 throttle
function ScrollComponent() {
  useEffect(() => {
    const handleScroll = () => {
      console.log('滚动中...'); // 频繁触发
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
```

**深拷贝对象**:
```typescript
// ✅ 正确：使用 cloneDeep
import cloneDeep from 'lodash/cloneDeep';

const original = { a: { b: { c: 1 } } };
const copy = cloneDeep(original);
copy.a.b.c = 2;
console.log(original.a.b.c); // 1

// ❌ 错误：使用浅拷贝
const copy = { ...original };
copy.a.b.c = 2;
console.log(original.a.b.c); // 2（被修改了）
```

**数组去重**:
```typescript
// ✅ 正确：使用原生方法（性能更好）
const unique = [...new Set(array)];

// ⚠️  可选：使用 lodash（处理对象数组）
import uniqBy from 'lodash/uniqBy';
const unique = uniqBy(array, 'id');

// ❌ 错误：导入整个 lodash
import _ from 'lodash';
const unique = _.uniq(array);
```

**对象操作**:
```typescript
// ✅ 正确：使用 lodash 处理复杂对象
import get from 'lodash/get';
import set from 'lodash/set';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

const value = get(obj, 'a.b.c', 'default');
const newObj = set(obj, 'a.b.c', 'value');
const filtered = omit(obj, ['password', 'token']);
const selected = pick(obj, ['name', 'email']);

// ❌ 错误：手动处理（容易出错）
const value = obj?.a?.b?.c || 'default';
```

#### 🚫 常见错误

1. **不要过度使用 Lodash**
```typescript
// ❌ 错误：简单操作使用 lodash
import map from 'lodash/map';
const result = map(array, item => item.id);

// ✅ 正确：使用原生方法
const result = array.map(item => item.id);
```

2. **不要忘记清理 debounce/throttle**
```typescript
// ❌ 错误：不清理
useEffect(() => {
  const debouncedFn = debounce(handleChange, 300);
  input.addEventListener('change', debouncedFn);
  // 缺少清理
}, []);

// ✅ 正确：清理函数
useEffect(() => {
  const debouncedFn = debounce(handleChange, 300);
  input.addEventListener('change', debouncedFn);
  
  return () => {
    debouncedFn.cancel(); // 取消待执行的函数
    input.removeEventListener('change', debouncedFn);
  };
}, []);
```

3. **不要在循环中使用 debounce/throttle**
```typescript
// ❌ 错误：在循环中创建
items.map(item => {
  const debouncedFn = debounce(() => handleClick(item), 300);
  return <Button onClick={debouncedFn}>{item.name}</Button>;
});

// ✅ 正确：在组件外创建
const debouncedClick = useMemo(
  () => debounce((item) => handleClick(item), 300),
  []
);

items.map(item => (
  <Button onClick={() => debouncedClick(item)}>{item.name}</Button>
));
```

---

## 检查清单

### Ant Design 检查项

- [ ] 是否按需导入组件？
- [ ] 是否使用 ConfigProvider 统一配置？
- [ ] Form 是否使用 Form.useForm()？
- [ ] Table 是否指定 rowKey？
- [ ] 是否避免在组件内定义 columns/options？
- [ ] 是否避免直接修改 antd 全局样式？
- [ ] Modal 是否合理使用？
- [ ] message/notification 是否使用静态方法？

### Day.js 检查项

- [ ] 是否统一配置 Day.js？
- [ ] 是否定义日期格式常量？
- [ ] 是否只导入需要的插件？
- [ ] 是否正确处理时区？
- [ ] 是否使用 Day.js 方法进行日期比较？
- [ ] 是否避免重复创建实例？
- [ ] 是否格式化后再使用？
- [ ] 是否避免混用 Date 和 Day.js？

### Lodash 检查项

- [ ] 是否按需导入函数？
- [ ] 是否避免导入整个库？
- [ ] debounce/throttle 是否使用 useMemo？
- [ ] 是否清理 debounce/throttle？
- [ ] 是否避免过度使用 Lodash？
- [ ] 简单操作是否使用原生方法？
- [ ] 是否避免在循环中创建 debounce/throttle？

---

## 自动检查脚本

### 检查 Ant Design 使用

```bash
# 检查是否导入整个 antd
grep -r "import antd from 'antd'" src/

# 检查是否缺少 rowKey
grep -r "<Table" src/ | grep -v "rowKey"

# 检查是否直接修改 antd 样式
grep -r "\.ant-" src/ --include="*.css" --include="*.scss"
```

### 检查 Day.js 使用

```bash
# 检查是否混用 Date
grep -r "new Date()" src/ --include="*.tsx" --include="*.ts"

# 检查是否硬编码日期格式
grep -r "\.format\(['\"]" src/ --include="*.tsx" --include="*.ts"
```

### 检查 Lodash 使用

```bash
# 检查是否导入整个 lodash
grep -r "import _ from 'lodash'" src/

# 检查是否过度使用 lodash
grep -r "import.*from 'lodash'" src/ | grep -E "(map|filter|find|reduce)"
```

---

## 优化建议

### 性能优化

1. **使用 React.memo 包裹 Ant Design 组件**
```typescript
import { memo } from 'react';
import { Button } from 'antd';

export const MyButton = memo(({ onClick, children }) => (
  <Button onClick={onClick}>{children}</Button>
));
```

2. **使用 useMemo 缓存配置**
```typescript
const columns = useMemo(() => [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
], []);
```

3. **使用 useCallback 缓存事件处理函数**
```typescript
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

### 代码组织

1. **提取常量**
```typescript
// constants/date.ts
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// constants/table.ts
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
```

2. **提取工具函数**
```typescript
// utils/date.ts
import dayjs from '@/lib/dayjs';
import { DATE_FORMAT } from '@/constants/date';

export const formatDate = (date: string | Date) => {
  return dayjs(date).format(DATE_FORMAT);
};

export const getRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow();
};
```

3. **提取 Hooks**
```typescript
// hooks/useDebounce.ts
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  return useMemo(() => debounce(fn, delay), [fn, delay]);
}
```

---

## 使用示例

### 示例 1: 创建表单组件

```typescript
import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
}

export function MyForm() {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 提交数据
      await submitData(values);
      
      message.success('提交成功');
      form.resetFields();
    } catch (error) {
      message.error('提交失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>
      
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
```

### 示例 2: 创建表格组件

```typescript
import { Table } from 'antd';
import { useMemo } from 'react';
import dayjs from '@/lib/dayjs';
import { DATE_FORMAT } from '@/constants/date';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Props {
  data: User[];
  loading: boolean;
}

export function UserTable({ data, loading }: Props) {
  const columns = useMemo(() => [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format(DATE_FORMAT),
    },
  ], []);
  
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
    />
  );
}
```

### 示例 3: 创建搜索组件

```typescript
import { Input } from 'antd';
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

interface Props {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: Props) {
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );
  
  return (
    <Input.Search
      placeholder="搜索..."
      onChange={(e) => debouncedSearch(e.target.value)}
      allowClear
    />
  );
}
```

---

## 工作流程

```
1. 用户创建组件/页面或提交代码
   ↓
2. 触发 Frontend Best Practices Skill
   ↓
3. 执行检查
   ├─ Ant Design 使用检查
   ├─ Day.js 使用检查
   └─ Lodash 使用检查
   ↓
4. 生成检查报告
   ├─ ✅ 符合最佳实践
   ├─ ⚠️  可以优化
   └─ ❌ 不符合规范
   ↓
5. 自动优化
   ├─ 修改导入方式
   ├─ 添加缺失配置
   └─ 优化性能问题
   ↓
6. 生成优化建议
   ↓
7. 确认后提交代码
```

---

## 参考文档

- [Ant Design 官方文档](https://ant.design/)
- [Day.js 官方文档](https://day.js.org/)
- [Lodash 官方文档](https://lodash.com/)
- [React 性能优化](https://react.dev/learn/render-and-commit)
- [组件规范文档](../../frontend/COMPONENT_GUIDELINES.md)

---

## 版本历史

### v1.0.0 (2026-02-11)
- ✨ 初始版本发布
- ✅ Ant Design 使用检查
- ✅ Day.js 使用检查
- ✅ Lodash 使用检查
- ✅ 自动优化功能
- ✅ 性能优化建议
- ✅ 代码组织建议

---

**最后更新**: 2026-02-11  
**维护者**: 开发团队

