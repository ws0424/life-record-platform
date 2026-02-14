#!/bin/bash

# 生活小工具 API 测试脚本

echo "🧪 开始测试生活小工具 API..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 测试结果统计
PASSED=0
FAILED=0

# 测试函数
test_api() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    
    echo -n "测试 $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
        echo -e "${GREEN}✓ 通过${NC} (HTTP $http_code)"
        ((PASSED++))
    else
        echo -e "${RED}✗ 失败${NC} (HTTP $http_code)"
        ((FAILED++))
    fi
}

# 测试健康检查
test_api "健康检查" "http://localhost:8000/health"

# 测试 API 文档
test_api "API 文档" "http://localhost:8000/docs"

# 测试工具 API（需要认证，预期返回 401）
echo ""
echo "📋 测试工具 API（需要认证）..."
test_api "倒计时列表" "http://localhost:8000/api/v1/tools/countdown"
test_api "待办列表" "http://localhost:8000/api/v1/tools/todo"
test_api "待办统计" "http://localhost:8000/api/v1/tools/todo/stats"
test_api "记账列表" "http://localhost:8000/api/v1/tools/expense"
test_api "记账统计" "http://localhost:8000/api/v1/tools/expense/stats"
test_api "习惯列表" "http://localhost:8000/api/v1/tools/habit"
test_api "笔记列表" "http://localhost:8000/api/v1/tools/note"

# 测试前端页面
echo ""
echo "🌐 测试前端页面..."
test_api "工具首页" "http://localhost:3000/tools"
test_api "倒计时页面" "http://localhost:3000/tools/countdown"
test_api "待办清单页面" "http://localhost:3000/tools/todo"
test_api "记账本页面" "http://localhost:3000/tools/expense"

# 输出测试结果
echo ""
echo "================================"
echo "测试完成！"
echo "通过: ${GREEN}$PASSED${NC}"
echo "失败: ${RED}$FAILED${NC}"
echo "总计: $((PASSED + FAILED))"
echo "================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有测试失败${NC}"
    exit 1
fi


