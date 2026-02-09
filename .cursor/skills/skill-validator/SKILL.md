---
name: skill-validator
description: Skill 验证工具。当用户说"检查skill"、"验证skill"、"validate skill"或"check skill"时使用此技能。自动检查 .cursor/skills 目录中的 skills 是否符合 OpenSkills 标准，包括目录结构、文件命名、YAML frontmatter 格式、description 完整性、文件组织和资源引用等。检查完成后，如果发现问题，会自动建议使用 skill-optimizer 进行优化修复。适用于确保项目中的 skills 符合规范。
---

# Skill 验证工具

自动检查 `.cursor/skills` 目录中的 skills 是否符合 OpenSkills 标准规范。检查完成后，如果发现问题，会自动建议调用 skill-optimizer 进行优化。

## 快速开始

当用户请求检查 skill 时：

1. **扫描 skills 目录** - 列出所有 skill 文件夹
2. **验证每个 skill** - 检查结构、命名、格式
3. **生成报告** - 列出所有问题和建议
4. **提供修复建议** - 给出具体的修复方案
5. **建议优化** - 如果发现问题，建议使用 skill-optimizer 自动修复

## 验证标准

### 1. 目录结构

**必需结构：**
```
./skills/
└── skill-name/
    ├── SKILL.md          ✅ 必需（主文档）
    ├── references/       ⚠️ 可选（参考文档）
    ├── scripts/          ⚠️ 可选（可执行脚本）
    └── assets/           ⚠️ 可选（输出资源）
```

**检查项：**
- ✅ skill 文件夹名称使用 kebab-case（如 `code-optimization`）
- ✅ 必须包含 `SKILL.md` 文件（大写）
- ✅ 可选目录：`references/`、`scripts/`、`assets/`
- ❌ 不应包含：`README.md`、`CHANGELOG.md`、`INSTALLATION_GUIDE.md` 等额外文档

### 2. SKILL.md 格式

**必需的 YAML Frontmatter：**
```yaml
---
name: skill-name
description: 详细描述，包含"做什么"和"何时使用"
---
```

**检查项：**
- ✅ 必须有 YAML frontmatter（`---` 包围）
- ✅ 必须包含 `name` 字段
- ✅ 必须包含 `description` 字段
- ✅ `name` 应与文件夹名称一致
- ✅ `description` 应该详细且包含触发条件
- ❌ 不应包含其他字段（如 `version`、`author`、`tags` 等）

### 3. Description 质量

**好的 description 应该包含：**
1. **功能说明** - 这个 skill 做什么
2. **触发条件** - 何时使用这个 skill
3. **具体场景** - 列举使用场景或关键词

**示例：**
```yaml
# ✅ 好的 description
description: 代码检查与优化工具。当用户说"检查代码"、"优化代码"、"code review"、"optimize code"或"clean code"时使用此技能。自动清理无效代码（console语句、未使用的导入/变量/方法）、优先使用lodash方法库优化代码、改进错误处理、统一代码规范（ES6+、模板字符串、可选链等）、优化Vue组件性能。适用于JavaScript/Vue.js项目的代码质量提升。

# ❌ 差的 description
description: 代码优化工具
```

### 4. 文件组织

**references/ 目录：**
- 用于存放参考文档（按需加载）
- 文件应使用大写（如 `LODASH_PATTERNS.md`）
- 应在 SKILL.md 中引用

**scripts/ 目录：**
- 用于存放可执行脚本
- 应该是实际可运行的代码
- 文件名应清晰表明用途

**assets/ 目录：**
- 用于存放输出资源（模板、图片等）
- 不应被加载到上下文中
- 用于最终输出

### 5. 内容质量

**SKILL.md 应该包含：**
- ✅ 清晰的功能说明
- ✅ 使用示例
- ✅ 工作流程说明
- ✅ 最佳实践
- ⚠️ 保持简洁（建议 <500 行）

**不应该包含：**
- ❌ 过于冗长的说明
- ❌ 重复的内容
- ❌ 应该在 references/ 中的详细文档

## 验证流程

### 步骤 1：扫描目录
```bash
# 列出所有 skill 目录
ls -d .cursor/skills/*/
```

### 步骤 2：检查每个 Skill

对每个 skill 执行以下检查：

1. **目录结构检查**
   - 检查 SKILL.md 是否存在
   - 检查目录命名是否符合规范
   - 检查是否有不应该存在的文件

2. **YAML Frontmatter 检查**
   - 解析 YAML frontmatter
   - 验证必需字段
   - 检查字段格式

3. **Description 质量检查**
   - 检查长度（建议 >100 字符）
   - 检查是否包含触发条件
   - 检查是否包含功能说明

4. **文件引用检查**
   - 检查 SKILL.md 中引用的文件是否存在
   - 检查 references/ 中的文件是否被引用

### 步骤 3：生成报告

生成详细的验证报告：

```markdown
## 🔍 Skill 验证报告

### 扫描结果
- 总 Skills 数：X
- 通过验证：X
- 存在问题：X

---

### ✅ code-optimization
**状态：通过**
- 目录结构：✅ 正确
- SKILL.md：✅ 存在
- YAML Frontmatter：✅ 完整
- Description：✅ 详细（245 字符）
- 文件组织：✅ 规范

---

### ⚠️ example-skill
**状态：存在问题**

#### 高优先级问题
- ❌ 缺少 SKILL.md 文件
- ❌ YAML frontmatter 缺少 description 字段

#### 中优先级问题
- ⚠️ Description 过短（仅 20 字符）
- ⚠️ 存在不应该有的 README.md 文件

#### 建议
1. 创建 SKILL.md 文件
2. 添加完整的 YAML frontmatter
3. 完善 description，包含触发条件和使用场景
4. 删除 README.md 文件

---

### 验证摘要
- 高优先级问题：X
- 中优先级问题：X
- 低优先级问题：X

---

## 💡 下一步操作

### 如果发现问题
建议使用 **skill-optimizer** 自动修复：
```
优化skill
```

### 如果全部通过
恭喜！所有 skills 都符合标准 ✅
```

### 步骤 4：提供修复建议

对每个问题提供具体的修复方案：

```markdown
## 🔧 修复建议

### code-optimization
无需修复，符合所有标准 ✅

### example-skill

#### 问题 1：缺少 SKILL.md
**修复方案：**
创建 `.cursor/skills/example-skill/SKILL.md` 文件，包含：
```yaml
---
name: example-skill
description: [详细描述]
---

# Skill 名称

[内容]
```

#### 问题 2：Description 过短
**当前：**
```yaml
description: 示例工具
```

**建议改为：**
```yaml
description: 示例工具。当用户说"xxx"时使用此技能。提供xxx功能，包括xxx、xxx等。适用于xxx场景。
```
```

### 步骤 5：建议自动优化

如果发现问题，在报告末尾建议使用 skill-optimizer：

```markdown
---

## 💡 自动优化建议

检测到 **X 个 skills** 存在问题，可以使用 **skill-optimizer** 自动修复：

### 快速修复
```
优化skill
```
这将自动修复所有检测到的问题。

### 针对特定 skill 修复
```
优化skill example-skill
```

### 修复内容预览
skill-optimizer 将自动执行以下操作：
- ✅ 清理 2 个空目录
- ✅ 删除 1 个不规范文件
- ✅ 扩展 1 个过短的 description
- ✅ 修复 3 个 frontmatter 问题

**建议：** 先查看详细的验证报告，确认问题后再执行优化。
```

## 检查清单

使用以下清单验证 skill：

### 目录结构 ✅
- [ ] skill 文件夹名称使用 kebab-case
- [ ] 包含 SKILL.md 文件（大写）
- [ ] 可选目录命名正确（references/、scripts/、assets/）
- [ ] 没有额外的文档文件（README.md 等）

### SKILL.md 格式 ✅
- [ ] 包含 YAML frontmatter
- [ ] frontmatter 有 `name` 字段
- [ ] frontmatter 有 `description` 字段
- [ ] `name` 与文件夹名称一致
- [ ] 没有多余的 frontmatter 字段

### Description 质量 ✅
- [ ] 长度 >100 字符
- [ ] 包含功能说明
- [ ] 包含触发条件（"当用户说..."）
- [ ] 包含使用场景
- [ ] 清晰且具体

### 内容质量 ✅
- [ ] 有清晰的功能说明
- [ ] 有使用示例
- [ ] 有工作流程说明
- [ ] 内容简洁（<500 行）
- [ ] 详细内容放在 references/ 中

### 文件组织 ✅
- [ ] references/ 中的文件被 SKILL.md 引用
- [ ] scripts/ 中的脚本可执行
- [ ] assets/ 用于输出资源
- [ ] 文件命名清晰

## 常见问题

### 问题 1：SKILL.md vs README.md
**错误：** 创建 README.md 而不是 SKILL.md
**正确：** 必须使用 SKILL.md（大写）

### 问题 2：过多的 frontmatter 字段
**错误：**
```yaml
---
name: skill-name
version: 1.0.0
author: Someone
tags: [tag1, tag2]
description: xxx
---
```

**正确：**
```yaml
---
name: skill-name
description: xxx
---
```

### 问题 3：Description 过于简单
**错误：**
```yaml
description: 代码优化工具
```

**正确：**
```yaml
description: 代码检查与优化工具。当用户说"检查代码"、"优化代码"时使用。自动清理无效代码、使用lodash优化、改进错误处理。适用于JavaScript/Vue.js项目。
```

### 问题 4：额外的文档文件
**错误：** 创建 README.md、CHANGELOG.md、INSTALLATION_GUIDE.md
**正确：** 只保留 SKILL.md，所有内容都在其中或 references/ 中

### 问题 5：文件夹命名不规范
**错误：** `CodeOptimization/`、`code_optimization/`、`codeOptimization/`
**正确：** `code-optimization/`（kebab-case）

## 自动化验证

可以使用以下命令快速检查：

```bash
# 检查所有 skills
for dir in .cursor/skills/*/; do
  skill_name=$(basename "$dir")
  echo "检查: $skill_name"
  
  # 检查 SKILL.md
  if [ ! -f "$dir/SKILL.md" ]; then
    echo "  ❌ 缺少 SKILL.md"
  else
    echo "  ✅ SKILL.md 存在"
  fi
  
  # 检查 frontmatter
  if grep -q "^---$" "$dir/SKILL.md" 2>/dev/null; then
    echo "  ✅ 包含 frontmatter"
  else
    echo "  ❌ 缺少 frontmatter"
  fi
done
```

## 最佳实践

### 应该做 ✅
- 使用清晰的 skill 名称（kebab-case）
- 编写详细的 description（包含触发条件）
- 保持 SKILL.md 简洁（<500 行）
- 将详细内容放在 references/ 中
- 在 SKILL.md 中引用 references/ 文件
- 使用示例说明用法

### 不应该做 ❌
- 创建额外的文档文件（README.md 等）
- 在 frontmatter 中添加多余字段
- 编写过于简单的 description
- 在 SKILL.md 中放置过多详细内容
- 使用不规范的命名

## 验证示例

### 示例 1：完全符合标准的 Skill

```
code-optimization/
├── SKILL.md                    ✅ 存在且格式正确
├── references/
│   └── LODASH_PATTERNS.md     ✅ 被 SKILL.md 引用
└── scripts/                    ✅ 预留目录
```

**SKILL.md frontmatter：**
```yaml
---
name: code-optimization
description: 代码检查与优化工具。当用户说"检查代码"、"优化代码"、"code review"、"optimize code"或"clean code"时使用此技能。自动清理无效代码（console语句、未使用的导入/变量/方法）、优先使用lodash方法库优化代码、改进错误处理、统一代码规范（ES6+、模板字符串、可选链等）、优化Vue组件性能。适用于JavaScript/Vue.js项目的代码质量提升。
---
```

**验证结果：** ✅ 完全通过

### 示例 2：存在问题的 Skill

```
bad-skill/
├── README.md                   ❌ 不应该存在
├── SKILL.md                    ⚠️ 存在但有问题
└── docs/                       ❌ 不规范的目录名
    └── guide.md
```

**SKILL.md frontmatter：**
```yaml
---
name: bad-skill
version: 1.0.0                  ❌ 多余字段
author: Someone                 ❌ 多余字段
description: 工具                ❌ 过于简单
---
```

**验证结果：** ❌ 存在多个问题

**需要修复：**
1. 删除 README.md
2. 删除 frontmatter 中的 version 和 author
3. 完善 description
4. 重命名 docs/ 为 references/

## 注意事项

1. **严格遵循命名规范** - 文件夹和文件名必须符合标准
2. **Description 是关键** - 这是 skill 触发的主要依据
3. **保持简洁** - SKILL.md 应该简洁，详细内容放 references/
4. **引用完整** - 确保所有引用的文件都存在
5. **定期验证** - 添加或修改 skill 后都应该验证
6. **配合优化** - 发现问题后使用 skill-optimizer 自动修复

## 与 Skill Optimizer 协同

skill-validator 和 skill-optimizer 是配套使用的：

### 标准工作流

```
┌─────────────────────────────────────┐
│  1. 检查skill (skill-validator)      │
│     ↓                                │
│  2. 发现问题                         │
│     ↓                                │
│  3. 优化skill (skill-optimizer)      │
│     ↓                                │
│  4. 再次检查skill                    │
│     ↓                                │
│  5. ✅ 通过验证                      │
└─────────────────────────────────────┘
```

### 自动化建议

当 skill-validator 检测到问题时，会自动：
1. **列出所有问题** - 详细的问题清单
2. **提供修复建议** - 具体的修复方案
3. **建议使用 optimizer** - 推荐自动修复命令
4. **预览修复内容** - 说明将执行的操作

### 示例对话

```
用户: 检查skill
AI: 🔍 验证报告
    - code-optimization: ✅ 通过
    - skill-validator: ⚠️ 2 个问题
    - skill-optimizer: ⚠️ 2 个问题
    
    💡 建议：使用 "优化skill" 自动修复所有问题

用户: 优化skill
AI: 🔧 正在优化...
    ✅ 已修复 4 个问题
    
    建议再次运行 "检查skill" 验证结果

用户: 检查skill
AI: ✅ 所有 skills 都符合标准！
```

## 输出格式

验证报告使用以下格式：

```markdown
## 🔍 Skill 验证报告

生成时间：2024-01-26 14:30:00

### 📊 总体统计
- 总 Skills 数：2
- ✅ 通过验证：1
- ⚠️ 存在问题：1
- ❌ 严重问题：0

---

### 详细报告

#### ✅ code-optimization
**状态：通过所有检查**

检查项：
- ✅ 目录结构正确
- ✅ SKILL.md 存在
- ✅ YAML frontmatter 完整
- ✅ Description 详细（245 字符）
- ✅ 文件组织规范
- ✅ 引用完整

---

#### ⚠️ skill-validator
**状态：存在 2 个问题**

检查项：
- ✅ 目录结构正确
- ✅ SKILL.md 存在
- ✅ YAML frontmatter 完整
- ✅ Description 详细（198 字符）
- ⚠️ references/ 目录为空
- ⚠️ scripts/ 目录为空

建议：
1. 如果不需要 references/ 和 scripts/，可以删除空目录
2. 或者添加相应的文件

---

### 🎯 改进建议

总体来说，项目中的 skills 质量良好。建议：
1. 清理空目录
2. 保持 description 的详细性
3. 定期验证 skills 规范

---

## 💡 自动优化建议

检测到 **1 个 skill** 存在问题，可以使用 **skill-optimizer** 自动修复：

### 快速修复所有问题
```
优化skill
```

### 针对特定 skill 修复
```
优化skill skill-validator
```

### 将执行的操作
- ✅ 清理 skill-validator 的 2 个空目录

**建议：** 执行优化后，再次运行 `检查skill` 验证修复结果。

---

## 🔄 推荐工作流

```
1. 检查skill (当前步骤)
   ↓
2. 查看验证报告
   ↓
3. 优化skill (如果有问题)
   ↓
4. 再次检查skill
   ↓
5. ✅ 确认通过
```
```

