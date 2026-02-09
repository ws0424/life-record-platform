# AI Agent Skills

本项目使用 Claude AI 的自定义 skills 来提升开发效率和代码质量。所有 skills 遵循 OpenSkills 规范。

## 📚 Available Skills

### 1. Code Optimization Skill

**文件位置**: `.cursor/skills/code-optimization/SKILL.md`  
**版本**: 1.0.0  
**类别**: 代码质量

#### 📝 描述
自动化代码检查与优化工具，帮助清理无效代码、使用 lodash 优化、提升代码质量和性能。

#### 🎯 触发关键词
- `检查代码` / `code review`
- `优化代码` / `optimize code`
- `clean code`

---

### 2. Skill Validator Skill

**文件位置**: `.cursor/skills/skill-validator/SKILL.md`  
**版本**: 1.0.0  
**类别**: 质量保证

#### 📝 描述
Skill 验证工具，用于检查项目中的 skills 是否符合 OpenSkills 标准规范。检查完成后，如果发现问题，会自动建议使用 skill-optimizer 进行优化修复。

#### 🎯 触发关键词
- `检查skill` / `check skill`
- `验证skill` / `validate skill`

---

### 3. Skill Optimizer Skill

**文件位置**: `.cursor/skills/skill-optimizer/SKILL.md`  
**版本**: 1.0.0  
**类别**: 质量保证

#### 📝 描述
Skill 优化工具，根据 skill-validator 的检查报告自动修复和优化 skills。

#### 🎯 触发关键词
- `优化skill` / `optimize skill`
- `修复skill` / `fix skill`

---

### 4. Component Encapsulation Skill

**文件位置**: `.cursor/skills/component-encapsulation/SKILL.md`  
**版本**: 1.0.0  
**类别**: 组件开发

#### 📝 描述
Vue 组件封装工具。当用户说"封装组件"、"创建组件"、"component encapsulation"时使用此技能。帮助识别需要封装的代码片段，创建可复用的 Vue 组件，并按照项目规范组织组件文件结构（组件名称/index.vue）。适用于提取重复代码、创建通用组件、优化项目结构等场景。

#### 🎯 触发关键词
- `封装组件` / `encapsulate component`
- `创建组件` / `create component`
- `提取组件` / `extract component`
- `组件化` / `componentize`

#### ⚡ 主要功能

##### 🔍 封装场景识别
- 识别代码重复（3个及以上位置）
- 识别复杂业务逻辑（超过500行）
- 识别通用UI组件
- 识别第三方库封装需求
- 识别复杂表单验证逻辑
- 识别复杂状态管理

##### 📁 文件结构规范
- 组件文件夹：`src/components/ComponentName/`
- 主文件：`index.vue`
- 工具函数：`utils.js`
- 常量定义：`constants.js`
- 组合式函数：`hooks.js`
- 组件资源：`assets/`

##### 🛠️ 组件设计
- Props 设计（类型、默认值、验证）
- Events 设计（命名清晰、参数明确）
- Slots 设计（灵活可扩展）
- 单一职责原则
- 数据流规范（Props向下，Events向上）

##### 💡 实战示例
- 搜索表单组件封装
- 数据表格组件封装
- 弹窗表单组件封装

---

### 5. Frontend Design Skill

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
- **动效**：CSS 动画、微交互、页面加载编排、滚动触发、悬停状态
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

### 6. UI/UX Pro Max Skill

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

### 使用 Code Optimization

```
用户: 检查代码
AI: 🔍 分析当前文件... 发现 5 个问题

用户: 优化代码  
AI: ✨ 执行优化... 完成！
```

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

### 使用 Component Encapsulation

```
用户: 封装组件
AI: 🔍 分析代码...
    识别封装场景...
    设计组件接口...
    创建组件文件...
    ✅ 组件封装完成！

用户: 这段代码需要封装吗？
AI: 📊 分析代码特征...
    评估封装必要性...
    给出建议...
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

用户: 设计一个仪表板
AI: 🎨 确定设计风格...
    创建独特的视觉语言...
    实现精致的交互细节...
    ✅ 仪表板已完成！
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

---

## 📝 最佳实践

### Code Optimization Skill

**应该做 ✅**
- 优化前备份代码
- 优化后充分测试
- 保持代码可读性
- 优先使用 lodash（命名导入）
- 优雅处理错误

**不应该做 ❌**
- 删除模板中使用的方法
- 过度优化可读代码
- 破坏现有功能

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

### Component Encapsulation Skill

**应该做 ✅**
- 单一职责原则
- Props 向下，Events 向上
- 提供默认值和插槽
- 使用 scoped 样式
- 编写清晰的文档
- 遵循命名规范（PascalCase）

**不应该做 ❌**
- 过度封装简单组件
- 在通用组件中写业务逻辑
- 直接修改 Props
- 组件嵌套超过 3 层
- 超过 10 个 Props

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

---

## 🔧 配置说明

### Code Optimization 配置
- **工具函数位置**: `src/utils/index.js`
- **Lodash 导入**: `import { method } from 'lodash'`（命名导入）
- **命名规范**: camelCase、UPPER_SNAKE_CASE、PascalCase

### Skill Validator 配置
- **Skills 目录**: `.claude/skills/`
- **验证标准**: OpenSkills 规范
- **报告格式**: Markdown

### Skill Optimizer 配置
- **优化级别**: conservative（保守）/ moderate（适中）/ aggressive（激进）
- **自动化程度**: semi-auto（半自动，默认）
- **备份位置**: `.claude/skills/[skill-name].backup`

### Component Encapsulation 配置
- **组件目录**: `src/components/`
- **文件结构**: `ComponentName/index.vue`
- **命名规范**: PascalCase（组件文件夹）
- **辅助文件**: `utils.js`, `constants.js`, `hooks.js`, `assets/`

### Frontend Design 配置
- **Skills 目录**: `.cursor/skills/frontend-design/`
- **设计原则**: 独特性、生产级别、美学一致性
- **字体选择**: 避免 Inter、Roboto、Arial、系统字体
- **配色方案**: 避免紫色渐变等陈词滥调
- **布局风格**: 非对称、重叠、对角线、打破网格
- **动效实现**: CSS 动画、微交互、页面加载编排

### UI/UX Pro Max 配置
- **Skills 目录**: `.cursor/skills/ui-ux-pro-max/`
- **数据库**: 67 样式、96 调色板、57 字体配对、99 UX 指南、25 图表类型
- **默认技术栈**: `html-tailwind`
- **设计系统目录**: `design-system/MASTER.md`（主规则）、`design-system/pages/`（页面覆盖）
- **输出格式**: ASCII box（默认）/ Markdown

---

## 📚 参考资源

### Skill 文件结构

```
.cursor/skills/
├── code-optimization/
│   ├── SKILL.md
│   ├── references/
│   │   └── LODASH_PATTERNS.md
│   └── scripts/
├── skill-validator/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
├── skill-optimizer/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
├── component-encapsulation/
│   ├── SKILL.md
│   ├── references/
│   │   ├── SEARCH_FORM_EXAMPLE.md
│   │   ├── DATA_TABLE_EXAMPLE.md
│   │   └── DIALOG_FORM_EXAMPLE.md
│   └── scripts/
├── frontend-design/
│   ├── SKILL.md
│   └── LICENSE.txt
└── ui-ux-pro-max/
    ├── SKILL.md
    ├── data/
    │   ├── stacks/
    │   ├── charts.csv
    │   ├── colors.csv
    │   ├── icons.csv
    │   ├── landing.csv
    │   ├── products.csv
    │   ├── react-performance.csv
    │   ├── styles.csv
    │   ├── typography.csv
    │   ├── ui-reasoning.csv
    │   ├── ux-guidelines.csv
    │   └── web-interface.csv
    └── scripts/
        ├── core.py
        ├── design_system.py
        └── search.py
```

### 扩展阅读
- [Lodash 官方文档](https://lodash.com/docs/)
- [Vue.js 最佳实践](https://vuejs.org/guide/best-practices/)
- [Vue 组件基础](https://vuejs.org/guide/essentials/component-basics.html)
- [Vue 风格指南](https://vuejs.org/style-guide/)
- [Element UI 组件库](https://element.eleme.io/#/zh-CN/component/installation)
- [JavaScript 代码规范](https://github.com/airbnb/javascript)
- [OpenSkills 规范](https://github.com/anthropics/skills)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Heroicons 图标库](https://heroicons.com/)
- [Lucide 图标库](https://lucide.dev/)
- [Simple Icons 品牌图标](https://simpleicons.org/)

---

## 🔄 版本历史

### Code Optimization v1.0.0 (2024-01-26)
- ✨ 初始版本发布
- ✅ 基础代码清理功能
- ✅ Lodash 优化支持
- ✅ Vue 组件优化
- ✅ 错误处理改进

### Skill Validator v1.0.0 (2024-01-26)
- ✨ 初始版本发布
- ✅ 目录结构验证
- ✅ YAML frontmatter 检查
- ✅ Description 质量评估
- ✅ 自动建议优化功能

### Skill Optimizer v1.0.0 (2024-01-26)
- ✨ 初始版本发布
- ✅ 自动清理空目录
- ✅ 修复 YAML frontmatter
- ✅ 优化 description
- ✅ 备份和回滚机制

### Component Encapsulation v1.0.0 (2024-01-26)
- ✨ 初始版本发布
- ✅ 封装场景识别
- ✅ 文件结构规范
- ✅ 组件设计指南
- ✅ 完整实战示例
- ✅ 最佳实践指南

### Frontend Design v1.0.0 (2024-01-26)
- ✨ 初始版本发布
- ✅ 设计思维框架
- ✅ 美学指南（排版、色彩、动效、空间、背景）
- ✅ 独特性原则
- ✅ 避免通用 AI 美学
- ✅ 生产级别代码标准

### UI/UX Pro Max v1.0.0 (2024-01-26)
- ✨ 初始版本发布
- ✅ 综合设计系统生成
- ✅ 67 样式、96 调色板、57 字体配对
- ✅ 99 条 UX 指南、25 种图表类型
- ✅ 13 种技术栈支持
- ✅ 设计系统持久化（主从模式）
- ✅ 交付前检查清单
- ✅ 专业 UI 常见规则

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

**最后更新**: 2026-02-02  
**Skills 总数**: 6  
**遵循规范**: OpenSkills
