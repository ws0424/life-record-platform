# AI Agent Skills

本项目使用 cursor AI 的自定义 skills 来提升开发效率和代码质量。所有 skills 遵循 OpenSkills 规范。

## 📚 Available Skills

### 1. Skill Validator Skill

**文件位置**: `.cursor/skills/skill-validator/SKILL.md`  
**版本**: 1.0.0  
**类别**: 质量保证

#### 📝 描述
Skill 验证工具，用于检查项目中的 skills 是否符合 OpenSkills 标准规范。检查完成后，如果发现问题，会自动建议使用 skill-optimizer 进行优化修复。

#### 🎯 触发关键词
- `检查skill` / `check skill`
- `验证skill` / `validate skill`

---

### 2. Skill Optimizer Skill

**文件位置**: `.cursor/skills/skill-optimizer/SKILL.md`  
**版本**: 1.0.0  
**类别**: 质量保证

#### 📝 描述
Skill 优化工具，根据 skill-validator 的检查报告自动修复和优化 skills。

#### 🎯 触发关键词
- `优化skill` / `optimize skill`
- `修复skill` / `fix skill`

---

### 3. Git Auto Commit Skill

**文件位置**: `.cursor/skills/frontend-design/SKILL.md`  
**版本**: 1.0.0  
**类别**: 前端设计

#### 📝 描述
创建独特的、生产级别的前端界面，具有高设计质量。当用户要求构建 Web 组件、页面、应用程序时使用此技能（例如网站、落地页、仪表板、React 组件、HTML/CSS 布局，或美化任何 Web UI）。生成创意、精致的代码和 UI 设计，避免通用的 AI 美学。

#### 🎯 触发关键词
- `构建页面` / `build page`
- `创建组件` / `create component`
- `设计界面` / `design interface`
- `美化界面` / `beautify UI`
- `前端设计` / `frontend design`

#### ⚡ 主要功能

##### 🎨 设计思维
- **目的分析**：界面解决什么问题？谁使用它？
- **风格定位**：极简主义、极繁主义、复古未来、有机自然、奢华精致、俏皮玩具、编辑杂志、粗野主义、装饰艺术、柔和粉彩、工业实用等
- **约束条件**：技术要求（框架、性能、可访问性）
- **差异化**：什么让这个界面令人难忘？

##### 🎯 美学指南
- **排版**：选择美丽、独特、有趣的字体，避免通用字体（Arial、Inter）
- **色彩主题**：使用 CSS 变量保持一致性，主导色配合鲜明的强调色
  - 支持日间/夜间主题切换
  - 所有颜色、间距、字体通过 CSS 变量定义
  - 详见 [主题系统开发指南](./THEME_SYSTEM_GUIDE.md)
- **动效**：CSS 动画、微交互、页面加载编排、滚动触发、悬停状态
  - 推荐使用流行动画库：Framer Motion (3M+ 下载)、GSAP (1M+ 下载)、Lottie (500K+ 下载)
  - 支持开机动画、滑动动画、页面过渡等效果
  - 详见 [前端动画开发指南](./FRONTEND_ANIMATION_GUIDE.md)
- **空间构图**：非对称布局、重叠、对角线流动、打破网格、负空间
- **背景细节**：渐变网格、噪点纹理、几何图案、分层透明、戏剧性阴影

##### ✅ 设计原则
- 生产级别且功能完整
- 视觉震撼且令人难忘
- 具有清晰的美学观点
- 每个细节都精心打磨
- 避免通用 AI 美学

##### 🚫 避免事项
- ❌ 过度使用的字体（Inter、Roboto、Arial、系统字体）
- ❌ 陈词滥调的配色方案（特别是白色背景上的紫色渐变）
- ❌ 可预测的布局和组件模式
- ❌ 缺乏上下文特色的千篇一律设计

---

### 4. Frontend Design Skill

**文件位置**: `.cursor/skills/git-auto-commit/SKILL.md`  
**版本**: 1.0.0  
**类别**: 版本控制

#### 📝 描述
Git 自动提交工具。根据当前开发阶段和修改内容，自动生成语义化的 commit message，执行 git add、commit 和 push 操作。支持自动识别提交类型（feat/fix/docs/style/refactor等），并推送到远程仓库。适用于快速提交代码变更。

#### 🎯 触发关键词
- `提交代码` / `commit code`
- `git commit`
- `推送代码` / `push code`
- `git push`
- `提交更改` / `commit changes`

#### ⚡ 主要功能

##### 🔍 自动识别提交类型
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试
- `chore:` 构建/工具
- `ci:` CI/CD

##### 📊 智能分析变更
- 分析修改的文件类型
- 识别前端/后端变更
- 检测配置文件修改
- 生成详细的提交正文

##### 🚀 自动化流程
- 检查 Git 状态
- 添加文件到暂存区
- 生成 commit message
- 执行提交
- 推送到远程仓库

##### 📝 Conventional Commits
- 遵循语义化提交规范
- 支持 scope 范围
- 支持多行 body
- 支持 footer（关联 Issue）

#### 📖 使用示例

##### 示例 1: 新增功能
```
用户: 提交代码
AI: 检测到新增文件：frontend/src/app/login/page.tsx
    生成提交：feat(auth): 添加用户登录功能
```

##### 示例 2: 修复 Bug
```
用户: 修复了图片上传的问题，提交一下
AI: 检测到修改：backend/app/services/media_service.py
    生成提交：fix(media): 修复图片上传失败问题
```

##### 示例 3: 文档更新
```
用户: 更新了文档，提交
AI: 检测到修改：README.md, LOCAL_DEVELOPMENT.md
    生成提交：docs: 更新项目文档
```

---

### 5. UI/UX Pro Max Skill

**文件位置**: `.cursor/skills/ui-ux-pro-max/SKILL.md`  
**版本**: 1.0.0  
**类别**: UI/UX 设计

#### 📝 描述
综合性 UI/UX 设计指南工具。包含 67 种样式、96 种调色板、57 种字体配对、99 条 UX 指南和 25 种图表类型，覆盖 13 种技术栈。提供基于优先级的可搜索设计系统推荐，支持设计系统持久化和页面级覆盖。

#### 🎯 触发关键词
- `设计` / `design`
- `UI` / `UX`
- `界面` / `interface`
- `美化` / `beautify`
- `优化界面` / `improve UI`
- `创建页面` / `build page`
- `landing page`

#### ⚡ 主要功能

##### 🎨 设计系统生成
- 自动分析产品类型、行业、风格关键词
- 并行搜索 5 个领域（产品、样式、颜色、落地页、排版）
- 应用推理规则选择最佳匹配
- 返回完整设计系统：模式、样式、颜色、排版、效果
- 包含反模式建议

##### 🔍 领域搜索
- **product** - 产品类型推荐（SaaS、电商、作品集等）
- **style** - UI 样式（玻璃态、极简、暗黑模式等）
- **typography** - 字体配对（Google Fonts）
- **color** - 调色板（按产品类型）
- **landing** - 页面结构、CTA 策略
- **chart** - 图表类型、库推荐
- **ux** - 最佳实践、反模式
- **web** - Web 界面指南（ARIA、焦点、键盘等）

---

### 6. Frontend Code Review Skill

**文件位置**: `.cursor/skills/frontend-code-review/SKILL.md`  
**版本**: 1.0.0  
**类别**: 代码质量

#### 📝 描述
前端代码审查和重构工具。在提交代码前自动检查代码规范、组件结构、样式规范等，确保代码质量和一致性。当用户要求提交代码、重构代码或进行代码审查时触发此技能。

#### 🎯 触发关键词
- `提交代码` / `commit code`
- `代码审查` / `code review`
- `检查代码` / `check code`
- `重构代码` / `refactor code`

---

### 7. Frontend Best Practices Skill

**文件位置**: `.cursor/skills/frontend-best-practices/SKILL.md`  
**版本**: 1.0.0  
**类别**: 代码质量

#### 📝 描述
前端最佳实践检查工具。检查 Ant Design、Day.js、Lodash 等第三方库的使用是否合理，避免性能问题和不规范用法。当用户提交代码、创建组件或页面时自动触发检查。

#### 🎯 触发关键词
- `提交代码` / `commit code`
- `创建组件` / `create component`
- `创建页面` / `create page`
- `检查代码` / `check code`
- `优化代码` / `optimize code`

#### ⚡ 主要功能

##### 🔍 7 大检查项
1. **组件结构检查** - 组件位置、命名规范、导出方式、Props 类型
2. **样式规范检查** - CSS Modules、CSS 变量、避免全局样式
3. **TypeScript 检查** - 类型定义、避免 any、函数返回值类型
4. **组件职责检查** - 代码行数、Props 数量、重复代码
5. **导入路径检查** - 绝对/相对路径、导入顺序、循环依赖
6. **性能优化检查** - React.memo、useMemo、useCallback、key 属性
7. **可访问性检查** - alt 属性、aria-label、label、语义化标签

##### 🔧 自动修复功能
- ✅ 组件位置调整
- ✅ 导入路径优化
- ✅ 样式文件重命名
- ✅ 代码格式化

##### 📊 检查报告
- ✅ 通过项 - 符合规范的检查项
- ⚠️  警告项 - 建议优化的问题
- ❌ 错误项 - 必须修复的问题

##### 📋 检查规则
- 通用组件放在 `src/components/`
- 页面组件放在 `src/app/[page]/components/`
- 组件使用 PascalCase 命名
- 使用命名导出而非默认导出
- 样式文件使用 `*.module.css`
- 避免使用 any 类型
- 组件代码不超过 300 行
- Props 数量不超过 10 个
- 通用组件使用绝对路径 `@/components/`
- 页面组件使用相对路径 `./components/`

---

### 7. Frontend Best Practices Skill

**文件位置**: `.cursor/skills/frontend-best-practices/SKILL.md`  
**版本**: 1.0.0  
**类别**: 代码质量

#### 📝 描述
前端最佳实践检查工具。检查 Ant Design、Day.js、Lodash 等第三方库的使用是否合理，避免性能问题和不规范用法。当用户提交代码、创建组件或页面时自动触发检查。

#### 🎯 触发关键词
- `提交代码` / `commit code`
- `创建组件` / `create component`
- `创建页面` / `create page`
- `检查代码` / `check code`
- `优化代码` / `optimize code`

#### ⚡ 主要功能

##### 📦 Ant Design 检查（8 项）
- 按需导入组件
- ConfigProvider 统一配置
- Form.useForm() 使用
- Table rowKey 检查
- 避免在组件内定义配置
- 避免直接修改全局样式
- Modal 合理使用
- message/notification 静态方法

##### 📅 Day.js 检查（8 项）
- 统一配置 Day.js
- 定义日期格式常量
- 只导入需要的插件
- 正确处理时区
- 使用 Day.js 方法比较日期
- 避免重复创建实例
- 格式化后再使用
- 避免混用 Date 和 Day.js

##### 🔧 Lodash 检查（7 项）
- 按需导入函数
- 避免导入整个库
- debounce/throttle 使用 useMemo
- 清理 debounce/throttle
- 避免过度使用 Lodash
- 简单操作使用原生方法
- 避免在循环中创建 debounce/throttle

##### 🚀 优化建议
- 性能优化（React.memo、useMemo、useCallback）
- 代码组织（提取常量、工具函数、Hooks）
- 最佳实践示例（表单、表格、搜索组件）

#### 📖 使用示例

##### 示例 1: 提交代码前检查
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

是否继续提交？
```

##### 示例 2: 代码重构
```
用户: 重构代码

AI: 🔧 开始代码重构...

检测到以下问题:
1. ❌ 组件位置错误 (5 个文件)
2. ⚠️  组件代码过长 (1 个文件)
3. ⚠️  缺少类型定义 (3 处)

自动修复:
- ✅ 移动组件到正确位置
- ✅ 更新导入路径
- ✅ 格式化代码

手动优化建议:
- 拆分 SecuritySection 组件
- 添加 Props 注释
- 优化性能

✅ 重构完成！
```

##### 示例 3: 代码审查
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

#### 🎯 工作流程
1. **触发检查** - 用户说"提交代码"或"检查代码"
2. **执行检查** - 运行 7 大检查项
3. **生成报告** - 统计通过/警告/错误项
4. **自动修复** - 修复可自动修复的问题
5. **手动修复** - 提示需要手动修复的问题
6. **重新检查** - 确认所有问题已解决
7. **提交代码** - 执行 git commit

#### 📚 参考文档
- [组件规范文档](frontend/COMPONENT_GUIDELINES.md)
- [React 最佳实践](https://react.dev/learn)
- [TypeScript 类型系统](https://www.typescriptlang.org/docs/)
- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 组件库](https://ant.design/)

#### ⚡ 主要功能

##### 🎨 设计系统生成
- 自动分析产品类型、行业、风格关键词
- 并行搜索 5 个领域（产品、样式、颜色、落地页、排版）
- 应用推理规则选择最佳匹配
- 返回完整设计系统：模式、样式、颜色、排版、效果
- 包含反模式建议

##### 🔍 领域搜索
- **product** - 产品类型推荐（SaaS、电商、作品集等）
- **style** - UI 样式（玻璃态、极简、暗黑模式等）
- **typography** - 字体配对（Google Fonts）
- **color** - 调色板（按产品类型）
- **landing** - 页面结构、CTA 策略
- **chart** - 图表类型、库推荐
- **ux** - 最佳实践、反模式
- **web** - Web 界面指南（ARIA、焦点、键盘等）

##### 🛠️ 技术栈支持
- `html-tailwind` - Tailwind 工具类、响应式、无障碍（默认）
- `react` - 状态、Hooks、性能、模式
- `nextjs` - SSR、路由、图片、API 路由
- `vue` - Composition API、Pinia、Vue Router
- `svelte` - Runes、Stores、SvelteKit
- `swiftui` - Views、State、Navigation、Animation
- `react-native` - 组件、导航、列表
- `flutter` - Widgets、State、Layout、主题
- `shadcn` - shadcn/ui 组件、主题、表单、模式
- `jetpack-compose` - Composables、Modifiers、状态提升

##### 💾 设计系统持久化
- 主从模式：`design-system/MASTER.md`（全局规则）
- 页面覆盖：`design-system/pages/[page-name].md`（页面特定规则）
- 层级检索：页面规则优先，回退到主规则

##### ✅ 交付前检查清单
- 无 emoji 图标（使用 SVG）
- 所有可点击元素有 `cursor-pointer`
- 亮色模式文本对比度充足
- 玻璃/透明元素在亮色模式可见
- 悬停状态不引起布局偏移
- 响应式设计（375px、768px、1024px、1440px）

#### 📖 使用示例

##### 生成设计系统（必需的第一步）
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

##### 持久化设计系统（主从模式）
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "fintech crypto dashboard" --design-system --persist -p "CryptoTracker"
```

##### 页面特定覆盖
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "checkout payment" --design-system --persist -p "CryptoTracker" --page "checkout"
```

##### 领域搜索（补充细节）
```bash
# 获取更多样式选项
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "glassmorphism dark" --domain style

# 获取图表推荐
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "real-time dashboard" --domain chart

# 获取 UX 最佳实践
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux
```

##### 技术栈指南（默认：html-tailwind）
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind
```

#### 🎯 工作流程
1. **分析需求** - 提取产品类型、风格关键词、行业、技术栈
2. **生成设计系统** - 使用 `--design-system` 获取完整推荐
3. **补充细节搜索** - 根据需要使用领域搜索获取额外细节
4. **技术栈指南** - 获取实现特定的最佳实践
5. **实现设计** - 综合设计系统和详细搜索结果

#### 🚫 专业 UI 常见规则
- ❌ 不使用 emoji 作为图标（使用 SVG：Heroicons、Lucide）
- ❌ 悬停状态不使用 scale 变换（会导致布局偏移）
- ✅ 所有可点击元素添加 `cursor-pointer`
- ✅ 亮色模式使用 `bg-white/80` 或更高透明度
- ✅ 亮色模式文本使用 `#0F172A`（slate-900）
- ✅ 浮动导航栏添加 `top-4 left-4 right-4` 间距

---

## 🚀 如何使用

### 使用 Skill Validator

```
用户: 检查skill
AI: 🔍 扫描 .cursor/skills 目录...
    验证 skills...
    生成验证报告...
```

### 使用 Skill Optimizer

```
用户: 优化skill
AI: 📊 读取验证报告...
    分析问题...
    执行修复...
    ✅ 已修复问题！
```

### 使用 Git Auto Commit

```
用户: 提交代码
AI: 🔍 分析 Git 变更...
    检测到 5 个文件修改
    识别提交类型：feat
    生成提交信息...
    ✅ 代码已提交并推送！

用户: 修复了一个 bug，提交一下
AI: 📊 分析变更内容...
    识别为 bug 修复
    生成提交：fix: 修复图片上传失败问题
    ✅ 提交完成！

用户: 更新了文档
AI: 📝 检测到文档变更...
    生成提交：docs: 更新项目文档
    推送到远程仓库...
    ✅ 完成！
```

### 使用 Frontend Design

```
用户: 构建一个落地页
AI: 🎨 分析目的和受众...
    确定美学方向...
    选择独特字体和配色...
    实现创意布局和动效...
    ✅ 页面已创建！

用户: 美化这个界面
AI: 🔍 分析当前设计...
    提出创意改进方案...
    应用独特的视觉风格...
    ✅ 界面优化完成！
```

### 使用 UI/UX Pro Max

```
用户: 设计一个美容 SPA 的落地页
AI: 🎨 分析需求...
    生成设计系统...
    提供完整的样式、颜色、字体推荐...
    ✅ 设计系统已生成！

用户: 优化这个界面的 UX
AI: 🔍 检查 UX 最佳实践...
    识别问题...
    提供改进建议...
    ✅ 优化建议已生成！

用户: 创建一个仪表板页面
AI: 🎨 生成设计系统...
    推荐图表类型...
    提供技术栈指南...
    实现设计...
    ✅ 页面已创建！
```

### 使用 Frontend Code Review

```
用户: 提交代码
AI: 🔍 开始前端代码审查...
    执行 7 项检查...
    生成检查报告...
    ✅ 所有检查通过，可以提交！

用户: 检查代码
AI: 📋 代码审查报告...
    ✅ 通过: 15 项
    ⚠️  警告: 3 项
    ❌ 错误: 1 项
    自动修复错误...
    ✅ 修复完成！

用户: 重构代码
AI: 🔧 开始代码重构...
    检测问题...
    自动修复...
    提供优化建议...
    ✅ 重构完成！
```

### 使用 Frontend Best Practices

```
用户: 提交代码
AI: 🔍 检查第三方库使用规范...
    检查 Ant Design...
    检查 Day.js...
    检查 Lodash...
    ✅ 所有检查通过！

用户: 创建表单组件
AI: 📝 创建组件...
    应用 Ant Design 最佳实践...
    使用 Form.useForm()...
    添加表单验证...
    ✅ 组件创建完成！

用户: 优化代码
AI: 🚀 开始优化...
    修改为按需导入...
    添加 useMemo 缓存...
    使用 debounce 优化...
    ✅ 优化完成！
```

---

## 📝 最佳实践

### Skill Validator & Optimizer

**应该做 ✅**
- 添加新 skill 后立即验证
- 定期检查所有 skills
- 遵循 OpenSkills 标准
- 优化前先运行验证

**不应该做 ❌**
- 忽略验证警告
- 不验证就直接优化
- 修改核心功能逻辑

### Git Auto Commit Skill

**应该做 ✅**
- 完成一个小功能就提交
- 使用语义化提交信息
- 提交前检查代码格式
- 编写清晰的提交描述
- 每次提交只做一件事
- 提交前运行测试

**不应该做 ❌**
- 积累太多修改再提交
- 写无意义的提交信息
- 提交敏感信息（密钥、密码）
- 把多个功能混在一起提交
- 提交未测试的代码
- 提交调试代码和注释

### Frontend Design Skill

**应该做 ✅**
- 确定清晰的美学方向
- 选择独特的字体组合
- 使用 CSS 变量保持一致性
- 创建令人难忘的视觉元素
- 注重细节和精致度
- 实现生产级别的代码

**不应该做 ❌**
- 使用通用字体（Inter、Roboto、Arial）
- 陈词滥调的配色（紫色渐变）
- 可预测的布局模式
- 千篇一律的设计
- 忽视美学一致性
- 过度或不足的复杂度

### Frontend Code Review Skill

**应该做 ✅**
- 提交前运行代码检查
- 修复所有错误项
- 优化警告项（建议）
- 遵循组件规范
- 使用 CSS Modules
- 完整的类型定义
- 保持组件职责单一

**不应该做 ❌**
- 跳过代码检查直接提交
- 忽略错误和警告
- 组件放错位置
- 使用全局样式
- 使用 any 类型
- 组件代码过长
- 缺少类型注释

### Frontend Best Practices Skill

**应该做 ✅**
- 按需导入第三方库
- 使用 ConfigProvider 统一配置
- 使用 Form.useForm() 管理表单
- Table 指定 rowKey
- 使用 useMemo 缓存配置
- 使用 debounce/throttle 优化性能
- 统一使用 Day.js 处理日期
- 定义日期格式常量

**不应该做 ❌**
- 导入整个库（antd、lodash）
- 在组件内定义 columns/options
- 直接修改 antd 全局样式
- 混用 Date 和 Day.js
- 过度使用 Lodash
- 在循环中创建 debounce/throttle
- 忘记清理 debounce/throttle
- 硬编码日期格式

---

## 🔧 配置说明

### Skill Validator 配置
- **Skills 目录**: `.cursor/skills/`
- **验证标准**: OpenSkills 规范
- **报告格式**: Markdown

### Skill Optimizer 配置
- **优化级别**: conservative（保守）/ moderate（适中）/ aggressive（激进）
- **自动化程度**: semi-auto（半自动，默认）
- **备份位置**: `.cursor/skills/[skill-name].backup`

### Frontend Design 配置
- **Skills 目录**: `.cursor/skills/frontend-design/`
- **设计原则**: 独特性、生产级别、美学一致性
- **字体选择**: 避免 Inter、Roboto、Arial、系统字体
- **配色方案**: 避免紫色渐变等陈词滥调
- **布局风格**: 非对称、重叠、对角线、打破网格
- **主题系统**: 
  - 支持日间/夜间模式切换
  - 使用 CSS 变量定义所有设计令牌
  - 系统偏好检测和持久化存储
  - 参考文档: [主题系统开发指南](./THEME_SYSTEM_GUIDE.md)
- **动效实现**: CSS 动画、微交互、页面加载编排
- **动画库推荐**: 
  - Framer Motion (3M+ 下载) - React 项目首选
  - GSAP (1M+ 下载) - 专业级动画引擎
  - AOS (500K+ 下载) - 轻量级滚动动画
  - Lottie (500K+ 下载) - 矢量动画播放
  - React Spring (800K+ 下载) - 物理弹簧动画
  - Anime.js (300K+ 下载) - 轻量级动画库
- **动画类型**: 开机动画、滑动动画、页面过渡、微交互、加载动画
- **参考文档**: [前端动画开发指南](./FRONTEND_ANIMATION_GUIDE.md)

### Git Auto Commit 配置
- **Skills 目录**: `.cursor/skills/git-auto-commit/`
- **Git 仓库**: `https://github.com/ws0424/life-record-platform.git`
- **默认分支**: `main`
- **提交规范**: Conventional Commits
- **自动推送**: 启用
- **分析脚本**: `scripts/analyze-commit.py`
- **参考文档**: `references/CONVENTIONAL_COMMITS.md`

### UI/UX Pro Max 配置
- **Skills 目录**: `.cursor/skills/ui-ux-pro-max/`
- **数据库**: 67 样式、96 调色板、57 字体配对、99 UX 指南、25 图表类型
- **默认技术栈**: `html-tailwind`
- **设计系统目录**: `design-system/MASTER.md`（主规则）、`design-system/pages/`（页面覆盖）
- **输出格式**: ASCII box（默认）/ Markdown

### Frontend Code Review 配置
- **Skills 目录**: `.cursor/skills/frontend-code-review/`
- **检查项目**: 7 大检查项（组件结构、样式规范、TypeScript、组件职责、导入路径、性能优化、可访问性）
- **自动修复**: 组件位置、导入路径、样式文件、代码格式
- **报告格式**: Markdown
- **参考文档**: `frontend/COMPONENT_GUIDELINES.md`
- **检查脚本**: `scripts/check-code.sh`

### Frontend Best Practices 配置
- **Skills 目录**: `.cursor/skills/frontend-best-practices/`
- **检查项目**: Ant Design（8 项）、Day.js（8 项）、Lodash（7 项）
- **优化建议**: 性能优化、代码组织、最佳实践示例
- **检查脚本**: `scripts/check-libraries.sh`
- **参考文档**: 
  - [Ant Design 官方文档](https://ant.design/)
  - [Day.js 官方文档](https://day.js.org/)
  - [Lodash 官方文档](https://lodash.com/)

---

## 📚 参考资源

### Skill 文件结构

```
.cursor/skills/
├── skill-validator/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
├── skill-optimizer/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
├── git-auto-commit/
│   ├── SKILL.md
│   ├── references/
│   │   └── CONVENTIONAL_COMMITS.md
│   └── scripts/
│       └── analyze-commit.py
├── frontend-design/
│   ├── SKILL.md
│   └── LICENSE.txt
├── ui-ux-pro-max/
│   ├── SKILL.md
│   ├── data/
│   │   ├── stacks/
│   │   ├── charts.csv
│   │   ├── colors.csv
│   │   ├── icons.csv
│   │   ├── landing.csv
│   │   ├── products.csv
│   │   ├── react-performance.csv
│   │   ├── styles.csv
│   │   ├── typography.csv
│   │   ├── ui-reasoning.csv
│   │   ├── ux-guidelines.csv
│   │   └── web-interface.csv
│   └── scripts/
│       ├── core.py
│       ├── design_system.py
│       └── search.py
└── frontend-code-review/
    ├── SKILL.md
    └── scripts/
        └── check-code.sh
└── frontend-best-practices/
    ├── SKILL.md
    └── scripts/
        └── check-libraries.sh
```

### 扩展阅读
- [OpenSkills 规范](https://github.com/anthropics/skills)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git 官方文档](https://git-scm.com/doc)
- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 文档](https://ant.design/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [React 官方文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Heroicons 图标库](https://heroicons.com/)
- [Lucide 图标库](https://lucide.dev/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [GSAP 文档](https://greensock.com/docs/)
- [Lottie 文档](https://airbnb.io/lottie/)
- [LottieFiles 动画库](https://lottiefiles.com/)
- [CSS Variables (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

## 🔄 版本历史

### Skill Validator v1.0.0 (2026-02-09)
- ✨ 初始版本发布
- ✅ 目录结构验证
- ✅ YAML frontmatter 检查
- ✅ Description 质量评估
- ✅ 自动建议优化功能

### Skill Optimizer v1.0.0 (2026-02-09)
- ✨ 初始版本发布
- ✅ 自动清理空目录
- ✅ 修复 YAML frontmatter
- ✅ 优化 description
- ✅ 备份和回滚机制

### Git Auto Commit v1.0.0 (2026-02-09)
- ✨ 初始版本发布
- ✅ 自动识别提交类型
- ✅ 智能分析代码变更
- ✅ 生成语义化 commit message
- ✅ 支持 Conventional Commits 规范
- ✅ 自动推送到远程仓库
- ✅ Python 分析脚本
- ✅ Shell 提交脚本

### Frontend Design v1.0.0 (2026-02-09)
- ✨ 初始版本发布
- ✅ 设计思维框架
- ✅ 美学指南（排版、色彩、动效、空间、背景）
- ✅ 独特性原则
- ✅ 避免通用 AI 美学
- ✅ 生产级别代码标准

### UI/UX Pro Max v1.0.0 (2026-02-09)
- ✨ 初始版本发布
- ✅ 综合设计系统生成
- ✅ 67 样式、96 调色板、57 字体配对
- ✅ 99 条 UX 指南、25 种图表类型
- ✅ 13 种技术栈支持
- ✅ 设计系统持久化（主从模式）
- ✅ 交付前检查清单
- ✅ 专业 UI 常见规则

### Frontend Code Review v1.0.0 (2026-02-11)
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

### Frontend Best Practices v1.0.0 (2026-02-11)
- ✨ 初始版本发布
- ✅ Ant Design 使用检查（8 项）
- ✅ Day.js 使用检查（8 项）
- ✅ Lodash 使用检查（7 项）
- ✅ 性能优化建议
- ✅ 代码组织建议
- ✅ 最佳实践示例
- ✅ 自动检查脚本

---

## 🤝 贡献指南

### 添加新的 Skill

1. 在 `.cursor/skills/` 目录下创建新的 skill 文件夹
2. 遵循 OpenSkills 规范格式
3. 包含以下部分：
   - YAML frontmatter（name、description）
   - 功能说明
   - 使用示例
   - 工作流程
   - 最佳实践
4. 使用 `检查skill` 验证规范
5. 更新 AGENTS.md

### Skill 文件模板

```markdown
---
name: skill-name
description: 详细描述，包含触发条件和使用场景
---

# Skill 名称

简短说明

## 快速开始

使用步骤

## 核心功能

功能列表

## 示例

使用示例

## 最佳实践

建议和注意事项
```

---

## 💬 反馈与支持

如有问题或建议：
1. 查看对应 skill 的 SKILL.md 文档
2. 使用 `检查skill` 验证规范
3. 参考最佳实践
4. 提出改进建议

---

**最后更新**: 2026-02-11  
**Skills 总数**: 7  
**遵循规范**: OpenSkills

## 📦 项目 Skills

本项目当前包含以下 Skills：

1. **Skill Validator** - Skill 验证工具
2. **Skill Optimizer** - Skill 优化工具
3. **Git Auto Commit** - Git 自动提交工具
4. **Frontend Design** - 前端设计指南
5. **UI/UX Pro Max** - UI/UX 设计系统
6. **Frontend Code Review** - 前端代码审查工具
7. **Frontend Best Practices** - 前端最佳实践检查工具 ⭐ 新增

## 🔗 相关文档

- [项目说明](./README.md)
- [快速启动](./QUICKSTART.md)
- [本地开发指南](./LOCAL_DEVELOPMENT.md)
- [Git 推送指南](./GIT_PUSH_GUIDE.md)
- [项目总结](./PROJECT_SUMMARY.md)
- [前端动画开发指南](./FRONTEND_ANIMATION_GUIDE.md)
- [主题系统开发指南](./THEME_SYSTEM_GUIDE.md)
- [组件规范文档](./frontend/COMPONENT_GUIDELINES.md) ⭐ 新增
