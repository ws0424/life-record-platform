# Git Auto Commit Skill - 参考文档

## Conventional Commits 规范

### 基本格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type 类型详解

#### feat (新功能)
用于新增功能或特性。

**示例：**
```
feat: 添加用户注册功能
feat(auth): 实现 OAuth2 登录
feat(ui): 新增深色模式
```

#### fix (修复)
用于修复 bug。

**示例：**
```
fix: 修复登录失败问题
fix(api): 修复数据返回格式错误
fix(ui): 修复按钮点击无响应
```

#### docs (文档)
仅文档更改。

**示例：**
```
docs: 更新 README
docs(api): 完善 API 文档
docs: 添加部署指南
```

#### style (样式)
不影响代码含义的更改（空格、格式化、缺少分号等）。

**示例：**
```
style: 格式化代码
style(css): 优化按钮样式
style: 统一代码缩进
```

#### refactor (重构)
既不修复 bug 也不添加功能的代码更改。

**示例：**
```
refactor: 重构用户服务
refactor(db): 优化数据库查询
refactor: 提取公共组件
```

#### perf (性能)
提高性能的代码更改。

**示例：**
```
perf: 优化图片加载速度
perf(db): 添加数据库索引
perf: 减少 API 调用次数
```

#### test (测试)
添加缺失的测试或更正现有测试。

**示例：**
```
test: 添加用户登录测试
test(api): 完善 API 单元测试
test: 增加测试覆盖率
```

#### chore (构建)
构建过程或辅助工具的变动。

**示例：**
```
chore: 更新依赖包
chore(deps): 升级 React 到 18.2
chore: 配置 ESLint
```

#### ci (CI/CD)
持续集成相关的更改。

**示例：**
```
ci: 添加 GitHub Actions
ci: 优化构建流程
ci: 配置自动部署
```

### Scope 范围

Scope 是可选的，用于说明 commit 影响的范围。

**前端常用 scope：**
- `ui`: UI 组件
- `page`: 页面
- `api`: API 调用
- `store`: 状态管理
- `router`: 路由
- `style`: 样式
- `hook`: 自定义 Hook

**后端常用 scope：**
- `auth`: 认证授权
- `user`: 用户模块
- `post`: 内容模块
- `comment`: 评论模块
- `media`: 媒体处理
- `db`: 数据库
- `api`: API 接口
- `service`: 业务服务

**通用 scope：**
- `config`: 配置
- `deps`: 依赖
- `docker`: Docker
- `docs`: 文档
- `test`: 测试

### Description 描述

描述是对变更的简短说明。

**规则：**
- 使用中文
- 使用动词开头
- 第一个字母小写
- 结尾不加句号
- 简洁明了（建议 50 字以内）

**好的示例：**
- ✅ 添加用户登录功能
- ✅ 修复图片上传失败问题
- ✅ 优化数据库查询性能
- ✅ 重构用户服务层代码

**不好的示例：**
- ❌ 更新（太模糊）
- ❌ 修改了一些代码（不具体）
- ❌ Fix bug（应该用中文）
- ❌ 添加功能。（不要句号）

### Body 正文

Body 是可选的，用于详细说明变更内容。

**格式：**
- 与 description 之间空一行
- 可以分多行
- 说明变更的原因和内容
- 可以使用列表

**示例：**
```
feat(auth): 添加用户登录功能

实现内容：
- 创建登录页面组件
- 实现登录 API 接口
- 添加 JWT 认证逻辑
- 添加密码加密存储

技术细节：
- 使用 Ant Design Form 组件
- 使用 bcrypt 加密密码
- Token 有效期设置为 7 天
```

### Footer 页脚

Footer 是可选的，用于关联 Issue 或说明破坏性变更。

**关联 Issue：**
```
Closes #123
Fixes #456
Resolves #789
```

**破坏性变更：**
```
BREAKING CHANGE: API 接口路径变更

原路径: /api/users
新路径: /api/v1/users
```

### 完整示例

#### 示例 1: 新增功能

```
feat(auth): 添加用户登录功能

实现内容：
- 创建登录页面组件 (frontend/src/app/login/page.tsx)
- 实现登录 API 接口 (backend/app/api/v1/endpoints/auth.py)
- 添加 JWT 认证逻辑
- 添加密码加密存储

技术细节：
- 使用 Ant Design Form 组件
- 使用 bcrypt 加密密码
- Token 有效期设置为 7 天

Closes #123
```

#### 示例 2: 修复 Bug

```
fix(media): 修复图片上传失败问题

问题描述：
上传大于 10MB 的图片时会失败

修复内容：
- 修正文件大小验证逻辑
- 增加文件大小限制到 50MB
- 添加错误提示信息
- 优化上传进度显示

Fixes #456
```

#### 示例 3: 性能优化

```
perf(db): 优化数据库查询性能

优化内容：
- 为 posts 表添加索引
- 优化 N+1 查询问题
- 使用 Redis 缓存热点数据

性能提升：
- 查询速度提升 60%
- 响应时间从 500ms 降低到 200ms
```

#### 示例 4: 重构

```
refactor(user): 重构用户服务层

重构内容：
- 提取公共方法到 BaseService
- 优化错误处理逻辑
- 简化代码结构
- 提高代码可读性

注意：
此次重构不影响现有功能
```

## Git 工作流程

### 基本流程

```bash
# 1. 查看状态
git status

# 2. 添加文件
git add .

# 3. 提交
git commit -m "feat: 添加新功能"

# 4. 推送
git push origin main
```

### 分支管理

```bash
# 创建并切换到新分支
git checkout -b feature/user-login

# 开发完成后合并到主分支
git checkout main
git merge feature/user-login

# 删除分支
git branch -d feature/user-login
```

### 常用命令

```bash
# 查看提交历史
git log --oneline

# 查看某个文件的修改历史
git log -p filename

# 撤销工作区的修改
git checkout -- filename

# 撤销暂存区的修改
git reset HEAD filename

# 修改最后一次提交
git commit --amend

# 回滚到指定提交
git reset --hard commit-hash
```

## 最佳实践

### 1. 提交频率

- 完成一个小功能就提交
- 修复一个 bug 就提交
- 每天至少提交一次
- 不要积累太多修改

### 2. 提交粒度

- 每次提交只做一件事
- 相关的修改放在一起
- 不要把多个功能混在一起

### 3. 提交信息

- 清晰描述做了什么
- 说明为什么这样做
- 提供必要的上下文
- 不要写无意义的信息

### 4. 代码审查

提交前检查：
- 代码格式正确
- 没有调试代码
- 没有敏感信息
- 测试通过

### 5. 分支策略

- `main`: 主分支，稳定版本
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `hotfix/*`: 紧急修复分支

## 工具推荐

### 1. Commitizen

交互式生成 commit message。

```bash
npm install -g commitizen
commitizen init cz-conventional-changelog --save-dev --save-exact
```

### 2. Commitlint

检查 commit message 是否符合规范。

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### 3. Husky

Git hooks 工具。

```bash
npm install --save-dev husky
npx husky install
```

### 4. Conventional Changelog

自动生成 CHANGELOG。

```bash
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

