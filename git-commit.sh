#!/bin/bash

# Git 自动提交脚本
# 使用方法: ./git-commit.sh "提交信息"

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否提供了提交信息
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供提交信息${NC}"
    echo "使用方法: ./git-commit.sh \"提交信息\""
    echo ""
    echo "提交信息格式建议:"
    echo "  feat: 新功能"
    echo "  fix: 修复bug"
    echo "  docs: 文档更新"
    echo "  style: 代码格式"
    echo "  refactor: 重构"
    echo "  test: 测试"
    echo "  chore: 构建/工具"
    exit 1
fi

COMMIT_MSG="$1"

echo -e "${YELLOW}开始 Git 提交流程...${NC}"
echo ""

# 检查是否是 Git 仓库
if [ ! -d .git ]; then
    echo -e "${YELLOW}初始化 Git 仓库...${NC}"
    git init
    git branch -M main
    git remote add origin https://github.com/ws0424/life-record-platform.git
    echo -e "${GREEN}✓ Git 仓库初始化完成${NC}"
    echo ""
fi

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}没有需要提交的更改${NC}"
    exit 0
fi

# 显示当前状态
echo -e "${YELLOW}当前更改:${NC}"
git status --short
echo ""

# 添加所有更改
echo -e "${YELLOW}添加文件到暂存区...${NC}"
git add .
echo -e "${GREEN}✓ 文件已添加${NC}"
echo ""

# 提交更改
echo -e "${YELLOW}提交更改...${NC}"
git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✓ 提交完成${NC}"
echo ""

# 推送到远程仓库
echo -e "${YELLOW}推送到远程仓库...${NC}"
if git push origin main 2>/dev/null; then
    echo -e "${GREEN}✓ 推送成功${NC}"
else
    echo -e "${YELLOW}首次推送，使用 -u 参数...${NC}"
    git push -u origin main
    echo -e "${GREEN}✓ 推送成功${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Git 提交流程完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "提交信息: $COMMIT_MSG"
echo "远程仓库: https://github.com/ws0424/life-record-platform.git"

