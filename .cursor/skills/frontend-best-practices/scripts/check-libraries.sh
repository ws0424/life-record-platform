#!/bin/bash

echo "🔍 检查第三方库使用规范..."
cd frontend 2>/dev/null || exit 1

# 颜色定义
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

PASS=0
WARN=0
ERROR=0

echo ""
echo "1️⃣  检查 Ant Design 使用..."

# 检查是否导入整个 antd
FULL_IMPORT=$(grep -r "import antd from 'antd'" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$FULL_IMPORT" -gt 0 ]; then
    echo -e "${RED}   ❌ 发现导入整个 antd 库${NC}"
    ERROR=$((ERROR + 1))
else
    echo -e "${GREEN}   ✅ 按需导入 antd 组件${NC}"
    PASS=$((PASS + 1))
fi

# 检查 Table rowKey
MISSING_ROWKEY=$(grep -r "<Table" src --include="*.tsx" 2>/dev/null | grep -v "rowKey" | wc -l)
if [ "$MISSING_ROWKEY" -gt 0 ]; then
    echo -e "${YELLOW}   ⚠️  发现 $MISSING_ROWKEY 个 Table 缺少 rowKey${NC}"
    WARN=$((WARN + 1))
else
    echo -e "${GREEN}   ✅ Table 组件使用规范${NC}"
    PASS=$((PASS + 1))
fi

echo ""
echo "2️⃣  检查 Day.js 使用..."

# 检查是否混用 Date
MIXED_DATE=$(grep -r "new Date()" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$MIXED_DATE" -gt 0 ]; then
    echo -e "${YELLOW}   ⚠️  发现 $MIXED_DATE 处使用 new Date()${NC}"
    WARN=$((WARN + 1))
else
    echo -e "${GREEN}   ✅ 统一使用 Day.js${NC}"
    PASS=$((PASS + 1))
fi

echo ""
echo "3️⃣  检查 Lodash 使用..."

# 检查是否导入整个 lodash
FULL_LODASH=$(grep -r "import _ from 'lodash'" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$FULL_LODASH" -gt 0 ]; then
    echo -e "${RED}   ❌ 发现导入整个 lodash 库${NC}"
    ERROR=$((ERROR + 1))
else
    echo -e "${GREEN}   ✅ 按需导入 lodash 函数${NC}"
    PASS=$((PASS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 检查结果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ 通过: $PASS 项${NC}"
echo -e "${YELLOW}⚠️  警告: $WARN 项${NC}"
echo -e "${RED}❌ 错误: $ERROR 项${NC}"
echo ""

if [ "$ERROR" -gt 0 ]; then
    echo -e "${RED}❌ 发现错误，请修复后再提交${NC}"
    exit 1
elif [ "$WARN" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  发现警告，建议优化${NC}"
    exit 0
else
    echo -e "${GREEN}✅ 所有检查通过！${NC}"
    exit 0
fi

