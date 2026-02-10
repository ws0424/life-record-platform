#!/bin/bash

echo "🚀 后端项目初始化脚本"
echo "================================"
echo ""

# 检查 Python 版本
echo "📌 检查 Python 版本..."
python3 --version

# 创建虚拟环境（可选）
echo ""
echo "📦 是否创建虚拟环境？(y/n)"
read -r create_venv
if [ "$create_venv" = "y" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
    echo "激活虚拟环境..."
    source venv/bin/activate
fi

# 安装依赖
echo ""
echo "📥 安装依赖包..."
pip3 install -r requirements.txt

# 创建 .env 文件
echo ""
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，配置数据库、Redis 和邮件服务"
else
    echo "✅ .env 文件已存在"
fi

# 检查 PostgreSQL
echo ""
echo "🔍 检查 PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL 已安装"
else
    echo "⚠️  PostgreSQL 未安装"
    echo "   使用 Docker 启动: docker run -d --name postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=utils_web -p 5432:5432 postgres:15"
fi

# 检查 Redis
echo ""
echo "🔍 检查 Redis..."
if command -v redis-cli &> /dev/null; then
    echo "✅ Redis 已安装"
else
    echo "⚠️  Redis 未安装"
    echo "   使用 Docker 启动: docker run -d --name redis -p 6379:6379 redis:7"
fi

echo ""
echo "================================"
echo "✅ 初始化完成！"
echo ""
echo "📖 下一步："
echo "   1. 编辑 .env 文件配置数据库和邮件服务"
echo "   2. 启动 PostgreSQL 和 Redis"
echo "   3. 运行: python3 main.py"
echo ""

